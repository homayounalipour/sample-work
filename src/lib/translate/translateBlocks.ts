import {translateTexts} from '@/actions/translation';
import type {TranslationProviderId} from '@/lib/providers/types';
import type {OcrBlock, TranslationBlock} from '@/types/types';

export async function translateBlocks(
  blocks: OcrBlock[],
  sourceCode: string,
  targetCode: string,
  providerId?: TranslationProviderId,
): Promise<TranslationBlock[]> {
  const textsToTranslate: string[] = [];
  const blockIndexes: number[] = [];

  blocks.forEach((block, index) => {
    const text = block.text.trim();
    if (!text) return;

    textsToTranslate.push(text);
    blockIndexes.push(index);
  });

  if (textsToTranslate.length === 0) {
    return blocks.map(block => ({id: block.id, text: ''}));
  }

  const translatedTexts = await translateTexts(
    textsToTranslate,
    sourceCode,
    targetCode,
    providerId,
  );

  const results = blocks.map(block => ({id: block.id, text: ''}));

  blockIndexes.forEach((blockIndex, translationIndex) => {
    results[blockIndex] = {
      id: blocks[blockIndex].id,
      text: translatedTexts[translationIndex] ?? '',
    };
  });

  return results;
}
