import {getOcrProvider} from '@/lib/ocr/providers';
import type {OcrProgress} from '@/lib/providers/types';

export type {OcrProgress};

export async function runOcr(
  imageSource: string | File,
  onProgress?: (progress: OcrProgress) => void,
  options?: {
    providerId?: 'tesseract';
    language?: string;
    minConfidence?: number;
  },
) {
  const provider = getOcrProvider(options?.providerId ?? 'tesseract');

  return provider.recognize(imageSource, {
    language: options?.language,
    minConfidence: options?.minConfidence,
    onProgress,
  });
}
