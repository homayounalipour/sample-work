import Button from '@/kit/Button';
import IconButton from '@/kit/IconButton';
import {IconDownload, IconHistory, IconMenu} from '@/kit/icons';
import {useSidebar} from '@/contexts/SidebarContext';

type TranslationHeaderProps = {
  onExport: () => void;
  exportDisabled?: boolean;
  isExporting?: boolean;
};

export default function TranslationHeader(props: TranslationHeaderProps) {
  const {exportDisabled, isExporting, onExport} = props;
  const {open: openSidebar} = useSidebar();

  return (
    <header className="flex shrink-0 flex-col gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-start gap-3">
        <IconButton
          aria-label="Open navigation menu"
          className="mt-0.5 shrink-0 lg:hidden"
          onClick={openSidebar}
        >
          <IconMenu />
        </IconButton>
        <div className="min-w-0">
          <h1 className="text-h4 text-text sm:text-h3">New Translation</h1>
          <p className="mt-1 text-body-md text-text-subtle">
            Upload an image and translate text instantly.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end sm:gap-3 sm:self-auto">
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
