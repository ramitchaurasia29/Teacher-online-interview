// Single shared dataset. Every count, total and status on every screen derives from here.

export const product = { name: "TeachLens" };

export const org = {
  name: "Sunrise Public Schools",
  chainHead: { name: "Rajiv Malhotra", title: "Director of Academics", initials: "RM" },
};

export type Branch = {
  id: string;
  name: string;
  city: string;
  principal: string;
  active: boolean;
};

export const branches: Branch[] = [
  { id: "b1", name: "Dwarka", city: "New Delhi", principal: "Meera Iyer", active: true },
  { id: "b2", name: "Rohini", city: "New Delhi", principal: "Sanjay Kapoor", active: true },
  { id: "b3", name: "Sector 57", city: "Gurugram", principal: "Anita Desai", active: true },
  { id: "b4", name: "Sector 62", city: "Noida", principal: "Harpreet Gill", active: true },
];

export const currentUser = {
  name: "Meera Iyer",
  first: "Meera",
  role: "Principal",
  branchId: "b1",
  school: "Sunrise Public School, Dwarka",
  initials: "MI",
};

export type AssessmentStatus = "Draft" | "Published" | "Closed";

export type Assessment = {
  id: string;
  position: string;
  subject: string;
  grade: string;
  board: string;
  branchId: string;
  status: AssessmentStatus;
  duration: number;
  deadline: string;
  createdBy: string;
  version: number;
  template: string;
};

export const assessments: Assessment[] = [
  { id: "a1", position: "TGT Mathematics", subject: "Mathematics", grade: "Grade 8", board: "CBSE", branchId: "b1", status: "Published", duration: 25, deadline: "21 Nov 2026", createdBy: "Meera Iyer", version: 2, template: "Grade 8 Mathematics (CBSE)" },
  { id: "a2", position: "Mathematics Teacher, middle school", subject: "Mathematics", grade: "Grade 7–8", board: "CBSE", branchId: "b1", status: "Draft", duration: 25, deadline: "—", createdBy: "Kavita Bansal", version: 1, template: "Grade 8 Mathematics (CBSE)" },
  { id: "a3", position: "Mathematics Teacher, maternity cover", subject: "Mathematics", grade: "Grade 8", board: "CBSE", branchId: "b1", status: "Published", duration: 15, deadline: "28 Nov 2026", createdBy: "Meera Iyer", version: 1, template: "Grade 8 Mathematics (CBSE)" },
  { id: "a4", position: "TGT Mathematics, July intake", subject: "Mathematics", grade: "Grade 8", board: "CBSE", branchId: "b1", status: "Closed", duration: 25, deadline: "30 Jul 2026", createdBy: "Meera Iyer", version: 1, template: "Grade 8 Mathematics (CBSE)" },
];

export type CandidateStatus = "Invited" | "Started" | "Completed" | "Report ready" | "Reviewed" | "Decided";
export type Decision = "Shortlist" | "Hold" | "Reject";

export type Candidate = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  experience: string;
  assessmentId: string;
  status: CandidateStatus;
  score?: number;
  lowConfidence?: number;
  decision?: Decision;
  invitedOn: string;
  expires?: string;
  endedBy?: "Completed all questions" | "Time limit reached" | "Ended by candidate";
  interviewedOn?: string;
  hue: number; // avatar tint index
};

