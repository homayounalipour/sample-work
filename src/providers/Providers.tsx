import {AuthProvider} from '@/contexts/AuthContext';
import {ThemeProvider} from '@/contexts/ThemeContext';
import {PropsWithChildren} from 'react';

export default function Providers(props: PropsWithChildren) {
  const {children} = props;
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
