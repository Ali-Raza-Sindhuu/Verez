import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  GraduationCap,
  BookOpen,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* ==================================================
   1. TYPES
   ================================================== */

type LetterGrade = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "F";
type CourseStatus = "completed" | "in-progress";
type SemesterStatus = "current" | "passed";
type MainTab = "overview" | "current" | "all-semesters" | "transcript";

interface CourseGrade {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  color: string;
  department: string;
  credits: number;
  semester: string;
  instructor: string;
  description: string;
  percentage: number;
  letterGrade: LetterGrade;
  gradePoints: number;
  status: CourseStatus;
  components: {
    assignments: { earned: number; total: number };
    quizzes: { earned: number; total: number };
    midterm: { earned: number; total: number };
    final: { earned: number; total: number };
  };
}

interface SemesterGPA {
  semester: string;
  gpa: number;
  credits: number;
  status: SemesterStatus;
}

interface GPAOverview {
  currentGPA: number;
  currentGPADelta: number;
  semesterGPA: number;
  semesterLabel: string;
  earnedCredits: number;
  totalCredits: number;
  academicStanding: string;
  standingNote: string;
}

/* ==================================================
   2. MOCK DATA (swap for API calls later)
   ================================================== */

const SEMESTERS = ["Fall 2025", "Spring 2026", "Summer 2026", "Fall 2026"];

const MOCK_OVERVIEW: GPAOverview = {
  currentGPA: 3.72,
  currentGPADelta: 0.12,
  semesterGPA: 3.85,
  semesterLabel: "Fall 2026",
  earnedCredits: 72,
  totalCredits: 120,
  academicStanding: "Good Standing",
  standingNote: "On Track",
};

const MOCK_GPA_HISTORY: SemesterGPA[] = [
  { semester: "Fall 2025", gpa: 3.48, credits: 18, status: "passed" },
  { semester: "Spring 2026", gpa: 3.71, credits: 15, status: "passed" },
  { semester: "Summer 2026", gpa: 3.62, credits: 12, status: "passed" },
  { semester: "Fall 2026", gpa: 3.85, credits: 15, status: "current" },
];

const MOCK_COURSES: CourseGrade[] = [
  {
    id: "cg-1",
    courseId: "CS-301",
    courseCode: "CS-301",
    courseName: "Database Systems",
    color: "#a78bfa",
    department: "Computer Science",
    credits: 3,
    semester: "Fall 2026",
    instructor: "Dr. Ahmed Khan",
    description: "Study of database design, data modeling, SQL and transaction management.",
    percentage: 92,
    letterGrade: "A",
    gradePoints: 4.0,
    status: "in-progress",
    components: {
      assignments: { earned: 20, total: 20 },
      quizzes: { earned: 9, total: 10 },
      midterm: { earned: 18, total: 20 },
      final: { earned: 45, total: 50 },
    },
  },
  {
    id: "cg-2",
    courseId: "CS-302",
    courseCode: "CS-302",
    courseName: "Web Engineering",
    color: "#818cf8",
    department: "Computer Science",
    credits: 3,
    semester: "Fall 2026",
    instructor: "Dr. Sara Malik",
    description: "Client-server architecture, REST APIs, and modern frontend frameworks.",
    percentage: 89,
    letterGrade: "A-",
    gradePoints: 3.67,
    status: "in-progress",
    components: {
      assignments: { earned: 19, total: 20 },
      quizzes: { earned: 8, total: 10 },
      midterm: { earned: 17, total: 20 },
      final: { earned: 44, total: 50 },
    },
  },
  {
    id: "cg-3",
    courseId: "CS-305",
    courseCode: "CS-305",
    courseName: "Artificial Intelligence",
    color: "#c4b5fd",
    department: "Computer Science",
    credits: 3,
    semester: "Fall 2026",
    instructor: "Dr. Bilal Hassan",
    description: "Search, knowledge representation, and an introduction to machine learning.",
    percentage: 94,
    letterGrade: "A",
    gradePoints: 4.0,
    status: "in-progress",
    components: {
      assignments: { earned: 20, total: 20 },
      quizzes: { earned: 10, total: 10 },
      midterm: { earned: 19, total: 20 },
      final: { earned: 45, total: 50 },
    },
  },
  {
    id: "cg-4",
    courseId: "MATH-201",
    courseCode: "MATH-201",
    courseName: "Discrete Mathematics",
    color: "#a78bfa",
    department: "Mathematics",
    credits: 3,
    semester: "Fall 2026",
    instructor: "Dr. Nadia Farooq",
    description: "Logic, set theory, combinatorics, and graph theory foundations.",
    percentage: 91,
    letterGrade: "A",
    gradePoints: 4.0,
    status: "in-progress",
    components: {
      assignments: { earned: 20, total: 20 },
      quizzes: { earned: 9, total: 10 },
      midterm: { earned: 18, total: 20 },
      final: { earned: 44, total: 50 },
    },
  },
  {
    id: "cg-5",
    courseId: "ENG-101",
    courseCode: "ENG-101",
    courseName: "Technical Communication",
    color: "#93c5fd",
    department: "English",
    credits: 2,
    semester: "Fall 2026",
    instructor: "Ms. Hina Riaz",
    description: "Writing for technical audiences: reports, proposals, and documentation.",
    percentage: 90,
    letterGrade: "A-",
    gradePoints: 3.67,
    status: "in-progress",
    components: {
      assignments: { earned: 19, total: 20 },
      quizzes: { earned: 9, total: 10 },
      midterm: { earned: 18, total: 20 },
      final: { earned: 44, total: 50 },
    },
  },
];

