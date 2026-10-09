import React, { useState, useEffect, useRef, useCallback } from 'react';
import GradientWaves from '../components/effects/GradientWaves';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import {
  Zap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Shield,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';


/* ── tiny helpers ─────────────────────────────────────── */
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const FEATURES = [
  { icon: Users,        text: 'Manage your entire workforce in one place' },
  { icon: CheckCircle2, text: 'Track tasks, deadlines and priorities' },
  { icon: TrendingUp,   text: 'Real-time analytics and department insights' },
  { icon: Shield,       text: 'Secure, persistent MongoDB-backed data' },
];

/* ── branded input ───────────────────────────────────── */
const AuthInput = ({ label, id, type = 'text', icon: Icon, placeholder, value, onChange, onBlur, error, extra }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 rounded-xl text-sm text-white placeholder:text-slate-600
          bg-white/5 border transition-all outline-none
          focus:bg-white/8 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
          ${error ? 'border-rose-500/60 ring-2 ring-rose-500/15' : 'border-white/10'}`}
      />
      {extra}
    </div>
    {error && (
      <p className="text-xs text-rose-400 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

/* ── Google Icon SVG ──────────────────────────────────── */
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

/* ════════════════════════════════════════════════════════
   Main Auth Page
══════════════════════════════════════════════════════════ */
export const AuthPage = ({ onAuthenticated }) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState('signin');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const googleBtnRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  /* ── Google Authentication callback ── */
  const handleGoogleResponse = useCallback(async (response) => {
    if (!response || !response.credential) return;
    setIsLoading(true);
    setServerError('');
    try {
      const res = await authService.googleAuth({ credential: response.credential });
      showToast(`Welcome, ${res.user.name}! 🎉`, 'success');
      if (res?.token) localStorage.setItem('ems_token', res.token);
      localStorage.setItem('ems_user', JSON.stringify(res.user));
      onAuthenticated(res.user);
    } catch (err) {
      const msg = err.message || 'Google authentication failed.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [onAuthenticated, showToast]);

  useEffect(() => {
    if (!googleClientId) return;

    const renderGoogleBtn = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleResponse,
          use_fedcm_for_prompt: true,
          ux_mode: 'popup',
          itp_support: true,
        });

        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          type: 'standard',
          shape: 'pill',
          text: mode === 'signin' ? 'signin_with' : 'signup_with',
          width: 360,
          logo_alignment: 'left'
        });
      }
    };

    if (window.google?.accounts?.id) {
      renderGoogleBtn();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          renderGoogleBtn();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [googleClientId, handleGoogleResponse, mode]);

  /* ── validation ── */
  const validate = (data, m) => {
    const e = {};
    if (m === 'signup' && !data.name.trim()) e.name = 'Full name is required.';
    if (!data.email.trim()) e.email = 'Email address is required.';
    else if (!validateEmail(data.email)) e.email = 'Enter a valid email address.';
    if (!data.password) e.password = 'Password is required.';
    else if (data.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (m === 'signup') {
      if (!data.confirm) e.confirm = 'Please confirm your password.';
      else if (data.confirm !== data.password) e.confirm = 'Passwords do not match.';
    }
    return e;
  };

  const handleChange = (field) => (e) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    setServerError('');
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(next, mode)[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(form, mode)[field] }));
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ name: '', email: '', password: '', confirm: '' });
    setErrors({});
    setTouched({});
    setServerError('');
    setShowPwd(false);
  };

  /* ── Email/Password Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const allTouched = { name: true, email: true, password: true, confirm: true };
    setTouched(allTouched);
    const errs = validate(form, mode);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      let res;
      if (mode === 'signup') {
        res = await authService.register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
        showToast('Account created successfully! 🎉', 'success');
      } else {
        res = await authService.login({ email: form.email.trim(), password: form.password });
        showToast(`Welcome back, ${res.user.name}! 👋`, 'success');
      }
      if (res?.token) localStorage.setItem('ems_token', res.token);
      localStorage.setItem('ems_user', JSON.stringify(res.user));
      onAuthenticated(res.user);
    } catch (err) {
      const msg = err.message || (mode === 'signup' ? 'Failed to create account.' : 'Invalid email or password.');
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-stretch relative overflow-hidden bg-[#050510]">

      {/* ── WebGL Wave Background ── */}
      <div className="absolute inset-0 z-0">
        <GradientWaves
          horizonColor="#1e0745"
          waveColor="#6d28d9"
          crestColor="#a78bfa"
          speed={0.3}
          amplitude={2.2}
          waveScale={0.55}
          waveRatio={0.88}
          swell={28}
          turbulence={18}
          tilt={1.15}
          zoom={1.0}
          height={5.2}
          fogDepth={13}
          detail="medium"
          brightness={1.1}
          opacity={0.75}
          mouseInteraction={false}
          parallaxStrength={0}
          grain={true}
          grainIntensity={0.04}
        />
      </div>


      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 z-1 bg-gradient-to-br from-[#050510]/70 via-transparent to-[#050510]/50" />

      {/* ══════════ LEFT BRAND PANEL ══════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative z-10 p-12 xl:p-16">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-white text-base tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>EMS Portal</p>
            <p className="text-[10px] text-slate-500 font-medium">Workforce Management</p>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-violet-500/20 text-[11px] font-bold uppercase tracking-widest text-violet-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Real-Time Workforce Intelligence
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Manage your
            <span className="block mt-1 bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              team at scale
            </span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            A production-grade Employee & Task Management platform with MongoDB persistence, real-time analytics, and role-based workforce controls.
          </p>

          <div className="mt-8 flex flex-col gap-3.5">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-7 h-7 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-violet-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-600">Built with React · Node.js · Express · MongoDB</p>
      </div>

      {/* ══════════ RIGHT AUTH CARD ══════════ */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-12">
        <div className="w-full max-w-md" style={{ animation: 'fadeScale 0.3s cubic-bezier(0.16,1,0.3,1) both' }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="font-black text-white text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>EMS Portal</p>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-8 border border-white/10 shadow-2xl"
            style={{
              background: 'rgba(8, 6, 22, 0.82)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            {/* ── Mode Toggle ── */}
            <div className="flex items-center p-1 bg-white/5 border border-white/8 rounded-2xl mb-7">
              {['signin', 'signup'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                    mode === m
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* ── Header ── */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {mode === 'signin' ? 'Sign in to access your EMS dashboard.' : 'Get started with your workforce management hub.'}
              </p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{serverError}</span>
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {mode === 'signup' && (
                <div style={{ animation: 'slideDown 0.2s ease both' }}>
                  <AuthInput
                    label="Full Name" id="auth-name" type="text" icon={User} placeholder="Jane Doe"
                    value={form.name} onChange={handleChange('name')} onBlur={handleBlur('name')}
                    error={touched.name && errors.name}
                  />
                </div>
              )}

              <AuthInput
                label="Email Address" id="auth-email" type="email" icon={Mail} placeholder="you@company.com"
                value={form.email} onChange={handleChange('email')} onBlur={handleBlur('email')}
                error={touched.email && errors.email}
              />

              <AuthInput
                label="Password" id="auth-password" type={showPwd ? 'text' : 'password'} icon={Lock}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                value={form.password} onChange={handleChange('password')} onBlur={handleBlur('password')}
                error={touched.password && errors.password}
                extra={
                  <button type="button" tabIndex={-1} onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {mode === 'signup' && (
                <div style={{ animation: 'slideDown 0.2s ease 0.05s both' }}>
                  <AuthInput
                    label="Confirm Password" id="auth-confirm" type={showPwd ? 'text' : 'password'} icon={Lock}
                    placeholder="Re-enter your password"
                    value={form.confirm} onChange={handleChange('confirm')} onBlur={handleBlur('confirm')}
                    error={touched.confirm && errors.confirm}
                  />
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex justify-end -mt-1">
                  <button type="button"
                    onClick={() => showToast('Contact your workspace administrator to reset your password.', 'info')}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3 rounded-xl font-bold text-sm text-white
                  bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600
                  shadow-lg shadow-violet-500/30 hover:opacity-90 hover:shadow-xl
                  active:scale-[0.98] transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
                  flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* ── Divider ── */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-[#080616] px-3 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* ── Google Auth Button ── */}
            {googleClientId ? (
              <div className="w-full flex justify-center min-h-[44px]">
                <div ref={googleBtnRef} className="w-full" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  showToast(
                    'To enable official Google Sign-In, set VITE_GOOGLE_CLIENT_ID in environment settings.',
                    'info'
                  );
                }}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-200
                  bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
                  transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            )}

            <p className="text-center text-xs text-slate-600 mt-6">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-bold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer">
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <p className="text-center text-[11px] text-slate-700 mt-5">
            By continuing you agree to our{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Terms of Service</span>
            {' '}&amp;{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};
