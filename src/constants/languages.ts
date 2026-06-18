import type {LanguageOption} from '@/kit/LanguageSelector';
import {getLanguageFlag} from '@/lib/languages/flags';

const LANGUAGE_DEFS = [
  {code: 'en', name: 'English'},
  {code: 'fa', name: 'Persian'},
  {code: 'ja', name: 'Japanese'},
  {code: 'ko', name: 'Korean'},
  {code: 'ar', name: 'Arabic'},
  {code: 'de', name: 'German'},
  {code: 'fr', name: 'French'},
  {code: 'es', name: 'Spanish'},
  {code: 'it', name: 'Italian'},
  {code: 'zh', name: 'Chinese'},
  {code: 'ru', name: 'Russian'},
  {code: 'tr', name: 'Turkish'},
  {code: 'pt', name: 'Portuguese'},
  {code: 'hi', name: 'Hindi'},
  {code: 'nl', name: 'Dutch'},
  {code: 'pl', name: 'Polish'},
] as const;

const ALL_CODES = LANGUAGE_DEFS.map(language => language.code);

export const SUPPORTED_LANGUAGES: LanguageOption[] = LANGUAGE_DEFS.map(
  language => ({
    code: language.code,
    name: language.name,
    flag: getLanguageFlag(language.code),
    targets: ALL_CODES.filter(code => code !== language.code),
  }),
);

const CODE_ALIASES: Record<string, string[]> = {
  zh: ['zh-Hans', 'zh'],
  'zh-Hans': ['zh', 'zh-Hans'],
  'zh-Hant': ['zh', 'zh-Hant'],
};

function codeCandidates(code: string): string[] {
  const aliases = CODE_ALIASES[code] ?? [];
  return [code, ...aliases];
}

function findByCodes(
  languages: LanguageOption[],
  codes: string[],
): LanguageOption | undefined {
  for (const code of codes) {
    const match = languages.find(language => language.code === code);
    if (match) return match;
  }

  return undefined;
}

export function getLanguageByCode(
  languages: LanguageOption[],
  code: string,
  fallbackCode = 'en',
): LanguageOption {
  return (
    findByCodes(languages, codeCandidates(code)) ??
    findByCodes(languages, codeCandidates(fallbackCode)) ??
    languages[0] ?? {
      code,
      name: code,
      flag: '🌐',
    }
  );
}

export function getAlternateLanguage(
  languages: LanguageOption[],
  excludeCode: string,
  sourceLang?: LanguageOption,
): LanguageOption {
  const pool = getTargetLanguages(
    languages,
    sourceLang ?? {code: '', name: ''},
  );

  return (
    pool.find(language => language.code !== excludeCode) ??
    languages.find(language => language.code !== excludeCode) ??
    getLanguageByCode(languages, 'en')
  );
}

export function getTargetLanguages(
  languages: LanguageOption[],
  sourceLang: LanguageOption,
): LanguageOption[] {
  if (!sourceLang.targets?.length) {
    return languages;
  }

  const allowed = new Set(sourceLang.targets);
  return languages.filter(language => allowed.has(language.code));
}

export const DEFAULT_SOURCE_CODE = 'en';
export const DEFAULT_TARGET_CODE = 'fa';
