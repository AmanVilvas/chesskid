import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { CtaBand, EASE, Faq, HOME_COURSE, Reveal, Scribble, SitePage, TESTIMONIALS, VideoFacade, wa } from './site';

const CHIPS = ['30-minute classes', '1:1 only', 'Recording on request', '100% online', 'Certificate on completion'];
const STATS = [['200+', 'children coached'], ['7+', 'years teaching kids'], ['6', 'FIDE-rated coaches'], ['1:1', 'classes only, never groups']];

const PHASES = [
  { when: 'Month 1', title: 'Learning to look', text: 'The board comes alive. Pieces get names, roles and stories. Your child plays their first complete game.', topics: ['The board and all pieces', 'How each piece moves', 'Scanning before acting', 'First full game'], color: '#B5452F' },
  { when: 'Month 1 to 2', title: 'Learning to think', text: 'Before every move: stop, look, why? Your child starts developing the pause that changes everything.', topics: ['One move ahead', 'Protecting pieces', 'Guarding the king', 'Correcting mistakes'], color: '#E0A93B' },
  { when: 'Month 2 to 3', title: 'Learning to plan', text: 'From reacting to deciding. Your child starts explaining their moves and playing with purpose.', topics: ['Simple plans', 'Piece teamwork', 'Playing with intention', 'Staying focused'], color: '#6F8F5C' },
  { when: 'Month 3', title: 'Learning to finish', text: 'Checkmate, endgames, a challenge match and a certificate. Your child finishes proud and hungry for more.', topics: ['Checkmate basics', 'Handling pressure', 'Challenge match', 'Program certificate'], color: '#2B1E18' },
];

const HOW = [
  { big: '30', small: 'min', title: 'Minutes per class', text: 'Young children concentrate in short bursts. 30 minutes is just right: they finish energised, not exhausted.' },
  { big: '1:1', title: 'One coach, one child', text: 'Never a group. Your child gets seen, heard and guided, not lost in a crowd of kids on a screen.' },
  { big: '2×', title: 'Classes per week', text: 'Enough to build momentum, not so much it becomes a burden. Consistency over intensity.' },
  { big: '▶', title: 'Recording on request', text: 'Missed something? Ask and we share the class, so you and your child can watch it again.' },
  { big: '∞', title: 'Lifetime tournaments', text: 'After the program, your child gets lifelong access to our weekly tournaments with real prizes.' },
  { big: '✓', title: 'You can sit in', text: 'We encourage it, especially in the first few classes. Children settle faster when you are quietly nearby.' },
];

