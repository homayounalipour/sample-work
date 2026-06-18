export {
  DEFAULT_APP_CONFIG,
  DEFAULT_SOURCE_CODE,
  DEFAULT_TARGET_CODE,
  type AppConfig,
} from '@/lib/config/defaults';
export {getServerConfig} from '@/lib/config/server';
export {
  DEFAULT_USER_SETTINGS,
  getEffectiveConfig,
  getUserSettingsSnapshot,
  loadUserSettings,
  resetUserSettings,
  saveUserSettings,
  subscribeUserSettings,
  type UserSettings,
} from '@/lib/config/userSettings';
