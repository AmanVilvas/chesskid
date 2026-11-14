import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Eye, EyeOff, ShieldCheck, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Character } from '../kids/Characters';
import '../kids/kids.css';
import './auth.css';

// Where the visitor is headed after signing in, in kid-friendly words.
function destinationLabel(from) {
  if (!from) return null;
  if (from.startsWith('/play')) return 'Crown Quest';
  if (from.startsWith('/parents')) return 'the parent view';
  if (from.startsWith('/curriculum')) return 'your lessons';
  if (from.startsWith('/courses')) return 'your courses';
  if (from.startsWith('/admin')) return 'the academy studio';
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

  if (loading) {
    return <main className="kids-root au-page au-center"><Character id="pawn" size={90} /><p className="au-loading">Opening your secure academy session…</p></main>;
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
      setError(submitError.message || 'Something went wrong. Please try again.');
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
        <Link to="/" className="au-close" aria-label="Back to the home page"><X size={30} strokeWidth={2.8} /></Link>
        <Link to={switchTo} state={location.state} className="kid-btn kid-btn-ghost au-switch-top">{isSignUp ? 'Log in' : 'Sign up'}</Link>
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

        <h1 id="au-title">{isSignUp ? 'Create your grown-up account' : 'Log in'}</h1>
        <p className="au-sub">
          {goingTo
            ? <>{isSignUp ? 'Create an account' : 'Log in'} to open <b>{goingTo}</b>.</>
            : isSignUp ? 'Grown-ups sign up first. Then your child can play and learn.' : 'Pick up right where you left off.'}
        </p>

        <form className="au-form" onSubmit={handleSubmit}>
          <div className="au-fields">
            {isSignUp && (
              <label className="au-field">
                <span className="sr-only">Your name</span>
                <input autoComplete="name" name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required maxLength={70} />
              </label>
            )}
            <label className="au-field">
              <span className="sr-only">Email address</span>
              <input autoComplete="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required maxLength={254} />
            </label>
            <label className="au-field au-field-password">
              <span className="sr-only">Password</span>
              <input
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                placeholder={isSignUp ? 'Password (12+ characters)' : 'Password'}
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
              {shortPassword ? `${12 - password.length} more character${12 - password.length === 1 ? '' : 's'} to go` : 'Use at least 12 characters.'}
            </p>
          )}
          <AnimatePresence>
            {error && (
              <motion.p className="au-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.p>
            )}
          </AnimatePresence>
          <button className={`kid-btn ${isSignUp ? 'kid-btn-go' : 'kid-btn-blue'} kid-btn-xl au-submit`} type="submit" disabled={busy}>
            {busy ? 'One moment…' : isSignUp ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="au-switch">
          {isSignUp ? 'Already have an account?' : 'New to The Thinking Academy?'}{' '}
          <Link to={switchTo} state={location.state}>{isSignUp ? 'Log in' : 'Create an account'}</Link>
        </p>
        <p className="au-note"><ShieldCheck size={16} /> Accounts are for grown-ups. Passwords are stored encrypted and sign-in is managed securely by the academy.</p>
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
