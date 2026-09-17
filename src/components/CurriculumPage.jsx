import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles,
  Layers,
  Check,
  Crown
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Header } from './Header';
import { UnitAccordionItem } from './UnitAccordionItem';
import { SectionIcon, LessonItemIcon } from './IconBadge';
import { unitsData } from '../data/unitsData';

export const CurriculumPage = ({ activeSubscription }) => {
  // Unit 2 expanded / active by default
  const [expandedUnitId, setExpandedUnitId] = useState(2);
  // View mode: 'split' (desktop split / mobile focus card) or 'accordion' (full accordion list)
  const [viewMode, setViewMode] = useState('split');
  
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
      {/* Unified Site Navbar */}
      <Navbar />

      {/* Breadcrumb & View Controls Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/" className="hover:text-[#1a3d1a] transition-colors cursor-pointer font-semibold">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Curriculum</span>
            <span className="hidden sm:inline text-gray-400">/</span>
            <span className="hidden sm:inline text-gray-600 truncate">Beginner Level (Units 1-11)</span>
          </div>

          {/* View Mode Switcher / Action controls */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center bg-gray-100 p-0.5 rounded-md border border-gray-200">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white text-[#1a3d1a] shadow-xs'
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
                    ? 'bg-white text-[#1a3d1a] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Full Accordion List View"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="inline">All Units</span>
              </button>
            </div>

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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-5 md:p-6 lg:p-8">
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
                  All units, parent guides, live lessons, and resources are fully unlocked.
                </p>
              </div>
            </div>
            <Link
              to="/pricing"
              className="px-3.5 py-1.5 rounded-lg bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer"
            >
              Manage / Change Plan
            </Link>
          </div>
        )}

        {/* Main Lesson Planner Card */}
        <div className="bg-white border-2 sm:border-[3.5px] border-[#4a7c4a] rounded-xl sm:rounded-[12px] shadow-sm p-3.5 sm:p-5 md:p-7">
          
          {/* Top Header Section */}
          <div className="border-b border-gray-100 pb-4 mb-4 sm:mb-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              <Header onOpenPricing={null} />

              {/* Progress Summary Card (Desktop) */}
              <div className="hidden lg:flex items-center gap-5 bg-[#f7fbf4] border border-[#d6ecd0] p-3.5 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#4a7c4a]/15 flex items-center justify-center text-[#4a7c4a]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Curriculum Progress
                  </div>
                  <div className="text-sm font-bold text-[#1a3821] flex items-center gap-2">
                    <span>{completedCount} of 11 Units Completed</span>
                    <span className="text-xs font-medium text-[#4a7c4a] bg-green-100 px-2 py-0.5 rounded-full">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-44 bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#4a7c4a] h-full rounded-full transition-all duration-300"
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
                  <CheckCircle2 className="w-4 h-4 text-[#4a7c4a]" />
                  Curriculum Progress
                </span>
                <span className="font-bold text-[#1a3821]">
                  {completedCount} of 11 Completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#4a7c4a] h-full rounded-full transition-all duration-300"
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#1ba3e1]" />
                    Select Unit (1-11)
                  </span>

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
                            ? 'bg-[#1a3d1a] text-white shadow-xs scale-[1.02]'
                            : 'bg-white text-[#1ba3e1] border border-[#23a2de] hover:bg-sky-50 active:bg-sky-100'
                        }`}
                      >
                        {isDone && (
                          <Check className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#4a7c4a]'}`} strokeWidth={3} />
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
                  <div className="pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Curriculum Units</span>
                    <span className="text-[#1a3d1a] font-semibold">{completedCount}/11 Done</span>
                  </div>

                  <div className="space-y-1.5 max-h-[820px] overflow-y-auto pr-1">
                    {unitsData.map((unit) => {
                      const isSelected = activeUnit.id === unit.id;
                      const isDone = !!completedUnits[unit.id];

                      return (
                        <div
                          key={unit.id}
                          onClick={() => selectUnit(unit.id)}
                          className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-emerald-50/70 border-[#1a3d1a] shadow-xs'
                              : 'bg-white hover:bg-gray-50/80 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleUnitCompleted(unit.id);
                              }}
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors flex-shrink-0 cursor-pointer ${
                                isDone
                                  ? 'bg-[#1a3d1a] border-[#1a3d1a] text-white'
                                  : 'border-gray-300 hover:border-gray-400 bg-white'
                              }`}
                              title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                              {isDone && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold ${isSelected ? 'text-[#1a3d1a]' : 'text-gray-900'}`}>
                                  Unit {unit.id}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-600 truncate">
                                {unit.title.split('-')[1]?.trim() || unit.title}
                              </p>
                            </div>
                          </div>

                          <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'text-[#1a3d1a] translate-x-0.5' : 'text-gray-400'}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Active Unit Focus Card */}
                <div id="active-unit-card" className="lg:col-span-8 scroll-mt-20">
                  <UnitAccordionItem 
                    unit={activeUnit} 
                    isExpanded={true} 
                    onToggle={() => {}} 
                  />

                  {/* Next / Prev Navigation Row */}
                  <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between gap-3 shadow-2xs">
                    {prevUnit ? (
                      <button
                        type="button"
                        onClick={() => goToUnit(prevUnit.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Unit {prevUnit.id}: {prevUnit.title.split('-')[1]?.trim() || prevUnit.title}</span>
                      </button>
                    ) : <div />}

                    {nextUnit ? (
                      <button
                        type="button"
                        onClick={() => goToUnit(nextUnit.id)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a3d1a] hover:bg-[#2d5a2d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer ml-auto"
                      >
                        <span>Next: Unit {nextUnit.id}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link
                        to="/pricing"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a3d1a] hover:bg-[#2d5a2d] text-white text-xs font-bold transition-all shadow-xs cursor-pointer ml-auto"
                      >
                        <span>Book a 1:1 Trial →</span>
                      </Link>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* VIEW 2: ACCORDION LIST VIEW (ALL 11 UNITS) */
            <div className="space-y-2">
              <div className="pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>All Curriculum Units (11)</span>
                <span className="text-[#1a3d1a]">Tap to Expand / Collapse</span>
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
        <div className="mt-6 bg-gradient-to-r from-emerald-500/10 via-[#1a3d1a]/10 to-amber-500/10 border border-[#1a3d1a]/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a3d1a] to-[#2d5a2d] flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Crown className="w-7 h-7 text-[#ffe066]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-gray-900">
                  Ready to start 1:1 Guided Chess for your Child?
                </h4>
                <span className="hidden sm:inline-block text-[10px] uppercase font-black bg-[#1a3d1a] text-white px-2 py-0.5 rounded-full">
                  1:1 Live Online
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                24 structured live sessions for kids aged 4–6 with Coach Rathish. Step-by-step parent guides, fun play, and thinking skills.
              </p>
            </div>
          </div>

          <Link
            to="/pricing"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1a3d1a] hover:bg-[#2d5a2d] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 whitespace-nowrap"
          >
            <span>Book a 1:1 Trial →</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#1a3d1a] text-white/80 py-5 sm:py-6 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>© Chess With Rathish — All Rights Reserved. I don't teach chess, I teach thinking.</p>
        </div>
      </footer>

    </div>
  );
};
