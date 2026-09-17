import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "./Navbar";

const lessons = [
  { id: 1, title: "Meet the Chessboard", subtitle: "Rows, columns and squares" },
  { id: 2, title: "Meet the Rook", subtitle: "Straight lines, strong moves" },
  { id: 3, title: "Meet the Bishop", subtitle: "Diagonal moves, same colour" },
  { id: 4, title: "Meet the Queen", subtitle: "Most powerful piece" },
  { id: 5, title: "Meet the King", subtitle: "Staying safe" },
  { id: 6, title: "Meet the Pawn", subtitle: "Small steps, big ideas" },
  { id: 7, title: "Meet the Knight", subtitle: "L-shaped moves" },
  { id: 8, title: "Check!", subtitle: "Attacking the king" },
  { id: 9, title: "Checkmate!", subtitle: "Finish the game" },
];

const lessonDetails = {
  3: {
    label: "Lesson 3 of 24",
    title: "Meet the Bishop!",
    description: "Today we learn how the bishop moves and explore the magic of diagonal lines.",
    learns: [
      "How the bishop moves diagonally",
      "That a bishop always stays on the same colour",
      "How to find all possible moves",
    ],
    classDo: [
      "Explore the bishop's movement on a real board",
      "Find the correct squares together",
      "Solve a fun bishop puzzle",
      "Play a short, guided game",
    ],
    question: '"Can these two bishops ever meet?"',
    questionSub: "Let your child think, explore and share their ideas.",
    thinkingSkill: "Pattern Recognition",
    thinkingDesc:
      "We help children notice patterns and see what stays the same. This builds observation and logical thinking.",
    homeActivity:
      "Can you place the bishop on different squares and find all the diagonal paths? Try it with two bishops of the same colour!",
  },
};

function MiniBishopBoard() {
  const size = 8;
  const bishopRow = 3;
  const bishopCol = 4;
  const isDiag = (r, c) => {
    const dr = Math.abs(r - bishopRow);
    const dc = Math.abs(c - bishopCol);
    return dr === dc && dr > 0;
  };
  return (
    <div
      className="inline-grid border-2 border-[#2d6a2d] rounded overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => {
          const isLight = (r + c) % 2 === 0;
          const isBishop = r === bishopRow && c === bishopCol;
          const diag = isDiag(r, c);
          let bg = isLight ? "#f0d9b5" : "#b58863";
          if (diag) bg = "#a8d56b";
          if (isBishop) bg = "#2d6a2d";
          return (
            <div
              key={`${r}-${c}`}
              style={{ width: 32, height: 32, background: bg }}
              className="flex items-center justify-center"
            >
              {isBishop && <span className="text-white text-lg leading-none">♝</span>}
            </div>
          );
        })
      )}
    </div>
  );
}

