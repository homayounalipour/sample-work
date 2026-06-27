import {routes} from '@/constants/routes';

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  title: string;
  description?: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: routes.app.dashboard,
    icon: '▦',
    title: 'Dashboard',
    description: 'Overview of your translation activity.',
  },
  {
    id: 'new',
    label: 'New Translation',
    href: routes.app.new,
    icon: '✦',
    title: 'New Translation',
    description: 'Upload an image and translate text instantly.',
  },
  {
    id: 'history',
    label: 'History',
    href: routes.app.history,
    icon: '◷',
    title: 'History',
    description: 'Browse your previous translations.',
  },
  {
    id: 'favorites',
    label: 'Favorites',
    href: routes.app.favorites,
    icon: '♡',
    title: 'Favorites',
    description: 'Quick access to saved translations.',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: routes.app.settings,
    icon: '⚙',
    title: 'Settings',
    description: 'Manage your account and preferences.',
  },
];

export function getActiveNavId(pathname: string): string {
  if (pathname === routes.auth.login || pathname === routes.auth.register) {
    return '';
  }

  const match = NAV_ITEMS.find(
    item => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return match?.id ?? 'new';
}

const AUTH_PAGE_META: Record<string, Pick<NavItem, 'title' | 'description'>> = {
  [routes.auth.login]: {
    title: 'Sign in',
    description: 'Sign in to access your translations and history.',
  },
  [routes.auth.register]: {
    title: 'Create account',
    description: 'Create an account to save your translations and history.',
  },
};

export function getPageMeta(
  pathname: string,
): Pick<NavItem, 'title' | 'description'> {
  const authMeta = AUTH_PAGE_META[pathname];
  if (authMeta) {
    return authMeta;
  }

  const match = NAV_ITEMS.find(
    item => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  if (match) {
    return {title: match.title, description: match.description};
  }

  return {
    title: 'ImageTranslate',
    description: 'Upload an image and translate text instantly.',
  };
}
