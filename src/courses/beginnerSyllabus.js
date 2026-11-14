// Chess Course 1 — Beginner syllabus (as published by The Thinking Academy).
// Meet the pieces, one per day, then three additional "Chess Basics" videos.
// Unit ids and lesson ids are unchanged, so saved progress and uploaded videos keep working.

/** Unit ids in syllabus order: Day 1 Rook … Day 5 Knight, Day 6 Pawn. */
export const COURSE1_DAYS = [1, 2, 3, 4, 6, 5];

/** The extra videos live in their own section; 100 keeps them clear of piece units. */
export const BASICS_UNIT_ID = 100;
export const BASICS_LESSONS = [
  { id: 'basics-board', title: 'Meet the Chessboard', duration: '4 minutes', description: 'The 64 squares, light and dark, and how to set the board the right way round.' },
  { id: 'basics-squares', title: 'Square Names', duration: '4 minutes', description: 'Files a to h, ranks 1 to 8: how every square gets its own name, like e4.' },
  { id: 'basics-play', title: 'How Chess Is Played', duration: '5 minutes', description: 'How a game starts, whose turn it is, and how a game is won.' },
];

export const dayOfUnit = (unitId) => COURSE1_DAYS.indexOf(Number(unitId)) + 1;
