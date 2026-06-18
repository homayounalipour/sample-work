import type {OcrBlock} from '@/types/types';
import {DEFAULT_APP_CONFIG} from '@/lib/config/defaults';
import type {OcrProvider, OcrRecognizeOptions} from '@/lib/providers/types';

type TesseractLine = {
  text: string;
  confidence: number;
  bbox: {x0: number; y0: number; x1: number; y1: number};
};

type TesseractPage = {
  blocks: Array<{
    paragraphs: Array<{
      lines: TesseractLine[];
    }>;
  }> | null;
};

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

function linesFromPage(page: TesseractPage): TesseractLine[] {
  const lines: TesseractLine[] = [];
  if (!page.blocks) return lines;

  for (const block of page.blocks) {
    for (const paragraph of block.paragraphs ?? []) {
      for (const line of paragraph.lines ?? []) {
        if (line.text?.trim()) lines.push(line);
      }
    }
  }

  return lines;
}

function lineToBlock(line: TesseractLine, index: number): OcrBlock {
  const box = line.bbox;

  return {
    id: `line-${index}`,
    text: line.text.trim(),
    bbox: {
      x: box.x0,
      y: box.y0,
      width: box.x1 - box.x0,
      height: box.y1 - box.y0,
    },
    confidence: line.confidence ?? 0,
  };
}

function resolveTesseractLanguages(language?: string): string {
  if (!language?.trim()) {
    return DEFAULT_APP_CONFIG.ocr.defaultLanguages;
  }

  const mapped = LANGUAGE_TO_TESSERACT[language];
  if (!mapped) {
    return DEFAULT_APP_CONFIG.ocr.defaultLanguages;
  }

  return mapped === 'eng' ? 'eng' : `${mapped}+eng`;
}

function filterByConfidence(
  blocks: OcrBlock[],
  minConfidence: number,
): OcrBlock[] {
  if (minConfidence <= 0) return blocks;
  return blocks.filter(block => block.confidence >= minConfidence);
}

async function recognizeWithTesseract(
  imageSource: string | File | Blob,
  options?: OcrRecognizeOptions,
): Promise<OcrBlock[]> {
  const {createWorker} = await import('tesseract.js');
  const languages = resolveTesseractLanguages(options?.language);

  const worker = await createWorker(languages, 1, {
    logger: message => {
      if (message.status === 'recognizing text') {
        options?.onProgress?.({
          status: message.status,
          progress: Math.round((message.progress ?? 0) * 100),
        });
      }
    },
  });

  try {
    const {data} = await worker.recognize(
      imageSource,
      {},
      {blocks: true, text: true},
    );
    const page = data as unknown as TesseractPage;
    const lines = linesFromPage(page);
    const minConfidence = options?.minConfidence ?? 0;

    if (lines.length > 0) {
      return filterByConfidence(lines.map(lineToBlock), minConfidence);
    }

    const text = (data as {text?: string}).text?.trim();
    if (text) {
      const block: OcrBlock = {
        id: 'full-text',
        text,
        bbox: {x: 24, y: 24, width: 200, height: 40},
        confidence: (data as {confidence?: number}).confidence ?? 0,
      };

      return filterByConfidence([block], minConfidence);
    }

    return [];
  } finally {
    await worker.terminate();
  }
}

export const tesseractProvider: OcrProvider = {
  id: 'tesseract',
  name: 'Tesseract',
  description: 'Free browser-based OCR. Works offline after the first load.',
  recognize: recognizeWithTesseract,
};
