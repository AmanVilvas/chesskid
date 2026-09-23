import { unitsData } from './unitsData';
import { reviews as baseReviews } from './pricingData';

export const udemyCourseMeta = {
  id: "chess-beginner-11units",
  title: "Chess With Rathish — Beginner Curriculum & Lesson Planner",
  shortTitle: "Building Chess Thinkers from Scratch (Ages 4–6)",
  subtitle: "Master what sits under the hood of chess thinking: spatial reasoning, pattern recognition, and problem solving through structured 1:1 guided discovery.",
  headline: "A complete step-by-step 11-unit curriculum designed for young minds aged 4–6. Small moves, big thinking.",
  rating: 5.0,
  ratingsCount: 148,
  studentsCount: 320,
  instructor: {
    name: "Coach Rathish",
    title: "Founder & Master Chess Educator (with WFM Elizabeth Spiegel)",
    bio: "Passionate about early childhood cognitive development through chess. Over 8+ years coaching young minds aged 4–6 to think logically, focus deeply, and solve problems creatively.",
    avatar: "/chess_coach.jpg",
    rating: 5.0,
    students: 320,
    courses: 3,
  },
  lastUpdated: "September 2026",
  language: "English",
  subtitles: "English [Auto]",
  totalHours: "2 hours 45 mins",
  totalLectures: 36,
  totalSections: 11,
  previewVideoDuration: "5:00",
  whatYoullLearn: [
    "Master the movements, captures and special powers of all 6 chess pieces (Rook, Bishop, Queen, King, Pawn, Knight)",
    "Understand the critical difference between Check, Checkmate, and sneaky Stalemate",
    "Apply the life-saving CPR rule (Capture, Protect, Run) whenever the king is under attack",
    "Coordinate multiple pieces as a team to trap the enemy king and finish games",
    "Execute the systematic 'Shrinking the Box' technique for King & Queen endgame checkmates",
    "Develop early spatial reasoning, diagonal perception, and rank/file coordinate awareness",
    "Build laser focus, patience, sportsmanship, and multi-step foresight for kids aged 4–6",
    "Empower parents with word-for-word teaching scripts, guided questions, and printables"
  ],
  exploreTopics: [
    "Chess Tactics",
    "Kids Chess (Aged 4–6)",
    "Spatial Reasoning",
    "Pattern Recognition",
    "Early Childhood Thinking",
    "Parent-Child Coaching"
  ],
  courseIncludes: [
    { icon: "video", text: "2 hours 45 mins on-demand guided video lessons" },
    { icon: "file", text: "22 printable activity worksheets & homework boards" },
    { icon: "puzzle", text: "11 interactive mini-games & coordinate challenges" },
    { icon: "book", text: "Full Parent Companion teaching scripts for each unit" },
    { icon: "device", text: "Access on mobile, tablet, and desktop" },
    { icon: "clock", text: "Full lifetime access to all 11 beginner units" },
    { icon: "award", text: "Certificate of Completion for your child" }
  ],
  requirements: [
    "No prior chess knowledge required — built from ground zero for 4-to-6-year-old curious minds.",
    "A physical chessboard or digital board is helpful, but not required to watch and learn.",
    "An excited young learner and a supportive parent or coach ready to explore together."
  ],
  descriptionParagraphs: [
    "Welcome to the Chess With Rathish Beginner Lesson Planner — a curriculum crafted specifically for the curious, sponge-like minds of 4-to-6-year-olds.",
    "Traditional chess coaching often throws complex opening theory and dry notation at children before they've even grasped spatial relationships. Here, we believe: 'I don't teach chess, I teach thinking.'",
    "Each unit introduces a single piece or tactical concept through engaging stories, tactile classroom activities, guided discovery questions, and mini-games. From tracing the orthogonal steps of the Rook to mastering the CPR defense rule and the majestic King & Queen 'Kiss of Death' checkmate, your child will build deep confidence and strategic foresight.",
    "Designed in collaboration with WFM Elizabeth Spiegel, this written curriculum provides parents and coaches with structured pedagogical guidelines, discussion prompts, and hands-on worksheets for every single milestone."
  ]
};

