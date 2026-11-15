import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, RotateCw } from 'lucide-react';
import { COACHES, CtaBand, Reveal, Scribble, SitePage } from './site';
import { INTRO } from './data';

const FLOATS = [
  { value: '1670', label: 'Rathish’s FIDE rating', pos: { top: '8%', left: '-4%' }, delay: 0 },
  { value: '7+', label: 'years Rathish has coached children', pos: { top: '30%', right: '-6%' }, delay: 0.6 },
  { value: '200+', label: 'students taught', pos: { bottom: '22%', left: '-8%' }, delay: 1.2 },
  { value: '6', label: 'FIDE-rated coaches', pos: { bottom: '6%', right: '2%' }, delay: 1.8 },
];

function CoachCard({ coach, index }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <Reveal delay={(index % 3) * 0.08} className="pg-flip-wrap">
      <button type="button" className={`pg-flip ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped((f) => !f)} aria-pressed={flipped}
        aria-label={`${coach.name}, ${coach.role}. ${flipped ? 'Showing what a parent says.' : 'Tap to see what a parent says.'}`}>
        <span className="pg-flip-inner">
          <span className="pg-flip-face pg-flip-front" style={{ background: coach.tint }}>
            <img src={coach.photo} alt="" loading="lazy" style={{ objectPosition: coach.pos }} />
            <span className="pg-flip-hint"><RotateCw size={13} /> A parent says</span>
          </span>
          <span className="pg-flip-face pg-flip-back">
            <span className="pg-flip-mark" aria-hidden="true">“</span>
            <span className="pg-flip-quote">{coach.quote}</span>
            <span className="pg-flip-who">A parent, about {coach.name.split(' ')[0]}</span>
          </span>
        </span>
      </button>
      <span className="ah-coach-role">{coach.role}</span>
      <h3 className="pg-coach-name">{coach.name}</h3>
      <ul className="pg-coach-facts"><li><b>Chess</b>{coach.credential}</li><li><b>Experience</b>{coach.experience}</li></ul>
      <p className="pg-coach-text"><b>With children:</b> {coach.approach}</p>
    </Reveal>
  );
}

export default function AboutPage() {
  const reduce = useReducedMotion();
  return (
    <SitePage title="About us">
      <section className="ah-wrap pg-hero pg-hero-about">
        <div>
          <Reveal><span className="ah-kicker">About us</span></Reveal>
          <Reveal delay={0.05}><h1>The people teaching your <em>4 to 6 year old.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">A small team of six FIDE-rated coaches, led by Rathish, who teach one thing: <Scribble>helping young children learn to think</Scribble> through chess.</p></Reveal>
          <Reveal delay={0.15} className="ah-actions">
            <Link className="ah-btn ah-btn-dark" to="/book">{INTRO.cta} <ArrowRight size={16} /></Link>
            <a className="ah-btn ah-btn-line" href="#coaches">Meet the coaches</a>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="pg-portrait">
          <img src="/academy/home-hero.jpg" alt="Rathish, founder and head coach, smiling at a chessboard" />
          {FLOATS.map((f) => (
            <motion.span key={f.label} className="pg-float" style={f.pos} animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay: f.delay, ease: 'easeInOut' }}>
              <b>{f.value}</b><small>{f.label}</small>
            </motion.span>
          ))}
        </Reveal>
      </section>

      <section className="ah-section ah-wrap pg-letter-wrap">
        <Reveal className="pg-letter" as="article">
          <span className="pg-stamp" aria-hidden="true"><img src="/pieces/chessnut/wK.svg" alt="" /></span>
          <span className="ah-kicker">A note to parents</span>
          <h2>A small team, <em>built for ages 4 to 6.</em></h2>
          <p>We are a small team of chess coaches focused on children aged 4–6. We use stories, mini-games and practice to help beginners learn at a manageable pace.</p>
          <p>Rathish leads the team and trains coaches on our shared curriculum. Each coach adapts the lesson to the child, while following the same core learning goals.</p>
          <p>Parents can begin with a free class to meet a coach and see how their child responds.</p>
          <details className="pg-more-note">
            <summary>More about our background</summary>
            <p>We are not a large corporate academy, and we don’t try to be one. Each member of our team comes from a strong academic and professional background alongside competitive chess. Some of us balance chess with careers in engineering, physiotherapy and higher education, while others have chosen to pursue chess full-time. What unites us is not branding or scale, but a genuine respect for learning, discipline, and the role chess plays in developing clear thinking.</p>
            <p>We coach because we believe chess is one of the most effective tools to help children think independently, plan ahead and make better decisions. Our goal is not to create copies of ourselves, but to help children grow into confident thinkers who can analyse situations, handle pressure, and learn from both success and failure.</p>
            <p>That is why our program is built only for children aged 4 to 6. It is the age when the habits of thinking are formed, and we believe the youngest learners deserve a program built entirely for them.</p>
          </details>
          <footer className="pg-sign">
            <img src="/academy/coach-rathish.avif" alt="" />
            <span><b className="pg-signature">Rathish</b><small>Founder &amp; Head Coach, The Thinking Academy</small></span>
          </footer>
        </Reveal>
      </section>

      <section className="ah-section ah-wrap" id="coaches">
        <div className="ah-head-split">
          <div>
            <Reveal><span className="ah-kicker">Meet the coaches</span></Reveal>
            <Reveal delay={0.05}><h2>Six coaches. <em>One way of teaching little kids.</em></h2></Reveal>
          </div>
          <Reveal delay={0.1}><p className="ah-sub">Every coach is FIDE-rated and trained on the same 4 to 6 curriculum, so every class follows the same core learning goals, whoever teaches it.</p></Reveal>
        </div>
        <div className="pg-coach-grid">
          {COACHES.map((coach, i) => <CoachCard key={coach.id} coach={coach} index={i} />)}
        </div>
      </section>

      <CtaBand title={<>Meet a coach in a <em className="ah-gold">free first class.</em></>} text="We will arrange a suitable time on WhatsApp. No payment details needed." />
    </SitePage>
  );
}
