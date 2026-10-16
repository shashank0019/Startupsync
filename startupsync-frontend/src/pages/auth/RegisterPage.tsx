import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthField from '../../components/auth/AuthField';
import PasswordField from '../../components/auth/PasswordField';
import { getApiErrorMessage } from '../../utils/apiError';

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    const { firstName, lastName } = splitFullName(fullName);
    if (!firstName) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    try {
      await register(firstName, lastName, email, password, confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create your account. Please check your details and try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Join StartupSync and start building your dream team.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <AuthField
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="John Doe"
            icon={User}
            autoComplete="name"
          />

          <AuthField
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            icon={Mail}
            autoComplete="email"
          />

          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />

          <label className="flex cursor-pointer items-start gap-3 pt-1">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
            />
            <span className="text-sm leading-6 text-slate-600">
              I agree to the{' '}
              <Link to="/register" className="font-semibold text-black hover:text-gray-700 underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/register" className="font-semibold text-black hover:text-gray-700 underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          {error && (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-neutral-900 py-2.5 text-sm font-medium text-white transition-all hover:bg-black focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-neutral-900 hover:text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
