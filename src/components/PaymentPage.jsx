import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

const plans = [
  {
    id: 'starter',
    name: 'Parent Starter',
    duration: '1 Month',
    sessions: '8 sessions',
    tag: null,
    saveBadge: 'Save 10%',
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
    saveBadge: 'Save 25%',
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
    tag: null,
    saveBadge: 'Save 35%',
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
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="w-full min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #f8f4ff 0%, #fef0f5 30%, #f0fff4 70%, #f0f8ff 100%)' }}>

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2d4a1e 0%, #3d6120 50%, #1e3a14 100%)' }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #b5d46a 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c4973a 0%, transparent 70%)' }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 pb-14">
          {/* Back + Brand row */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              Chess With Rathish · 1:1 Trial Plans
            </span>
          </div>

          {/* Centred headline */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#b5d46a] inline-block" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">Pricing</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white mb-4">
              Simple Transparent{' '}
              <span style={{ color: '#c4973a', fontStyle: 'italic' }}>Pricing</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-md mx-auto mb-8">
              Teach chess to your child at home — even if you've never played before.
              Pick the plan that fits your family.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 border border-white/20 rounded-xl p-1.5">
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  billing === 'monthly'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling('yearly')}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  billing === 'yearly'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Yearly
                <span className="text-[11px] font-black text-[#c4973a]">Save 30%</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRICING CARDS ─────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => {
            const price = billing === 'monthly' ? plan.priceMonthlyDisplay : plan.priceYearlyDisplay;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1 ${
                  plan.isPopular ? 'shadow-2xl ring-2 ring-[#c4973a]/30' : 'shadow-lg'
                }`}
                style={
                  plan.isPopular
                    ? { background: 'linear-gradient(160deg, #e53935 0%, #c4973a 60%, #b5606b 100%)' }
                    : { background: '#ffffff' }
                }
              >
                <div className="p-6">
                  {/* Top row: plan name + save badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-base font-black ${plan.isPopular ? 'text-white' : 'text-gray-800'}`}>
                      {plan.name}
                    </h3>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full ${
                        plan.isPopular
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {plan.saveBadge}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <span className={`text-4xl font-black leading-none ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                      {price}
                    </span>
                    <span className={`text-sm font-medium ml-1 ${plan.isPopular ? 'text-white/80' : 'text-gray-500'}`}>
                      /month
                    </span>
                  </div>

                  {/* Short tagline */}
                  <p className={`text-xs leading-relaxed mb-5 ${plan.isPopular ? 'text-white/85' : 'text-gray-500'}`}>
                    {plan.id === 'starter'
                      ? 'Perfect for families new to chess wanting to start right.'
                      : plan.id === 'family'
                        ? 'The full parent-guided chess curriculum with live coaching.'
                        : 'Unlimited access to the complete chess mastery program.'}
                  </p>

                  {/* CTA Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all cursor-pointer mb-5 ${
                      plan.isPopular
                        ? 'bg-white text-[#c4973a] hover:bg-gray-50 shadow-md'
                        : 'bg-[#2d4a1e] text-white hover:bg-[#3d6120] shadow-sm'
                    }`}
                  >
                    Get Started
                  </button>

                  {/* Features list */}
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div
                          className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.isPopular ? 'bg-white/25' : 'bg-[#2d4a1e]/10'
                          }`}
                        >
                          <Check className={`w-2.5 h-2.5 ${plan.isPopular ? 'text-white' : 'text-[#2d4a1e]'}`} />
                        </div>
                        <span className={`text-xs leading-snug ${plan.isPopular ? 'text-white/90' : 'text-gray-600'}`}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Duration tag */}
                  <div
                    className={`mt-5 pt-4 border-t text-[11px] font-bold uppercase tracking-wider flex items-center justify-between ${
                      plan.isPopular ? 'border-white/20 text-white/60' : 'border-gray-100 text-gray-400'
                    }`}
                  >
                    <span>{plan.duration} · {plan.sessions}</span>
                    {plan.tag && (
                      <span className="text-[9px] font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-full text-white border border-white/30">
                        {plan.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-5 italic">
          All prices shown are monthly subscription fees. Cancel anytime.
        </p>
      </div>

      {/* ── EVERY PLAN INCLUDES + CTA ─────────────────────────────────── */}
      <div
        style={{ background: 'linear-gradient(135deg, #2d4a1e 0%, #1e3a14 100%)' }}
        className="text-white py-12 sm:py-16"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
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

