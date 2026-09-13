import React, { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

const plans = [
  {
    id: 'starter',
    name: 'Parent Starter',
    duration: '1 Month',
    sessions: '8 sessions',
    tag: null,
    priceMonthly: 999,
    priceTotal: 999,
    perMonth: '₹999/month',
    buttonStyle: 'border-2 border-[#6a8f3c] text-[#6a8f3c] hover:bg-[#6a8f3c] hover:text-white',
    features: [
      'Step-by-step Parent Teaching Scripts for Units 1–11',
      '8 live guided video lessons for your child (30 min each)',
      'Printable worksheets & at-home activities',
      'Basic puzzle practice (Levels 1–3)',
      'Email support (48h response)',
    ],
    priceMonthlyDisplay: '₹999',
    priceTotalDisplay: '₹999',
  },
  {
    id: 'family',
    name: 'Family Coach',
    duration: '3 Months',
    sessions: '24 sessions',
    tag: 'CORE PROGRAM',
    priceMonthly: 1999,
    priceTotal: 5997,
    perMonth: '₹1,999/month',
    buttonStyle: 'bg-[#c4973a] hover:bg-[#b3882e] text-white border-2 border-[#c4973a] hover:border-[#b3882e]',
    features: [
      'Everything in Parent Starter',
      '24 live lessons (2 per week)',
      'Parent-vs-Child practice game mode',
      '"Stuck? Parent Tip" pop-ups for every lesson',
      'Family Progress Dashboard (up to 3 children)',
      'Monthly LIVE Parent Workshop with a Chess Expert',
      'Parent Community Forum',
      'Priority same-day support',
    ],
    priceMonthlyDisplay: '₹1,999',
    priceTotalDisplay: '₹5,997',
  },
  {
    id: 'master',
    name: 'Master Parent',
    duration: '6 Months',
    sessions: '48 sessions',
    tag: null,
    priceMonthly: 2999,
    priceTotal: 17994,
    perMonth: '₹2,999/month',
    buttonStyle: 'border-2 border-[#6a8f3c] text-[#6a8f3c] hover:bg-[#6a8f3c] hover:text-white',
    features: [
      'Everything in Family Coach',
      '48 live lessons across full curriculum',
      'Up to 5 child accounts',
      'Personalised learning path per child',
      'Tournament Prep Kit for parents',
      'Monthly 1-on-1 coaching session with a Chess Master',
      'Parent Coaching Certification (official certificate)',
      'Early access to new content & features',
      'Dedicated Family Success Advisor',
    ],
    priceMonthlyDisplay: '₹2,999',
    priceTotalDisplay: '₹17,994',
  },
];

const inclusions = [
  'Step-by-step parent teaching guide with every plan',
  'Every session recorded on request',
  'Age-appropriate chess curriculum for kids 5–14',
  'Regular child progress updates sent to parents',
];

const faqs = [
  {
    q: 'Do I need to know chess to start?',
    a: 'Not at all. Every lesson includes a plain-English parent script telling you exactly what to say and demonstrate. You learn right alongside your child.',
  },
  {
    q: 'How long is each session?',
    a: 'Each session is 30–45 minutes, designed to keep young children focused and engaged. Sessions are twice a week.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes. Upgrade or downgrade at any time from your dashboard. Access continues until your current billing cycle ends.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — your first introductory class is completely free. No credit card needed to book.',
  },
  {
    q: 'What if we miss a session?',
    a: 'All sessions are recorded (upon request) and you can reschedule up to 2 sessions per month with 24h notice.',
  },
];

export const PaymentPage = ({ onBackToCurriculum, onSubscriptionSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="w-full min-h-screen font-sans">

      {/* ── HERO SECTION (dark green) ──────────────────────────────── */}
      <div className="relative bg-[#2d4a1e] text-white overflow-hidden">

        {/* Decorative bars top-right */}
        <div className="absolute top-0 right-0 flex gap-2 p-0 pointer-events-none select-none" aria-hidden>
          <div className="w-6 h-32 bg-[#4a7a28] opacity-80 rounded-bl-sm" />
          <div className="w-6 h-20 bg-[#6a9f3a] opacity-60 rounded-bl-sm" />
          <div className="w-6 h-44 bg-[#3d6120] opacity-50 rounded-bl-sm" />
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-10 pb-12">

          {/* Back + Brand row */}
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={onBackToCurriculum}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Lesson Planner</span>
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              ChessKid · Parent Plans
            </span>
          </div>

          {/* Headline */}
          <div className="max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b5d46a] mb-3">
              Chess With Your Child
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white mb-4">
              Plans That Grow<br />With Your Child
            </h1>
            <p className="text-sm sm:text-base text-white/75 mb-7 leading-relaxed">
              Teach chess to your child at home — even if you've never played before.
              Step-by-step parent guides, live lessons, and expert support at every stage.
            </p>

            {/* Pill stats */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white/70">
              <span>30-Minute Sessions</span>
              <span className="text-white/30">•</span>
              <span>2 Classes Per Week</span>
              <span className="text-white/30">•</span>
              <span className="text-[#c4973a]">First Class Free</span>
            </div>

            {/* Amber underline accent */}
            <div className="mt-7 w-16 h-1 bg-[#c4973a] rounded-full" />
          </div>

        </div>
      </div>

      {/* ── PRICING TABLE SECTION (light cream) ───────────────────── */}
      <div className="bg-[#f5f2eb] py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">

          {/* Section label */}
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6a8f3c] mb-1">
            Choose Your Commitment
          </p>
          <p className="text-sm text-gray-600 mb-8">
            The same personalised parent-teaching curriculum in every plan. Longer commitments offer better value.
          </p>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-5 px-5 sm:px-7 text-left font-bold text-gray-700 w-1/4">
                    Plan
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className={`py-5 px-3 sm:px-5 text-center font-bold w-1/4 ${p.tag ? 'bg-gray-50/60' : ''}`}
                    >
                      <div className={`text-base font-black ${p.tag ? 'text-[#2d4a1e]' : 'text-gray-800'}`}>
                        {p.duration}
                      </div>
                      <div className="text-[11px] font-semibold text-gray-500 mt-0.5">{p.sessions}</div>
                      {p.tag ? (
                        <div className="mt-2 inline-block bg-[#c4973a] text-white text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full">
                          {p.tag}
                        </div>
                      ) : (
                        <div className="mt-2 h-5" />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price row */}
                <tr className="border-b border-gray-100">
                  <td className="py-6 px-5 sm:px-7">
                    <div className="font-bold text-gray-900 text-sm">Monthly Price</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">INR</div>
                  </td>
                  {plans.map((p) => (
                    <td
                      key={p.id}
                      className={`py-6 px-3 sm:px-5 text-center ${p.tag ? 'bg-gray-50/60' : ''}`}
                    >
                      <div className={`text-2xl sm:text-3xl font-black leading-none ${p.tag ? 'text-[#2d4a1e]' : 'text-gray-900'}`}>
                        {p.priceMonthlyDisplay}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">{p.perMonth}</div>
                    </td>
                  ))}
                </tr>

                {/* Total row */}
                <tr className="border-b border-gray-100 bg-gray-50/40">
                  <td className="py-4 px-5 sm:px-7">
                    <div className="text-xs font-bold text-gray-600">Total Program Fee</div>
                  </td>
                  {plans.map((p) => (
                    <td
                      key={p.id}
                      className={`py-4 px-3 sm:px-5 text-center ${p.tag ? 'bg-gray-50/60' : ''}`}
                    >
                      <div className="text-sm font-bold text-gray-700">{p.priceTotalDisplay}</div>
                    </td>
                  ))}
                </tr>

                {/* Sessions per week */}
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-5 sm:px-7 text-xs font-bold text-gray-600">Sessions / Week</td>
                  {plans.map((p) => (
                    <td key={p.id} className={`py-4 px-3 sm:px-5 text-center text-xs font-semibold text-gray-700 ${p.tag ? 'bg-gray-50/60' : ''}`}>
                      2 sessions
                    </td>
                  ))}
                </tr>

                {/* Parent teaching guide */}
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-5 sm:px-7 text-xs font-bold text-gray-600">Parent Teaching Scripts</td>
                  {plans.map((p, i) => (
                    <td key={p.id} className={`py-4 px-3 sm:px-5 text-center ${p.tag ? 'bg-gray-50/60' : ''}`}>
                      <span className="text-[#6a8f3c] font-bold text-sm">
                        {i === 0 ? 'Units 1–11' : i === 1 ? 'Units 1–30' : 'Full Curriculum'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Child accounts */}
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-5 sm:px-7 text-xs font-bold text-gray-600">Child Accounts</td>
                  {plans.map((p, i) => (
                    <td key={p.id} className={`py-4 px-3 sm:px-5 text-center text-xs font-semibold text-gray-700 ${p.tag ? 'bg-gray-50/60' : ''}`}>
                      {i === 0 ? '1 child' : i === 1 ? 'Up to 3' : 'Up to 5'}
                    </td>
                  ))}
                </tr>

                {/* Live Parent Workshop */}
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-5 sm:px-7 text-xs font-bold text-gray-600">Live Parent Workshop</td>
                  {plans.map((p, i) => (
                    <td key={p.id} className={`py-4 px-3 sm:px-5 text-center ${p.tag ? 'bg-gray-50/60' : ''}`}>
                      {i === 0
                        ? <span className="text-gray-300 text-base font-bold">—</span>
                        : i === 1
                          ? <span className="text-[#6a8f3c] font-bold text-xs">Monthly</span>
                          : <span className="text-[#6a8f3c] font-bold text-xs">Weekly</span>
                      }
                    </td>
                  ))}
                </tr>

                {/* 1-on-1 with Chess Master */}
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-5 sm:px-7 text-xs font-bold text-gray-600">1-on-1 with Chess Master</td>
                  {plans.map((p, i) => (
                    <td key={p.id} className={`py-4 px-3 sm:px-5 text-center ${p.tag ? 'bg-gray-50/60' : ''}`}>
                      {i < 2
                        ? <span className="text-gray-300 text-base font-bold">—</span>
                        : <span className="text-[#6a8f3c] font-bold text-xs">Monthly (30 min)</span>
                      }
                    </td>
                  ))}
                </tr>

                {/* Coaching Certificate */}
                <tr>
                  <td className="py-4 px-5 sm:px-7 text-xs font-bold text-gray-600">Parent Coaching Certificate</td>
                  {plans.map((p, i) => (
                    <td key={p.id} className={`py-4 px-3 sm:px-5 text-center ${p.tag ? 'bg-gray-50/60' : ''}`}>
                      {i < 2
                        ? <span className="text-gray-300 text-base font-bold">—</span>
                        : <span className="text-[#6a8f3c] font-bold text-xs">✓ Included</span>
                      }
                    </td>
                  ))}
                </tr>

                {/* CTA row */}
                <tr className="border-t-2 border-gray-100 bg-gray-50/30">
                  <td className="py-6 px-5 sm:px-7 text-xs text-gray-500 font-medium">
                    Pick the plan that fits your family's pace.
                  </td>
                  {plans.map((p) => (
                    <td key={p.id} className={`py-6 px-3 sm:px-5 text-center ${p.tag ? 'bg-gray-50/60' : ''}`}>
                      <button
                        type="button"
                        onClick={() => setSelectedPlan(p)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer ${p.buttonStyle}`}
                      >
                        Select
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4 italic">
            All prices shown are monthly subscription fees.
          </p>

        </div>
      </div>

      {/* ── EVERY PLAN INCLUDES + CTA (dark green) ────────────────── */}
      <div className="bg-[#2d4a1e] text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* Left — inclusions */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b5d46a] mb-4">
                Every Plan Includes
              </p>
              <ul className="space-y-2.5">
                {inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/85">
                    <CheckCircle2 className="w-4 h-4 text-[#b5d46a] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — CTA + contact */}
            <div className="flex flex-col gap-6">
              <button
                type="button"
                onClick={() => setSelectedPlan(plans[0])}
                className="w-full sm:w-auto px-8 py-4 bg-[#c4973a] hover:bg-[#b3882e] text-white font-black text-sm uppercase tracking-widest rounded-xl transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Book a Free Introductory Class
              </button>

              <div className="text-sm text-white/70 space-y-0.5">
                <p className="font-bold text-white/90">+91 74484 08684</p>
                <p>chesswiththekid.com</p>
                <p>@chesswiththekid</p>
              </div>
            </div>

          </div>

          {/* FAQ */}
          <div className="mt-12 border-t border-white/10 pt-10">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b5d46a] mb-6">
              Parent Questions
            </p>
            <div className="space-y-3">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span>{f.q}</span>
                      {isOpen
                        ? <ChevronUp className="w-4 h-4 text-[#b5d46a] flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                      }
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-white/70 leading-relaxed border-t border-white/10 pt-3">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer tagline */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span>Chess as the Tool. Thinking as the Outcome.</span>
            <span>Ages 5 – 14</span>
          </div>

        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal
          plan={{
            id: selectedPlan.id,
            name: selectedPlan.name,
            icon: '♟️',
            tagline: `${selectedPlan.duration} — ${selectedPlan.sessions}`,
            priceMonthly: selectedPlan.priceMonthly,
            priceAnnual: selectedPlan.priceMonthly,
          }}
          billingCycle="monthly"
          onClose={() => setSelectedPlan(null)}
          onSuccess={(details) => {
            setSelectedPlan(null);
            if (onSubscriptionSuccess) onSubscriptionSuccess(details);
          }}
        />
      )}

    </div>
  );
};
