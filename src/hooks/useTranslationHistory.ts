'use client';

import {useCallback, useSyncExternalStore} from 'react';
import {
  deleteHistoryEntry,
  getFavoriteRecords,
  getHistoryServerSnapshot,
  getHistorySnapshot,
  refreshHistoryCache,
  subscribeHistory,
  toggleHistoryFavorite,
} from '@/lib/history/translationHistoryStore';

export function useTranslationHistory() {
  const records = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot,
  );

  const toggleFavorite = useCallback(async (id: string) => {
    await toggleHistoryFavorite(id);
  }, []);

  const removeEntry = useCallback(async (id: string) => {
    await deleteHistoryEntry(id);
  }, []);

  const refresh = useCallback(async () => {
    await refreshHistoryCache();
  }, []);

  const favorites = records.filter(record => record.isFavorite);

  return {
    records,
    favorites,
    getFavoriteRecords,
    toggleFavorite,
    removeEntry,
    refresh,
  };
}