// Unit animation / board metadata
export const unitBoardAnimations = {
  1: {
    piece: "♜",
    pieceName: "Rook",
    startSquare: { r: 4, c: 4 }, // e4
    moves: [
      { r: 4, c: 4, note: "Rook at e4" },
      { r: 1, c: 4, note: "Slides forward along file to e7" },
      { r: 1, c: 7, note: "Slides right along rank to h7" },
      { r: 6, c: 7, note: "Slides backward along file to h2" },
      { r: 6, c: 1, note: "Slides left along rank to b2" },
      { r: 4, c: 1, note: "Slides up along file to b4" },
      { r: 4, c: 4, note: "Returns to center e4" }
    ],
    highlightSquares: [
      { r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 5 }, { r: 4, c: 6 }, { r: 4, c: 7 },
      { r: 0, c: 4 }, { r: 1, c: 4 }, { r: 2, c: 4 }, { r: 3, c: 4 }, { r: 5, c: 4 }, { r: 6, c: 4 }, { r: 7, c: 4 }
    ],
    subtitles: [
      "Hello everyone! In this lesson we are going to explore how the Rook moves.",
      "The Rook slides in straight orthogonal lines: forward, backward, left, and right.",
      "It can slide across as many open squares as it wants along open ranks and files!",
      "When an enemy piece blocks its path, the Rook can capture it and occupy that square.",
      "Let's practice counting all the horizontal and vertical squares our Rook controls!"
    ]
  },
  2: {
    piece: "♝",
    pieceName: "Bishop",
    startSquare: { r: 4, c: 2 }, // c4
    moves: [
      { r: 4, c: 2, note: "Bishop at c4" },
      { r: 1, c: 5, note: "Slides diagonally to f7" },
      { r: 3, c: 7, note: "Slides diagonally to h5" },
      { r: 6, c: 4, note: "Slides diagonally to e2" },
      { r: 4, c: 2, note: "Returns diagonally to c4" }
    ],
    highlightSquares: [
      { r: 5, c: 1 }, { r: 6, c: 0 }, { r: 3, c: 3 }, { r: 2, c: 4 }, { r: 1, c: 5 }, { r: 0, c: 6 },
      { r: 5, c: 3 }, { r: 6, c: 4 }, { r: 7, c: 5 }, { r: 3, c: 1 }, { r: 2, c: 0 }
    ],
    subtitles: [
      "Welcome back! Today we explore the magic of the Bishop and diagonal lines.",
      "Notice that this bishop starts on a light square—it will ALWAYS stay on light squares!",
      "Bishops move diagonally like an X, as far as they want across open diagonals.",
      "Can two bishops of the same color square ever meet? Explore and share your ideas!"
    ]
  },
  3: {
    piece: "♛",
    pieceName: "Queen",
    startSquare: { r: 4, c: 3 }, // d4
    moves: [
      { r: 4, c: 3, note: "Queen at d4" },
      { r: 1, c: 3, note: "Straight up to d7" },
      { r: 1, c: 6, note: "Horizontal to g7" },
      { r: 4, c: 3, note: "Diagonal back to d4" },
      { r: 7, c: 6, note: "Diagonal sweep to g1" },
      { r: 4, c: 3, note: "Returns to center d4" }
    ],
    highlightSquares: [
      { r: 4, c: 0 }, { r: 4, c: 7 }, { r: 0, c: 3 }, { r: 7, c: 3 },
      { r: 1, c: 0 }, { r: 7, c: 6 }, { r: 1, c: 6 }, { r: 7, c: 0 }
    ],
    subtitles: [
      "Now meet the most powerful piece on the chessboard: the Queen!",
      "The Queen combines the straight lines of the Rook and the diagonals of the Bishop.",
      "She glides in all 8 directions—forward, backward, sideways, and diagonally.",
      "Because of her immense range, she can control almost the entire board from the center!"
    ]
  },
  4: {
    piece: "♚",
    pieceName: "King",
    startSquare: { r: 4, c: 4 }, // e4
    moves: [
      { r: 4, c: 4, note: "King at e4" },
      { r: 3, c: 4, note: "One step forward to e5" },
      { r: 3, c: 5, note: "One step diagonal to f5" },
      { r: 4, c: 5, note: "One step right to f4" },
      { r: 5, c: 4, note: "One step backward to e3" },
      { r: 4, c: 4, note: "Returns to e4" }
    ],
    highlightSquares: [
      { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 },
      { r: 4, c: 3 }, { r: 4, c: 5 },
      { r: 5, c: 3 }, { r: 5, c: 4 }, { r: 5, c: 5 }
    ],
    subtitles: [
      "The King is the royal commander and the most important piece on the board!",
      "The King takes measured steps: only one square at a time, in any direction.",
      "Two opposing kings can NEVER touch or stand on adjacent squares.",
      "Rule number one in chess: keep your King guarded and safe at all times!"
    ]
  },
  5: {
    piece: "♟",
    pieceName: "Pawn",
    startSquare: { r: 6, c: 4 }, // e2
    moves: [
      { r: 6, c: 4, note: "Pawn at e2" },
      { r: 4, c: 4, note: "Two squares forward on first move to e4" },
      { r: 3, c: 4, note: "One square forward to e5" },
      { r: 2, c: 3, note: "Captures diagonally to d6!" },
      { r: 1, c: 3, note: "Pushes forward to d7" },
      { r: 0, c: 3, note: "Reaches d8 and promotes to Queen ♛!" }
    ],
    highlightSquares: [
      { r: 5, c: 4 }, { r: 4, c: 4 }, { r: 5, c: 3 }, { r: 5, c: 5 }
    ],
    subtitles: [
      "Small steps, big ideas! Pawns march forward one square at a time.",
      "On their very first move, pawns have the special power to jump two squares!",
      "Pawns are unique: they move straight ahead, but capture diagonally.",
      "When a brave pawn marches all the way to the other end, it promotes to a Queen!"
    ]
  },
  6: {
    piece: "♞",
    pieceName: "Knight",
    startSquare: { r: 7, c: 1 }, // b1
    moves: [
      { r: 7, c: 1, note: "Knight at b1" },
      { r: 5, c: 2, note: "Jumps in L-shape to c3" },
      { r: 3, c: 3, note: "Jumps to d5" },
      { r: 2, c: 5, note: "Jumps to f6" },
      { r: 4, c: 6, note: "Jumps to g4" },
      { r: 5, c: 4, note: "Jumps to e3" }
    ],
    highlightSquares: [
      { r: 5, c: 0 }, { r: 5, c: 2 }, { r: 6, c: 3 }
    ],
    subtitles: [
      "The Knight is the trickiest and most exciting piece on the entire board!",
      "Knights move in an L-shape: two squares in one direction, and one square to turn.",
      "The Knight is the ONLY piece that can jump over other pieces!",
      "Notice this cool pattern: every time a knight jumps, it changes square color."
    ]
  },
  7: {
    piece: "♚",
    pieceName: "Check!",
    startSquare: { r: 4, c: 4 }, // e4
    moves: [
      { r: 4, c: 4, note: "King at e4" },
      { r: 3, c: 4, note: "Enemy Rook delivers check from e1!" },
      { r: 3, c: 3, note: "King runs to safety at d5 (R = Run)" },
      { r: 4, c: 4, note: "Position saved!" }
    ],
    highlightSquares: [
      { r: 7, c: 4 }, { r: 6, c: 4 }, { r: 5, c: 4 }, { r: 4, c: 4 }
    ],
    subtitles: [
      "CHECK! When an enemy piece directly attacks your King, that is called Check.",
      "Your King must escape immediately! Remember our three-letter rule: CPR.",
      "C = Capture the attacker. P = Protect with a shield. R = Run away to safety!",
      "If you can do any of C, P, or R, your King is safe and the game continues."
    ]
  },
  8: {
    piece: "♚",
    pieceName: "Checkmate!",
    startSquare: { r: 0, c: 4 }, // e8
    moves: [
      { r: 0, c: 4, note: "Black King at e8" },
      { r: 1, c: 4, note: "White Queen steps to e7 supported by King at e6!" },
      { r: 0, c: 4, note: "CHECKMATE! No escapes, no blocks, no captures." }
    ],
    highlightSquares: [
      { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 1, c: 4 }
    ],
    subtitles: [
      "Checkmate is the ultimate goal and the triumphant finish of chess!",
      "Checkmate happens when the king is in check and CANNOT escape with C, P, or R.",
      "Notice: the king cannot capture, cannot block, and has no safe squares.",
      "When checkmate happens, we shake hands and say 'Good game!'"
    ]
  },
  9: {
    piece: "♚",
    pieceName: "Stalemate!",
    startSquare: { r: 0, c: 7 }, // h8
    moves: [
      { r: 0, c: 7, note: "Black King cornered at h8" },
      { r: 2, c: 6, note: "White Queen at g6 blocks all squares without checking!" },
      { r: 0, c: 7, note: "STALEMATE! King not in check, but has 0 legal moves = Draw." }
    ],
    highlightSquares: [
      { r: 0, c: 6 }, { r: 1, c: 6 }, { r: 1, c: 7 }
    ],
    subtitles: [
      "Beware the sneaky Stalemate! This is one of the most surprising rules in chess.",
      "Stalemate happens when a player has NO legal moves, but their King is NOT in check!",
      "Because the King is not attacked, the game ends in an immediate draw (tie).",
      "If you have lots of pieces, always leave the enemy king a square to move!"
    ]
  },
  10: {
    piece: "♛",
    pieceName: "Piece Teamwork",
    startSquare: { r: 3, c: 3 }, // d5
    moves: [
      { r: 3, c: 3, note: "Queen at d5" },
      { r: 5, c: 1, note: "Bishop at c3 backs up the Queen" },
      { r: 1, c: 5, note: "Battery aimed at enemy f7 square!" }
    ],
    highlightSquares: [
      { r: 5, c: 1 }, { r: 4, c: 2 }, { r: 3, c: 3 }, { r: 2, c: 4 }, { r: 1, c: 5 }
    ],
    subtitles: [
      "Lone pieces cannot win by themselves—they need great teamwork!",
      "In this unit, we explore how pieces coordinate like best friends.",
      "When a Bishop or Rook protects the Queen, she can attack without fear.",
      "Together, your pieces form an unstoppable team across the board."
    ]
  },
  11: {
    piece: "♛",
    pieceName: "King & Queen Mate",
    startSquare: { r: 4, c: 4 }, // e4
    moves: [
      { r: 4, c: 4, note: "Queen at e4" },
      { r: 2, c: 5, note: "Queen shrinks the box: a knight's distance from enemy king" },
      { r: 1, c: 5, note: "Friendly king marches in to support" },
      { r: 0, c: 6, note: "Kiss of Death checkmate on the edge!" }
    ],
    highlightSquares: [
      { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 0, c: 6 }, { r: 0, c: 7 }
    ],
    subtitles: [
      "The grand finale: the King and Queen endgame checkmate technique.",
      "Step 1: Use your Queen to 'shrink the box', keeping a knight's distance.",
      "Step 2: Corner the lone king on the edge, leaving two squares so no stalemate occurs.",
      "Step 3: March your King close and deliver the final Kiss of Death checkmate!"
    ]
  }
};

