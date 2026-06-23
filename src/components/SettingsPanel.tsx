'use client';

import Button from '@/kit/Button';
import Input from '@/kit/Input';
import Select from '@/kit/Select';
import {OCR_PROVIDER_OPTIONS} from '@/lib/ocr/providers';
import {TRANSLATION_PROVIDER_OPTIONS} from '@/lib/translation/providers';
import type {OcrProviderId, TranslationProviderId} from '@/lib/providers/types';
import {resetUserSettings} from '@/lib/config/userSettings';
import {useUserSettings} from '@/hooks/useUserSettings';
import {useTheme} from '@/contexts/ThemeContext';
import type {Theme} from '@/lib/config/theme';

const THEME_OPTIONS: {id: Theme; name: string; description: string}[] = [
  {id: 'light', name: 'Light', description: 'Always use light mode'},
  {id: 'dark', name: 'Dark', description: 'Always use dark mode'},
  {id: 'system', name: 'System', description: 'Match your device settings'},
];

export default function SettingsPanel() {
  const {settings, updateSettings} = useUserSettings();
  const {theme, setTheme} = useTheme();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
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

      <section className="overflow-visible rounded-(--radius-lg) border border-border bg-surface p-4 sm:p-6">
        <h2 className="text-body-md font-semibold text-text">OCR Engine</h2>
        <p className="mt-1 text-caption text-text-muted">
          Choose how text is extracted from uploaded images.
        </p>
        <div className="mt-4">
          <Select<OcrProviderId>
            label="OCR provider"
            value={settings.ocrProvider}
            options={OCR_PROVIDER_OPTIONS}
            onChange={ocrProvider => updateSettings({ocrProvider})}
          />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-body-md font-medium text-text">
            Minimum confidence (%)
          </label>
          <Input
            type="number"
            min={0}
            max={100}
            value={String(settings.ocrMinConfidence)}
            onChange={event => {
              const parsed = Number(event.target.value);
              if (!Number.isFinite(parsed)) return;
              updateSettings({
                ocrMinConfidence: Math.min(100, Math.max(0, parsed)),
              });
            }}
          />
          <p className="mt-1 text-caption text-text-muted">
            Blocks below this confidence score are ignored during OCR.
          </p>
        </div>
      </section>

      <section className="overflow-visible rounded-(--radius-lg) border border-border bg-surface p-4 sm:p-6">
        <h2 className="text-body-md font-semibold text-text">
          Translation Engine
        </h2>
        <p className="mt-1 text-caption text-text-muted">
          Choose the service used to translate detected text blocks.
        </p>
        <div className="mt-4">
          <Select<TranslationProviderId>
            label="Translation provider"
            value={settings.translationProvider}
            options={TRANSLATION_PROVIDER_OPTIONS}
            onChange={translationProvider =>
              updateSettings({translationProvider})
            }
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={resetUserSettings}>
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}
