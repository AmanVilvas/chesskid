import { coursePiecePracticeLessons } from '../data/coursePiecePracticeData.js';
import { BASICS_LESSONS, COURSE1_DAYS } from './beginnerSyllabus.js';

// Every course on the site has its own landing page, built from its entry here.
// To add a course: add an entry with its own copy, theme, kids-world path and (optional) API slug.
const beginnerPuzzles = coursePiecePracticeLessons.reduce((sum, lesson) => sum + lesson.puzzles.length, 0);
const PIECE = { 1: 'Rook', 2: 'Bishop', 3: 'Queen', 4: 'King', 5: 'Pawn', 6: 'Knight' };

export const courses = {
  'beginner-chess': {
    slug: 'beginner-chess',
    apiSlug: 'beginner-chess', // course record in the API (enrollment, lessons, progress)
    level: 'Beginner',
    name: 'Beginner Chess',
    courseNumber: 1,
    ages: '4–6',
    world: 'Crown Quest', // the kids adventure for this course
    playPath: '/play',
    theme: { color: '#3EC46D', deep: '#2A9D52' },
    facts: [
      { value: COURSE1_DAYS.length, label: 'days, one piece a day' },
      { value: beginnerPuzzles, label: 'mini games' },
      { value: BASICS_LESSONS.length, label: 'chess basics videos' },
      { value: 6, label: 'crew friends to meet' },
    ],
    landing: {
      heroTitle: 'The most fun way for little ones to start chess!',
      heroNote: 'Our Beginner course for ages 4–6, played side by side with a grown-up.',
      play: { title: 'learn by playing.', text: 'Every lesson ends in a game. Move the piece, catch the stars and hear a cheer. Go on, try one right here!' },
      climb: { title: 'climb crown mountain.', text: `${COURSE1_DAYS.length} days, one chess piece a day, from Rook Castle all the way to Crown Summit. Pip the pawn walks the trail with your child, and every world has a treasure chest to open.` },
      three: { title: 'watch. play. print.', text: 'Three ways to learn in every world of the Beginner course.' },
      crew: { title: 'collect the whole crew.', text: 'Finish a world and open its chest to meet a new friend. Little steps, big smiles, and no pressure to rush.' },
      grownups: { title: 'made for grown-ups too.', text: "No chess experience needed. The Beginner lesson planner gives you each unit's goals, activities and discussion ideas, so you can learn side by side." },
      cta: 'start the climb today.',
      learns: [...COURSE1_DAYS.map((id, i) => `Day ${i + 1}: ${PIECE[id]}`), ...BASICS_LESSONS.map((lesson) => `Bonus: ${lesson.title}`)],
    },
  },
};

export const DEFAULT_COURSE = 'beginner-chess';
export const findCourse = (slug) => courses[slug] || null;
export const defaultCourse = () => courses[DEFAULT_COURSE];