// Build all Udemy sections with structured lectures
export const udemySections = unitsData.map((unit) => {
  const anim = unitBoardAnimations[unit.id] || unitBoardAnimations[1];
  const lectures = [];

  // Lecture 1: Core video lesson
  const l1 = unit.unitLessons?.[0];
  lectures.push({
    id: l1 ? l1.id : `u${unit.id}-l1`,
    title: l1 ? l1.title : `${unit.title.split('-')[1]?.trim() || unit.title} - Video Lesson`,
    type: "video",
    duration: unit.suggestedTime?.breakdown?.find(b => b.label.toLowerCase().includes('video'))?.time || "5min",
    durationSec: 300,
    previewable: true,
    caption: anim.subtitles[0],
    subtitles: anim.subtitles,
    piece: anim.piece,
    pieceName: anim.pieceName,
    moves: anim.moves,
    highlightSquares: anim.highlightSquares
  });

  // Lecture 2: Mini-game or Practice drill
  const l2 = unit.unitLessons?.[1];
  if (l2) {
    lectures.push({
      id: l2.id,
      title: l2.title,
      type: l2.type === "game" ? "game" : "video",
      duration: unit.suggestedTime?.breakdown?.find(b => b.label.toLowerCase().includes('practice') || b.label.toLowerCase().includes('discussion'))?.time || "4min",
      durationSec: 240,
      previewable: true,
      caption: anim.subtitles[1] || anim.subtitles[0],
      subtitles: anim.subtitles,
      piece: anim.piece,
      pieceName: anim.pieceName,
      moves: anim.moves,
      highlightSquares: anim.highlightSquares
    });
  }

  // Lecture 3: Supplemental Classroom Activity
  if (unit.classroomMaterials) {
    lectures.push({
      id: `u${unit.id}-act`,
      title: `Activity: ${unit.classroomMaterials.activityName.replace(/"/g, '')}`,
      type: "activity",
      duration: "3min",
      durationSec: 180,
      previewable: true,
      caption: `Classroom hands-on drill: ${unit.classroomMaterials.instructions}`,
      subtitles: [
        `Welcome to the hands-on activity for ${unit.title}!`,
        unit.classroomMaterials.instructions,
        "Parents: encourage your child to count squares out loud and trace the moves with their fingers.",
        "Celebrate every effort and connect it to our thinking skill for today!"
      ],
      piece: anim.piece,
      pieceName: anim.pieceName,
      moves: anim.moves,
      highlightSquares: anim.highlightSquares
    });

    // Lecture 4: Printable Worksheet
    if (unit.classroomMaterials.worksheet) {
      lectures.push({
        id: `u${unit.id}-ws`,
        title: unit.classroomMaterials.worksheet.title,
        type: "document",
        duration: "2min",
        durationSec: 120,
        previewable: false,
        caption: `Printable worksheet for Unit ${unit.id}: ${unit.title}. Follow along with pencil and paper.`,
        subtitles: [
          `Unit ${unit.id} Printable Worksheet: ${unit.classroomMaterials.worksheet.title}.`,
          "Download or print this sheet to let your child solve puzzles with crayons or stickers.",
          "Children develop pencil grip, spatial orientation, and pride in their learning portfolio."
        ],
        piece: anim.piece,
        pieceName: anim.pieceName,
        moves: anim.moves,
        highlightSquares: anim.highlightSquares
      });
    }
  }

  // Calculate section total duration
  const totalMins = lectures.reduce((acc, l) => {
    const m = parseInt(l.duration, 10) || 4;
    return acc + m;
  }, 0);

  return {
    id: unit.id,
    unitNumber: unit.id,
    title: `Section ${unit.id}: ${unit.title}`,
    unitRawTitle: unit.title,
    description: unit.description,
    suggestedTime: unit.suggestedTime,
    educationalObjectives: unit.educationalObjectives,
    classroomMaterials: unit.classroomMaterials,
    extraActivities: unit.extraActivities,
    reviewPreviousUnit: unit.reviewPreviousUnit,
    authors: unit.authors,
    totalMinutes: totalMins,
    lecturesCount: lectures.length,
    lectures
  };
});

