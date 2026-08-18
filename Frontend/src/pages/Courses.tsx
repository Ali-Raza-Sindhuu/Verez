import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  ChevronDown,
  MoreHorizontal,
  BookOpen,
  Clock,
  MapPin,
  User,
  FileText,
  ClipboardList,
  BarChart3,
  LogOut,
  ArrowUpDown,
} from "lucide-react";

type CourseStatus = "in-progress" | "completed" | "dropped";

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  schedule: string;
  room: string;
  color: string;
  progress: number; // 0-100, % of semester content covered
  currentGrade: string;
  gradePercent: number;
  attendance: number;
  status: CourseStatus;
}

const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    code: "CS 301",
    name: "Data Structures",
    instructor: "Dr. Farah Zaidi",
    credits: 4,
    schedule: "Mon, Wed · 9:00 AM",
    room: "Room 204",
    color: "#1EC2BC",
    progress: 62,
    currentGrade: "A-",
    gradePercent: 91,
    attendance: 96,
    status: "in-progress",
  },
  {
    id: "c2",
    code: "MATH 210",
    name: "Linear Algebra",
    instructor: "Prof. Imran Qureshi",
    credits: 3,
    schedule: "Mon, Wed · 11:00 AM",
    room: "Room 118",
    color: "#E7714A",
    progress: 58,
    currentGrade: "B+",
    gradePercent: 87,
    attendance: 89,
    status: "in-progress",
  },
  {
    id: "c3",
    code: "ENG 205",
    name: "Technical Writing",
    instructor: "Dr. Sana Malik",
    credits: 2,
    schedule: "Tue · 1:30 PM",
    room: "Online",
    color: "#9277ff",
    progress: 71,
    currentGrade: "A",
    gradePercent: 95,
    attendance: 100,
    status: "in-progress",
  },
  {
    id: "c4",
    code: "CS 322",
    name: "Operating Systems Lab",
    instructor: "Eng. Bilal Ahmed",
    credits: 1,
    schedule: "Thu · 4:00 PM",
    room: "Lab 3",
    color: "#65e6f4",
    progress: 45,
    currentGrade: "B",
    gradePercent: 82,
    attendance: 92,
    status: "in-progress",
  },
  {
    id: "c5",
    code: "CS 210",
    name: "Discrete Mathematics",
    instructor: "Dr. Farah Zaidi",
    credits: 3,
    schedule: "Completed · Spring 2026",
    room: "—",
    color: "#8ce9bd",
    progress: 100,
    currentGrade: "A",
    gradePercent: 94,
    attendance: 98,
    status: "completed",
  },
  {
    id: "c6",
    code: "PHIL 101",
    name: "Intro to Logic",
    instructor: "Dr. Waqas Anjum",
    credits: 2,
    schedule: "Dropped · Fall 2026",
    room: "—",
    color: "#e6b873",
    progress: 20,
    currentGrade: "—",
    gradePercent: 0,
    attendance: 40,
    status: "dropped",
  },
];

type SortKey = "name" | "credits" | "grade" | "attendance";
type ViewMode = "grid" | "list";

const statusFilters: { label: string; value: CourseStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "In progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Dropped", value: "dropped" },
];

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Name", value: "name" },
  { label: "Credits", value: "credits" },
  { label: "Grade", value: "grade" },
  { label: "Attendance", value: "attendance" },
];

const statusBadge: Record<CourseStatus, string> = {
  "in-progress": "bg-teal/10 text-teal border-teal/20",
  completed: "bg-white/5 text-slate-text border-white/10",
  dropped: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabel: Record<CourseStatus, string> = {
  "in-progress": "In progress",
  completed: "Completed",
  dropped: "Dropped",
};

function CourseMenu({ courseId }: { courseId: string }) {
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

  const actions = [
    { label: "View syllabus", icon: FileText, href: `/app/courses/${courseId}/syllabus` },
    { label: "View assignments", icon: ClipboardList, href: `/app/courses/${courseId}/assignments` },
    { label: "View grades", icon: BarChart3, href: `/app/courses/${courseId}/grades` },
  ];

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="text-slate-text hover:text-cream transition-colors p-1"
        aria-label="Course actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <a
                key={a.label}
                href={a.href}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-text hover:text-cream hover:bg-white/5 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
                {a.label}
              </a>
            );
          })}
          <div className="h-px bg-white/8 my-1.5" />
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Drop course
          </button>
        </div>
      )}
    </div>
  );
}

