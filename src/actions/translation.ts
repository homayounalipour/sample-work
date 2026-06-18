'use server';

import {getServerConfig} from '@/lib/config/server';
import {
  getTranslationProvider,
  translateWithMyMemoryProvider,
} from '@/lib/translation/providers';
import type {TranslationProviderId} from '@/lib/providers/types';

export async function translateTexts(
  texts: string[],
  source: string,
  target: string,
  providerId?: TranslationProviderId,
): Promise<string[]> {
  const config = getServerConfig();
  const resolvedProviderId = providerId ?? config.translation.provider;

  if (resolvedProviderId === 'mymemory') {
    return translateWithMyMemoryProvider(
      texts,
      source,
      target,
      config.translation.batchDelayMs,
    );
  }

  return getTranslationProvider(resolvedProviderId).translate(
    texts,
    source,
    target,
  );
}
