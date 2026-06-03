'use client';

import React, {useCallback, useRef, useState} from 'react';
import cn from '@/utils/mergeClassNameTailwind';
import {IconUpload} from './icons';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

type UploadZoneProps = {
  onFileSelect: (file: File) => void;
  onError?: (message: string) => void;
  className?: string;
  disabled?: boolean;
};

export default function UploadZone({
  onFileSelect,
  onError,
  className,
  disabled = false,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSelect = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        onError?.('Please upload a PNG, JPG, or WEBP image.');
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        onError?.('Image must be 10MB or smaller.');
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect, onError],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [disabled, validateAndSelect],
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={e => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-12 transition-colors',
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-border-strong bg-background-subtle hover:border-primary/50 hover:bg-surface-subtle',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        disabled={disabled}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) validateAndSelect(file);
          e.target.value = '';
        }}
      />
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background-muted text-primary">
        <IconUpload />
      </div>
      <p className="text-body-md font-medium text-text">
        Drop image here or click to upload
      </p>
      <p className="mt-1 text-caption text-text-muted">
        PNG, JPG, WEBP up to 10MB
      </p>
    </div>
  );
}
