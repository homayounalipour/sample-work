import type {OcrProviderId, TranslationProviderId} from '@/lib/providers/types';

export type AppConfig = {
  ocr: {
    provider: OcrProviderId;
    defaultLanguages: string;
    minConfidence: number;
    maxImageDimension: number;
    verify: {
      minTotalChars: number;
      minAvgConfidence: number;
      minAlphanumericRatio: number;
    };
  };
  translation: {
    provider: TranslationProviderId;
    batchDelayMs: number;
  };
  defaults: {
    sourceLang: string;
    targetLang: string;
  };
  export: {
    format: 'png' | 'jpeg' | 'pdf';
    quality: number;
  };
};

export const DEFAULT_APP_CONFIG: AppConfig = {
  ocr: {
    provider: 'tesseract',
    defaultLanguages: 'jpn+eng',
    minConfidence: 0,
    maxImageDimension: 2400,
    verify: {
      minTotalChars: 3,
      minAvgConfidence: 25,
      minAlphanumericRatio: 0.3,
    },
  },
  translation: {
    provider: 'mymemory',
    batchDelayMs: 0,
  },
  defaults: {
    sourceLang: 'en',
    targetLang: 'fa',
  },
  export: {
    format: 'png',
    quality: 0.92,
  },
};

export const DEFAULT_SOURCE_CODE = DEFAULT_APP_CONFIG.defaults.sourceLang;
export const DEFAULT_TARGET_CODE = DEFAULT_APP_CONFIG.defaults.targetLang;
