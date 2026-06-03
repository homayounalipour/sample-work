import cn from '@/utils/mergeClassNameTailwind';

export type BadgeVariant = 'new' | 'completed' | 'failed' | 'default';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  new: 'bg-primary/20 text-primary',
  completed: 'bg-success/20 text-success',
  failed: 'bg-error/20 text-error',
  default: 'bg-background-muted text-text-subtle',
};

export default function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-caption font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
