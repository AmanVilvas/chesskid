export const unitsData = [
  {
    id: 1,
    title: "Unit 1 - Meet the Rook!",
    suggestedTime: {
      total: "10 minutes",
      breakdown: [
        { label: "Lesson Video", time: "5 minutes" },
        { label: "Discussion", time: "5 minutes" }
      ]
    },
    description: "Students will learn the rook moves and that it can capture horizontally and vertically as many squares as it wants.",
    educationalObjectives: {
      intro: "As students learn and practice moving the rook, they actively investigate concepts of attacking, defending and trading pieces.",
      extendedQuestions: "Ask students to plan ahead two moves to get to a square and to choose between safe and unsafe captures. Students use problem solving and spatial reasoning skills and increase their familiarity with the coordinate plane. Students will be introduced to chess notation and vocabulary words \"rank\" and \"file\".",
      keyObjectives: [
        "Lines",
        "Measurement",
        "Connections",
        "Comparison",
        "Problem Solving"
      ]
    },
    reviewPreviousUnit: null,
    unitLessons: [
      { id: "u1-l1", title: "The Rook", type: "video", url: "#" },
      { id: "u1-l2", title: "Pawn 1", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "\"How Many Ways to School?\"",
      instructions: "Have students choose two squares on the chessboard and call them home and school. Find (draw on a blank printout of a board) all the different ways a rook could walk between home and school.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 1, page 6)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u1-e1", title: "Written Curriculum: Lesson 1, page 4", type: "document", url: "#" },
      { id: "u1-e2", title: "The Online Chess Glossary for Kids and Parents", type: "glossary", url: "#" },
      { id: "u1-e3", title: "Introduction, Part 2", type: "video", extraIcon: "lemon", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 2,
    title: "Unit 2 - Meet the Bishops!",
    suggestedTime: {
      total: "13 minutes",
      breakdown: [
        { label: "Review", time: "2 minutes" },
        { label: "Lesson Video", time: "6 minutes" },
        { label: "Discussion", time: "5 minutes" }
      ]
    },
    description: "Students learn the bishop moves diagonally as many squares as it wants.",
    educationalObjectives: {
      intro: "As students learn and practice moving the bishop, they actively investigate diagonal movement on light and dark squares, understanding that bishops never change square colors and measuring piece range across the board.",
      extendedQuestions: "Ask students how many bishops can be on the board at the same time and whether two bishops of the same color square can ever meet. Challenge them to predict bishop pathways over 3 turns.",
      keyObjectives: [
        "Lines",
        "Measurement",
        "Connections",
        "Comparison",
        "Problem Solving"
      ]
    },
    reviewPreviousUnit: "Review how the rook moves and captures horizontally and vertically across ranks and files before introducing the diagonal movement of the bishop.",
    unitLessons: [
      { id: "u2-l1", title: "The Bishop", type: "video", url: "#" },
      { id: "u2-l2", title: "Pawn 2", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "Different Diagonals",
      instructions: "Have students place bishops on different colored squares and trace all possible diagonal paths across the chessboard. Practice counting the squares controlled and identifying safe squares.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 1, page 7)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u2-e1", title: "Written Curriculum: Lesson 1, page 5", type: "document", url: "#" },
      { id: "u2-e2", title: "The Online Chess Glossary for Kids and Parents", type: "glossary", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 3,
    title: "Unit 3 - Meet the Queen!",
    suggestedTime: {
      total: "15 minutes",
      breakdown: [
        { label: "Review", time: "3 minutes" },
        { label: "Lesson Video", time: "7 minutes" },
        { label: "Discussion", time: "5 minutes" }
      ]
    },
    description: "Students learn the queen combines the power of the rook and the bishop, moving in straight lines and diagonals as far as she wants.",
    educationalObjectives: {
      intro: "Students explore the most powerful piece on the board, discovering how combining horizontal, vertical, and diagonal movement controls vast territory.",
      extendedQuestions: "Ask students to calculate how many squares a queen in the center can reach compared to a queen in the corner.",
      keyObjectives: [
        "Territory Control",
        "Line Integration",
        "Range Calculation",
        "Tactical Awareness",
        "Problem Solving"
      ]
    },
    reviewPreviousUnit: "Review the orthogonal lines of the rook and the diagonals of the bishop to show how the queen effortlessly adopts both powers.",
    unitLessons: [
      { id: "u3-l1", title: "The Queen", type: "video", url: "#" },
      { id: "u3-l2", title: "Queen vs Pawns Mini-Game", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "Queen's Domination",
      instructions: "Place pawns across the board and challenge students to clear them with the fewest queen moves possible.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 2, page 3)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u3-e1", title: "Written Curriculum: Lesson 2, page 1", type: "document", url: "#" },
      { id: "u3-e2", title: "The Online Chess Glossary: Royal Power", type: "glossary", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 4,
    title: "Unit 4 - Meet the King!",
    suggestedTime: {
      total: "12 minutes",
      breakdown: [
        { label: "Review", time: "2 minutes" },
        { label: "Lesson Video", time: "5 minutes" },
        { label: "Discussion", time: "5 minutes" }
      ]
    },
    description: "Students learn the king is the most important piece, moving one square in any direction, and must always be protected.",
    educationalObjectives: {
      intro: "Students understand royalty, safety, and why kings can never stand directly adjacent to each other on the board.",
      keyObjectives: [
        "King Safety",
        "Step-by-Step Movement",
        "Spatial Boundaries",
        "Critical Evaluation"
      ]
    },
    reviewPreviousUnit: "Review piece values learned so far and contrast the queen's wide range with the king's single-square step.",
    unitLessons: [
      { id: "u4-l1", title: "The King", type: "video", url: "#" },
      { id: "u4-l2", title: "King Race Game", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "Royal Fortress",
      instructions: "Guide students to build a protective wall of pawns around their king and evaluate safe evacuation squares.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 2, page 8)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u4-e1", title: "Written Curriculum: Lesson 2, page 6", type: "document", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 5,
    title: "Unit 5 - Meet the Pawn!",
    suggestedTime: {
      total: "14 minutes",
      breakdown: [
        { label: "Lesson Video", time: "6 minutes" },
        { label: "Discussion", time: "5 minutes" },
        { label: "Practice", time: "3 minutes" }
      ]
    },
    description: "Students learn the unique forward march of the pawn, capturing diagonally, initial two-square push, and pawn promotion.",
    educationalObjectives: {
      intro: "Investigate asymmetrical movement: how pawns move forward but capture diagonally, and the thrill of reaching the 8th rank for promotion.",
      keyObjectives: [
        "Promotion",
        "Asymmetrical Movement",
        "Forward Momentum",
        "Pawn Structure"
      ]
    },
    reviewPreviousUnit: "Recall king and piece movements to understand how pawns support and shield friendly pieces.",
    unitLessons: [
      { id: "u5-l1", title: "The Pawn & Promotion", type: "video", url: "#" },
      { id: "u5-l2", title: "The Pawn Game (8 vs 8)", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "Pawn Race to Queen",
      instructions: "Pairs of students race their pawn chains across the board to practice calculating promotion tempi.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 3, page 4)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u5-e1", title: "Written Curriculum: Lesson 3, page 2", type: "document", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 6,
    title: "Unit 6 - Meet the Knight!",
    suggestedTime: {
      total: "16 minutes",
      breakdown: [
        { label: "Review", time: "3 minutes" },
        { label: "Lesson Video", time: "8 minutes" },
        { label: "Discussion", time: "5 minutes" }
      ]
    },
    description: "Students learn the tricky L-shaped jump of the knight and how it can leap over other pieces.",
    educationalObjectives: {
      intro: "Master the unique L-shape (2 squares then 1) and realize knights always land on a square of the opposite color.",
      keyObjectives: [
        "L-Shape Pattern",
        "Jumping Capability",
        "Color Alternation",
        "Forks"
      ]
    },
    reviewPreviousUnit: "Compare how all other pieces are blocked by obstructions while knights can freely jump.",
    unitLessons: [
      { id: "u6-l1", title: "The Knight", type: "video", url: "#" },
      { id: "u6-l2", title: "Knight Tour Mini-Game", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "Knight Jump Maze",
      instructions: "Have students guide their knight from a1 to h8 without landing on prohibited squares.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 4, page 2)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u6-e1", title: "Written Curriculum: Lesson 4, page 1", type: "document", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 7,
    title: "Unit 7 - Check!",
    suggestedTime: {
      total: "15 minutes",
      breakdown: [
        { label: "Review", time: "3 minutes" },
        { label: "Lesson Video", time: "7 minutes" },
        { label: "Discussion", time: "5 minutes" }
      ]
    },
    description: "Students understand what check means: when a king is under immediate attack and must respond with the 3 ways out: CPR.",
    educationalObjectives: {
      intro: "Teach students the three universal responses to check: Capture the attacker, Protect (block), or Run away (move the king).",
      keyObjectives: [
        "CPR Rule",
        "Threat Recognition",
        "Immediate Defense",
        "Legal Moves"
      ]
    },
    reviewPreviousUnit: "Ensure students recall all piece attacks to determine when a king is threatened.",
    unitLessons: [
      { id: "u7-l1", title: "Check & Escape", type: "video", url: "#" },
      { id: "u7-l2", title: "Escape the Check Quiz", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "CPR Doctor Practice",
      instructions: "Students diagnose check positions on puzzle sheets and identify which of C, P, or R can save the king.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 5, page 5)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u7-e1", title: "Written Curriculum: Lesson 5, page 1", type: "document", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 8,
    title: "Unit 8 - Checkmate!",
    suggestedTime: {
      total: "18 minutes",
      breakdown: [
        { label: "Review", time: "4 minutes" },
        { label: "Lesson Video", time: "8 minutes" },
        { label: "Discussion", time: "6 minutes" }
      ]
    },
    description: "Students learn the ultimate goal of chess: checkmate, where the king is in check and has no legal moves to escape.",
    educationalObjectives: {
      intro: "Distinguish between a temporary check and an inescapable checkmate that concludes the game.",
      keyObjectives: [
        "Checkmate Verification",
        "Game Ending",
        "Coordinating Attackers",
        "Defensive Invalidation"
      ]
    },
    reviewPreviousUnit: "Review CPR and show that when neither C, P, nor R is possible, the game is won by checkmate.",
    unitLessons: [
      { id: "u8-l1", title: "Checkmate Fundamentals", type: "video", url: "#" },
      { id: "u8-l2", title: "Mate in One Puzzles", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "Spot the Mate",
      instructions: "Present 5 boards and ask students whether each position is Check, Checkmate, or safe.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 6, page 3)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u8-e1", title: "Written Curriculum: Lesson 6, page 1", type: "document", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 9,
    title: "Unit 9 - Stalemate!",
    suggestedTime: {
      total: "14 minutes",
      breakdown: [
        { label: "Lesson Video", time: "6 minutes" },
        { label: "Discussion", time: "5 minutes" },
        { label: "Practice", time: "3 minutes" }
      ]
    },
    description: "Students discover stalemate: when a player has no legal moves but is NOT in check, resulting in an immediate draw.",
    educationalObjectives: {
      intro: "Understand the tragedy and tactic of stalemate: how the losing player can escape with a draw and how the winning player must avoid it.",
      keyObjectives: [
        "Stalemate vs Checkmate",
        "Legal Move Inspection",
        "Draw Rules",
        "Under-Promotion Awareness"
      ]
    },
    reviewPreviousUnit: "Contrast Checkmate (in check + no moves) with Stalemate (not in check + no moves).",
    unitLessons: [
      { id: "u9-l1", title: "The Sneaky Stalemate", type: "video", url: "#" },
      { id: "u9-l2", title: "Avoid the Trap Challenge", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "Escape the Jaws of Defeat",
      instructions: "Set up simplified king and queen vs lone king endings and have students identify stalemate dangers.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 7, page 2)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u9-e1", title: "Written Curriculum: Lesson 7, page 1", type: "document", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 10,
    title: "Unit 10 - Help needed for Checkmate!",
    suggestedTime: {
      total: "15 minutes",
      breakdown: [
        { label: "Review", time: "3 minutes" },
        { label: "Lesson Video", time: "7 minutes" },
        { label: "Discussion", time: "5 minutes" }
      ]
    },
    description: "Students learn that pieces must work together as a cooperative team to trap an enemy king and deliver mate.",
    educationalObjectives: {
      intro: "Foster teamwork and piece synergy. Lone pieces rarely deliver checkmate without a supporting guardian.",
      keyObjectives: [
        "Piece Cooperation",
        "Support Mechanics",
        "Guarding the Attacker",
        "Restricting King Flight"
      ]
    },
    reviewPreviousUnit: "Review basic checkmate patterns to show how defender kings can capture unsupported attackers.",
    unitLessons: [
      { id: "u10-l1", title: "Teamwork Checkmates", type: "video", url: "#" },
      { id: "u10-l2", title: "Battery and Support Drills", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "Tag-Team Checkmate",
      instructions: "Students partner up to place one attacking piece and one supporting piece to construct a checkmate on the edge.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 8, page 4)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u10-e1", title: "Written Curriculum: Lesson 8, page 2", type: "document", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  },
  {
    id: 11,
    title: "Unit 11 - King & Queen Mate!",
    suggestedTime: {
      total: "20 minutes",
      breakdown: [
        { label: "Review", time: "4 minutes" },
        { label: "Lesson Video", time: "9 minutes" },
        { label: "Discussion", time: "7 minutes" }
      ]
    },
    description: "Students master the step-by-step technique to box in the enemy king using the Queen and King, finishing with the Kiss of Death.",
    educationalObjectives: {
      intro: "Learn the systematic 'shrinking box' method: walking the queen a knight's distance away, marching the friendly king in, and checkmating safely.",
      keyObjectives: [
        "Shrinking the Box",
        "Edge Trapping",
        "Opposition and Support",
        "Avoiding Corner Stalemate"
      ]
    },
    reviewPreviousUnit: "Reinforce teamwork principles from Unit 10 to guide the king and queen tandem.",
    unitLessons: [
      { id: "u11-l1", title: "The King and Queen Endgame", type: "video", url: "#" },
      { id: "u11-l2", title: "Practice Mate against the Computer", type: "game", url: "#" }
    ],
    classroomMaterials: {
      activityTitle: "Supplemental Classroom Activity:",
      activityName: "The Shrinking Box Drill",
      instructions: "Pairs practice cornering a lone king within 10 moves while avoiding stalemate pitfalls.",
      worksheet: {
        title: "Worksheet (Written Curriculum: Lesson 9, page 5)",
        url: "#"
      }
    },
    extraActivities: [
      { id: "u11-e1", title: "Written Curriculum: Lesson 9, page 1", type: "document", url: "#" },
      { id: "u11-e2", title: "The Online Chess Glossary for Kids and Parents", type: "glossary", url: "#" }
    ],
    authors: "WFM Elizabeth Spiegel"
  }
];
