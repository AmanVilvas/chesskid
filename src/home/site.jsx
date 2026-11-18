import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Menu, MessageCircle, Play, Plus, X } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import './academy.css';
import { INTRO, PHONE, wa, HELP } from './data';
import './pages.css';

/* ---------------------------------------------------------------- shared content */
export const CHAT = wa('Hi! I have a question about The Thinking Academy.');
export { PHONE, wa, HELP };
export const HOME_COURSE = '/courses/beginner-chess';
export const EASE = [0.2, 0.8, 0.2, 1];

export const COACHES = [
  { id: 'rathish', credential: "FIDE rating 1670", experience: "7+ years coaching children", approach: "Built the 4 to 6 curriculum and trains the coaches on it.", pos: "center 20%", name: 'Rathish', role: 'Founder & Head Coach', photo: '/academy/coach-rathish.avif', tint: '#EAD5BF',
    short: 'Seven years teaching kids. Trains every coach personally. FIDE 1670.',
    long: 'FIDE rating 1670 and 7+ years coaching children. He built the 4 to 6 curriculum and personally trains every coach on the team.',
    quote: 'The way Rathish teaches is amazing. Very understanding, and disciplined too. My child has been learning with him for 2 years.' },
  { id: 'gaayathri', credential: "FIDE-rated coach", experience: "Over a decade in chess", approach: "Known for turning “I don’t like chess” into “when’s my next class?”", pos: "center 20%", name: 'Gaayathri', role: 'Coach', photo: '/academy/coach-gaayathri.jpg', tint: '#DDE3D0',
    short: 'A decade in chess. Turns reluctant kids into eager ones.',
    long: 'Over a decade in chess. Known for turning “I don’t like chess” into “when’s my next class?”',
    quote: 'I have seen my son go from hating chess to absolutely loving it. Even his teachers were surprised to see the shift.' },
  { id: 'rakesh', credential: "FIDE-rated coach", experience: "Chess coach and psychotherapist", approach: "A flexible, patient approach for younger kids.", pos: "center 38%", name: 'Rakesh', role: 'Coach', photo: '/academy/coach-rakesh.jpg', tint: '#F2DFB5',
    short: 'Chess coach and psychotherapist. Flexible with the youngest.',
    long: 'Chess coach and psychotherapist, with a flexible, patient approach for younger kids.',
    quote: 'He is friendly and understands the need for a flexible approach when teaching younger kids. My son loves Rakesh sir.' },
  { id: 'lakshaya', credential: "FIDE-rated coach", experience: "Over a decade in chess", approach: "Calm and soft-spoken, a favourite with shy children.", pos: "center 20%", name: 'Lakshaya', role: 'Coach', photo: '/academy/coach-lakshaya.jpg', tint: '#EAD5BF',
    short: 'A decade in chess. Calm and soft-spoken — great with shy kids.',
    long: 'Over a decade in chess. Calm and soft-spoken, a favourite with shy children.',
    quote: 'My kid is 6 years old and she is shy, but she liked Lakshaya sir. He is soft, with a low voice. She enjoys her class.' },
  { id: 'honnesha', credential: "FIDE-rated coach", experience: "Over a decade in chess", approach: "Sincere, patient and focused on each child’s level.", pos: "center 20%", name: 'Honnesha', role: 'Coach', photo: '/academy/coach-honnesha.jpg', tint: '#DDE3D0',
    short: 'A decade in chess. Sincere, patient, paced to each child.',
    long: 'Over a decade in chess. Sincere, patient and focused on each child’s level.',
    quote: 'She is responsible, sincere and serious about teaching, and makes sure my daughter is learning the best at her level.' },
  { id: 'roshan', credential: "FIDE-rated coach", experience: "Experienced coach", approach: "Trained on our 4 to 6 method.", pos: "center 0%", name: 'Roshan Ramesh', role: 'Coach', photo: '/academy/coach-roshan.jpg', tint: '#F2DFB5',
    short: 'Experienced coach trained on our 4 to 6 method.',
    long: 'Experienced coach trained on our 4 to 6 method.',
    quote: 'Roshan is a solid choice for younger kids we pretty much enjoyed every sessions.' },
];

