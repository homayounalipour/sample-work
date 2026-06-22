import AppShellLayout from '@/components/AppShellLayout';
import AuthGuard from '@/components/AuthGuard';
import {PropsWithChildren} from 'react';

export default function AppLayout(props: PropsWithChildren) {
  const {children} = props;
  return (
    <AuthGuard>
      <AppShellLayout>{children}</AppShellLayout>
    </AuthGuard>
  );
}
