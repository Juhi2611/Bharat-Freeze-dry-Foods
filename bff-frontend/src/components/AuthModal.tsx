import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { X, Lock, Mail, User, Building, Globe, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Matches backend OTP_RESEND_COOLDOWN_SECONDS. */
const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen } = useCart();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('India');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const resetOtpState = () => {
    setOtp('');
    setOtpSent(false);
    setEmailVerified(false);
    setResendCooldown(0);
  };

  // F9: reset OTP flow whenever the modal closes (or reopens from closed).
  useEffect(() => {
    if (!isAuthOpen) {
      resetOtpState();
    }
  }, [isAuthOpen]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  if (!isAuthOpen) return null;

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    resetOtpState();
  };

  const handleUseDifferentEmail = () => {
    resetOtpState();
  };

  const handleSendOtp = async () => {
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      toast.error('Enter a valid email address first.');
      return;
    }
    if (resendCooldown > 0) return;
    setIsSendingOtp(true);
    try {
      await api.sendEmailOtp(trimmed);
      setOtpSent(true);
      setEmailVerified(false);
      setOtp('');
      setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      toast.success('OTP sent', { description: 'Check your inbox for the 6-digit code.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to send OTP.';
      toast.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length !== 6) {
      toast.error('Enter the 6-digit OTP from your email.');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      await api.verifyEmailOtp(email.trim(), otp.trim());
      setEmailVerified(true);
      toast.success('Email verified', { description: 'You can finish creating your account.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OTP verification failed.';
      toast.error(message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        toast.success('Signed in successfully');
      } else {
        if (!emailVerified) {
          toast.error('Verify your email with OTP before creating an account.');
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match.');
          setIsSubmitting(false);
          return;
        }
        await register({
          email: email.trim(),
          password,
          confirm_password: confirmPassword,
          full_name: fullName,
          company_name: companyName,
          country,
        });
        toast.success('Account created', { description: 'Welcome to the BFF customer portal.' });
      }
      setIsAuthOpen(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailLocked = mode === 'signup' && (otpSent || emailVerified);
  const resendLabel =
    resendCooldown > 0
      ? `Resend in ${resendCooldown}s`
      : otpSent
        ? 'Resend'
        : 'Send OTP';

  return (
    <div
      className="auth-modal-overlay fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-black/80 backdrop-blur-md transition-opacity"
      onClick={() => setIsAuthOpen(false)}
    >
      <div
        className="auth-modal-panel relative my-auto max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-sky-500/20 bg-[#0F172A]/95 p-6 text-slate-100 shadow-2xl shadow-sky-900/30 backdrop-blur-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> B2B Customer Portal
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent">
            {mode === 'login' ? 'Welcome Back to BFF' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access your export quotes, sample requests & bulk pricing'
              : 'Verify your email with OTP, then complete registration'}
          </p>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="block text-xs font-medium text-slate-300">Email Address</label>
              {mode === 'signup' && emailVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={emailLocked}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition disabled:opacity-70"
                />
              </div>
              {mode === 'signup' && !emailVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !email.trim() || resendCooldown > 0}
                  className="shrink-0 rounded-xl border border-sky-500/40 bg-sky-500/15 px-3 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/25 disabled:opacity-50"
                >
                  {isSendingOtp ? 'Sending…' : resendLabel}
                </button>
              )}
            </div>
            {mode === 'signup' && emailLocked && (
              <button
                type="button"
                onClick={handleUseDifferentEmail}
                className="mt-1.5 text-[11px] text-sky-400 hover:text-sky-300 underline underline-offset-2"
              >
                Use a different email
              </button>
            )}
          </div>

          {mode === 'signup' && otpSent && !emailVerified && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Enter OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2 text-sm tracking-[0.3em] text-slate-100 placeholder:text-slate-500 placeholder:tracking-normal focus:outline-none focus:border-sky-500 transition"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otp.length !== 6}
                  className="shrink-0 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {isVerifyingOtp ? 'Checking…' : 'Verify'}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                OTP expires in 10 minutes. Check your email inbox (and spam).
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="BFF Global Trading"
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="USA / Germany"
                    className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (mode === 'signup' && !emailVerified)}
            className="w-full mt-2 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign In to Portal'
              : emailVerified
              ? 'Create Customer Account'
              : 'Verify Email to Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};
