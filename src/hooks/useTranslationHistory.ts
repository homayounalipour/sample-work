'use client';

import {useCallback, useSyncExternalStore} from 'react';
import {useAuth} from '@/contexts/AuthContext';
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
  const {user} = useAuth();
  const userId = user?.uid ?? null;

  const getSnapshot = useCallback(() => {
    if (!userId) return [];
    return getHistorySnapshot();
  }, [userId]);

  const records = useSyncExternalStore(
    subscribeHistory,
    getSnapshot,
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
