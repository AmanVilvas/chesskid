import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MessageCircle, Play, Trophy, Award, Swords } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import './academy.css';

const PHONE = '917448408684';
const wa = (text) => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
const BOOK = wa('Hi! I would like to book a free chess class for my child.');
const CHAT = wa('Hi! I have a question about The Thinking Academy chess classes.');
const FREE_COURSE = '/courses/beginner-chess';

const STATS = [
  ['200+', 'students taught'],
  ['6', 'FIDE-rated coaches, Lichess-verified'],
  ['7 years', 'teaching young kids'],
  ['3 countries', 'India, the US & the UK'],
];

const WHY = [
  ['Built only for ages 4–6', 'Short, playful 30-minute classes made for little attention spans. Lots of games, lots of praise.'],
  ['No chess knowledge needed', 'Not for your child, not for you. We start from zero and add one piece at a time.'],
  ['Thinking is the real goal', 'Focus, patience and planning — the skills that carry over to school and life.'],
];

const PHASES = [
  { title: 'Meet the pieces', text: 'How each piece moves, learned through games.', color: '#B5452F' },
  { title: 'Check & checkmate', text: 'Attacking the king — and winning.', color: '#E0A93B' },
  { title: 'Special rules & first moves', text: 'Castling, and a simple way to start every game.', color: '#6F8F5C' },
  { title: 'Tactics', text: 'Small tricks that win pieces — and looking before moving.', color: '#A8A29C' },
  { title: 'Playing real games', text: 'Playing full games with a plan.', color: '#F7EFE3' },
];

const PLANS = [
  { tag: 'Most personal', tagTone: 'clay', no: 'No. 1 · Personal', name: 'The Little Thinker 1:1', price: '₹4,800', unit: '/month per child', points: ['8 live classes a month', 'One coach, one child', 'All program benefits'], art: 'one', tint: '#EAD5BF' },
  { tag: 'Best value', tagTone: 'green', no: 'No. 2 · Paired', name: 'The Thinking Pair 1:2', price: '₹3,200', unit: '/month per child', points: ['8 live classes a month', 'One coach, two children', 'All program benefits'], art: 'two', tint: '#DDE3D0' },
];

const WINS = [
  { icon: Trophy, title: 'Sunday tournaments', text: 'Sundays at 7:30 · online. Included with every live plan.', tint: '#EAD5BF' },
  { icon: Award, title: 'Pawn to King certificates', text: 'A certificate at every level, from Pawn all the way to King.', tint: '#DDE3D0' },
  { icon: Swords, title: 'A full game, on their own', text: 'By the end, they play a whole game themselves — and think before they act.', tint: '#F2DFB5' },
];

const COACHES = [
  { name: 'Rathish', role: 'Founder & head coach', text: 'Seven years teaching kids. Trains every coach personally. FIDE 1670.', tint: '#EAD5BF' },
  { name: 'Gaayathri', role: 'Coach', text: 'A decade in chess. Turns reluctant kids into eager ones.', tint: '#DDE3D0' },
  { name: 'Rakesh', role: 'Coach', text: 'Chess coach and psychotherapist. Flexible with the youngest.', tint: '#F2DFB5' },
  { name: 'Lakshaya', role: 'Coach', text: 'A decade in chess. Calm and soft-spoken — great with shy kids.', tint: '#EAD5BF' },
  { name: 'Hanneesha', role: 'Coach', text: 'A decade in chess. Sincere, patient, and paced to each child.', tint: '#DDE3D0' },
];

const QUOTES = [
  { quote: 'My kid is 6 years old and she is shy, but she liked Lakshaya sir. He is soft, with a low voice. She enjoys her class.', who: 'Parent of a 6-year-old · Coach Lakshaya' },
  { quote: 'I have seen my son go from hating chess to absolutely loving it. Even his teachers were surprised to see the shift.', who: 'Parent · Coach Gaayathri' },
  { quote: 'The coach tailors the lessons to her pace, making them both fun and educational.', who: 'Parent · a few months with us' },
];

function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </Tag>
  );
}

/** Flat pawn + king, as in the brand artwork. */
function Pieces({ two = false }) {
  return (
    <svg viewBox="0 0 200 160" className="ah-pieces" aria-hidden="true">
      <ellipse cx="100" cy="146" rx="80" ry="7" fill="rgba(43,30,24,.12)" />
      <g fill="#B5452F">
        <circle cx={two ? 62 : 74} cy="62" r="17" />
        <path d={two ? 'M47 80h30l-4 9h-22z M50 89h24l8 44H42z M36 133h52v10H36z' : 'M59 80h30l-4 9H63z M62 89h24l8 44H54z M48 133h52v10H48z'} />
      </g>
      {two && (
        <g fill="#E0A93B">
          <circle cx="104" cy="70" r="14" />
          <path d="M92 85h24l-3 7H95z M94 92h20l7 38H87z M82 130h44v9H82z" />
        </g>
      )}
      <g fill="#2B1E18" transform={two ? 'translate(18 0)' : ''}>
        <rect x="126" y="18" width="7" height="22" rx="2" />
        <rect x="119" y="25" width="21" height="7" rx="2" />
        <path d="M113 44h33a6 6 0 0 1 4 10l-5 6h-31l-5-6a6 6 0 0 1 4-10z" />
        <path d="M117 62h25l9 71h-43z" />
        <path d="M102 133h55v10h-55z" />
      </g>
    </svg>
  );
}

