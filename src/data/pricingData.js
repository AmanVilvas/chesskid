// Pricing plans tailored for PARENTS who want to teach chess to their children
export const pricingPlans = [
  {
    id: "parent-starter",
    name: "Parent Starter",
    tagline: "Perfect for parents who are beginners themselves and want to learn & teach simultaneously",
    icon: "👨‍👧",
    badge: "Start Here",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    priceMonthly: 999,
    priceAnnual: 799,
    popular: false,
    cardBorder: "border-gray-200 hover:border-sky-400",
    buttonStyle: "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200",
    buttonText: "Start Teaching Today",
    features: [
      { text: "Parent Teaching Guide — how to explain each piece & rule clearly", included: true },
      { text: "Step-by-step Lesson Plans for Units 1–11 (Beginner)", included: true },
      { text: "\"Parent reads aloud\" scripts so you don't need chess experience", included: true },
      { text: "1 Child Account (tracks your kid's progress)", included: true },
      { text: "Printable Activity Sheets & Homework Puzzles", included: true },
      { text: "Basic Kid-Friendly Puzzle Practice (Levels 1–3)", included: true },
      { text: "Live Parent Q&A Webinars & Community Forum", included: false },
      { text: "Intermediate & Advanced Parent Teaching Modules", included: false },
      { text: "Family Progress Dashboard (multiple children)", included: false },
      { text: "Parent Coaching Certification Program", included: false },
    ],
    studentLimit: "1 Child Account",
    supportType: "Email Support (48h response)",
    forWhom: "For parents new to chess"
  },
  {
    id: "family-coach",
    name: "Family Coach",
    tagline: "Our most popular plan — for parents actively teaching chess at home with multiple kids",
    icon: "👨‍👩‍👧‍👦",
    badge: "★ MOST POPULAR",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
    priceMonthly: 1999,
    priceAnnual: 1599,
    popular: true,
    cardBorder: "border-[#489f1f] ring-2 ring-[#489f1f]/20 shadow-xl",
    buttonStyle: "bg-[#489f1f] hover:bg-[#3c8719] text-white shadow-green-200",
    buttonText: "Become Your Family's Chess Coach",
    features: [
      { text: "Complete Parent Teaching Kit — Beginner through Advanced", included: true },
      { text: "Up to 3 Child Accounts (siblings, cousins, neighbours)", included: true },
      { text: "Video tutorials for parents: how to demonstrate each move", included: true },
      { text: "Weekly Lesson Planner with ready-made 15 min session outlines", included: true },
      { text: "\"Stuck? Parent Tip\" pop-ups when a child struggles", included: true },
      { text: "Family Progress Dashboard & side-by-side comparison", included: true },
      { text: "Interactive Parent-vs-Child game mode to practice together", included: true },
      { text: "Monthly LIVE Parent Workshop with a Chess Expert", included: true },
      { text: "Parent Community — share wins & ask questions", included: true },
      { text: "Parent Coaching Certification Program", included: false },
    ],
    studentLimit: "Up to 3 Children",
    supportType: "Priority Support (Same day response)",
    forWhom: "For engaged & motivated parents"
  },
  {
    id: "master-parent",
    name: "Master Parent",
    tagline: "For parents who want to deeply master chess teaching and raise future champions",
    icon: "👑",
    badge: "Best for Committed Families",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300 font-bold",
    priceMonthly: 2999,
    priceAnnual: 2399,
    popular: false,
    cardBorder: "border-purple-200 hover:border-purple-400 shadow-md",
    buttonStyle: "bg-[#1c4a27] hover:bg-[#15381d] text-white shadow-emerald-200",
    buttonText: "Raise a Future Champion",
    features: [
      { text: "Full curriculum library — all levels (Beginner, Intermediate, Advanced)", included: true },
      { text: "Up to 5 Child Accounts (expand a neighbourhood group)", included: true },
      { text: "Parent Coaching Certification Program (official certificate)", included: true },
      { text: "Private 1-on-1 monthly session with a Chess Master for guidance", included: true },
      { text: "Personalised learning path for each child based on strengths", included: true },
      { text: "Tournament Prep Kit — how parents prepare kids for competitions", included: true },
      { text: "Advanced Psychology of Learning — how kids learn chess best", included: true },
      { text: "Exclusive Parent Masterclass recordings from FIDE-rated players", included: true },
      { text: "Early access to new curriculum content & beta features", included: true },
      { text: "Dedicated Family Success Advisor (priority chat + video call)", included: true },
    ],
    studentLimit: "Up to 5 Children",
    supportType: "VIP 24/7 Dedicated Support + Video Calls",
    forWhom: "For serious chess-teaching families"
  }
];

