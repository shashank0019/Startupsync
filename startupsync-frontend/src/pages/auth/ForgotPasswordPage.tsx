import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { authService } from '../../api/authService';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthField from '../../components/auth/AuthField';
import PasswordField from '../../components/auth/PasswordField';
import { getApiErrorMessage } from '../../utils/apiError';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email.trim());
      setSuccessMessage(response?.message || 'Verification code sent to your email! (Check backend logs for the OTP)');
      setStep('reset');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to send password reset code. Please verify the email address.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode) {
      setError('Please enter the verification code.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        email: email.trim(),
        verificationCode: verificationCode.trim(),
        newPassword,
        confirmPassword,
      });
      setStep('success');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to reset password. Please verify the code and requirements.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm mx-auto">
        {step === 'request' && (
          <>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Reset password
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Enter your registered email and we&apos;ll send you a verification code to reset your password.
            </p>

            <form onSubmit={handleRequestCode} className="mt-8 space-y-5">
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
                {isLoading ? 'Sending code...' : 'Send reset code'}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Enter new password
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              Enter the 6-digit code sent to <strong className="text-neutral-700">{email}</strong> and choose your new password.
            </p>

            {successMessage && (
              <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 flex items-start gap-2">
                <ShieldCheck size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="mt-6 space-y-5">
              <AuthField
                id="verificationCode"
                label="6-Digit Verification Code"
                type="text"
                value={verificationCode}
                onChange={setVerificationCode}
                placeholder="e.g. 123456"
                icon={KeyRound}
                autoComplete="one-time-code"
              />

              <PasswordField
                id="newPassword"
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />

              <PasswordField
                id="confirmPassword"
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />

              {error && (
                <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep('request');
                  }}
                  className="px-4 py-2.5 border border-neutral-300 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-md bg-neutral-900 py-2.5 text-sm font-medium text-white transition-all hover:bg-black focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
                >
                  {isLoading ? 'Updating password...' : 'Update password'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Password reset complete</h2>
            <p className="text-sm text-neutral-500 mb-8">
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-black transition shadow-sm"
            >
              Back to sign in
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Return to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