export function LandingPage() {
  const [activeLessonId, setActiveLessonId] = useState(3);
  const lesson = lessonDetails[activeLessonId] || lessonDetails[3];
  const currentIdx = lessons.findIndex((l) => l.id === activeLessonId);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;
  const handleNav = (id) => setActiveLessonId(lessonDetails[id] ? id : 3);

  return (
    <div className="min-h-screen bg-[#f5f7f0] text-[#1a2e1a]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="bg-[#f0f4e8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#4a7c4a] mb-3">For Children Aged 4–6</p>
              <h1 className="text-4xl sm:text-5xl font-black text-[#1a2e1a] leading-[1.1] mb-4">
                Small moves.<br />Big thinking.
              </h1>
              <p className="text-[15px] text-gray-600 leading-relaxed mb-7 max-w-[420px]">
                A structured 1:1 chess program designed for curious minds aged 4–6. Through fun, play and guided discovery, we use chess to build focus, confidence and the thinking skills that last a lifetime.
              </p>
              <div className="flex flex-wrap gap-6 sm:gap-8">
                {[
                  { label: "1:1 Online Classes", sub: "(30 minutes)", icon: "👤" },
                  { label: "24 Structured", sub: "Sessions", icon: "📅" },
                  { label: "Age 4–6", sub: "Only", icon: "👨‍👩‍👧" },
                ].map(({ label, sub, icon }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#1a3d1a]/10 flex items-center justify-center text-lg">{icon}</div>
                    <div>
                      <div className="text-[13px] font-bold text-[#1a2e1a]">{label}</div>
                      <div className="text-[11px] text-gray-500">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo + sticky notes */}
            <div className="relative flex justify-center lg:justify-end">
              <div
                className="absolute top-4 left-0 sm:left-4 lg:-left-6 z-10"
                style={{ transform: "rotate(-3deg)" }}
              >
                <div className="bg-white/90 border border-gray-100 rounded shadow-md px-3 py-2 max-w-[130px] text-[#2d5a2d]"
                  style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: 14, lineHeight: 1.4 }}>
                  Curious Kids 👑<br />Brighter<br />Tomorrows
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-xl w-full max-w-[380px] lg:max-w-[420px]" style={{ aspectRatio: "3/4" }}>
                <img src="/chess_kid_hero.jpg" alt="Curious child with chess board" className="w-full h-full object-cover object-top" />
              </div>

              <div
                className="absolute bottom-10 -right-2 sm:right-0 lg:-right-4 z-10"
                style={{ transform: "rotate(3deg)" }}
              >
                <div className="bg-[#d4f0b8] shadow-md rounded px-4 py-3 max-w-[160px] text-[#1a3d1a]"
                  style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: 14, lineHeight: 1.5 }}>
                  Chess is the tool.<br />Thinking is<br />the outcome.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM + LESSON DETAIL */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">

            {/* LEFT: Lesson List */}
            <div>
              <h2 className="text-xl font-black text-[#1a2e1a] mb-1">Our 24-Class Journey</h2>
              <p className="text-[12.5px] text-gray-500 mb-4">A simple, step-by-step path designed for ages 4–6.</p>
              <div className="space-y-1.5">
                {lessons.map((l) => {
                  const isActive = l.id === activeLessonId;
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleNav(l.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                        isActive ? "bg-[#1a3d1a] text-white shadow-md" : "bg-[#f5f7f0] hover:bg-[#e8f0e0] text-[#1a2e1a]"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold border ${
                        isActive ? "bg-white/20 border-white/40 text-white" : "border-gray-300 text-gray-500 bg-white"
                      }`}>
                        {String(l.id).padStart(2, "0")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-[13px] leading-tight ${isActive ? "text-white" : "text-[#1a2e1a]"}`}>{l.title}</div>
                        <div className={`text-[11px] mt-0.5 ${isActive ? "text-white/75" : "text-gray-500"}`}>{l.subtitle}</div>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4 text-white/80 flex-shrink-0" />}
                    </button>
                  );
                })}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-[#f5f7f0]">
                  <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold border border-gray-300 bg-white text-gray-400">•••</span>
                  <div>
                    <div className="font-bold text-[12.5px] text-gray-500">And 15 more exciting lessons!</div>
                    <div className="text-[11px] text-gray-400">From piece play to simple strategies.</div>
                  </div>
                </div>
              </div>

              {/* View Full Curriculum Link */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Link
                  to="/curriculum"
                  className="flex items-center justify-between text-xs font-bold text-[#1a3d1a] hover:text-[#2d5a2d] bg-[#f0f4e8] hover:bg-[#e4edd6] p-3 rounded-lg transition-colors group"
                >
                  <span>View Full Written Curriculum (11 Units)</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* RIGHT: Lesson Detail */}
            <div>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                <div>
                  <div className="text-[12px] font-semibold text-[#4a7c4a] uppercase tracking-widest mb-0.5">{lesson.label}</div>
                  <h3 className="text-3xl sm:text-4xl font-black text-[#1a2e1a]">{lesson.title}</h3>
                  <p className="text-[14px] text-gray-500 mt-1">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => prevLesson && handleNav(prevLesson.id)}
                    disabled={!prevLesson}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-300 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={() => nextLesson && handleNav(nextLesson.id)}
                    disabled={!nextLesson}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a3d1a] text-white text-[13px] font-semibold hover:bg-[#2d5a2d] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* What Your Child Learns */}
                <div className="bg-[#f5f7f0] rounded-xl p-4 border border-[#e0ead0]">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl flex-shrink-0">♝</span>
                    <h4 className="font-bold text-[15px] text-[#1a2e1a]">What Your Child Learns</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {lesson.learns.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c4a] flex-shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Thinking Skill */}
                <div className="bg-[#fffbea] rounded-xl p-4 border border-[#f0e0a0]">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl flex-shrink-0">💡</span>
                    <div>
                      <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Thinking Skill</div>
                      <h4 className="font-bold text-[15px] text-[#1a2e1a]">{lesson.thinkingSkill}</h4>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{lesson.thinkingDesc}</p>
                </div>

                {/* What We Do in Class */}
                <div className="bg-[#fef5f0] rounded-xl p-4 border border-[#f5d0c0]">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl flex-shrink-0">🎮</span>
                    <h4 className="font-bold text-[15px] text-[#1a2e1a]">What We Do in Class</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {lesson.classDo.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-[#1a3d1a] flex-shrink-0 flex items-center justify-center mt-0.5">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Try This at Home */}
                <div className="bg-[#edf4ff] rounded-xl p-4 border border-[#c8deff] relative">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl flex-shrink-0">🏠</span>
                    <h4 className="font-bold text-[15px] text-[#1a2e1a]">Try This at Home</h4>
                  </div>
                  <p className="text-[13px] text-gray-600 leading-relaxed">{lesson.homeActivity}</p>
                  <span className="absolute bottom-3 right-3 text-xl opacity-30">✏️</span>
                </div>
              </div>

              {/* A Question We Ask */}
              <div className="bg-[#f5f7f0] rounded-xl p-4 border border-[#e0ead0] mb-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl flex-shrink-0">💬</span>
                  <h4 className="font-bold text-[15px] text-[#1a2e1a]">A Question We Ask</h4>
                </div>
                <div className="bg-[#fffbe6] border border-[#f0d060] rounded-lg px-4 py-3 text-[14px] font-semibold text-[#1a2e1a] italic mb-2">
                  {lesson.question}
                </div>
                <p className="text-[12.5px] text-gray-500">{lesson.questionSub}</p>
              </div>

              {/* Sample Activity */}
              <div>
                <h4 className="font-bold text-[14px] text-[#1a2e1a] mb-3">Sample Activity</h4>
                <div className="flex items-start gap-5 flex-wrap">
                  <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
                    <MiniBishopBoard />
                  </div>
                  <div style={{ transform: "rotate(2deg)", fontFamily: "'Caveat', cursive, sans-serif", fontSize: 16, color: "#1a3d1a", maxWidth: 140, lineHeight: 1.5 }}
                    className="bg-[#d4f0b8] shadow-sm rounded px-4 py-3 mt-2">
                    Diagonals<br />only! ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="bg-[#f0f4e8] border-t border-[#d8e8c0] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1a3d1a] flex items-center justify-center text-2xl flex-shrink-0">🌱</div>
            <div>
              <h4 className="font-black text-[16px] text-[#1a2e1a]">Give your child the gift of thinking.</h4>
              <p className="text-[13px] text-gray-500">Book a 1:1 trial class and see how chess can help them grow.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/pricing"
              className="flex items-center gap-2 bg-[#1a3d1a] hover:bg-[#2d5a2d] text-white font-bold text-[14px] px-6 py-3 rounded-lg transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              Book a 1:1 Trial →
            </Link>
            <div
              className="hidden sm:block"
              style={{ transform: "rotate(2deg)", fontFamily: "'Caveat', cursive, sans-serif", fontSize: 14, color: "#2d5a2d", lineHeight: 1.5, maxWidth: 120 }}
            >
              Better<br />Thinkers<br />Brighter Futures ✨
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
