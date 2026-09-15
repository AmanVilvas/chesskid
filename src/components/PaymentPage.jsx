import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Sparkles, 
  Users, 
  Cloud, 
  Crown, 
  Zap, 
  Shield, 
  Trophy, 
  LayoutGrid, 
  Columns2, 
  Moon, 
  Sun,
  ArrowRight,
  Star
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

// ── 3D GLOWING CHESS SPHERE ICONS ──────────────────────────────────────────
const TurquoiseSphere = () => (
  <div className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/30">
    <div 
      className="absolute inset-0 rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 30%, #5eead4 0%, #0d9488 55%, #115e59 100%)',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.6), 0 0 16px rgba(20,184,166,0.5)'
      }}
    />
    <div className="absolute top-1 left-2 w-4 h-2 rounded-full bg-white/40 blur-[1px]" />
    <span className="relative z-10 text-white font-black text-lg drop-shadow">♞</span>
  </div>
);

const PurpleSphere = () => (
  <div className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-xl shadow-purple-500/40">
    <div 
      className="absolute inset-0 rounded-full animate-pulse"
      style={{
        background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
        filter: 'blur(8px)',
        transform: 'scale(1.25)'
      }}
    />
    <div 
      className="absolute inset-0 rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 30%, #e9d5ff 0%, #a855f7 40%, #7e22ce 75%, #3b0764 100%)',
        boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.7), 0 0 22px rgba(168,85,247,0.7)'
      }}
    />
    <div className="absolute top-1 left-2.5 w-5 h-2.5 rounded-full bg-white/50 blur-[1px]" />
    <span className="relative z-10 text-white font-black text-xl drop-shadow">♚</span>
  </div>
);

const SilverSphere = () => (
  <div className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-slate-400/30">
    <div 
      className="absolute inset-0 rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 45%, #64748b 80%, #1e293b 100%)',
        boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.9), 0 0 16px rgba(226,232,240,0.5)'
      }}
    />
    <div className="absolute top-1 left-2 w-4 h-2 rounded-full bg-white/60 blur-[1px]" />
    <span className="relative z-10 text-slate-900 font-black text-lg drop-shadow">♛</span>
  </div>
);

