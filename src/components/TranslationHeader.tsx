import Button from '@/kit/Button';
import IconButton from '@/kit/IconButton';
import Select from '@/kit/Select';
import {IconDownload, IconHistory} from '@/kit/icons';
import {
  EXPORT_FORMAT_OPTIONS,
  type ExportFormat,
} from '@/lib/image/exportFormat';
import {useRouter} from 'next/navigation';
import {routes} from '@/constants/routes';

type TranslationHeaderProps = {
  onExport: () => void;
  exportDisabled?: boolean;
  isExporting?: boolean;
  exportFormat: ExportFormat;
  onExportFormatChange: (format: ExportFormat) => void;
  exportFormatDisabled?: boolean;
};

export default function TranslationHeader(props: TranslationHeaderProps) {
  const {
    exportDisabled,
    isExporting,
    onExport,
    exportFormat,
    onExportFormatChange,
    exportFormatDisabled,
  } = props;
  const router = useRouter();

  return (
    <header className="flex shrink-0 flex-col gap-4 border-b border-border px-4 py-3 sm:items-start sm:justify-between lg:flex-row sm:px-6 sm:py-5">
      <div className="hidden min-w-0 lg:block">
        <h1 className="text-h4 text-text sm:text-h3">New Translation</h1>
        <p className="mt-1 text-body-md text-text-subtle">
          Upload an image and translate text instantly.
        </p>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2 self-end sm:gap-3 lg:self-auto">
        <IconButton
          aria-label="History"
          onClick={() => router.push(routes.app.settings)}
        >
          <IconHistory />
        </IconButton>
        <Select<ExportFormat>
          value={exportFormat}
          options={EXPORT_FORMAT_OPTIONS}
          onChange={onExportFormatChange}
          disabled={exportFormatDisabled}
          className="w-28"
        />
        <Button
          leftIcon={<IconDownload />}
          onClick={onExport}
          disabled={exportDisabled}
          isLoading={isExporting}
        >
          Export
        </Button>
      </div>
    </header>
  );
}