export const candidates: Candidate[] = [
  { id: "c1", name: "Ananya Sharma", initials: "AS", email: "ananya.sharma@gmail.com", phone: "+91 98110 24567", experience: "6 years", assessmentId: "a1", status: "Report ready", score: 82, lowConfidence: 1, invitedOn: "8 Nov", endedBy: "Completed all questions", interviewedOn: "Today, 4:12 pm", hue: 0 },
  { id: "c2", name: "Rohit Verma", initials: "RV", email: "rohit.verma@outlook.com", phone: "+91 99583 11204", experience: "4 years", assessmentId: "a1", status: "Decided", score: 76, decision: "Shortlist", invitedOn: "8 Nov", endedBy: "Completed all questions", interviewedOn: "10 Nov", hue: 1 },
  { id: "c3", name: "Farah Khan", initials: "FK", email: "farah.khan@gmail.com", phone: "+91 98731 66520", experience: "3 years", assessmentId: "a1", status: "Report ready", score: 64, lowConfidence: 3, invitedOn: "8 Nov", endedBy: "Time limit reached", interviewedOn: "Yesterday", hue: 2 },
  { id: "c4", name: "Karthik Nair", initials: "KN", email: "karthik.nair@yahoo.in", phone: "+91 90046 73318", experience: "8 years", assessmentId: "a1", status: "Completed", invitedOn: "9 Nov", endedBy: "Completed all questions", interviewedOn: "Today, 5:40 pm", hue: 3 },
  { id: "c5", name: "Priya Menon", initials: "PM", email: "priya.menon@gmail.com", phone: "+91 98100 45129", experience: "2 years", assessmentId: "a1", status: "Started", invitedOn: "9 Nov", hue: 4 },
  { id: "c6", name: "Arjun Reddy", initials: "AR", email: "arjun.reddy@gmail.com", phone: "+91 97170 22841", experience: "5 years", assessmentId: "a1", status: "Invited", invitedOn: "6 Nov", expires: "Tomorrow", hue: 5 },
  { id: "c7", name: "Sneha Kulkarni", initials: "SK", email: "sneha.k@gmail.com", phone: "+91 98201 77310", experience: "7 years", assessmentId: "a1", status: "Decided", score: 58, decision: "Hold", invitedOn: "8 Nov", endedBy: "Completed all questions", interviewedOn: "10 Nov", hue: 0 },
  { id: "c8", name: "Vikram Singh", initials: "VS", email: "vikram.singh@gmail.com", phone: "+91 99999 40217", experience: "1 year", assessmentId: "a1", status: "Decided", score: 38, decision: "Reject", invitedOn: "8 Nov", endedBy: "Completed all questions", interviewedOn: "9 Nov", hue: 1 },
  { id: "c9", name: "Neha Joshi", initials: "NJ", email: "neha.joshi@gmail.com", phone: "+91 98734 10982", experience: "3 years", assessmentId: "a1", status: "Invited", invitedOn: "11 Nov", expires: "In 6 days", hue: 2 },
  { id: "c10", name: "Deepak Rao", initials: "DR", email: "deepak.rao@gmail.com", phone: "+91 96500 38821", experience: "9 years", assessmentId: "a1", status: "Reviewed", score: 71, invitedOn: "8 Nov", endedBy: "Completed all questions", interviewedOn: "11 Nov", hue: 3 },
  { id: "c11", name: "Imran Qureshi", initials: "IQ", email: "imran.q@gmail.com", phone: "+91 98111 52096", experience: "4 years", assessmentId: "a3", status: "Report ready", score: 45, lowConfidence: 2, invitedOn: "12 Nov", endedBy: "Ended by candidate", interviewedOn: "Today, 11:05 am", hue: 4 },
  { id: "c12", name: "Lakshmi Pillai", initials: "LP", email: "lakshmi.pillai@gmail.com", phone: "+91 94440 61287", experience: "6 years", assessmentId: "a3", status: "Invited", invitedOn: "12 Nov", expires: "In 5 days", hue: 5 },
  { id: "c13", name: "Gaurav Mehta", initials: "GM", email: "gaurav.mehta@gmail.com", phone: "+91 98990 13472", experience: "5 years", assessmentId: "a4", status: "Decided", score: 79, decision: "Shortlist", invitedOn: "2 Jul", endedBy: "Completed all questions", interviewedOn: "12 Jul", hue: 0 },
  { id: "c14", name: "Ritu Agarwal", initials: "RA", email: "ritu.agarwal@gmail.com", phone: "+91 98102 84461", experience: "3 years", assessmentId: "a4", status: "Decided", score: 61, decision: "Reject", invitedOn: "2 Jul", endedBy: "Completed all questions", interviewedOn: "14 Jul", hue: 1 },
];

export const pipelineStages: CandidateStatus[] = ["Invited", "Started", "Completed", "Report ready", "Reviewed", "Decided"];

export function candidatesFor(assessmentId: string) {
  return candidates.filter((c) => c.assessmentId === assessmentId);
}
export function assessmentById(id: string) {
  return assessments.find((a) => a.id === id) ?? assessments[0];
}
export function candidateById(id: string) {
  return candidates.find((c) => c.id === id) ?? candidates[0];
}
export function stageCounts(assessmentId: string) {
  const list = candidatesFor(assessmentId);
  return pipelineStages.map((s) => ({ stage: s, count: list.filter((c) => c.status === s).length }));
}
export function band(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Borderline";
  return "Weak";
}

