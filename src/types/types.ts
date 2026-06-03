export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OcrBlock = {
  id: string;
  text: string;
  bbox: BoundingBox;
  confidence: number;
};

export type TranslationBlock = {
  id: string;
  text: string;
};

export type WorkflowStatus =
  | 'idle'
  | 'uploaded'
  | 'ocr_running'
  | 'ocr_done'
  | 'translating'
  | 'translated'
  | 'applying'
  | 'applied'
  | 'exporting'
  | 'done';
