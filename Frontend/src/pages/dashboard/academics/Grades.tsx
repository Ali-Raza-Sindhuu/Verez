import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Award,
  BookOpen,
  ArrowUpDown,
  Download,
} from "lucide-react";

interface GradeComponent {
  label: string;
  weight: number;
  earned: number;
}

interface CourseGrade {
  id: string;
  code: string;
  name: string;
  color: string;
  credits: number;
  currentGrade: string;
  gradePercent: number;
  trend: "up" | "down" | "flat";
  trendDelta: string;
  components: GradeComponent[];
}

const MOCK_GRADES: CourseGrade[] = [
  {
    id: "c1",
    code: "CS 301",
    name: "Data Structures",
    color: "#1EC2BC",
    credits: 4,
    currentGrade: "A-",
    gradePercent: 91,
    trend: "up",
    trendDelta: "+2.1%",
    components: [
      { label: "Assignments", weight: 30, earned: 94 },
      { label: "Midterm", weight: 25, earned: 88 },
      { label: "Quizzes", weight: 15, earned: 90 },
      { label: "Final Exam", weight: 30, earned: 0 },
    ],
  },
  {
    id: "c2",
    code: "MATH 210",
    name: "Linear Algebra",
    color: "#E7714A",
    credits: 3,
    currentGrade: "B+",
    gradePercent: 87,
    trend: "up",
    trendDelta: "+1.4%",
    components: [
      { label: "Homework", weight: 20, earned: 91 },
      { label: "Quizzes", weight: 20, earned: 85 },
      { label: "Midterm", weight: 30, earned: 82 },
      { label: "Final Exam", weight: 30, earned: 0 },
    ],
  },
  {
    id: "c3",
    code: "ENG 205",
    name: "Technical Writing",
    color: "#9277ff",
    credits: 2,
    currentGrade: "A",
    gradePercent: 95,
    trend: "flat",
    trendDelta: "0.0%",
    components: [
      { label: "Drafts", weight: 25, earned: 96 },
      { label: "Participation", weight: 15, earned: 100 },
      { label: "Research proposal", weight: 30, earned: 90 },
      { label: "Final defense", weight: 30, earned: 0 },
    ],
  },
  {
    id: "c4",
    code: "CS 322",
    name: "Operating Systems Lab",
    color: "#65e6f4",
    credits: 1,
    currentGrade: "B",
    gradePercent: 82,
    trend: "down",
    trendDelta: "-3.2%",
    components: [
      { label: "Lab reports", weight: 40, earned: 79 },
      { label: "Practical exam", weight: 30, earned: 85 },
      { label: "Attendance", weight: 10, earned: 92 },
      { label: "Final project", weight: 20, earned: 0 },
    ],
  },
];

const semesterGpaHistory = [
  { term: "Fall '23", gpa: 3.4 },
  { term: "Spring '24", gpa: 3.5 },
  { term: "Fall '24", gpa: 3.45 },
  { term: "Spring '25", gpa: 3.6 },
  { term: "Fall '25", gpa: 3.58 },
  { term: "Spring '26", gpa: 3.65 },
  { term: "Summer '26", gpa: 3.7 },
  { term: "Fall '26", gpa: 3.72 },
];

const gradeScale = [
  { letter: "A", range: "93–100%", points: "4.0" },
  { letter: "A-", range: "90–92%", points: "3.7" },
  { letter: "B+", range: "87–89%", points: "3.3" },
  { letter: "B", range: "83–86%", points: "3.0" },
  { letter: "B-", range: "80–82%", points: "2.7" },
  { letter: "C+", range: "77–79%", points: "2.3" },
  { letter: "C", range: "70–76%", points: "2.0" },
];

type SortKey = "name" | "grade" | "credits";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Name", value: "name" },
  { label: "Grade", value: "grade" },
  { label: "Credits", value: "credits" },
];

function trendColor(trend: "up" | "down" | "flat") {
  if (trend === "up") return "text-teal";
  if (trend === "down") return "text-red-400";
  return "text-slate-text";
}

