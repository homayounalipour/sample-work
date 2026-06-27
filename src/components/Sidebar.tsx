'use client';

import Link from 'next/link';
import {forwardRef} from 'react';
import ProgressBar from '@/kit/ProgressBar';
import {NAV_ITEMS} from '@/constants/navigation';
import SidebarUserSection from '@/components/SidebarUserSection';
import ThemeToggle from '@/components/ThemeToggle';
import cn from '@/utils/mergeClassNameTailwind';

type SidebarProps = {
  activeNav?: string;
  mobileOpen?: boolean;
  onNavigate?: () => void;
};

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  function Sidebar(props, ref) {
    const {activeNav = 'new', mobileOpen = false, onNavigate} = props;

    return (
      <aside
        ref={ref}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-72 shrink-0 flex-col border-r border-border bg-background-subtle px-4 py-6 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-8 flex items-center justify-between gap-3 sm:px-2">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.ico"
              alt="ImageTranslate logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-md"
            />
            <div>
              <p className="text-body-md font-semibold text-text">
                ImageTranslate
              </p>
              <p className="text-caption text-primary">AI</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => onNavigate?.()}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-body-md transition-colors',
                  isActive
                    ? 'bg-primary/15 font-medium text-primary'
                    : 'text-text-subtle hover:bg-surface-subtle hover:text-text',
                )}
              >
                <span className="w-5 text-center text-sm opacity-80">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 px-2">
          <ProgressBar value={6.5} max={10} showLabel label="Storage" />
          <SidebarUserSection />
        </div>
      </aside>
    );
  },
);

export default Sidebar;
