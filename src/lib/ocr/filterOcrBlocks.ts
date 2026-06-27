import type {OcrBlock} from '@/types/types';

const LETTER_OR_NUMBER = /[\p{L}\p{N}]/u;

function hasValidBbox(block: OcrBlock): boolean {
  const {width, height} = block.bbox;
  return width > 0 && height > 0;
}

function isNoiseText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  const meaningful = trimmed.replace(/[^\p{L}\p{N}]/gu, '');
  if (meaningful.length === 0) return true;

  const letterCount = [...trimmed].filter(char =>
    LETTER_OR_NUMBER.test(char),
  ).length;
  return letterCount === 0;
}

export function filterOcrBlocks(
  blocks: OcrBlock[],
  minConfidence = 0,
): OcrBlock[] {
  return blocks.filter(block => {
    if (!hasValidBbox(block)) return false;
    if (minConfidence > 0 && block.confidence < minConfidence) return false;
    if (isNoiseText(block.text)) return false;
    if (block.text.trim().length === 1 && block.confidence < 40) return false;
    return true;
  });
}
