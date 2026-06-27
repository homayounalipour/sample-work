'use client';

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import {auth} from '@/lib/firebase/client';
import {hasPasswordProvider} from '@/lib/profile/authProviders';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  canChangePassword: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updatePhotoURL: (url: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({prompt: 'select_account'});

export function AuthProvider({children}: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence,
    );
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (
    email: string,
    password: string,
    displayName?: string,
  ) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (displayName?.trim()) {
      await updateProfile(credential.user, {
        displayName: displayName.trim(),
      });
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateDisplayName = async (name: string) => {
    if (!auth.currentUser) {
      throw new Error('You must be signed in to update your profile.');
    }

    await updateProfile(auth.currentUser, {displayName: name.trim()});
  };

  const updatePhotoURL = async (url: string) => {
    if (!auth.currentUser) {
      throw new Error('You must be signed in to update your profile.');
    }

    await updateProfile(auth.currentUser, {photoURL: url || null});
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const currentUser = auth.currentUser;
    if (!currentUser?.email) {
      throw new Error(
        'You must be signed in with email to change your password.',
      );
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword,
    );
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  };

  const canChangePassword = user ? hasPasswordProvider(user) : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        canChangePassword,
        login,
        register,
        loginWithGoogle,
        logout,
        updateDisplayName,
        updatePhotoURL,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
