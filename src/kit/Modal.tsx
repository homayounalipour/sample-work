import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import cn from '@/utils/mergeClassNameTailwind';
import Button from './Button';
import React from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  primaryAction?: {label: string; onClick: () => void};
  secondaryAction?: {label: string; onClick: () => void};
  className?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60 transition-opacity" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={cn(
            'w-full max-w-md rounded-(--radius-lg) border border-border bg-surface p-6 shadow-modal',
            className,
          )}
        >
          <DialogTitle className="text-h4 text-text">{title}</DialogTitle>
          {description && (
            <p className="mt-2 text-body-md text-text-subtle">{description}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
          {(primaryAction || secondaryAction) && (
            <div className="mt-6 flex gap-3">
              {secondaryAction && (
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button className="flex-1" onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </Button>
              )}
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
