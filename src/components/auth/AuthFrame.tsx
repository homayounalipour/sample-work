import {PropsWithChildren} from 'react';
import cn from '@/utils/mergeClassNameTailwind';

type AuthFrameProps = PropsWithChildren<{
  className?: string;
}>;

export default function AuthFrame(props: AuthFrameProps) {
  const {children, className} = props;

  return (
    <div
      className={cn(
        'w-full min-w-0 max-w-[480px] overflow-hidden',
        'rounded-[var(--radius-xl)] border border-border bg-surface',
        'shadow-[0_8px_40px_rgba(0,0,0,0.22)]',
        className,
      )}
    >
      <div className="@container px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        {children}
      </div>
    </div>
  );
}
