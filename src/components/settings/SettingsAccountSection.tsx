'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Button from '@/kit/Button';
import Modal from '@/kit/Modal';
import ChangePasswordModal from '@/components/settings/ChangePasswordModal';
import Alert from '@/kit/Alert';
import {useAuth} from '@/contexts/AuthContext';
import {routes} from '@/constants/routes';

export default function SettingsAccountSection() {
  const {canChangePassword, logout} = useAuth();
  const router = useRouter();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleConfirmSignOut = async () => {
    setSignOutConfirmOpen(false);
    await logout();
    router.push(routes.auth.login);
  };

  return (
    <section className="overflow-visible rounded-(--radius-lg) border border-border bg-surface p-4 sm:p-6">
      <h2 className="text-body-md font-semibold text-text">Account</h2>
      <p className="mt-1 text-caption text-text-muted">
        Manage your sign-in and security settings.
      </p>

      {successMessage && (
        <div className="mt-4">
          <Alert
            variant="success"
            title="Success"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {canChangePassword && (
          <Button
            variant="secondary"
            onClick={() => setChangePasswordOpen(true)}
          >
            Change password
          </Button>
        )}
        <Button variant="ghost" onClick={() => setSignOutConfirmOpen(true)}>
          Sign out
        </Button>
      </div>

      {!canChangePassword && (
        <p className="mt-4 text-caption text-text-muted">
          Password changes are not available for Google sign-in accounts.
        </p>
      )}

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSuccess={message => setSuccessMessage(message)}
      />

      <Modal
        open={signOutConfirmOpen}
        onClose={() => setSignOutConfirmOpen(false)}
        title="Sign out?"
        description="Are you sure you want to sign out of your account?"
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setSignOutConfirmOpen(false),
        }}
        primaryAction={{
          label: 'Sign out',
          onClick: () => void handleConfirmSignOut(),
        }}
      />
    </section>
  );
}
