import { udemySections } from '../data/udemyCourseData';
import { BASICS_LESSONS, BASICS_UNIT_ID, COURSE1_DAYS, dayOfUnit } from '../courses/beginnerSyllabus';

const PIECE_NAME = { 1: 'Rook', 2: 'Bishop', 3: 'Queen', 4: 'King', 5: 'Pawn', 6: 'Knight' };

/** Chess Course 1 as the parent player shows it: Day 1–6, then the Chess Basics extras. */
export const course1Sections = [
  ...COURSE1_DAYS.map((id) => {
    const section = udemySections.find((s) => s.id === id);
    const day = dayOfUnit(id);
    return { ...section, day, label: `Day ${day}`, piece: PIECE_NAME[id], heading: `Day ${day}: ${PIECE_NAME[id]}` };
  }),
  {
    id: BASICS_UNIT_ID,
    day: null,
    label: 'Chess Basics',
    heading: 'Chess Basics',
    unitRawTitle: 'Chess Basics',
    description: 'Three short additional videos: the chessboard, how squares are named, and how a game of chess is played.',
    lectures: BASICS_LESSONS.map((lesson) => ({ ...lesson, type: 'video' })),
  },
];

export const course1Days = course1Sections.filter((section) => section.day);
export const findCourse1Section = (id) => course1Sections.find((s) => s.id === Number(id));
