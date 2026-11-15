import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, ChevronLeft, ChevronRight, MessageSquareHeart, Trophy, X } from 'lucide-react';
import { CtaBand, EASE, Reveal, Scribble, SitePage, TESTIMONIALS, VideoFacade } from './site';

const WINS = [
  { src: '/academy/win-muin.jpg', name: 'Muin Mukshin', alt: 'Muin holding two tournament trophies' },
  { src: '/academy/win-monisha.jpg', name: 'Monisha Ashoke', alt: 'Monisha with a weekly tournament prize' },
  { src: '/academy/win-aarush.jpg', name: 'Aarush', alt: 'Aarush with his completion certificate' },
  { src: '/academy/win-aarush-armin-gukesh.jpg', name: 'Aarush & Armin with Gukesh', alt: 'Aarush and Armin with Gukesh' },
  { src: '/academy/win-tata-steel.jpg', name: 'At Tata Steel', alt: 'A student at the Tata Steel chess event' },
  { src: '/academy/win-tanisha.jpg', name: 'Tanisha Narayanan', alt: 'Tanisha after her first full game' },
  { src: '/academy/win-sunday-tournament.jpg', name: 'Sunday tournament winner', alt: 'A Sunday tournament winner' },
  { src: '/academy/win-program-certificate.jpg', name: 'Program certificate', alt: 'A student with the program certificate' },
  { src: '/academy/win-bhrithi.jpg', name: 'Bhrithi', alt: 'Bhrithi with a big smile and a big win' },
  { src: '/academy/win-hemanth-team.jpg', name: 'Hemanth & Team', alt: 'Hemanth and his team' },
  { src: '/academy/win-issac.jpg', name: 'Issac from Malaysia', alt: 'Issac from Malaysia' },
  { src: '/academy/win-sriniketan.jpg', name: 'Sriniketan from Chennai', alt: 'Sriniketan from Chennai' },
];
const TILTS = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5, -1, 3, -3, 1];
const TAPES = ['#F2DFB5', '#DDE3D0', '#EAD5BF'];

const CELEBRATE = [
  { icon: Trophy, title: 'Weekly tournaments', text: 'Friendly weekly tournaments with real prizes, so every child gets to play, win and try again.', tint: '#F2DFB5' },
  { icon: Award, title: 'A certificate with their name', text: 'Children who finish the program get a certificate with their own name on it. A big deal at age five.', tint: '#DDE3D0' },
  { icon: MessageSquareHeart, title: 'Parents hear every win', text: 'Regular updates tell you what your child learned and every little breakthrough along the way.', tint: '#EAD5BF' },
];

function Lightbox({ index, onClose, onMove }) {
  const win = WINS[index];
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onMove(1);
      if (event.key === 'ArrowLeft') onMove(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onMove]);
  return (
    <motion.div className="pg-lightbox" role="dialog" aria-modal="true" aria-label={win.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <button type="button" className="pg-lb-close" onClick={onClose} aria-label="Close"><X size={22} /></button>
      <button type="button" className="pg-lb-arrow is-left" onClick={(e) => { e.stopPropagation(); onMove(-1); }} aria-label="Previous photo"><ChevronLeft size={26} /></button>
      <AnimatePresence mode="wait">
        <motion.figure key={index} className="pg-lb-frame" onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: EASE }}
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.3} onDragEnd={(_, info) => { if (info.offset.x < -70) onMove(1); if (info.offset.x > 70) onMove(-1); }}>
          <img src={win.src} alt={win.alt} draggable="false" />
          <figcaption><b>{win.name}</b><span>{index + 1} / {WINS.length}</span></figcaption>
        </motion.figure>
      </AnimatePresence>
      <button type="button" className="pg-lb-arrow is-right" onClick={(e) => { e.stopPropagation(); onMove(1); }} aria-label="Next photo"><ChevronRight size={26} /></button>
    </motion.div>
  );
}

