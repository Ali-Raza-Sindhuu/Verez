import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  ChevronDown,
  MoreHorizontal,
  GraduationCap,
  HelpCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Eye,
  BookOpenCheck,
  ArrowUpDown,
  CalendarClock,
} from "lucide-react";

type ExamType = "exam" | "quiz";
type ExamStatus = "upcoming" | "completed";

interface ExamItem {
  id: string;
  title: string;
  course: string;
  courseColor: string;
  type: ExamType;
  date: string;
  dueSort: number;
  time: string;
  location: string;
  weight: string;
  status: ExamStatus;
  score?: string;
  scorePercent?: number;
  topics: string[];
}

const MOCK_EXAMS: ExamItem[] = [
  {
    id: "e1",
    title: "Midterm Exam",
    course: "Data Structures",
    courseColor: "#1EC2BC",
    type: "exam",
    date: "Fri, Aug 21",
    dueSort: 3,
    time: "10:00 AM",
    location: "Hall B",
    weight: "25% of final grade",
    status: "upcoming",
    topics: ["Trees", "Graphs", "Hash tables"],
  },
  {
    id: "e2",
    title: "Pop Quiz — Chapter 4",
    course: "Linear Algebra",
    courseColor: "#E7714A",
    type: "quiz",
    date: "Wed, Aug 26",
    dueSort: 8,
    time: "11:00 AM",
    location: "Room 118",
    weight: "5% of final grade",
    status: "upcoming",
    topics: ["Vector spaces", "Linear independence"],
  },
  {
    id: "e3",
    title: "Final Exam",
    course: "Technical Writing",
    courseColor: "#9277ff",
    type: "exam",
    date: "Mon, Sep 8",
    dueSort: 21,
    time: "9:00 AM",
    location: "Online",
    weight: "30% of final grade",
    status: "upcoming",
    topics: ["Research proposal defense", "Revision process"],
  },
  {
    id: "e4",
    title: "Lab Practical",
    course: "Operating Systems Lab",
    courseColor: "#65e6f4",
    type: "exam",
    date: "Thu, Aug 27",
    dueSort: 9,
    time: "4:00 PM",
    location: "Lab 3",
    weight: "15% of final grade",
    status: "upcoming",
    topics: ["Process scheduling", "Memory management"],
  },
  {
    id: "e5",
    title: "Quiz 3 — Recursion",
    course: "Data Structures",
    courseColor: "#1EC2BC",
    type: "quiz",
    date: "Aug 10",
    dueSort: -8,
    time: "9:00 AM",
    location: "Room 204",
    weight: "5% of final grade",
    status: "completed",
    score: "18/20",
    scorePercent: 90,
    topics: ["Recursive functions", "Backtracking"],
  },
  {
    id: "e6",
    title: "Quiz 2 — Matrix Basics",
    course: "Linear Algebra",
    courseColor: "#E7714A",
    type: "quiz",
    date: "Aug 5",
    dueSort: -13,
    time: "11:00 AM",
    location: "Room 118",
    weight: "5% of final grade",
    status: "completed",
    score: "27/30",
    scorePercent: 90,
    topics: ["Matrix multiplication", "Determinants"],
  },
  {
    id: "e7",
    title: "Diagnostic Quiz",
    course: "Technical Writing",
    courseColor: "#9277ff",
    type: "quiz",
    date: "Jul 28",
    dueSort: -21,
    time: "9:00 AM",
    location: "Online",
    weight: "2% of final grade",
    status: "completed",
    score: "9/10",
    scorePercent: 90,
    topics: ["Grammar", "Citation style"],
  },
];

const courseNames = ["All courses", ...Array.from(new Set(MOCK_EXAMS.map((e) => e.course)))];

type SortKey = "date" | "course" | "type";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Date", value: "date" },
  { label: "Course", value: "course" },
  { label: "Type", value: "type" },
];

const typeFilters: { label: string; value: ExamType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Exams", value: "exam" },
  { label: "Quizzes", value: "quiz" },
];

