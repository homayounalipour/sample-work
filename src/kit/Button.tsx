'use client';

import React, {ButtonHTMLAttributes, PropsWithChildren} from 'react';
import cn from '@/utils/mergeClassNameTailwind';
import Spinner from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active disabled:opacity-50 disabled:pointer-events-none',
  secondary:
    'bg-background-muted text-text border border-border hover:bg-surface-subtle active:bg-background-subtle disabled:opacity-50',
  ghost:
    'bg-transparent text-text border border-border hover:bg-surface-subtle active:bg-background-muted disabled:opacity-50',
  danger:
    'bg-error text-white hover:bg-error/90 active:bg-error/80 disabled:opacity-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-caption gap-1.5 rounded-[var(--radius-sm)]',
  md: 'h-10 px-4 text-body-md gap-2 rounded-[var(--radius-md)]',
  lg: 'h-11 px-5 text-body-md gap-2 rounded-[var(--radius-md)]',
};

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
