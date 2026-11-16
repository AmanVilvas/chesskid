import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, CheckCheck, Copy, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { CHAT, EASE, Faq, PHONE, Reveal, SitePage } from './site';
import { PLANS } from './data';

const AGES = ['4 years', '5 years', '6 years', 'Other'];
const COUNTRIES = ['India', 'UAE', 'USA', 'UK', 'Canada', 'Australia', 'Singapore', 'Malaysia', 'Other'];
const PLAYED = ['Never', 'Tried a few times', 'Knows some moves'];
const GOALS = ['Build focus and patience', 'Build thinking skills', 'Build confidence', 'Just have fun'];
const MOODS = ['Shy and quiet', 'Curious and chatty', 'Energetic and playful', 'Focused and serious'];
const PLAN_OPTIONS = [['', 'Not sure yet'], ['personal', PLANS.personal.label], ['paired', PLANS.paired.label]];

const STEPS = [
  ['Send the enquiry on WhatsApp', 'Press the button above, review the prepared message and press Send.'],
  ['Agree a suitable time', 'Our team replies on WhatsApp and offers a few times that suit your time zone, such as mornings, evenings or weekends.'],
  ['Join the introductory session', 'You will join the 30-minute session using the joining details we send.'],
  ['Discuss a paid plan if you wish', 'If your child enjoyed it, we can talk about what comes next. No pressure either way.'],
];

const FAQS = [
  ['Do I need to pay to book?', 'No. No payment details are needed to book an introductory session. You only choose a plan if your child enjoys it and you wish to continue.'],
  ['Can I sit in on the class?', 'Yes, and we encourage it for the first few classes. Young children settle faster when a parent is nearby.'],
  ['We live outside India. Will the timings work?', 'Yes. Classes run mornings, evenings and weekends for families in the UAE, the US, the UK, Canada, Australia, Singapore and beyond.'],
  ['Why is the introductory session one coach and one child if we are interested in paired classes?', 'The introductory session is always one coach and one child, so your coach can get to know your child. You can tell us your preferred plan and change your mind at any time.'],
];

const REQUIRED = {
  parent: 'Please enter your name.',
  age: 'Please choose your child’s age.',
  country: 'Please choose the country you live in.',
};

function Chips({ label, options, value, onChange, required, name, error, id }) {
  return (
    <fieldset className={`pg-field ${error ? 'has-error' : ''}`} aria-describedby={error ? `${id}-err` : undefined}>
      <legend>{label}{required && <span className="pg-req"> (required)</span>}</legend>
      <div className="pg-chips" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const [val, text] = Array.isArray(option) ? option : [option, option];
          return (
            <button key={val || text} type="button" role="radio" aria-checked={value === val} name={name} className={value === val ? 'is-on' : ''} onClick={() => onChange(value === val && !required ? '' : val)}>
              {value === val && <Check size={14} strokeWidth={3} />}{text}
            </button>
          );
        })}
      </div>
      {error && <p id={`${id}-err`} className="pg-field-error" role="alert">{error}</p>}
    </fieldset>
  );
}

function buildMessage(f) {
  const lines = [
    'Hi! I’d like to book an introductory session (30 minutes, one coach, one child).',
    '',
    `Parent: ${f.parent.trim() || '…'}`,
    `Child’s age: ${f.age || '…'}`,
    `Country: ${f.country || '…'}`,
  ];
  if (f.plan) lines.push(`Interested in: ${PLANS[f.plan].label}`);
  if (f.child.trim()) lines.push(`Child’s name: ${f.child.trim()}`);
  if (f.played) lines.push(`Played chess before: ${f.played}`);
  if (f.goal) lines.push(`Main goal: ${f.goal}`);
  if (f.mood) lines.push(`My child is mostly: ${f.mood}`);
  if (f.notes.trim()) lines.push(`Notes: ${f.notes.trim()}`);
  return lines.join('\n');
}

