import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Check, CreditCard, Info, MessageCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { apiRequest } from '../data/apiClient';
import { COLOURS, FAVS, PARTS, inr, listPrice, priceFor } from './data';
import { Faq, Reveal, SitePage, wa } from './site';
import './homecourse.css';
import './preview.css';

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

function parseParts(value) {
  if (!value) return [1];
  if (value === 'all') return [1, 2, 3];
  const ids = [...new Set(value.split(',').map(Number))].filter((n) => n >= 1 && n <= PARTS.length);
  return ids.length ? ids.sort() : [1];
}

function PersonaliseForm({ purchase, onSaved }) {
  const [name, setName] = useState('');
  const [fav, setFav] = useState(FAVS[0][0]);
  const [colour, setColour] = useState(COLOURS[3][0]);
  const [saved, setSaved] = useState(false);
  const save = async (event) => {
    event.preventDefault();
    await apiRequest('/api/payments/personalisation', { method: 'POST', body: { id: purchase.id, name, fav, colour } });
    setSaved(true);
    onSaved?.();
  };
  return (
    <form className="co-maker" onSubmit={save}>
      <h3>Tell us 3 things for the personalised version</h3>
      <label>Your child’s first name<input value={name} onChange={(e) => { setName(e.target.value.slice(0, 20)); setSaved(false); }} placeholder="e.g. Aarav" required /></label>
      <div className="hc-maker-field"><span>Favourite thing</span>
        <div className="hc-fav-row">{FAVS.map(([emoji, label]) => <button key={label} type="button" className={fav === emoji ? 'is-on' : ''} aria-pressed={fav === emoji} onClick={() => setFav(emoji)}><span aria-hidden="true">{emoji}</span>{label}</button>)}</div>
      </div>
      <div className="hc-maker-field"><span>Favourite colour</span>
        <div className="hc-colour-row">{COLOURS.map(([hex, label]) => <button key={hex} type="button" className={colour === hex ? 'is-on' : ''} aria-pressed={colour === hex} aria-label={label} style={{ '--sw': hex }} onClick={() => setColour(hex)} />)}</div>
      </div>
      <button type="submit" className="ah-btn ah-btn-dark ah-btn-sm" style={{ justifySelf: 'start' }}>Save for our team</button>
      {saved && <p className="co-saved" role="status"><Check size={15} strokeWidth={3} style={{ verticalAlign: '-2px' }} /> Saved. Our team will use this to prepare the personalised version.</p>}
    </form>
  );
}

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const personalised = params.get('version') === 'personalised';
  const [purchases, setPurchases] = useState(null);
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState('');

  const refresh = () => apiRequest('/api/payments/purchases').then(({ purchases: list }) => setPurchases(list)).catch(() => setPurchases([]));
  useEffect(() => { if (user) refresh(); else setPurchases([]); }, [user]);

  const owned = useMemo(() => new Set((purchases || []).flatMap((p) => p.parts)), [purchases]);
  const wanted = parseParts(params.get('part'));
  const selected = wanted.filter((id) => !owned.has(id));
  const allOwned = owned.size === PARTS.length;

  const setSelection = (ids) => { const next = new URLSearchParams(params); next.set('part', ids.length === 3 ? 'all' : ids.join(',') || '1'); setParams(next, { replace: true }); };
  const setVersion = (value) => { const next = new URLSearchParams(params); next.set('version', value ? 'personalised' : 'standard'); setParams(next, { replace: true }); };
  const toggle = (id) => { if (owned.has(id)) return; setSelection(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id].sort()); };

  const total = priceFor(selected, personalised);
  const list = listPrice(selected, personalised);
  const saving = list - total;
  const from = `${location.pathname}${location.search}`;

  const pay = async () => {
    setError('');
    setPaying(true);
    try {
      // A short pause so the demo feels like a real payment.
      const [{ purchase }] = await Promise.all([apiRequest('/api/payments/demo-pay', { method: 'POST', body: { parts: selected, personalised } }), sleep(1500)]);
      setReceipt(purchase);
      refresh();
    } catch (payError) {
      setError(payError.message || 'The demo payment could not be completed.');
    } finally { setPaying(false); }
  };
  const reset = async () => { await apiRequest('/api/payments/demo-reset', { method: 'POST', body: {} }); setReceipt(null); refresh(); };

  return (
    <SitePage title="Checkout">
      <div className="co-wrap">
        <Reveal><h1>{receipt ? 'Your course is unlocked.' : 'Unlock the Home Course.'}</h1></Reveal>
        <div className="co-demo" role="note">
          <Info size={18} />
          <span><b>Demo mode.</b> No real payment is taken and no card details are asked for. Pressing Pay simulates a successful payment and unlocks the course on your account, so you can see exactly how buying will work.
            {purchases && purchases.length > 0 && <button type="button" onClick={reset}>Reset my demo purchase</button>}</span>
        </div>

        {receipt ? (
          <div className="co-done">
            <div className="co-done-head">
              <motion.span className="co-tick" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}><Check size={38} strokeWidth={3.4} /></motion.span>
              <div><b style={{ fontSize: 22 }}>Payment received (demo)</b><p style={{ color: 'var(--ink-2)', marginTop: 4 }}>Part{receipt.parts.length > 1 ? 's' : ''} {receipt.parts.join(', ')} {receipt.parts.length > 1 ? 'are' : 'is'} now open on your account.</p></div>
            </div>
            <div className="co-receipt">
              <span className="co-stamp">DEMO</span>
              <h3>Receipt</h3>
              <dl>
                <dt>Reference</dt><dd>{receipt.id}</dd>
                <dt>Unlocked</dt><dd>{receipt.parts.length === 3 ? 'All 30 units (Parts 1–3)' : receipt.parts.map((id) => `Part ${id} (units ${PARTS[id - 1].units[0]}–${PARTS[id - 1].units[1]})`).join(', ')}</dd>
                <dt>Version</dt><dd>{receipt.personalised ? 'Personalised' : 'Standard'}</dd>
                <dt>Amount</dt><dd>{inr(receipt.amount)}</dd>
                <dt>Date</dt><dd>{new Date(receipt.at).toLocaleString()}</dd>
              </dl>
            </div>
            {receipt.personalised && <PersonaliseForm purchase={receipt} />}
            <div className="co-actions">
              <Link className="ah-btn ah-btn-clay" to="/parents">Open your course <ArrowRight size={16} /></Link>
              <Link className="ah-btn ah-btn-line" to="/play">Open Kids view</Link>
            </div>
          </div>
        ) : (
          <div className="co-grid">
            <div>
              <div className="co-card">
                <p className="co-step">1 · Version</p>
                <div className="hc-toggle hc-toggle-md co-version" role="radiogroup" aria-label="Course version">
                  {[[false, 'Standard'], [true, 'Personalised']].map(([value, label]) => (
                    <button key={label} type="button" role="radio" aria-checked={personalised === value} className={personalised === value ? 'is-on' : ''} onClick={() => setVersion(value)}><span>{value && <Sparkles size={14} />}{label}</span></button>
                  ))}
                </div>
                <p style={{ color: 'var(--ink-2)', fontSize: 14 }}>The same 30 chess units either way. Personalised adds your child’s name, favourite things and colours, and costs ₹1,000 more per part.</p>
              </div>
              <div className="co-card">
                <p className="co-step">2 · Choose what to unlock</p>
                <div className="co-parts">
                  {PARTS.map((p) => {
                    const isOwned = owned.has(p.id);
                    return (
                      <button key={p.id} type="button" className="co-part" style={{ '--c': p.color }} aria-pressed={selected.includes(p.id)} disabled={isOwned} onClick={() => toggle(p.id)}>
                        <span className="co-check"><Check size={16} strokeWidth={3.4} /></span>
                        <span><b>Part {p.id} · units {p.units[0]}–{p.units[1]}</b><small>{p.title}</small></span>
                        {isOwned ? <span className="co-owned">You own this</span> : <span className="co-part-price">{inr(personalised ? p.per : p.std)}</span>}
                      </button>
                    );
                  })}
                </div>
                <p style={{ marginTop: 12, color: 'var(--ink-2)', fontSize: 14 }}>New to chess? Start with Part 1. Choosing all three parts uses the bundle price.</p>
              </div>
            </div>

            <aside className="co-summary" aria-label="Order summary">
              <h2>Order summary</h2>
              {allOwned ? (
                <p style={{ color: 'rgba(255,253,249,.8)' }}>You already own all three parts. Your whole course is open.</p>
              ) : selected.length === 0 ? (
                <p style={{ color: 'rgba(255,253,249,.8)' }}>Choose at least one part to continue.</p>
              ) : (
                <>
                  <ul className="co-lines">
                    {selected.map((id) => <li key={id}><span>Part {id} · units {PARTS[id - 1].units[0]}–{PARTS[id - 1].units[1]}</span><span>{inr(PARTS[id - 1][personalised ? 'per' : 'std'])}</span></li>)}
                    {saving > 0 && <li className="is-save"><span>Bundle saving</span><span>−{inr(saving)}</span></li>}
                    <li><span>Version</span><span>{personalised ? 'Personalised' : 'Standard'}</span></li>
                  </ul>
                  <div className="co-total"><span>Total</span><b>{inr(total)}</b></div>
                </>
              )}
              {error && <p className="co-error" role="alert">{error}</p>}
              {!loading && !user && selected.length > 0 && (
                <div className="co-auth">
                  <p>Sign in or create a parent account first, so the course unlocks on your account. Your choices are saved.</p>
                  <Link className="ah-btn ah-btn-cream" to="/signup" state={{ from }}>Create a parent account</Link>
                  <Link className="ah-btn ah-btn-outline-light" to="/login" state={{ from }}>Parent Login</Link>
                </div>
              )}
              {user && selected.length > 0 && (
                <button type="button" className="ah-btn ah-btn-clay co-pay" onClick={pay} disabled={paying}>
                  {paying ? <><span className="co-spin" /> Processing demo payment…</> : <><CreditCard size={18} /> Pay {inr(total)}</>}
                </button>
              )}
              {allOwned && <Link className="ah-btn ah-btn-cream" to="/parents">Open your course</Link>}
              <p className="co-fine">Demo mode: nothing is charged. In the live version, this step shares a secure payment link.</p>
            </aside>
          </div>
        )}

        {!receipt && (
          <div style={{ marginTop: 56 }}>
            <Reveal><h2 style={{ fontSize: 30, marginBottom: 16 }}>Questions before you unlock?</h2></Reveal>
            <Faq items={[
              ['What do I get?', 'Every unit has a parent guide video, an animated lesson, a puzzle sheet and a printable worksheet. Parts are packages of ten units.'],
              ['Can I try before I buy?', 'Yes. The course preview has two full units to try, with no account or payment needed.'],
              ['Can I ask a person first?', 'Of course. Message us on WhatsApp and we will help you choose where to begin.'],
            ]} />
            <p style={{ marginTop: 16 }}><Link className="ah-link" to="/courses/beginner-chess/preview">Open the course preview <ArrowRight size={14} /></Link> · <a className="ah-link" href={wa('Hi! I have a question about the Home Course.')} target="_blank" rel="noreferrer"><MessageCircle size={14} /> Message us</a></p>
          </div>
        )}
      </div>
    </SitePage>
  );
}
