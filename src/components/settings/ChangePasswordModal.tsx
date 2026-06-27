'use client';

import {useState} from 'react';
import Alert from '@/kit/Alert';
import Button from '@/kit/Button';
import Modal from '@/kit/Modal';
import PasswordField from '@/components/auth/PasswordField';
import {useAuth} from '@/contexts/AuthContext';
import {getAuthErrorMessage} from '@/lib/firebase/errors';

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const EMPTY_FORM: PasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ChangePasswordModal(props: ChangePasswordModalProps) {
  const {open, onClose, onSuccess} = props;
  const {changePassword} = useAuth();
  const [form, setForm] = useState<PasswordForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    setForm(EMPTY_FORM);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setForm(EMPTY_FORM);
      onSuccess?.('Password updated successfully.');
      onClose();
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change password"
      description="Enter your current password and choose a new one."
      className="max-w-lg"
    >
      <div className="space-y-4">
        {error && (
          <Alert
            variant="error"
            title="Could not update password"
            message={error}
          />
        )}
        <div>
          <label
            htmlFor="current-password"
            className="mb-2 block text-body-md font-medium text-text"
          >
            Current password
          </label>
          <PasswordField
            id="current-password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={event =>
              setForm(current => ({
                ...current,
                currentPassword: event.target.value,
              }))
            }
          />
        </div>
        <div>
          <label
            htmlFor="new-password"
            className="mb-2 block text-body-md font-medium text-text"
          >
            New password
          </label>
          <PasswordField
            id="new-password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={event =>
              setForm(current => ({
                ...current,
                newPassword: event.target.value,
              }))
            }
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-body-md font-medium text-text"
          >
            Confirm new password
          </label>
          <PasswordField
            id="confirm-password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={event =>
              setForm(current => ({
                ...current,
                confirmPassword: event.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" disabled={submitting} onClick={handleClose}>
            Cancel
          </Button>
          <Button isLoading={submitting} onClick={() => void handleSubmit()}>
            Update password
          </Button>
        </div>
      </div>
    </Modal>
  );
}
