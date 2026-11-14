import { unitsData } from '../data/unitsData.js';
import { coursePiecePracticeLessons } from '../data/coursePiecePracticeData.js';
import { COURSE1_DAYS } from '../courses/beginnerSyllabus.js';

// Kids World maps the existing 11-unit curriculum onto stops on "Crown Mountain".
// Unit ids, lesson ids (u{n}-l1 / u{n}-l2) and puzzle data are reused unchanged.
const worldArt = {
  1: { crew: 'rook', name: 'Rook Castle', region: 'Rook Castle', piece: 'r', color: '#FF6B6B', deep: '#D94B4B', badge: null },
  2: { crew: 'bishop', name: 'Bishop Forest', region: 'Bishop Forest', piece: 'b', color: '#9B7BF7', deep: '#7A5BDB', badge: null },
  3: { crew: 'queen', name: 'Queen Palace', region: 'Queen Palace', piece: 'q', color: '#FF7EB6', deep: '#DE5C98', badge: null },
  4: { crew: 'king', name: "King's Keep", region: "King's Kingdom", piece: 'k', color: '#33C481', deep: '#22A066', badge: null },
  5: { crew: 'pawn', name: 'Pawn Village', region: 'Pawn Village', piece: 'p', color: '#FF9F43', deep: '#DB7E1F', badge: null },
  6: { crew: 'knight', name: 'Knight Mountains', region: 'Knight Mountains', piece: 'n', color: '#2DA8F0', deep: '#1886C7', badge: null },
  7: { crew: 'king', badge2: 'Check Spotter', name: 'Check Tower', region: "King's Kingdom", piece: 'k', color: '#18B6A8', deep: '#0E9184', badge: 'check' },
  8: { crew: 'rook', badge2: 'Checkmate Hero', name: 'Checkmate Gate', region: "King's Kingdom", piece: 'k', color: '#FF7A45', deep: '#D9582A', badge: 'mate' },
  9: { crew: 'queen', badge2: 'Trap Dodger', name: 'Stalemate Bridge', region: 'Grand Arena', piece: 'k', color: '#6C7CF5', deep: '#4D5DD6', badge: 'draw' },
  10: { crew: 'knight', badge2: 'Team Captain', name: 'Teamwork Camp', region: 'Grand Arena', piece: 'q', color: '#C06CF2', deep: '#9B4CD1', badge: 'team' },
  11: { crew: 'pawn', badge2: 'Crown Climber', name: 'Crown Summit', region: 'Grand Arena', piece: 'q', color: '#FFB020', deep: '#D98C00', badge: 'crown' },
};

// Practice exercises exist for the six piece units (same mapping as the course player).
const piecePracticeByUnit = { 1: 'rook', 2: 'bishop', 3: 'queen', 4: 'king', 5: 'pawn', 6: 'knight' };

const kidGoals = {
  rook: 'Move the rook to every star!',
  bishop: 'Slide the bishop to every star!',
  queen: 'Fly the queen to every star!',
  king: 'Step the king to every star!',
  pawn: 'March the pawn to every star!',
  knight: 'Hop the knight to every star!',
};

// Course 1 worlds, in syllabus order (Day 1 Rook … Day 6 Pawn). Units 7–11 belong to a later course.
export const kidsWorlds = COURSE1_DAYS.map((id) => unitsData.find((unit) => unit.id === id)).map((unit, index) => {
  const art = worldArt[unit.id];
  const practice = coursePiecePracticeLessons.find((lesson) => lesson.id === piecePracticeByUnit[unit.id]) || null;
  return {
    id: unit.id,
    day: index + 1,
    unit,
    ...art,
    title: art.name,
    lessonTitle: unit.title.replace(/^Unit \d+\s*[-–]\s*/, ''),
    videoLessonId: unit.unitLessons[0]?.id || `u${unit.id}-l1`,
    practiceLessonId: unit.unitLessons[1]?.id || `u${unit.id}-l2`,
    practice,
    kidGoal: practice ? kidGoals[practice.id] : null,
  };
});

export function findWorld(id) {
  return kidsWorlds.find((world) => world.id === Number(id)) || null;
}