export function AcademyHome() {
  const { user } = useAuth();
  useEffect(() => { document.title = 'The Thinking Academy | 1:1 online chess for kids aged 4 to 6'; }, []);

  return (
    <div className="ah-root">
      <a className="ah-topbar" href={BOOK} target="_blank" rel="noreferrer">
        Online 1:1 for ages 4–6 <i>·</i> First class free <i>·</i> No payment needed to try
      </a>

      <header className="ah-nav">
        <Link to="/" className="ah-logo">the thinking academy<span>.</span></Link>
        <nav aria-label="Main">
          <a href="#programs">Programs</a>
          <a href="#pricing">Pricing</a>
          <Link to={FREE_COURSE}>Free Course</Link>
          <a href="#little-wins">Little Wins</a>
          <a href="#coaches">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="ah-nav-end">
          {user ? <Link to="/parents" className="ah-signin">My account</Link> : <Link to="/login" className="ah-signin">Sign in</Link>}
          <a className="ah-btn ah-btn-clay ah-btn-sm" href={BOOK} target="_blank" rel="noreferrer">Book free class</a>
        </div>
      </header>

      <main>
        <section className="ah-hero ah-wrap">
          <div>
            <Reveal><span className="ah-kicker">Made for little minds</span></Reveal>
            <Reveal delay={0.05}><h1>1:1 online chess for kids aged <em>4 to 6.</em></h1></Reveal>
            <Reveal delay={0.1}><p className="ah-lead">One coach. One child. 30 minutes. Your child doesn’t need to know chess — and neither do you.</p></Reveal>
            <Reveal delay={0.15} className="ah-actions">
              <a className="ah-btn ah-btn-dark" href={BOOK} target="_blank" rel="noreferrer">Book free class <ArrowRight size={16} /></a>
              <a className="ah-btn ah-btn-line" href="#pricing">See pricing</a>
            </Reveal>
            <Reveal delay={0.2}><p className="ah-proof">200+ students taught · Families in India, the US &amp; the UK</p></Reveal>
          </div>
          <Reveal delay={0.1} className="ah-hero-art">
            <span className="ah-badge">Ages 4–6 only</span>
            <div className="ah-arch" style={{ backgroundImage: 'url(/chess_kid_hero.jpg)' }} role="img" aria-label="A young child playing chess at home" />
          </Reveal>
        </section>

        <section className="ah-stats" aria-label="The academy in numbers">
          <div className="ah-wrap ah-stats-row">
            {STATS.map(([value, label]) => <div key={value}><b>{value}</b><span>{label}</span></div>)}
          </div>
        </section>

        <section className="ah-section ah-wrap">
          <Reveal><span className="ah-kicker">Why a 4–6 specialist</span></Reveal>
          <Reveal delay={0.05}><h2>Chess is the tool.<br /><em>Thinking</em> is the outcome.</h2></Reveal>
          <div className="ah-grid-3">
            {WHY.map(([title, text], i) => (
              <Reveal key={title} delay={i * 0.06} className="ah-card">
                <span className="ah-num">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ah-dark" id="curriculum">
          <div className="ah-wrap ah-section">
            <div className="ah-head-row">
              <div>
                <Reveal><span className="ah-kicker ah-kicker-light">The journey · 30 units · about a year</span></Reveal>
                <Reveal delay={0.05}><h2>From first <em className="ah-gold">pawn</em><br />to full games.</h2></Reveal>
              </div>
              <a className="ah-link-light" href="#programs">See the plans <ArrowRight size={14} /></a>
            </div>
            <div className="ah-phases">
              {PHASES.map((phase, i) => (
                <Reveal key={phase.title} delay={i * 0.05} className="ah-phase">
                  <span className="ah-dot" style={{ background: phase.color }} />
                  <span className="ah-phase-no">Phase {i + 1}</span>
                  <h3>{phase.title}</h3>
                  <p>{phase.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="ah-section ah-wrap" id="programs">
          <span id="pricing" className="ah-anchor" />
          <Reveal><span className="ah-kicker">The collection · India</span></Reveal>
          <Reveal delay={0.05}><h2>Two ways to <em>begin.</em></h2></Reveal>
          <Reveal delay={0.08}><p className="ah-sub">Both plans: 2 classes a week, 30 minutes each, first class free.</p></Reveal>
          <div className="ah-plans">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.08} className="ah-plan">
                <div className="ah-plan-art" style={{ background: plan.tint }}>
                  <span className={`ah-tag ah-tag-${plan.tagTone}`}>{plan.tag}</span>
                  <Pieces two={plan.art === 'two'} />
                </div>
                <div className="ah-plan-body">
                  <span className="ah-plan-no">{plan.no}</span>
                  <h3>{plan.name}</h3>
                  <ul>{plan.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  <div className="ah-plan-foot">
                    <p className="ah-price"><b>{plan.price}</b> {plan.unit}</p>
                    <a className="ah-btn ah-btn-dark ah-btn-sm" href={wa(`Hi! I would like to book a free class for ${plan.name}.`)} target="_blank" rel="noreferrer">Book free class</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="ah-abroad">
            <span>Outside India?</span>
            {['US', 'UK', 'Malaysia'].map((country) => (
              <a key={country} href={wa(`Hi! What are your class prices for families in ${country === 'Malaysia' ? 'Malaysia' : `the ${country}`}?`)} target="_blank" rel="noreferrer">{country} prices</a>
            ))}
          </div>
        </section>

        <section className="ah-free">
          <div className="ah-wrap ah-free-row">
            <div>
              <Reveal><span className="ah-kicker">Free for parents</span></Reveal>
              <Reveal delay={0.05}><h2>Teach your child<br /><em>one piece at a time.</em></h2></Reveal>
              <Reveal delay={0.08}><p>Short videos that show you exactly what to teach. No chess knowledge needed.</p></Reveal>
              <Reveal delay={0.12}><Link className="ah-btn ah-btn-clay" to={FREE_COURSE}>Start the free course <ArrowRight size={16} /></Link></Reveal>
            </div>
            <Reveal delay={0.1}>
              <Link to={FREE_COURSE} className="ah-video" style={{ backgroundImage: 'url(/hero-kid.jpg)' }} aria-label="Open the free parent course">
                <span className="ah-play"><Play size={22} fill="currentColor" /></span>
                <span className="ah-video-cap">Day 1: The Rook · 6 short days</span>
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="ah-section ah-wrap" id="little-wins">
          <div className="ah-head-row">
            <div>
              <Reveal><span className="ah-kicker">Little wins</span></Reveal>
              <Reveal delay={0.05}><h2>Small hands.<br /><em>Big trophies.</em></h2></Reveal>
            </div>
          </div>
          <div className="ah-grid-3">
            {WINS.map(({ icon: Icon, title, text, tint }, i) => (
              <Reveal key={title} delay={i * 0.06} className="ah-win" >
                <div className="ah-win-art" style={{ background: tint }}><Icon size={44} strokeWidth={1.6} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ah-section ah-wrap" id="coaches">
          <Reveal><span className="ah-kicker">Meet the coaches</span></Reveal>
          <Reveal delay={0.05}><h2>Patient people.<br /><em>Rated players.</em></h2></Reveal>
          <div className="ah-coaches">
            {COACHES.map((coach, i) => (
              <Reveal key={coach.name} delay={i * 0.05} className="ah-coach">
                <div className="ah-coach-arch" style={{ background: coach.tint }} aria-hidden="true">{coach.name[0]}</div>
                <span className="ah-coach-role">{coach.role}</span>
                <h3>{coach.name}</h3>
                <p>{coach.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ah-section ah-wrap">
          <Reveal><span className="ah-kicker">From our parents</span></Reveal>
          <Reveal delay={0.05}><h2>What changes <em>at home.</em></h2></Reveal>
          <div className="ah-grid-3">
            {QUOTES.map((item, i) => (
              <Reveal key={item.who} delay={i * 0.06} as="figure" className="ah-quote">
                <blockquote>“{item.quote}”</blockquote>
                <figcaption>{item.who}</figcaption>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="ah-wrap ah-cta-wrap">
          <Reveal className="ah-cta">
            <div>
              <span className="ah-kicker ah-kicker-light">No payment needed to try</span>
              <h2>Your child’s first class <em className="ah-gold">is on us.</em></h2>
              <p>30 minutes, one coach, one child. See if your child enjoys it before you pay anything.</p>
            </div>
            <div className="ah-cta-actions">
              <a className="ah-btn ah-btn-cream" href={BOOK} target="_blank" rel="noreferrer">Book free class <ArrowRight size={16} /></a>
              <a className="ah-btn ah-btn-outline-light" href={CHAT} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat on WhatsApp</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="ah-foot" id="contact">
        <div className="ah-zigzag" aria-hidden="true" />
        <div className="ah-wrap ah-foot-grid">
          <div>
            <p className="ah-logo ah-logo-light">the thinking academy<span>.</span></p>
            <p className="ah-foot-copy">1:1 online chess for kids aged 4–6. Chess as the tool. Thinking as the outcome.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#programs">Programs</a>
            <a href="#pricing">Pricing</a>
            <Link to={FREE_COURSE}>Free course</Link>
            <a href="#little-wins">Little wins</a>
            <a href="#coaches">About</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`tel:+${PHONE}`}>+91-7448408684 (call or WhatsApp)</a>
            <a href="mailto:rathishravi98@gmail.com">rathishravi98@gmail.com</a>
            <span>Mettupalayam, Coimbatore District, Tamil Nadu</span>
          </div>
        </div>
        <p className="ah-wrap ah-foot-legal">© 2026 The Thinking Academy</p>
      </footer>
    </div>
  );
}
