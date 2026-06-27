import {DEFAULT_APP_CONFIG} from '@/lib/config/defaults';

export type ImageDimensions = {
  width: number;
  height: number;
};

function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for thumbnail'));
    };
    img.src = url;
  });
}

function getTargetThumbnailWidth(): number {
  const {thumbnailMaxWidth, thumbnailMaxDpr} = DEFAULT_APP_CONFIG.history;
  const dpr =
    typeof window !== 'undefined'
      ? Math.min(window.devicePixelRatio || 1, thumbnailMaxDpr)
      : 1;

  return Math.round(thumbnailMaxWidth * dpr);
}

export async function getImageDimensions(blob: Blob): Promise<ImageDimensions> {
  const image = await loadImageFromBlob(blob);
  return {width: image.naturalWidth, height: image.naturalHeight};
}

async function canvasToThumbnailBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const quality = DEFAULT_APP_CONFIG.history.thumbnailQuality;

  const webp = await new Promise<Blob | null>(resolve => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });
  if (webp) return webp;

  const png = await new Promise<Blob | null>(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });
  if (png) return png;

  throw new Error('Failed to create thumbnail');
}

export async function createThumbnail(blob: Blob): Promise<Blob> {
  const image = await loadImageFromBlob(blob);
  const maxWidth = getTargetThumbnailWidth();
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height);

  return canvasToThumbnailBlob(canvas);
}
