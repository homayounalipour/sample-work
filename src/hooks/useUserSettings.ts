'use client';

import {useCallback, useSyncExternalStore} from 'react';
import {
  DEFAULT_USER_SETTINGS,
  getUserSettingsSnapshot,
  saveUserSettings,
  subscribeUserSettings,
  type UserSettings,
} from '@/lib/config/userSettings';

export function useUserSettings() {
  const settings = useSyncExternalStore(
    subscribeUserSettings,
    getUserSettingsSnapshot,
    () => DEFAULT_USER_SETTINGS,
  );

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    saveUserSettings(partial);
  }, []);

  return {settings, updateSettings};
}
