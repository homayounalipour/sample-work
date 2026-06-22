'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import cn from '@/utils/mergeClassNameTailwind';
import Spinner from '@/kit/Spinner';
import {IconGoogle} from '@/kit/icons';
import {useAuth} from '@/contexts/AuthContext';
import {routes} from '@/constants/routes';
import {getAuthErrorMessage} from '@/lib/firebase/errors';

type GoogleButtonProps = {
  label: string;
  onError?: (message: string) => void;
};

export default function GoogleButton(props: GoogleButtonProps) {
  const {label, onError} = props;
  const {loginWithGoogle} = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    onError?.('');
    setIsLoading(true);

    try {
      await loginWithGoogle();
      router.push(routes.app.new);
    } catch (err) {
      onError?.(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleClick}
      className={cn(
        'inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-[var(--radius-md)]',
        'border border-border bg-background-muted/30 text-sm font-medium text-text',
        'transition-colors hover:border-border-strong hover:bg-background-muted/60',
        'disabled:pointer-events-none disabled:opacity-50',
      )}
    >
      {isLoading ? <Spinner size="sm" /> : <IconGoogle className="h-5 w-5" />}
      {label}
    </button>
  );
}
