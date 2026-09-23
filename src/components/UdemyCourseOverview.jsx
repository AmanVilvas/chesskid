import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Play, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Tv, 
  Award, 
  Smartphone, 
  Clock, 
  Globe, 
  Gamepad2,
  Calendar,
  Layers,
  ArrowRight,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { Navbar } from './Navbar';
import { udemyCourseMeta, udemySections, courseReviews } from '../data/udemyCourseData';

export const UdemyCourseOverview = ({ onStartCourse, onSelectLecture }) => {
  const [expandedSections, setExpandedSections] = useState({ 1: true });

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all = {};
    udemySections.forEach((s) => { all[s.id] = true; });
    setExpandedSections(all);
  };

  const collapseAll = () => setExpandedSections({});
  const allExpanded = Object.keys(expandedSections).length === udemySections.length;

  return (
    <div className="min-h-screen bg-[#edf3f8] text-[#333] antialiased" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      {/* Hero Banner — same dark green as rest of site */}
      <div className="bg-[#1a3d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 font-medium mb-4 flex-wrap">
            <Link to="/" className="hover:text-white/90 transition-colors font-semibold text-white/80">Home</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/60">Chess With Rathish</span>
            <span className="text-white/30">/</span>
            <span className="text-white font-semibold">Lesson Planner — Beginner</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Title & Meta */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#d4f0b8] text-[#1a3d1a] font-extrabold text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full">
                  Curriculum Guide
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  Ages 4–6 Only
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                Lesson Planner – Beginner Level
              </h1>
              <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed max-w-2xl">
                A step-by-step 11-unit curriculum designed for curious minds aged 4–6. Small moves. Big thinking.
              </p>

              <div className="flex items-center gap-3 flex-wrap text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 font-bold text-[#ffe066]">
                  <span className="text-base font-black">5.0</span>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <a href="#reviews" className="text-white/70 hover:text-white transition-colors text-xs">
                  (148 parent reviews)
                </a>
                <span className="text-white/30">•</span>
                <span className="text-white/80 font-medium">320 young thinkers coached</span>
              </div>

              <div className="text-xs text-white/70 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Updated {udemyCourseMeta.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#1a3d1a] font-mono text-[10px] bg-white/90 px-1 rounded">CC</span>
                  <span>English Subtitles</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={() => onStartCourse(1, 'u1-l1')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-emerald-50 text-[#1a3d1a] font-extrabold text-sm rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-[#1a3d1a]" />
                  <span>Open Lesson Player</span>
                </button>
                <Link
                  to="/pricing"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-lg border border-white/20 transition-colors cursor-pointer"
                >
                  <span>Book a 1:1 Trial →</span>
                </Link>
              </div>
            </div>

            {/* Right: Video preview card — clean, no pricing */}
            <div className="hidden lg:block lg:col-span-4">
              <div
                onClick={() => onStartCourse(1, 'u1-l1')}
                className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl cursor-pointer group aspect-video"
              >
                <img
                  src="/chess_kid_hero.jpg"
                  alt="Lesson Preview"
                  className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-70 transition-opacity"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white text-[#1a3d1a] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                  <span className="mt-2.5 text-xs font-black text-white uppercase tracking-wider drop-shadow">
                    Watch Lesson Preview
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] font-mono px-1.5 py-0.5 rounded">
                  5:00
                </div>
              </div>

              {/* Simple includes checklist — no price/coupon */}
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 space-y-2">
                <div className="text-xs font-black text-white uppercase tracking-wider mb-2">This curriculum includes:</div>
                {[
                  { icon: Tv, text: "2.8 hours of guided lesson content" },
                  { icon: FileText, text: "22 printable worksheets" },
                  { icon: Gamepad2, text: "11 mini-games & board drills" },
                  { icon: BookOpen, text: "Parent teaching scripts" },
                  { icon: Award, text: "Child completion certificate" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-white/80">
                    <Icon className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl space-y-8">

          {/* What your child will learn */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs">
            <h2 className="text-lg sm:text-xl font-black text-[#1a3d1a] mb-4 flex items-center gap-2">
              <span>💡</span>
              <span>What your child will learn</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
              {udemyCourseMeta.whatYoullLearn.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-gray-700 leading-snug">
                  <span className="w-4 h-4 rounded-full bg-[#1a3d1a] text-white flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related thinking topics */}
          <div>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Core Thinking Skills</div>
            <div className="flex flex-wrap gap-2">
              {udemyCourseMeta.exploreTopics.map((topic, i) => (
                <span key={i} className="px-3 py-1.5 bg-white text-[#1a3d1a] text-xs font-bold rounded-full border border-gray-200 hover:border-[#4a7c4a] hover:bg-[#f0f4e8] cursor-pointer transition-colors">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Curriculum accordion */}
          <div id="course-content">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#1a3d1a]">Course Content</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {udemySections.length} units • {udemyCourseMeta.totalLectures} lessons & activities • {udemyCourseMeta.totalHours} total
                </p>
              </div>
              <button
                onClick={allExpanded ? collapseAll : expandAll}
                className="text-xs font-bold text-[#1a3d1a] hover:underline cursor-pointer bg-[#f0f4e8] px-3 py-1.5 rounded-lg border border-gray-200"
              >
                {allExpanded ? 'Collapse all' : 'Expand all'}
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs divide-y divide-gray-100">
              {udemySections.map((section) => {
                const isExpanded = !!expandedSections[section.id];
                return (
                  <div key={section.id}>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors cursor-pointer ${
                        isExpanded ? 'bg-[#f7f9f4]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-[#1a3d1a] flex-shrink-0" strokeWidth={2.5} />
                          : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={2.5} />
                        }
                        <span className={`font-bold text-sm truncate ${isExpanded ? 'text-[#1a3d1a]' : 'text-gray-900'}`}>
                          {section.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap font-medium flex-shrink-0">
                        {section.lecturesCount} items • {section.totalMinutes}min
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="bg-white divide-y divide-gray-50">
                        {section.lectures.map((lecture) => (
                          <div
                            key={lecture.id}
                            className="px-5 py-3 flex items-center justify-between hover:bg-[#f7f9f4] transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              {lecture.type === 'video' && <Play className="w-3.5 h-3.5 text-[#4a7c4a] flex-shrink-0" />}
                              {lecture.type === 'game' && <Gamepad2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                              {lecture.type !== 'video' && lecture.type !== 'game' && <FileText className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />}
                              <button
                                type="button"
                                onClick={() => onSelectLecture(section.id, lecture.id)}
                                className="text-xs sm:text-[13px] font-medium text-gray-800 group-hover:text-[#1a3d1a] hover:underline text-left truncate cursor-pointer"
                              >
                                {lecture.title}
                              </button>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              {lecture.previewable && (
                                <button
                                  onClick={() => onSelectLecture(section.id, lecture.id)}
                                  className="text-[11px] font-bold text-[#1a3d1a] bg-[#f0f4e8] hover:bg-[#e4edd6] px-2 py-0.5 rounded transition-colors cursor-pointer"
                                >
                                  Preview
                                </button>
                              )}
                              <span className="text-xs text-gray-400 font-mono">{lecture.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirements */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-base font-black text-[#1a3d1a] mb-2.5">Prerequisites</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {udemyCourseMeta.requirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
          </div>

          {/* About */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-base font-black text-[#1a3d1a] mb-2.5">About this Curriculum</h2>
            <div className="space-y-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {udemyCourseMeta.descriptionParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          {/* Instructor */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-base font-black text-[#1a3d1a] mb-3">Curriculum Authors</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1a3d1a] text-white text-2xl font-black flex items-center justify-center flex-shrink-0 shadow-md">
                ♘
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-black text-sm text-[#1a3d1a]">{udemyCourseMeta.instructor.name}</h3>
                <p className="text-xs text-gray-500">{udemyCourseMeta.instructor.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap pt-1">
                  <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /><span className="font-bold">5.0 Rating</span></div>
                  <span>148 Parent Reviews</span>
                  <span>320+ Children Coached</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">{udemyCourseMeta.instructor.bio}</p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div id="reviews" className="border-t border-gray-200 pt-6">
            <h2 className="text-base font-black text-[#1a3d1a] mb-3">Parent Feedback</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courseReviews.slice(0, 4).map((rev, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={rev.avatar} alt={rev.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-xs text-gray-900">{rev.name}</div>
                        <div className="text-[11px] text-gray-500">{rev.role}</div>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 italic leading-relaxed">"{rev.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA banner */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-[#1a3d1a]/10 to-amber-500/10 border border-[#1a3d1a]/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#1a3d1a] flex items-center justify-center text-white text-2xl flex-shrink-0">♞</div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-gray-900">Ready to start guided 1:1 chess for your child?</h4>
                <p className="text-xs text-gray-600 mt-0.5">24 structured live sessions for kids aged 4–6 with Coach Rathish.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onStartCourse(1, 'u1-l1')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border-2 border-[#1a3d1a] text-[#1a3d1a] font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer hover:bg-[#f0f4e8]"
              >
                <Play className="w-3.5 h-3.5 fill-[#1a3d1a]" />
                Open Player
              </button>
              <Link
                to="/pricing"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#1a3d1a] hover:bg-[#2d5a2d] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Book a 1:1 Trial →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer — same as rest of site */}
      <footer className="bg-[#1a3d1a] text-white/80 py-5 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>© Chess With Rathish — All Rights Reserved. I don't teach chess, I teach thinking.</p>
        </div>
      </footer>
    </div>
  );
};
