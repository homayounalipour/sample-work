'use client';

import IconButton from '@/kit/IconButton';
import {IconCheck, IconCopy} from '@/kit/icons';
import Spinner from '@/kit/Spinner';
import {useCopyBlockTexts} from '@/hooks/useCopyBlockTexts';
import type {OcrBlock} from '@/types/types';

type OcrResultsPanelProps = {
  blocks: OcrBlock[];
  isLoading?: boolean;
  progress?: number;
  hasImage?: boolean;
};

export default function OcrResultsPanel(props: OcrResultsPanelProps) {
  const {progress = 0, isLoading, blocks, hasImage = false} = props;
  const {copied, onCopy} = useCopyBlockTexts(blocks);

  return (
    <div className="flex min-h-48 max-h-80 min-w-0 w-full flex-col rounded-(--radius-lg) border border-border bg-surface md:max-h-none md:min-h-0 md:flex-1 xl:w-70 xl:max-h-none xl:flex-none xl:shrink-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <h2 className="text-body-md font-semibold text-text">
          OCR Results {blocks.length > 0 && `(${blocks.length})`}
        </h2>
        <IconButton
          size="sm"
          aria-label="Copy OCR text"
          disabled={isLoading || blocks.length === 0}
          onClick={onCopy}
        >
          {copied ? <IconCheck /> : <IconCopy />}
        </IconButton>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Spinner className="text-primary" />
            <p className="text-caption text-text-muted">
              Recognizing text… {progress}%
            </p>
          </div>
        ) : blocks.length === 0 ? (
          <p className="py-8 text-center text-caption text-text-muted">
            {hasImage
              ? 'No readable text was detected in this image.'
              : 'Upload an image to extract text.'}
          </p>
        ) : (
          blocks.map(block => (
            <div
              key={block.id}
              className="rounded-md border border-border bg-background px-3 py-2.5"
            >
              <p className="text-body-md text-text">{block.text}</p>
              <p className="mt-1 text-caption text-text-muted">
                {Math.round(block.confidence)}% confidence
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
