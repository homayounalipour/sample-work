export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'translation-app-theme';

const VALID_THEMES = new Set<Theme>(['light', 'dark', 'system']);

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function resolveTheme(preference: Theme): ResolvedTheme {
  if (preference === 'system') {
    return getSystemTheme();
  }

  return preference;
}

export function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = localStorage.getItem(THEME_STORAGE_KEY);
  if (raw === null || !VALID_THEMES.has(raw as Theme)) {
    return null;
  }

  return raw as Theme;
}

export function writeStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function applyThemeClass(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.remove('light-mode', 'dark-mode');
  root.classList.add(`${resolved}-mode`);
}

export function getThemeInitScript(): string {
  return `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var t=s==='light'||s==='dark'||s==='system'?s:null;var r=t==='light'||t==='dark'?t:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.remove('light-mode','dark-mode');document.documentElement.classList.add(r+'-mode');}catch(e){}})();`;
}
