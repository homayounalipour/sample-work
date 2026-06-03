import type {OcrBlock} from '@/types/types';

export type OcrProgress = {
  status: string;
  progress: number;
};

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

export async function runOcr(
  imageSource: string | File,
  onProgress?: (progress: OcrProgress) => void,
): Promise<OcrBlock[]> {
  const {createWorker} = await import('tesseract.js');
  const worker = await createWorker('jpn+eng', 1, {
    logger: m => {
      if (m.status === 'recognizing text') {
        onProgress?.({
          status: m.status,
          progress: Math.round((m.progress ?? 0) * 100),
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

    if (lines.length > 0) {
      return lines.map(lineToBlock);
    }

    const text = (data as {text?: string}).text?.trim();
    if (text) {
      return [
        {
          id: 'full-text',
          text,
          bbox: {x: 24, y: 24, width: 200, height: 40},
          confidence: (data as {confidence?: number}).confidence ?? 0,
        },
      ];
    }

    return [];
  } finally {
    await worker.terminate();
  }
}
