import {getOcrProvider} from '@/lib/ocr/providers';
import type {OcrProgress, OcrRecognizeOptions} from '@/lib/providers/types';
import type {OcrBlock} from '@/types/types';

export type {OcrProgress};

export type OcrJob = {
  id: string;
  imageSource: string | File | Blob;
  providerId?: 'tesseract';
  options?: OcrRecognizeOptions;
};

export async function runOcrJob(job: OcrJob): Promise<OcrBlock[]> {
  const provider = getOcrProvider(job.providerId ?? 'tesseract');
  return provider.recognize(job.imageSource, job.options);
}

export async function runOcrBatch(
  jobs: OcrJob[],
): Promise<Map<string, OcrBlock[]>> {
  const results = await Promise.all(
    jobs.map(async job => {
      const blocks = await runOcrJob(job);
      return [job.id, blocks] as const;
    }),
  );

  return new Map(results);
}

/** @deprecated Use runOcrJob instead */
export async function runOcr(
  imageSource: string | File,
  onProgress?: (progress: OcrProgress) => void,
  options?: {
    providerId?: 'tesseract';
    language?: string;
    minConfidence?: number;
  },
) {
  return runOcrJob({
    id: 'single',
    imageSource,
    options: {
      language: options?.language,
      minConfidence: options?.minConfidence,
      onProgress,
    },
  });
}
