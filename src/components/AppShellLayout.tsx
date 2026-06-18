'use client';

import {usePathname} from 'next/navigation';
import {useCallback, useEffect, useState, type PropsWithChildren} from 'react';
import IconButton from '@/kit/IconButton';
import {IconMenu} from '@/kit/icons';
import useOutsideClick from '@/hooks/useOutsideClick';
import {getActiveNavId, getPageMeta} from '@/constants/navigation';
import Sidebar from './Sidebar';

export default function AppShellLayout(props: PropsWithChildren) {
  const {children} = props;
  const pathname = usePathname();
  const activeNav = getActiveNavId(pathname);
  const pageMeta = getPageMeta(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const sidebarRef = useOutsideClick<HTMLElement>({
    handler: closeSidebar,
    enabled: sidebarOpen && isMobileViewport,
  });

  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen, closeSidebar]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      const isDesktop = mq.matches;
      setIsMobileViewport(!isDesktop);
      if (isDesktop) setSidebarOpen(false);
    };

    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-background">
      <Sidebar
        ref={sidebarRef}
        activeNav={activeNav}
        mobileOpen={sidebarOpen}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-start gap-3 border-b border-border px-4 py-3 lg:hidden">
          <IconButton
            aria-label="Open navigation menu"
            className="mt-0.5 shrink-0"
            onClick={openSidebar}
          >
            <IconMenu />
          </IconButton>
          <div className="min-w-0">
            <h1 className="text-h4 text-text">{pageMeta.title}</h1>
            {pageMeta.description && (
              <p className="mt-0.5 text-body-md text-text-subtle">
                {pageMeta.description}
              </p>
            )}
          </div>
        </header>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
