'use client';

import Button from '@/kit/Button';
import IconButton from '@/kit/IconButton';
import Spinner from '@/kit/Spinner';
import {IconFlip, IconMinus, IconPlus, IconRotate} from '@/kit/icons';
import cn from '@/utils/mergeClassNameTailwind';

type ImageViewerProps = {
  imageUrl: string | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  rotation: number;
  flipH: boolean;
  onRotate: () => void;
  onFlip: () => void;
  onReplace: () => void;
  isLoading?: boolean;
  loadingLabel?: string;
};

export default function ImageViewer({
  imageUrl,
  zoom,
  onZoomChange,
  rotation,
  flipH,
  onRotate,
  onFlip,
  onReplace,
  isLoading,
  loadingLabel,
}: ImageViewerProps) {
  if (!imageUrl) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-[var(--radius-lg)] border border-border bg-surface">
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80">
            <Spinner size="lg" className="text-primary" />
            <p className="text-body-md text-text-subtle">
              {loadingLabel ?? 'Processing…'}
            </p>
          </div>
        )}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-background/90 px-2 py-1 backdrop-blur-sm">
          <IconButton
            size="sm"
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            aria-label="Zoom out"
          >
            <IconMinus />
          </IconButton>
          <span className="min-w-[3rem] text-center text-caption text-text">
            {zoom}%
          </span>
          <IconButton
            size="sm"
            onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            aria-label="Zoom in"
          >
            <IconPlus />
          </IconButton>
        </div>
        <img
          src={imageUrl}
          alt="Uploaded preview"
          className="max-h-full max-w-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
          }}
        />
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <Button variant="secondary" size="sm" onClick={onReplace}>
          Replace Image
        </Button>
        <div className="flex gap-2">
          <IconButton size="sm" onClick={onRotate} aria-label="Rotate">
            <IconRotate />
          </IconButton>
          <IconButton
            size="sm"
            onClick={onFlip}
            aria-label="Flip horizontal"
            className={cn(flipH && 'text-primary')}
          >
            <IconFlip />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