// Helper to look up a lecture
export const findLectureById = (unitId, lectureId) => {
  const section = udemySections.find(s => s.id === unitId) || udemySections[0];
  const lecture = section.lectures.find(l => l.id === lectureId) || section.lectures[0];
  return { section, lecture };
};

// Course announcements from Coach Rathish
export const courseAnnouncements = [
  {
    id: "ann-1",
    author: "Coach Rathish",
    date: "2 days ago",
    title: "Weekly Practice Guide: Introducing Diagonal Moves to 4-Year-Olds",
    content: "Hi parents! When teaching the Bishop in Unit 2, many 4-year-olds accidentally jump square colors. Here is our secret tip: have them place a coin on each square along the diagonal before sliding the piece. This makes the diagonal pattern visual and tangible!"
  },
  {
    id: "ann-2",
    author: "Coach Rathish",
    date: "1 week ago",
    title: "New Printable CPR Reminder Cards Added to Unit 7",
    content: "We've added a fun pocket-sized CPR (Capture, Protect, Run) flashcard to the Learning Tools tab. You can print it out and keep it right next to your physical board during games."
  },
  {
    id: "ann-3",
    author: "Coach Rathish",
    date: "2 weeks ago",
    title: "Welcome to the 11-Unit Beginner Curriculum!",
    content: "Welcome curious parents and learners! Remember our motto: 'I don't teach chess, I teach thinking.' Keep sessions short, playful (15-20 minutes max), and full of high-fives."
  }
];