export default function BookPage() {
  const [params] = useSearchParams();
  const startPlan = PLANS[params.get('plan')] ? params.get('plan') : '';
  const [form, setForm] = useState({ parent: '', age: '', country: '', plan: startPlan, child: '', played: '', goal: '', mood: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const moreRef = useRef(null);
  const set = (field) => (value) => { setForm((f) => ({ ...f, [field]: value })); setErrors((e) => ({ ...e, [field]: undefined })); setOpened(false); setCopied(false); };
  const message = useMemo(() => buildMessage(form), [form]);
  const filled = [form.parent.trim(), form.age, form.country].filter(Boolean).length;

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.parent.trim()) next.parent = REQUIRED.parent;
    if (!form.age) next.age = REQUIRED.age;
    if (!form.country) next.country = REQUIRED.country;
    setErrors(next);
    if (Object.keys(next).length) {
      const firstField = ['parent', 'age', 'country'].find((k) => next[k]);
      document.getElementById(`book-${firstField}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    setOpened(true);
  };

  const copyMessage = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); } catch { setCopied(false); window.prompt('Copy your message:', message); }
  };

  return (
    <SitePage title="Book an Introductory Session">
      <section className="ah-wrap pg-hero pg-book">
        <div className="pg-book-intro">
          <Reveal><span className="ah-kicker">Introductory session</span></Reveal>
          <Reveal delay={0.05}><h1>Book your child’s <em>introductory session.</em></h1></Reveal>
          <Reveal delay={0.1}><p className="ah-lead">A 30-minute online session with one coach and one child. No chess experience or payment details needed. Tell us your child’s age and country, then contact us on WhatsApp to arrange a time.</p></Reveal>
          <Reveal delay={0.14} as="ul" className="pg-ticks">
            <li><Check size={16} strokeWidth={3} /> 30 minutes, online, with a FIDE-rated coach</li>
            <li><Check size={16} strokeWidth={3} /> No payment details needed</li>
            <li><Check size={16} strokeWidth={3} /> No chess knowledge needed, for you or your child</li>
          </Reveal>

          <Reveal delay={0.18} className="pg-preview" aria-label="Your WhatsApp message preview">
            <div className="pg-preview-top"><span className="pg-preview-avatar">TA</span><span><b>The Thinking Academy</b><small>We will reply on WhatsApp to arrange a time</small></span></div>
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
          <p className="pg-form-sub">Three quick answers. Takes under a minute.</p>

          <label className={`pg-field ${errors.parent ? 'has-error' : ''}`} id="book-parent">
            <span className="pg-label">Your name<span className="pg-req"> (required)</span></span>
            <input name="parent" autoComplete="name" value={form.parent} onChange={(e) => set('parent')(e.target.value)} required maxLength={70} aria-invalid={Boolean(errors.parent)} aria-describedby={errors.parent ? 'parent-err' : undefined} />
            {errors.parent && <p id="parent-err" className="pg-field-error" role="alert">{errors.parent}</p>}
          </label>
          <div id="book-age"><Chips id="age" label="Child’s age" name="age" options={AGES} value={form.age} onChange={set('age')} required error={errors.age} /></div>
          {form.age === 'Other' && <p className="pg-age-note">For other ages, send your enquiry and tell us your child’s age. We can talk about suitability on WhatsApp.</p>}
          <div id="book-country"><Chips id="country" label="Country you live in" name="country" options={COUNTRIES} value={form.country} onChange={set('country')} required error={errors.country} /></div>

          <motion.button type="submit" className="ah-btn ah-btn-clay pg-submit" whileTap={{ scale: 0.97 }}>
            <Send size={17} /> Continue on WhatsApp
          </motion.button>
          <p className="pg-form-note">Opens a prepared message. Review it and press Send. Your session time is confirmed after we reply and agree a slot.</p>
          {form.plan && <p className="pg-plan-line">Preferred plan: <b>{PLANS[form.plan].label}</b>. The introductory session is always one coach and one child. <button type="button" onClick={() => { if (moreRef.current) { moreRef.current.open = true; moreRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }}>Change</button></p>}

          <div className="pg-fallback">
            <button type="button" className="pg-copy" onClick={copyMessage}><Copy size={16} /> {copied ? 'Copied' : 'Copy message'}</button>
            <span>WhatsApp not opening? Copy the message and send it to +91 74484 08684.</span>
          </div>
          <AnimatePresence>
            {opened && <motion.p className="pg-sent" role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE }}>We tried to open WhatsApp. Press Send there to contact us. If nothing opened, copy your message above, or call or email us below. Your session is not booked until we reply and agree a time.</motion.p>}
          </AnimatePresence>

          <details className="pg-optional" ref={moreRef}>
            <summary>Tell your coach more <small>Optional</small></summary>
            <Chips id="plan" label="Preferred plan" name="plan" options={PLAN_OPTIONS} value={form.plan} onChange={(v) => set('plan')(v)} />
            <label className="pg-field">
              <span className="pg-label">Child’s first name</span>
              <input name="child" value={form.child} onChange={(e) => set('child')(e.target.value)} maxLength={40} />
            </label>
            <Chips id="played" label="Played chess before?" name="played" options={PLAYED} value={form.played} onChange={set('played')} />
            <Chips id="goal" label="Main goal" name="goal" options={GOALS} value={form.goal} onChange={set('goal')} />
            <Chips id="mood" label="Your child is mostly…" name="mood" options={MOODS} value={form.mood} onChange={set('mood')} />
            <label className="pg-field">
              <span className="pg-label">Anything your coach should know?</span>
              <textarea name="notes" rows={3} value={form.notes} onChange={(e) => set('notes')(e.target.value)} placeholder="Learning style, attention span, best days and times" maxLength={500} />
            </label>
          </details>

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
        <Reveal><span className="ah-kicker">After you send your enquiry</span></Reveal>
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
