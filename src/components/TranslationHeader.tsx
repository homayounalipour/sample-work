import Button from '@/kit/Button';
import IconButton from '@/kit/IconButton';
import {IconDownload, IconHistory} from '@/kit/icons';
import {useRouter} from 'next/navigation';
import {routes} from '@/constants/routes';

type TranslationHeaderProps = {
  onExport: () => void;
  exportDisabled?: boolean;
  isExporting?: boolean;
};

export default function TranslationHeader(props: TranslationHeaderProps) {
  const {exportDisabled, isExporting, onExport} = props;
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