export const comparisonFeatures = [
  {
    category: "Parent Teaching Resources",
    features: [
      { name: "Step-by-step Parent Teaching Scripts (read-aloud guides)", starter: "Units 1–11", family: "All Units", master: "All Units + Advanced" },
      { name: "\"How to Explain\" video tutorials for parents", starter: "Basic moves", family: "Complete curriculum", master: "Complete + Expert tips" },
      { name: "15-min Weekly Session Plans for home teaching", starter: "Included", family: "Included", master: "Included + Custom Plans" },
      { name: "Printable Activity Sheets & at-home exercises", starter: "11 sheets", family: "50+ sheets", master: "Unlimited + Custom" },
      { name: "Parent Progress Confidence Score (how well you're teaching)", starter: "—", family: "Included", master: "Included + Coaching Tips" },
    ]
  },
  {
    category: "Children's Learning & Practice",
    features: [
      { name: "Child Accounts", starter: "1 child", family: "Up to 3 children", master: "Up to 5 children" },
      { name: "Animated Piece Introduction Videos (child-friendly)", starter: "Included", family: "Included", master: "Included" },
      { name: "Puzzle Practice & Tactics Training", starter: "Basic (Levels 1–3)", family: "Unlimited all levels", master: "Unlimited + Personalised" },
      { name: "Parent-vs-Child Practice Game Mode", starter: "—", family: "Included", master: "Included" },
      { name: "Personalised Learning Path per Child", starter: "—", family: "—", master: "Included" },
    ]
  },
  {
    category: "Parent Community & Expert Access",
    features: [
      { name: "Parent Community Forum (ask questions, share wins)", starter: "—", family: "Included", master: "Included" },
      { name: "Live Parent Workshops with Chess Experts", starter: "—", family: "Monthly", master: "Weekly + Recordings" },
      { name: "1-on-1 Session with a Chess Master", starter: "—", family: "—", master: "Monthly (30 min)" },
      { name: "Parent Coaching Certification", starter: "—", family: "—", master: "Included (official)" },
      { name: "Tournament Preparation Kit for Parents", starter: "—", family: "—", master: "Included" },
    ]
  },
  {
    category: "Progress Tracking & Reporting",
    features: [
      { name: "Child Progress Dashboard", starter: "Basic", family: "Family view (all kids)", master: "Full detailed + Insights" },
      { name: "Weekly Email Summary to Parent", starter: "—", family: "Included", master: "Included + Recommendations" },
      { name: "Print & Share Progress Report (PDF)", starter: "—", family: "Monthly PDF", master: "Weekly + CSV export" },
      { name: "Dedicated Family Success Advisor", starter: "—", family: "—", master: "Included" },
    ]
  }
];

export const paymentFaqs = [
  {
    question: "Do I need to know chess to start teaching my child?",
    answer: "Not at all! The Parent Starter plan is specifically designed for parents who don't know chess. Every lesson comes with a clear script telling you exactly what to say, how to demonstrate each piece, and what questions to ask your child. You learn side by side with them!"
  },
  {
    question: "How much time do I need to invest as a parent per week?",
    answer: "Our Family Coach and Parent Starter plans come with ready-made 15-minute session outlines — perfectly sized for after school or before bedtime. Just 15–20 minutes, 2–3 times a week is enough to see real progress in 4–6 weeks."
  },
  {
    question: "What if I get stuck and don't know how to explain something to my child?",
    answer: "Every lesson has a 'Parent Tip' sidebar that explains the concept in plain language first, so you understand it before you teach it. The Family Coach and Master Parent plans also give you access to live expert workshops and a parent community where you can ask questions anytime."
  },
  {
    question: "Can I add more than one child to my account?",
    answer: "Yes! The Family Coach plan supports up to 3 children, and the Master Parent plan supports up to 5. Each child gets their own login, avatar, and personalised progress tracking. You see all their progress in one family dashboard."
  },
  {
    question: "Can I cancel or change my plan anytime?",
    answer: "Absolutely. Upgrade, downgrade, or cancel at any time from your dashboard with no penalties. If you cancel, access continues until the end of your billing period."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes! We offer a 100% no-questions-asked 7-Day Money-Back Guarantee. If you don't feel the materials are helping you teach your child, simply email us within 7 days for a full refund."
  }
];

export const reviews = [
  {
    name: "Priya Mehta",
    role: "Parent — teaching 7yo daughter at home",
    city: "Pune",
    rating: 5,
    text: "I had zero chess knowledge when I started. The parent scripts told me exactly what to say. Within 6 weeks my daughter was beating her classmates! The Parent Starter plan paid for itself in confidence alone.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    name: "Rajesh Nair",
    role: "Father of 3 chess-learning kids",
    city: "Hyderabad",
    rating: 5,
    text: "The Family Coach plan is a game-changer. The weekly 15-minute lesson outlines make it so easy to sit down with all three kids. The parent community is gold — I learn from other moms and dads every single day.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    name: "Deepa & Suresh Kumar",
    role: "Parents pursuing Master Parent certification",
    city: "Chennai",
    rating: 5,
    text: "Getting the Parent Coaching Certificate felt incredible. The monthly 1-on-1 with a chess master helped us design a proper training schedule for our son who now competes at the district level.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
  }
];