// Branch-level overview counts (current branch only)
export function overviewCounts() {
  const mine = assessments.filter((a) => a.branchId === currentUser.branchId);
  const ids = new Set(mine.map((a) => a.id));
  const list = candidates.filter((c) => ids.has(c.assessmentId) && mine.find((a) => a.id === c.assessmentId)?.status !== "Closed");
  return {
    active: mine.filter((a) => a.status === "Published").length,
    invited: list.length,
    completed: list.filter((c) => ["Completed", "Report ready", "Reviewed", "Decided"].includes(c.status)).length,
    pending: list.filter((c) => c.status === "Invited" || c.status === "Started").length,
    reportsReady: list.filter((c) => c.score !== undefined).length,
    awaitingReview: list.filter((c) => c.status === "Report ready").length,
  };
}

// ---------- Competencies & report ----------

export type Competency = { id: string; name: string; checks: string; weight: number };

export const competencies: Competency[] = [
  { id: "sk", name: "Subject knowledge", checks: "Is the content correct and deep enough for the grade", weight: 30 },
  { id: "tm", name: "Teaching methodology", checks: "Choice of methods, examples, activities and checks for understanding", weight: 25 },
  { id: "ce", name: "Concept explanation", checks: "Can the candidate explain a topic at the level of a student in this grade", weight: 20 },
  { id: "cm", name: "Classroom management", checks: "Handling misconceptions, interruptions and mixed ability", weight: 10 },
  { id: "co", name: "Communication", checks: "Clarity, structure and language suited to students", weight: 10 },
  { id: "cu", name: "Curriculum knowledge", checks: "Awareness of the syllabus, learning outcomes and sequence", weight: 5 },
];

export const rubricScale = [
  { level: 0, label: "No relevant response", shows: "Silence, off-topic, or no attempt" },
  { level: 1, label: "Significant gaps", shows: "Major errors or a misconception left uncorrected" },
  { level: 2, label: "Basic understanding", shows: "Mostly correct but shallow, no example, not adapted to the grade" },
  { level: 3, label: "Good understanding", shows: "Correct, clear, with an example suited to the grade" },
  { level: 4, label: "Excellent", shows: "Correct, grade-appropriate, anticipates misconceptions and checks student understanding" },
];

export type ReportAnswer = {
  id: string;
  n: number;
  competencyId: string;
  question: string;
  score: number; // 0-4
  timestamp: string;
  start: number; // seconds
  length: number;
  transcript: { speaker: "AI" | "Candidate"; text: string; highlight?: boolean; time: string }[];
  reasoning: string;
  lowConfidence?: string;
  audioWarning?: boolean;
};

