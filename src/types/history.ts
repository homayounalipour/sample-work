import type {OcrBlock, TranslationBlock} from '@/types/types';

export type TranslationHistoryRecord = {
  id: string;
  createdAt: number;
  sourceLangCode: string;
  targetLangCode: string;
  originalFileName: string;
  ocrBlocks: OcrBlock[];
  translations: TranslationBlock[];
  isFavorite: boolean;
  hasTranslatedImage: boolean;
};

export type SaveHistoryEntryInput = {
  id?: string;
  originalFile: File | null;
  translatedBlob: Blob;
  ocrBlocks: OcrBlock[];
  translations: TranslationBlock[];
  sourceLangCode: string;
  targetLangCode: string;
  originalFileName: string;
  isFavorite?: boolean;
};

export type HistoryBlobs = {
  original: Blob | null;
  translated: Blob | null;
  thumbnail: Blob | null;
};