const GRADE_SCALE: { letter: LetterGrade; points: string; range: string }[] = [
  { letter: "A", points: "4.0", range: "90–100%" },
  { letter: "A-", points: "3.7", range: "85–89%" },
  { letter: "B+", points: "3.3", range: "80–84%" },
  { letter: "B", points: "3.0", range: "75–79%" },
  { letter: "B-", points: "2.7", range: "70–74%" },
  { letter: "C+", points: "2.3", range: "65–69%" },
  { letter: "C", points: "2.0", range: "60–64%" },
  { letter: "F", points: "0.0", range: "0–59%" },
];

/* ==================================================
   3. HELPERS
   ================================================== */

function performanceMessage(percentage: number): { title: string; note: string } {
  if (percentage >= 90) return { title: "Excellent Performance!", note: "You're doing great in this course." };
  if (percentage >= 80) return { title: "Great Work!", note: "You're maintaining a strong grade in this course." };
  if (percentage >= 70) return { title: "Good Progress!", note: "Keep it up — there's room to push a bit higher." };
  return { title: "Needs Improvement", note: "Consider reaching out to your instructor for support." };
}

/* ==================================================
   4. SHARED UI PIECES
   ================================================== */

function KpiCard({
  icon: Icon,
  label,
  children,
  sub,
}: {
  icon: typeof Award;
  label: string;
  children: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-slate-text">{label}</span>
        <span className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-300 shrink-0">
          <Icon className="w-4 h-4" />
        </span>
      </div>
      {children}
      <div className="text-xs text-slate-text mt-1.5 truncate">{sub}</div>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5 animate-pulse">
      <div className="h-3 w-16 bg-white/8 rounded mb-4" />
      <div className="h-6 w-20 bg-white/8 rounded mb-2" />
      <div className="h-2.5 w-24 bg-white/8 rounded" />
    </div>
  );
}

function ProgressBar({ percent, color }: { percent: number; color?: string }) {
  return (
    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color ?? "#a78bfa" }}
      />
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-white/8 py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-slate-text">
        <BookOpen className="w-5 h-5" />
      </div>
      <div className="text-sm text-cream font-medium">{title}</div>
      {subtitle && <div className="text-xs text-slate-text mt-1">{subtitle}</div>}
    </div>
  );
}

/* ==================================================
   5. SEMESTER SELECTOR
   ================================================== */

function SemesterSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-sm text-cream border border-white/10 rounded-full px-4 py-2 hover:border-white/20 transition-colors"
      >
        {value}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
          {SEMESTERS.slice()
            .reverse()
            .map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  s === value ? "text-violet-300" : "text-slate-text hover:text-cream hover:bg-white/5"
                }`}
              >
                {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

/* ==================================================
   6. TOP NAV TABS
   ================================================== */

function GradesTabs({ tab, onTab }: { tab: MainTab; onTab: (t: MainTab) => void }) {
  const tabs: { label: string; value: MainTab }[] = [
    { label: "Overview", value: "overview" },
    { label: "Current Semester", value: "current" },
    { label: "All Semesters", value: "all-semesters" },
    { label: "Academic Transcript", value: "transcript" },
  ];
  return (
    <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onTab(t.value)}
          className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
            tab === t.value
              ? "bg-white/10 text-cream border-white/20"
              : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ==================================================
   7. GPA OVERVIEW CARDS
   ================================================== */

function GPAOverviewCards({ overview, loading }: { overview: GPAOverview; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>
    );
  }

  const creditsPercent = Math.round((overview.earnedCredits / overview.totalCredits) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KpiCard icon={Award} label="Current GPA" sub={`↑ +${overview.currentGPADelta.toFixed(2)} vs last semester`}>
        <div className="text-2xl font-display font-semibold text-cream">
          {overview.currentGPA.toFixed(2)} <span className="text-sm text-slate-text font-normal">/ 4.00</span>
        </div>
      </KpiCard>

      <KpiCard icon={GraduationCap} label="Semester GPA" sub={overview.semesterLabel}>
        <div className="text-2xl font-display font-semibold text-cream">
          {overview.semesterGPA.toFixed(2)} <span className="text-sm text-slate-text font-normal">/ 4.00</span>
        </div>
      </KpiCard>

      <KpiCard icon={BookOpen} label="Earned Credits" sub={`${creditsPercent}% completed`}>
        <div className="text-2xl font-display font-semibold text-cream mb-2">
          {overview.earnedCredits} <span className="text-sm text-slate-text font-normal">/ {overview.totalCredits}</span>
        </div>
        <ProgressBar percent={creditsPercent} />
      </KpiCard>

      <KpiCard icon={CheckCircle2} label="Academic Standing" sub={`• ${overview.standingNote}`}>
        <div className="text-lg font-display font-semibold text-cream">{overview.academicStanding}</div>
      </KpiCard>
    </div>
  );
}

/* ==================================================
   8. GPA TREND CHART
   ================================================== */

function GPATrendChart({ history, loading }: { history: SemesterGPA[]; loading: boolean }) {
  const yTicks = [2.0, 2.5, 3.0, 3.5, 4.0];
  const latest = history[history.length - 1];

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 animate-pulse">
        <div className="h-4 w-24 bg-white/8 rounded mb-2" />
        <div className="h-3 w-48 bg-white/8 rounded mb-6" />
        <div className="h-40 w-full bg-white/8 rounded" />
      </div>
    );
  }

  const w = 480;
  const h = 160;
  const min = 2.0;
  const max = 4.0;
  const points = history.map((s, i) => ({
    x: (i / (history.length - 1)) * w,
    y: h - ((s.gpa - min) / (max - min)) * h,
    ...s,
  }));
  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `0,${h} ${linePoints} ${w},${h}`;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display text-base font-semibold text-cream">GPA Trend</h2>
          <p className="text-xs text-slate-text mt-0.5">Your GPA performance across semesters</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-display font-semibold text-violet-300">{latest.gpa.toFixed(2)}</div>
          <div className="text-[10px] text-slate-text">Latest GPA</div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-[10px] text-slate-text py-1 shrink-0">
          {yTicks
            .slice()
            .reverse()
            .map((t) => (
              <span key={t}>{t.toFixed(1)}</span>
            ))}
        </div>

        <div className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gpaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </linearGradient>
            </defs>

            {yTicks.map((t) => {
              const y = h - ((t - min) / (max - min)) * h;
              return <line key={t} x1={0} x2={w} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
            })}

            <motion.polygon
              points={areaPoints}
              fill="url(#gpaFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.polyline
              points={linePoints}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {points.map((p, i) => (
              <circle
                key={p.semester}
                cx={p.x}
                cy={p.y}
                r={i === points.length - 1 ? 4.5 : 3}
                fill={i === points.length - 1 ? "#c4b5fd" : "#a78bfa"}
              />
            ))}
          </svg>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-text">
            {history.map((s) => (
              <span key={s.semester}>{s.semester}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   9. SEMESTER GPA HISTORY
   ================================================== */

function SemesterGPAHistory({ history, loading }: { history: SemesterGPA[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 animate-pulse">
        <div className="h-4 w-40 bg-white/8 rounded mb-5" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-white/8 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-base font-semibold text-cream">Semester GPA History</h2>
        <button className="inline-flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200 transition-colors shrink-0">
          View Transcript
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-4 text-[10px] text-slate-text uppercase tracking-wide px-3 mb-2">
        <span>Semester</span>
        <span className="text-right">GPA</span>
        <span className="text-right">Credits</span>
        <span className="text-right">Status</span>
      </div>

      <div className="space-y-1">
        {history
          .slice()
          .reverse()
          .map((s) => (
            <div
              key={s.semester}
              className={`grid grid-cols-4 items-center px-3 py-2.5 rounded-xl text-sm ${
                s.status === "current" ? "bg-violet-500/[0.06] border border-violet-500/15" : ""
              }`}
            >
              <span className="text-cream truncate">{s.semester}</span>
              <span className="text-cream text-right font-medium">{s.gpa.toFixed(2)}</span>
              <span className="text-slate-text text-right">{s.credits}</span>
              <span
                className={`text-right text-xs ${s.status === "current" ? "text-violet-300" : "text-slate-text"}`}
              >
                {s.status === "current" ? "Current" : "Passed"}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ==================================================
   10. COURSE GRADE TOOLBAR
   ================================================== */

function CourseGradeToolbar({
  query,
  onQuery,
  department,
  onDepartment,
  departments,
  semester,
  onSemester,
}: {
  query: string;
  onQuery: (v: string) => void;
  department: string;
  onDepartment: (v: string) => void;
  departments: string[];
  semester: string;
  onSemester: (v: string) => void;
}) {
  const [deptOpen, setDeptOpen] = useState(false);
  const [semOpen, setSemOpen] = useState(false);
  const deptRef = useRef<HTMLDivElement>(null);
  const semRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (deptRef.current && !deptRef.current.contains(e.target as Node)) setDeptOpen(false);
      if (semRef.current && !semRef.current.contains(e.target as Node)) setSemOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
      <div className="relative shrink-0" ref={deptRef}>
        <button
          onClick={() => setDeptOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors max-w-[180px]"
        >
          <span className="truncate">{department}</span>
          <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${deptOpen ? "rotate-180" : ""}`} />
        </button>
        {deptOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => {
                  onDepartment(d);
                  setDeptOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm truncate transition-colors ${
                  d === department ? "text-violet-300" : "text-slate-text hover:text-cream hover:bg-white/5"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative shrink-0" ref={semRef}>
        <button
          onClick={() => setSemOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors"
        >
          {semester}
          <ChevronDown className={`w-3 h-3 transition-transform ${semOpen ? "rotate-180" : ""}`} />
        </button>
        {semOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-40 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
            {SEMESTERS.slice()
              .reverse()
              .map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onSemester(s);
                    setSemOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    s === semester ? "text-violet-300" : "text-slate-text hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {s}
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
        <Search className="w-4 h-4 text-slate-text shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search courses..."
          className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
        />
      </div>
    </div>
  );
}

/* ==================================================
   11. COURSE GRADE ROW
   ================================================== */

function MiniStat({ label, earned, total }: { label: string; earned: number; total: number }) {
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
  return (
    <div className="min-w-0">
      <div className="text-[10px] text-slate-text mb-0.5">{label}</div>
      <div className="text-xs text-cream">
        {earned} / {total} <span className="text-slate-text">({pct}%)</span>
      </div>
    </div>
  );
}

function CourseGradeRow({ course, onView }: { course: CourseGrade; onView: (c: CourseGrade) => void }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-colors p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="hidden sm:block w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: course.color }} />

        <div className="min-w-0 flex-1">
          <div className="text-xs text-slate-text">{course.courseCode}</div>
          <h3 className="text-sm font-medium text-cream truncate">{course.courseName}</h3>
          <div className="text-xs text-slate-text mt-0.5">
            {course.credits} Credits • {course.department}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 sm:w-auto w-full">
          <MiniStat label="Assignments" earned={course.components.assignments.earned} total={course.components.assignments.total} />
          <MiniStat label="Quizzes" earned={course.components.quizzes.earned} total={course.components.quizzes.total} />
          <MiniStat
            label="Exams"
            earned={course.components.midterm.earned + course.components.final.earned}
            total={course.components.midterm.total + course.components.final.total}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0">
          <div className="text-right">
            <div className="text-lg font-display font-semibold text-cream">{course.letterGrade}</div>
            <div className="text-xs text-slate-text">{course.percentage}%</div>
          </div>
          <button
            onClick={() => onView(course)}
            className="inline-flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200 border border-violet-500/20 bg-violet-500/10 rounded-full px-3.5 py-1.5 transition-colors"
          >
            View Details
            <ChevronDown className="w-3 h-3 -rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseRowSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-1 self-stretch bg-white/8 rounded-full hidden sm:block" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-16 bg-white/8 rounded" />
          <div className="h-4 w-40 bg-white/8 rounded" />
        </div>
        <div className="h-8 w-24 bg-white/8 rounded-full shrink-0" />
      </div>
    </div>
  );
}

/* ==================================================
   12. COURSE GRADE DRAWER
   ================================================== */

type DrawerTab = "details" | "assessments" | "components";

function CourseGradeDrawer({ course, onClose }: { course: CourseGrade | null; onClose: () => void }) {
  const [tab, setTab] = useState<DrawerTab>("details");

  useEffect(() => {
    setTab("details");
  }, [course?.id]);

  if (!course) return null;
  const perf = performanceMessage(course.percentage);

  const detailRows = [
    { label: "Credits", value: String(course.credits) },
    { label: "Department", value: course.department },
    { label: "Semester", value: course.semester },
    { label: "Instructor", value: course.instructor },
    { label: "Final Grade", value: `${course.letterGrade} (${course.percentage}%)` },
    { label: "Grade Points", value: `${course.gradePoints.toFixed(2)} / 4.00` },
  ];

  const breakdown = [
    { label: "Assignments", ...course.components.assignments },
    { label: "Quizzes", ...course.components.quizzes },
    { label: "Midterm Exam", ...course.components.midterm },
    { label: "Final Exam", ...course.components.final },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 300 }}
        role="dialog"
        aria-label={`${course.courseName} grade details`}
        className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-ink border-l border-white/8 overflow-y-auto"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-xs text-slate-text">{course.courseCode}</div>
              <h3 className="text-lg font-display font-semibold text-cream mt-0.5">{course.courseName}</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close details"
              className="p-1.5 rounded-full text-slate-text hover:text-cream hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border border-white/10 rounded-full p-1 mb-6 w-fit">
            {(["details", "assessments", "components"] as DrawerTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize ${
                  tab === t ? "bg-white/10 text-cream" : "text-slate-text hover:text-cream"
                }`}
              >
                {t === "assessments" ? "Assessments" : t === "components" ? "Grade Components" : "Details"}
              </button>
            ))}
          </div>

          {tab === "details" && (
            <div>
              <div className="mb-5">
                <div className="text-xs font-medium text-cream mb-1.5">Description</div>
                <p className="text-xs text-slate-text leading-relaxed">{course.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {detailRows.map((r) => (
                  <div key={r.label} className="rounded-xl border border-white/8 p-3">
                    <div className="text-[10px] text-slate-text uppercase tracking-wide mb-1">{r.label}</div>
                    <div className="text-sm text-cream truncate">{r.value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4 mb-6">
                <div className="text-sm font-medium text-violet-200 mb-0.5">{perf.title}</div>
                <div className="text-xs text-slate-text">{perf.note}</div>
              </div>

              <button
                disabled
                className="w-full inline-flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-full border border-white/10 text-slate-text opacity-60 cursor-not-allowed"
              >
                View Full Grade Report
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {(tab === "assessments" || tab === "components") && (
            <div>
              <div className="text-xs font-medium text-cream mb-4">Assessment Breakdown</div>
              <div className="space-y-4">
                {breakdown.map((b) => {
                  const pct = b.total > 0 ? Math.round((b.earned / b.total) * 100) : 0;
                  return (
                    <div key={b.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-cream">{b.label}</span>
                        <span className="text-xs text-slate-text">
                          {b.earned} / {b.total}
                        </span>
                      </div>
                      <ProgressBar percent={pct} color={course.color} />
                      <div className="text-[10px] text-slate-text mt-1 text-right">{pct}%</div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4 mt-6">
                <div className="text-sm font-medium text-violet-200 mb-0.5">{perf.title}</div>
                <div className="text-xs text-slate-text">{perf.note}</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ==================================================
   13. GRADE SCALE
   ================================================== */

function GradeScale() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
      <h2 className="font-display text-base font-semibold text-cream mb-4">Grade Scale</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {GRADE_SCALE.map((g) => (
          <div key={g.letter} className="rounded-xl border border-white/8 px-3 py-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-cream">{g.letter}</span>
              <span className="text-xs text-violet-300">{g.points}</span>
            </div>
            <div className="text-[10px] text-slate-text">{g.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================================================
   14. ROOT: GradesPage
   ================================================== */

export default function GradesPage() {
  const [semester, setSemester] = useState("Fall 2026");
  const [tab, setTab] = useState<MainTab>("overview");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All Courses");
  const [courseSemester, setCourseSemester] = useState("Fall 2026");
  const [selectedCourse, setSelectedCourse] = useState<CourseGrade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const departments = ["All Courses", ...Array.from(new Set(MOCK_COURSES.map((c) => c.department)))];

  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((c) => {
      const matchesQuery =
        c.courseName.toLowerCase().includes(query.toLowerCase()) || c.courseCode.toLowerCase().includes(query.toLowerCase());
      const matchesDept = department === "All Courses" || c.department === department;
      const matchesSemester = c.semester === courseSemester;
      return matchesQuery && matchesDept && matchesSemester;
    });
  }, [query, department, courseSemester]);

  const showFutureTab = tab === "all-semesters" || tab === "transcript";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-cream">Grades & GPA</h1>
          <p className="text-sm text-slate-text mt-1">Track your academic performance and progress.</p>
        </div>
        <div className="self-start sm:self-auto">
          <SemesterSelector value={semester} onChange={setSemester} />
        </div>
      </div>

      <GradesTabs tab={tab} onTab={setTab} />

      {showFutureTab ? (
        <EmptyState
          title={tab === "all-semesters" ? "No academic history available." : "Academic transcript coming soon."}
          subtitle="This view will be available once connected to the backend."
        />
      ) : (
        <>
          <GPAOverviewCards overview={MOCK_OVERVIEW} loading={loading} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <GPATrendChart history={MOCK_GPA_HISTORY} loading={loading} />
            </div>
            <SemesterGPAHistory history={MOCK_GPA_HISTORY} loading={loading} />
          </div>

          <div className="mb-5">
            <h2 className="font-display text-base font-semibold text-cream mb-4">
              Course Grades — {courseSemester}
            </h2>
            <CourseGradeToolbar
              query={query}
              onQuery={setQuery}
              department={department}
              onDepartment={setDepartment}
              departments={departments}
              semester={courseSemester}
              onSemester={setCourseSemester}
            />

            {loading ? (
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <CourseRowSkeleton key={i} />
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <EmptyState
                title={query ? "No courses match your search." : "No courses found."}
                subtitle={query ? "Try adjusting your search or filters." : undefined}
              />
            ) : (
              <div className="space-y-2.5">
                {filteredCourses.map((c) => (
                  <CourseGradeRow key={c.id} course={c} onView={setSelectedCourse} />
                ))}
              </div>
            )}
          </div>

          <GradeScale />
        </>
      )}

      <CourseGradeDrawer course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </motion.div>
  );
}