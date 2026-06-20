import type {OcrBlock} from '@/types/types';
import {DEFAULT_APP_CONFIG} from '@/lib/config/defaults';

const LETTER_OR_NUMBER = /[\p{L}\p{N}]/u;

type VerifyOptions = {
  minTotalChars?: number;
  minAvgConfidence?: number;
  minAlphanumericRatio?: number;
};

function meaningfulCharCount(text: string): number {
  return [...text].filter(char => LETTER_OR_NUMBER.test(char)).length;
}

function alphanumericRatio(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  const alnum = meaningfulCharCount(trimmed);
  return alnum / trimmed.length;
}

export function verifyOcrBlocks(
  blocks: OcrBlock[],
  options?: VerifyOptions,
): OcrBlock[] {
  if (blocks.length === 0) return [];

  const {
    minTotalChars = DEFAULT_APP_CONFIG.ocr.verify.minTotalChars,
    minAvgConfidence = DEFAULT_APP_CONFIG.ocr.verify.minAvgConfidence,
    minAlphanumericRatio = DEFAULT_APP_CONFIG.ocr.verify.minAlphanumericRatio,
  } = options ?? {};

  const combinedText = blocks.map(block => block.text).join(' ');
  const totalMeaningful = meaningfulCharCount(combinedText);

  if (totalMeaningful < minTotalChars) return [];

  const avgConfidence =
    blocks.reduce((sum, block) => sum + block.confidence, 0) / blocks.length;

  if (avgConfidence < minAvgConfidence) return [];

  if (alphanumericRatio(combinedText) < minAlphanumericRatio) return [];

  return blocks;
}
