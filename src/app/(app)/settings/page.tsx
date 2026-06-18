import SettingsPanel from '@/components/SettingsPanel';
import {HeaderTitle} from '@/kit/HeaderTitle';

export default function SettingsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
      <HeaderTitle
        title="Settings"
        description="Manage OCR and translation providers for your workspace."
      />
      <div className="flex flex-1 flex-col py-6">
        <SettingsPanel />
      </div>
    </div>
  );
}
