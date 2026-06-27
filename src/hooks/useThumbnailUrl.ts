'use client';

import {useEffect, useState} from 'react';
import {getThumbnailUrl} from '@/lib/history/translationHistoryStore';

export function useThumbnailUrl(recordId: string): string | null {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    void getThumbnailUrl(recordId).then(url => {
      if (!active) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      objectUrl = url;
      setThumbnailUrl(url);
    });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [recordId]);

  return thumbnailUrl;
}