export const reportAnswers: ReportAnswer[] = [
  {
    id: "q1", n: 1, competencyId: "sk",
    question: "Why is the product of two negative rational numbers positive? Explain it the way you would to your class.",
    score: 4, timestamp: "02:14", start: 134, length: 96,
    transcript: [
      { speaker: "AI", time: "02:14", text: "Why is the product of two negative rational numbers positive? Explain it the way you would to your class." },
      { speaker: "Candidate", time: "02:31", text: "I'd start with a pattern on the board. Minus two times three is minus six, minus two times two is minus four, minus two times one is minus two. Every step the answer goes up by two." },
      { speaker: "Candidate", time: "02:58", text: "So when we keep the pattern going, minus two times minus one has to be plus two. The children see it before I say the rule.", highlight: true },
      { speaker: "Candidate", time: "03:22", text: "Then I'd ask them to predict minus two times minus three on a slate, so I know who has it." },
    ],
    reasoning: "Correct reasoning built from a number pattern rather than a stated rule. Grade-appropriate, and ends with a check for understanding, which meets level 4.",
  },
  {
    id: "q2", n: 2, competencyId: "ce",
    question: "Explain linear equations in one variable to a Grade 8 student meeting them for the first time.",
    score: 3, timestamp: "05:40", start: 340, length: 118,
    transcript: [
      { speaker: "AI", time: "05:40", text: "Explain linear equations in one variable to a Grade 8 student meeting them for the first time." },
      { speaker: "Candidate", time: "05:52", text: "I'd use a weighing balance. If one side has a bag of marbles and three loose marbles, and the other side has eleven, the bag must hold eight.", highlight: true },
      { speaker: "Candidate", time: "06:30", text: "Whatever you do to one pan, you do to the other, so it stays balanced. That's all solving is." },
    ],
    reasoning: "Clear, concrete analogy suited to the grade. Does not anticipate the common error of changing only one side, so it stops at level 3.",
  },
  {
    id: "q3", n: 3, competencyId: "tm",
    question: "Plan a 10-minute activity to introduce squares and square roots.",
    score: 3, timestamp: "09:05", start: 545, length: 140,
    transcript: [
      { speaker: "AI", time: "09:05", text: "Plan a 10-minute activity to introduce squares and square roots." },
      { speaker: "Candidate", time: "09:20", text: "Groups of four get square tiles. They build the biggest squares they can with 4, 9, 12 and 16 tiles, and note which ones work.", highlight: true },
      { speaker: "Candidate", time: "10:15", text: "Then the side length becomes the square root. I'd close with an exit question: can you make a square from 20 tiles?" },
      { speaker: "AI", time: "10:48", text: "How would you support a group that finishes early?" },
      { speaker: "Candidate", time: "10:55", text: "They'd try to find numbers between 1 and 100 that are perfect squares and look for a pattern in the last digits." },
    ],
    reasoning: "Hands-on, well sequenced, with an exit check and an extension. Time management across groups is not addressed, so it stops at level 3.",
  },
  {
    id: "q4", n: 4, competencyId: "cm",
    question: "Half the class has finished the worksheet and is getting restless while others are still struggling. What do you do?",
    score: 2, timestamp: "13:12", start: 792, length: 84,
    transcript: [
      { speaker: "AI", time: "13:12", text: "Half the class has finished the worksheet and is getting restless while others are still struggling. What do you do?" },
      { speaker: "Candidate", time: "13:25", text: "I would give the fast ones some extra questions from the book and go around helping the others.", highlight: true },
      { speaker: "AI", time: "13:51", text: "What if the early finishers stay noisy?" },
      { speaker: "Candidate", time: "13:58", text: "Maybe make them help their partners. I'd have to see the class." },
    ],
    reasoning: "Reasonable but generic. No plan for routines or for pairing strategically, and the follow-up answer stays vague. Audio dropped for about 4 seconds at 13:44.",
    lowConfidence: "Audio dropped for 4 seconds during this answer",
    audioWarning: true,
  },
  {
    id: "q5", n: 5, competencyId: "co",
    question: "A student solves 2x + 5 = 15 and gets x = 10. How do you help?",
    score: 3, timestamp: "16:30", start: 990, length: 102,
    transcript: [
      { speaker: "AI", time: "16:30", text: "A student solves 2x + 5 = 15 and gets x = 10. How do you help?" },
      { speaker: "Candidate", time: "16:44", text: "I wouldn't tell them it's wrong straight away. I'd ask them to put ten back into the equation and see what they get.", highlight: true },
      { speaker: "Candidate", time: "17:10", text: "Twenty-five isn't fifteen, so they find the mistake themselves. Then we look at which step they skipped." },
    ],
    reasoning: "Short, clear and student-centred language. Uses substitution to let the student self-correct, which fits level 3.",
  },
  {
    id: "q6", n: 6, competencyId: "cu",
    question: "What should students already know before you teach Direct and Inverse Proportions in Grade 8?",
    score: 3, timestamp: "19:48", start: 1188, length: 76,
    transcript: [
      { speaker: "AI", time: "19:48", text: "What should students already know before you teach Direct and Inverse Proportions in Grade 8?" },
      { speaker: "Candidate", time: "20:02", text: "Ratio and proportion from Grade 7, and they should be comfortable with unitary method and reading simple tables.", highlight: true },
      { speaker: "Candidate", time: "20:30", text: "It also links to Introduction to Graphs later in the year, so I'd keep the tables we make." },
    ],
    reasoning: "Accurate prerequisites and a forward link in the syllabus. Does not mention learning outcomes, so level 3.",
  },
];

// competency scores out of 4 for the featured report (Ananya Sharma)
export const reportCompetencyScores: Record<string, number> = {
  sk: 3.5, tm: 3.2, ce: 3.4, cm: 2.6, co: 3.3, cu: 2.8,
};

export function overallFrom(scores: Record<string, number>) {
  return Math.round(competencies.reduce((sum, c) => sum + c.weight * ((scores[c.id] ?? 0) / 4), 0));
}

