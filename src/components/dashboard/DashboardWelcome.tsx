'use client';

import {useAuth} from '@/contexts/AuthContext';
import {formatDashboardDate, getUserFirstName} from '@/lib/dashboard/stats';
import {IconCalendar} from '@/components/dashboard/icons';

export default function DashboardWelcome() {
  const {user} = useAuth();
  const firstName = getUserFirstName(user?.displayName, user?.email);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
          Dashboard
        </p>
        <h1 className="mt-1 text-h3 text-text sm:text-h2">
          <span aria-hidden>👋 </span>
          Welcome back, <span className="text-primary">{firstName}</span>
        </h1>
        <p className="mt-1 text-body-md text-text-subtle">
          Here&apos;s what&apos;s happening with your translations today.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-start rounded-(--radius-md) border border-border bg-surface-subtle px-3 py-2 text-caption text-text-subtle">
        <IconCalendar className="h-4 w-4 text-text-muted" aria-hidden />
        <time dateTime={new Date().toISOString().split('T')[0]}>
          {formatDashboardDate()}
        </time>
      </div>
    </header>
  );
}
