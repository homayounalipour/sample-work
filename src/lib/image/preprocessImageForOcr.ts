import {DEFAULT_APP_CONFIG} from '@/lib/config/defaults';

function loadImageFromSource(
  source: string | File | Blob,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for OCR'));
    img.src =
      typeof source === 'string' ? source : URL.createObjectURL(source);
  });
}

function computeDimensions(
  width: number,
  height: number,
  maxDimension: number,
): {width: number; height: number} {
  const longest = Math.max(width, height);
  if (longest <= maxDimension) {
    return {width, height};
  }

  const scale = maxDimension / longest;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function applyGrayscaleAndContrast(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const {data} = imageData;
  const contrast = 1.15;

  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const adjusted = (gray - 128) * contrast + 128;
    const clamped = Math.max(0, Math.min(255, adjusted));
    data[i] = clamped;
    data[i + 1] = clamped;
    data[i + 2] = clamped;
  }

  ctx.putImageData(imageData, 0, 0);
}

export async function preprocessImageForOcr(
  source: string | File | Blob,
  maxDimension = DEFAULT_APP_CONFIG.ocr.maxImageDimension,
): Promise<Blob> {
  const objectUrl = typeof source === 'string' ? null : URL.createObjectURL(source);

  try {
    const image = await loadImageFromSource(
      objectUrl ?? (source as string),
    );
    const {width, height} = computeDimensions(
      image.naturalWidth,
      image.naturalHeight,
      maxDimension,
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    ctx.drawImage(image, 0, 0, width, height);
    applyGrayscaleAndContrast(ctx, width, height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob =>
          blob
            ? resolve(blob)
            : reject(new Error('Failed to preprocess image for OCR')),
        'image/png',
        1,
      );
    });
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}
