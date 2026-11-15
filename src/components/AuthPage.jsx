import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, LifeBuoy } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Character } from '../kids/Characters';
import { HELP } from '../home/data';
import '../kids/kids.css';
import './auth-font.css';
import './auth.css';

// Where the visitor is headed after signing in, in kid-friendly words.
function destinationLabel(from) {
  if (!from) return null;
  if (from.startsWith('/play')) return 'the Kids view';
  if (from.startsWith('/parents')) return 'your parent dashboard';
  if (from.startsWith('/curriculum')) return 'your course';
  if (from.startsWith('/courses')) return 'your course';
  if (from.startsWith('/admin')) return 'the admin area';
  return null;
}

export function AuthPage({ mode = 'login' }) {
  const isSignUp = mode === 'signup';
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();
  const from = location.state?.from;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = isSignUp ? 'Create a Parent Account | The Thinking Academy' : 'Parent Login | The Thinking Academy';
  }, [isSignUp]);

  if (loading) {
    return <main className="kids-root au-page au-center"><Character id="pawn" size={90} /><p className="au-loading">Loading…</p></main>;
  }
  if (user) return <Navigate to={from || '/'} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isSignUp) await signUp({ name, email, password });
      else await signIn({ email, password });
      navigate(from || '/', { replace: true });
    } catch (submitError) {
      // Sign-in failures stay neutral; sign-up failures say what to fix.
      setError(isSignUp ? (submitError.message || 'We could not create your account. Please check your details and try again.') : 'We could not sign you in. Check your details or contact us for help.');
    } finally {
      setBusy(false);
    }
  }

  // Pip politely closes his eyes while a password is typed, and reacts to errors.
  const pipMood = error ? 'oops' : busy ? 'happy' : passwordFocus && !showPassword ? 'sleep' : 'wave';
  const pipLine = error ? 'Oops! Let’s try that again.' : passwordFocus && !showPassword ? 'I’m not peeking!' : isSignUp ? 'Hi! I’m Pip. Let’s get you set up.' : 'Welcome back, friend!';
  const goingTo = destinationLabel(from);
  const switchTo = isSignUp ? '/login' : '/signup';
  const shortPassword = isSignUp && password.length > 0 && password.length < 12;

  return (
    <main className="kids-root au-page">
      <header className="au-top">
        <Link to="/" className="au-back"><ArrowLeft size={18} strokeWidth={2.6} /> Back to Home</Link>
        <Link to="/" className="au-wordmark" aria-label="The Thinking Academy home">the thinking academy<span>.</span></Link>
        <Link to={switchTo} state={location.state} className="kid-btn kid-btn-ghost au-switch-top">{isSignUp ? 'Parent Login' : 'Create account'}</Link>
      </header>

      <section className="au-column" aria-labelledby="au-title">
        <div className="au-pip">
          <AnimatePresence mode="wait">
            <motion.p key={pipLine} className="au-pip-line" initial={reduce ? false : { opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.18 }} aria-hidden="true">
              {pipLine}
            </motion.p>
          </AnimatePresence>
          <Character id="pawn" mood={pipMood} size={92} title="Pip the pawn" />
        </div>

        <h1 id="au-title">{isSignUp ? 'Create your parent account' : 'Parent Login'}</h1>
        <p className="au-sub">
          {goingTo
            ? <>{isSignUp ? 'Create an account' : 'Sign in'} to open <b>{goingTo}</b>.</>
            : isSignUp
              ? 'Create an account to get ready for your child’s learning.'
              : 'Sign in to access your child’s course.'}
        </p>
        {isSignUp
          ? <p className="au-sub au-sub-note"><b>Creating an account does not purchase the Home Course.</b> Message us to buy a course or ask about access.</p>
          : <p className="au-sub au-sub-note">Already purchased but cannot find your access? <a href={HELP} target="_blank" rel="noreferrer">Contact us on WhatsApp</a>.</p>}

        <form className="au-form" onSubmit={handleSubmit}>
          <div className="au-fields">
            {isSignUp && (
              <label className="au-field">
                <span className="au-label">Your name <i>(required)</i></span>
                <input autoComplete="name" name="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={70} />
              </label>
            )}
            <label className="au-field">
              <span className="au-label">Email address <i>(required)</i></span>
              <input autoComplete={isSignUp ? 'email' : 'username'} name="email" type="email" inputMode="email" autoCapitalize="none" spellCheck="false" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} />
            </label>
            <label className="au-field au-field-password">
              <span className="au-label">Password <i>(required)</i></span>
              <input
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                required
                minLength={isSignUp ? 12 : 1}
                maxLength={128}
                aria-describedby={isSignUp ? 'au-password-hint' : undefined}
              />
              <button className="au-eye" type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </label>
          </div>
          {isSignUp && (
            <p id="au-password-hint" className={`au-hint ${shortPassword ? 'is-warn' : ''}`}>
              {shortPassword ? `${12 - password.length} more character${12 - password.length === 1 ? '' : 's'} to go. Use at least 12 characters.` : 'Use at least 12 characters.'}
            </p>
          )}
          <AnimatePresence>
            {error && (
              <motion.p className="au-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.p>
            )}
          </AnimatePresence>
          <button className={`kid-btn ${isSignUp ? 'kid-btn-go' : 'kid-btn-blue'} kid-btn-xl au-submit`} type="submit" disabled={busy}>
            {busy ? (isSignUp ? 'Creating your account…' : 'Signing in…') : isSignUp ? 'Create account' : 'Sign in'}
          </button>
          {!isSignUp && <a className="au-help" href={HELP} target="_blank" rel="noreferrer"><LifeBuoy size={16} /> Need help signing in?</a>}
        </form>

        <p className="au-switch">
          {isSignUp ? 'Already have an account?' : 'New to The Thinking Academy?'}{' '}
          <Link to={switchTo} state={location.state}>{isSignUp ? 'Parent Login' : 'Create a parent account'}</Link>
        </p>
        <p className="au-note">Accounts are for parents and carers. Questions about your account? <a href={HELP} target="_blank" rel="noreferrer">Message us on WhatsApp</a>.</p>
      </section>

      <div className="au-crew" aria-hidden="true">
        {['rook', 'bishop', 'knight', 'queen', 'king'].map((id, i) => (
          <motion.span key={id} initial={reduce ? false : { y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 220, damping: 16 }}>
            <Character id={id} size={70} mood={error ? 'oops' : busy ? 'happy' : 'idle'} />
          </motion.span>
        ))}
      </div>
    </main>
  );
}
