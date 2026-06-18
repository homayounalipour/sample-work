import {DEFAULT_APP_CONFIG, type AppConfig} from '@/lib/config/defaults';
import type {OcrProviderId, TranslationProviderId} from '@/lib/providers/types';

export type UserSettings = {
  ocrProvider: OcrProviderId;
  translationProvider: TranslationProviderId;
  ocrMinConfidence: number;
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  ocrProvider: DEFAULT_APP_CONFIG.ocr.provider,
  translationProvider: DEFAULT_APP_CONFIG.translation.provider,
  ocrMinConfidence: DEFAULT_APP_CONFIG.ocr.minConfidence,
};

const STORAGE_KEY = 'translation-app-user-settings';

const listeners = new Set<() => void>();

let cachedSnapshot: UserSettings = DEFAULT_USER_SETTINGS;
let cachedStorageValue: string | null | undefined;

function syncSnapshotFromStorage(): UserSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_USER_SETTINGS;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (cachedStorageValue !== undefined && raw === cachedStorageValue) {
    return cachedSnapshot;
  }

  cachedStorageValue = raw;
  cachedSnapshot =
    raw === null ? DEFAULT_USER_SETTINGS : parseStoredSettings(raw);

  return cachedSnapshot;
}

function commitSnapshot(next: UserSettings, serialized: string): UserSettings {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, serialized);
    cachedStorageValue = serialized;
  }

  cachedSnapshot = next;
  return next;
}

function notifySubscribers() {
  listeners.forEach(listener => listener());
}

function isOcrProviderId(value: unknown): value is OcrProviderId {
  return value === 'tesseract';
}

function isTranslationProviderId(
  value: unknown,
): value is TranslationProviderId {
  return value === 'mymemory';
}

function parseStoredSettings(raw: string | null): UserSettings {
  if (!raw) return DEFAULT_USER_SETTINGS;

  try {
    const parsed = JSON.parse(raw) as Partial<UserSettings>;

    return {
      ocrProvider: isOcrProviderId(parsed.ocrProvider)
        ? parsed.ocrProvider
        : DEFAULT_USER_SETTINGS.ocrProvider,
      translationProvider: isTranslationProviderId(parsed.translationProvider)
        ? parsed.translationProvider
        : DEFAULT_USER_SETTINGS.translationProvider,
      ocrMinConfidence:
        typeof parsed.ocrMinConfidence === 'number' &&
        parsed.ocrMinConfidence >= 0 &&
        parsed.ocrMinConfidence <= 100
          ? parsed.ocrMinConfidence
          : DEFAULT_USER_SETTINGS.ocrMinConfidence,
    };
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function getUserSettingsSnapshot(): UserSettings {
  return syncSnapshotFromStorage();
}

export function loadUserSettings(): UserSettings {
  return getUserSettingsSnapshot();
}

export function saveUserSettings(partial: Partial<UserSettings>): UserSettings {
  const next = {...syncSnapshotFromStorage(), ...partial};

  if (typeof window !== 'undefined') {
    commitSnapshot(next, JSON.stringify(next));
    notifySubscribers();
  }

  return next;
}

export function resetUserSettings(): UserSettings {
  if (typeof window !== 'undefined') {
    commitSnapshot(
      DEFAULT_USER_SETTINGS,
      JSON.stringify(DEFAULT_USER_SETTINGS),
    );
    notifySubscribers();
  }

  return DEFAULT_USER_SETTINGS;
}

export function subscribeUserSettings(callback: () => void): () => void {
  listeners.add(callback);

  if (typeof window !== 'undefined') {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        cachedStorageValue = undefined;
        callback();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      listeners.delete(callback);
      window.removeEventListener('storage', onStorage);
    };
  }

  return () => {
    listeners.delete(callback);
  };
}

export function getEffectiveConfig(settings?: UserSettings): AppConfig {
  const userSettings = settings ?? loadUserSettings();

  return {
    ...DEFAULT_APP_CONFIG,
    ocr: {
      ...DEFAULT_APP_CONFIG.ocr,
      provider: userSettings.ocrProvider,
      minConfidence: userSettings.ocrMinConfidence,
    },
    translation: {
      ...DEFAULT_APP_CONFIG.translation,
      provider: userSettings.translationProvider,
    },
  };
}