function CourseGradeCard({ course }: { course: CourseGrade }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-colors overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 p-4 sm:p-5 text-left"
      >
        <span className="w-1.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: course.color }} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-text">{course.code}</span>
            <span className="text-xs text-slate-text">· {course.credits} credits</span>
          </div>
          <h3 className="text-sm font-medium text-cream truncate">{course.name}</h3>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-display font-semibold text-cream">{course.currentGrade}</div>
          <div className={`inline-flex items-center gap-0.5 text-xs font-medium ${trendColor(course.trend)}`}>
            {course.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
            {course.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
            {course.trendDelta}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-text shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-3 border-t border-white/8">
              <div className="text-xs text-slate-text pt-4 mb-1">Grade breakdown</div>
              {course.components.map((comp) => (
                <div key={comp.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-cream">{comp.label}</span>
                    <span className="text-xs text-slate-text">
                      {comp.earned > 0 ? `${comp.earned}%` : "Not graded"} · {comp.weight}% of grade
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${comp.earned}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: comp.earned > 0 ? course.color : "transparent" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Grades() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [sortOpen]);

  const filtered = useMemo(() => {
    let list = MOCK_GRADES.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "grade":
          return b.gradePercent - a.gradePercent;
        case "credits":
          return b.credits - a.credits;
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [query, sortKey]);

  const totalCredits = MOCK_GRADES.reduce((sum, c) => sum + c.credits, 0);
  const weightedGpaPoints = MOCK_GRADES.reduce((sum, c) => sum + (c.gradePercent / 100) * 4.0 * c.credits, 0);
  const currentGpa = (weightedGpaPoints / totalCredits).toFixed(2);
  const bestCourse = [...MOCK_GRADES].sort((a, b) => b.gradePercent - a.gradePercent)[0];
  const weakestCourse = [...MOCK_GRADES].sort((a, b) => a.gradePercent - b.gradePercent)[0];

  const latestGpa = semesterGpaHistory[semesterGpaHistory.length - 1].gpa;
  const prevGpa = semesterGpaHistory[semesterGpaHistory.length - 2].gpa;
  const gpaDelta = (latestGpa - prevGpa).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Grades & GPA</h1>
          <p className="text-sm text-slate-text mt-1">Fall 2026 · {totalCredits} credits in progress</p>
        </div>
        <button className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream border border-white/10 rounded-full px-4 py-2 transition-colors self-start sm:self-auto">
          <Download className="w-4 h-4" />
          Export transcript
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-3">
            <span className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <Award className="w-[18px] h-[18px]" />
            </span>
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                Number(gpaDelta) >= 0 ? "text-teal" : "text-red-400"
              }`}
            >
              {Number(gpaDelta) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {gpaDelta}
            </span>
          </div>
          <div className="text-2xl font-display font-semibold">{currentGpa}</div>
          <div className="text-xs text-slate-text mt-1">Current semester GPA</div>
        </div>

        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal mb-3">
            <TrendingUp className="w-[18px] h-[18px]" />
          </div>
          <div className="text-2xl font-display font-semibold">3.68</div>
          <div className="text-xs text-slate-text mt-1">Cumulative GPA</div>
        </div>

        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal mb-3">
            <BookOpen className="w-[18px] h-[18px]" />
          </div>
          <div className="text-2xl font-display font-semibold truncate">{bestCourse.code}</div>
          <div className="text-xs text-slate-text mt-1">Strongest course · {bestCourse.currentGrade}</div>
        </div>

        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-clay/10 flex items-center justify-center text-clay mb-3">
            <BookOpen className="w-[18px] h-[18px]" />
          </div>
          <div className="text-2xl font-display font-semibold truncate">{weakestCourse.code}</div>
          <div className="text-xs text-slate-text mt-1">Needs attention · {weakestCourse.currentGrade}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="mb-6">
            <h2 className="font-display text-base font-semibold">GPA trend</h2>
            <p className="text-xs text-slate-text mt-0.5">Across last 8 semesters</p>
          </div>
          <svg viewBox="0 0 480 130" className="w-full h-36" preserveAspectRatio="none">
            <motion.polyline
              points={semesterGpaHistory
                .map((s, i) => `${(i / (semesterGpaHistory.length - 1)) * 480},${130 - (s.gpa - 3) * 170}`)
                .join(" ")}
              fill="none"
              stroke="#1EC2BC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
            {semesterGpaHistory.map((s, i) => (
              <circle
                key={s.term}
                cx={(i / (semesterGpaHistory.length - 1)) * 480}
                cy={130 - (s.gpa - 3) * 170}
                r={i === semesterGpaHistory.length - 1 ? 4 : 2.5}
                fill={i === semesterGpaHistory.length - 1 ? "#5CF2E8" : "#1EC2BC"}
              />
            ))}
          </svg>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-text">
            {semesterGpaHistory.map((s) => (
              <span key={s.term}>{s.term}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <h2 className="font-display text-base font-semibold mb-4">Grade scale</h2>
          <div className="space-y-2">
            {gradeScale.map((g) => (
              <div key={g.letter} className="flex items-center justify-between text-xs">
                <span className="font-medium text-cream w-8">{g.letter}</span>
                <span className="text-slate-text flex-1 text-center">{g.range}</span>
                <span className="text-slate-text w-8 text-right">{g.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-text shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>

        <div className="relative md:ml-auto" ref={sortRef}>
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort: {sortOptions.find((s) => s.value === sortKey)?.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
              {sortOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setSortKey(s.value);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    s.value === sortKey ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          No courses match your search.
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((c) => (
          <CourseGradeCard key={c.id} course={c} />
        ))}
      </div>
    </motion.div>
  );
}