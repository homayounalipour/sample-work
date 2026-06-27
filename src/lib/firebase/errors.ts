import {FirebaseError} from 'firebase/app';

const STORAGE_ERROR_MESSAGES: Record<string, string> = {
  'storage/unauthorized':
    'You do not have permission to upload this photo. Deploy storage rules from firebase/storage.rules.',
  'storage/unauthenticated': 'Sign in again before uploading a profile photo.',
  'storage/canceled': 'Upload was canceled.',
  'storage/unknown':
    'Could not reach Firebase Storage. Enable Storage in Firebase Console and configure bucket CORS (see firebase/cors.json).',
  'storage/retry-limit-exceeded':
    'Upload timed out. Check your connection and try again.',
  'storage/quota-exceeded': 'Storage quota exceeded.',
  'storage/invalid-checksum': 'Upload failed. Please try a different image.',
};

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
  'auth/requires-recent-login':
    'For security, please sign out and sign in again before changing your password.',
  'auth/invalid-login-credentials': 'Current password is incorrect.',
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

function isLikelyStorageCorsError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes('cors') ||
    message.includes('failed to fetch') ||
    message.includes('network error') ||
    message.includes('err_failed')
  );
}

export function getStorageErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return (
      STORAGE_ERROR_MESSAGES[error.code] ??
      'Could not upload profile photo. Please try again.'
    );
  }

  if (isLikelyStorageCorsError(error)) {
    return (
      'Upload blocked by Firebase Storage setup. In Firebase Console, open Storage and click Get started, ' +
      'deploy rules from firebase/storage.rules, then apply CORS with: ' +
      'gcloud storage buckets update gs://YOUR_BUCKET --cors-file=firebase/cors.json'
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Could not upload profile photo. Please try again.';
}