export const TESTIMONIALS = [
  { quote: 'My kid is 6 years old and she is shy, but she liked Lakshaya sir. He is soft, with a low voice. She enjoys her class.', who: 'Parent of a 6-year-old', coach: 'Coach Lakshaya' },
  { quote: 'I have seen my son go from hating chess to absolutely loving it. Even his teachers were surprised to see the shift. He looks forward to his sessions with Gaayathri. Thank you for making chess so much fun for my child!', who: 'Parent', coach: 'Coach Gaayathri' },
  { quote: 'We were looking for online chess classes for our 8-year-old son. The team was prompt and answered all our questions, and the classes have been really smooth. Rakesh is friendly and understands the need for a flexible approach when teaching younger kids. My son loves Rakesh sir.', who: 'Parent of an 8-year-old', coach: 'Coach Rakesh' },
  { quote: 'The way Rathish teaches is amazing. Very understanding, and disciplined too. My child has been learning with him for 2 years without any issues. I highly recommend him.', who: 'Parent', coach: 'Coach Rathish', time: '2 years' },
  { quote: 'Gaayathri has been teaching my child, Shrinicka, for the past year. We are extremely happy with her dedication. The way she explains complex ideas is fantastic, and her patience with Shrinicka is truly admirable.', who: 'Shrinicka’s parent', coach: 'Coach Gaayathri', time: '1 year' },
  { quote: 'The coach tailors the lessons to her pace, making them both fun and educational. I’m so impressed with the progress she has made. Thank you!', who: 'Parent', coach: 'Our team', time: 'A few months' },
  { quote: 'Honnesha has been teaching my daughter for about two years. She is responsible, sincere and serious about teaching, and makes sure my daughter is learning the best at her level. I will continue with her and recommend her to others.', who: 'Parent', coach: 'Coach Honnesha', time: '2 years' },
];

/* ---------------------------------------------------------------- small pieces */
export function Reveal({ children, delay = 0, className = '', as = 'div', ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay, ease: EASE }} {...rest}>
      {children}
    </Tag>
  );
}

export function Scribble({ children, color = 'var(--clay)' }) {
  return (
    <span className="ah-scribble">
      {children}
      <svg viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden="true">
        <motion.path d="M3 12 C 40 4, 90 3, 130 8 S 185 14, 197 6" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.4, ease: EASE }} />
      </svg>
    </span>
  );
}

/** Loads the YouTube player only when a parent presses play. */
export function VideoFacade({ id, title, poster, caption, start = 0 }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="pg-video">
      {playing ? (
        <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0${start ? `&start=${start}` : ''}`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" className="pg-video-cover" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}
          style={{ backgroundImage: `url(${poster || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`})` }}>
          <span className="ah-play"><Play size={24} fill="currentColor" /></span>
          {caption && <span className="pg-video-cap">{caption}</span>}
        </button>
      )}
    </div>
  );
}

