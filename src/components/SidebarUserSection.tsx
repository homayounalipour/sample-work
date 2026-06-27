'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Avatar from '@/kit/Avatar';
import Button from '@/kit/Button';
import Modal from '@/kit/Modal';
import {useAuth} from '@/contexts/AuthContext';
import {routes} from '@/constants/routes';
import cn from '@/utils/mergeClassNameTailwind';

export default function SidebarUserSection() {
  const {user, logout} = useAuth();
  const router = useRouter();
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  if (!user?.email) {
    return null;
  }

  const displayName = user.displayName?.trim();
  const primaryLabel = displayName || user.email;

  const handleConfirmSignOut = async () => {
    setSignOutConfirmOpen(false);
    await logout();
    router.push(routes.auth.login);
  };

  return (
    <div className="space-y-3">
      <Link
        href={routes.app.settings}
        className={cn(
          'flex items-center gap-3 rounded-md border border-border bg-surface p-3 transition-colors',
          'hover:bg-surface-subtle',
        )}
      >
        <Avatar
          src={user.photoURL ?? undefined}
          name={displayName ?? user.email}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-md font-medium text-text">
            {primaryLabel}
          </p>
          {displayName && (
            <p className="truncate text-caption text-text-muted pt-1">
              {user.email}
            </p>
          )}
          {!displayName && (
            <p className="truncate text-caption text-text-muted pt-2">
              Signed in
            </p>
          )}
        </div>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="h-6"
        fullWidth
        onClick={() => setSignOutConfirmOpen(true)}
      >
        Sign out
      </Button>

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
    </div>
  );
}
