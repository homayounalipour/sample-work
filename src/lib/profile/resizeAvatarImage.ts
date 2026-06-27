const AVATAR_MAX_SIZE = 256;
const AVATAR_QUALITY = 0.85;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

export async function resizeAvatarImage(file: File): Promise<Blob> {
  const image = await loadImageFromFile(file);
  const size = Math.min(image.naturalWidth, image.naturalHeight);
  const sx = (image.naturalWidth - size) / 2;
  const sy = (image.naturalHeight - size) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_MAX_SIZE;
  canvas.height = AVATAR_MAX_SIZE;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not prepare image for upload');
  }

  context.drawImage(
    image,
    sx,
    sy,
    size,
    size,
    0,
    0,
    AVATAR_MAX_SIZE,
    AVATAR_MAX_SIZE,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (!blob) {
          reject(new Error('Could not process image'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      AVATAR_QUALITY,
    );
  });
}
