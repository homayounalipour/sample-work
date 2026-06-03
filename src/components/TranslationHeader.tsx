import Button from '@/kit/Button';
import IconButton from '@/kit/IconButton';
import {IconDownload, IconHistory} from '@/kit/icons';

type TranslationHeaderProps = {
  onExport: () => void;
  exportDisabled?: boolean;
  isExporting?: boolean;
};

export default function TranslationHeader({
  onExport,
  exportDisabled,
  isExporting,
}: TranslationHeaderProps) {
  return (
    <header className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
      <div>
        <h1 className="text-h3 text-text">New Translation</h1>
        <p className="mt-1 text-body-md text-text-subtle">
          Upload an image and translate text instantly.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <IconButton aria-label="History">
          <IconHistory />
        </IconButton>
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
