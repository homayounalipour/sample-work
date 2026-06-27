'use client';

import {useLayoutEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {
  refreshHistoryCache,
  setHistoryUserId,
} from '@/lib/history/translationHistoryStore';

export default function HistoryUserSync() {
  const {user} = useAuth();

  useLayoutEffect(() => {
    setHistoryUserId(user?.uid ?? null);
    if (user?.uid) {
      void refreshHistoryCache();
    }
  }, [user?.uid]);

  return null;
}
