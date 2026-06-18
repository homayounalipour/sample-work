'use server';

import {translateTexts as translateWithMyMemory} from '@/lib/translation/mymemory';

export async function translateTexts(
  texts: string[],
  source: string,
  target: string,
): Promise<string[]> {
  return translateWithMyMemory(texts, source, target);
}
