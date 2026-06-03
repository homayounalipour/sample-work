'use client';

import type {PropsWithChildren} from 'react';
import Sidebar from './Sidebar';

type AppShellProps = PropsWithChildren<{
  activeNav?: string;
}>;

export default function AppShell({children, activeNav = 'new'}: AppShellProps) {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-background">
      <Sidebar activeNav={activeNav} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
