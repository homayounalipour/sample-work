import GuestGuard from '@/components/GuestGuard';
import {Inter} from 'next/font/google';
import {PropsWithChildren} from 'react';
import cn from '@/utils/mergeClassNameTailwind';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function AuthLayout(props: PropsWithChildren) {
  const {children} = props;

  return (
    <GuestGuard>
      <div
        className={cn(
          inter.variable,
          'relative flex min-h-dvh flex-col items-center justify-center',
          'overflow-x-hidden overflow-y-auto px-3 py-6 sm:px-4 sm:py-10',
          'font-(family-name:--font-inter)',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(99,102,241,0.22),transparent_65%)]"
        />
        {children}
      </div>
    </GuestGuard>
  );
}
