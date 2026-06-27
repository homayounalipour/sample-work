'use client';

import {useEffect, useState} from 'react';
import Alert from '@/kit/Alert';
import Button from '@/kit/Button';
import Input from '@/kit/Input';
import AvatarUploadControl from '@/components/settings/AvatarUploadControl';
import {useAuth} from '@/contexts/AuthContext';
import {getAuthErrorMessage} from '@/lib/firebase/errors';

export default function SettingsProfileSection() {
  const {user, updateDisplayName} = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    variant: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setDisplayName(user?.displayName ?? '');
  }, [user?.displayName]);

  if (!user?.email) {
    return null;
  }

  const trimmedName = displayName.trim();
  const hasNameChanges = trimmedName !== (user.displayName ?? '');

  const handleSaveName = async () => {
    if (!trimmedName) {
      setFeedback({variant: 'error', message: 'Please enter your name.'});
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      await updateDisplayName(trimmedName);
      setFeedback({variant: 'success', message: 'Name updated successfully.'});
    } catch (error) {
      setFeedback({
        variant: 'error',
        message: getAuthErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="overflow-visible rounded-(--radius-lg) border border-border bg-surface p-4 sm:p-6">
      <h2 className="text-body-md font-semibold text-text">Profile</h2>
      <p className="mt-1 text-caption text-text-muted">
        Update your photo and personal details.
      </p>

      <div className="mt-6">
        <AvatarUploadControl
          displayName={user.displayName}
          email={user.email}
          photoURL={user.photoURL}
          onSuccess={message => setFeedback({variant: 'success', message})}
          onError={message => setFeedback({variant: 'error', message})}
        />
      </div>

      {feedback && (
        <div className="mt-4">
          <Alert
            variant={feedback.variant}
            title={feedback.variant === 'success' ? 'Saved' : 'Error'}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="profile-display-name"
            className="mb-2 block text-body-md font-medium text-text"
          >
            Name
          </label>
          <Input
            id="profile-display-name"
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label
            htmlFor="profile-email"
            className="mb-2 block text-body-md font-medium text-text"
          >
            Email
          </label>
          <Input
            id="profile-email"
            value={user.email}
            readOnly
            disabled
            className="cursor-not-allowed opacity-70"
          />
          <p className="mt-2 text-caption text-text-muted">
            Email cannot be changed here.
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            isLoading={saving}
            disabled={!hasNameChanges || saving}
            onClick={() => void handleSaveName()}
          >
            Save name
          </Button>
        </div>
      </div>
    </section>
  );
}