// Learning Tools & Downloads
export const learningToolsList = [
  {
    id: "tool-1",
    title: "Full 11-Unit Written Curriculum (PDF)",
    type: "PDF Document",
    size: "4.2 MB",
    description: "Complete pedagogical handbook by WFM Elizabeth Spiegel and Coach Rathish.",
    downloadName: "Chess_With_Rathish_Curriculum_Beginner.pdf"
  },
  {
    id: "tool-2",
    title: "Printable 8x8 Chessboard with Coordinates",
    type: "Printable Sheet",
    size: "1.1 MB",
    description: "High-contrast A4 board with color-coded diagonals and coordinate markers.",
    downloadName: "Printable_Chessboard_A4.pdf"
  },
  {
    id: "tool-3",
    title: "CPR Rule Pocket Flashcard (Capture, Protect, Run)",
    type: "Flashcard",
    size: "850 KB",
    description: "Visual reminder for young players to escape checks calmly.",
    downloadName: "CPR_Check_Escape_Card.pdf"
  },
  {
    id: "tool-4",
    title: "The Online Chess Glossary for Kids & Parents",
    type: "Glossary Guide",
    size: "1.8 MB",
    description: "Kid-friendly definitions for rank, file, diagonal, fork, pin, and checkmate.",
    downloadName: "Kids_Chess_Glossary.pdf"
  }
];

// Parent Reviews
export const courseReviews = [
  ...baseReviews,
  {
    name: "Ananya Sharma",
    role: "Mother of 5yo Ayaan",
    city: "Bengaluru",
    rating: 5,
    text: "The step-by-step video lessons and worksheets are unbelievable. Ayaan understands diagonals and the CPR rule better than my husband! Best early thinking curriculum we've ever purchased.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    name: "Karthik Venkat",
    role: "Father of 6yo twins",
    city: "Mumbai",
    rating: 5,
    text: "Coach Rathish's philosophy of 'I don't teach chess, I teach thinking' really shows. The kids love the shrinking box endgame in Unit 11 and their concentration in school has noticeably improved.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80"
  }
];
