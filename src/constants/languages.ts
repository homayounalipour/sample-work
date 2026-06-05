import type {LanguageOption} from '@/kit/LanguageSelector';

export const LANGUAGES: LanguageOption[] = [
  {code: 'fa', name: 'Persian', flag: '🇮🇷'},
  {code: 'en', name: 'English', flag: '🇺🇸'},
  {code: 'ko', name: 'Korean', flag: '🇰🇷'},
  {code: 'ja', name: 'Japanese', flag: '🇯🇵'},
  {code: 'zh', name: 'Chinese', flag: '🇨🇳'},
  {code: 'ar', name: 'Arabic', flag: '🇸🇦'},
  {code: 'fr', name: 'French', flag: '🇫🇷'},
  {code: 'de', name: 'German', flag: '🇩🇪'},
];

export function getLanguageByCode(code: string): LanguageOption {
  return LANGUAGES.find(l => l.code === code) ?? LANGUAGES[1];
}
