import AppShellLayout from '@/components/AppShellLayout';
import AuthGuard from '@/components/AuthGuard';
import HistoryUserSync from '@/components/HistoryUserSync';
import {PropsWithChildren} from 'react';

export default function AppLayout(props: PropsWithChildren) {
  const {children} = props;
  return (
    <AuthGuard>
      <HistoryUserSync />
      <AppShellLayout>{children}</AppShellLayout>
    </AuthGuard>
  );
}
