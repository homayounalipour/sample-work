'use client';

import {useMemo} from 'react';
import DashboardQuickActions from '@/components/dashboard/DashboardQuickActions';
import DashboardRecentActivity from '@/components/dashboard/DashboardRecentActivity';
import DashboardStatCards from '@/components/dashboard/DashboardStatCards';
import DashboardWeeklyChart from '@/components/dashboard/DashboardWeeklyChart';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import {computeDashboardStats} from '@/lib/dashboard/stats';
import {useTranslationHistory} from '@/hooks/useTranslationHistory';

export default function DashboardPageContent() {
  const {records, toggleFavorite} = useTranslationHistory();

  const stats = useMemo(() => computeDashboardStats(records), [records]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
      <DashboardWelcome />

      <div className="mt-6">
        <DashboardStatCards stats={stats} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <DashboardQuickActions totalScans={records.length} />
          <DashboardWeeklyChart data={stats.weeklyChart} />
        </div>

        <DashboardRecentActivity
          records={records}
          onToggleFavorite={id => {
            void toggleFavorite(id);
          }}
        />
      </div>
    </div>
  );
}
