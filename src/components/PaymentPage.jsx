import React, { useState } from 'react';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Star, 
  Trophy, 
  Award, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  Calendar, 
  Sparkles, 
  Target, 
  BookOpen, 
  Brain, 
  Monitor, 
  RotateCcw, 
  Smartphone, 
  ArrowRight, 
  Heart, 
  Zap, 
  Users, 
  CheckCircle2, 
  X,
  PhoneCall,
  GraduationCap,
  Percent,
  Play
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const PaymentPage = ({ onSubscriptionSuccess }) => {
  const [selectedGrade, setSelectedGrade] = useState('KG - G2');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [activeParentIndex, setActiveParentIndex] = useState(0);
  const [showEmiModal, setShowEmiModal] = useState(false);

  // Exact plans data with user's content and Cuemath pastel palette
  const plansData = [
    {
      id: 'starter',
      name: '1 Month',
      subtitle: 'Starter Trial',
      tag: 'TRIAL PACK',
      saveBadge: 'Save 10%',
      pricePerClass: 125,
      priceMonthly: 999,
      priceTotal: 999,
      originalPrice: 1199,
      sessions: '8 live sessions',
      frequency: '2 classes / week · 30-45 mins',
      color: '#00A88F',
      headerBg: '#B4F2E7',
      cardBg: '#FFFFFF',
      borderColor: '#7FE3D3',
      badgeBg: '#007038',
      features: [
        'Step-by-step Parent Teaching Scripts (Units 1–11)',
        '8 live guided 1:1 sessions with certified coach',
        'Printable worksheets & at-home puzzle drills',
        'Session recordings provided on request',
        'Email support (48h response) · Cancel anytime',
      ],
      description: 'Ideal for young beginners trying structured 1:1 chess for the first time.',
    },
    {
      id: 'family',
      name: '6 Months',
      subtitle: 'Family Coach',
      tag: 'POPULAR CHOICE',
      saveBadge: 'Save 25%',
      pricePerClass: 678,
      priceMonthly: 1499,
      priceTotal: 8994,
      originalPrice: 1999,
      sessions: '48 live sessions',
      frequency: '2 classes / week · 40 mins',
      color: '#FF884C',
      headerBg: '#FFAA80',
      cardBg: '#FFFFFF',
      borderColor: '#FFBB99',
      badgeBg: '#007038',
      isPopular: true,
      features: [
        'Everything in 1 Month Starter plan',
        '48 live 1:1 lessons tailored to child’s pace',
        'Parent-vs-Child guided practice game mode',
        'Family Progress Dashboard (up to 3 kids)',
        'Monthly LIVE Parent Workshop with Chess Expert',
        'Priority same-day dedicated coach support',
      ],
      description: 'The core parent-child curriculum for solid thinking habits & rating growth.',
    },
    {
      id: 'master',
      name: '12 Months',
      subtitle: 'Master Parent & Prodigy',
      tag: 'BEST VALUE',
      saveBadge: 'Save 35%',
      pricePerClass: 610,
      priceMonthly: 1949,
      priceTotal: 23388,
      originalPrice: 2999,
      sessions: '96 live sessions',
      frequency: '2 classes / week · 50 mins',
      color: '#FF80F4',
      headerBg: '#FFA3F7',
      cardBg: '#FFFFFF',
      borderColor: '#FFB8F8',
      badgeBg: '#007038',
      isBestValue: true,
      features: [
        'Everything in 6 Months plan',
        '96 live 1:1 lessons across full master curriculum',
        'Monthly 1-on-1 coaching with a FIDE Master',
        'Official Parent Coaching Certification & diploma',
        'Tournament Prep Kit: Openings & endgames',
        'Dedicated Family Success Advisor & flexible pauses',
      ],
      description: 'Comprehensive program to develop tournament-ready foresight & deep calculation.',
    },
  ];

  // Grade filter options matching Cuemath pill selector
  const gradeTabs = [
    { id: 'KG - G2', label: 'KG - G2', sub: 'Ages 5–7 · Spatial Awareness, Board Rules & Playful Puzzles' },
    { id: 'G3 - G5', label: 'G3 - G5', sub: 'Ages 8–11 · Tactical Motifs, Foresight & Calm Calculation' },
    { id: 'G6 - G8', label: 'G6 - G8', sub: 'Ages 12–14 · Deep Calculation, Openings & Tournament Readiness' },
  ];



  // Student Success Champions
  const studentSuccess = [
    {
      name: 'Advait M.',
      age: '7 Years',
      badge: 'State U-8 Champion 🏆',
      achievement: 'Winner of Karnataka U-8 State Championship with 6.5/7 points.',
      gain: '+380 Rating Points',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
      quote: 'Coach Rathish showed me how to look at all opponent moves before touching any piece!',
    },
    {
      name: 'Sanvi K.',
      age: '9 Years',
      badge: 'Rapid Gold Medalist 🥇',
      achievement: 'Completed Full Parent-Guided Curriculum in 6 months.',
      gain: 'Beat 1350 Rated Players',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80',
      quote: 'My mom uses the parent script every Sunday. We solved 450 puzzles together!',
      isHighlight: true,
    },
    {
      name: 'Vihaan R.',
      age: '6 Years',
      badge: 'Young Prodigy Award ⭐',
      achievement: 'Youngest trophy winner at Delhi Inter-School Chess Fest.',
      gain: 'Top 3 in Under-7',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80',
      quote: 'Chess used to feel confusing, now it feels like a fun detective game.',
    },
    {
      name: 'Reyansh P.',
      age: '11 Years',
      badge: 'FIDE Rated 1345 🎖️',
      achievement: 'Official international rating achieved within 9 months of training.',
      gain: 'Unbeaten in 8 Matches',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      quote: 'The endgame technique lessons helped me turn losing positions into clean wins.',
    },
  ];

  // International Parents for Cuemath-style Fan/Arc gallery
  const parentTestimonials = [
    {
      name: 'Dr. Ananya Sen',
      role: 'Mother of 7-yr-old Kabir',
      location: 'London, UK 🇬🇧',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      badge: 'Parent of 6-Month Learner',
      arcColor: '#FFAA80',
      quote: 'We were blown away by the clarity of the parent scripts. I had zero chess background, yet within weeks I could guide Kabir effectively. His focus in school has tangibly sharpened!',
    },
    {
      name: 'Rajesh & Meera Patel',
      role: 'Parents of 9-yr-old Aanya',
      location: 'New Jersey, USA 🇺🇸',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      badge: 'Parent of 12-Month Master',
      arcColor: '#FFBA07',
      quote: 'Coach Rathish doesn’t just teach pawn moves; he teaches how to think under pressure. Aanya took 2nd place in her district tournament after just 4 months of 1:1 coaching.',
    },
    {
      name: 'Sneha Deshmukh',
      role: 'Mother of 8-yr-old Aryan',
      location: 'Bangalore, India 🇮🇳',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      badge: 'Parent of 6-Month Learner',
      arcColor: '#3DD771',
      quote: 'Aryan used to rush his decisions and get frustrated easily. The patient 1:1 mentorship and thoughtful questions completely changed his mindset. He now calculates 3 moves ahead!',
    },
    {
      name: 'Marcus & Elena Vance',
      role: 'Parents of 6-yr-old Leo',
      location: 'Sydney, Australia 🇦🇺',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      badge: 'Parent of 1-Month Trial',
      arcColor: '#4DA2FF',
      quote: 'The introductory session was brilliant. The coach immediately connected with Leo and made the chessboard feel like an exciting adventure. Booking the 6-month plan was a no-brainer.',
    },
    {
      name: 'Fatima Al-Nuaimi',
      role: 'Mother of 10-yr-old Zayd',
      location: 'Dubai, UAE 🇦🇪',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      badge: 'Parent of 12-Month Master',
      arcColor: '#ED6CEF',
      quote: 'The flexibility to pause during school exams and reschedule without any penalties makes this program world-class for busy expat families.',
    },
  ];

  // Pricing FAQs
  const pricingFaqs = [
    {
      q: 'How much do chess classes cost and what is included?',
      a: 'Plans start at ₹610 to ₹678 per class for personalized 1:1 live coaching with a trained master mentor. Every plan includes the complete age-appropriate curriculum, step-by-step parent teaching scripts, puzzle homework, regular progress reports, and session recordings with no hidden add-on fees.',
    },
    {
      q: 'Do I need to know chess to start coaching my child?',
      a: 'Not at all! Every unit includes our plain-English Parent Teaching Guide and demonstration scripts that tell you exactly what questions to ask and what to highlight. You and your child will discover the magic of chess together.',
    },
    {
      q: 'What is your refund policy if we decide to discontinue?',
      a: 'We have a strict 100% no-questions-asked refund policy for all remaining unused sessions. If for any reason you feel the program is not the right fit, you can cancel at any time and receive an immediate refund for all unused classes.',
    },
    {
      q: 'Can we switch coaches or reschedule if a class is missed?',
      a: 'Yes! If you ever feel your child would benefit from a different teaching chemistry, you can switch mentors anytime at zero cost. Furthermore, we offer a generous flexible leave policy: you can reschedule up to 2 sessions per month with 24 hours notice.',
    },
    {
      q: 'How long is each session and how often are classes held?',
      a: 'Classes are held twice a week at timings convenient to your family. Sessions run for 30–45 minutes for young kids (Ages 5–8) and 50–55 minutes for older students (Ages 9–14) to maintain deep engagement and focus.',
    },
    {
      q: 'Is there a free trial before making a payment?',
      a: 'Yes! We encourage every family to take a completely free 1-on-1 introductory session. Your coach evaluates your child’s cognitive thinking style, explains the chessboard playfully, and suggests the optimal roadmap before you pay a single rupee.',
    },
    {
      q: 'What devices are required for attending the classes?',
      a: 'Any desktop, laptop, or tablet (iPad / Android tablet) with a stable internet connection and webcam works smoothly. No special software installation is required—classes run right in your browser.',
    },
    {
      q: 'Are there any EMI payment options available?',
      a: 'Yes, we support 0% interest EMI options starting at just ₹1,499/month across major credit cards and debit cards (HDFC, ICICI, Axis, SBI, Bajaj Finserv). Click on "Check out our 0% EMI options" to see the breakdown.',
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#0D0D0D] font-sans antialiased selection:bg-[#FFBA07] selection:text-black">
      
      {/* ── TOP SUBTLE TRUST STRIP ──────────────────────────────────── */}
      <div className="bg-[#FAF9F6] border-b border-[#EAE6DF] py-1.5 px-4 text-center">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between text-[11.5px] text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A88F]"></span>
            <span className="font-semibold text-gray-700">1:1 Live Online Chess Mentorship</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline text-gray-500">Ages 5 – 14 · Certified FIDE &amp; Master Coaches</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#007038] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Refund Guarantee
            </span>
            <span className="text-gray-300 hidden sm:inline">·</span>
            <span className="text-gray-600 hidden sm:inline">Rated 4.9 ★ by 1,200+ Parents</span>
          </div>
        </div>
      </div>

      {/* ── HERO & PRICING SECTION WITH SIGNATURE CUEMATH GRID BACKGROUND ── */}
      <section className="relative pt-12 sm:pt-16 pb-16 px-4 overflow-hidden bg-[#FAFAF8] border-b border-[#EAE6DF]">
        
        {/* Clearly Visible Technical / Coordinate Grid Background Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #DFE3E8 1.2px, transparent 1.2px),
              linear-gradient(to bottom, #DFE3E8 1.2px, transparent 1.2px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.85
          }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto text-center">
          {/* Section Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#0D0D0D] leading-tight mb-3">
            Simple Pricing &amp; Clear Value
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mb-7 font-normal leading-relaxed">
            Choose the plan that's right for your child. Flexible learning designed to empower curious minds.
          </p>

          {/* Grade Pill Selector (Cuemath Style) */}
          <div className="inline-flex items-center bg-white border border-[#D5D9DE] rounded-full p-1 max-w-full overflow-x-auto shadow-xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 px-3 py-1 select-none">
              GRADES
            </span>
            <div className="flex items-center gap-1">
              {gradeTabs.map((tab) => {
                const active = selectedGrade === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedGrade(tab.id)}
                    className={`px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      active 
                        ? 'bg-[#0D0D0D] text-white shadow-2xs' 
                        : 'text-gray-700 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-2 font-medium mb-9">
            {gradeTabs.find(t => t.id === selectedGrade)?.sub}
          </p>

          {/* ── CUEMATH ENCLOSED PRICING CARDS WRAPPER ──────────────── */}
          <div className="max-w-[1080px] mx-auto bg-white/95 border border-[#D8D3C8] rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch justify-center max-w-[1020px] mx-auto">
              {plansData.map((plan) => {
                return (
                  <div
                    key={plan.id}
                    className="relative flex flex-col rounded-xl overflow-hidden bg-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-left"
                    style={{
                      border: `1.5px solid ${plan.borderColor}`,
                    }}
                  >
                    {/* Card Top Header Banner */}
                    <div 
                      className="px-5 py-4 flex items-center justify-between border-b"
                      style={{ 
                        backgroundColor: plan.headerBg,
                        borderColor: `${plan.borderColor}80`
                      }}
                    >
                      <div>
                        <h3 className="text-lg font-black text-[#0D0D0D] tracking-tight">
                          {plan.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-black/70">
                          {plan.subtitle}
                        </p>
                      </div>
                      {plan.saveBadge && (
                        <span 
                          className="text-[10px] font-black uppercase tracking-wider text-white px-2.5 py-1 rounded-sm shadow-2xs"
                          style={{ backgroundColor: plan.badgeBg }}
                        >
                          {plan.saveBadge}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Price Header */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-gray-400 line-through">
                              ₹{plan.originalPrice}/class
                            </span>
                          </div>
                          
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl sm:text-[38px] font-black text-[#0D0D0D] tracking-tight leading-none">
                              ₹{plan.pricePerClass}
                            </span>
                            <span className="text-xs font-bold text-gray-500">
                              /class
                            </span>
                          </div>
                          
                          <div className="mt-1.5 text-[11px] text-gray-500 font-medium">
                            {plan.id === 'starter' ? (
                              <span>Billed as ₹{plan.priceTotal.toLocaleString()} for 1 month</span>
                            ) : plan.id === 'family' ? (
                              <span>Billed as ₹{plan.priceTotal.toLocaleString()} every 6 months (₹{plan.priceMonthly.toLocaleString()}/mo)</span>
                            ) : (
                              <span>Billed as ₹{plan.priceTotal.toLocaleString()} annually (₹{plan.priceMonthly.toLocaleString()}/mo)</span>
                            )}
                          </div>
                        </div>

                        {/* Class frequency pill */}
                        <div className="bg-[#FAF9F7] border border-[#EAE6DF] rounded-md px-2.5 py-1.5 my-3 text-[11px] font-semibold text-gray-700 flex items-center justify-between">
                          <span>{plan.sessions}</span>
                          <span className="text-gray-400">•</span>
                          <span>{plan.frequency.split('·')[0]}</span>
                        </div>

                        {/* Features checklist with clean green checkmarks */}
                        <div className="space-y-2.5 pt-3 mb-6 border-t border-gray-100">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-[#007038] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                              <span className="text-xs text-gray-700 font-normal leading-snug">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cuemath Signature Yellow CTA Button */}
                      <div className="pt-3 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => handleSelectPlan(plan)}
                          className="w-full py-3 px-4 bg-[#FFBA07] hover:bg-[#FFA800] text-[#0D0D0D] font-black text-xs sm:text-[13px] tracking-wide rounded-md shadow-2xs transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Get Started</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                          Instant access · 100% money-back guarantee
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* EMI Link */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setShowEmiModal(true)}
                className="text-xs sm:text-[13px] font-bold text-[#0D0D0D] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Can't pay all at once? Check out our 0% EMI options</span>
                <span className="text-sm font-bold text-[#FF884C]">›</span>
              </button>
            </div>

            {/* 3 Cuemath Mini Pill Badges Inside Container */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto mt-6">
              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 flex items-center gap-3 shadow-2xs text-left">
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center text-sm flex-shrink-0 font-bold">
                  🎯
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">Personalized Learning</h4>
                  <p className="text-[11px] text-gray-500">Custom pace for your child</p>
                </div>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 flex items-center gap-3 shadow-2xs text-left">
                <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-sm flex-shrink-0 font-bold">
                  👨‍🏫
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">Certified Chess Coaches</h4>
                  <p className="text-[11px] text-gray-500">1:1 dedicated mentorship</p>
                </div>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E5E0D8] rounded-xl p-3 flex items-center gap-3 shadow-2xs text-left">
                <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] text-[#DB2777] flex items-center justify-center text-sm flex-shrink-0 font-bold">
                  🛡️
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900">100% Refund Guarantee</h4>
                  <p className="text-[11px] text-gray-500">Unused classes fully refunded</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── "ALL PLANS INCLUDE" SECTION (CUEMATH ICON & TITLE ONLY) ── */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#EAE6DF]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D0D0D] tracking-tight">
              All Plans Include
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-6 max-w-4xl mx-auto">
            {/* 1. Learning Plan */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="16" stroke="#FF7A00" strokeWidth="2.5" strokeDasharray="3 3"/>
                  <circle cx="20" cy="20" r="9" stroke="#FF7A00" strokeWidth="2.5"/>
                  <circle cx="20" cy="20" r="3.5" fill="#FF7A00"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Learning Plan
              </h3>
            </div>

            {/* 2. Tournament Prep */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <path d="M12 11h16v7c0 4.418-3.582 8-8 8s-8-3.582-8-8v-7z" stroke="#FF5722" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14H8a3 3 0 0 0 0 6h4M28 14h4a3 3 0 0 1 0 6h-4M20 26v6M14 32h12" stroke="#FF5722" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Tournament Prep
              </h3>
            </div>

            {/* 3. Homework & Drills */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <path d="M9 11h10a3 3 0 0 1 3 3v15a2 2 0 0 0-2-2H9V11zM31 11H21a3 3 0 0 0-3 3v15a2 2 0 0 1 2-2h11V11z" stroke="#AB47BC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Homework &amp; Drills
              </h3>
            </div>

            {/* 4. Advanced Learning */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <path d="M20 9v22M12 14c-2.5 1.5-4 4-4 7s2 5.5 5 5.5c2 0 4-1 5-2.5M28 14c2.5 1.5 4 4 4 7s-2 5.5-5 5.5c-2 0-4-1-5-2.5M12 20h16" stroke="#26A69A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="20" cy="20" r="3" fill="#26A69A"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Advanced Learning
              </h3>
            </div>

            {/* 5. Smart Practice */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <rect x="7" y="10" width="26" height="17" rx="3" stroke="#0288D1" strokeWidth="2.5"/>
                  <path d="M15 31h10M20 27v4" stroke="#0288D1" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M14 17l4 3-4 3M21 23h5" stroke="#0288D1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Smart Practice
              </h3>
            </div>

            {/* 6. Tactical Vision */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <path d="M21 7L11 21h8l-2 12 12-16h-9l3-10z" stroke="#FFA000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFF8E1"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Tactical Vision
              </h3>
            </div>

            {/* 7. Remedial Support */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <path d="M11 20a9 9 0 1 1 2.64 6.36L10 30" stroke="#EC407A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 23v7h7" stroke="#EC407A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 15v5l3 3" stroke="#EC407A" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Remedial Support
              </h3>
            </div>

            {/* 8. Parent App & Reports */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center mb-2.5">
                <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                  <rect x="12" y="8" width="16" height="25" rx="3" stroke="#FF7043" strokeWidth="2.5"/>
                  <path d="M18 12h4M20 29h.01" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="3" stroke="#FF7043" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                Parent App &amp; Reports
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUEMATH SIGNATURE PROCESS SECTION: "PAY ONLY IF YOU LOVE US" ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          
          {/* Black Left Card: Pay only if you love us */}
          <div className="bg-[#000000] rounded-2xl p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden min-h-[380px]">
            {/* Heart outline watermark in bottom right corner */}
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-15 pointer-events-none">
              <svg width="280" height="280" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#FFBA07] mb-6">
                <span>The Rathish Promise</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight tracking-tight text-white mb-4">
                Pay only if you <span className="text-[#FF4A6B]">❤️</span> us.
                <br />
                No strings attached.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm mt-6 relative z-10 font-normal">
              We stand firmly behind our curriculum and our coaches. You stay because your child is thriving, not because you're trapped in a contract.
            </p>
          </div>

          {/* Right 4 Stacked Full-Width Colored Horizontal Bars (Cuemath Style) */}
          <div className="flex flex-col gap-3 justify-between">
            
            {/* 1. Yellow Bar */}
            <div className="bg-[#FFBA07] rounded-xl px-6 py-4 text-black flex items-center justify-between border border-black/5 shadow-2xs hover:-translate-y-0.5 transition-transform flex-1">
              <div className="flex items-start gap-4 pr-3">
                <div className="w-7 h-7 rounded-full bg-black text-[#FFBA07] flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-black text-black leading-tight">
                    Full refund, no questions asked
                  </h3>
                  <p className="text-[11.5px] text-black/80 leading-snug mt-1 font-medium">
                    If you decide to discontinue at any point, get a full refund for all remaining unused classes immediately.
                  </p>
                </div>
              </div>
              <div className="text-2xl text-black/70 flex-shrink-0 hidden sm:block">
                ✏️
              </div>
            </div>

            {/* 2. Orange Bar */}
            <div className="bg-[#FF7A00] rounded-xl px-6 py-4 text-white flex items-center justify-between border border-black/5 shadow-2xs hover:-translate-y-0.5 transition-transform flex-1">
              <div className="flex items-start gap-4 pr-3">
                <div className="w-7 h-7 rounded-full bg-white text-[#FF7A00] flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">
                    Switch mentors anytime
                  </h3>
                  <p className="text-[11.5px] text-white/90 leading-snug mt-1 font-medium">
                    Not feeling 100% chemistry with your tutor? Change mentors anytime with zero hassle or awkward calls.
                  </p>
                </div>
              </div>
              <div className="text-2xl text-white/80 flex-shrink-0 hidden sm:block">
                📞
              </div>
            </div>

            {/* 3. Pink/Lilac Bar */}
            <div className="bg-[#ED6CEF] rounded-xl px-6 py-4 text-black flex items-center justify-between border border-black/5 shadow-2xs hover:-translate-y-0.5 transition-transform flex-1">
              <div className="flex items-start gap-4 pr-3">
                <div className="w-7 h-7 rounded-full bg-black text-[#ED6CEF] flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-black text-black leading-tight">
                    Flexible schedule
                  </h3>
                  <p className="text-[11.5px] text-black/85 leading-snug mt-1 font-medium">
                    School exams or family vacation coming up? Reschedule or pause your classes freely with 24 hours notice.
                  </p>
                </div>
              </div>
              <div className="text-2xl text-black/70 flex-shrink-0 hidden sm:block">
                💻
              </div>
            </div>

            {/* 4. Green Bar */}
            <div className="bg-[#3DD771] rounded-xl px-6 py-4 text-black flex items-center justify-between border border-black/5 shadow-2xs hover:-translate-y-0.5 transition-transform flex-1">
              <div className="flex items-start gap-4 pr-3">
                <div className="w-7 h-7 rounded-full bg-black text-[#3DD771] flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-black text-black leading-tight">
                    Zero cancellation fee
                  </h3>
                  <p className="text-[11.5px] text-black/85 leading-snug mt-1 font-medium">
                    No hidden penalties, no exit fees, and no long-term lock-in. You hold all the cards.
                  </p>
                </div>
              </div>
              <div className="text-2xl text-black/70 flex-shrink-0 hidden sm:block">
                🛡️
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STUDENT SUCCESS: HELPING 2,500+ STUDENTS SUCCEED ────────── */}
      <section className="py-16 bg-[#FAF9F6] border-t border-[#ECE7E1]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D0D0D] tracking-tight mb-1.5">
              Helping 2,500+ students succeed!
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Real children, real trophies, and real cognitive transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1080px] mx-auto">
            {studentSuccess.map((student, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-xl overflow-hidden shadow-2xs flex flex-col transition-all duration-200 hover:-translate-y-0.5 ${
                  student.isHighlight 
                    ? 'border-2 border-[#FFBA07] ring-1 ring-[#FFBA07]/30' 
                    : 'border border-gray-200'
                }`}
              >
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img 
                    src={student.image} 
                    alt={student.name}
                    className="w-full h-full object-cover object-top" 
                  />
                  <div className="absolute top-2 left-2 bg-[#FFBA07] text-[#0D0D0D] text-[9.5px] font-black px-2 py-0.5 rounded shadow-2xs">
                    {student.badge}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm text-gray-900">{student.name}</h3>
                      <span className="text-[11px] font-medium text-gray-400">{student.age}</span>
                    </div>

                    <p className="text-xs font-bold text-[#007038] mb-1.5 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#007038]" /> {student.gain}
                    </p>

                    <p className="text-[11px] text-gray-600 leading-snug mb-3">
                      {student.achievement}
                    </p>
                  </div>

                  <p className="text-[10.5px] text-gray-500 italic bg-gray-50 p-2 rounded border border-gray-100 leading-relaxed">
                    "{student.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RATINGS SECTION (RATED 4.8+ ON TRUSTPILOT & GOOGLE) ──────── */}
      <section className="py-16 max-w-[1000px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-12 bg-gray-300"></span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-800">
              Rated 4.8+ on <span className="text-[#00B67A]">★ Trustpilot</span>
            </span>
            <span className="h-px w-12 bg-gray-300"></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Trustpilot Review Box */}
          <div className="bg-[#FAF9F6] border border-gray-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-gray-900 tracking-tight">Trustpilot</span>
                  <div className="flex text-[#00B67A] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#00B67A]" />
                    ))}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-600">4.8 / 5.0</span>
              </div>

              <div className="w-full bg-gray-200 h-1.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-[#00B67A] h-1.5 rounded-full w-[96%]"></div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed italic mb-3">
                "The parent teaching scripts are an absolute game changer. My 7-year-old went from scattering pieces to methodically calculating three moves ahead. The coach is remarkably patient!"
              </p>
            </div>

            <div className="flex items-center justify-between text-[10.5px] text-gray-500 font-semibold border-t border-gray-200/80 pt-2.5">
              <span>Based on 1,200+ verified parent reviews</span>
              <span className="text-[#007038] font-bold">Verified Score</span>
            </div>
          </div>

          {/* Google Reviews Box */}
          <div className="bg-[#FAF9F6] border border-gray-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-gray-900 tracking-tight">Google Reviews</span>
                  <div className="flex text-[#FBBC05] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-[#FBBC05]" />
                    ))}
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-600">4.9 / 5.0</span>
              </div>

              <div className="w-full bg-gray-200 h-1.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-[#4285F4] h-1.5 rounded-full w-[98%]"></div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed italic mb-3">
                "Coach Rathish has a gift for connecting with young minds. He doesn't teach rote memorization—he nurtures curious, disciplined problem-solvers. Best educational investment for our son."
              </p>
            </div>

            <div className="flex items-center justify-between text-[10.5px] text-gray-500 font-semibold border-t border-gray-200/80 pt-2.5">
              <span>850+ five-star Google ratings</span>
              <span className="text-[#4285F4] font-bold">Verified Score</span>
            </div>
          </div>
        </div>

        {/* Small platform badges row (Cuemath Style) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs text-gray-600">
          <div className="bg-white border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="text-[#00B67A]">★★★★★</span>
            <span className="font-bold text-gray-800">Trustpilot</span>
            <span className="text-gray-400">4.8</span>
          </div>
          <div className="bg-white border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="text-[#FBBC05]">★★★★★</span>
            <span className="font-bold text-gray-800">Google Reviews</span>
            <span className="text-gray-400">4.9</span>
          </div>
          <div className="bg-white border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="text-[#FFBA07]">★★★★★</span>
            <span className="font-bold text-gray-800">Parent Community</span>
            <span className="text-gray-400">4.9</span>
          </div>
        </div>
      </section>

      {/* ── AWARDS AND MENTIONS ─────────────────────────────────────── */}
      <section className="py-8 border-t border-b border-gray-200 bg-white">
        <div className="max-w-[1100px] mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-gray-300"></span>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
              Awards and Mentions
            </p>
            <span className="h-px w-10 bg-gray-300"></span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-80">
            <div className="flex items-center gap-2 font-bold text-xs sm:text-[13px] text-gray-700">
              <Award className="w-4 h-4 text-[#D97706]" />
              <span>FIDE Certified Master Coaches</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-xs sm:text-[13px] text-gray-700">
              <Trophy className="w-4 h-4 text-[#FFBA07]" />
              <span>AICF Recognized Pedagogy</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-xs sm:text-[13px] text-gray-700">
              <Sparkles className="w-4 h-4 text-[#ED6CEF]" />
              <span>EdTech Excellence in Thinking</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-xs sm:text-[13px] text-gray-700">
              <Brain className="w-4 h-4 text-[#00A88F]" />
              <span>Cognitive Chess Method</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARENT TESTIMONIAL FAN / ARC GALLERY (CUEMATH SIGNATURE) ── */}
      <section className="py-16 sm:py-20 bg-[#FAF9F6] border-b border-[#ECE7E1]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D0D0D] tracking-tight mb-1.5">
              Happy parents in 20+ countries
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              From Bangalore to London to California, parents trust us to guide their children.
            </p>
          </div>

          {/* Cuemath Arched Gallery Showcase */}
          <div className="max-w-2xl mx-auto text-center">
            
            {/* Interactive Fan / Arch selector avatars */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
              {parentTestimonials.map((parent, idx) => {
                const isActive = activeParentIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveParentIndex(idx)}
                    className={`relative rounded-t-full transition-all duration-300 cursor-pointer overflow-hidden p-1 ${
                      isActive 
                        ? 'w-14 h-20 -translate-y-2 ring-2 ring-[#0D0D0D] shadow-md' 
                        : 'w-10 h-16 opacity-60 hover:opacity-100 hover:-translate-y-1'
                    }`}
                    style={{ backgroundColor: parent.arcColor }}
                  >
                    <div className="w-full h-full rounded-t-full overflow-hidden flex flex-col items-center justify-end bg-white/20">
                      <img 
                        src={parent.avatar} 
                        alt={parent.name}
                        className="w-full h-11 object-cover rounded-full" 
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Featured Active Parent Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <div 
                    className="w-20 h-20 rounded-full p-1 shadow-sm"
                    style={{ backgroundColor: parentTestimonials[activeParentIndex].arcColor }}
                  >
                    <img 
                      src={parentTestimonials[activeParentIndex].avatar} 
                      alt={parentTestimonials[activeParentIndex].name}
                      className="w-full h-full rounded-full object-cover" 
                    />
                  </div>
                </div>

                <div className="flex text-[#FFBA07] gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <h3 className="font-bold text-base text-gray-900 mb-0.5">
                  {parentTestimonials[activeParentIndex].name}
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-medium">
                  {parentTestimonials[activeParentIndex].role} · {parentTestimonials[activeParentIndex].location}
                </p>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic max-w-lg">
                  "{parentTestimonials[activeParentIndex].quote}"
                </p>

                <span className="inline-block mt-4 bg-[#FAF9F6] border border-gray-200 text-gray-700 text-[10px] font-bold px-3 py-1 rounded-full">
                  {parentTestimonials[activeParentIndex].badge}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CUEMATH ACCORDION FAQS ──────────────────────────────────── */}
      <section className="py-16 sm:py-20 max-w-[840px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0D0D0D] tracking-tight mb-1.5">
            FAQs
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Have questions about our pricing, curriculum, or 1:1 sessions? We've got answers.
          </p>
        </div>

        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {pricingFaqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i} 
                className="py-4 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full text-left flex items-center justify-between text-sm sm:text-[15px] font-bold text-gray-900 hover:text-black transition-colors cursor-pointer gap-4"
                >
                  <span>{faq.q}</span>
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-gray-500">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-black stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-600 stroke-[2.5]" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="pt-2 pb-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support contact info box */}
        <div className="mt-10 p-5 bg-[#FAF9F6] rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-gray-900">Still have questions?</h4>
            <p className="text-[11.5px] text-gray-500">Talk directly to coach Rathish and our academic advisors.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <a 
              href="tel:+917448408684" 
              className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors shadow-2xs"
            >
              📞 +91 74484 08684
            </a>
            <button
              type="button"
              onClick={() => handleSelectPlan(plansData[0])}
              className="px-3.5 py-1.5 bg-[#FFBA07] hover:bg-[#FFA800] text-[#0D0D0D] rounded-md text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Book Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* ── CUEMATH VIVID MAGENTA FINAL CTA BANNER ──────────────────── */}
      <section className="bg-[#ED439B] py-14 sm:py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-[10.5px] font-black uppercase tracking-[0.25em] text-white/90 mb-2.5">
            Give your child the gift of foresight
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-white tracking-tight mb-3 leading-tight">
            Ready to see your child think 3 moves ahead?
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-lg mx-auto mb-7 font-normal leading-relaxed">
            Book your free 1-on-1 introductory session today. No credit card required. Experience our teaching philosophy firsthand.
          </p>

          <button
            type="button"
            onClick={() => handleSelectPlan(plansData[1])}
            className="px-8 sm:px-10 py-3.5 bg-[#FFBA07] hover:bg-[#FFA800] text-[#0D0D0D] font-black text-sm tracking-wide rounded-md shadow-md transition-all duration-150 cursor-pointer inline-flex items-center gap-2 transform hover:scale-102"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-white/80 mt-3 font-medium">
            100% Free · 30 Minutes · Live With an Expert Coach
          </p>
        </div>
      </section>

      {/* ── CUEMATH STYLE CLEAN STRUCTURED FOOTER ───────────────────── */}
      <footer className="bg-[#FAF9F6] border-t border-gray-200 py-12 px-4 sm:px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-gray-600">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 bg-[#0D0D0D] text-white rounded flex items-center justify-center font-bold text-xs">
                  ♞
                </div>
                <span className="font-bold text-xs tracking-wide text-gray-900 uppercase">
                  Chess With Rathish
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-2.5">
                I don't teach chess, I teach thinking. Fostering cognitive stamina, patience, and pattern recognition in children aged 5–14.
              </p>
              <p className="text-[11px] font-bold text-gray-800">
                +91 74484 08684 · chesswiththekid.com
              </p>
            </div>

            <div>
              <h5 className="font-bold text-gray-900 uppercase text-[10.5px] tracking-wider mb-2.5">
                Programs
              </h5>
              <ul className="space-y-1.5 text-[11.5px]">
                <li><a href="/curriculum" className="hover:text-black">1:1 Beginner Foundation</a></li>
                <li><a href="/curriculum" className="hover:text-black">Intermediate Tactics</a></li>
                <li><a href="/curriculum" className="hover:text-black">FIDE Masterclasses</a></li>
                <li><a href="/curriculum" className="hover:text-black">Parent Teaching Scripts</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-gray-900 uppercase text-[10.5px] tracking-wider mb-2.5">
                Guarantee &amp; Safety
              </h5>
              <ul className="space-y-1.5 text-[11.5px]">
                <li><span className="text-gray-600">100% Unused Sessions Refund</span></li>
                <li><span className="text-gray-600">Switch Coaches Anytime</span></li>
                <li><span className="text-gray-600">Child-Safe Verified Mentors</span></li>
                <li><span className="text-gray-600">256-Bit SSL Encrypted</span></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-gray-900 uppercase text-[10.5px] tracking-wider mb-2.5">
                Global Families
              </h5>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-2">
                Serving young champions across India, United States, United Kingdom, UAE, Singapore, Canada, and Australia.
              </p>
              <div className="flex items-center gap-1.5 text-base">
                <span>🇮🇳</span>
                <span>🇺🇸</span>
                <span>🇬🇧</span>
                <span>🇦🇪</span>
                <span>🇸🇬</span>
                <span>🇦🇺</span>
                <span>🇨🇦</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
            <span>© {new Date().getFullYear()} Chess With Rathish. All rights reserved.</span>
            <span>Chess as the Tool. Thinking as the Outcome.</span>
          </div>
        </div>
      </footer>

      {/* ── 0% EMI INFORMATION MODAL ─────────────────────────────────── */}
      {showEmiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-[#FAF9F6] px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💳</span>
                <h3 className="font-bold text-sm text-gray-900">Flexible 0% EMI Options</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowEmiModal(false)}
                className="text-gray-400 hover:text-black p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                We believe top-tier chess mentorship should be effortless for every family. Enjoy zero-interest monthly installments with no processing charges.
              </p>

              <div className="space-y-2.5 mb-5">
                <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-[#FAF9F6]">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">6 Months Family Coach Plan</h4>
                    <p className="text-[10.5px] text-gray-500">Total ₹8,994</p>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#007038]">₹1,499 / mo</span>
                </div>

                <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-[#FAF9F6]">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">12 Months Master Plan</h4>
                    <p className="text-[10.5px] text-gray-500">Total ₹23,388</p>
                  </div>
                  <span className="text-xs sm:text-sm font-black text-[#007038]">₹1,949 / mo</span>
                </div>
              </div>

              <div className="text-[10.5px] text-gray-500 space-y-1 mb-5">
                <p>✓ Supported Banks: HDFC, ICICI, Axis, SBI, Kotak, Amex, Bajaj Finserv</p>
                <p>✓ Instant approval at checkout with credit cards &amp; pre-approved debit cards</p>
                <p>✓ 100% money-back guarantee also applies to EMI plans</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowEmiModal(false);
                  handleSelectPlan(plansData[1]);
                }}
                className="w-full py-2.5 bg-[#FFBA07] hover:bg-[#FFA800] text-black font-bold text-xs uppercase tracking-wider rounded-md transition-colors cursor-pointer"
              >
                Proceed with 6 Months Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL INTEGRATION ──────────────────────────────── */}
      {selectedPlan && (
        <CheckoutModal
          plan={{
            id: selectedPlan.id,
            name: selectedPlan.name,
            icon: '♟️',
            tagline: `${selectedPlan.sessions} — ${selectedPlan.subtitle}`,
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
