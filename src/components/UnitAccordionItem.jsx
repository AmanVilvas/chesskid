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
    <div className="mb-2 transition-all">
      {/* Accordion Header */}
      <button
        onClick={onToggle}
        type="button"
        aria-expanded={isExpanded}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors duration-150 select-none ${
          isExpanded
            ? 'bg-[#f37820] text-white rounded-t-[5px] shadow-xs'
            : 'bg-white text-[#1ba3e1] border border-[#23a2de] rounded-[5px] hover:bg-sky-50/40 shadow-xs'
        }`}
      >
        <span className="font-bold text-[14px] md:text-[15px] tracking-tight">
          {unit.title}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-white flex-shrink-0" strokeWidth={2.6} />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#1ba3e1] flex-shrink-0" strokeWidth={2.6} />
        )}
      </button>

      {/* Accordion Expanded Body */}
      {isExpanded && (
        <div className="bg-white border-x border-b border-[#f37820] rounded-b-[5px] p-4 md:p-6 text-[12.5px] md:text-[13px] text-[#333] shadow-xs">
          
          {/* Section 1: Suggested time */}
          <div className="border-b border-gray-200 pb-3 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[14px]">
                <SectionIcon type="clock" />
                <span>Suggested time</span>
                <span className="text-[#555] font-normal">-</span>
                <span className="text-[#3ea824] font-bold text-[14.5px]">{unit.suggestedTime.total}</span>
              </div>
              <label className="flex items-center gap-1.5 text-[12px] text-[#1ba3e1] font-normal cursor-pointer select-none hover:underline">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer"
                />
                <span>Mark Unit as Completed</span>
              </label>
            </div>

            {unit.suggestedTime.breakdown && (
              <div className="mt-2 pl-7 flex flex-wrap gap-x-5 gap-y-1 text-[12px] md:text-[12.5px] text-[#444]">
                {unit.suggestedTime.breakdown.map((item, idx) => (
                  <div key={idx}>
                    {item.label}: <span className="font-bold text-[#222]">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2-Column Responsive Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-start">
            
            {/* Left Column */}
            <div>
              {/* Section 2: Description */}
              <div className="border-b border-gray-200 pb-3 mb-3.5">
                <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-1.5">
                  <SectionIcon type="pencil" />
                  <span>Description</span>
                </div>
                <p className="pl-7 text-[12px] md:text-[12.5px] text-[#444] leading-relaxed">
                  {unit.description}
                </p>
              </div>

              {/* Section 3: Educational Objectives */}
              <div className="border-b border-gray-200 pb-3 mb-3.5">
                <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-1.5">
                  <SectionIcon type="puzzle" />
                  <span>Educational Objectives</span>
                </div>
                <div className="pl-7 text-[12px] md:text-[12.5px] text-[#444] space-y-2">
                  <p className="leading-relaxed">{unit.educationalObjectives.intro}</p>

                  {unit.educationalObjectives.extendedQuestions && (
                    <p className="leading-relaxed">
                      <strong className="text-[#222] font-bold">Extended thinking questions: </strong>
                      {unit.educationalObjectives.extendedQuestions}
                    </p>
                  )}

                  {unit.educationalObjectives.keyObjectives && (
                    <div className="pt-0.5">
                      <p className="font-bold text-[#222] mb-1">Key Learning Objectives:</p>
                      <ul className="space-y-0.5 text-[12px] text-[#555]">
                        {unit.educationalObjectives.keyObjectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Review of Previous Unit */}
              {unit.reviewPreviousUnit && (
                <div className="border-b border-gray-200 pb-3 mb-3.5">
                  <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-1.5">
                    <SectionIcon type="loop" />
                    <span>Review of Previous Unit</span>
                  </div>
                  <p className="pl-7 text-[12px] md:text-[12.5px] text-[#444] leading-relaxed">
                    {unit.reviewPreviousUnit}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div>
              {/* Section 5: Unit Lessons */}
              {unit.unitLessons && unit.unitLessons.length > 0 && (
                <div className="border-b border-gray-200 pb-3 mb-3.5">
                  <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-2">
                    <SectionIcon type="arrow" />
                    <span>Unit Lessons</span>
                  </div>
                  <div className="pl-7 space-y-2">
                    {unit.unitLessons.map((lesson) => (
                      <label
                        key={lesson.id}
                        className="flex items-center gap-2.5 text-[12.5px] cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={!!checkedItems[lesson.id]}
                          onChange={() => toggleItemCheck(lesson.id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer"
                        />
                        <LessonItemIcon type={lesson.type} />
                        <a
                          href={lesson.url}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#1ba3e1] hover:underline font-medium"
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
                <div className="border-b border-gray-200 pb-3 mb-3.5">
                  <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-1.5">
                    <SectionIcon type="easel" />
                    <span>Classroom Materials</span>
                  </div>
                  <div className="pl-7 text-[12px] md:text-[12.5px] text-[#444] space-y-1.5">
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
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!checkedItems[`worksheet-${unit.id}`]}
                            onChange={() => toggleItemCheck(`worksheet-${unit.id}`)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer"
                          />
                          <LessonItemIcon type="document" />
                          <a
                            href={unit.classroomMaterials.worksheet.url}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#1ba3e1] hover:underline font-medium"
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
                <div className="border-b border-gray-200 pb-3 mb-3.5">
                  <div className="flex items-center gap-2 font-bold text-[#1a3821] text-[13.5px] mb-2">
                    <SectionIcon type="check" />
                    <span>Extra Activities</span>
                  </div>
                  <div className="pl-7 space-y-2">
                    {unit.extraActivities.map((act) => (
                      <label
                        key={act.id}
                        className="flex items-center gap-2.5 text-[12.5px] cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={!!checkedItems[act.id]}
                          onChange={() => toggleItemCheck(act.id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-[#1ba3e1] focus:ring-0 cursor-pointer"
                        />
                        <LessonItemIcon type={act.type} />
                        <a
                          href={act.url}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#1ba3e1] hover:underline font-medium"
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
                <div className="text-[12px] text-[#555] pl-7 pt-0.5">
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
