import {AuthProvider} from '@/contexts/AuthContext';
import {PropsWithChildren} from 'react';

export default function Providers(props: PropsWithChildren) {
  const {children} = props;
  return <AuthProvider>{children}</AuthProvider>;
}
