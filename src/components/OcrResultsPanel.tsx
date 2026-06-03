'use client';

import Spinner from '@/kit/Spinner';
import type {OcrBlock} from '../types/types';

type OcrResultsPanelProps = {
  blocks: OcrBlock[];
  isLoading?: boolean;
  progress?: number;
};

export default function OcrResultsPanel({
  blocks,
  isLoading,
  progress = 0,
}: OcrResultsPanelProps) {
  return (
    <div className="flex min-h-0 w-[280px] shrink-0 flex-col rounded-[var(--radius-lg)] border border-border bg-surface">
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-body-md font-semibold text-text">
          OCR Results {blocks.length > 0 && `(${blocks.length})`}
        </h2>
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
            Upload an image to extract text.
          </p>
        ) : (
          blocks.map(block => (
            <div
              key={block.id}
              className="rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5"
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
