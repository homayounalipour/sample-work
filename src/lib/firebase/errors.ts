import {FirebaseError} from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
  'auth/configuration-not-found':
    'Firebase Authentication is not configured. In Firebase Console, open Authentication, click Get started, then enable Email/Password under Sign-in method.',
  'auth/operation-not-allowed':
    'Email/password sign-in is disabled. Enable Email/Password in Firebase Console under Authentication > Sign-in method.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/popup-blocked':
    'Pop-up was blocked by your browser. Allow pop-ups and try again.',
  'auth/account-exists-with-different-credential':
    'An account already exists with this email using a different sign-in method.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
};

const CONFIGURATION_NOT_FOUND_MESSAGE =
  'Firebase Authentication is not configured. In Firebase Console, open Authentication, click Get started, then enable Email/Password under Sign-in method.';

function isConfigurationNotFoundError(error: FirebaseError): boolean {
  return (
    error.code === 'auth/configuration-not-found' ||
    error.code === 'auth/operation-not-allowed' ||
    error.message.includes('CONFIGURATION_NOT_FOUND')
  );
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (isConfigurationNotFoundError(error)) {
      return CONFIGURATION_NOT_FOUND_MESSAGE;
    }

    return (
      AUTH_ERROR_MESSAGES[error.code] ??
      'Something went wrong. Please try again.'
    );
  }

  if (
    error instanceof Error &&
    error.message.includes('CONFIGURATION_NOT_FOUND')
  ) {
    return CONFIGURATION_NOT_FOUND_MESSAGE;
  }

  return 'Something went wrong. Please try again.';
}
