'use client';

import {FormEvent, useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import Alert from '@/kit/Alert';
import Input from '@/kit/Input';
import AuthDivider from '@/components/auth/AuthDivider';
import GoogleButton from '@/components/auth/GoogleButton';
import PasswordField from '@/components/auth/PasswordField';
import {IconLock, IconMail, IconUser} from '@/kit/icons';
import {useAuth} from '@/contexts/AuthContext';
import {routes} from '@/constants/routes';
import {getAuthErrorMessage} from '@/lib/firebase/errors';
import type {RegisterFormState} from '@/types/auth';
import {Button} from '@/kit';

const INITIAL_STATE: RegisterFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldLabelClass = 'mb-1.5 block text-sm text-text-subtle';
const fieldInputClass =
  'h-11 min-w-0 rounded-[var(--radius-md)] border-border/80 bg-background-muted/40 pl-11';

export default function RegisterForm() {
  const {register} = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormState>(INITIAL_STATE);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();

    if (!firstName) {
      setError('Please enter your first name.');
      return;
    }

    if (!lastName) {
      setError('Please enter your last name.');
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, form.password, `${firstName} ${lastName}`);
      router.push(routes.app.new);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="@container min-w-0 border-border/60 px-6 py-8 sm:px-8 sm:py-10 lg:border-l lg:px-10">
      <GoogleButton label="Sign up with Google" onError={setError} />

      <AuthDivider text="or sign up with email" />

      <form onSubmit={handleSubmit} className="min-w-0 space-y-4">
        {error && <Alert variant="error" title={error} />}

        <div className="grid grid-cols-1 gap-4 @[22rem]:grid-cols-2 @[22rem]:gap-3">
          <div className="min-w-0">
            <label htmlFor="register-first-name" className={fieldLabelClass}>
              First name
            </label>
            <Input
              id="register-first-name"
              type="text"
              autoComplete="given-name"
              placeholder="Jane"
              value={form.firstName}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              leftIcon={<IconUser className="h-4 w-4" />}
              className={fieldInputClass}
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="register-last-name" className={fieldLabelClass}>
              Last name
            </label>
            <Input
              id="register-last-name"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              value={form.lastName}
              onChange={event =>
                setForm(current => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              leftIcon={<IconUser className="h-4 w-4" />}
              className={fieldInputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className={fieldLabelClass}>
            Email address
          </label>
          <Input
            id="register-email"
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
          <label htmlFor="register-password" className={fieldLabelClass}>
            Password
          </label>
          <PasswordField
            id="register-password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={event =>
              setForm(current => ({...current, password: event.target.value}))
            }
            leftIcon={<IconLock className="h-4 w-4" />}
            className={fieldInputClass}
          />
        </div>

        <div>
          <label
            htmlFor="register-confirm-password"
            className={fieldLabelClass}
          >
            Confirm password
          </label>
          <PasswordField
            id="register-confirm-password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={event =>
              setForm(current => ({
                ...current,
                confirmPassword: event.target.value,
              }))
            }
            leftIcon={<IconLock className="h-4 w-4" />}
            className={fieldInputClass}
          />
        </div>

        <Button type="submit" isLoading={isLoading} fullWidth className="mt-1">
          Create free account
        </Button>

        <p className="text-center text-xs leading-relaxed text-text-muted">
          By creating an account, you agree to our{' '}
          <Link href="#" className="text-primary hover:text-primary-hover">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-primary hover:text-primary-hover">
            Privacy Policy
          </Link>
          .
        </p>

        <p className="text-center text-sm text-text-subtle">
          Already have an account?{' '}
          <Link
            href={routes.auth.login}
            className="font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
