'use client';

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  applyThemeClass,
  readStoredTheme,
  resolveTheme,
  writeStoredTheme,
  type ResolvedTheme,
  type Theme,
} from '@/lib/config/theme';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children}: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(
    () => readStoredTheme() ?? 'system',
  );

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(readStoredTheme() ?? 'system'),
  );

  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyThemeClass(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const resolved = resolveTheme('system');
      setResolvedTheme(resolved);
      applyThemeClass(resolved);
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    writeStoredTheme(next);
  };

  return (
    <ThemeContext.Provider value={{theme, resolvedTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
