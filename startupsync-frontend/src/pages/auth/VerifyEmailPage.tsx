import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';
import { Button } from '../../components/common';

interface LocationState {
  email?: string;
}

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    const state = location.state as LocationState | undefined;
    if (state?.email) {
      setEmail(state.email);
    }
  }, [location.state]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [resendCountdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.verifyEmail({
        email,
        verificationCode,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to verify email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setIsLoading(true);
    setResendDisabled(true);
    setResendCountdown(60);

    try {
      await authService.sendEmailVerificationCode(email);
      setSuccess(false);
      setError('');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to resend verification code. Please try again.'
      );
      setResendDisabled(false);
      setResendCountdown(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-neutral-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900">Email Verified</h2>
              <p className="text-neutral-500 mt-2 text-sm">Your email has been verified successfully. Redirecting to your workspace...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 mb-2">
          Check your email
        </h2>
        <p className="text-center text-sm text-neutral-500 mb-8">
            Enter the verification code sent to your email address to complete registration.
        </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-rose-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-md border-0 py-2.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-900 sm:text-sm sm:leading-6 transition-all px-3"
                required
              />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-neutral-900 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="block w-full rounded-md border-0 py-3 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-900 sm:text-2xl sm:leading-6 transition-all text-center tracking-widest font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !verificationCode}
              className="flex w-full justify-center rounded-md bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500 mb-3">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendDisabled || isLoading}
            className="text-sm font-medium text-neutral-900 hover:text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
