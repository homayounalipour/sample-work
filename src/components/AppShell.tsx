'use client';

import {useCallback, useEffect, useState, type PropsWithChildren} from 'react';
import {SidebarProvider} from '@/contexts/SidebarContext';
import Sidebar from './Sidebar';

type AppShellProps = PropsWithChildren<{
  activeNav?: string;
}>;

export default function AppShell(props: AppShellProps) {
  const {children, activeNav = 'new'} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const open = useCallback(() => setSidebarOpen(true), []);
  const close = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen, close]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setSidebarOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <SidebarProvider value={{open, close}}>
      <div className="flex h-screen min-h-0 overflow-hidden bg-background">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={close}
          />
        )}
        <Sidebar
          activeNav={activeNav}
          mobileOpen={sidebarOpen}
          onMobileClose={close}
        />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}