function QuoteWall() {
  const coaches = useMemo(() => ['All', ...new Set(TESTIMONIALS.map((t) => t.coach))], []);
  const [filter, setFilter] = useState('All');
  const shown = TESTIMONIALS.filter((t) => filter === 'All' || t.coach === filter);
  return (
    <>
      <div className="pg-filter" role="group" aria-label="Filter by coach">
        {coaches.map((coach) => (
          <button key={coach} type="button" className={filter === coach ? 'is-on' : ''} aria-pressed={filter === coach} onClick={() => setFilter(coach)}>
            {filter === coach && <motion.span layoutId="pg-filter-pill" className="pg-filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span>{coach.replace('Coach ', '')}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="pg-quote-wall">
        <AnimatePresence mode="popLayout">
          {shown.map((t) => (
            <motion.figure layout key={t.quote} className="pg-qcard" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.3, ease: EASE }}>
              <span className="pg-qcard-mark" aria-hidden="true">“</span>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <b>{t.who}</b>
                <span className="pg-qcard-tags"><i>{t.coach}</i>{t.time && <i className="is-time">{t.time}</i>}</span>
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default function LittleWinsPage() {
  const [open, setOpen] = useState(null);
  const move = useCallback((delta) => setOpen((i) => (i + delta + WINS.length) % WINS.length), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <SitePage title="Little Wins">
      <section className="ah-wrap pg-hero pg-hero-wins">
        <div>
          <Reveal><span className="ah-kicker">Little wins</span></Reveal>
          <Reveal delay={0.05}><h1>Every big thinker starts with a <em>little win.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">First checkmates, first certificates, first prizes. Here are our students’ proud moments, and <Scribble>what their parents say.</Scribble></p></Reveal>
        </div>
        <Reveal delay={0.1} className="pg-fan" aria-hidden="true">
          {[WINS[0], WINS[8], WINS[5]].map((win, i) => (
            <span key={win.src} className="pg-fan-card" style={{ '--i': i - 1 }}><img src={win.src} alt="" /></span>
          ))}
        </Reveal>
      </section>

      <section className="ah-wrap pg-wall-wrap" aria-label="Student photos">
        <div className="pg-wall">
          {WINS.map((win, i) => (
            <Reveal key={win.src} delay={(i % 4) * 0.05} as="button" type="button" className="pg-polaroid" style={{ '--tilt': `${TILTS[i]}deg`, '--tape': TAPES[i % 3] }}
              onClick={() => setOpen(i)} aria-label={`Open photo: ${win.name}`}>
              <span className="pg-tape" aria-hidden="true" />
              <img src={win.src} alt={win.alt} loading="lazy" />
              <span className="pg-polaroid-cap">{win.name}</span>
            </Reveal>
          ))}
        </div>
        <p className="pg-hint">Tap a photo to see it bigger.</p>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">How we celebrate</span></Reveal>
        <Reveal delay={0.05}><h2>Little wins, noticed <em>every week.</em></h2></Reveal>
        <div className="pg-celebrate">
          {CELEBRATE.map(({ icon: Icon, title, text, tint }, i) => (
            <Reveal key={title} delay={i * 0.08} className="pg-celebrate-card">
              <motion.span className="pg-celebrate-icon" style={{ background: tint }} whileHover={{ rotate: [0, -12, 10, -6, 0], scale: 1.08 }} transition={{ duration: 0.6 }}><Icon size={30} strokeWidth={1.8} /></motion.span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ah-dark">
        <div className="ah-wrap ah-section pg-split">
          <div>
            <Reveal><span className="ah-kicker ah-kicker-light">Our students</span></Reveal>
            <Reveal delay={0.05}><h2>Award winners &amp; <em className="ah-gold">champions.</em></h2></Reveal>
            <Reveal delay={0.1}><p className="ah-sub ah-sub-light">Trophies, tournaments and first full games — a few of the moments our students are proudest of.</p></Reveal>
          </div>
          <Reveal delay={0.1}><VideoFacade id="lSsyWbKT0dY" title="Chess With Rathish: our students" caption="Watch our champions" /></Reveal>
        </div>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">From our parents</span></Reveal>
        <Reveal delay={0.05}><h2>Real families. <em>Real little wins.</em></h2></Reveal>
        <Reveal delay={0.1}><QuoteWall /></Reveal>
      </section>

      <CtaBand title={<>Start your child’s first <em className="ah-gold">little win.</em></>} text="The first class is free. 30 minutes, one coach, one child." />

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onMove={move} />}</AnimatePresence>
    </SitePage>
  );
}