export const reportSummary = {
  strengths: [
    "Builds concepts from patterns and concrete objects before stating rules",
    "Checks understanding at the end of most explanations",
    "Lets students find their own errors by substitution",
  ],
  concerns: [
    "Classroom management answers stay general, with no routines described",
    "Rarely names the misconception a student is likely to hold",
  ],
  nextInterview: [
    "Walk us through how you'd run a mixed-ability Grade 8 class for the first week",
    "Which misconception about linear equations do you see most, and how do you prevent it?",
  ],
};

export type Activity = { id: string; who: string; text: string; detail?: string; time: string; kind: "report" | "decision" | "invite" | "publish" | "comment" | "complete" };

export const recentActivity: Activity[] = [
  { id: "ac1", who: "TeachLens", text: "Report ready for Ananya Sharma", detail: "TGT Mathematics", time: "12 min ago", kind: "report" },
  { id: "ac2", who: "Karthik Nair", text: "Karthik Nair finished the interview", detail: "Report generating", time: "25 min ago", kind: "complete" },
  { id: "ac3", who: "Kavita Bansal", text: "Kavita Bansal asked you to publish a draft", detail: "Mathematics Teacher, middle school", time: "1 hr ago", kind: "publish" },
  { id: "ac4", who: "Meera Iyer", text: "You shortlisted Rohit Verma", detail: "Score 76", time: "Yesterday", kind: "decision" },
  { id: "ac5", who: "Kavita Bansal", text: "Kavita Bansal invited 2 candidates", detail: "Mathematics Teacher, maternity cover", time: "Yesterday", kind: "invite" },
];

export type TeamMember = { id: string; name: string; initials: string; email: string; role: "Principal" | "HR / Coordinator"; status: "Active" | "Invited"; lastActive: string };

export const team: TeamMember[] = [
  { id: "t1", name: "Meera Iyer", initials: "MI", email: "meera.iyer@sunriseschools.in", role: "Principal", status: "Active", lastActive: "Now" },
  { id: "t2", name: "Kavita Bansal", initials: "KB", email: "kavita.bansal@sunriseschools.in", role: "HR / Coordinator", status: "Active", lastActive: "1 hr ago" },
  { id: "t3", name: "Suresh Pandey", initials: "SP", email: "suresh.pandey@sunriseschools.in", role: "HR / Coordinator", status: "Active", lastActive: "3 days ago" },
  { id: "t4", name: "Pooja Saxena", initials: "PS", email: "pooja.saxena@sunriseschools.in", role: "HR / Coordinator", status: "Invited", lastActive: "—" },
];

export type QuestionSource = "AI-generated" | "Edited" | "School-approved" | "Chain-approved";

export type LibraryQuestion = { id: string; text: string; competencyId: string; topic: string; difficulty: "Basic" | "Standard" | "Advanced"; source: QuestionSource; usedIn: number };

export const libraryQuestions: LibraryQuestion[] = [
  { id: "l1", text: "Why is the product of two negative rational numbers positive? Explain it the way you would to your class.", competencyId: "sk", topic: "Rational Numbers", difficulty: "Standard", source: "School-approved", usedIn: 3 },
  { id: "l2", text: "Explain linear equations in one variable to a Grade 8 student meeting them for the first time.", competencyId: "ce", topic: "Linear Equations in One Variable", difficulty: "Standard", source: "School-approved", usedIn: 3 },
  { id: "l3", text: "Plan a 10-minute activity to introduce squares and square roots.", competencyId: "tm", topic: "Squares and Square Roots", difficulty: "Standard", source: "Edited", usedIn: 2 },
  { id: "l4", text: "Half the class has finished the worksheet and is getting restless while others are still struggling. What do you do?", competencyId: "cm", topic: "Mixed ability", difficulty: "Standard", source: "AI-generated", usedIn: 2 },
  { id: "l5", text: "A student solves 2x + 5 = 15 and gets x = 10. How do you help?", competencyId: "co", topic: "Linear Equations in One Variable", difficulty: "Basic", source: "Chain-approved", usedIn: 4 },
  { id: "l6", text: "What should students already know before you teach Direct and Inverse Proportions in Grade 8?", competencyId: "cu", topic: "Direct and Inverse Proportions", difficulty: "Standard", source: "AI-generated", usedIn: 1 },
  { id: "l7", text: "A student insists every quadrilateral with four equal sides is a square. How do you respond?", competencyId: "cm", topic: "Understanding Quadrilaterals", difficulty: "Standard", source: "AI-generated", usedIn: 0 },
  { id: "l8", text: "How would you show a class why the volume of a cuboid is length × breadth × height?", competencyId: "ce", topic: "Mensuration", difficulty: "Advanced", source: "Edited", usedIn: 1 },
  { id: "l9", text: "Explain why a⁰ = 1 for any non-zero a without just stating the rule.", competencyId: "sk", topic: "Exponents and Powers", difficulty: "Advanced", source: "School-approved", usedIn: 2 },
];

