import type {SelectOption} from '@/kit/Select';

export type ExportFormat = 'png' | 'jpeg' | 'pdf';

export const EXPORT_FORMAT_OPTIONS: SelectOption<ExportFormat>[] = [
  {id: 'png', name: 'PNG'},
  {id: 'jpeg', name: 'JPEG'},
  {id: 'pdf', name: 'PDF'},
];

export function getExportMimeType(format: ExportFormat): string {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'jpeg':
      return 'image/jpeg';
    case 'pdf':
      return 'application/pdf';
  }
}

export function getExportFilename(format: ExportFormat): string {
  switch (format) {
    case 'png':
      return 'translated-image.png';
    case 'jpeg':
      return 'translated-image.jpg';
    case 'pdf':
      return 'translated-image.pdf';
  }
}

export function isLossyFormat(format: ExportFormat): boolean {
  return format === 'jpeg';
}
