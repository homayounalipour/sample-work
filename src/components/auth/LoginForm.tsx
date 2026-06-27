'use client';

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {sendPasswordResetEmail} from 'firebase/auth';
import Alert from '@/kit/Alert';
import Input from '@/kit/Input';
import Checkbox from '@/kit/Checkbox';
import AuthBrand from '@/components/auth/AuthBrand';
import AuthDivider from '@/components/auth/AuthDivider';
import GoogleButton from '@/components/auth/GoogleButton';
import PasswordField from '@/components/auth/PasswordField';
import {IconLock, IconMail} from '@/kit/icons';
import {useAuth} from '@/contexts/AuthContext';
import {auth} from '@/lib/firebase/client';
import {routes} from '@/constants/routes';
import {getAuthErrorMessage} from '@/lib/firebase/errors';
import type {AuthFormState} from '@/types/auth';
import {Button} from '@/kit';

const INITIAL_STATE: AuthFormState = {
  email: '',
  password: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldLabelClass = 'mb-1.5 block text-sm text-text-subtle';
const fieldInputClass =
  'h-11 min-w-0 rounded-[var(--radius-md)] border-border/80 bg-background-muted/40 pl-11';

export default function LoginForm() {
  const {login} = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<AuthFormState>(INITIAL_STATE);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    setError('');
    setInfo('');

    const email = form.email.trim();
    if (!email || !EMAIL_PATTERN.test(email)) {
      setError(
        'Enter your email address above, then try forgot password again.',
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setInfo('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setInfo('');

    const email = form.email.trim();
    if (!EMAIL_PATTERN.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!form.password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, form.password, rememberMe);
      router.push(routes.app.new);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthBrand />

      <div className="mb-5 text-center sm:mb-6 mt-4">
        <h1 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
          Welcome back
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-text-subtle">
          Sign in to continue translating images with AI-powered OCR.
        </p>
      </div>

      <GoogleButton label="Google" onError={setError} />

      <AuthDivider text="or continue with email" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="error" title={error} />}
        {info && <Alert variant="success" title={info} />}

        <div>
          <label htmlFor="login-email" className={fieldLabelClass}>
            Email address
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={event =>
              setForm(current => ({...current, email: event.target.value}))
            }
            leftIcon={<IconMail className="h-4 w-4" />}
            className={fieldInputClass}
          />
        </div>

        <div>
          <label htmlFor="login-password" className={fieldLabelClass}>
            Password
          </label>
          <PasswordField
            id="login-password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={event =>
              setForm(current => ({...current, password: event.target.value}))
            }
            leftIcon={<IconLock className="h-4 w-4" />}
            className={fieldInputClass}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Checkbox
            checked={rememberMe}
            onChange={setRememberMe}
            label="Remember me"
            className="[&_span]:text-sm [&_span]:text-text-subtle"
          />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="self-start text-sm font-medium text-primary transition-colors hover:text-primary-hover sm:self-auto"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" isLoading={isLoading} fullWidth className="mt-1">
          Sign in
        </Button>

        <p className="pt-1 text-center text-sm text-text-subtle">
          Don&apos;t have an account?{' '}
          <Link
            href={routes.auth.register}
            className="font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Create one free
          </Link>
        </p>
      </form>
    </>
  );
}
