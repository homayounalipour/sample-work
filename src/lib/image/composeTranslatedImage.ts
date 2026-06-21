import {DEFAULT_APP_CONFIG} from '@/lib/config/defaults';
import type {OcrBlock, TranslationBlock} from '@/types/types';
import {canvasToPdfBlob} from '@/lib/image/canvasToPdfBlob';
import {
  getExportMimeType,
  isLossyFormat,
  type ExportFormat,
} from '@/lib/image/exportFormat';

type ComposeOptions = {
  imageUrl: string;
  blocks: OcrBlock[];
  translations: TranslationBlock[];
  format?: ExportFormat;
  quality?: number;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function renderTranslatedCanvas({
  imageUrl,
  blocks,
  translations,
}: Omit<ComposeOptions, 'format' | 'quality'>): Promise<HTMLCanvasElement> {
  const image = await loadImage(imageUrl);
  const translationMap = new Map(translations.map(t => [t.id, t.text]));

  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  const cw = image.naturalWidth;
  const ch = image.naturalHeight;

  canvas.width = cw * dpr;
  canvas.height = ch * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.scale(dpr, dpr);
  ctx.drawImage(image, 0, 0, cw, ch);

  for (const block of blocks) {
    const translated = translationMap.get(block.id);
    if (!translated) continue;

    const {x, y, width: w, height: h} = block.bbox;

    ctx.fillStyle = 'rgba(9, 9, 11, 0.75)';
    ctx.fillRect(x, y, w, h);

    const fontSize = Math.max(10, Math.min(h * 0.55, 18));
    ctx.fillStyle = '#FAFAFA';
    ctx.font = `600 ${fontSize}px var(--font-geist-sans), sans-serif`;
    ctx.textBaseline = 'middle';

    const padding = 4;
    const maxWidth = w - padding * 2;
    let displayText = translated;
    while (
      ctx.measureText(displayText).width > maxWidth &&
      displayText.length > 3
    ) {
      displayText = `${displayText.slice(0, -4)}…`;
    }

    ctx.fillText(displayText, x + padding, y + h / 2, maxWidth);
  }

  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  quality: number,
): Promise<Blob> {
  if (format === 'pdf') {
    return canvasToPdfBlob(canvas, quality);
  }

  const mimeType = getExportMimeType(format);
  const blobQuality = isLossyFormat(format) ? quality : 1;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob =>
        blob ? resolve(blob) : reject(new Error('Failed to export image')),
      mimeType,
      blobQuality,
    );
  });
}

export async function composeTranslatedImage({
  imageUrl,
  blocks,
  translations,
  format = DEFAULT_APP_CONFIG.export.format,
  quality = DEFAULT_APP_CONFIG.export.quality,
}: ComposeOptions): Promise<Blob> {
  const canvas = await renderTranslatedCanvas({imageUrl, blocks, translations});
  return canvasToBlob(canvas, format, quality);
}
