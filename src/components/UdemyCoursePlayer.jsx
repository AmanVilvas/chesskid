import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Tv,
  Share2,
  MoreVertical,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Star,
  FileText,
  Download,
  Calendar,
  Layers,
  Gamepad2,
  ArrowLeft,
  Sparkles,
  Clock
} from 'lucide-react';
import { 
  udemyCourseMeta, 
  udemySections, 
  learningToolsList, 
  courseReviews 
} from '../data/udemyCourseData';

export const UdemyCoursePlayer = ({ 
  initialUnitId = 1, 
  initialLectureId = null,
  onBackToOverview,
  activeSubscription
}) => {
  // Navigation & selection state
  const [activeUnitId, setActiveUnitId] = useState(initialUnitId);
  const currentSection = udemySections.find((s) => s.id === activeUnitId) || udemySections[0];

  const [activeLectureId, setActiveLectureId] = useState(
    initialLectureId || currentSection.lectures[0]?.id || 'u1-l1'
  );

  const activeLecture = 
    currentSection.lectures.find((l) => l.id === activeLectureId) || currentSection.lectures[0];

  // Accordion state for sidebar sections
  const [openSections, setOpenSections] = useState({ [activeUnitId]: true });
  // Sidebar visibility (collapsible with X)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active tab under video
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'notes' | 'announcements' | 'reviews' | 'tools'

  // Completion tracking
  const [completedItems, setCompletedItems] = useState({
    'u1-l1': true,
  });

  // Theater mode toggle
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showProgressMenu, setShowProgressMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Notes state
  const [notes, setNotes] = useState([
    { id: 1, time: '00:45', text: 'Rook moves orthogonal only along ranks and files.', date: 'Just now' },
    { id: 2, time: '02:10', text: 'Ask your child to trace the squares between home and school with a coin.', date: '1 day ago' }
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // YouTube video ID
  const YOUTUBE_VIDEO_ID = 'hiopZjoYfMA';
  const YOUTUBE_START_SEC = 5;

  // Automatically expand active section in sidebar when unit changes
  useEffect(() => {
    setOpenSections((prev) => ({
      ...prev,
      [activeUnitId]: true
    }));
  }, [activeUnitId]);

  // Format mm:ss helper (kept for notes timestamps)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Select a lecture
  const handleSelectLecture = (unitId, lectureId) => {
    setActiveUnitId(unitId);
    setActiveLectureId(lectureId);
  };

  // Toggle checkbox completion
  const toggleComplete = (lectureId, e) => {
    e?.stopPropagation();
    setCompletedItems((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId]
    }));
  };

  // Total course completion percentage
  const allLecturesList = udemySections.flatMap((s) => s.lectures);
  const totalLecturesCount = allLecturesList.length;
  const completedCount = allLecturesList.filter((l) => completedItems[l.id]).length;
  const progressPercent = Math.round((completedCount / totalLecturesCount) * 100);

  // Toggle section collapse in sidebar
  const toggleSidebarSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Add new note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: Date.now(),
      time: '—',
      text: newNoteText.trim(),
      date: 'Just now'
    };
    setNotes([newNote, ...notes]);
    setNewNoteText('');
  };

  return (
    <div className="min-h-screen bg-[#f5f7f0] text-[#1a2e1a] flex flex-col antialiased">
      
      {/* 1. TOP HEADER BAR (Site Forest Green #1a3d1a - matching site theme) */}
      <header className="bg-[#1a3d1a] text-white h-14 border-b border-black/20 flex items-center justify-between px-3 sm:px-6 select-none sticky top-0 z-50 shadow-xs">
        
        {/* Left: Brand + Course Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
            title="Go to Chess With Rathish Home"
          >
            <div className="w-8 h-8 rounded bg-white text-[#1a3d1a] flex items-center justify-center font-black text-lg shadow-sm">
              ♞
            </div>
            <span className="font-black text-sm tracking-tight hidden md:inline">
              Chess With Rathish
            </span>
          </Link>

          <span className="text-white/30 hidden sm:inline">|</span>

          {/* Back to Course Overview Link */}
          <button
            onClick={onBackToOverview}
            className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md transition-colors cursor-pointer flex-shrink-0"
            title="Return to Curriculum Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          {/* Current Lesson Title */}
          <div className="font-medium text-xs sm:text-[13px] text-white/90 truncate pr-2">
            <span className="text-white/60 hidden lg:inline">Lesson Planner: </span>
            <span className="font-bold text-white">{currentSection.unitRawTitle}</span>
          </div>
        </div>

        {/* Right: Progress Dropdown + Share + Menu */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Progress Circular Indicator Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProgressMenu((v) => !v)}
              className="flex items-center gap-2 text-xs font-semibold hover:text-white text-white/90 cursor-pointer bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-md transition-colors"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#489f1f]"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
              <span className="hidden sm:inline">Your progress</span>
              <span className="text-white/60 text-[10px]">▼</span>
            </button>

            {/* Progress Dropdown Card */}
            {showProgressMenu && (
              <div className="absolute right-0 top-11 w-72 bg-white text-[#1a2e1a] rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-[#1a3d1a]">Curriculum Progress</span>
                  <span className="text-xs font-bold text-[#489f1f]">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-[#489f1f] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {completedCount} of {totalLecturesCount} activities completed.
                </p>
                <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-600">Child Certificate:</span>
                  <span className="font-bold text-emerald-700">
                    {progressPercent === 100 ? 'Unlocked ✓' : 'At 100% completion'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={() => alert('Lesson Planner link copied to clipboard!')}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-white/20 hover:border-white/40 text-white/90 hover:text-white transition-colors cursor-pointer"
          >
            <span>Share</span>
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Kebab Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu((v) => !v)}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMoreMenu && (
              <div className="absolute right-0 top-9 w-48 bg-white text-[#1a2e1a] rounded-lg shadow-xl border border-gray-200 py-1.5 z-50 text-xs font-medium">
                <button
                  onClick={() => {
                    setShowSubtitles((s) => !s);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#f0f4e8]"
                >
                  {showSubtitles ? 'Hide Captions' : 'Show Captions'}
                </button>
                <button
                  onClick={() => {
                    window.print();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#f0f4e8]"
                >
                  Print Unit Worksheet
                </button>
                <Link
                  to="/pricing"
                  className="w-full text-left px-3.5 py-2 hover:bg-[#f0f4e8] block text-[#1a3d1a] font-bold"
                >
                  Book 1:1 Live Trial
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* 2. MAIN PLAYER BODY + COLLAPSIBLE COURSE CONTENT SIDEBAR */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT / CENTER: Video Player + Tabs Dashboard */}
        <div className={`flex-1 flex flex-col transition-all ${isTheaterMode ? 'w-full' : ''}`}>
          
          {/* VIDEO PLAYER CONTAINER — YouTube Embed */}
          <div className="relative bg-black w-full overflow-hidden aspect-video max-h-[580px] shadow-inner">
            
            {/* YouTube iframe — fills the container, YouTube provides all controls */}
            <iframe
              key={`${YOUTUBE_VIDEO_ID}-${activeUnitId}-${activeLectureId}`}
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${YOUTUBE_START_SEC}&rel=0&modestbranding=1&color=white`}
              title={activeLecture.title || 'Chess Lesson'}
              className="w-full h-full"
              style={{ border: 'none', display: 'block' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* 3. TABS BAR UNDER VIDEO (Matching Screenshot 1) */}
          <div className="bg-white border-b border-gray-200 px-3 sm:px-6 flex items-center justify-between select-none">
            <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar text-xs sm:text-[13px] font-bold">
              
              {/* Search button */}
              <button 
                onClick={() => setActiveTab('overview')}
                className="text-gray-500 hover:text-[#1a3d1a] py-3.5 cursor-pointer"
                title="Search in course"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#1a3d1a] text-[#1a3d1a]'
                    : 'border-transparent text-gray-600 hover:text-[#1a3d1a]'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3.5 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'border-[#1a3d1a] text-[#1a3d1a]'
                    : 'border-transparent text-gray-600 hover:text-[#1a3d1a]'
                }`}
              >
                <span>Notes</span>
                <span className="text-[10px] bg-[#f0f4e8] text-[#1a3d1a] font-bold px-1.5 py-0.5 rounded-full">
                  {notes.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className={`py-3.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'announcements'
                    ? 'border-[#1a3d1a] text-[#1a3d1a]'
                    : 'border-transparent text-gray-600 hover:text-[#1a3d1a]'
                }`}
              >
                Announcements
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#1a3d1a] text-[#1a3d1a]'
                    : 'border-transparent text-gray-600 hover:text-[#1a3d1a]'
                }`}
              >
                Reviews
              </button>

              <button
                onClick={() => setActiveTab('tools')}
                className={`py-3.5 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'tools'
                    ? 'border-[#1a3d1a] text-[#1a3d1a]'
                    : 'border-transparent text-gray-600 hover:text-[#1a3d1a]'
                }`}
              >
                Learning tools
              </button>

            </div>

            {/* Sidebar toggle button (when sidebar closed) */}
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-xs font-bold text-[#1a3d1a] hover:text-[#2d5a2d] hover:underline flex items-center gap-1.5 cursor-pointer py-2"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Show Course Content</span>
              </button>
            )}
          </div>

          {/* 4. ACTIVE TAB PANEL CONTENT */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-white max-w-5xl overflow-y-auto">
            
            {/* TAB 1: OVERVIEW (Matching Screenshot 1) */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Headline / Pitch matching Screenshot 1 */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#1a3d1a] leading-snug">
                    Master what sits under the hood of chess thinking: spatial reasoning, pattern recognition, and problem solving
                  </h2>

                  {/* Rating & Stats row matching Screenshot 1 */}
                  <div className="flex items-center gap-6 mt-3 text-xs sm:text-sm text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1.5 font-bold text-amber-500">
                      <span>5.0</span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-gray-500 font-normal">({udemyCourseMeta.ratingsCount} parent ratings)</span>
                    </div>

                    <div>
                      <span className="font-bold text-gray-900">{udemyCourseMeta.studentsCount}</span>{' '}
                      <span>Young Thinkers</span>
                    </div>

                    <div>
                      <span className="font-bold text-gray-900">{udemyCourseMeta.totalHours}</span>{' '}
                      <span>Curriculum Length</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Current Unit Spotlight */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase bg-[#d4f0b8] text-[#1a3d1a] px-2.5 py-0.5 rounded-full">
                        Unit {activeUnitId} Focus
                      </span>
                      <h3 className="font-bold text-lg text-gray-900">
                        {currentSection.unitRawTitle}
                      </h3>
                    </div>

                    {currentSection.suggestedTime && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#1a3d1a]" />
                        <span>Suggested time:</span>
                        <strong className="text-emerald-800 font-bold">{currentSection.suggestedTime.total}</strong>
                      </div>
                    )}
                  </div>

                  {/* Unit Description */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {currentSection.description}
                  </p>

                  {/* Educational Objectives */}
                  {currentSection.educationalObjectives && (
                    <div className="bg-[#f7fbf4] border border-[#d6ecd0] rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-black text-[#1a3d1a] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#489f1f]" />
                        <span>Educational Objectives</span>
                      </h4>

                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {currentSection.educationalObjectives.intro}
                      </p>

                      {currentSection.educationalObjectives.extendedQuestions && (
                        <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg text-xs text-amber-950">
                          <strong className="font-bold">Extended Thinking Questions for Parents: </strong>
                          <span>{currentSection.educationalObjectives.extendedQuestions}</span>
                        </div>
                      )}

                      {currentSection.educationalObjectives.keyObjectives && (
                        <div>
                          <div className="text-xs font-bold text-gray-700 mb-1.5">Key Learning Objectives:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {currentSection.educationalObjectives.keyObjectives.map((obj, idx) => (
                              <span
                                key={idx}
                                className="bg-white border border-[#d6ecd0] text-[#1a3d1a] text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                              >
                                ✓ {obj}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Classroom Material & Worksheet */}
                  {currentSection.classroomMaterials && (
                    <div className="border border-[#d4e4c2] bg-[#f0f4e8]/60 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-[#1a3d1a] uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#2d5a2d]" />
                          <span>Classroom Hands-on Activity</span>
                        </h4>
                        <span className="text-[11px] font-bold text-[#1a3d1a]">
                          {currentSection.classroomMaterials.activityName}
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed">
                        {currentSection.classroomMaterials.instructions}
                      </p>

                      {currentSection.classroomMaterials.worksheet && (
                        <div className="pt-2 flex items-center justify-between border-t border-[#d4e4c2] flex-wrap gap-2">
                          <span className="text-xs font-medium text-gray-800">
                            📄 {currentSection.classroomMaterials.worksheet.title}
                          </span>
                          <button
                            onClick={() => window.print()}
                            className="flex items-center gap-1.5 bg-[#1a3d1a] hover:bg-[#2d5a2d] text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Print Worksheet</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review of Previous Unit */}
                  {currentSection.reviewPreviousUnit && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <strong className="text-gray-900 font-semibold">Review of Previous Unit: </strong>
                      {currentSection.reviewPreviousUnit}
                    </div>
                  )}

                  {/* Authors Footer */}
                  {currentSection.authors && (
                    <div className="text-xs text-gray-500 pt-2">
                      Unit Author & Pedagogy: <strong className="text-[#1a3d1a] font-bold">{currentSection.authors}</strong> (with Coach Rathish)
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* TAB 2: NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <form onSubmit={handleAddNote} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-[#f7f9f4]">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Create a note for Unit {activeUnitId} at {formatTime(currentTimeSec)}</span>
                    <button
                      type="button"
                      onClick={() => skip(-5)}
                      className="text-[#1a3d1a] hover:underline"
                    >
                      Jump to time
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Capture an observation about your child's learning, questions they asked, or moves to practice together..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a3d1a] bg-white"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-4 py-2 bg-[#1a3d1a] hover:bg-[#2d5a2d] disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">
                    Parent Learning Notes ({notes.length})
                  </h4>
                  {notes.map((note) => (
                    <div key={note.id} className="border border-gray-200 rounded-xl p-3.5 bg-white space-y-1.5 hover:border-[#1a3d1a]/40 transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold bg-[#f0f4e8] text-[#1a3d1a] px-2 py-0.5 rounded cursor-pointer">
                          {note.time}
                        </span>
                        <span className="text-gray-400 text-[11px]">{note.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="space-y-4">
                  {courseAnnouncements.map((ann) => (
                    <div key={ann.id} className="border border-[#d8e6c8] rounded-xl p-5 bg-white space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1a3d1a] text-white flex items-center justify-center font-bold text-xs">
                            ♘
                          </div>
                          <div>
                            <div className="font-bold text-xs text-gray-900">{ann.author}</div>
                            <div className="text-[11px] text-gray-400">{ann.date}</div>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-[#1a3d1a] pt-1">{ann.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {ann.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center gap-4 bg-[#f7fbf4] border border-[#d6ecd0] p-4 rounded-xl">
                  <div className="text-center pr-4 border-r border-[#d6ecd0]">
                    <div className="text-3xl font-black text-amber-500">5.0</div>
                    <div className="flex text-amber-400 justify-center my-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">Curriculum Rating</div>
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    Based on 148 verified parent evaluations. 100% of parents reported noticeable improvement in their child's patience, focus, and cognitive thinking.
                  </div>
                </div>

                <div className="space-y-3">
                  {courseReviews.map((rev, i) => (
                    <div key={i} className="border border-gray-200 p-4 rounded-xl bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.avatar}
                            alt={rev.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-xs text-gray-900">{rev.name}</div>
                            <div className="text-[10px] text-gray-500">{rev.role}</div>
                          </div>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, s) => (
                            <Star key={s} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 italic leading-relaxed">
                        "{rev.text}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: LEARNING TOOLS */}
            {activeTab === 'tools' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="text-xs font-black text-[#1a3d1a] uppercase tracking-wider mb-2">
                  Printables, Cheat Sheets & Parent Companion Guides
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {learningToolsList.map((tool) => (
                    <div key={tool.id} className="border border-[#d4e4c2] rounded-xl p-4 bg-white flex flex-col justify-between gap-3 shadow-2xs hover:border-[#1a3d1a]/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                          <span className="font-bold text-[#1a3d1a]">{tool.type}</span>
                          <span>{tool.size}</span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#1a3d1a]">{tool.title}</h4>
                        <p className="text-xs text-gray-600 leading-snug">{tool.description}</p>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#f0f4e8] hover:bg-[#e2ebd4] text-[#1a3d1a] font-bold text-xs rounded-lg transition-colors cursor-pointer border border-[#d4e4c2]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download & Print</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT: COLLAPSIBLE COURSE CONTENT SIDEBAR (Matching Screenshot 1) */}
        {sidebarOpen && (
          <aside className="w-full lg:w-88 xl:w-96 bg-white border-l border-gray-200 flex flex-col h-auto lg:h-[calc(100vh-56px)] select-none flex-shrink-0 shadow-2xs">
            
            {/* Sidebar Header */}
            <div className="p-3.5 sm:px-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-20">
              <h3 className="font-black text-sm sm:text-base text-[#1a3d1a]">
                Course content
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                title="Close course content sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Section Accordion List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-200 text-xs sm:text-[13px]">
              {udemySections.map((section) => {
                const isOpen = !!openSections[section.id];
                const sectionCompletedCount = section.lectures.filter((l) => completedItems[l.id]).length;

                return (
                  <div key={section.id} className="bg-white">
                    
                    {/* Section Header Accordion Bar (Matching Screenshot 1) */}
                    <button
                      type="button"
                      onClick={() => toggleSidebarSection(section.id)}
                      className={`w-full p-3.5 text-left transition-colors flex items-center justify-between gap-2 cursor-pointer select-none ${
                        section.id === activeUnitId ? 'bg-[#f7f9f4]' : 'hover:bg-gray-50/70'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="font-bold text-xs sm:text-[13px] text-[#1a3d1a] leading-snug">
                          {section.title}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 font-medium">
                          {sectionCompletedCount} / {section.lecturesCount} | {section.totalMinutes}min
                        </div>
                      </div>

                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#1a3d1a] flex-shrink-0" strokeWidth={2.5} />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" strokeWidth={2.5} />
                      )}
                    </button>

                    {/* Section Lectures List */}
                    {isOpen && (
                      <div className="bg-white divide-y divide-gray-100">
                        {section.lectures.map((lecture) => {
                          const isCurrent = activeLectureId === lecture.id;
                          const isDone = !!completedItems[lecture.id];

                          return (
                            <div
                              key={lecture.id}
                              onClick={() => handleSelectLecture(section.id, lecture.id)}
                              className={`px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer select-none group ${
                                isCurrent
                                  ? 'bg-[#e8f0e0] text-[#1a3d1a] font-bold border-l-4 border-[#1a3d1a]' // Site theme active highlight!
                                  : 'hover:bg-gray-50 text-gray-800'
                              }`}
                            >
                              {/* Checkbox (interactive) */}
                              <div
                                onClick={(e) => toggleComplete(lecture.id, e)}
                                className={`w-4 h-4 mt-0.5 rounded-xs border flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors ${
                                  isDone
                                    ? 'bg-[#1a3d1a] border-[#1a3d1a] text-white'
                                    : 'border-gray-400 bg-white hover:border-gray-600'
                                }`}
                                title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                              >
                                {isDone && <Check className="w-3 h-3" strokeWidth={3.5} />}
                              </div>

                              {/* Title & Metadata */}
                              <div className="flex-1 min-w-0">
                                <div className="leading-snug text-xs sm:text-[12.5px]">
                                  {lecture.title}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                                  {lecture.type === 'video' ? (
                                    <Tv className="w-3 h-3 text-[#1a3d1a]" />
                                  ) : lecture.type === 'game' ? (
                                    <Gamepad2 className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <FileText className="w-3 h-3 text-sky-600" />
                                  )}
                                  <span>{lecture.duration}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </aside>
        )}

      </div>

    </div>
  );
};
