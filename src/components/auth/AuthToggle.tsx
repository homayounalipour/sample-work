'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import cn from '@/utils/mergeClassNameTailwind';
import {routes} from '@/constants/routes';

const tabs = [
  {label: 'Sign in', href: routes.auth.login},
  {label: 'Create account', href: routes.auth.register},
] as const;

export default function AuthToggle() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Authentication"
      className="flex w-full max-w-[320px] rounded-full border border-border/80 bg-background-muted/40 p-1 sm:max-w-none sm:inline-flex"
    >
      {tabs.map(tab => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex-1 rounded-full px-3 py-2 text-center text-xs font-medium transition-all sm:flex-none sm:px-5 sm:text-sm',
              isActive
                ? 'bg-primary text-white shadow-[0_0_24px_rgba(99,102,241,0.4)]'
                : 'border border-border/60 text-text-subtle hover:border-border-strong hover:text-text',
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
