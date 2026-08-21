import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  GraduationCap,
  HelpCircle,
  Clock,
  Calendar,
  Timer as TimerIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  ArrowLeft,
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  BookOpenCheck,
  Award,
  TrendingUp,
  CircleDot,
} from "lucide-react";

/* ==================================================
   1. TYPES
   ================================================== */

type AssessmentType = "exam" | "quiz";
type AssessmentStatus = "upcoming" | "ongoing" | "completed" | "missed";
type QuestionType = "multiple-choice" | "true-false" | "short-answer";
type ExamKind = "Midterm" | "Final" | "Quiz" | "Practice";

interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

interface Assessment {
  id: string;
  courseCode: string;
  courseName: string;
  courseColor: string;
  title: string;
  type: AssessmentType;
  kind: ExamKind;
  status: AssessmentStatus;
  date: string;
  dateSort: number;
  time: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  attemptsAllowed: number;
  attemptsUsed: number;
  questionsCount: number;
  dueLabel?: string;
  reviewAllowed: boolean;
  scoreEarned?: number;
  scoreCorrect?: number;
  scoreIncorrect?: number;
  timeUsedLabel?: string;
  questions: Question[];
}

/* ==================================================
   2. MOCK DATA (swap for API calls later)
   ================================================== */

const mcQuestions: Question[] = [
  {
    id: "q1",
    type: "multiple-choice",
    prompt: "Which normal form eliminates partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctAnswer: "2NF",
    explanation: "2NF removes partial dependencies on a composite primary key.",
  },
  {
    id: "q2",
    type: "true-false",
    prompt: "A primary key can contain NULL values.",
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "Primary keys must be unique and non-null by definition.",
  },
  {
    id: "q3",
    type: "multiple-choice",
    prompt: "What does SQL JOIN do?",
    options: ["Deletes rows", "Combines rows from two or more tables", "Creates a table", "Sorts a table"],
    correctAnswer: "Combines rows from two or more tables",
    explanation: "JOIN combines related rows from multiple tables based on a condition.",
  },
  {
    id: "q4",
    type: "short-answer",
    prompt: "Name the command used to remove a table permanently in SQL.",
    correctAnswer: "DROP TABLE",
    explanation: "DROP TABLE permanently deletes a table and its data.",
  },
  {
    id: "q5",
    type: "multiple-choice",
    prompt: "Which of the following is a valid transaction property (ACID)?",
    options: ["Atomicity", "Availability", "Accuracy", "Access"],
    correctAnswer: "Atomicity",
    explanation: "ACID stands for Atomicity, Consistency, Isolation, Durability.",
  },
];

function buildQuestions(count: number): Question[] {
  const list: Question[] = [];
  for (let i = 0; i < count; i++) {
    list.push({ ...mcQuestions[i % mcQuestions.length], id: `q${i + 1}` });
  }
  return list;
}

const MOCK_EXAMS: Assessment[] = [
  {
    id: "ex-1",
    courseCode: "CS-301",
    courseName: "Database Systems",
    courseColor: "#1EC2BC",
    title: "Midterm Exam",
    type: "exam",
    kind: "Midterm",
    status: "ongoing",
    date: "Aug 21, 2026",
    dateSort: 0,
    time: "10:00 AM",
    durationMinutes: 120,
    totalMarks: 100,
    passingMarks: 40,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    questionsCount: 30,
    reviewAllowed: true,
    questions: buildQuestions(30),
  },
  {
    id: "ex-2",
    courseCode: "CS-302",
    courseName: "Web Engineering",
    courseColor: "#E7714A",
    title: "Final Exam",
    type: "exam",
    kind: "Final",
    status: "upcoming",
    date: "Sep 8, 2026",
    dateSort: 18,
    time: "9:00 AM",
    durationMinutes: 150,
    totalMarks: 100,
    passingMarks: 40,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    questionsCount: 40,
    reviewAllowed: true,
    questions: buildQuestions(40),
  },
  {
    id: "ex-3",
    courseCode: "MATH-201",
    courseName: "Discrete Mathematics",
    courseColor: "#9277ff",
    title: "Midterm Exam",
    type: "exam",
    kind: "Midterm",
    status: "upcoming",
    date: "Aug 26, 2026",
    dateSort: 5,
    time: "1:00 PM",
    durationMinutes: 90,
    totalMarks: 80,
    passingMarks: 32,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    questionsCount: 25,
    reviewAllowed: true,
    questions: buildQuestions(25),
  },
  {
    id: "ex-4",
    courseCode: "CS-305",
    courseName: "Artificial Intelligence",
    courseColor: "#65e6f4",
    title: "Final Exam",
    type: "exam",
    kind: "Final",
    status: "completed",
    date: "Aug 5, 2026",
    dateSort: -16,
    time: "9:00 AM",
    durationMinutes: 120,
    totalMarks: 100,
    passingMarks: 40,
    attemptsAllowed: 1,
    attemptsUsed: 1,
    questionsCount: 30,
    reviewAllowed: true,
    scoreEarned: 93,
    scoreCorrect: 28,
    scoreIncorrect: 2,
    timeUsedLabel: "1h 45m",
    questions: buildQuestions(30),
  },
  {
    id: "ex-5",
    courseCode: "CS-301",
    courseName: "Database Systems",
    courseColor: "#1EC2BC",
    title: "Quiz 3 — Normalization",
    type: "exam",
    kind: "Midterm",
    status: "completed",
    date: "Jul 30, 2026",
    dateSort: -22,
    time: "10:00 AM",
    durationMinutes: 60,
    totalMarks: 50,
    passingMarks: 20,
    attemptsAllowed: 1,
    attemptsUsed: 1,
    questionsCount: 15,
    reviewAllowed: true,
    scoreEarned: 82,
    scoreCorrect: 12,
    scoreIncorrect: 3,
    timeUsedLabel: "48m",
    questions: buildQuestions(15),
  },
  {
    id: "ex-6",
    courseCode: "CS-302",
    courseName: "Web Engineering",
    courseColor: "#E7714A",
    title: "Sprint Assessment",
    type: "exam",
    kind: "Midterm",
    status: "completed",
    date: "Jul 20, 2026",
    dateSort: -32,
    time: "11:00 AM",
    durationMinutes: 90,
    totalMarks: 100,
    passingMarks: 40,
    attemptsAllowed: 1,
    attemptsUsed: 1,
    questionsCount: 30,
    reviewAllowed: false,
    scoreEarned: 76,
    scoreCorrect: 22,
    scoreIncorrect: 8,
    timeUsedLabel: "1h 10m",
    questions: buildQuestions(30),
  },
  {
    id: "ex-7",
    courseCode: "MATH-201",
    courseName: "Discrete Mathematics",
    courseColor: "#9277ff",
    title: "Quiz 1 — Set Theory",
    type: "exam",
    kind: "Midterm",
    status: "completed",
    date: "Jul 12, 2026",
    dateSort: -40,
    time: "1:00 PM",
    durationMinutes: 40,
    totalMarks: 40,
    passingMarks: 16,
    attemptsAllowed: 1,
    attemptsUsed: 1,
    questionsCount: 12,
    reviewAllowed: true,
    scoreEarned: 88,
    scoreCorrect: 11,
    scoreIncorrect: 1,
    timeUsedLabel: "31m",
    questions: buildQuestions(12),
  },
  {
    id: "ex-8",
    courseCode: "CS-305",
    courseName: "Artificial Intelligence",
    courseColor: "#65e6f4",
    title: "Midterm Exam",
    type: "exam",
    kind: "Midterm",
    status: "missed",
    date: "Jul 3, 2026",
    dateSort: -49,
    time: "9:00 AM",
    durationMinutes: 120,
    totalMarks: 100,
    passingMarks: 40,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    questionsCount: 30,
    reviewAllowed: false,
    questions: buildQuestions(30),
  },
];

