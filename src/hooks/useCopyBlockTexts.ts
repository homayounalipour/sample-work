'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {copyTextToClipboard, joinBlockTexts} from '@/utils/copyTextToClipboard';

type UseCopyBlockTextsOptions = {
  feedbackMs?: number;
};

export function useCopyBlockTexts(
  blocks: {text: string}[],
  options?: UseCopyBlockTextsOptions,
) {
  const feedbackMs = options?.feedbackMs ?? 2000;
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  const onCopy = useCallback(async () => {
    const success = await copyTextToClipboard(joinBlockTexts(blocks));
    if (!success) return;

    setCopied(true);
    if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    copiedTimeoutRef.current = setTimeout(() => setCopied(false), feedbackMs);
  }, [blocks, feedbackMs]);

  return {copied, onCopy};
}
