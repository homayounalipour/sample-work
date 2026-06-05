import cn from '@/utils/mergeClassNameTailwind';

type ProgressBarProps = {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
};

export default function ProgressBar(props: ProgressBarProps) {
  const {className, showLabel, label, value, max = 100} = props;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="mb-2 flex items-center justify-between text-caption text-text-subtle">
          <span>{label ?? 'Storage'}</span>
          {showLabel && (
            <span>
              {value} GB / {max} GB
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-pill bg-background-muted">
        <div
          className="h-full rounded-pill bg-primary transition-all duration-300"
          style={{width: `${percent}%`}}
        />
      </div>
    </div>
  );
}