const MOCK_QUIZZES: Assessment[] = [
  {
    id: "qz-1",
    courseCode: "CS-301",
    courseName: "Database Systems",
    courseColor: "#1EC2BC",
    title: "SQL Basics Quiz",
    type: "quiz",
    kind: "Practice",
    status: "upcoming",
    date: "Aug 23, 2026",
    dateSort: 2,
    time: "Anytime",
    durationMinutes: 20,
    totalMarks: 10,
    passingMarks: 5,
    attemptsAllowed: 3,
    attemptsUsed: 0,
    questionsCount: 10,
    dueLabel: "Due in 2 days",
    reviewAllowed: true,
    questions: buildQuestions(10),
  },
  {
    id: "qz-2",
    courseCode: "CS-302",
    courseName: "Web Engineering",
    courseColor: "#E7714A",
    title: "HTML & CSS Quiz",
    type: "quiz",
    kind: "Practice",
    status: "upcoming",
    date: "Aug 25, 2026",
    dateSort: 4,
    time: "Anytime",
    durationMinutes: 15,
    totalMarks: 10,
    passingMarks: 5,
    attemptsAllowed: 2,
    attemptsUsed: 0,
    questionsCount: 8,
    dueLabel: "Due in 4 days",
    reviewAllowed: true,
    questions: buildQuestions(8),
  },
  {
    id: "qz-3",
    courseCode: "CS-305",
    courseName: "Artificial Intelligence",
    courseColor: "#65e6f4",
    title: "AI Fundamentals Quiz",
    type: "quiz",
    kind: "Practice",
    status: "upcoming",
    date: "Aug 28, 2026",
    dateSort: 7,
    time: "Anytime",
    durationMinutes: 25,
    totalMarks: 20,
    passingMarks: 10,
    attemptsAllowed: 3,
    attemptsUsed: 0,
    questionsCount: 15,
    dueLabel: "Due in 1 week",
    reviewAllowed: true,
    questions: buildQuestions(15),
  },
  {
    id: "qz-4",
    courseCode: "MATH-201",
    courseName: "Discrete Mathematics",
    courseColor: "#9277ff",
    title: "Logic and Sets Quiz",
    type: "quiz",
    kind: "Practice",
    status: "completed",
    date: "Aug 10, 2026",
    dateSort: -11,
    time: "Anytime",
    durationMinutes: 20,
    totalMarks: 10,
    passingMarks: 5,
    attemptsAllowed: 3,
    attemptsUsed: 1,
    questionsCount: 10,
    reviewAllowed: true,
    scoreEarned: 90,
    scoreCorrect: 9,
    scoreIncorrect: 1,
    timeUsedLabel: "14m",
    questions: buildQuestions(10),
  },
  {
    id: "qz-5",
    courseCode: "CS-301",
    courseName: "Database Systems",
    courseColor: "#1EC2BC",
    title: "ER Diagrams Quiz",
    type: "quiz",
    kind: "Practice",
    status: "completed",
    date: "Aug 2, 2026",
    dateSort: -19,
    time: "Anytime",
    durationMinutes: 15,
    totalMarks: 10,
    passingMarks: 5,
    attemptsAllowed: 2,
    attemptsUsed: 2,
    questionsCount: 8,
    reviewAllowed: true,
    scoreEarned: 95,
    scoreCorrect: 8,
    scoreIncorrect: 0,
    timeUsedLabel: "9m",
    questions: buildQuestions(8),
  },
];

