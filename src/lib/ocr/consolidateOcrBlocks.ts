import type {BoundingBox, OcrBlock} from '@/types/types';

function bboxArea(box: BoundingBox): number {
  return box.width * box.height;
}

function intersectionArea(a: BoundingBox, b: BoundingBox): number {
  const x0 = Math.max(a.x, b.x);
  const y0 = Math.max(a.y, b.y);
  const x1 = Math.min(a.x + a.width, b.x + b.width);
  const y1 = Math.min(a.y + a.height, b.y + b.height);

  if (x1 <= x0 || y1 <= y0) return 0;
  return (x1 - x0) * (y1 - y0);
}

function iou(a: BoundingBox, b: BoundingBox): number {
  const intersection = intersectionArea(a, b);
  if (intersection === 0) return 0;

  const union = bboxArea(a) + bboxArea(b) - intersection;
  return union > 0 ? intersection / union : 0;
}

const IOU_THRESHOLD = 0.5;

export function consolidateOcrBlocks(blocks: OcrBlock[]): OcrBlock[] {
  if (blocks.length <= 1) return blocks;

  const kept: OcrBlock[] = [];

  for (const block of blocks) {
    const duplicateIndex = kept.findIndex(
      existing => iou(existing.bbox, block.bbox) >= IOU_THRESHOLD,
    );

    if (duplicateIndex === -1) {
      kept.push(block);
      continue;
    }

    if (block.confidence > kept[duplicateIndex].confidence) {
      kept[duplicateIndex] = block;
    }
  }

  return kept;
}
