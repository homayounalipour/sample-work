import axios from 'axios';
import type {
  TranslationProvider,
  TranslationProviderId,
  ProviderOption,
} from '@/lib/providers/types';

const API_URL = 'https://api.mymemory.translated.net/get';

type MyMemoryResponse = {
  responseStatus: number;
  responseDetails: string;
  quotaFinished?: boolean;
  responseData: {
    translatedText: string;
  };
};

const LANG_TO_API: Record<string, string> = {
  zh: 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-TW',
  'pt-BR': 'pt-BR',
};

function toApiLang(code: string): string {
  return LANG_TO_API[code] ?? code;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateOne(
  text: string,
  source: string,
  target: string,
): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL?.trim();

  const {data} = await axios.get<MyMemoryResponse>(API_URL, {
    params: {
      q: text,
      langpair: `${toApiLang(source)}|${toApiLang(target)}`,
      ...(email ? {de: email} : {}),
    },
    timeout: 30_000,
  });

  if (data.quotaFinished) {
    throw new Error(
      'Daily translation limit reached. Add MYMEMORY_EMAIL to .env.local for a higher limit.',
    );
  }

  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'Translation failed');
  }

  return data.responseData.translatedText.trim();
}

async function translateWithMyMemory(
  texts: string[],
  source: string,
  target: string,
  batchDelayMs = 0,
): Promise<string[]> {
  const results: string[] = [];

  for (const [index, text] of texts.entries()) {
    if (index > 0 && batchDelayMs > 0) {
      await delay(batchDelayMs);
    }

    results.push(await translateOne(text, source, target));
  }

  return results;
}

export const mymemoryProvider: TranslationProvider = {
  id: 'mymemory',
  name: 'MyMemory',
  description: 'Free translation API with a daily quota.',
  translate: (texts, source, target) =>
    translateWithMyMemory(texts, source, target),
};

export async function translateWithMyMemoryProvider(
  texts: string[],
  source: string,
  target: string,
  batchDelayMs = 0,
): Promise<string[]> {
  return translateWithMyMemory(texts, source, target, batchDelayMs);
}

const TRANSLATION_PROVIDERS: Record<
  TranslationProviderId,
  TranslationProvider
> = {
  mymemory: mymemoryProvider,
};

export const TRANSLATION_PROVIDER_OPTIONS: ProviderOption<TranslationProviderId>[] =
  Object.values(TRANSLATION_PROVIDERS).map(provider => ({
    id: provider.id,
    name: provider.name,
    description: provider.description,
  }));

export function getTranslationProvider(
  id: TranslationProviderId = 'mymemory',
): TranslationProvider {
  const provider = TRANSLATION_PROVIDERS[id];
  if (!provider) {
    throw new Error(`Unknown translation provider: ${id}`);
  }

  return provider;
}

export function listTranslationProviders(): TranslationProvider[] {
  return Object.values(TRANSLATION_PROVIDERS);
}