/* ==================================================
   3. SHARED HELPERS
   ================================================== */

const statusMeta: Record<AssessmentStatus, { label: string; badge: string; icon: typeof CircleDot }> = {
  upcoming: { label: "Upcoming", badge: "bg-blue-500/10 text-blue-300 border-blue-500/20", icon: Calendar },
  ongoing: { label: "Ongoing", badge: "bg-teal/10 text-teal border-teal/20", icon: CircleDot },
  completed: { label: "Completed", badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20", icon: CheckCircle2 },
  missed: { label: "Missed", badge: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
};

function formatClock(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")} : ${String(m).padStart(2, "0")} : ${String(sec).padStart(2, "0")}`;
}

/* ==================================================
   4. SMALL SHARED UI PIECES
   ================================================== */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: typeof Calendar;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-text">{label}</span>
        <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-teal shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className="text-xl font-display font-semibold text-cream">{value}</div>
      <div className="text-xs text-slate-text mt-0.5 truncate">{sub}</div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 animate-pulse">
      <div className="h-3 w-16 bg-white/8 rounded mb-3" />
      <div className="h-6 w-10 bg-white/8 rounded mb-2" />
      <div className="h-2.5 w-20 bg-white/8 rounded" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-1 self-stretch rounded-full bg-white/8" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-3 w-24 bg-white/8 rounded" />
          <div className="h-4 w-48 bg-white/8 rounded" />
          <div className="h-3 w-64 bg-white/8 rounded" />
        </div>
        <div className="h-8 w-24 bg-white/8 rounded-full shrink-0" />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AssessmentStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${meta.badge}`}>
      <Icon className="w-2.5 h-2.5" />
      {meta.label}
    </span>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-white/8 py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-slate-text">
        <BookOpenCheck className="w-5 h-5" />
      </div>
      <div className="text-sm text-cream font-medium">{title}</div>
      {subtitle && <div className="text-xs text-slate-text mt-1">{subtitle}</div>}
    </div>
  );
}

/* ==================================================
   5. FILTER TOOLBAR (shared by exams + quizzes)
   ================================================== */

type SortKey = "date" | "course" | "type";

function FilterBar({
  query,
  onQuery,
  placeholder,
  courses,
  course,
  onCourse,
  status,
  onStatus,
  statusOptions,
  sortKey,
  onSort,
  view,
  onView,
}: {
  query: string;
  onQuery: (v: string) => void;
  placeholder: string;
  courses: string[];
  course: string;
  onCourse: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
  statusOptions: { label: string; value: string }[];
  sortKey: SortKey;
  onSort: (v: SortKey) => void;
  view: "list" | "grid";
  onView: (v: "list" | "grid") => void;
}) {
  const [courseOpen, setCourseOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const courseRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (courseRef.current && !courseRef.current.contains(e.target as Node)) setCourseOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const sortLabels: Record<SortKey, string> = { date: "Date", course: "Course", type: "Type" };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
      <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
        <Search className="w-4 h-4 text-slate-text shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
        <div className="relative shrink-0" ref={courseRef}>
          <button
            onClick={() => setCourseOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors max-w-[160px]"
          >
            <span className="truncate">{course}</span>
            <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${courseOpen ? "rotate-180" : ""}`} />
          </button>
          {courseOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
              {courses.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onCourse(c);
                    setCourseOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm truncate transition-colors ${
                    c === course ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative shrink-0" ref={statusRef}>
          <button
            onClick={() => setStatusOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors"
          >
            {statusOptions.find((s) => s.value === status)?.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
          </button>
          {statusOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-44 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
              {statusOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    onStatus(s.value);
                    setStatusOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    s.value === status ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative shrink-0" ref={sortRef}>
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors"
          >
            Sort · {sortLabels[sortKey]}
            <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-36 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
              {(Object.keys(sortLabels) as SortKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    onSort(k);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    k === sortKey ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {sortLabels[k]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 md:ml-auto border border-white/10 rounded-full p-1 shrink-0">
        <button
          onClick={() => onView("list")}
          className={`p-1.5 rounded-full transition-colors ${view === "list" ? "bg-white/10 text-cream" : "text-slate-text hover:text-cream"}`}
          aria-label="List view"
        >
          <ListIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onView("grid")}
          className={`p-1.5 rounded-full transition-colors ${view === "grid" ? "bg-white/10 text-cream" : "text-slate-text hover:text-cream"}`}
          aria-label="Grid view"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ==================================================
   6. ASSESSMENT CARD (exam + quiz share the same card)
   ================================================== */

function AssessmentCard({
  item,
  onSelect,
  onAction,
  view,
}: {
  item: Assessment;
  onSelect: (a: Assessment) => void;
  onAction: (a: Assessment) => void;
  view: "list" | "grid";
}) {
  const actionLabel =
    item.status === "ongoing"
      ? item.type === "exam"
        ? "Continue Exam"
        : "Continue Quiz"
      : item.status === "completed"
      ? item.type === "exam"
        ? "View Result"
        : "Review"
      : item.status === "missed"
      ? "View Details"
      : item.type === "exam"
      ? "View Details"
      : "Start Quiz";

  return (
    <button
      onClick={() => onSelect(item)}
      className={`text-left w-full rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-colors p-4 sm:p-5 ${
        view === "grid" ? "h-full flex flex-col" : ""
      }`}
    >
      <div className="flex items-start gap-3 flex-1">
        <span className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: item.courseColor }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="min-w-0">
              <div className="text-xs text-slate-text">
                {item.courseCode} · {item.courseName}
              </div>
              <h3 className="text-sm font-medium text-cream mt-0.5 truncate">{item.title}</h3>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-text mb-3">
            <span className="inline-flex items-center gap-1">
              {item.type === "exam" ? <GraduationCap className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
              {item.kind} · {item.type === "exam" ? `${item.totalMarks} Marks` : `${item.questionsCount} Questions`}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {item.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.time} · {item.durationMinutes >= 60 ? `${Math.round(item.durationMinutes / 60)} Hours` : `${item.durationMinutes} Minutes`}
            </span>
            {item.dueLabel && item.status === "upcoming" && (
              <span className="text-teal">{item.dueLabel}</span>
            )}
            {item.type === "quiz" && (
              <span>
                Attempts: {item.attemptsUsed} / {item.attemptsAllowed}
              </span>
            )}
          </div>

          {item.status === "completed" && item.scoreEarned !== undefined && (
            <div className="text-xs font-medium text-teal mb-3">
              Score: {item.scoreCorrect}/{item.questionsCount} ({item.scoreEarned}%)
            </div>
          )}

          <div className="mt-auto">
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                item.status === "missed"
                  ? "bg-white/5 text-slate-text"
                  : "bg-teal/10 text-teal border border-teal/20 hover:bg-teal/15"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onAction(item);
              }}
            >
              {actionLabel}
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ==================================================
   7. DETAILS PANEL (right side on desktop, sheet on mobile)
   ================================================== */

function DetailsPanel({
  item,
  onClose,
  onStart,
}: {
  item: Assessment | null;
  onClose: () => void;
  onStart: (a: Assessment) => void;
}) {
  const [tab, setTab] = useState<"details" | "leaderboard">("details");

  useEffect(() => {
    setTab("details");
  }, [item?.id]);

  if (!item) return null;

  const rows: { label: string; value: string }[] = [
    { label: "Date", value: item.date },
    {
      label: "Time",
      value:
        item.type === "exam"
          ? item.time
          : item.time === "Anytime"
          ? "Anytime before due date"
          : item.time,
    },
    {
      label: "Duration",
      value: item.durationMinutes >= 60 ? `${Math.round(item.durationMinutes / 60)} Hours` : `${item.durationMinutes} Minutes`,
    },
    ...(item.type === "quiz" ? [{ label: "Total Questions", value: String(item.questionsCount) }] : []),
    { label: "Total Marks", value: String(item.totalMarks) },
    { label: "Passing Marks", value: String(item.passingMarks) },
    { label: "Exam Type", value: item.kind },
    { label: "Attempts", value: `${item.attemptsUsed} of ${item.attemptsAllowed}` },
  ];

  const canStart = item.status === "upcoming" || item.status === "ongoing";
  const primaryLabel = item.status === "ongoing" ? "Continue Exam" : "Start Exam";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
        className="fixed lg:sticky top-0 right-0 z-50 lg:z-0 h-full lg:h-auto w-full sm:w-[400px] lg:w-[360px] shrink-0 bg-ink lg:bg-transparent border-l border-white/8 lg:border-l-0 overflow-y-auto"
      >
        <div className="lg:rounded-2xl lg:border lg:border-white/8 lg:bg-white/[0.02] p-5 h-full lg:h-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-display font-semibold text-cream">{item.title}</h3>
              <div className="text-xs text-slate-text mt-0.5">
                {item.courseCode} · {item.courseName}
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-slate-text hover:text-cream transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <StatusBadge status={item.status} />
          </div>

          {item.type === "quiz" && (
            <div className="flex items-center gap-1 border border-white/10 rounded-full p-1 mb-4 w-fit">
              <button
                onClick={() => setTab("details")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  tab === "details" ? "bg-white/10 text-cream" : "text-slate-text hover:text-cream"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setTab("leaderboard")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  tab === "leaderboard" ? "bg-white/10 text-cream" : "text-slate-text hover:text-cream"
                }`}
              >
                Leaderboard
              </button>
            </div>
          )}

          {tab === "details" ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {rows.map((r) => (
                  <div key={r.label} className="rounded-xl border border-white/8 p-3">
                    <div className="text-[10px] text-slate-text uppercase tracking-wide mb-1">{r.label}</div>
                    <div className="text-sm text-cream">{r.value}</div>
                  </div>
                ))}
              </div>

              {item.status === "completed" && item.scoreEarned !== undefined && (
                <div className="rounded-xl border border-teal/20 bg-teal/[0.04] p-4 mb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-teal text-sm font-medium">
                      <Award className="w-4 h-4" />
                      Score: {item.scoreEarned}%
                    </div>
                    <span className="text-xs text-slate-text">
                      {item.scoreCorrect} correct · {item.scoreIncorrect} incorrect
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs font-medium text-cream mb-2">Exam Instructions</div>
                <ul className="space-y-1.5 text-xs text-slate-text">
                  <li>• Read every question carefully.</li>
                  <li>• Do not refresh the page during the exam.</li>
                  <li>• The exam will automatically submit when time expires.</li>
                  <li>• Make sure your internet connection is stable.</li>
                </ul>
              </div>

              {canStart && (
                <button
                  onClick={() => onStart(item)}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2.5 rounded-full hover:bg-teal-glow transition-colors"
                >
                  {primaryLabel}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {item.status === "completed" && (
                <button
                  onClick={() => onStart(item)}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-white/5 text-cream text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
                >
                  View Result
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-white/8 p-6 text-center text-xs text-slate-text">
              Leaderboard not available for this quiz.
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ==================================================
   8. ASSESSMENT PLAYER (exam-taking / quiz-taking)
   ================================================== */

function Timer({ seconds }: { seconds: number }) {
  const low = seconds <= 300 && seconds > 0;
  const critical = seconds <= 60;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 border font-mono text-sm tracking-wider ${
        critical
          ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"
          : low
          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
          : "bg-white/5 border-white/10 text-cream"
      }`}
    >
      <TimerIcon className="w-3.5 h-3.5" />
      {formatClock(seconds)}
    </div>
  );
}

function QuestionRenderer({
  question,
  index,
  answer,
  onAnswer,
  locked,
}: {
  question: Question;
  index: number;
  answer: string | undefined;
  onAnswer: (v: string) => void;
  locked: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-slate-text mb-2">Question {index + 1}</div>
      <h3 className="text-base sm:text-lg text-cream font-medium mb-6 leading-relaxed">{question.prompt}</h3>

      {question.type === "short-answer" ? (
        <input
          disabled={locked}
          value={answer ?? ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream placeholder:text-slate-text focus:outline-none focus:border-teal/40 disabled:opacity-50"
        />
      ) : (
        <div className="space-y-2.5">
          {question.options?.map((opt) => {
            const selected = answer === opt;
            return (
              <button
                key={opt}
                disabled={locked}
                onClick={() => onAnswer(opt)}
                className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 text-sm transition-colors disabled:opacity-50 ${
                  selected
                    ? "border-teal/40 bg-teal/[0.06] text-cream"
                    : "border-white/10 text-slate-text hover:border-white/20 hover:text-cream"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                    selected ? "border-teal" : "border-white/20"
                  }`}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-teal" />}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function QuestionNavigator({
  total,
  current,
  answers,
  onJump,
}: {
  total: number;
  current: number;
  answers: Record<number, string>;
  onJump: (i: number) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const answered = Boolean(answers[i]);
          const isCurrent = i === current;
          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              className={`aspect-square rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                isCurrent
                  ? "bg-teal text-ink"
                  : answered
                  ? "bg-teal/10 text-teal border border-teal/20"
                  : "bg-white/5 text-slate-text border border-white/8 hover:border-white/20"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-text">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-teal" /> Current
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-teal/20 border border-teal/30" /> Answered
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-white/8 border border-white/10" /> Unanswered
        </span>
      </div>
    </div>
  );
}

function SubmitDialog({
  answeredCount,
  total,
  onCancel,
  onConfirm,
}: {
  answeredCount: number;
  total: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink p-5 shadow-[0_30px_80px_rgba(0,0,0,.6)]"
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-300 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-cream mb-1">Submit Exam?</h3>
            <p className="text-xs text-slate-text leading-relaxed">
              You have answered {answeredCount} of {total} questions. Once submitted, this action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onCancel}
            className="text-xs font-medium px-4 py-2 rounded-full text-slate-text hover:text-cream hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-xs font-medium px-4 py-2 rounded-full bg-teal text-ink hover:bg-teal-glow transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AssessmentPlayer({
  item,
  onExit,
  onFinish,
}: {
  item: Assessment;
  onExit: () => void;
  onFinish: (answers: Record<number, string>) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(item.durationMinutes * 60);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish(answers);
  }, [answers, onFinish]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, finish]);

  const total = item.questions.length;
  const answeredCount = Object.keys(answers).length;
  const question = item.questions[current];
  const locked = secondsLeft <= 0;

  return (
    <div className="fixed inset-0 z-50 bg-ink flex flex-col">
      <div className="border-b border-white/8 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <div className="text-xs text-slate-text truncate">{item.courseName}</div>
          <div className="text-sm font-medium text-cream truncate">{item.title}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Timer seconds={secondsLeft} />
          <button
            onClick={onExit}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-text hover:text-cream transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Exit
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-3 border-b border-white/8 flex items-center justify-between shrink-0">
        <span className="text-xs text-slate-text">
          Progress · {current + 1} / {total} Questions
        </span>
        <button
          onClick={() => setNavOpen(true)}
          className="lg:hidden text-xs text-teal font-medium"
        >
          Navigator
        </button>
      </div>
      <div className="h-1 bg-white/5 shrink-0">
        <div className="h-full bg-teal transition-all" style={{ width: `${((current + 1) / total) * 100}%` }} />
      </div>

      <div className="flex-1 overflow-y-auto flex">
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
          <QuestionRenderer
            question={question}
            index={current}
            answer={answers[current]}
            onAnswer={(v) => setAnswers((a) => ({ ...a, [current]: v }))}
            locked={locked}
          />
        </div>

        <div className="hidden lg:block w-72 shrink-0 border-l border-white/8 p-5 overflow-y-auto">
          <div className="text-xs font-medium text-cream mb-3">Question Navigator</div>
          <QuestionNavigator total={total} current={current} answers={answers} onJump={setCurrent} />
          <button
            onClick={() => setShowSubmit(true)}
            disabled={locked}
            className="w-full mt-6 text-sm font-medium px-4 py-2.5 rounded-full bg-teal text-ink hover:bg-teal-glow transition-colors disabled:opacity-50"
          >
            Submit Exam
          </button>
        </div>
      </div>

      <div className="border-t border-white/8 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream disabled:opacity-30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {current === total - 1 ? (
          <button
            onClick={() => setShowSubmit(true)}
            disabled={locked}
            className="lg:hidden text-sm font-medium px-5 py-2 rounded-full bg-teal text-ink hover:bg-teal-glow transition-colors disabled:opacity-50"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
              onClick={() => setNavOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[56] bg-ink border-t border-white/10 rounded-t-2xl p-5 lg:hidden max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-cream">Question Navigator</div>
                <button onClick={() => setNavOpen(false)} className="text-slate-text hover:text-cream">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <QuestionNavigator
                total={total}
                current={current}
                answers={answers}
                onJump={(i) => {
                  setCurrent(i);
                  setNavOpen(false);
                }}
              />
              <button
                onClick={() => {
                  setNavOpen(false);
                  setShowSubmit(true);
                }}
                disabled={locked}
                className="w-full mt-6 text-sm font-medium px-4 py-2.5 rounded-full bg-teal text-ink hover:bg-teal-glow transition-colors disabled:opacity-50"
              >
                Submit Exam
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showSubmit && (
        <SubmitDialog
          answeredCount={answeredCount}
          total={total}
          onCancel={() => setShowSubmit(false)}
          onConfirm={finish}
        />
      )}
    </div>
  );
}

/* ==================================================
   9. RESULTS + REVIEW
   ================================================== */

function ResultScreen({
  item,
  answers,
  onReview,
  onBack,
}: {
  item: Assessment;
  answers: Record<number, string>;
  onReview: () => void;
  onBack: () => void;
}) {
  const total = item.questions.length;
  const correct = item.questions.filter((q, i) => answers[i] === q.correctAnswer).length;
  const incorrect = total - correct;
  const percent = Math.round((correct / total) * 100);
  const passed = percent >= (item.passingMarks / item.totalMarks) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-ink flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 text-center"
      >
        <span
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed ? "bg-teal/10 text-teal" : "bg-red-500/10 text-red-400"
          }`}
        >
          {passed ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
        </span>
        <div className="text-xs text-slate-text mb-1">{item.type === "exam" ? "Exam Completed" : "Quiz Completed"}</div>
        <h2 className="text-lg font-display font-semibold text-cream mb-0.5">{item.title}</h2>
        <div className="text-xs text-slate-text mb-6">{item.courseName}</div>

        <div className="text-4xl font-display font-semibold text-cream mb-1">
          {correct} / {total}
        </div>
        <div className="text-teal text-sm font-medium mb-6">{percent}%</div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-white/8 p-3">
            <div className="text-[10px] text-slate-text mb-1">Status</div>
            <div className={`text-sm font-medium ${passed ? "text-teal" : "text-red-400"}`}>
              {passed ? "Passed" : "Failed"}
            </div>
          </div>
          <div className="rounded-xl border border-white/8 p-3">
            <div className="text-[10px] text-slate-text mb-1">Correct</div>
            <div className="text-sm font-medium text-cream">{correct}</div>
          </div>
          <div className="rounded-xl border border-white/8 p-3">
            <div className="text-[10px] text-slate-text mb-1">Incorrect</div>
            <div className="text-sm font-medium text-cream">{incorrect}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReview}
            disabled={!item.reviewAllowed}
            className="flex-1 text-sm font-medium px-4 py-2.5 rounded-full bg-white/5 text-cream hover:bg-white/10 transition-colors border border-white/10 disabled:opacity-40"
          >
            Review Answers
          </button>
          <button
            onClick={onBack}
            className="flex-1 text-sm font-medium px-4 py-2.5 rounded-full bg-teal text-ink hover:bg-teal-glow transition-colors"
          >
            {item.type === "exam" ? "Back to Exams" : "Back to Quizzes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ReviewAnswers({
  item,
  answers,
  onClose,
}: {
  item: Assessment;
  answers: Record<number, string>;
  onClose: () => void;
}) {
  if (!item.reviewAllowed) {
    return (
      <div className="fixed inset-0 z-50 bg-ink flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <p className="text-sm text-slate-text mb-4">Answer review is not available for this assessment.</p>
          <button onClick={onClose} className="text-sm font-medium px-4 py-2 rounded-full bg-teal text-ink">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink overflow-y-auto">
      <div className="sticky top-0 bg-ink border-b border-white/8 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        <div>
          <div className="text-xs text-slate-text">{item.courseName}</div>
          <div className="text-sm font-medium text-cream">{item.title} · Review</div>
        </div>
        <button onClick={onClose} className="text-slate-text hover:text-cream transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {item.questions.map((q, i) => {
          const yourAnswer = answers[i];
          const correct = yourAnswer === q.correctAnswer;
          return (
            <div key={q.id} className="rounded-2xl border border-white/8 p-5">
              <div className="text-xs text-slate-text mb-1.5">Question {i + 1}</div>
              <div className="text-sm text-cream mb-4">{q.prompt}</div>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl border border-white/8 p-3">
                  <div className="text-[10px] text-slate-text mb-1">Your Answer</div>
                  <div className="text-sm text-cream">{yourAnswer ?? "Not answered"}</div>
                </div>
                <div className="rounded-xl border border-white/8 p-3">
                  <div className="text-[10px] text-slate-text mb-1">Correct Answer</div>
                  <div className="text-sm text-cream">{q.correctAnswer}</div>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${correct ? "text-teal" : "text-red-400"}`}>
                {correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {correct ? "Correct" : "Incorrect"}
              </div>
              {q.explanation && <p className="text-xs text-slate-text mt-2 leading-relaxed">{q.explanation}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==================================================
   10. EXAM SECTION
   ================================================== */

type SubTab = "all" | "upcoming" | "ongoing" | "completed";

function ExamSection({
  loading,
  onSelect,
  onAction,
}: {
  loading: boolean;
  onSelect: (a: Assessment) => void;
  onAction: (a: Assessment) => void;
}) {
  const [subTab, setSubTab] = useState<SubTab>("all");
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [view, setView] = useState<"list" | "grid">("list");

  const courses = ["All Courses", ...Array.from(new Set(MOCK_EXAMS.map((e) => e.courseName)))];
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
    { label: "Missed", value: "missed" },
  ];

  const stats = useMemo(() => {
    const upcoming = MOCK_EXAMS.filter((e) => e.status === "upcoming").sort((a, b) => a.dateSort - b.dateSort);
    const ongoing = MOCK_EXAMS.filter((e) => e.status === "ongoing");
    const completed = MOCK_EXAMS.filter((e) => e.status === "completed");
    const highest = completed.reduce((m, e) => Math.max(m, e.scoreEarned ?? 0), 0);
    const avg = completed.length
      ? Math.round(completed.reduce((sum, e) => sum + (e.scoreEarned ?? 0), 0) / completed.length)
      : 0;
    return {
      upcomingCount: upcoming.length,
      nextUp: upcoming[0]?.courseName ?? "—",
      ongoingCount: ongoing.length,
      completedCount: completed.length,
      highest,
      avg,
    };
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_EXAMS.filter((e) => {
      const matchesTab = subTab === "all" || e.status === subTab;
      const matchesQuery =
        e.title.toLowerCase().includes(query.toLowerCase()) || e.courseName.toLowerCase().includes(query.toLowerCase());
      const matchesCourse = course === "All Courses" || e.courseName === course;
      const matchesStatus = status === "all" || e.status === status;
      return matchesTab && matchesQuery && matchesCourse && matchesStatus;
    });
    list = [...list].sort((a, b) => {
      if (sortKey === "course") return a.courseName.localeCompare(b.courseName);
      if (sortKey === "type") return a.kind.localeCompare(b.kind);
      return a.dateSort - b.dateSort;
    });
    return list;
  }, [subTab, query, course, status, sortKey]);

  const subTabs: { label: string; value: SubTab }[] = [
    { label: "All Exams", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-cream">Exams</h1>
        <p className="text-sm text-slate-text mt-1">View your upcoming, ongoing and completed exams.</p>
      </div>

      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
        {subTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setSubTab(t.value)}
            className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              subTab === t.value
                ? "bg-white/10 text-cream border-white/20"
                : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Upcoming" value={stats.upcomingCount} sub={`Next: ${stats.nextUp}`} icon={Calendar} />
            <StatCard label="Ongoing" value={stats.ongoingCount} sub="In Progress" icon={CircleDot} />
            <StatCard label="Completed" value={stats.completedCount} sub={`Highest Score: ${stats.highest}%`} icon={CheckCircle2} />
            <StatCard label="Average Score" value={`${stats.avg}%`} sub="Across completed exams" icon={TrendingUp} />
          </>
        )}
      </div>

      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="Search exams..."
        courses={courses}
        course={course}
        onCourse={setCourse}
        status={status}
        onStatus={setStatus}
        statusOptions={statusOptions}
        sortKey={sortKey}
        onSort={setSortKey}
        view={view}
        onView={setView}
      />

      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query || status !== "all" || course !== "All Courses" ? "No exams found" : "No exams scheduled"}
          subtitle={query || status !== "all" || course !== "All Courses" ? "Try adjusting your search or filters." : "You're all caught up."}
        />
      ) : (
        <div className={view === "grid" ? "grid sm:grid-cols-2 gap-2.5" : "space-y-2.5"}>
          {filtered.map((e) => (
            <AssessmentCard key={e.id} item={e} onSelect={onSelect} onAction={onAction} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================================================
   11. QUIZ SECTION
   ================================================== */

type QuizSubTab = "all" | "unattempted" | "completed";

function QuizSection({
  loading,
  onSelect,
  onAction,
}: {
  loading: boolean;
  onSelect: (a: Assessment) => void;
  onAction: (a: Assessment) => void;
}) {
  const [subTab, setSubTab] = useState<QuizSubTab>("all");
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [view, setView] = useState<"list" | "grid">("list");

  const courses = ["All Courses", ...Array.from(new Set(MOCK_QUIZZES.map((q) => q.courseName)))];
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
  ];

  const stats = useMemo(() => {
    const unattempted = MOCK_QUIZZES.filter((q) => q.status === "upcoming");
    const completed = MOCK_QUIZZES.filter((q) => q.status === "completed");
    const avg = completed.length
      ? Math.round(completed.reduce((sum, q) => sum + (q.scoreEarned ?? 0), 0) / completed.length)
      : 0;
    const best = completed.reduce<Assessment | null>((m, q) => ((q.scoreEarned ?? 0) > (m?.scoreEarned ?? -1) ? q : m), null);
    return {
      unattemptedCount: unattempted.length,
      completedCount: completed.length,
      avg,
      bestScore: best?.scoreEarned ?? 0,
      bestTitle: best?.title ?? "—",
    };
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_QUIZZES.filter((q) => {
      const matchesTab = subTab === "all" || (subTab === "unattempted" ? q.status === "upcoming" : q.status === "completed");
      const matchesQuery =
        q.title.toLowerCase().includes(query.toLowerCase()) || q.courseName.toLowerCase().includes(query.toLowerCase());
      const matchesCourse = course === "All Courses" || q.courseName === course;
      const matchesStatus = status === "all" || q.status === status;
      return matchesTab && matchesQuery && matchesCourse && matchesStatus;
    });
    list = [...list].sort((a, b) => {
      if (sortKey === "course") return a.courseName.localeCompare(b.courseName);
      if (sortKey === "type") return a.kind.localeCompare(b.kind);
      return a.dateSort - b.dateSort;
    });
    return list;
  }, [subTab, query, course, status, sortKey]);

  const subTabs: { label: string; value: QuizSubTab }[] = [
    { label: "All Quizzes", value: "all" },
    { label: "Unattempted", value: "unattempted" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-cream">Quizzes</h1>
        <p className="text-sm text-slate-text mt-1">Practice, test your knowledge and improve your understanding.</p>
      </div>

      <div className="flex items-center gap-1.5 mb-5 overflow-x-auto pb-1">
        {subTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setSubTab(t.value)}
            className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              subTab === t.value
                ? "bg-white/10 text-cream border-white/20"
                : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Unattempted" value={stats.unattemptedCount} sub="Quizzes available" icon={HelpCircle} />
            <StatCard label="Completed" value={stats.completedCount} sub="Total attempted" icon={CheckCircle2} />
            <StatCard label="Average Score" value={`${stats.avg}%`} sub="Across all quizzes" icon={TrendingUp} />
            <StatCard label="Best Score" value={`${stats.bestScore}%`} sub={stats.bestTitle} icon={Award} />
          </>
        )}
      </div>

      <FilterBar
        query={query}
        onQuery={setQuery}
        placeholder="Search quizzes..."
        courses={courses}
        course={course}
        onCourse={setCourse}
        status={status}
        onStatus={setStatus}
        statusOptions={statusOptions}
        sortKey={sortKey}
        onSort={setSortKey}
        view={view}
        onView={setView}
      />

      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query || status !== "all" || course !== "All Courses" ? "No exams found" : "No quizzes available"}
          subtitle={query || status !== "all" || course !== "All Courses" ? "Try adjusting your search or filters." : undefined}
        />
      ) : (
        <div className={view === "grid" ? "grid sm:grid-cols-2 gap-2.5" : "space-y-2.5"}>
          {filtered.map((q) => (
            <AssessmentCard key={q.id} item={q} onSelect={onSelect} onAction={onAction} view={view} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================================================
   12. ROOT: ExamsAndQuizzes
   ================================================== */

type PlayerState = { item: Assessment; result: false } | { item: Assessment; result: true; answers: Record<number, string> } | null;

export default function ExamsAndQuizzes() {
  const [mainTab, setMainTab] = useState<"exams" | "quizzes">("exams");
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [player, setPlayer] = useState<PlayerState>(null);
  const [reviewing, setReviewing] = useState<{ item: Assessment; answers: Record<number, string> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSelect = (a: Assessment) => setSelected(a);
  const handleAction = (a: Assessment) => {
    if (a.status === "upcoming" || a.status === "ongoing") {
      setPlayer({ item: a, result: false });
      setSelected(null);
    } else if (a.status === "completed") {
      setPlayer({ item: a, result: true, answers: {} });
      setSelected(null);
    } else {
      setSelected(a);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-1 border border-white/10 rounded-full p-1 w-fit mb-6">
        <button
          onClick={() => {
            setMainTab("exams");
            setSelected(null);
          }}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            mainTab === "exams" ? "bg-teal text-ink" : "text-slate-text hover:text-cream"
          }`}
        >
          Exams
        </button>
        <button
          onClick={() => {
            setMainTab("quizzes");
            setSelected(null);
          }}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            mainTab === "quizzes" ? "bg-teal text-ink" : "text-slate-text hover:text-cream"
          }`}
        >
          Quizzes
        </button>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0">
          {mainTab === "exams" ? (
            <ExamSection loading={loading} onSelect={handleSelect} onAction={handleAction} />
          ) : (
            <QuizSection loading={loading} onSelect={handleSelect} onAction={handleAction} />
          )}
        </div>

        {selected && (
          <div className="hidden lg:block">
            <DetailsPanel item={selected} onClose={() => setSelected(null)} onStart={handleAction} />
          </div>
        )}
      </div>

      <div className="lg:hidden">
        {selected && (
          <DetailsPanel item={selected} onClose={() => setSelected(null)} onStart={handleAction} />
        )}
      </div>

      {player && !player.result && (
        <AssessmentPlayer
          item={player.item}
          onExit={() => setPlayer(null)}
          onFinish={(answers) => setPlayer({ item: player.item, result: true, answers })}
        />
      )}

      {player && player.result && (
        <ResultScreen
          item={player.item}
          answers={player.answers}
          onReview={() => {
            setReviewing({ item: player.item, answers: player.answers });
          }}
          onBack={() => setPlayer(null)}
        />
      )}

      {reviewing && (
        <ReviewAnswers item={reviewing.item} answers={reviewing.answers} onClose={() => setReviewing(null)} />
      )}
    </motion.div>
  );
}