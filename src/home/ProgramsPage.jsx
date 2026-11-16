import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { CtaBand, EASE, Faq, HOME_COURSE, Reveal, Scribble, SitePage, TESTIMONIALS, VideoFacade, wa } from './site';
import { CERT_NOTE, CLASS_FORMAT, COUNTRIES, INTRO, PARTS, PHASES, PLANS, UNITS, inr } from './data';

const CHIPS = ['30-minute classes', 'Personal or paired', 'Recording on request', '100% online', 'Certificates after a coach assessment'];
const STATS = [['200+', 'children coached'], ['7+', 'years Rathish has coached children'], ['6', 'FIDE-rated coaches'], ['2', 'children at most in any class']];

const HOW = [
  { big: '30', small: 'min', title: 'Minutes per class', text: 'Short classes suit young learners. Stories and mini-games help your coach adapt to how your child is doing on the day.' },
  { big: '1:2', title: 'Personal or paired', text: 'Personal classes are one coach and one child. Paired classes are one coach and two children. Never more than two.' },
  { big: '8', title: 'Classes per month', text: 'Eight 30-minute classes a month, usually scheduled twice a week.' },
  { big: '▶', title: 'Recording on request', text: 'Missed something? Ask and we share the class, so you and your child can watch it again.' },
  { big: '♟', title: 'Friendly tournaments', text: 'A chance to play, win and try again. Ask us on WhatsApp who can enter and when.' },
  { big: '✓', title: 'You can sit in', text: 'We encourage it, especially in the first few classes. Children settle faster when you are quietly nearby.' },
];

const INCLUDES = [
  ['8 live classes a month', 'Eight 30-minute classes, usually twice a week.'],
  ['A FIDE-rated coach', 'Every coach is trained on our 4 to 6 method.'],
  ['Built for ages 4 to 6', 'A curriculum paced for young learners.'],
  ['Recording on request', 'Missed something? Ask and we’ll share the class.'],
  ['Regular parent updates', 'You always know what your child learned and what’s next.'],
  ['An introductory session', 'Meet your coach first: one coach, one child, no payment details needed.'],
];

const FAQS = [
  ['Is 30 minutes the right length for my child?', 'Many young children concentrate best in short sessions, so classes are 30 minutes. Your coach adapts the activities to how your child responds on the day.'],
  ['Does my child need to know anything about chess?', 'Not at all. We start from the very beginning, what the board looks like and which piece is which, and make it feel like a story, not a lesson.'],
  ['Will my child stay engaged on a screen?', 'Classes are live with a real coach, not a recorded video or an app. Stories and mini-games help keep things playful. Tell us about your child when you book so your coach knows what to expect.'],
  ['What is the difference between personal and paired classes?', 'Personal classes are one coach with your child. Paired classes are one coach with two children, so your child learns alongside a partner at a lower monthly price per child. Both include eight 30-minute classes a month. The introductory session is always one coach and one child.'],
  ['Are paired classes right for my child?', 'Paired classes can suit children who enjoy learning alongside someone else. If your child is shy or you are not sure, ask us on WhatsApp and we will talk it through.'],
  ['Which coach will teach my child?', 'Tell us about your child when you book. We will talk through coaches and timings with you on WhatsApp.'],
  ['How does my child move through the units?', 'There are 30 units across five phases. Some units take one class and others need more practice, so your coach moves forward when your child is ready. ' + CERT_NOTE],
  ['Can I sit in and watch?', 'Yes, and we encourage it in the first few classes. Young children settle faster when a parent is quietly nearby.'],
  ['What if it does not seem to be working?', 'Tell us. Our coaches talk with parents regularly and can adjust the activities. For questions about payments, missed classes or pausing, message us on WhatsApp.'],
  ['We live outside India. Will the timings work?', 'Classes run mornings, evenings and weekends for families in the UAE, the US, the UK, Canada, Australia, Singapore and beyond.'],
  ['Our country isn’t listed. What do we pay?', 'Message us on WhatsApp and we’ll share the price for your country.'],
];

