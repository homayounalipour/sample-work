'use client';

import SettingsAccountSection from '@/components/settings/SettingsAccountSection';
import SettingsAppearanceSection from '@/components/settings/SettingsAppearanceSection';
import SettingsProfileSection from '@/components/settings/SettingsProfileSection';
import SettingsWorkspaceSection from '@/components/settings/SettingsWorkspaceSection';

export default function SettingsPanel() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <SettingsProfileSection />
      <SettingsAppearanceSection />
      <SettingsWorkspaceSection />
      <SettingsAccountSection />
    </div>
  );
}