function GradeBar({ percent, color }: { percent: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

export default function Courses() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
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
    let list = MOCK_COURSES.filter((c) => {
      const matchesQuery =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "credits":
          return b.credits - a.credits;
        case "grade":
          return b.gradePercent - a.gradePercent;
        case "attendance":
          return b.attendance - a.attendance;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [query, statusFilter, sortKey]);

  const activeCourses = MOCK_COURSES.filter((c) => c.status === "in-progress");
  const totalCredits = activeCourses.reduce((sum, c) => sum + c.credits, 0);
  const avgGrade = (
    activeCourses.reduce((sum, c) => sum + c.gradePercent, 0) / (activeCourses.length || 1)
  ).toFixed(1);
  const avgAttendance = Math.round(
    activeCourses.reduce((sum, c) => sum + c.attendance, 0) / (activeCourses.length || 1)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">My Courses</h1>
          <p className="text-sm text-slate-text mt-1">
            {activeCourses.length} active course{activeCourses.length !== 1 ? "s" : ""} · {totalCredits} credits this semester
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add course
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Total credits</div>
          <div className="text-xl font-display font-semibold">{totalCredits}</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Average grade</div>
          <div className="text-xl font-display font-semibold">{avgGrade}%</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Average attendance</div>
          <div className="text-xl font-display font-semibold">{avgAttendance}%</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-text shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or instructors"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                statusFilter === f.value
                  ? "bg-teal/10 text-teal border-teal/20"
                  : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:ml-auto">
          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
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

          {/* Grid/list toggle */}
          <div className="flex items-center gap-0.5 border border-white/10 rounded-full p-0.5 shrink-0">
            <button
              onClick={() => setView("grid")}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                view === "grid" ? "bg-teal/10 text-teal" : "text-slate-text hover:text-cream"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                view === "list" ? "bg-teal/10 text-teal" : "text-slate-text hover:text-cream"
              }`}
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          No courses match your search.
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-colors overflow-hidden"
            >
              <div className="h-1" style={{ backgroundColor: c.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-slate-text mb-1">{c.code}</div>
                    <h3 className="font-display text-base font-semibold truncate">{c.name}</h3>
                  </div>
                  <CourseMenu courseId={c.id} />
                </div>

                <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border mb-4 ${statusBadge[c.status]}`}>
                  {statusLabel[c.status]}
                </span>

                <div className="space-y-1.5 mb-4 text-xs text-slate-text">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.room}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-[10px] text-slate-text mb-0.5">Grade</div>
                    <div className="text-sm font-medium text-cream">{c.currentGrade}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-text mb-0.5">Attendance</div>
                    <div className="text-sm font-medium text-cream">{c.attendance}%</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-text">Course progress</span>
                    <span className="text-[10px] text-slate-text">{c.progress}%</span>
                  </div>
                  <GradeBar percent={c.progress} color={c.color} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && filtered.length > 0 && (
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02] text-left text-xs text-slate-text uppercase tracking-wide">
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Instructor</th>
                  <th className="px-4 py-3 font-medium">Schedule</th>
                  <th className="px-4 py-3 font-medium text-center">Credits</th>
                  <th className="px-4 py-3 font-medium text-center">Grade</th>
                  <th className="px-4 py-3 font-medium text-center">Attendance</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2 h-8 rounded-full shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <div className="min-w-0">
                          <div className="text-cream truncate">{c.name}</div>
                          <div className="text-xs text-slate-text font-mono">{c.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-text">{c.instructor}</td>
                    <td className="px-4 py-3.5 text-slate-text">{c.schedule}</td>
                    <td className="px-4 py-3.5 text-center text-slate-text">{c.credits}</td>
                    <td className="px-4 py-3.5 text-center text-cream font-medium">{c.currentGrade}</td>
                    <td className="px-4 py-3.5 text-center text-slate-text">{c.attendance}%</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${statusBadge[c.status]}`}>
                        {statusLabel[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <CourseMenu courseId={c.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}