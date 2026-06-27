'use client';

import React, {InputHTMLAttributes} from 'react';
import cn from '@/utils/mergeClassNameTailwind';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function Input(props: InputProps) {
  const {className, leftIcon, rightIcon, ...rest} = props;
  return (
    <div className="relative min-w-0 w-full">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          {leftIcon}
        </span>
      )}
      <input
        className={cn(
          'h-10 w-full rounded-md border border-border bg-background px-3 text-body-md text-text placeholder:text-text-muted transition-colors',
          'hover:border-border-strong focus:border-primary focus:ring-1 focus:ring-primary',
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          className,
        )}
        {...rest}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          {rightIcon}
        </span>
      )}
    </div>
  );
}