export const grade8Chapters = [
  "Rational Numbers",
  "Linear Equations in One Variable",
  "Understanding Quadrilaterals",
  "Data Handling",
  "Squares and Square Roots",
  "Cubes and Cube Roots",
  "Comparing Quantities",
  "Algebraic Expressions and Identities",
  "Mensuration",
  "Exponents and Powers",
  "Direct and Inverse Proportions",
  "Factorisation",
  "Introduction to Graphs",
];

// ---------- Chain head ----------

export type BranchStats = { branchId: string; open: number; invited: number; completed: number; awaitingReview: number; avgDaysToReview: number; oldestUnreviewed?: string };

export const branchStats: BranchStats[] = [
  { branchId: "b1", open: 2, invited: 12, completed: 8, awaitingReview: 3, avgDaysToReview: 1.2 },
  { branchId: "b2", open: 1, invited: 9, completed: 6, awaitingReview: 5, avgDaysToReview: 4.6, oldestUnreviewed: "9 days" },
  { branchId: "b3", open: 1, invited: 7, completed: 3, awaitingReview: 0, avgDaysToReview: 0.8 },
  { branchId: "b4", open: 0, invited: 0, completed: 0, awaitingReview: 0, avgDaysToReview: 0 },
];

export type Template = { id: string; name: string; subject: string; grade: string; version: number; locked: string[]; branches: string[]; usedBy: number; updated: string; source: "TeachLens" | "Chain" };

export const templates: Template[] = [
  { id: "tp1", name: "Grade 8 Mathematics (CBSE)", subject: "Mathematics", grade: "Grade 8", version: 3, locked: ["Rubrics", "Weights"], branches: ["b1", "b2", "b3", "b4"], usedBy: 5, updated: "2 Nov 2026", source: "Chain" },
  { id: "tp2", name: "Grade 8 Mathematics (CBSE)", subject: "Mathematics", grade: "Grade 8", version: 1, locked: [], branches: [], usedBy: 0, updated: "Platform default", source: "TeachLens" },
  { id: "tp3", name: "Grade 6–7 Mathematics (CBSE)", subject: "Mathematics", grade: "Grade 6–7", version: 1, locked: ["Rubrics"], branches: ["b1", "b2"], usedBy: 1, updated: "28 Oct 2026", source: "Chain" },
];

export const crossBranchCandidates = [
  { id: "x1", name: "Ananya Sharma", initials: "AS", branchId: "b1", score: 82, scores: { sk: 3.5, tm: 3.2, ce: 3.4, cm: 2.6, co: 3.3, cu: 2.8 }, version: 3, hue: 0 },
  { id: "x2", name: "Mohit Bhatia", initials: "MB", branchId: "b2", score: 78, scores: { sk: 3.6, tm: 2.9, ce: 3.1, cm: 2.8, co: 3.0, cu: 3.2 }, version: 3, hue: 3 },
  { id: "x3", name: "Rohit Verma", initials: "RV", branchId: "b1", score: 76, scores: { sk: 3.2, tm: 3.0, ce: 3.0, cm: 2.9, co: 2.8, cu: 3.0 }, version: 3, hue: 1 },
  { id: "x4", name: "Shalini Rao", initials: "SR", branchId: "b3", score: 69, scores: { sk: 2.8, tm: 2.7, ce: 2.9, cm: 2.6, co: 2.7, cu: 2.6 }, version: 2, hue: 5 },
];

export const billing = {
  plan: "School · Pilot",
  interviewsUsed: 9,
  interviewsIncluded: 40,
  renews: "1 Dec 2026",
  invoices: [] as { id: string; date: string; amount: string; status: string }[],
};
