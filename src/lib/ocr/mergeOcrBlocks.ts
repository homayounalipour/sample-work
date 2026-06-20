import type {BoundingBox, OcrBlock} from '@/types/types';

function unionBbox(a: BoundingBox, b: BoundingBox): BoundingBox {
  const x0 = Math.min(a.x, b.x);
  const y0 = Math.min(a.y, b.y);
  const x1 = Math.max(a.x + a.width, b.x + b.width);
  const y1 = Math.max(a.y + a.height, b.y + b.height);

  return {
    x: x0,
    y: y0,
    width: x1 - x0,
    height: y1 - y0,
  };
}

function shouldMerge(a: OcrBlock, b: OcrBlock): boolean {
  const gap = b.bbox.y - (a.bbox.y + a.bbox.height);
  const maxGap = Math.max(a.bbox.height, b.bbox.height) * 0.6;
  const verticalOverlap =
    Math.min(a.bbox.y + a.bbox.height, b.bbox.y + b.bbox.height) -
    Math.max(a.bbox.y, b.bbox.y);

  if (gap > maxGap) return false;
  if (verticalOverlap < 0) return false;

  const horizontalOverlap =
    Math.min(a.bbox.x + a.bbox.width, b.bbox.x + b.bbox.width) -
    Math.max(a.bbox.x, b.bbox.x);

  return horizontalOverlap > 0 || gap <= maxGap;
}

function mergePair(a: OcrBlock, b: OcrBlock, index: number): OcrBlock {
  const totalConfidence = a.confidence + b.confidence;
  const weightA = a.confidence / totalConfidence || 0.5;
  const weightB = b.confidence / totalConfidence || 0.5;

  return {
    id: `merged-${index}`,
    text: `${a.text} ${b.text}`.trim(),
    bbox: unionBbox(a.bbox, b.bbox),
    confidence: a.confidence * weightA + b.confidence * weightB,
  };
}

export function mergeOcrBlocks(blocks: OcrBlock[]): OcrBlock[] {
  if (blocks.length <= 1) return blocks;

  const sorted = [...blocks].sort((a, b) => {
    if (a.bbox.y !== b.bbox.y) return a.bbox.y - b.bbox.y;
    return a.bbox.x - b.bbox.x;
  });

  const merged: OcrBlock[] = [];
  let current = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    if (shouldMerge(current, next)) {
      current = mergePair(current, next, merged.length);
    } else {
      merged.push(current);
      current = next;
    }
  }

  merged.push(current);
  return merged;
}
