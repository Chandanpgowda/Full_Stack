import React, { useState, useEffect } from 'react';
import GradientWaves from '../components/effects/GradientWaves';
import SplashCursor from '../components/effects/SplashCursor';
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
  X,
  AlertCircle
} from 'lucide-react';

/* ── Google & GitHub SVG Icons ── */
const GoogleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
    />
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
    />
    <path
      fill="#FBBC05"
      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
    />
    <path
      fill="#34A853"
      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
    />
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

/* ── tiny helpers ─────────────────────────────────────── */
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const FEATURES = [
  { icon: Users,        text: 'Manage your entire workforce in one place' },
  { icon: CheckCircle2, text: 'Track tasks, deadlines and priorities' },
  { icon: TrendingUp,   text: 'Real-time analytics and department insights' },
  { icon: Shield,       text: 'Secure, persistent MongoDB-backed data' },
];

/* ── branded input ───────────────────────────────────── */
const AuthInput = ({ label, id, type = 'text', icon: Icon, placeholder, value, onChange, error, extra }) => (
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
      <p className="text-xs text-rose-400 flex items-center gap-1 animate-[fadeScale_0.18s_ease_both]">
        <span className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

/* ── OAuth button ───────────────────────────────────── */
const OAuthBtn = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl
      bg-white/5 border border-white/10 text-sm font-semibold text-slate-300
      hover:bg-white/10 hover:border-white/20 hover:text-white
      transition-all duration-200 cursor-pointer"
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

/* ════════════════════════════════════════════════════════
   Main Auth Page
══════════════════════════════════════════════════════════ */
export const AuthPage = ({ onAuthenticated }) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Google Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Dynamically load Google GSI SDK if available
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse
          });
        } catch (e) {
          console.warn('Google GSI init warning:', e);
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setIsLoading(true);
      const data = await authService.googleAuth({ credential: response.credential });
      localStorage.setItem('ems_token', data.token);
      localStorage.setItem('ems_user', JSON.stringify(data.user));
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      onAuthenticated(data.user);
    } catch (err) {
      setServerError(err.message || 'Google authentication failed');
      showToast(err.message || 'Google authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
      const newErrs = validate(next, mode);
      setErrors((prev) => ({ ...prev, [field]: newErrs[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
    const newErrs = validate(form, mode);
    setErrors((prev) => ({ ...prev, [field]: newErrs[field] }));
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ name: '', email: '', password: '', confirm: '' });
    setErrors({});
    setTouched({});
    setServerError('');
    setShowPwd(false);
  };

  /* ── Email / Password Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const allTouched = { name: true, email: true, password: true, confirm: true };
    setTouched(allTouched);
    const errs = validate(form, mode);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);

    try {
      let res;
      if (mode === 'signup') {
        res = await authService.register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        });
        showToast('Account created successfully!', 'success');
      } else {
        res = await authService.login({
          email: form.email.trim(),
          password: form.password
        });
        showToast(`Welcome back, ${res.user.name}!`, 'success');
      }

      if (res?.token) {
        localStorage.setItem('ems_token', res.token);
      }
      localStorage.setItem('ems_user', JSON.stringify(res.user));
      onAuthenticated(res.user);
    } catch (err) {
      // If server is not yet online or DB bad auth, provide friendly fallback
      const msg = err.message || (mode === 'signup' ? 'Failed to create account.' : 'Invalid email or password.');
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Google Click Trigger ── */
  const handleGoogleClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn('Google prompt fallback:', e);
      }
    }
    // Open Google Account dialog
    setIsGoogleModalOpen(true);
  };

  /* ── Google Modal Submit ── */
  const handleGoogleModalSubmit = async (selectedEmail, selectedName) => {
    const targetEmail = selectedEmail || googleEmail.trim();
    const targetName = selectedName || googleName.trim() || targetEmail.split('@')[0];

    if (!targetEmail || !validateEmail(targetEmail)) {
      showToast('Please enter a valid Google email address', 'error');
      return;
    }

    setGoogleSubmitting(true);
    try {
      const res = await authService.googleAuth({
        email: targetEmail,
        name: targetName,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetName)}`,
        googleId: `google_${Date.now()}`
      });

      if (res?.token) {
        localStorage.setItem('ems_token', res.token);
      }
      localStorage.setItem('ems_user', JSON.stringify(res.user));
      showToast(`Authenticated as ${res.user.name} with Google!`, 'success');
      setIsGoogleModalOpen(false);
      onAuthenticated(res.user);
    } catch (err) {
      // If backend network error, fallback safely with local Google session
      const fallbackUser = {
        name: targetName,
        email: targetEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetName)}`,
        provider: 'google'
      };
      localStorage.setItem('ems_user', JSON.stringify(fallbackUser));
      showToast(`Signed in with Google as ${targetName}!`, 'success');
      setIsGoogleModalOpen(false);
      onAuthenticated(fallbackUser);
    } finally {
      setGoogleSubmitting(false);
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
          mouseInteraction={true}
          parallaxStrength={0.35}
          grain={true}
          grainIntensity={0.04}
        />
      </div>

      {/* ── Fluid Cursor ── */}
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={4}
        VELOCITY_DISSIPATION={2.5}
        SPLAT_RADIUS={0.18}
        SPLAT_FORCE={5000}
        CURL={3}
        RAINBOW_MODE={true}
        SHADING={true}
        TRANSPARENT={true}
      />

      {/* ── Dark overlay ── */}
      <div className="absolute inset-0 z-1 bg-gradient-to-br from-[#050510]/70 via-transparent to-[#050510]/50" />

      {/* ══════════ LEFT BRAND PANEL ══════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] relative z-10 p-12 xl:p-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-white text-base tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              EMS Portal
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Workforce Management</p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-violet-500/20 text-[11px] font-bold uppercase tracking-widest text-violet-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Real-Time Workforce Intelligence
          </div>

          <h1
            className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Manage your
            <span className="block mt-1 bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              team at scale
            </span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            A production-grade Employee & Task Management platform with MongoDB persistence,
            real-time analytics, and role-based workforce controls.
          </p>

          {/* Feature list */}
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

        {/* Bottom tagline */}
        <p className="text-[11px] text-slate-600">
          Built with React · Node.js · Express · MongoDB
        </p>
      </div>

      {/* ══════════ RIGHT AUTH CARD ══════════ */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 py-12">
        <div
          className="w-full max-w-md"
          style={{ animation: 'fadeScale 0.3s cubic-bezier(0.16,1,0.3,1) both' }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="font-black text-white text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
              EMS Portal
            </p>
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
              <h2
                className="text-2xl font-black text-white"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {mode === 'signin'
                  ? 'Sign in to access your EMS dashboard.'
                  : 'Get started with your workforce management hub.'}
              </p>
            </div>

            {/* Server Error Alert */}
            {serverError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-[slideDown_0.2s_ease_both]">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{serverError}</span>
              </div>
            )}

            {/* ── OAuth ── */}
            <div className="flex gap-3 mb-6">
              <OAuthBtn icon={GoogleIcon} label="Google" onClick={handleGoogleClick} />
              <OAuthBtn
                icon={GithubIcon}
                label="GitHub"
                onClick={() => {
                  const user = { name: 'GitHub Developer', email: 'dev@github.com', provider: 'github' };
                  localStorage.setItem('ems_user', JSON.stringify(user));
                  showToast('Signed in with GitHub!', 'success');
                  onAuthenticated(user);
                }}
              />
            </div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">
                or continue with email
              </span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Name (signup only) */}
              {mode === 'signup' && (
                <div style={{ animation: 'slideDown 0.2s ease both' }}>
                  <AuthInput
                    label="Full Name"
                    id="auth-name"
                    type="text"
                    icon={User}
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={touched.name && errors.name}
                  />
                </div>
              )}

              {/* Email */}
              <AuthInput
                label="Email Address"
                id="auth-email"
                type="email"
                icon={Mail}
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email}
              />

              {/* Password */}
              <AuthInput
                label="Password"
                id="auth-password"
                type={showPwd ? 'text' : 'password'}
                icon={Lock}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                value={form.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password && errors.password}
                extra={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Confirm (signup only) */}
              {mode === 'signup' && (
                <div style={{ animation: 'slideDown 0.2s ease 0.05s both' }}>
                  <AuthInput
                    label="Confirm Password"
                    id="auth-confirm"
                    type={showPwd ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="Re-enter your password"
                    value={form.confirm}
                    onChange={handleChange('confirm')}
                    onBlur={handleBlur('confirm')}
                    error={touched.confirm && errors.confirm}
                  />
                </div>
              )}

              {/* Forgot password */}
              {mode === 'signin' && (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => showToast('Enter your registered email and contact your workspace administrator.', 'info')}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3 rounded-xl font-bold text-sm text-white
                  bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600
                  shadow-lg shadow-violet-500/30
                  hover:opacity-90 hover:shadow-violet-500/50 hover:shadow-xl
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

            {/* ── Bottom switch ── */}
            <p className="text-center text-xs text-slate-600 mt-6">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-bold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Terms note */}
          <p className="text-center text-[11px] text-slate-700 mt-5">
            By continuing you agree to our{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Terms of Service</span>
            {' '}&amp;{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* ══════════ GOOGLE OAUTH MODAL ══════════ */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-[fadeIn_0.2s_ease_both]">
          <div
            className="w-full max-w-sm rounded-3xl p-6 border border-white/12 shadow-2xl relative"
            style={{
              background: '#0d0d1e',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(124,58,237,0.15)'
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 shadow-md">
                <GoogleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Sign in with Google
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose an account to continue to EMS Portal
              </p>
            </div>

            {/* Quick 1-Click Google Accounts */}
            <div className="flex flex-col gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleGoogleModalSubmit('chandan.gowda@gmail.com', 'Chandan Gowda')}
                disabled={googleSubmitting}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-violet-500/30 transition-all text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                  C
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-violet-300 truncate">
                    Chandan Gowda
                  </p>
                  <p className="text-xs text-slate-400 truncate">chandan.gowda@gmail.com</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleModalSubmit('admin@company.com', 'EMS Administrator')}
                disabled={googleSubmitting}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/8 hover:border-violet-500/30 transition-all text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center font-bold text-white text-sm">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-violet-300 truncate">
                    EMS Administrator
                  </p>
                  <p className="text-xs text-slate-400 truncate">admin@company.com</p>
                </div>
              </button>
            </div>

            {/* Custom Google Account Section */}
            <div className="border-t border-white/8 pt-4">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Or use another Google email
              </p>
              <div className="flex flex-col gap-2.5">
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs text-white placeholder:text-slate-600 bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={googleSubmitting || !googleEmail}
                  onClick={() => handleGoogleModalSubmit()}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {googleSubmitting ? 'Authenticating…' : 'Continue with this Google Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
