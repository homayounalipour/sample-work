import Button from '@/kit/Button';
import LanguageSelector, {LanguageOption} from '@/kit/LanguageSelector';
import Spinner from '@/kit/Spinner';
import {IconArrowRight, IconSwap} from '@/kit/icons';
import IconButton from '@/kit/IconButton';
import type {TranslationBlock} from '@/types/types';

type TranslationPanelProps = {
  sourceLang: LanguageOption;
  targetLang: LanguageOption;
  languages: LanguageOption[];
  onSourceChange: (lang: LanguageOption) => void;
  onTargetChange: (lang: LanguageOption) => void;
  onSwap: () => void;
  translations: TranslationBlock[];
  onTranslate: () => void;
  onApply: () => void;
  isTranslating?: boolean;
  isApplying?: boolean;
  translateDisabled?: boolean;
  applyDisabled?: boolean;
};

export default function TranslationPanel(props: TranslationPanelProps) {
  const {
    isTranslating,
    translations,
    onTranslate,
    onApply,
    isApplying,
    translateDisabled,
    applyDisabled,
    onSwap,
    onSourceChange,
    onTargetChange,
    targetLang,
    languages,
    sourceLang,
  } = props;

  const disableLang = sourceLang === targetLang;
  return (
    <div className="flex min-h-56 max-h-96 min-w-0 w-full flex-col rounded-(--radius-lg) border border-border bg-surface md:max-h-none md:min-h-0 md:flex-1 xl:w-80 xl:max-h-none xl:flex-none xl:shrink-0">
      <div className="border-b border-border px-4 py-3 sm:py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <LanguageSelector
            value={sourceLang}
            options={languages}
            onChange={onSourceChange}
            className="flex-1"
          />
          <IconButton
            size="sm"
            onClick={onSwap}
            aria-label="Swap languages"
            className="self-center sm:self-auto h-6 w-6"
          >
            <IconSwap />
          </IconButton>
          <LanguageSelector
            value={targetLang}
            options={languages}
            onChange={onTargetChange}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
        {isTranslating ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <Spinner className="text-primary" />
            <p className="text-caption text-text-muted">Translating…</p>
          </div>
        ) : translations.length === 0 ? (
          <p className="py-8 text-center text-caption text-text-muted">
            Run OCR first, then translate detected text.
          </p>
        ) : (
          translations.map(item => (
            <div
              key={item.id}
              className="rounded-md border border-border bg-background-subtle px-3 py-2.5"
            >
              <p className="text-body-md text-text">{item.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-border p-4">
        <Button
          variant="secondary"
          fullWidth
          onClick={onTranslate}
          disabled={translateDisabled || disableLang}
          isLoading={isTranslating}
          rightIcon={<IconArrowRight />}
        >
          Translate
        </Button>
        <Button
          fullWidth
          onClick={onApply}
          disabled={applyDisabled}
          isLoading={isApplying}
        >
          Apply Translation
        </Button>
      </div>
    </div>
  );
}
