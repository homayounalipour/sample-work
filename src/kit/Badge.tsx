import cn from '@/utils/mergeClassNameTailwind';
import React from 'react';

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

export default function Badge(props: BadgeProps) {
  const {children, className, variant = 'default'} = props;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-0.5 text-caption font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
