'use client';

import IconButton from '@/kit/IconButton';
import {IconMoon, IconSun} from '@/kit/icons';
import {useTheme} from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const {resolvedTheme, setTheme} = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconButton
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={
        resolvedTheme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
    >
      {resolvedTheme === 'dark' ? <IconSun /> : <IconMoon />}
    </IconButton>
  );
}
