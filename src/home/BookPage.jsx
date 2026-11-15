import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, CheckCheck, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { CHAT, EASE, Faq, PHONE, Reveal, SitePage } from './site';

const AGES = ['4 years', '5 years', '6 years', 'Other'];
const COUNTRIES = ['India', 'UAE', 'USA', 'UK', 'Canada', 'Australia', 'Singapore', 'Malaysia', 'Other'];
const PLAYED = ['Never', 'Tried a few times', 'Knows some moves'];
const GOALS = ['Build focus and patience', 'Build thinking skills', 'Build confidence', 'Just have fun'];
const MOODS = ['Shy and quiet', 'Curious and chatty', 'Energetic and playful', 'Focused and serious'];
const PLANS = { personal: 'Personal 1:1 classes', paired: 'Paired 1:2 classes' };

const STEPS = [
  ['Send your details', 'Fill in the short form above. It takes under a minute — just your name, your child’s age and your country.'],
  ['Pick a time', 'We’ll message you on WhatsApp and offer a few slots that work for your time zone — mornings, evenings or weekends.'],
  ['Meet your coach', 'Join the 30-minute class on Zoom. Just a laptop or tablet with a camera. No chess board needed.'],
  ['First class, free', 'No payment details are needed to book. If your child loves it, we’ll talk about what comes next. No pressure either way.'],
];

const FAQS = [
  ['Is the first class really free?', 'Yes. No payment details are needed to book. You only choose a plan if your child enjoys it.'],
  ['What do we need for the class?', 'A laptop or tablet with a camera and a steady internet connection. No chess board needed.'],
  ['Can I sit in on the class?', 'Yes, and we encourage it for the first few classes. Young children settle faster when a parent is nearby.'],
  ['We live outside India. Will the timings work?', 'Yes. Classes run mornings, evenings and weekends for families in the UAE, the US, the UK, Canada, Australia, Singapore and beyond.'],
];

