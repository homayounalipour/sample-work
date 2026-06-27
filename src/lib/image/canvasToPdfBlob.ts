import {jsPDF} from 'jspdf';

export async function canvasToPdfBlob(
  canvas: HTMLCanvasElement,
  quality = 0.92,
): Promise<Blob> {
  const imgData = canvas.toDataURL('image/jpeg', quality);
  const width = canvas.width;
  const height = canvas.height;
  const orientation = width > height ? 'landscape' : 'portrait';

  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, width, height);

  return pdf.output('blob');
}
