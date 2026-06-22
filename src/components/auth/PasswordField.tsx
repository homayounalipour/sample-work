'use client';

import React, {InputHTMLAttributes, useState} from 'react';
import cn from '@/utils/mergeClassNameTailwind';
import {IconEye, IconEyeOff} from '@/kit/icons';

type PasswordFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  leftIcon?: React.ReactNode;
};

export default function PasswordField(props: PasswordFieldProps) {
  const {className, leftIcon, ...rest} = props;
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative min-w-0 w-full">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          {leftIcon}
        </span>
      )}
      <input
        type={visible ? 'text' : 'password'}
        className={cn(
          'h-11 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 text-body-md text-text placeholder:text-text-muted transition-colors',
          'hover:border-border-strong focus:border-primary focus:ring-1 focus:ring-primary',
          leftIcon && 'pl-10',
          'pr-10',
          className,
        )}
        {...rest}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible(current => !current)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-subtle"
      >
        {visible ? (
          <IconEyeOff className="h-4 w-4" />
        ) : (
          <IconEye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
