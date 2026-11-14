import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Gamepad2, PlayCircle } from 'lucide-react';
import { udemyCourseMeta } from '../data/udemyCourseData';
import { coursePiecePracticeLessons } from '../data/coursePiecePracticeData';
import { useAuth } from '../components/AuthContext';
import { defaultCourse } from '../courses/courseCatalog';
import { BASICS_UNIT_ID } from '../courses/beginnerSyllabus';
import { Character } from '../kids/Characters';
import { course1Days, findCourse1Section } from './course1Sections';
import './parent.css';

const PIECE_ID = { 1: 'rook', 2: 'bishop', 3: 'queen', 4: 'king', 5: 'pawn', 6: 'knight' };

function Rise({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

export function ParentOverview({ onStartCourse }) {
  const { user, signOut } = useAuth();
  const course = defaultCourse();
  const meta = udemyCourseMeta;
  const basics = findCourse1Section(BASICS_UNIT_ID);
  const practice = (unitId) => coursePiecePracticeLessons.find((l) => l.id === PIECE_ID[unitId]);
  const puzzles = course1Days.reduce((sum, s) => sum + (practice(s.id)?.puzzles.length || 0), 0);
  useEffect(() => { document.title = `Chess Course 1 · ${course.name} | The Thinking Academy`; }, [course.name]);

  return (
    <div className="pp-root pp-overview">
      <header className="pp-top">
        <Link to="/" className="pp-wordmark">The Thinking Academy <span>/ Parents</span></Link>
        <nav aria-label="Parent navigation">
          <Link to="/">Home</Link>
          <Link to="/curriculum" className="is-active">Course</Link>
          <Link to="/pricing">1:1 coaching</Link>
          <Link to="/play">Kids view</Link>
        </nav>
        {user ? <button type="button" className="pp-account" onClick={signOut}>Sign out</button> : <Link to="/login" state={{ from: '/curriculum' }} className="pp-account">Sign in</Link>}
      </header>

      <section className="pp-hero">
        <div className="pp-hero-media" style={{ backgroundImage: 'url(/chess_kid_hero.jpg)' }} aria-hidden="true" />
        <div className="pp-hero-inner">
          <Rise><span className="pp-kicker">Chess Course 1 · Beginner syllabus · Ages {course.ages}</span></Rise>
          <Rise delay={0.05}><h1 className="pp-serif">Meet the<br /><em>pieces</em></h1></Rise>
          <Rise delay={0.1}><p className="pp-hero-sub">Six days, one chess piece a day. A short instructor video, then practice on the board together. No chess experience needed.</p></Rise>
          <Rise delay={0.15}>
            <div className="pp-hero-actions">
              <button type="button" className="pp-btn pp-btn-primary pp-btn-lg" onClick={() => onStartCourse(1)}><PlayCircle size={18} /> Start Day 1</button>
              <Link to="/play" className="pp-btn pp-btn-ghost pp-btn-lg">Open Kids view</Link>
            </div>
          </Rise>
          <Rise delay={0.2}>
            <div className="pp-facts">
              <div><b>{course1Days.length}</b><span>days</span></div>
              <div><b>{puzzles}</b><span>practice puzzles</span></div>
              <div><b>{basics.lectures.length}</b><span>extra basics videos</span></div>
              <div><b>{meta.instructor.name}</b><span>your instructor</span></div>
            </div>
          </Rise>
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-section-head">
          <Rise><span className="pp-kicker">Meet the pieces</span><h2 className="pp-serif">The six days</h2></Rise>
          <Rise delay={0.05}><p>Every day pairs an instructor video with practice on the board. Everything is open, so go at your child’s pace. Your progress is saved.</p></Rise>
        </div>
        <div className="pp-lessons">
          {course1Days.map((section, i) => {
            const piece = practice(section.id);
            const video = section.lectures.find((l) => l.type === 'video');
            return (
              <Rise key={section.id} delay={Math.min(i, 4) * 0.03}>
                <button type="button" className="pp-lesson-row" onClick={() => onStartCourse(section.id, video?.id)}>
                  <span className="pp-row-num">{String(section.day).padStart(2, '0')}</span>
                  <span>
                    <span className="pp-row-title">Day {section.day}: {section.piece}</span>
                    <span className="pp-row-desc">{section.description}</span>
                    <span className="pp-row-tags">
                      <span><PlayCircle size={13} /> Instructor video</span>
                      <span><Gamepad2 size={13} /> {piece?.puzzles.length} puzzles</span>
                    </span>
                  </span>
                  <span className="pp-row-end">{section.suggestedTime?.total}<ArrowRight size={18} className="pp-row-arrow" /></span>
                </button>
              </Rise>
            );
          })}
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-section-head">
          <Rise><span className="pp-kicker">Additional videos</span><h2 className="pp-serif">Chess Basics</h2></Rise>
          <Rise delay={0.05}><p>Watch these any time: before Day 1, or whenever your child is curious about the board itself.</p></Rise>
        </div>
        <div className="pp-lessons">
          {basics.lectures.map((lesson, i) => (
            <Rise key={lesson.id} delay={i * 0.04}>
              <button type="button" className="pp-lesson-row" onClick={() => onStartCourse(BASICS_UNIT_ID, lesson.id)}>
                <span className="pp-row-num">{String.fromCharCode(97 + i)}</span>
                <span>
                  <span className="pp-row-title">{lesson.title}</span>
                  <span className="pp-row-desc">{lesson.description}</span>
                </span>
                <span className="pp-row-end">{lesson.duration}<ArrowRight size={18} className="pp-row-arrow" /></span>
              </button>
            </Rise>
          ))}
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-section-head">
          <Rise><span className="pp-kicker">How it works</span><h2 className="pp-serif">One day, three steps</h2></Rise>
        </div>
        <div className="pp-steps">
          {[
            ['Watch', 'Start the day with the short instructor video. Watch it together, or first on your own.'],
            ['Practise', 'Move to the board. Your child moves the piece to collect the stars while you cheer them on.'],
            ['Talk about it', 'Use the questions and activity in each lesson to turn moves into thinking.'],
          ].map(([title, text], i) => (
            <Rise key={title} delay={i * 0.06}><div className="pp-step"><b>0{i + 1}</b><h3>{title}</h3><p>{text}</p></div></Rise>
          ))}
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-instructor">
          <Rise><div className="pp-instructor-art" style={{ backgroundImage: 'url(/hero-kid.jpg)' }} aria-hidden="true" /></Rise>
          <Rise delay={0.08}>
            <span className="pp-kicker">Your instructor</span>
            <h2 className="pp-serif">{meta.instructor.name}</h2>
            <p className="pp-role">{meta.instructor.title}</p>
            <p className="pp-bio">{meta.instructor.bio}</p>
          </Rise>
        </div>
      </section>

      <section className="pp-section">
        <Rise>
          <div className="pp-kids-band pp-next-band">
            <span className="pp-next-mark" aria-hidden="true">1:1</span>
            <div>
              <span className="pp-kicker">After Course 1</span>
              <h3 className="pp-serif">Want to keep going? Live one-to-one classes.</h3>
              <p>If your child enjoys the course, we’ll arrange a coach for live one-to-one classes.</p>
            </div>
            <Link to="/pricing" className="pp-btn pp-btn-accent pp-btn-lg">Request a 1:1 coach</Link>
          </div>
        </Rise>
      </section>

      <section className="pp-section" style={{ paddingTop: 0 }}>
        <Rise>
          <div className="pp-kids-band">
            <Character id="pawn" mood="wave" size={72} />
            <div>
              <h3 className="pp-serif">Your child’s side: Crown Quest</h3>
              <p>The same six days as a playful adventure for ages {course.ages}: animated lessons, star puzzles and a crew of chess friends.</p>
            </div>
            <Link to="/play" className="pp-btn pp-btn-ghost pp-btn-lg">Open Kids view</Link>
          </div>
        </Rise>
      </section>

      <footer className="pp-foot">The Thinking Academy · Chess as the tool. Thinking as the outcome.</footer>
    </div>
  );
}
