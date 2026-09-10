import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Printer, 
  Download, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  LayoutList, 
  Columns,
  GraduationCap,
  Trophy,
  Gamepad2,
  Swords
} from 'lucide-react';
import { Header } from './components/Header';
import { UnitAccordionItem } from './components/UnitAccordionItem';
import { SectionIcon, LessonItemIcon } from './components/IconBadge';
import { unitsData } from './data/unitsData';

export default function App() {
  // Unit 2 expanded / active by default
  const [expandedUnitId, setExpandedUnitId] = useState(2);
  // View mode for desktop: 'split' (2-column desktop view) or 'accordion' (wide desktop accordion)
  const [viewMode, setViewMode] = useState('split');
  
  // Track completed units
  const [completedUnits, setCompletedUnits] = useState({ 1: true });
  // Track checked lesson items
  const [checkedItems, setCheckedItems] = useState({});

  const toggleUnit = (id) => {
    setExpandedUnitId((prevId) => (prevId === id ? null : id));
  };

  const selectUnit = (id) => {
    setExpandedUnitId(id);
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

  return (
    <div className="min-h-screen bg-[#edf3f8] text-[#333] flex flex-col antialiased">
      
      {/* ChessKid Desktop Navigation Bar */}
      <nav className="bg-[#489f1f] border-b-4 border-[#3c8719] text-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          
          {/* Logo & Platform Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-black text-xl tracking-wider text-white">
              <span className="w-8 h-8 rounded-full bg-white text-[#489f1f] flex items-center justify-center font-black text-lg shadow-inner">
                ♟
              </span>
              <span>Chess<span className="text-[#ffe066]">Kid</span></span>
            </div>

            <span className="hidden md:inline-block text-xs font-semibold uppercase tracking-widest bg-[#387e17] px-2 py-0.5 rounded text-white/90">
              Curriculum & Lesson Planner
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6 text-[13px] font-bold">
            <a href="#lessons" className="text-white border-b-2 border-white pb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Lessons
            </a>
            <a href="#play" className="text-white/85 hover:text-white flex items-center gap-1.5 transition-colors">
              <Swords className="w-4 h-4" /> Play
            </a>
            <a href="#puzzles" className="text-white/85 hover:text-white flex items-center gap-1.5 transition-colors">
              <Gamepad2 className="w-4 h-4" /> Puzzles
            </a>
            <a href="#awards" className="text-white/85 hover:text-white flex items-center gap-1.5 transition-colors">
              <Trophy className="w-4 h-4" /> Awards
            </a>
          </div>

          {/* Teacher/Coach Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold leading-tight">Coach / Teacher View</span>
              <span className="text-[11px] text-white/80">Classroom Edition</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ffe066] border-2 border-white text-[#489f1f] font-bold flex items-center justify-center text-xs shadow-xs">
              CK
            </div>
          </div>

        </div>
      </nav>

      {/* Desktop Breadcrumb & Level Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
          
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <a href="#" className="hover:text-[#1ba3e1]">Home</a>
            <span>/</span>
            <a href="#" className="hover:text-[#1ba3e1]">Curriculum</a>
            <span>/</span>
            <span className="text-gray-800 font-semibold">Beginner Level (Units 1-11)</span>
          </div>

          {/* View Mode Controls & Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-gray-100 p-0.5 rounded-md border border-gray-200">
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  viewMode === 'split'
                    ? 'bg-white text-[#489f1f] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop 2-Column Split View"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Desktop Split</span>
              </button>
              <button
                onClick={() => setViewMode('accordion')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  viewMode === 'accordion'
                    ? 'bg-white text-[#489f1f] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Full Accordion List View"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Accordion List</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Desktop Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Main Lesson Planner Card with ChessKid Green Border */}
        <div className="bg-white border-[3.5px] border-[#50aa1b] rounded-[12px] shadow-sm p-5 md:p-7">
          
          {/* Top Header Section */}
          <div className="border-b border-gray-100 pb-4 mb-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              
              <Header />

              {/* Progress Summary Card on Desktop */}
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
                      {Math.round((completedCount / 11) * 100)}%
                    </span>
                  </div>
                  <div className="w-44 bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-[#50aa1b] h-full rounded-full transition-all duration-300"
                      style={{ width: `${(completedCount / 11) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DESKTOP VIEW 1: TWO-COLUMN SPLIT VIEW (DEFAULT FOR DESKTOP) */}
          {viewMode === 'split' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: 11 Units Sidebar Navigation */}
              <div className="lg:col-span-4 space-y-2">
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

              {/* Right Column: Detailed Desktop Expanded Unit View */}
              <div className="lg:col-span-8">
                <div className="border border-[#f37820] rounded-[8px] overflow-hidden shadow-xs">
                  
                  {/* Unit Orange Header */}
                  <div className="bg-[#f37820] text-white px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-white/80 font-bold block">
                        Active Lesson Plan
                      </span>
                      <h2 className="text-[17px] md:text-[19px] font-bold tracking-tight">
                        {activeUnit.title}
                      </h2>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={!!completedUnits[activeUnit.id]}
                        onChange={() => toggleUnitCompleted(activeUnit.id)}
                        className="w-4 h-4 rounded text-[#f37820] focus:ring-0 cursor-pointer"
                      />
                      <span>Mark Unit as Completed</span>
                    </label>
                  </div>

                  {/* Unit Content Body - Responsive 2-Column Desktop Grid */}
                  <div className="bg-white p-5 md:p-6 text-[13px] text-[#333]">
                    
                    {/* Top Row: Suggested Time Header with Badges */}
                    <div className="border-b border-gray-200 pb-4 mb-5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[14.5px]">
                          <SectionIcon type="clock" />
                          <span>Suggested time</span>
                          <span className="text-[#555] font-normal">-</span>
                          <span className="text-[#3ea824] font-bold text-[15px]">
                            {activeUnit.suggestedTime.total}
                          </span>
                        </div>

                        {/* Quick pill badges on desktop */}
                        {activeUnit.suggestedTime.breakdown && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {activeUnit.suggestedTime.breakdown.map((item, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md border border-gray-200 font-medium"
                              >
                                {item.label}: <strong className="text-gray-900 font-bold">{item.time}</strong>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Columns: Left (Pedagogy & Objectives) & Right (Lessons & Classroom) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      
                      {/* Left Column */}
                      <div className="space-y-5">
                        
                        {/* Description */}
                        <div className="border-b border-gray-200 pb-4">
                          <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[14px] mb-2">
                            <SectionIcon type="pencil" />
                            <span>Description</span>
                          </div>
                          <p className="pl-7 text-[13px] text-[#444] leading-relaxed">
                            {activeUnit.description}
                          </p>
                        </div>

                        {/* Educational Objectives */}
                        <div className="border-b border-gray-200 pb-4">
                          <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[14px] mb-2">
                            <SectionIcon type="puzzle" />
                            <span>Educational Objectives</span>
                          </div>
                          <div className="pl-7 text-[13px] text-[#444] space-y-2.5">
                            <p className="leading-relaxed">
                              {activeUnit.educationalObjectives.intro}
                            </p>

                            {activeUnit.educationalObjectives.extendedQuestions && (
                              <p className="leading-relaxed text-[12.5px] bg-amber-50/50 p-2.5 rounded border border-amber-200/60">
                                <strong className="text-[#222] font-bold">Extended thinking questions: </strong>
                                {activeUnit.educationalObjectives.extendedQuestions}
                              </p>
                            )}

                            {activeUnit.educationalObjectives.keyObjectives && (
                              <div className="pt-1">
                                <p className="font-bold text-[#222] mb-1 text-[13px]">Key Learning Objectives:</p>
                                <ul className="space-y-1 text-[12.5px] text-[#555] grid grid-cols-2 gap-x-2">
                                  {activeUnit.educationalObjectives.keyObjectives.map((obj, i) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#1ba3e1]" />
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
                          <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[14px] mb-2">
                              <SectionIcon type="loop" />
                              <span>Review of Previous Unit</span>
                            </div>
                            <p className="pl-7 text-[13px] text-[#444] leading-relaxed">
                              {activeUnit.reviewPreviousUnit}
                            </p>
                          </div>
                        )}

                      </div>

                      {/* Right Column */}
                      <div className="space-y-5">
                        
                        {/* Unit Lessons */}
                        {activeUnit.unitLessons && activeUnit.unitLessons.length > 0 && (
                          <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[14px] mb-2.5">
                              <SectionIcon type="arrow" />
                              <span>Unit Lessons</span>
                            </div>
                            <div className="pl-7 space-y-2.5">
                              {activeUnit.unitLessons.map((lesson) => (
                                <label
                                  key={lesson.id}
                                  className="flex items-center gap-3 text-[13px] cursor-pointer group p-1.5 rounded hover:bg-gray-50 transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!checkedItems[lesson.id]}
                                    onChange={() => toggleItemCheck(lesson.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer"
                                  />
                                  <LessonItemIcon type={lesson.type} />
                                  <a
                                    href={lesson.url}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[#1ba3e1] hover:underline font-semibold"
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
                          <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[14px] mb-2">
                              <SectionIcon type="easel" />
                              <span>Classroom Materials</span>
                            </div>
                            <div className="pl-7 text-[13px] text-[#444] space-y-2">
                              <div>
                                <div className="font-bold text-[#222]">
                                  {activeUnit.classroomMaterials.activityTitle}
                                </div>
                                <div className="font-bold text-[#222]">
                                  {activeUnit.classroomMaterials.activityName}
                                </div>
                                <p className="mt-1 leading-relaxed text-[12.5px]">
                                  {activeUnit.classroomMaterials.instructions}
                                </p>
                              </div>

                              {activeUnit.classroomMaterials.worksheet && (
                                <div className="pt-1">
                                  <label className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded hover:bg-gray-50 transition-colors">
                                    <input
                                      type="checkbox"
                                      checked={!!checkedItems[`worksheet-${activeUnit.id}`]}
                                      onChange={() => toggleItemCheck(`worksheet-${activeUnit.id}`)}
                                      className="w-4 h-4 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer"
                                    />
                                    <LessonItemIcon type="document" />
                                    <a
                                      href={activeUnit.classroomMaterials.worksheet.url}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-[#1ba3e1] hover:underline font-semibold"
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
                          <div className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[14px] mb-2.5">
                              <SectionIcon type="check" />
                              <span>Extra Activities</span>
                            </div>
                            <div className="pl-7 space-y-2.5">
                              {activeUnit.extraActivities.map((act) => (
                                <label
                                  key={act.id}
                                  className="flex items-center gap-3 text-[13px] cursor-pointer group p-1.5 rounded hover:bg-gray-50 transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={!!checkedItems[act.id]}
                                    onChange={() => toggleItemCheck(act.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer"
                                  />
                                  <LessonItemIcon type={act.type} />
                                  <a
                                    href={act.url}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-[#1ba3e1] hover:underline font-semibold"
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
                          <div className="text-[12.5px] text-[#555] pl-7 pt-1">
                            Unit Authors: <strong className="text-[#222] font-bold">{activeUnit.authors}</strong>
                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>
          ) : (
            /* DESKTOP VIEW 2: ACCORDION LIST VIEW */
            <div className="space-y-1.5">
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

      </div>

      {/* Footer */}
      <footer className="bg-[#1c4a27] text-white/80 py-6 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>© ChessKid.com — All Rights Reserved. Master the game one lesson at a time.</p>
        </div>
      </footer>

    </div>
  );
}
