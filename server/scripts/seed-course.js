import 'dotenv/config';
import pg from 'pg';
import { unitsData } from '../../src/data/unitsData.js';
import { coursePiecePracticeLessons } from '../../src/data/coursePiecePracticeData.js';
import { BASICS_LESSONS, BASICS_UNIT_ID } from '../../src/courses/beginnerSyllabus.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : false });
const courseId = 'f8225160-5f1c-4b51-91ac-a642136dd909';
const priceMinor = Number(process.env.BEGINNER_COURSE_PRICE_PAISE ?? process.env.BEGINNER_COURSE_PRICE_MINOR ?? 0);
const currency = 'INR';

function seconds(duration) {
  const amount = Number.parseInt(duration, 10);
  return Number.isFinite(amount) ? amount * (String(duration).toLowerCase().includes('min') ? 60 : 1) : 0;
}

function makeLesson(unit, position, source, kind, content = {}) {
  return {
    id: source.id,
    unit: unit.id,
    position,
    title: source.title,
    kind,
    duration: seconds(source.duration || source.durationSec || 0),
    content,
  };
}

const lessons = [];
const piecePracticeByUnit = new Map([[1, 'rook'], [2, 'bishop'], [3, 'queen'], [4, 'king'], [5, 'pawn'], [6, 'knight']]);
for (const unit of unitsData) {
  let position = 1;
  const core = unit.unitLessons || [];
  if (core[0]) lessons.push(makeLesson(unit, position++, core[0], 'video', { description: unit.description, objectives: unit.educationalObjectives || null }));
  if (core[1]) lessons.push(makeLesson(unit, position++, core[1], core[1].type === 'game' ? 'game' : 'video', {
    practiceRoute: `/curriculum?view=player&unit=${unit.id}&lecture=${encodeURIComponent(core[1].id)}${unit.id <= 6 ? '&puzzle=1' : ''}`,
    exercises: coursePiecePracticeLessons.find((piece) => piece.id === piecePracticeByUnit.get(unit.id))?.puzzles?.length || 0,
  }));
  if (unit.classroomMaterials) {
    lessons.push(makeLesson(unit, position++, { id: `u${unit.id}-act`, title: `Activity: ${unit.classroomMaterials.activityName}`, duration: '3min' }, 'activity', {
      instructions: unit.classroomMaterials.instructions,
      objectives: unit.educationalObjectives || null,
    }));
    if (unit.classroomMaterials.worksheet) {
      lessons.push(makeLesson(unit, position++, { id: `u${unit.id}-ws`, title: unit.classroomMaterials.worksheet.title, duration: '2min' }, 'resource', { availability: 'not-configured' }));
    }
  }
  for (const extra of unit.extraActivities || []) {
    const kind = extra.type === 'document' ? 'resource' : extra.type === 'game' ? 'game' : extra.type === 'video' ? 'video' : 'activity';
    lessons.push(makeLesson(unit, position++, extra, kind, { availability: extra.url && extra.url !== '#' ? 'linked' : 'not-configured' }));
  }
}

// Course 1 "Additional videos — Chess Basics" (instructor videos; upload them in the academy studio).
BASICS_LESSONS.forEach((lesson, index) => {
  lessons.push(makeLesson({ id: BASICS_UNIT_ID }, index + 1, lesson, 'video', { description: lesson.description, section: 'Chess Basics' }));
});

if (!Number.isSafeInteger(priceMinor) || priceMinor < 0 || (process.env.BEGINNER_COURSE_CURRENCY && process.env.BEGINNER_COURSE_CURRENCY.toUpperCase() !== 'INR')) {
  throw new Error('Course price/currency configuration is invalid');
}

try {
  await pool.query('BEGIN');
  await pool.query(
    `INSERT INTO courses (id, slug, title, description, price_minor, currency, published)
     VALUES ($1, $2, $3, $4, $5, $6, TRUE)
     ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description,
       price_minor = EXCLUDED.price_minor, currency = EXCLUDED.currency, published = TRUE, updated_at = NOW()`,
    [courseId, 'beginner-chess', 'Beginner Chess: The Thinking Academy', 'An 11-unit chess course with interactive piece practice, activities, and learning resources.', priceMinor, currency],
  );
  for (const lesson of lessons) {
    await pool.query(
      `INSERT INTO lessons (id, course_id, unit_number, position, title, kind, duration_seconds, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
       ON CONFLICT (id) DO UPDATE SET course_id = EXCLUDED.course_id, unit_number = EXCLUDED.unit_number,
         position = EXCLUDED.position, title = EXCLUDED.title, kind = EXCLUDED.kind,
         duration_seconds = EXCLUDED.duration_seconds, content = EXCLUDED.content, updated_at = NOW()`,
      [lesson.id, courseId, lesson.unit, lesson.position, lesson.title, lesson.kind, lesson.duration, JSON.stringify(lesson.content)],
    );
  }
  await pool.query('COMMIT');
  console.info(`Seeded course catalog metadata and ${lessons.length} lessons. Media/resource files remain unavailable until configured.`);
} catch (error) {
  await pool.query('ROLLBACK').catch(() => {});
  console.error('Course seed failed. No lesson content was partially committed.');
  if (process.env.NODE_ENV !== 'production') console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
