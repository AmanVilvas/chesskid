import React, { useState } from 'react';
import { ArrowLeft, Lock, CheckCircle2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

const plans = [
  {
    id: 'starter',
    name: 'Parent Starter',
    duration: '1 Month',
    sessions: '8 sessions',
    tag: null,
    saveBadge: 'SAVE 10%',
    priceMonthly: 999,
    priceYearly: 899,
    priceTotal: 999,
    isPopular: false,
    features: [
      'Step-by-step Parent Teaching Scripts for Units 1–11',
      '8 live guided video lessons for your child (30 min each)',
      'Printable worksheets & at-home activities',
      'Basic puzzle practice (Levels 1–3)',
      'Email support (48h response)',
      'Cancel anytime',
    ],
    priceMonthlyDisplay: '₹999',
    priceYearlyDisplay: '₹899',
    priceTotalDisplay: '₹999',
  },
  {
    id: 'family',
    name: 'Family Coach',
    duration: '3 Months',
    sessions: '24 sessions',
    tag: 'CORE PROGRAM',
    saveBadge: 'SAVE 25%',
    priceMonthly: 1999,
    priceYearly: 1499,
    priceTotal: 5997,
    isPopular: true,
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
    priceYearlyDisplay: '₹1,499',
    priceTotalDisplay: '₹5,997',
  },
  {
    id: 'master',
    name: 'Master Parent',
    duration: '6 Months',
    sessions: '48 sessions',
    tag: 'BEST VALUE',
    saveBadge: 'SAVE 35%',
    priceMonthly: 2999,
    priceYearly: 1949,
    priceTotal: 17994,
    isPopular: false,
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
    priceYearlyDisplay: '₹1,949',
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
  const [activePlanId, setActivePlanId] = useState('family');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [billing, setBilling] = useState('yearly');
  const [autoRenew, setAutoRenew] = useState(true);

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[1];

  const handleChoosePlan = () => {
    setSelectedPlan(activePlan);
  };

  return (
    <div className="w-full min-h-screen font-sans" style={{ background: '#edf3f8' }}>

      {/* ── TOP DARK GREEN BAR ─────────────────────────────────────────────── */}
      <div className="w-full bg-[#163b1e] text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={onBackToCurriculum}
            className="inline-flex items-center gap-1.5 font-bold text-white/85 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Lesson Planner</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#489f1f]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9ae6b4]">
              CHESSKID · PARENT PLANS
            </span>
          </div>
        </div>
      </div>

      {/* ── MAIN FLOATING CARD CONTAINER ──────────────────────────────────── */}
      <div className="w-full py-8 sm:py-12 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-300/40 border border-slate-200/80 p-6 sm:p-10 lg:p-11">

          {/* Centered Top Pill Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#edf2f7] text-[#4a5568] rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-slate-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#388e17]" />
              <span>PRICING</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#1a202c] tracking-tight mb-2.5">
              Flexible Pricing for Every <span className="text-[#36831e] font-black italic">Family</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed mb-6 font-medium">
              Teach chess to your child at home — even if you've never played before.
              <br className="hidden sm:inline" /> Pick the plan designed to fit your family's journey.
            </p>

            {/* Yearly / Monthly Toggle */}
            <div className="inline-flex items-center bg-[#edf2f7] p-1 rounded-2xl border border-slate-200/80 mb-8">
              <button
                type="button"
                onClick={() => setBilling('yearly')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  billing === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>Yearly</span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                  SAVE 30%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  billing === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* ── 2-COLUMN STRUCTURE: 3 PLAN CARDS (LEFT) + INCLUDES CARD (RIGHT) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">

            {/* Left Column: Exactly 3 Plan Cards */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                {plans.map((plan) => {
                  const isSelected = activePlanId === plan.id;
                  const price = billing === 'monthly' ? plan.priceMonthlyDisplay : plan.priceYearlyDisplay;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setActivePlanId(plan.id)}
                      className={`relative rounded-2xl p-4 sm:p-4.5 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 select-none ${
                        isSelected
                          ? 'bg-[#36831e] text-white shadow-lg shadow-[#36831e]/25 border-2 border-[#36831e]'
                          : 'bg-white text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-xs'
                      }`}
                    >
                      {/* Left: Checkbox + Plan Name + Badges */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Selector Indicator */}
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-white text-[#36831e] shadow-xs'
                              : 'border-2 border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5]" />}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-base font-extrabold tracking-tight truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                              {plan.name}
                            </span>
                            {plan.tag && (
                              <span
                                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isSelected
                                    ? 'bg-[#205c0c] text-[#ffe066] border border-[#ffe066]/30'
                                    : plan.id === 'master'
                                      ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {plan.tag}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-white/20 text-white border border-white/30'
                                  : 'bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]'
                              }`}
                            >
                              {plan.saveBadge}
                            </span>
                            <span className={`text-[11px] font-medium ${isSelected ? 'text-white/85' : 'text-gray-400'}`}>
                              {plan.duration} · {plan.sessions}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price */}
                      <div className="text-right flex-shrink-0">
                        <span className={`text-xl sm:text-2xl font-black tracking-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {price}
                        </span>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                          /month
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA Button + Guarantee text (Exact match to reference mockup) */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleChoosePlan}
                  className="px-6 py-3 rounded-xl font-extrabold text-xs sm:text-[13px] uppercase tracking-wider text-white bg-[#36831e] hover:bg-[#2d6b18] active:scale-95 shadow-md shadow-[#36831e]/25 transition-all cursor-pointer flex-shrink-0"
                >
                  CHOOSE PLAN · {activePlan.name.toUpperCase()}
                </button>
                <span className="text-[11px] text-gray-400 font-medium">
                  Instant activation · 7-day money-back guarantee
                </span>
              </div>
            </div>

            {/* Right Column: "Includes :" Card */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                  <h3 className="text-sm font-extrabold text-gray-900">
                    Includes :
                  </h3>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                    {activePlan.name}
                  </span>
                </div>

                {/* Features list with checkmarks on the right */}
                <ul className="space-y-2.5">
                  {activePlan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between gap-3 text-xs sm:text-[13px] text-gray-700 py-1 border-b border-gray-50 last:border-0"
                    >
                      <span className="leading-snug pr-2 text-gray-600 font-medium">
                        {feature}
                      </span>
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Row: Renewal toggle + cancel notice */}
              <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoRenew}
                    onClick={() => setAutoRenew(!autoRenew)}
                    className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoRenew ? 'bg-[#36831e]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        autoRenew ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-gray-600">
                    {billing === 'yearly'
                      ? `Renewed at a price of ${activePlan.priceYearlyDisplay}/month`
                      : `Renewed at a price of ${activePlan.priceMonthlyDisplay}/month`}
                  </span>
                </div>

                <span className="text-[11px] font-medium text-gray-400">
                  Cancel anytime
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── LOWER DARK GREEN SECTION (FULL WIDTH) ─────────────────────────── */}
      <div className="w-full bg-[#163b1e] text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* Left — Inclusions */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffe066] mb-4">
                EVERY PLAN INCLUDES
              </p>
              <ul className="space-y-3">
                {inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#ffe066] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Book Intro CTA + Contact */}
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setSelectedPlan(plans[0])}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#fed348] hover:bg-[#ffd633] text-[#163b1e] font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>BOOK A FREE INTRODUCTORY CLASS</span>
              </button>

              <div className="text-xs text-white/80 space-y-1">
                <p className="font-bold text-white text-sm">+91 74484 08684</p>
                <p>chesswiththekid.com</p>
                <p>@chesswiththekid</p>
              </div>
            </div>

          </div>

          {/* Parent Questions (Accordion FAQs) */}
          <div className="mt-10 border-t border-white/10 pt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#ffe066] mb-4">
              PARENT QUESTIONS
            </p>
            <div className="space-y-2">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="bg-[#123118]/70 border border-white/10 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full text-left px-5 py-3.5 flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <span>{f.q}</span>
                      {isOpen
                        ? <ChevronUp className="w-4 h-4 text-[#ffe066] flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0" />
                      }
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-3.5 text-xs text-white/75 leading-relaxed border-t border-white/5 pt-2.5">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tagline footer strip */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span>CHESS AS THE TOOL. THINKING AS THE OUTCOME.</span>
            <span>AGES 5 – 14</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER AT THE VERY BOTTOM ────────────────────────────────────── */}
      <footer className="w-full bg-[#0f2814] text-white/60 py-4 text-center text-xs border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <p>© ChessKid.com — All Rights Reserved. Master the game one lesson at a time.</p>
        </div>
      </footer>

      {/* ── CHECKOUT MODAL ──────────────────────────────────────────────── */}
      {selectedPlan && (
        <CheckoutModal
          plan={{
            id: selectedPlan.id,
            name: selectedPlan.name,
            icon: '♟️',
            tagline: `${selectedPlan.duration} — ${selectedPlan.sessions}`,
            priceMonthly: selectedPlan.priceMonthly,
            priceAnnual: selectedPlan.priceYearly,
          }}
          billingCycle={billing === 'yearly' ? 'annual' : 'monthly'}
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