export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="pg-faq">
      {items.map(([q, a], i) => (
        <div key={q} className={`pg-faq-item ${open === i ? 'is-open' : ''}`}>
          <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{q}</span>
            <motion.span className="pg-faq-icon" animate={{ rotate: open === i ? 45 : 0 }}><Plus size={18} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div className="pg-faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                <p>{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function CtaBand({ title = <>Meet your child’s coach in an <em className="ah-gold">introductory session.</em></>, text = 'A 30-minute online session with one coach and one child. No payment details needed. We will arrange a suitable time on WhatsApp.', kicker }) {
  return (
    <section className="ah-wrap ah-cta-wrap">
      <Reveal className="ah-cta pg-cta">
        <div className="ah-cta-copy">
          {kicker && <span className="ah-kicker ah-kicker-light">{kicker}</span>}
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="ah-cta-actions">
            <Link className="ah-btn ah-btn-cream" to="/book">{INTRO.cta} <ArrowRight size={16} /></Link>
            <a className="ah-btn ah-btn-outline-light" href={CHAT} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a>
          </div>
        </div>
        <div className="pg-cta-pieces" aria-hidden="true">
          {['p', 'n', 'b', 'r', 'q', 'k'].map((type, i) => (
            <motion.img key={type} src={`/pieces/chessnut/w${type.toUpperCase()}.svg`} alt="" animate={{ y: [0, -12, 0] }} transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------------------------------------------------------- header + footer */
const NAV = [
  ['/programs', 'Live Classes'],
  [HOME_COURSE, 'Home Course'],
  ['/little-wins', 'Little Wins'],
  ['/about', 'About'],
];

function useScrollOnRoute() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) { setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export function SiteHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useScrollOnRoute();
  useEffect(() => { setOpen(false); }, [pathname]);
  return (
    <>
      <Link className="ah-topbar" to="/book">
        {INTRO.strip.split(' · ').map((part, i) => <span key={part}>{i > 0 && <i>·</i>}{part}</span>)}
      </Link>
      <header className="ah-nav">
        <Link to="/" className="ah-logo">the thinking academy<span>.</span></Link>
        <nav aria-label="Main">
          {NAV.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'is-active' : '')}>{label}</NavLink>)}
        </nav>
        <div className="ah-nav-end">
          <Link to={`${HOME_COURSE}/preview`} className="pg-try-pill"><Play size={13} fill="currentColor" /> Try it now</Link>
          <Link to={user ? '/parents' : '/login'} className="ah-signin">{user ? 'My account' : 'Parent Login'}</Link>
          <Link className="ah-btn ah-btn-clay ah-btn-sm" to="/book"><span className="pg-hide-sm">{INTRO.cta}</span><span className="pg-show-sm">{INTRO.short}</span></Link>
          <button type="button" className="pg-burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav className="pg-drawer" aria-label="Menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <Link to={`${HOME_COURSE}/preview`} className="pg-drawer-try"><Play size={16} fill="currentColor" /> Try it now: preview the course</Link>
            <Link to="/">Home</Link>
            {NAV.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
            <Link to="/book">{INTRO.cta}</Link>
            <Link to={user ? '/parents' : '/login'}>{user ? 'My account' : 'Parent Login'}</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export function SiteFooter() {
  const { user } = useAuth();
  return (
    <footer className="ah-foot" id="contact">
      <div className="ah-zigzag" aria-hidden="true" />
      <div className="ah-wrap ah-foot-grid">
        <div>
          <p className="ah-logo ah-logo-light">the thinking academy<span>.</span></p>
          <p className="ah-foot-copy">Online chess learning for children aged 4–6, with personal classes, paired classes and a parent-guided Home Course from The Thinking Academy.</p>
          <div className="pg-social">
            <a href="https://www.instagram.com/chesswithrathish/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@ChesswithRathish" target="_blank" rel="noreferrer">YouTube</a>
            <a href="https://www.linkedin.com/in/rathish-ravi-2492651a3/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
        <div>
          <h4>Learn</h4>
          <Link to="/programs">Live classes</Link>
          <Link to="/programs#plans">Plans and prices</Link>
          <Link to={HOME_COURSE}>Home Course</Link>
          <Link to={`${HOME_COURSE}/preview`}>Course preview</Link>
        </div>
        <div>
          <h4>Academy</h4>
          <Link to="/about">About &amp; coaches</Link>
          <Link to="/little-wins">Little wins</Link>
          <Link to="/book">{INTRO.cta}</Link>
          <Link to={user ? '/parents' : '/login'}>Parent Login</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`tel:+${PHONE}`}>+91-7448408684 (call or WhatsApp)</a>
          <a href="mailto:rathishravi98@gmail.com">rathishravi98@gmail.com</a>
          <span>110b Bungalow Medu, Mettupalayam, Coimbatore District, Tamil Nadu 641301, India</span>
        </div>
      </div>
      <p className="ah-wrap ah-foot-legal">© 2026 The Thinking Academy</p>
    </footer>
  );
}

export function SitePage({ title, children, className = '' }) {
  useEffect(() => { document.title = title ? `${title} | The Thinking Academy` : 'The Thinking Academy'; }, [title]);
  return (
    <div className={`ah-root ${className}`}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