const plans = [
  {
    id: 'starter',
    name: 'Parent Starter',
    themeName: 'Turquoise Trek',
    duration: '1 Month',
    sessions: '8 sessions',
    tag: null,
    saveBadge: 'Save 10%',
    priceMonthly: 999,
    priceYearly: 899,
    priceTotal: 999,
    isPopular: false,
    sphere: <TurquoiseSphere />,
    themeAccent: 'teal',
    tagline: 'Perfect for parents who are beginners and want to teach chess with confidence.',
    seats: '1 Child Account',
    cloudStorage: '11 Lesson Plans & Worksheets',
    dividerText: 'CORE STARTER CURRICULUM',
    features: [
      { text: 'Step-by-step Parent Scripts for Units 1–11', badge: 'Read-aloud' },
      { text: '8 live guided video lessons (30 min each)', badge: null },
      { text: 'Printable worksheets & at-home activities', badge: null },
      { text: 'Basic puzzle practice (Levels 1–3)', badge: null },
      { text: 'Email support (48h response)', badge: null },
      { text: 'Cancel or switch anytime', badge: null },
    ],
    priceMonthlyDisplay: '₹999',
    priceYearlyDisplay: '₹899',
    priceTotalDisplay: '₹999',
  },
  {
    id: 'family',
    name: 'Family Coach',
    themeName: 'Purple Lift',
    duration: '3 Months',
    sessions: '24 sessions',
    tag: 'MOST POPULAR',
    saveBadge: 'Save 25%',
    priceMonthly: 1999,
    priceYearly: 1499,
    priceTotal: 5997,
    isPopular: true,
    sphere: <PurpleSphere />,
    themeAccent: 'purple',
    tagline: 'Our flagship program — for parents actively teaching chess at home with multiple kids.',
    seats: 'Up to 3 Children Accounts',
    cloudStorage: '24 Live Lessons + Full Toolkit',
    dividerText: 'EVERYTHING IN STARTER +',
    features: [
      { text: '24 live lessons with chess coaches', badge: '2x / week' },
      { text: 'Parent-vs-Child interactive game mode', badge: '✨ Interactive' },
      { text: '"Stuck? Parent Tip" pop-ups for every lesson', badge: 'AI-assisted' },
      { text: 'Family Progress Dashboard for all children', badge: null },
      { text: 'Monthly LIVE Parent Workshop with a Chess Master', badge: '✨ Live Event' },
      { text: 'Parent Community Forum & discussion group', badge: null },
      { text: 'Priority same-day family support', badge: 'Fast Track' },
    ],
    priceMonthlyDisplay: '₹1,999',
    priceYearlyDisplay: '₹1,499',
    priceTotalDisplay: '₹5,997',
  },
  {
    id: 'master',
    name: 'Master Parent',
    themeName: 'Titanium Master',
    duration: '6 Months',
    sessions: '48 sessions',
    tag: 'BEST VALUE',
    saveBadge: 'Save 35%',
    priceMonthly: 2999,
    priceYearly: 1949,
    priceTotal: 17994,
    isPopular: false,
    sphere: <SilverSphere />,
    themeAccent: 'silver',
    tagline: 'For parents dedicated to deep chess mastery and raising future champions.',
    seats: 'Up to 5 Children Accounts',
    cloudStorage: '48 Lessons + Master 1-on-1',
    dividerText: 'EVERYTHING IN FAMILY COACH +',
    features: [
      { text: 'Full curriculum library across all levels', badge: null },
      { text: 'Monthly 1-on-1 private coaching with a Chess Master', badge: '⭐ VIP 1-on-1' },
      { text: 'Parent Coaching Certification (Official Certificate)', badge: '⭐ Certified' },
      { text: 'Personalised learning path per child based on strengths', badge: 'Custom Path' },
      { text: 'Tournament Preparation Kit for parents', badge: null },
      { text: 'Early access to new content & beta modules', badge: null },
      { text: 'Dedicated Family Success Advisor (Direct Chat)', badge: 'VIP 24/7' },
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
  const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'
  
  // Super duper cool toggles!
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' (Cosmic Glass) | 'light' (Emerald Studio)
  const [layoutMode, setLayoutMode] = useState('cards'); // 'cards' (Reference 2 3D cards) | 'split' (Reference 1 2-column)

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[1];
  const isDark = themeMode === 'dark';

  return (
    <div 
      className={`w-full min-h-screen font-sans transition-colors duration-500 relative overflow-hidden ${
        isDark ? 'bg-[#0a0b10] text-gray-100' : 'bg-[#edf3f8] text-gray-900'
      }`}
    >
      {/* ── COSMIC BACKGROUND AESTHETIC PARTICLES ────────────────────────── */}
      {isDark && (
        <>
          {/* Ambient Glows */}
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-20 left-1/3 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />

          {/* Subtle starry stardust specks */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle at 15% 25%, #ffffff 1px, transparent 1px), radial-gradient(circle at 75% 15%, #ffffff 1.5px, transparent 1.5px), radial-gradient(circle at 45% 65%, #ffffff 1px, transparent 1px), radial-gradient(circle at 85% 80%, #ffffff 1.2px, transparent 1.2px), radial-gradient(circle at 20% 85%, #ffffff 1.5px, transparent 1.5px)',
              backgroundSize: '350px 350px'
            }}
          />
        </>
      )}

      {/* ── TOP NAVIGATION BAR ────────────────────────────────────────── */}
      <div className={`border-b transition-colors ${
        isDark ? 'bg-[#11121a]/80 border-white/10 backdrop-blur-md' : 'bg-[#1c4a27] border-transparent text-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between flex-wrap gap-4">
          <button
            type="button"
            onClick={onBackToCurriculum}
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-white/80 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lesson Planner</span>
          </button>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher: 3D Cosmic Cards vs Split Interactive */}
            <div className={`flex items-center p-1 rounded-xl border text-xs font-bold ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white/20 border-white/30 text-white'
            }`}>
              <button
                type="button"
                onClick={() => setLayoutMode('cards')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  layoutMode === 'cards'
                    ? isDark ? 'bg-purple-500/20 text-purple-300 shadow-xs border border-purple-500/30' : 'bg-white text-gray-900 shadow-xs'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-white/80 hover:text-white'
                }`}
                title="3D Cosmic Cards View (Image 2 style)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">3D Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('split')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  layoutMode === 'split'
                    ? isDark ? 'bg-purple-500/20 text-purple-300 shadow-xs border border-purple-500/30' : 'bg-white text-gray-900 shadow-xs'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-white/80 hover:text-white'
                }`}
                title="Split Interactive View (Image 1 style)"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split View</span>
              </button>
            </div>

            {/* Dark / Light Theme Switcher */}
            <button
              type="button"
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10' 
                  : 'bg-white/20 border-white/30 text-[#ffe066] hover:bg-white/30'
              }`}
              title={isDark ? "Switch to Emerald Light Studio" : "Switch to Deep Cosmic Dark"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <span className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 pl-2 ${
              isDark ? 'text-purple-400' : 'text-[#ffe066]'
            }`}>
              <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${
                isDark ? 'bg-purple-400' : 'bg-[#489f1f]'
              }`} />
              ChessKid Pro
            </span>
          </div>
        </div>
      </div>

      {/* ── HEADER WITH BADGE, TITLE & BILLING TOGGLE ──────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-8 text-center relative z-10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border transition-all duration-300 shadow-sm"
          style={isDark ? {
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            color: '#c084fc',
            backdropFilter: 'blur(10px)'
          } : {
            background: '#ffffff',
            borderColor: '#e2e8f0',
            color: '#2d6b12'
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Flexible Chess Plans</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
          {isDark ? (
            <>
              Next-Gen Chess for{' '}
              <span className="bg-gradient-to-r from-teal-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                Every Family
              </span>
            </>
          ) : (
            <>
              Flexible Pricing for Every{' '}
              <span className="text-[#3c8719]" style={{ fontStyle: 'italic' }}>
                Family
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className={`text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Supercharge your child's thinking with master-crafted chess curriculum.
          Choose the membership that fits your family's pace.
        </p>

        {/* Segmented Billing Toggle */}
        <div className={`inline-flex items-center p-1.5 rounded-full border shadow-inner transition-all ${
          isDark ? 'bg-[#151722] border-white/10' : 'bg-gray-200/70 border-gray-300'
        }`}>
          <button
            type="button"
            onClick={() => setBilling('yearly')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              billing === 'yearly'
                ? isDark 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40' 
                  : 'bg-white text-gray-900 shadow-sm'
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Yearly</span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              isDark 
                ? 'bg-white/20 text-white border border-white/30' 
                : 'bg-[#489f1f]/15 text-[#2d6b12]'
            }`}>
              Save 30%
            </span>
          </button>
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              billing === 'monthly'
                ? isDark 
                  ? 'bg-white/15 text-white shadow-sm' 
                  : 'bg-white text-gray-900 shadow-sm'
                : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>

      </div>

      {/* ── MAIN PRICING CONTENT (LAYOUT MODES) ─────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 relative z-10">

        {/* ══════════════════════════════════════════════════════════════════
            MODE A: 3D COSMIC CARDS VIEW (Directly from Reference 2 Image)
            ══════════════════════════════════════════════════════════════════ */}
        {layoutMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-center pt-4">
            {plans.map((plan) => {
              const price = billing === 'monthly' ? plan.priceMonthlyDisplay : plan.priceYearlyDisplay;
              const isCenter = plan.isPopular;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                    isCenter
                      ? isDark
                        ? 'bg-[#151622]/90 border-2 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.25)] md:-translate-y-3 z-20 backdrop-blur-xl'
                        : 'bg-white border-2 border-[#489f1f] shadow-2xl md:-translate-y-3 z-20'
                      : isDark
                        ? 'bg-[#111219]/80 border border-white/10 hover:border-white/20 shadow-xl backdrop-blur-xl hover:-translate-y-1'
                        : 'bg-white border border-gray-200/90 shadow-md hover:-translate-y-1'
                  }`}
                  style={{ minHeight: '620px' }}
                >
                  {/* Top Gloss Aurora Reflection (Image 2 style) */}
                  <div 
                    className="absolute top-0 inset-x-0 h-32 pointer-events-none rounded-t-3xl opacity-30"
                    style={{
                      background: plan.themeAccent === 'teal'
                        ? 'linear-gradient(180deg, rgba(20,184,166,0.5) 0%, transparent 100%)'
                        : plan.themeAccent === 'purple'
                          ? 'linear-gradient(180deg, rgba(168,85,247,0.6) 0%, transparent 100%)'
                          : 'linear-gradient(180deg, rgba(226,232,240,0.4) 0%, transparent 100%)'
                    }}
                  />

                  {/* Card Content Container */}
                  <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between relative z-10">

                    {/* Top Header Row: 3D Orb + Badge */}
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        {plan.sphere}

                        {/* Top Right Badges */}
                        {isCenter ? (
                          <span className={`text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md ${
                            isDark
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 shadow-sm'
                              : 'bg-[#489f1f]/15 text-[#2d6b12] border-[#489f1f]/30'
                          }`}>
                            Most popular
                          </span>
                        ) : (
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            isDark
                              ? 'bg-white/5 text-gray-400 border border-white/10'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {plan.saveBadge}
                          </span>
                        )}
                      </div>

                      {/* Plan Title & Tagline */}
                      <h3 className={`text-2xl font-black tracking-tight mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {plan.name}
                      </h3>
                      <p className={`text-xs leading-relaxed mb-6 min-h-[36px] ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {plan.tagline}
                      </p>

                      {/* Pricing Block */}
                      <div className="mb-6 flex items-baseline gap-1">
                        <span className={`text-4xl font-black tracking-tight ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {price}
                        </span>
                        <span className={`text-sm font-semibold ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          /month
                        </span>
                      </div>

                      {/* CTA Button */}
                      <div className="mb-6">
                        {isCenter ? (
                          /* Glowing Vibrant Orange / Coral Button from Reference Image 2! */
                          <button
                            type="button"
                            onClick={() => setSelectedPlan(plan)}
                            className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white shadow-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            style={{
                              background: 'linear-gradient(90deg, #ff5722 0%, #ff6e26 50%, #f4511e 100%)',
                              boxShadow: '0 0 25px rgba(255, 87, 34, 0.5)'
                            }}
                          >
                            <span>Choose this plan</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          /* Dark Glass Button from Reference Image 2 */
                          <button
                            type="button"
                            onClick={() => setSelectedPlan(plan)}
                            className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                              isDark
                                ? 'bg-white/5 hover:bg-white/10 text-white border-white/15 hover:border-white/30'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
                            }`}
                          >
                            Choose this plan
                          </button>
                        )}
                      </div>

                      {/* Specs Row: Seats & Cloud Lessons (Directly like Image 2) */}
                      <div className={`space-y-2.5 pb-5 border-b text-xs font-semibold ${
                        isDark ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-700'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-purple-400 shrink-0" />
                          <span>{plan.seats}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Cloud className="w-4 h-4 text-teal-400 shrink-0" />
                          <span>{plan.cloudStorage}</span>
                        </div>
                      </div>

                      {/* Section Divider with Centered Text (Image 2 signature element!) */}
                      <div className="relative my-5 text-center">
                        <div className={`absolute inset-0 flex items-center ${
                          isDark ? 'text-white/10' : 'text-gray-200'
                        }`}>
                          <div className="w-full border-t border-current" />
                        </div>
                        <span className={`relative text-[10px] font-black uppercase tracking-[0.18em] px-3 ${
                          isDark ? 'bg-[#151622] text-gray-500' : 'bg-white text-gray-400'
                        }`}>
                          {plan.dividerText}
                        </span>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-2.5">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-start justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                isDark ? 'bg-white/10 text-teal-400' : 'bg-emerald-100 text-[#2d6b12]'
                              }`}>
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                {feat.text}
                              </span>
                            </div>

                            {/* Pill badge if present (e.g. AI-based) */}
                            {feat.badge && (
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                                isDark
                                  ? 'bg-white/10 text-purple-300 border border-white/15'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {feat.badge}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>

                    </div>

                    {/* Bottom Duration Details */}
                    <div className={`mt-6 pt-4 border-t text-[11px] font-bold flex items-center justify-between ${
                      isDark ? 'border-white/10 text-gray-500' : 'border-gray-100 text-gray-400'
                    }`}>
                      <span>{plan.duration} · {plan.sessions}</span>
                      <span>Cancel anytime</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            MODE B: SPLIT INTERACTIVE VIEW (Reference 1 Layout in Cosmic Dark Glass)
            ══════════════════════════════════════════════════════════════════ */}
        {layoutMode === 'split' && (
          <div className={`rounded-3xl border p-6 sm:p-10 lg:p-12 transition-all ${
            isDark 
              ? 'bg-[#12131c]/90 border-white/10 shadow-2xl backdrop-blur-xl' 
              : 'bg-white border-gray-200/90 shadow-xl'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Selectable Plan Cards Stack */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-3.5">
                <div className="space-y-3.5">
                  {plans.map((plan) => {
                    const isActive = plan.id === activePlanId;
                    const price = billing === 'monthly' ? plan.priceMonthlyDisplay : plan.priceYearlyDisplay;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setActivePlanId(plan.id)}
                        className={`relative rounded-2xl p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all duration-200 border-2 select-none ${
                          isActive
                            ? isDark
                              ? 'bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-purple-900/40 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] scale-[1.01]'
                              : 'bg-gradient-to-r from-[#489f1f] via-[#3fa319] to-[#368b16] border-[#489f1f] text-white shadow-lg shadow-[#489f1f]/25 scale-[1.01]'
                            : isDark
                              ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-gray-200'
                              : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
                        }`}
                      >
                        {/* Left: 3D Orb + Checkbox + Plan Name */}
                        <div className="flex items-center gap-3.5 sm:gap-4 relative z-10">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                            isActive
                              ? isDark ? 'bg-purple-400 text-gray-950 shadow-sm' : 'bg-white text-[#489f1f] shadow-xs'
                              : isDark ? 'border-2 border-gray-600 bg-transparent' : 'border-2 border-gray-300 bg-transparent'
                          }`}>
                            {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-base sm:text-lg font-black tracking-tight ${
                                isActive ? 'text-white' : isDark ? 'text-gray-200' : 'text-gray-900'
                              }`}>
                                {plan.name}
                              </span>
                              {plan.tag && (
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isDark ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {plan.tag}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                                isDark
                                  ? 'bg-white/10 text-teal-300 border border-white/15'
                                  : 'bg-[#489f1f]/10 text-[#387e17] border border-[#489f1f]/20'
                              }`}>
                                {plan.saveBadge}
                              </span>
                              <span className={`text-xs font-medium ${
                                isActive ? 'text-white/80' : isDark ? 'text-gray-400' : 'text-gray-400'
                              }`}>
                                {plan.duration} · {plan.sessions}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Price */}
                        <div className="text-right pl-3 relative z-10 shrink-0">
                          <div className="flex items-baseline justify-end">
                            <span className={`text-xl sm:text-2xl font-black ${
                              isActive ? 'text-white' : isDark ? 'text-gray-100' : 'text-gray-900'
                            }`}>
                              {price}
                            </span>
                            <span className={`text-xs sm:text-sm font-semibold ml-0.5 ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              /month
                            </span>
                          </div>
                          {billing === 'yearly' && (
                            <div className={`text-[10px] font-semibold mt-0.5 ${
                              isDark ? 'text-purple-300' : 'text-gray-500'
                            }`}>
                              Billed annually
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Choose Plan Action Button */}
                <div className="pt-5 flex items-center justify-between flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(activePlan)}
                    className="w-full sm:w-auto px-8 py-3.5 font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 text-white"
                    style={{
                      background: 'linear-gradient(90deg, #ff5722 0%, #ff6e26 50%, #f4511e 100%)',
                      boxShadow: '0 0 25px rgba(255, 87, 34, 0.45)'
                    }}
                  >
                    <span>Choose Plan</span>
                    <span className="text-xs font-normal text-white/90">· {activePlan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Instant activation · 7-day money-back guarantee
                  </p>
                </div>
              </div>

              {/* Right Column: "Includes :" Details Card */}
              <div className="lg:col-span-5 h-full">
                <div className={`rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                }`}>
                  <div>
                    {/* Header */}
                    <div className={`flex items-center justify-between mb-4 pb-3 border-b ${
                      isDark ? 'border-white/10' : 'border-gray-100'
                    }`}>
                      <h3 className={`text-base font-black tracking-tight ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Includes :
                      </h3>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' : 'bg-[#489f1f]/10 text-[#387e17]'
                      }`}>
                        {activePlan.name}
                      </span>
                    </div>

                    {/* Features List with right-aligned checkmarks */}
                    <div className="space-y-2.5">
                      {activePlan.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between py-2 border-b last:border-0 gap-3 ${
                            isDark ? 'border-white/5 text-gray-300' : 'border-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="text-xs sm:text-sm font-medium leading-snug">
                            {feat.text}
                          </span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-[#489f1f]/10 text-[#387e17]'
                          }`}>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Renewal Note & Switch */}
                  <div className={`mt-6 pt-4 border-t flex items-center justify-between flex-wrap gap-2 ${
                    isDark ? 'border-white/10 text-gray-400' : 'border-gray-100 text-gray-600'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          billing === 'yearly' ? 'bg-purple-500' : 'bg-gray-700'
                        }`}
                        aria-label="Toggle annual renewal"
                      >
                        <span
                          className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${
                            billing === 'yearly' ? 'left-[19px]' : 'left-[3px]'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-bold">
                        {billing === 'yearly'
                          ? `Renewed at ₹${activePlan.priceYearly}/mo (yearly)`
                          : `Monthly at ₹${activePlan.priceMonthly}/mo`}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold">
                      Cancel anytime
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ── EVERY PLAN INCLUDES + CTA SECTION ───────────────────────── */}
      <div className={`py-14 sm:py-18 relative z-10 border-t ${
        isDark 
          ? 'bg-[#0f1017] border-white/10 text-white' 
          : 'bg-gradient-to-r from-[#1c4a27] to-[#2d6b12] text-white border-transparent'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* Left — Inclusions */}
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-4 ${
                isDark ? 'text-purple-400' : 'text-[#ffe066]'
              }`}>
                Every Membership Includes
              </p>
              <ul className="space-y-3">
                {inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-200">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      isDark ? 'text-teal-400' : 'text-[#ffe066]'
                    }`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — CTA Button */}
            <div className="flex flex-col gap-6">
              <button
                type="button"
                onClick={() => setSelectedPlan(plans[0])}
                className="w-full sm:w-auto px-8 py-4 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(90deg, #ff5722 0%, #ff6e26 50%, #f4511e 100%)',
                  boxShadow: '0 0 30px rgba(255, 87, 34, 0.45)'
                }}
              >
                <Lock className="w-4 h-4" />
                Book a Free Introductory Class
              </button>

              <div className="text-sm text-gray-400 space-y-1">
                <p className="font-bold text-gray-200">+91 74484 08684</p>
                <p>chesswiththekid.com · @chesswiththekid</p>
              </div>
            </div>

          </div>

          {/* FAQs Accordion */}
          <div className={`mt-14 border-t pt-10 ${isDark ? 'border-white/10' : 'border-white/20'}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-6 ${
              isDark ? 'text-purple-400' : 'text-[#ffe066]'
            }`}>
              Parent Questions
            </p>
            <div className="space-y-3">
              {faqs.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div 
                    key={i} 
                    className={`rounded-2xl border transition-all ${
                      isDark 
                        ? 'bg-white/5 border-white/10 hover:border-white/20' 
                        : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between text-sm font-bold text-white cursor-pointer"
                    >
                      <span>{f.q}</span>
                      {isOpen
                        ? <ChevronUp className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-[#ffe066]'}`} />
                        : <ChevronDown className="w-4 h-4 text-white/50 flex-shrink-0" />
                      }
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs text-gray-300 leading-relaxed border-t border-white/10 pt-3">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer tagline */}
          <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest ${
            isDark ? 'border-white/10 text-gray-500' : 'border-white/20 text-white/50'
          }`}>
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
            priceAnnual: selectedPlan.priceYearly || selectedPlan.priceMonthly,
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
