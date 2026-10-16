import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthField from '../../components/auth/AuthField';
import { getApiErrorMessage } from '../../utils/apiError';
import PasswordField from '../../components/auth/PasswordField';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid email or password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Please enter your details to access your workspace.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-black focus:ring-black"
              />
              <span className="text-sm text-slate-600">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-neutral-900 hover:text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-all"
            >
              Forgot password?
            </Link>
          </div>

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
            {isLoading ? 'Signing in...' : 'Sign in to account'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-neutral-900 hover:text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-all">
            Sign up for free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
