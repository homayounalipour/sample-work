import type {OcrBlock} from '@/types/types';

export type TesseractLine = {
  text: string;
  confidence: number;
  bbox: {x0: number; y0: number; x1: number; y1: number};
};

export type TesseractPage = {
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

export function parseTesseractPage(data: unknown): OcrBlock[] {
  const page = data as TesseractPage;
  const lines = linesFromPage(page);
  return lines.map(lineToBlock);
}
