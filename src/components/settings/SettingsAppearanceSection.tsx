'use client';

import Select from '@/kit/Select';
import {useTheme} from '@/contexts/ThemeContext';
import type {Theme} from '@/lib/config/theme';

const THEME_OPTIONS: {id: Theme; name: string; description: string}[] = [
  {id: 'light', name: 'Light', description: 'Always use light mode'},
  {id: 'dark', name: 'Dark', description: 'Always use dark mode'},
  {id: 'system', name: 'System', description: 'Match your device settings'},
];

export default function SettingsAppearanceSection() {
  const {theme, setTheme} = useTheme();

  return (
    <section className="overflow-visible rounded-(--radius-lg) border border-border bg-surface p-4 sm:p-6">
      <h2 className="text-body-md font-semibold text-text">Appearance</h2>
      <p className="mt-1 text-caption text-text-muted">
        Choose how the app looks on your device.
      </p>
      <div className="mt-4">
        <Select<Theme>
          label="Theme"
          value={theme}
          options={THEME_OPTIONS}
          onChange={setTheme}
        />
      </div>
    </section>
  );
}