function Chips({ label, options, value, onChange, required, name }) {
  return (
    <fieldset className="pg-field">
      <legend>{label}{required && <span aria-hidden="true"> *</span>}</legend>
      <div className="pg-chips" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button key={option} type="button" role="radio" aria-checked={value === option} name={name} className={value === option ? 'is-on' : ''} onClick={() => onChange(value === option && !required ? '' : option)}>
            {value === option && <Check size={14} strokeWidth={3} />}{option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function buildMessage(f, plan) {
  const lines = [
    'Hi! I’d like to book a free first chess class.',
    '',
    `Parent: ${f.parent || '…'}`,
    `Child’s age: ${f.age || '…'}`,
    `Country: ${f.country || '…'}`,
  ];
  if (plan) lines.push(`Interested in: ${PLANS[plan]}`);
  if (f.child) lines.push(`Child’s name: ${f.child}`);
  if (f.played) lines.push(`Played chess before: ${f.played}`);
  if (f.goal) lines.push(`Main goal: ${f.goal}`);
  if (f.mood) lines.push(`My child is mostly: ${f.mood}`);
  if (f.notes.trim()) lines.push(`Notes: ${f.notes.trim()}`);
  return lines.join('\n');
}

export default function BookPage() {
  const [params] = useSearchParams();
  const plan = PLANS[params.get('plan')] ? params.get('plan') : null;
  const [form, setForm] = useState({ parent: '', age: '', country: '', child: '', played: '', goal: '', mood: '', notes: '' });
  const [error, setError] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (field) => (value) => { setForm((f) => ({ ...f, [field]: value })); setError(false); };
  const message = useMemo(() => buildMessage(form, plan), [form, plan]);
  const ready = form.parent.trim() && form.age && form.country;
  const filled = [form.parent.trim(), form.age, form.country].filter(Boolean).length;

  const submit = (event) => {
    event.preventDefault();
    if (!ready) { setError(true); return; }
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    setSent(true);
  };

  return (
    <SitePage title="Book your child’s free first class">
      <section className="ah-wrap pg-hero pg-book">
        <div className="pg-book-intro">
          <Reveal><span className="ah-kicker">First class free</span></Reveal>
          <Reveal delay={0.05}><h1>Book your child’s <em>free first class.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">Tell us a little about your child. We’ll reply on WhatsApp to pick a time that works in your time zone.</p></Reveal>
          <Reveal delay={0.14} as="ul" className="pg-ticks">
            <li><Check size={16} strokeWidth={3} /> 30 minutes, 1:1 with a FIDE-rated coach</li>
            <li><Check size={16} strokeWidth={3} /> No payment details needed</li>
            <li><Check size={16} strokeWidth={3} /> No chess knowledge needed, for you or your child</li>
          </Reveal>

          <Reveal delay={0.18} className="pg-preview" aria-label="Your WhatsApp message preview">
            <div className="pg-preview-top"><span className="pg-preview-avatar">TA</span><span><b>The Thinking Academy</b><small>usually replies quickly</small></span></div>
            <div className="pg-preview-body">
              <motion.div layout className="pg-bubble-out">
                {message.split('\n').map((line, i) => <span key={i} className={line.includes('…') ? 'is-empty' : ''}>{line || ' '}</span>)}
                <i><CheckCheck size={14} /></i>
              </motion.div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} as="form" className="pg-form" onSubmit={submit} noValidate>
          <div className="pg-form-head">
            <h2>About your child</h2>
            <span className="pg-progress" aria-label={`${filled} of 3 required answers`}>{[0, 1, 2].map((i) => <i key={i} className={i < filled ? 'is-on' : ''} />)}</span>
          </div>
          <p className="pg-form-sub">Takes under a minute.</p>

          <label className="pg-field">
            <span className="pg-label">Your name <span aria-hidden="true">*</span></span>
            <input name="parent" autoComplete="name" value={form.parent} onChange={(e) => set('parent')(e.target.value)} required maxLength={70} />
          </label>
          <Chips label="Child’s age" name="age" options={AGES} value={form.age} onChange={set('age')} required />
          <Chips label="Country you live in" name="country" options={COUNTRIES} value={form.country} onChange={set('country')} required />

          <div className="pg-optional">
            <span className="pg-optional-tag">Optional · helps your coach</span>
            <label className="pg-field">
              <span className="pg-label">Child’s first name</span>
              <input name="child" value={form.child} onChange={(e) => set('child')(e.target.value)} maxLength={40} />
            </label>
            <Chips label="Played chess before?" name="played" options={PLAYED} value={form.played} onChange={set('played')} />
            <Chips label="Main goal" name="goal" options={GOALS} value={form.goal} onChange={set('goal')} />
            <Chips label="Your child is mostly…" name="mood" options={MOODS} value={form.mood} onChange={set('mood')} />
            <label className="pg-field">
              <span className="pg-label">Anything your coach should know?</span>
              <textarea name="notes" rows={3} value={form.notes} onChange={(e) => set('notes')(e.target.value)} placeholder="Learning style, attention span, best days and times" maxLength={500} />
            </label>
          </div>

          <AnimatePresence>{error && <motion.p className="pg-error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Please add your name, your child’s age and your country.</motion.p>}</AnimatePresence>

          <motion.button type="submit" className="ah-btn ah-btn-clay pg-submit" whileTap={{ scale: 0.97 }} animate={ready ? { scale: [1, 1.03, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
            <Send size={17} /> Send on WhatsApp to book
          </motion.button>
          <p className="pg-form-note">This opens WhatsApp with your details filled in. Nothing is sent until you press send. We reply ASAP.</p>
          <AnimatePresence>{sent && <motion.p className="pg-sent" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE }}><Check size={16} strokeWidth={3} /> WhatsApp opened. Press send there and we’ll reply with times.</motion.p>}</AnimatePresence>

          <div className="pg-talk">
            <small>Prefer to talk first?</small>
            <a href={CHAT} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Chat with us on WhatsApp</a>
            <a href={`tel:+${PHONE}`}><Phone size={16} /> +91 74484 08684</a>
            <a href="mailto:rathishravi98@gmail.com"><Mail size={16} /> rathishravi98@gmail.com</a>
            <span><MapPin size={16} /> 110b Bungalow Medu, Mettupalayam, Coimbatore District, Tamil Nadu 641301, India</span>
          </div>
        </Reveal>
      </section>

      <section className="ah-section ah-wrap">
        <Reveal><span className="ah-kicker">After you book</span></Reveal>
        <Reveal delay={0.05}><h2>What happens <em>next.</em></h2></Reveal>
        <ol className="pg-next">
          {STEPS.map(([title, text], i) => (
            <Reveal key={title} delay={i * 0.08} as="li" className="pg-next-step">
              <span className="pg-next-no">{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="ah-section ah-wrap pg-faq-section">
        <div>
          <Reveal><span className="ah-kicker">Before you book</span></Reveal>
          <Reveal delay={0.05}><h2>Questions <em>parents ask.</em></h2></Reveal>
        </div>
        <Reveal delay={0.1}><Faq items={FAQS} /></Reveal>
      </section>
    </SitePage>
  );
}
