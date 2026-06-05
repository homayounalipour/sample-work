import cn from '@/utils/mergeClassNameTailwind';
import {IconCheck, IconClose} from './icons';

export type AlertVariant = 'success' | 'warning' | 'error';

type AlertProps = {
  variant: AlertVariant;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
};

const variantStyles: Record<AlertVariant, {bg: string; icon: string}> = {
  success: {
    bg: 'bg-success/10 border-success/30 text-success',
    icon: 'text-success',
  },
  warning: {
    bg: 'bg-warning/10 border-warning/30 text-warning',
    icon: 'text-warning',
  },
  error: {bg: 'bg-error/10 border-error/30 text-error', icon: 'text-error'},
};

export default function Alert(props: AlertProps) {
  const {message, onClose, className, variant, title} = props;
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md border px-4 py-3',
        styles.bg,
        className,
      )}
      role="alert"
    >
      <span className={cn('mt-0.5 shrink-0', styles.icon)}>
        <IconCheck className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-md font-medium text-text">{title}</p>
        {message && (
          <p className="mt-0.5 text-caption text-text-subtle">{message}</p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-text-muted hover:text-text"
          aria-label="Dismiss"
        >
          <IconClose />
        </button>
      )}
    </div>
  );
}
