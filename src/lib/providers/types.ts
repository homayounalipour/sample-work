import type {OcrBlock} from '@/types/types';

export type OcrProviderId = 'tesseract';

export type TranslationProviderId = 'mymemory';

export type OcrProgress = {
  status: string;
  progress: number;
};

export type OcrRecognizeOptions = {
  language?: string;
  minConfidence?: number;
  onProgress?: (progress: OcrProgress) => void;
};

export type OcrProvider = {
  id: OcrProviderId;
  name: string;
  description: string;
  recognize: (
    imageSource: string | File | Blob,
    options?: OcrRecognizeOptions,
  ) => Promise<OcrBlock[]>;
};

export type TranslationProvider = {
  id: TranslationProviderId;
  name: string;
  description: string;
  translate: (
    texts: string[],
    source: string,
    target: string,
  ) => Promise<string[]>;
};

export type ProviderOption<T extends string> = {
  id: T;
  name: string;
  description: string;
};
