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

/* ════════════════════════════════════════════════════════
   Main Auth Page
══════════════════════════════════════════════════════════ */
export const AuthPage = ({ onAuthenticated }) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState('signin');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [gsiBtnReady, setGsiBtnReady] = useState(false);

  const googleBtnRef = useRef(null);
  // Use a ref for the credential callback so GSI.initialize() is never called twice
  const credentialCallbackRef = useRef(null);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* ── Google credential callback (stable ref – never recreated) ── */
  const handleGoogleCredentialResponse = useCallback(async (response) => {
    try {
      setIsLoading(true);
      setServerError('');

      if (!response || !response.credential) {
        throw new Error('Google authentication returned no credential. Please try again.');
      }

      const payload = { credential: response.credential };

      // Helper to safely parse Google JWT on frontend as robust fallback
      try {
        const parts = response.credential.split('.');
        if (parts.length === 3) {
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          if (decoded && decoded.email) {
            payload.email = decoded.email;
            payload.name = decoded.name;
            payload.avatar = decoded.picture;
            payload.googleId = decoded.sub;
          }
        }
      } catch (e) {
        console.warn('Client-side Google credential decode warning:', e);
      }

      const data = await authService.googleAuth(payload);
      localStorage.setItem('ems_token', data.token);
      localStorage.setItem('ems_user', JSON.stringify(data.user));
      showToast(`Welcome, ${data.user.name}! 🎉`, 'success');
      onAuthenticated(data.user);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Google authentication failed. Try again.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [onAuthenticated, showToast]);

  // Keep the ref in sync with the latest callback without triggering re-initialization
  useEffect(() => { credentialCallbackRef.current = handleGoogleCredentialResponse; }, [handleGoogleCredentialResponse]);

  /* ── Load Google GSI SDK & initialize ONCE ── */
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID not set – Google Sign-In unavailable');
      return;
    }

    // Wrapper that delegates to the latest ref — avoids reinitializing GSI
    const stableCallback = (resp) => credentialCallbackRef.current?.(resp);

    const initGoogle = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: stableCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false, // disable FedCM to avoid navigator.credentials conflicts
          ux_mode: 'popup',
        });
        setGsiBtnReady(true);
      } catch (e) {
        console.error('Google GSI init error:', e);
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else if (!document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      script.onerror = () => console.error('Failed to load Google GSI script');
      document.body.appendChild(script);
    }
  }, []); // ← empty deps: runs exactly once on mount

  /* ── Render official Google button whenever container is ready ── */
  useEffect(() => {
    if (!gsiBtnReady || !googleBtnRef.current) return;
    try {
      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: 280,
      });
    } catch (e) {
      console.warn('renderButton error:', e);
    }
  }, [gsiBtnReady, mode]);

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

            {/* ── OAuth Buttons ── */}
            <div className="flex flex-col gap-3 mb-6">
              {/* Official Google Sign-In Button rendered by Google GSI SDK */}
              <div className="flex items-center justify-center min-h-[44px]">
                {gsiBtnReady ? (
                  /* Real Google button injected here — opens native Google account picker */
                  <div ref={googleBtnRef} className="flex justify-center w-full" />
                ) : (
                  /* Fallback skeleton while SDK loads */
                  <div className="w-full h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-2.5 text-sm text-slate-500 animate-pulse">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                    </svg>
                    Loading Google…
                  </div>
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">or continue with email</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

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
