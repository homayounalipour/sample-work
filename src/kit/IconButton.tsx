'use client';

import React, {ButtonHTMLAttributes} from 'react';
import cn from '@/utils/mergeClassNameTailwind';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md';
  variant?: 'default' | 'ghost';
};

export default function IconButton(props: IconButtonProps) {
  const {
    className,
    size = 'md',
    variant = 'default',
    children,
    ...rest
  } = props;
  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-primary',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        variant === 'default'
          ? 'bg-background-muted border border-border text-text-subtle hover:bg-surface-subtle hover:text-text'
          : 'bg-transparent text-text-subtle hover:bg-surface-subtle hover:text-text',
        'disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