const statusFilters: { label: string; value: ExamStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

const typeStyle: Record<ExamType, { badge: string; icon: typeof GraduationCap }> = {
  exam: { badge: "bg-red-500/10 text-red-400 border-red-500/20", icon: GraduationCap },
  quiz: { badge: "bg-violet-500/10 text-violet-300 border-violet-500/20", icon: HelpCircle },
};

const typeLabel: Record<ExamType, string> = { exam: "Exam", quiz: "Quiz" };

function ExamMenu({ status }: { status: ExamStatus }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="text-slate-text hover:text-cream transition-colors p-1"
        aria-label="Exam actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-text hover:text-cream hover:bg-white/5 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            View details
          </button>
          {status === "upcoming" ? (
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-teal hover:bg-teal/10 transition-colors">
              <BookOpenCheck className="w-3.5 h-3.5" />
              Add to study planner
            </button>
          ) : (
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-text hover:text-cream hover:bg-white/5 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" />
              View result breakdown
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExamsQuizzes() {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [typeFilter, setTypeFilter] = useState<ExamType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ExamStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOpen, setSortOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const courseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (courseRef.current && !courseRef.current.contains(e.target as Node)) setCourseOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const nextExam = useMemo(() => {
    return MOCK_EXAMS.filter((e) => e.status === "upcoming").sort((a, b) => a.dueSort - b.dueSort)[0];
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_EXAMS.filter((e) => {
      const matchesQuery =
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.course.toLowerCase().includes(query.toLowerCase());
      const matchesCourse = courseFilter === "All courses" || e.course === courseFilter;
      const matchesType = typeFilter === "all" || e.type === typeFilter;
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesQuery && matchesCourse && matchesType && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "course":
          return a.course.localeCompare(b.course);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return a.dueSort - b.dueSort;
      }
    });

    return list;
  }, [query, courseFilter, typeFilter, statusFilter, sortKey]);

  const counts = {
    upcoming: MOCK_EXAMS.filter((e) => e.status === "upcoming").length,
    exams: MOCK_EXAMS.filter((e) => e.type === "exam" && e.status === "upcoming").length,
    quizzes: MOCK_EXAMS.filter((e) => e.type === "quiz" && e.status === "upcoming").length,
    avgScore: Math.round(
      MOCK_EXAMS.filter((e) => e.scorePercent).reduce((sum, e) => sum + (e.scorePercent ?? 0), 0) /
        (MOCK_EXAMS.filter((e) => e.scorePercent).length || 1)
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Exams & Quizzes</h1>
          <p className="text-sm text-slate-text mt-1">
            {counts.upcoming} upcoming · {counts.exams} exam{counts.exams !== 1 ? "s" : ""}, {counts.quizzes} quiz{counts.quizzes !== 1 ? "zes" : ""}
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add to planner
        </button>
      </div>

      {nextExam && (
        <div className="rounded-2xl border border-teal/20 bg-teal/[0.04] p-4 sm:p-5 mb-6 flex items-center gap-4">
          <span className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center text-teal shrink-0">
            <CalendarClock className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-text mb-0.5">Next up in {nextExam.dueSort} day{nextExam.dueSort !== 1 ? "s" : ""}</div>
            <div className="text-sm text-cream font-medium truncate">
              {nextExam.title} · {nextExam.course}
            </div>
          </div>
          <div className="hidden sm:block text-right shrink-0">
            <div className="text-sm text-cream">{nextExam.date}</div>
            <div className="text-xs text-slate-text">{nextExam.time}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Upcoming</div>
          <div className="text-xl font-display font-semibold text-teal">{counts.upcoming}</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Exams left</div>
          <div className="text-xl font-display font-semibold">{counts.exams}</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Quizzes left</div>
          <div className="text-xl font-display font-semibold">{counts.quizzes}</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Avg. score</div>
          <div className="text-xl font-display font-semibold">{counts.avgScore}%</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-text shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exams or quizzes"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                typeFilter === f.value
                  ? "bg-teal/10 text-teal border-teal/20"
                  : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                statusFilter === f.value
                  ? "bg-white/10 text-cream border-white/20"
                  : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:ml-auto">
          <div className="relative" ref={courseRef}>
            <button
              onClick={() => setCourseOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors max-w-[160px]"
            >
              <span className="truncate">{courseFilter}</span>
              <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${courseOpen ? "rotate-180" : ""}`} />
            </button>
            {courseOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
                {courseNames.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCourseFilter(c);
                      setCourseOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm truncate transition-colors ${
                      c === courseFilter ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOptions.find((s) => s.value === sortKey)?.label}
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
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          No exams or quizzes match your search.
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((e) => {
          const style = typeStyle[e.type];
          const TypeIcon = style.icon;
          return (
            <div
              key={e.id}
              className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-colors p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: e.courseColor }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-cream truncate">{e.title}</h3>
                      <div className="text-xs text-slate-text mt-0.5">{e.course}</div>
                    </div>
                    <ExamMenu status={e.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
                      <TypeIcon className="w-2.5 h-2.5" />
                      {typeLabel[e.type]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-text">
                      <Clock className="w-3 h-3" />
                      {e.date}, {e.time}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-text">
                      <MapPin className="w-3 h-3" />
                      {e.location}
                    </span>
                    <span className="text-xs text-slate-text">{e.weight}</span>
                    {e.score && (
                      <span className="text-xs font-medium text-teal">{e.score} ({e.scorePercent}%)</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {e.topics.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] text-slate-text/80 bg-white/[0.03] border border-white/8 rounded-full px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}