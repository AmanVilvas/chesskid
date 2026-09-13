import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SectionIcon, LessonItemIcon } from './IconBadge';

export const UnitAccordionItem = ({ unit, isExpanded, onToggle }) => {
  // Local state for interactive checkboxes
  const [completed, setCompleted] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItemCheck = (key) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="mb-2.5 transition-all">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        type="button"
        aria-expanded={isExpanded}
        className={`w-full flex items-center justify-between px-3.5 py-3 sm:py-2.5 text-left transition-colors duration-150 select-none cursor-pointer min-h-[48px] ${
          isExpanded
            ? 'bg-[#f37820] text-white rounded-t-[6px] shadow-xs'
            : 'bg-white text-[#1ba3e1] border border-[#23a2de] rounded-[6px] hover:bg-sky-50/40 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 pr-2 min-w-0">
          {completed && (
            <span
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                isExpanded ? 'bg-white ring-2 ring-white/30' : 'bg-[#50aa1b]'
              }`}
              title="Unit Completed"
            />
          )}
          <span className="font-bold text-[14px] sm:text-[15px] tracking-tight leading-snug">
            {unit.title}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-white flex-shrink-0 ml-1" strokeWidth={2.6} />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#1ba3e1] flex-shrink-0 ml-1" strokeWidth={2.6} />
        )}
      </button>

      {/* Accordion Expanded Body */}
      {isExpanded && (
        <div className="bg-white border-x border-b border-[#f37820] rounded-b-[6px] p-3.5 sm:p-5 md:p-6 text-[12.5px] sm:text-[13px] text-[#333] shadow-xs">
          
          {/* Section 1: Suggested time & Completion toggle */}
          <div className="border-b border-gray-200 pb-3 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] sm:text-[14px]">
                <SectionIcon type="clock" />
                <span>Suggested time</span>
                <span className="text-[#555] font-normal">-</span>
                <span className="text-[#3ea824] font-bold text-[14.5px]">{unit.suggestedTime.total}</span>
              </div>

              <button
                type="button"
                onClick={() => setCompleted((prev) => !prev)}
                className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors self-start sm:self-auto cursor-pointer min-h-[36px] ${
                  completed
                    ? 'bg-green-100 text-[#2e7d32] border border-green-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={() => {}} // Handled by button onClick
                  className="w-4 h-4 rounded text-[#489f1f] focus:ring-0 cursor-pointer pointer-events-none"
                />
                <span>{completed ? 'Unit Completed ✓' : 'Mark as Completed'}</span>
              </button>
            </div>

            {unit.suggestedTime.breakdown && (
              <div className="mt-2.5 sm:pl-7 flex flex-wrap gap-2 text-[12px] text-[#444]">
                {unit.suggestedTime.breakdown.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-700"
                  >
                    {item.label}: <strong className="text-gray-900 font-bold">{item.time}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 2-Column Responsive Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-start">
            
            {/* Left Column */}
            <div className="space-y-4">
              {/* Section 2: Description */}
              <div className="border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-1.5">
                  <SectionIcon type="pencil" />
                  <span>Description</span>
                </div>
                <p className="pl-6 sm:pl-7 text-[12px] sm:text-[12.5px] text-[#444] leading-relaxed">
                  {unit.description}
                </p>
              </div>

              {/* Section 3: Educational Objectives */}
              <div className="border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-1.5">
                  <SectionIcon type="puzzle" />
                  <span>Educational Objectives</span>
                </div>
                <div className="pl-6 sm:pl-7 text-[12px] sm:text-[12.5px] text-[#444] space-y-2">
                  <p className="leading-relaxed">{unit.educationalObjectives.intro}</p>

                  {unit.educationalObjectives.extendedQuestions && (
                    <p className="leading-relaxed bg-amber-50/60 p-2 sm:p-2.5 rounded border border-amber-200/70 text-[12px]">
                      <strong className="text-[#222] font-bold">Extended thinking questions: </strong>
                      {unit.educationalObjectives.extendedQuestions}
                    </p>
                  )}

                  {unit.educationalObjectives.keyObjectives && (
                    <div className="pt-0.5">
                      <p className="font-bold text-[#222] mb-1">Key Learning Objectives:</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[12px] text-[#555]">
                        {unit.educationalObjectives.keyObjectives.map((obj, i) => (
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

              {/* Section 4: Review of Previous Unit */}
              {unit.reviewPreviousUnit && (
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-1.5">
                    <SectionIcon type="loop" />
                    <span>Review of Previous Unit</span>
                  </div>
                  <p className="pl-6 sm:pl-7 text-[12px] sm:text-[12.5px] text-[#444] leading-relaxed">
                    {unit.reviewPreviousUnit}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Section 5: Unit Lessons */}
              {unit.unitLessons && unit.unitLessons.length > 0 && (
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-2">
                    <SectionIcon type="arrow" />
                    <span>Unit Lessons</span>
                  </div>
                  <div className="pl-2 sm:pl-7 space-y-1">
                    {unit.unitLessons.map((lesson) => (
                      <label
                        key={lesson.id}
                        className="flex items-center gap-2.5 text-[12.5px] cursor-pointer group p-1.5 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[38px]"
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
                          className="text-[#1ba3e1] hover:underline font-medium break-words leading-tight"
                        >
                          {lesson.title}
                        </a>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 6: Classroom Materials */}
              {unit.classroomMaterials && (
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-1.5">
                    <SectionIcon type="easel" />
                    <span>Classroom Materials</span>
                  </div>
                  <div className="pl-6 sm:pl-7 text-[12px] sm:text-[12.5px] text-[#444] space-y-1.5">
                    <div>
                      <div className="font-bold text-[#222]">
                        {unit.classroomMaterials.activityTitle}
                      </div>
                      <div className="font-bold text-[#222]">
                        {unit.classroomMaterials.activityName}
                      </div>
                      <p className="mt-1 leading-relaxed">
                        {unit.classroomMaterials.instructions}
                      </p>
                    </div>

                    {unit.classroomMaterials.worksheet && (
                      <div className="pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer p-1.5 -ml-1.5 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[38px]">
                          <input
                            type="checkbox"
                            checked={!!checkedItems[`worksheet-${unit.id}`]}
                            onChange={() => toggleItemCheck(`worksheet-${unit.id}`)}
                            className="w-4 h-4 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer flex-shrink-0"
                          />
                          <LessonItemIcon type="document" />
                          <a
                            href={unit.classroomMaterials.worksheet.url}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#1ba3e1] hover:underline font-medium break-words leading-tight"
                          >
                            {unit.classroomMaterials.worksheet.title}
                          </a>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 7: Extra Activities */}
              {unit.extraActivities && unit.extraActivities.length > 0 && (
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-2">
                    <SectionIcon type="check" />
                    <span>Extra Activities</span>
                  </div>
                  <div className="pl-2 sm:pl-7 space-y-1">
                    {unit.extraActivities.map((act) => (
                      <label
                        key={act.id}
                        className="flex items-center gap-2.5 text-[12.5px] cursor-pointer group p-1.5 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[38px]"
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
                          className="text-[#1ba3e1] hover:underline font-medium break-words leading-tight"
                        >
                          {act.title}
                        </a>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 8: Footer Authors */}
              {unit.authors && (
                <div className="text-[12px] text-[#555] pl-6 sm:pl-7 pt-0.5">
                  Unit Authors: <strong className="text-[#222] font-bold">{unit.authors}</strong>
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
