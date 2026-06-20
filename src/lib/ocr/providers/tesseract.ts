import type {OcrBlock} from '@/types/types';
import {DEFAULT_APP_CONFIG} from '@/lib/config/defaults';
import {preprocessImageForOcr} from '@/lib/image/preprocessImageForOcr';
import {consolidateOcrBlocks} from '@/lib/ocr/consolidateOcrBlocks';
import {filterOcrBlocks} from '@/lib/ocr/filterOcrBlocks';
import {mergeOcrBlocks} from '@/lib/ocr/mergeOcrBlocks';
import {parseTesseractPage} from '@/lib/ocr/parseTesseractPage';
import {verifyOcrBlocks} from '@/lib/ocr/verifyOcrBlocks';
import type {OcrProvider, OcrRecognizeOptions} from '@/lib/providers/types';
import {recognizeWithPool} from '@/lib/ocr/providers/tesseractPool';

const LANGUAGE_TO_TESSERACT: Record<string, string> = {
  en: 'eng',
  fa: 'fas',
  ja: 'jpn',
  ko: 'kor',
  ar: 'ara',
  de: 'deu',
  fr: 'fra',
  es: 'spa',
  it: 'ita',
  zh: 'chi_sim',
  ru: 'rus',
  tr: 'tur',
  pt: 'por',
  hi: 'hin',
  nl: 'nld',
  pl: 'pol',
};

export function resolveTesseractLanguages(language?: string): string {
  if (!language?.trim()) {
    return DEFAULT_APP_CONFIG.ocr.defaultLanguages;
  }

  const mapped = LANGUAGE_TO_TESSERACT[language];
  if (!mapped) {
    return DEFAULT_APP_CONFIG.ocr.defaultLanguages;
  }

  return mapped === 'eng' ? 'eng' : `${mapped}+eng`;
}

function processOcrResult(
  data: unknown,
  minConfidence: number,
): OcrBlock[] {
  const parsed = parseTesseractPage(data);
  const filtered = filterOcrBlocks(parsed, minConfidence);
  const merged = mergeOcrBlocks(filtered);
  const consolidated = consolidateOcrBlocks(merged);
  return verifyOcrBlocks(consolidated);
}

async function recognizeWithTesseract(
  imageSource: string | File | Blob,
  options?: OcrRecognizeOptions,
): Promise<OcrBlock[]> {
  const languages = resolveTesseractLanguages(options?.language);
  const minConfidence = options?.minConfidence ?? 0;

  const preprocessed = await preprocessImageForOcr(imageSource);
  const data = await recognizeWithPool(preprocessed, languages, options);

  return processOcrResult(data, minConfidence);
}

export const tesseractProvider: OcrProvider = {
  id: 'tesseract',
  name: 'Tesseract',
  description: 'Free browser-based OCR. Works offline after the first load.',
  recognize: recognizeWithTesseract,
};
