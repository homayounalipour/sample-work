import AuthFrame from '@/components/auth/AuthFrame';
import AuthToggle from '@/components/auth/AuthToggle';
import {PropsWithChildren} from 'react';

export default function AuthPageShell(props: PropsWithChildren) {
  const {children} = props;

  return (
    <div className="relative z-10 my-auto flex w-full max-w-[480px] flex-col items-center py-2">
      <AuthFrame>
        <div className="mb-6 flex justify-center sm:mb-8">
          <AuthToggle />
        </div>
        {children}
      </AuthFrame>
    </div>
  );
}