/** A best guess from the browser's time zone; nothing leaves the device. */
function guessCountry() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (/Kolkata|Calcutta/.test(zone)) return 'IN';
    if (/Dubai/.test(zone)) return 'AE';
    if (/London/.test(zone)) return 'GB';
    if (/Toronto|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns/.test(zone)) return 'CA';
    if (/^America\//.test(zone)) return 'US';
    if (/^Australia\//.test(zone)) return 'AU';
    if (/Singapore/.test(zone)) return 'SG';
    if (/Kuala_Lumpur|Kuching/.test(zone)) return 'MY';
  } catch { /* fall back to India */ }
  return 'IN';
}

function LearningPath() {
  const [phase, setPhase] = useState(0);
  const item = PHASES[phase];
  return (
    <div className="pg-program">
      <div className="pg-dots pg-dots-30" aria-hidden="true">
        {UNITS.map((unit) => {
          const owner = unit.phase - 1;
          const lit = owner <= phase;
          return (
            <motion.span key={unit.n} className="pg-dot"
              animate={{ backgroundColor: lit ? (owner === 4 ? '#F5ECDF' : PHASES[owner].color) : 'rgba(255,253,249,0.07)', color: lit && (owner === 1 || owner === 4) ? '#2B1E18' : 'rgba(255,253,249,0.85)', scale: owner === phase ? 1.1 : 1 }}
              transition={{ duration: 0.3, delay: owner === phase ? (unit.n % 6) * 0.04 : 0 }}>
              {unit.n}
            </motion.span>
          );
        })}
      </div>
      <div className="pg-phase-tabs" role="tablist" aria-label="Curriculum phases">
        {PHASES.map((p, i) => (
          <button key={p.title} type="button" role="tab" aria-selected={phase === i} className={phase === i ? 'is-on' : ''} style={{ '--c': p.color }} onClick={() => setPhase(i)}>
            <span className="pg-phase-no">{i + 1}</span>
            <span><small>Units {p.units[0]}–{p.units[1]}</small><b>{p.title}</b></span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={phase} className="pg-phase-panel" role="tabpanel" style={{ '--c': item.color }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
          <div>
            <span className="pg-phase-when">Phase {item.id} · Units {item.units[0]}–{item.units[1]}</span>
            <h3>{item.title}</h3>
            <p>{item.outcome}</p>
            <p className="pg-phase-milestone">Milestone in the syllabus: <b>{item.milestone}</b></p>
          </div>
          <ol className="pg-phase-units">{phaseUnits(item).map((u) => <motion.li key={u.n} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 + (u.n - item.units[0]) * 0.05 }}><span>{u.n}</span>{u.title}</motion.li>)}</ol>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
const phaseUnits = (phase) => UNITS.filter((u) => u.phase === phase.id);

function Plans() {
  const [country, setCountry] = useState(guessCountry);
  const c = COUNTRIES.find((x) => x.id === country);
  const plans = [
    { ...PLANS.personal, price: c.personal, title: 'A coach just for your child.', text: 'One coach, one child, with learning at your child’s pace.', points: ['One coach and one child', 'Eight 30-minute classes per month'], tint: '#EAD5BF' },
    { ...PLANS.paired, price: c.paired, title: 'A partner to learn with.', text: 'One coach with two children, so your child learns alongside a partner.', points: ['One coach and two children', 'Eight 30-minute classes per month'], tint: '#DDE3D0' },
  ];
  return (
    <>
      <div className="pg-country" role="radiogroup" aria-label="Show prices for">
        <span>Show prices for</span>
        {COUNTRIES.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={country === x.id} className={country === x.id ? 'is-on' : ''} onClick={() => setCountry(x.id)}>{x.name}</button>
        ))}
      </div>
      <div className="pg-plans">
        {plans.map((plan, i) => (
          <Reveal key={plan.id} delay={i * 0.08} className="pg-plan">
            <div className="pg-plan-top" style={{ background: plan.tint }}>
              <span className="pg-plan-badge">{plan.badge}</span>
              <span className="ah-kicker">{plan.label}</span>
              <h3>{plan.title}</h3>
              <p>{plan.text}</p>
            </div>
            <div className="pg-plan-body">
              <div className="pg-plan-price">
                <AnimatePresence mode="popLayout">
                  <motion.b key={plan.price} initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -26, opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}>{plan.price}</motion.b>
                </AnimatePresence>
                <span>{plan.unit} · {c.name}</span>
              </div>
              <ul>{plan.points.map((p) => <li key={p}><Check size={15} strokeWidth={3} />{p}</li>)}</ul>
              <Link className="ah-btn ah-btn-dark" to={`/book?plan=${plan.id}`}>{INTRO.cta} <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="pg-elsewhere">The introductory session is always one coach and one child, even if you are exploring paired classes. Living somewhere else? <a href={wa('Hi! Could you share the class prices for my country?')} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Message us on WhatsApp</a> and we’ll share your price.</p>
    </>
  );
}

export default function ProgramsPage() {
  const reviews = [
    TESTIMONIALS.find((t) => t.who === 'Parent of a 6-year-old'),
    TESTIMONIALS.find((t) => t.who.startsWith('Shrinicka')),
    TESTIMONIALS.find((t) => t.coach === 'Our team'),
  ].filter(Boolean);
  return (
    <SitePage title="Live Classes">
      <section className="ah-wrap pg-hero pg-hero-programs">
        <div>
          <Reveal><span className="ah-kicker">Ages 4 to 6 · Online · Personal or paired</span></Reveal>
          <Reveal delay={0.05}><h1>Chess for kids who <em>think big.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">Gentle, structured 30-minute classes built for children aged 4 to 6. No chess knowledge needed, <Scribble>just a curious mind</Scribble> ready to start thinking.</p></Reveal>
          <Reveal delay={0.12} className="ah-chips">{CHIPS.map((chip) => <span key={chip}><Check size={14} strokeWidth={3} /> {chip}</span>)}</Reveal>
          <Reveal delay={0.16} className="ah-actions">
            <Link className="ah-btn ah-btn-dark" to="/book">{INTRO.cta} <ArrowRight size={16} /></Link>
            <a className="ah-btn ah-btn-line" href="#program">See the learning path</a>
          </Reveal>
        </div>
        <Reveal delay={0.1}><VideoFacade id="Rl5jlIPKTRo" title="A parent and child talk about their chess classes" caption="Play: a parent and child on their classes" /></Reveal>
      </section>

      <section className="ah-stats" aria-label="The academy in numbers">
        <div className="ah-wrap ah-stats-row">{STATS.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}</div>
      </section>

      <section className="ah-section ah-wrap pg-why">
        <div>
          <Reveal><span className="ah-kicker">Why ages 4 to 6?</span></Reveal>
          <Reveal delay={0.05}><h2>Age 4 is not too early. <em>It might be exactly right.</em></h2></Reveal>
          <Reveal delay={0.1} className="pg-why-copy">
            <p>Most parents assume chess is for older children. But between ages 4 and 6, children are forming the habits of <b>how</b> they think, not just what they learn.</p>
            <p>Patience, careful looking and calm decision making can be introduced naturally through play. Short classes, stories and mini-games help us adapt to young learners.</p>
            <p>Chess here isn’t a sport or a competition. It’s a tool: a simple, engaging way to help your child learn to pause, observe and act with intention.</p>
          </Reveal>
        </div>
        <div className="pg-ages" aria-hidden="true">
          {['4', '5', '6'].map((age, i) => (
            <Reveal key={age} delay={0.1 + i * 0.1} className="pg-age" style={{ '--r': `${[-6, 3, -2][i]}deg` }}><span>{age}</span><small>{['pause', 'observe', 'act with intention'][i]}</small></Reveal>
          ))}
          <Reveal delay={0.4} as="figure" className="pg-why-quote">
            <blockquote>“My kid is 6 years old and she is shy, but she liked Lakshaya sir. He is soft, with a low voice. She enjoys her class.”</blockquote>
            <figcaption>Parent of a 6-year-old · Coach Lakshaya</figcaption>
          </Reveal>
        </div>
      </section>

      <section className="ah-dark" id="program">
        <div className="ah-wrap ah-section">
          <div className="ah-head-split">
            <div>
              <Reveal><span className="ah-kicker ah-kicker-light">The learning path</span></Reveal>
              <Reveal delay={0.05}><h2>30 learning units. Five phases. <em className="ah-gold">A pace that fits your child.</em></h2></Reveal>
            </div>
            <Reveal delay={0.1}><p className="ah-sub ah-sub-light">We begin with the pieces and build towards tactics and complete games. Some units take one class; others need more practice. Your coach moves forward when your child is ready.</p></Reveal>
          </div>
          <Reveal delay={0.1}><LearningPath /></Reveal>
          <Reveal delay={0.1} className="pg-core">
            <b>Certificates follow a coach assessment.</b> {CERT_NOTE} Viewing or finishing a unit does not unlock a certificate by itself.
          </Reveal>
        </div>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">How it works</span></Reveal>
        <Reveal delay={0.05}><h2>Everything designed for a <em>young child’s world.</em></h2></Reveal>
        <div className="pg-how">
          {HOW.map((h, i) => (
            <Reveal key={h.title} delay={(i % 3) * 0.07} className="pg-how-card">
              <span className="pg-how-big">{h.big}{h.small && <small>{h.small}</small>}</span>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="pg-refund">
          <b>Questions about scheduling, missed classes or payments?</b>
          <p>Message us on WhatsApp and we will answer them with you directly.</p>
        </Reveal>
      </section>

      <section className="ah-section ah-wrap" id="plans">
        <Reveal><span className="ah-kicker">Plans and prices</span></Reveal>
        <Reveal delay={0.05}><h2>Personal or paired, <em>pick what suits.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub pg-plans-sub">{CLASS_FORMAT}. Paired prices are per child, per month.</p></Reveal>
        <Plans />
        <div className="pg-includes">
          <Reveal><h3>Every live plan includes</h3></Reveal>
          <div className="pg-includes-grid">
            {INCLUDES.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 3) * 0.06} className="pg-include"><Check size={18} strokeWidth={3} /><span><b>{t}</b>{d}</span></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">Two ways to learn</span></Reveal>
        <Reveal delay={0.05}><h2>Live with a coach, <em>or at home with you.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub">Both follow the same 30-unit chess curriculum. In live classes, a coach adapts the pace to your child. In the Home Course, you work through the units together and repeat activities whenever needed.</p></Reveal>
        <div className="pg-formats">
          <Reveal className="pg-format">
            <small>Coach-led</small>
            <h3>Live classes</h3>
            <p className="pg-format-price"><b>{PLANS.paired.price}</b> <span>per child per month, paired</span></p>
            <p className="pg-format-price"><b>{PLANS.personal.price}</b> <span>per month, personal</span></p>
            <p>Eight 30-minute classes a month with a FIDE-rated coach.</p>
            <Link className="ah-btn ah-btn-clay ah-btn-sm" to="/book">{INTRO.cta}</Link>
          </Reveal>
          <Reveal delay={0.08} className="pg-format is-dark">
            <small>Parent-guided, paid</small>
            <h3>Home Course</h3>
            <p className="pg-format-price"><b>From {inr(PARTS[0].std)}</b> <span>one-time, per part</span></p>
            <p>30 units in three purchasable parts. A paid course you work through together at home.</p>
            <Link className="ah-btn ah-btn-cream ah-btn-sm" to={HOME_COURSE}>Explore the Home Course</Link>
          </Reveal>
        </div>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">What parents say</span></Reveal>
        <Reveal delay={0.05}><h2>Real families. <em>Real little wins.</em></h2></Reveal>
        <div className="pg-quote-row">
          {reviews.map((t, i) => (
            <Reveal key={t.quote} delay={i * 0.07} as="figure" className="pg-qcard">
              <span className="pg-qcard-mark" aria-hidden="true">“</span>
              <blockquote>{t.quote}</blockquote>
              <figcaption><b>{t.who}</b><span className="pg-qcard-tags"><i>{t.coach}</i>{t.time && <i className="is-time">{t.time}</i>}</span></figcaption>
            </Reveal>
          ))}
        </div>
        <p className="pg-more"><Link className="ah-link" to="/little-wins">See more parent reviews and student moments <ArrowRight size={14} /></Link></p>
      </section>

      <section className="ah-section ah-wrap pg-faq-section">
        <div>
          <Reveal><span className="ah-kicker">Questions parents ask</span></Reveal>
          <Reveal delay={0.05}><h2>Straight answers. <em>No sales talk.</em></h2></Reveal>
        </div>
        <Reveal delay={0.1}><Faq items={FAQS} /></Reveal>
      </section>

      <CtaBand kicker="One move to start" title={<>Meet your coach in an <em className="ah-gold">introductory session.</em></>} text="A 30-minute online session with one coach and one child. No payment details needed. We will arrange a suitable time on WhatsApp." />
    </SitePage>
  );
}
