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

export default function ImageViewer(props: ImageViewerProps) {
  const {
    imageUrl,
    isLoading,
    loadingLabel,
    onFlip,
    onReplace,
    flipH,
    onRotate,
    rotation,
    zoom,
    onZoomChange,
  } = props;

  if (!imageUrl) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-(--radius-lg) border border-border bg-surface">
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-2 sm:p-4">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/80">
            <Spinner size="lg" className="text-primary" />
            <p className="text-body-md text-text-subtle">
              {loadingLabel ?? 'Processing…'}
            </p>
          </div>
        )}
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md border border-border bg-background/90 px-1.5 py-1 backdrop-blur-sm sm:right-4 sm:top-4 sm:px-2">
          <IconButton
            size="sm"
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            aria-label="Zoom out"
            className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 2xl:h-8 2xl:w-8"
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
            className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 2xl:h-8 2xl:w-8"
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
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2.5 sm:px-4 sm:py-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onReplace}
          className="h-5 md:h-8"
        >
          Replace Image
        </Button>
        <div className="flex gap-2">
          <IconButton
            size="sm"
            onClick={onRotate}
            aria-label="Rotate"
            className="h-5 md:h-8"
          >
            <IconRotate />
          </IconButton>
          <IconButton
            size="sm"
            onClick={onFlip}
            aria-label="Flip horizontal"
            className={cn(flipH && 'text-primary', 'h-5 md:h-8')}
          >
            <IconFlip />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
