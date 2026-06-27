import type {User} from 'firebase/auth';

export function hasPasswordProvider(user: User): boolean {
  return user.providerData.some(provider => provider.providerId === 'password');
}

export function hasGoogleProvider(user: User): boolean {
  return user.providerData.some(
    provider => provider.providerId === 'google.com',
  );
}
