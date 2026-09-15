import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  ChevronLeft,
  Printer, 
  CheckCircle2, 
  LayoutList, 
  Columns,
  GraduationCap,
  Trophy,
  Gamepad2,
  Swords,
  Menu,
  X,
  Sparkles,
  Layers,
  Check,
  Crown
} from 'lucide-react';
import { Header } from './components/Header';
import { UnitAccordionItem } from './components/UnitAccordionItem';
import { SectionIcon, LessonItemIcon } from './components/IconBadge';
import { PaymentPage } from './components/PaymentPage';
import { unitsData } from './data/unitsData';

export default function App() {
  // Page view: 'curriculum' | 'payment'
  const [currentPage, setCurrentPage] = useState('curriculum');
  // Active subscription if purchased
  const [activeSubscription, setActiveSubscription] = useState(null);

  // Unit 2 expanded / active by default
  const [expandedUnitId, setExpandedUnitId] = useState(2);
  // View mode: 'split' (desktop split / mobile focus card) or 'accordion' (full accordion list)
  const [viewMode, setViewMode] = useState('split');
  // Mobile drawer navigation state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Track completed units
  const [completedUnits, setCompletedUnits] = useState({ 1: true });
  // Track checked lesson items
  const [checkedItems, setCheckedItems] = useState({});


  const activePillRef = useRef(null);

  // Auto-scroll active pill into view on mobile
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [expandedUnitId]);

  const toggleUnit = (id) => {
    setExpandedUnitId((prevId) => (prevId === id ? null : id));
  };

  const selectUnit = (id) => {
    setExpandedUnitId(id);
  };

  const goToUnit = (id) => {
    setExpandedUnitId(id);
    const el = document.getElementById('active-unit-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleUnitCompleted = (id) => {
    setCompletedUnits((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleItemCheck = (key) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const activeUnit = unitsData.find((u) => u.id === expandedUnitId) || unitsData[1];
  const completedCount = Object.values(completedUnits).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / unitsData.length) * 100);

  const currentIndex = unitsData.findIndex((u) => u.id === activeUnit.id);
  const prevUnit = currentIndex > 0 ? unitsData[currentIndex - 1] : null;
  const nextUnit = currentIndex < unitsData.length - 1 ? unitsData[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#edf3f8] text-[#333] flex flex-col antialiased">
      
      {/* ChessKid Navigation Bar */}
      <nav className="bg-[#489f1f] border-b-4 border-[#3c8719] text-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          {/* Logo & Platform Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 font-black text-lg sm:text-xl tracking-wider text-white select-none">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#489f1f] flex items-center justify-center font-black text-base sm:text-lg shadow-inner">
                ♟
              </span>
              <span>Chess<span className="text-[#ffe066]">Kid</span></span>
            </div>

            <span className="hidden md:inline-block text-xs font-semibold uppercase tracking-widest bg-[#387e17] px-2 py-0.5 rounded text-white/90">
              Curriculum & Lesson Planner
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-5 text-[13px] font-bold">
            <button 
              type="button"
              onClick={() => setCurrentPage('curriculum')} 
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentPage === 'curriculum' 
                  ? 'text-white border-b-2 border-white pb-0.5' 
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Lessons
            </button>
            <a href="#play" className="text-white/85 hover:text-white flex items-center gap-1.5 transition-colors">
              <Swords className="w-4 h-4" /> Play
            </a>
            <a href="#puzzles" className="text-white/85 hover:text-white flex items-center gap-1.5 transition-colors">
              <Gamepad2 className="w-4 h-4" /> Puzzles
            </a>
            <a href="#awards" className="text-white/85 hover:text-white flex items-center gap-1.5 transition-colors">
              <Trophy className="w-4 h-4" /> Awards
            </a>
            <button
              type="button"
              onClick={() => setCurrentPage('payment')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentPage === 'payment'
                  ? 'text-white border-b-2 border-white pb-0.5'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4 text-[#ffe066]" /> Pricing & Plans
            </button>
          </div>

          {/* Teacher/Coach Badge, Upgrade CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Upgrade to Premium Button */}
            <button
              type="button"
              onClick={() => setCurrentPage('payment')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffe066] hover:bg-[#ffd633] text-[#1c4a27] font-extrabold text-xs shadow-md transition-all transform hover:scale-102 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-[#d97706] fill-[#d97706]" />
              <span className="font-black">Upgrade</span>
              <span className="hidden sm:inline bg-[#1c4a27] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                ₹999+
              </span>
            </button>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold leading-tight">Coach / Teacher View</span>
              <span className="text-[11px] text-white/80">Classroom Edition</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ffe066] border-2 border-white text-[#489f1f] font-bold flex items-center justify-center text-xs shadow-xs">
              CK
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="md:hidden p-1.5 text-white hover:bg-white/15 active:bg-white/25 rounded-md transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#3c8719] border-t border-white/20 px-4 py-3 space-y-2.5 shadow-lg animate-in slide-in-from-top-2 duration-200">
            
            {/* Mobile Upgrade CTA Banner */}
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                setCurrentPage('payment');
              }}
              className="w-full flex items-center justify-between bg-gradient-to-r from-[#ffe066] to-[#ffd633] text-[#1c4a27] px-3.5 py-2.5 rounded-lg font-black text-xs shadow-md"
            >
              <span className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#d97706] fill-[#d97706]" />
                <span>Unlock Curriculum (3 Plans)</span>
              </span>
              <span className="bg-[#1c4a27] text-white text-[10px] px-2 py-0.5 rounded-full">
                From ₹999/mo
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
              <button 
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  setCurrentPage('curriculum');
                }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2.5 rounded-lg text-white text-left cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#ffe066]" /> Lessons
              </button>
              <a 
                href="#play" 
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2.5 rounded-lg text-white"
              >
                <Swords className="w-4 h-4 text-[#ffe066]" /> Play Chess
              </a>
              <a 
                href="#puzzles" 
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2.5 rounded-lg text-white"
              >
                <Gamepad2 className="w-4 h-4 text-[#ffe066]" /> Puzzles
              </a>
              <a 
                href="#awards" 
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2.5 rounded-lg text-white"
              >
                <Trophy className="w-4 h-4 text-[#ffe066]" /> Awards
              </a>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-white/90">
              <span className="font-semibold">Teacher / Coach Edition</span>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  window.print();
                }}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded text-white font-medium"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Breadcrumb & View Mode Controls Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
          
          {currentPage === 'payment' ? (
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              <button 
                type="button" 
                onClick={() => setCurrentPage('curriculum')} 
                className="hover:text-[#1ba3e1] cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <button 
                type="button" 
                onClick={() => setCurrentPage('curriculum')} 
                className="hover:text-[#1ba3e1] cursor-pointer"
              >
                Curriculum
              </button>
              <span>/</span>
              <span className="text-gray-800 font-semibold truncate">Plans & Pricing (₹999, ₹1,999, ₹2,999 /mo)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              <a href="#" className="hover:text-[#1ba3e1]">Home</a>
              <span>/</span>
              <a href="#" className="hidden sm:inline hover:text-[#1ba3e1]">Curriculum</a>
              <span className="hidden sm:inline">/</span>
              <span className="text-gray-800 font-semibold truncate">Beginner Level (Units 1-11)</span>
            </div>
          )}

          {/* View Mode Switcher / Action controls */}
          <div className="flex items-center gap-2 ml-auto">
            {currentPage === 'payment' ? (
              <button
                type="button"
                onClick={() => setCurrentPage('curriculum')}
                className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold text-[#489f1f] bg-green-50 hover:bg-green-100 border border-green-200 transition-colors cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>View Lesson Planner</span>
              </button>
            ) : (
              <div className="flex items-center bg-gray-100 p-0.5 rounded-md border border-gray-200">
                <button
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-white text-[#489f1f] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Single Unit Card View"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="inline">Unit View</span>
                </button>
                <button
                  onClick={() => setViewMode('accordion')}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'accordion'
                      ? 'bg-white text-[#489f1f] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Full Accordion List View"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span className="inline">All Units</span>
                </button>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Container */}
      {currentPage === 'payment' ? (
        <PaymentPage
          onBackToCurriculum={() => setCurrentPage('curriculum')}
          onSubscriptionSuccess={(details) => {
            setActiveSubscription(details);
          }}
        />
      ) : (
        <div className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-5 md:p-6 lg:p-8">
          {/* Active Subscription Banner */}
            {activeSubscription && (
              <div className="mb-4 bg-gradient-to-r from-emerald-600 via-[#489f1f] to-teal-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between flex-wrap gap-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black text-sm shadow-inner">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                      Active Subscription
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base">
                      {activeSubscription.plan.name} Activated! ({activeSubscription.orderId})
                    </h4>
                    <p className="text-xs text-white/90">
                      All units, teacher PDFs, masterclass lessons, and premium activities are fully unlocked.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentPage('payment')}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
                >
                  Manage / Change Plan
                </button>
              </div>
            )}

            {/* Main Lesson Planner Card with ChessKid Green Border */}
            <div className="bg-white border-2 sm:border-[3.5px] border-[#50aa1b] rounded-xl sm:rounded-[12px] shadow-sm p-3.5 sm:p-5 md:p-7">
              
              {/* Top Header Section */}
              <div className="border-b border-gray-100 pb-4 mb-4 sm:mb-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  
                  <Header onOpenPricing={() => setCurrentPage('payment')} />

                  {/* Progress Summary Card (Desktop) */}
                  <div className="hidden lg:flex items-center gap-5 bg-[#f7fbf4] border border-[#d6ecd0] p-3.5 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#50aa1b]/15 flex items-center justify-center text-[#50aa1b]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Curriculum Progress
                      </div>
                      <div className="text-sm font-bold text-[#1a3821] flex items-center gap-2">
                        <span>{completedCount} of 11 Units Completed</span>
                        <span className="text-xs font-medium text-[#50aa1b] bg-green-100 px-2 py-0.5 rounded-full">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-44 bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-[#50aa1b] h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Mobile & Tablet Curriculum Progress Banner */}
                <div className="lg:hidden mt-3 p-3 bg-[#f7fbf4] border border-[#d6ecd0] rounded-lg">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-gray-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#50aa1b]" />
                      Curriculum Progress
                    </span>
                    <span className="font-bold text-[#1a3821]">
                      {completedCount} of 11 Completed ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#50aa1b] h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

              </div>

          {/* VIEW 1: UNIT VIEW (MOBILE FOCUS CAROUSEL + DESKTOP SPLIT VIEW) */}
          {viewMode === 'split' ? (
            <div>
              
              {/* MOBILE & TABLET UNIT SELECTOR BAR (< lg) */}
              <div className="lg:hidden mb-4 bg-[#f8fafc] border border-gray-200 rounded-lg p-2.5 sm:p-3">
                
                {/* Header row with Quick Jump Dropdown */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#1ba3e1]" />
                    Select Unit (1-11)
                  </span>

                  {/* Native Dropdown for instant unit switching */}
                  <select
                    value={activeUnit.id}
                    onChange={(e) => goToUnit(Number(e.target.value))}
                    className="text-xs font-semibold bg-white border border-[#23a2de] text-[#1ba3e1] rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1ba3e1] cursor-pointer"
                  >
                    {unitsData.map((u) => (
                      <option key={u.id} value={u.id}>
                        Unit {u.id}: {u.title.split('-')[1]?.trim() || u.title}
                        {completedUnits[u.id] ? ' ✓' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Horizontal Scrollable Unit Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {unitsData.map((unit) => {
                    const isSelected = activeUnit.id === unit.id;
                    const isDone = !!completedUnits[unit.id];

                    return (
                      <button
                        key={unit.id}
                        ref={isSelected ? activePillRef : null}
                        onClick={() => goToUnit(unit.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-[#f37820] text-white shadow-xs scale-[1.02]'
                            : 'bg-white text-[#1ba3e1] border border-[#23a2de] hover:bg-sky-50 active:bg-sky-100'
                        }`}
                      >
                        {isDone && (
                          <Check className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#50aa1b]'}`} strokeWidth={3} />
                        )}
                        <span>Unit {unit.id}</span>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Grid Layout: Desktop 2-Column Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: 11 Units Sidebar Navigation (Desktop only) */}
                <div className="hidden lg:block lg:col-span-4 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 px-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span>Curriculum Units (11)</span>
                    <span className="text-[#1ba3e1]">Select to View</span>
                  </div>

                  <div className="space-y-1.5">
                    {unitsData.map((unit) => {
                      const isSelected = activeUnit.id === unit.id;
                      const isDone = !!completedUnits[unit.id];

                      return (
                        <button
                          key={unit.id}
                          onClick={() => selectUnit(unit.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left rounded-[6px] transition-all select-none cursor-pointer ${
                            isSelected
                              ? 'bg-[#f37820] text-white shadow-xs font-bold'
                              : 'bg-white text-[#1ba3e1] border border-[#23a2de] hover:bg-sky-50/40 font-bold'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="text-[13.5px] truncate">
                              {unit.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isDone && (
                              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#50aa1b]'}`} title="Completed" />
                            )}
                            {isSelected ? (
                              <ChevronUp className="w-4.5 h-4.5 text-white" strokeWidth={2.8} />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-[#1ba3e1]" strokeWidth={2.5} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column (Full width on mobile): Detailed Active Unit View */}
                <div className="lg:col-span-8" id="active-unit-card">
                  <div className="border border-[#f37820] rounded-[8px] overflow-hidden shadow-xs">
                    
                    {/* Unit Orange Header */}
                    <div className="bg-[#f37820] text-white px-3.5 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <span className="text-[11px] uppercase tracking-widest text-white/80 font-bold block">
                          Active Lesson Plan
                        </span>
                        <h2 className="text-base sm:text-lg md:text-[19px] font-bold tracking-tight leading-snug">
                          {activeUnit.title}
                        </h2>
                      </div>

                      {/* Prominent Touch-Friendly Mark Completed Button */}
                      <button
                        type="button"
                        onClick={() => toggleUnitCompleted(activeUnit.id)}
                        className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full transition-colors self-start sm:self-auto cursor-pointer min-h-[38px] ${
                          completedUnits[activeUnit.id]
                            ? 'bg-white text-[#f37820] shadow-xs'
                            : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!completedUnits[activeUnit.id]}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#f37820] focus:ring-0 cursor-pointer pointer-events-none"
                        />
                        <span>{completedUnits[activeUnit.id] ? 'Unit Completed ✓' : 'Mark Unit Completed'}</span>
                      </button>
                    </div>

                    {/* Unit Content Body */}
                    <div className="bg-white p-3.5 sm:p-5 md:p-6 text-[12.5px] sm:text-[13px] text-[#333]">
                      
                      {/* Top Row: Suggested Time Header with Badges */}
                      <div className="border-b border-gray-200 pb-3.5 mb-4 sm:mb-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] sm:text-[14.5px]">
                            <SectionIcon type="clock" />
                            <span>Suggested time</span>
                            <span className="text-[#555] font-normal">-</span>
                            <span className="text-[#3ea824] font-bold text-[14.5px] sm:text-[15px]">
                              {activeUnit.suggestedTime.total}
                            </span>
                          </div>

                          {/* Quick pill badges */}
                          {activeUnit.suggestedTime.breakdown && (
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              {activeUnit.suggestedTime.breakdown.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-gray-700 text-[11.5px] sm:text-xs px-2.5 py-1 rounded-md border border-gray-200 font-medium"
                                >
                                  {item.label}: <strong className="text-gray-900 font-bold">{item.time}</strong>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Columns: Left (Pedagogy & Objectives) & Right (Lessons & Classroom) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
                        
                        {/* Left Column */}
                        <div className="space-y-4 sm:space-y-5">
                          
                          {/* Description */}
                          <div className="border-b border-gray-200 pb-3.5">
                            <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] sm:text-[14px] mb-2">
                              <SectionIcon type="pencil" />
                              <span>Description</span>
                            </div>
                            <p className="pl-6 sm:pl-7 text-[12.5px] sm:text-[13px] text-[#444] leading-relaxed">
                              {activeUnit.description}
                            </p>
                          </div>

                          {/* Educational Objectives */}
                          <div className="border-b border-gray-200 pb-3.5">
                            <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] sm:text-[14px] mb-2">
                              <SectionIcon type="puzzle" />
                              <span>Educational Objectives</span>
                            </div>
                            <div className="pl-6 sm:pl-7 text-[12.5px] sm:text-[13px] text-[#444] space-y-2.5">
                              <p className="leading-relaxed">
                                {activeUnit.educationalObjectives.intro}
                              </p>

                              {activeUnit.educationalObjectives.extendedQuestions && (
                                <p className="leading-relaxed text-[12px] sm:text-[12.5px] bg-amber-50/60 p-2.5 rounded border border-amber-200/70">
                                  <strong className="text-[#222] font-bold">Extended thinking questions: </strong>
                                  {activeUnit.educationalObjectives.extendedQuestions}
                                </p>
                              )}

                              {activeUnit.educationalObjectives.keyObjectives && (
                                <div className="pt-1">
                                  <p className="font-bold text-[#222] mb-1 text-[12.5px] sm:text-[13px]">Key Learning Objectives:</p>
                                  <ul className="space-y-1 text-[12px] sm:text-[12.5px] text-[#555] grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {activeUnit.educationalObjectives.keyObjectives.map((obj, i) => (
                                      <li key={i} className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#1ba3e1] flex-shrink-0" />
                                        <span>{obj}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Review of Previous Unit */}
                          {activeUnit.reviewPreviousUnit && (
                            <div className="border-b border-gray-200 pb-3.5">
                              <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] sm:text-[14px] mb-2">
                                <SectionIcon type="loop" />
                                <span>Review of Previous Unit</span>
                              </div>
                              <p className="pl-6 sm:pl-7 text-[12.5px] sm:text-[13px] text-[#444] leading-relaxed">
                                {activeUnit.reviewPreviousUnit}
                              </p>
                            </div>
                          )}

                        </div>

                        {/* Right Column */}
                        <div className="space-y-4 sm:space-y-5">
                          
                          {/* Unit Lessons */}
                          {activeUnit.unitLessons && activeUnit.unitLessons.length > 0 && (
                            <div className="border-b border-gray-200 pb-3.5">
                              <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] sm:text-[14px] mb-2.5">
                                <SectionIcon type="arrow" />
                                <span>Unit Lessons</span>
                              </div>
                              <div className="pl-1 sm:pl-7 space-y-1.5">
                                {activeUnit.unitLessons.map((lesson) => (
                                  <label
                                    key={lesson.id}
                                    className="flex items-center gap-3 text-[12.5px] sm:text-[13px] cursor-pointer group p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[40px]"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!checkedItems[lesson.id]}
                                      onChange={() => toggleItemCheck(lesson.id)}
                                      className="w-4 h-4 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer flex-shrink-0"
                                    />
                                    <LessonItemIcon type={lesson.type} />
                                    <a
                                      href={lesson.url}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-[#1ba3e1] hover:underline font-semibold break-words leading-tight"
                                    >
                                      {lesson.title}
                                    </a>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Classroom Materials */}
                          {activeUnit.classroomMaterials && (
                            <div className="border-b border-gray-200 pb-3.5">
                              <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] sm:text-[14px] mb-2">
                                <SectionIcon type="easel" />
                                <span>Classroom Materials</span>
                              </div>
                              <div className="pl-6 sm:pl-7 text-[12.5px] sm:text-[13px] text-[#444] space-y-2">
                                <div>
                                  <div className="font-bold text-[#222]">
                                    {activeUnit.classroomMaterials.activityTitle}
                                  </div>
                                  <div className="font-bold text-[#222]">
                                    {activeUnit.classroomMaterials.activityName}
                                  </div>
                                  <p className="mt-1 leading-relaxed text-[12px] sm:text-[12.5px]">
                                    {activeUnit.classroomMaterials.instructions}
                                  </p>
                                </div>

                                {activeUnit.classroomMaterials.worksheet && (
                                  <div className="pt-1">
                                    <label className="flex items-center gap-2.5 cursor-pointer p-2 -ml-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[40px]">
                                      <input
                                        type="checkbox"
                                        checked={!!checkedItems[`worksheet-${activeUnit.id}`]}
                                        onChange={() => toggleItemCheck(`worksheet-${activeUnit.id}`)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer flex-shrink-0"
                                      />
                                      <LessonItemIcon type="document" />
                                      <a
                                        href={activeUnit.classroomMaterials.worksheet.url}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-[#1ba3e1] hover:underline font-semibold break-words leading-tight"
                                      >
                                        {activeUnit.classroomMaterials.worksheet.title}
                                      </a>
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Extra Activities */}
                          {activeUnit.extraActivities && activeUnit.extraActivities.length > 0 && (
                            <div className="border-b border-gray-200 pb-3.5">
                              <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] sm:text-[14px] mb-2.5">
                                <SectionIcon type="check" />
                                <span>Extra Activities</span>
                              </div>
                              <div className="pl-1 sm:pl-7 space-y-1.5">
                                {activeUnit.extraActivities.map((act) => (
                                  <label
                                    key={act.id}
                                    className="flex items-center gap-3 text-[12.5px] sm:text-[13px] cursor-pointer group p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[40px]"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!checkedItems[act.id]}
                                      onChange={() => toggleItemCheck(act.id)}
                                      className="w-4 h-4 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer flex-shrink-0"
                                    />
                                    <LessonItemIcon type={act.type} />
                                    <a
                                      href={act.url}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-[#1ba3e1] hover:underline font-semibold break-words leading-tight"
                                    >
                                      {act.title}
                                    </a>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Footer Authors */}
                          {activeUnit.authors && (
                            <div className="text-[12px] sm:text-[12.5px] text-[#555] pl-6 sm:pl-7 pt-1">
                              Unit Authors: <strong className="text-[#222] font-bold">{activeUnit.authors}</strong>
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Sequential Unit Navigation Footer (Previous / Next Unit Buttons) */}
                      <div className="border-t border-gray-200 pt-4 mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                        {prevUnit ? (
                          <button
                            type="button"
                            onClick={() => goToUnit(prevUnit.id)}
                            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#23a2de] text-[#1ba3e1] hover:bg-sky-50 active:bg-sky-100 font-bold text-xs transition-colors cursor-pointer min-h-[42px]"
                          >
                            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Prev: {prevUnit.title.split('-')[1]?.trim() || `Unit ${prevUnit.id}`}</span>
                          </button>
                        ) : (
                          <div className="hidden sm:block" />
                        )}

                        <span className="text-xs text-gray-500 font-semibold text-center order-last sm:order-none py-1">
                          Unit {activeUnit.id} of 11
                        </span>

                        {nextUnit ? (
                          <button
                            type="button"
                            onClick={() => goToUnit(nextUnit.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#50aa1b] text-white hover:bg-[#439216] active:bg-[#387e12] font-bold text-xs shadow-xs transition-colors cursor-pointer min-h-[42px]"
                          >
                            <span className="truncate">Next: {nextUnit.title.split('-')[1]?.trim() || `Unit ${nextUnit.id}`}</span>
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                          </button>
                        ) : (
                          <div className="hidden sm:block" />
                        )}
                      </div>

                    </div>

                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* VIEW 2: ACCORDION LIST VIEW (ALL 11 UNITS) */
            <div className="space-y-2">
              <div className="pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>All Curriculum Units (11)</span>
                <span className="text-[#1ba3e1]">Tap to Expand / Collapse</span>
              </div>

              {unitsData.map((unit) => (
                <UnitAccordionItem
                  key={unit.id}
                  unit={unit}
                  isExpanded={expandedUnitId === unit.id}
                  onToggle={() => toggleUnit(unit.id)}
                />
              ))}
            </div>
          )}

        </div>

        {/* Bottom Upgrade Callout Banner */}
        <div className="mt-6 bg-gradient-to-r from-amber-500/10 via-[#489f1f]/10 to-sky-500/10 border border-[#489f1f]/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffe066] to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Crown className="w-7 h-7 text-[#1c4a27]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-gray-900">
                  Need the Full Written Curriculum & Advanced Units?
                </h4>
                <span className="hidden sm:inline-block text-[10px] uppercase font-black bg-[#489f1f] text-white px-2 py-0.5 rounded-full">
                  3 Plans Available
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Get all 30 lesson plans, printable PDF worksheets, classroom leaderboards, and master videos. Plans at ₹999, ₹1,999 & ₹2,999/mo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage('payment')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#489f1f] hover:bg-[#3c8719] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>View Pricing & Upgrade</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        </div>
      )}


      {/* Footer */}
      {currentPage !== 'payment' && (
        <footer className="bg-[#1c4a27] text-white/80 py-5 sm:py-6 text-center text-xs mt-auto">
          <div className="max-w-7xl mx-auto px-4">
            <p>© ChessKid.com — All Rights Reserved. Master the game one lesson at a time.</p>
          </div>
        </footer>
      )}

    </div>
  );
}