const COUNTRIES = [
  { id: 'IN', name: 'India', personal: '₹4,800', paired: '₹3,200' },
  { id: 'AE', name: 'UAE', personal: 'AED 260', paired: 'AED 175' },
  { id: 'US', name: 'USA', personal: '$65', paired: '$43' },
  { id: 'GB', name: 'UK', personal: '£49', paired: '£33' },
  { id: 'CA', name: 'Canada', personal: 'CA$85', paired: 'CA$57' },
  { id: 'AU', name: 'Australia', personal: 'A$95', paired: 'A$63' },
  { id: 'SG', name: 'Singapore', personal: 'S$85', paired: 'S$57' },
  { id: 'MY', name: 'Malaysia', personal: 'RM210', paired: 'RM140' },
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

const INCLUDES = [
  ['8 live classes a month', 'Two 30-minute live classes every week.'],
  ['A FIDE-rated coach', 'Every coach is Lichess-verified and trained on our 4 to 6 method.'],
  ['Built for ages 4 to 6', 'A curriculum paced for little attention spans.'],
  ['Recording on request', 'Missed something? Ask and we’ll share the class.'],
  ['Regular parent updates', 'You always know what your child learned and what’s next.'],
  ['First class free', 'No payment to try. Decide after you see your child play.'],
];

const FAQS = [
  ['Is 30 minutes really enough for my child to learn?', 'Yes, and for this age it’s the ideal length. Young children concentrate in short, intense bursts. A 30-minute class holds their focus completely, so they retain more and enjoy it more than in a 60-minute class that loses them halfway.'],
  ['Does my child need to know anything about chess?', 'Not at all. The program assumes zero prior knowledge. We start from the very beginning, what the board looks like and which piece is which, and make it feel like a story, not a lesson.'],
  ['Will my child actually stay engaged on a screen?', 'This is a live 1:1 class with a real coach, not a pre-recorded video or an app. The personal connection makes all the difference, and most parents are surprised by how focused their child stays.'],
  ['What is the difference between 1:1 and paired classes?', 'Personal classes are one coach with your child alone. Paired classes are one coach with two children, so your child learns alongside a partner at a lower monthly price. Both include 8 live classes a month.'],
  ['What if my child loses interest or it is not working?', 'We will tell you honestly. Our coaches talk with parents regularly, and if the format isn’t clicking, we adjust. If you decide to stop, we refund the months you haven’t used. Months already used are charged at the 1-month rate.'],
  ['Can I sit in and watch?', 'Yes, and we especially encourage it in the first few classes. Young children settle faster when a parent is quietly nearby. You’re welcome, not in the way.'],
  ['We live outside India. Will the timings work?', 'Yes. Classes run mornings, evenings and weekends for families in the UAE, the US, the UK, Canada, Australia, Singapore and beyond.'],
  ['Our country isn’t listed. What do we pay?', 'Message us on WhatsApp and we’ll share the price for your country.'],
];

function ProgramTimeline() {
  const [phase, setPhase] = useState(0);
  const item = PHASES[phase];
  return (
    <div className="pg-program">
      <div className="pg-dots" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => {
          const owner = Math.floor(i / 6);
          return (
            <motion.span key={i} className="pg-dot"
              animate={{ backgroundColor: owner <= phase ? (owner === 3 ? '#F5ECDF' : PHASES[owner].color) : 'rgba(255,253,249,0.07)', color: (owner === 3 || owner === 1) && owner <= phase ? '#2B1E18' : 'rgba(255,253,249,0.85)', scale: owner === phase ? 1.12 : 1 }}
              transition={{ duration: 0.3, delay: owner === phase ? (i % 6) * 0.04 : 0 }}>
              {i + 1}
            </motion.span>
          );
        })}
      </div>
      <div className="pg-phase-tabs" role="tablist" aria-label="Program phases">
        {PHASES.map((p, i) => (
          <button key={p.title} type="button" role="tab" aria-selected={phase === i} className={phase === i ? 'is-on' : ''} style={{ '--c': p.color }} onClick={() => setPhase(i)} onMouseEnter={() => setPhase(i)}>
            <span className="pg-phase-no">{i + 1}</span>
            <span><small>{p.when}</small><b>{p.title}</b></span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={phase} className="pg-phase-panel" role="tabpanel" style={{ '--c': item.color }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: EASE }}>
          <div>
            <span className="pg-phase-when">Phase {phase + 1} · {item.when} · classes {phase * 6 + 1}–{phase * 6 + 6}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
          <ul>{item.topics.map((t, i) => <motion.li key={t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.06 }}><Check size={15} strokeWidth={3} />{t}</motion.li>)}</ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Plans() {
  const [country, setCountry] = useState(guessCountry);
  const c = COUNTRIES.find((x) => x.id === country);
  const plans = [
    { id: 'personal', kicker: 'Personal classes', badge: '1:1', title: 'A coach just for your child.', text: 'Individual guidance, with learning at your child’s pace.', price: c.personal, points: ['8 live classes every month', 'All program benefits included'], tint: '#EAD5BF' },
    { id: 'paired', kicker: 'Paired classes', badge: '1:2', title: 'A partner to learn with.', text: 'Personal guidance and shared learning with one other child.', price: c.paired, points: ['One coach, two children', '8 live classes every month', 'All program benefits included'], tint: '#DDE3D0' },
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
              <span className="ah-kicker">{plan.kicker}</span>
              <h3>{plan.title}</h3>
              <p>{plan.text}</p>
            </div>
            <div className="pg-plan-body">
              <div className="pg-plan-price">
                <AnimatePresence mode="popLayout">
                  <motion.b key={plan.price} initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -26, opacity: 0 }} transition={{ duration: 0.28, ease: EASE }}>{plan.price}</motion.b>
                </AnimatePresence>
                <span>/ month · per child</span>
              </div>
              <ul>{plan.points.map((p) => <li key={p}><Check size={15} strokeWidth={3} />{p}</li>)}</ul>
              <Link className="ah-btn ah-btn-dark" to={`/book?plan=${plan.id}`}>Book your first class free <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="pg-elsewhere">Living somewhere else? <a href={wa('Hi! Could you share the class prices for my country?')} target="_blank" rel="noreferrer"><MessageCircle size={15} /> Message us on WhatsApp</a> and we’ll share your price.</p>
    </>
  );
}

