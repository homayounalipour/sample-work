import AuthToggle from '@/components/auth/AuthToggle';
import {PropsWithChildren} from 'react';
import cn from '@/utils/mergeClassNameTailwind';

export default function RegisterSplitShell(props: PropsWithChildren) {
  const {children} = props;

  return (
    <div className="relative z-10 my-auto flex w-full max-w-[920px] flex-col items-center py-2">
      <div
        className={cn(
          'w-full min-w-0 overflow-hidden',
          'rounded-[var(--radius-xl)] border border-border bg-surface',
          'shadow-[0_8px_40px_rgba(0,0,0,0.22)]',
        )}
      >
        <div className="flex justify-center border-b border-border/60 px-4 py-5 sm:px-6">
          <AuthToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
