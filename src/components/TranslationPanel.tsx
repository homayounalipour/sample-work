'use client';

import Button from '@/kit/Button';
import LanguageSelector, {LanguageOption} from '@/kit/LanguageSelector';
import Spinner from '@/kit/Spinner';
import {IconArrowRight, IconSwap} from '@/kit/icons';
import IconButton from '@/kit/IconButton';
import type {TranslationBlock} from '../types/types';

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

export default function TranslationPanel({
  sourceLang,
  targetLang,
  languages,
  onSourceChange,
  onTargetChange,
  onSwap,
  translations,
  onTranslate,
  onApply,
  isTranslating,
  isApplying,
  translateDisabled,
  applyDisabled,
}: TranslationPanelProps) {
  return (
    <div className="flex min-h-0 w-[300px] shrink-0 flex-col rounded-[var(--radius-lg)] border border-border bg-surface">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2">
          <LanguageSelector
            value={sourceLang}
            options={languages}
            onChange={onSourceChange}
            className="flex-1"
          />
          <IconButton size="sm" onClick={onSwap} aria-label="Swap languages">
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
              className="rounded-[var(--radius-md)] border border-border bg-background-subtle px-3 py-2.5"
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
          disabled={translateDisabled}
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