export default function ProgramsPage() {
  const quotes = TESTIMONIALS.filter((t) => ['Coach Rakesh', 'Coach Rathish'].includes(t.coach) || t.who.startsWith('Shrinicka'));
  return (
    <SitePage title="Live classes">
      <section className="ah-wrap pg-hero pg-hero-programs">
        <div>
          <Reveal><span className="ah-kicker">Ages 4 to 6 · Online · 1:1</span></Reveal>
          <Reveal delay={0.05}><h1>Chess for kids who <em>think big.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">A gentle, structured 30-minute program built for children aged 4 to 6. No chess knowledge needed, <Scribble>just a curious mind</Scribble> ready to start thinking.</p></Reveal>
          <Reveal delay={0.12} className="ah-chips">{CHIPS.map((chip) => <span key={chip}><Check size={14} strokeWidth={3} /> {chip}</span>)}</Reveal>
          <Reveal delay={0.16} className="ah-actions">
            <Link className="ah-btn ah-btn-dark" to="/book">Book the first class free <ArrowRight size={16} /></Link>
            <a className="ah-btn ah-btn-line" href="#program">See the program</a>
          </Reveal>
        </div>
        <Reveal delay={0.1}><VideoFacade id="Rl5jlIPKTRo" title="A parent and child talk about their chess classes" caption="A parent and child on their classes" /></Reveal>
      </section>

      <section className="ah-stats" aria-label="The program in numbers">
        <div className="ah-wrap ah-stats-row">{STATS.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}</div>
      </section>

      <section className="ah-section ah-wrap pg-why">
        <div>
          <Reveal><span className="ah-kicker">Why ages 4 to 6?</span></Reveal>
          <Reveal delay={0.05}><h2>Age 4 is not too early. <em>It might be exactly right.</em></h2></Reveal>
          <Reveal delay={0.1} className="pg-why-copy">
            <p>Most parents assume chess is for older children. But between ages 4 and 6, your child is forming the habits of <b>how</b> they think, not just what they learn.</p>
            <p>This is the window where patience, structured reasoning and calm decision making are easiest to introduce naturally, through play. Once it’s set, it compounds for life.</p>
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
              <Reveal><span className="ah-kicker ah-kicker-light">The Little Thinker Program</span></Reveal>
              <Reveal delay={0.05}><h2>24 classes. 4 phases. <em className="ah-gold">Your child’s first 3 months.</em></h2></Reveal>
            </div>
            <Reveal delay={0.1}><p className="ah-sub ah-sub-light">Every class is 30 minutes: short enough for a young child’s focus, structured enough to build real skills.</p></Reveal>
          </div>
          <Reveal delay={0.1}><ProgramTimeline /></Reveal>
          <Reveal delay={0.1} className="pg-core">
            <b>This is our Core Program.</b> 3 months, 2 classes a week. It’s the first stage of our full 30-unit path to playing real games. After the Little Thinker Program, your child moves on to check and checkmate patterns, castling, simple tactics and game sense.
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
          <b>Stop anytime. Get back what you haven’t used.</b>
          <p>If a longer plan isn’t right for your child, stop whenever you like. We refund the months you haven’t used, and the months you have used are charged at the 1-month rate. Need a break for travel or exams? Tell us in advance and we’ll pause your classes.</p>
        </Reveal>
      </section>

      <section className="ah-section ah-wrap" id="plans">
        <Reveal><span className="ah-kicker">Plans and prices</span></Reveal>
        <Reveal delay={0.05}><h2>One-on-one, <em>or with a partner.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub pg-plans-sub">2 classes a week · 30 minutes each · the first class is always free</p></Reveal>
        <Plans />
        <div className="pg-includes">
          <Reveal><h3>Every plan includes</h3></Reveal>
          <div className="pg-includes-grid">
            {INCLUDES.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 3) * 0.06} className="pg-include"><Check size={18} strokeWidth={3} /><span><b>{t}</b>{d}</span></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">Not ready for 1:1 classes?</span></Reveal>
        <Reveal delay={0.05}><h2>Three ways to start, <em>one curriculum.</em></h2></Reveal>
        <Reveal delay={0.08}><p className="ah-sub">Every option follows the same lessons, so your child can move up whenever you’re ready without starting over.</p></Reveal>
        <div className="pg-paths">
          <Reveal className="pg-path"><small>You teach, we guide</small><h3>Free Course</h3><b className="pg-path-price">Free</b><p>Short videos show you what to teach, one piece at a time.</p><Link className="ah-btn ah-btn-line ah-btn-sm" to={HOME_COURSE}>Start the free course</Link></Reveal>
          <span className="pg-path-arrow" aria-hidden="true">→</span>
          <Reveal delay={0.08} className="pg-path"><small>Practice at home</small><h3>Worksheet packs</h3><b className="pg-path-price">₹2,000 <span>per 6 units</span></b><p>Printable practice for each unit of the free course.</p><a className="ah-btn ah-btn-line ah-btn-sm" href={wa('Hi! I would like the worksheet packs for the free course.')} target="_blank" rel="noreferrer">Get worksheets</a></Reveal>
          <span className="pg-path-arrow" aria-hidden="true">→</span>
          <Reveal delay={0.16} className="pg-path is-featured"><small>A coach teaches</small><h3>1:1 Live Classes</h3><b className="pg-path-price">8 classes <span>a month</span></b><p>Two 30-minute classes a week with a FIDE-rated coach. Prices for your country are shown above.</p><Link className="ah-btn ah-btn-clay ah-btn-sm" to="/book">Book the first class free</Link></Reveal>
        </div>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">What parents say</span></Reveal>
        <Reveal delay={0.05}><h2>Real families. <em>Real little wins.</em></h2></Reveal>
        <div className="pg-quote-row">
          {quotes.map((t, i) => (
            <Reveal key={t.quote} delay={i * 0.07} as="figure" className="pg-qcard">
              <span className="pg-qcard-mark" aria-hidden="true">“</span>
              <blockquote>{t.quote}</blockquote>
              <figcaption><b>{t.who}</b><span className="pg-qcard-tags"><i>{t.coach}</i>{t.time && <i className="is-time">{t.time}</i>}</span></figcaption>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ah-section ah-wrap pg-faq-section">
        <div>
          <Reveal><span className="ah-kicker">Questions parents ask</span></Reveal>
          <Reveal delay={0.05}><h2>Honest answers. <em>No sales talk.</em></h2></Reveal>
        </div>
        <Reveal delay={0.1}><Faq items={FAQS} /></Reveal>
      </section>

      <CtaBand kicker="One move to start" title={<>Your child’s first class <em className="ah-gold">is free.</em></>} text="No pressure. Just chess. Meet your child’s coach, see how your little one responds, and decide from there." />
    </SitePage>
  );
}
