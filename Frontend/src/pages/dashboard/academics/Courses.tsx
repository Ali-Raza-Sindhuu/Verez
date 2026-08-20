import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  ChevronDown,
  MoreHorizontal,
  Clock,
  MapPin,
  User,
  FileText,
  ClipboardList,
  BarChart3,
  LogOut,
  ArrowUpDown,
} from "lucide-react";
import { AddCourseModal, type NewCourseInput } from "./AddCourseModal";
import { cx } from "./registration/token";
import { useNavigate } from "react-router-dom";

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

// Shared token classes — same var(--color-*) system used across the dashboard.
// (previously duplicated inline here; now sourced from the one definition
// the course-registration module already uses, so the two stay in sync)

const statusBadge: Record<CourseStatus, string> = {
  "in-progress":
    "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/20",
  completed: `bg-[var(--color-surface-alt)] ${cx.textSecondary} ${cx.border}`,
  dropped:
    "bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border-[var(--color-accent-danger)]/20",
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
        className={`${cx.textSecondary} hover:text-[var(--color-text-primary)] transition-colors p-1`}
        aria-label="Course actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1.5 w-48 rounded-xl border py-1.5 z-30 ${cx.dropdown}`}>
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <a
                key={a.label}
                href={a.href}
                className={`flex items-center gap-2.5 px-3 py-2 text-[13px] ${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors`}
              >
                <Icon className="w-3.5 h-3.5" />
                {a.label}
              </a>
            );
          })}
          <div className={`h-px my-1.5 ${cx.border} border-t`} />
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-accent-danger)] hover:bg-[var(--color-accent-danger)]/10 transition-colors">
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
    <div className="h-1.5 rounded-full bg-[var(--color-surface-alt)] overflow-hidden">
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
  // Real state now, seeded from mock data — this is where a real fetch
  // (GET /courses) will slot in once the backend Courses module exists.
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [addOpen, setAddOpen] = useState(false);

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

  function handleAddCourse(input: NewCourseInput) {
    const newCourse: Course = {
      id: `c-${Date.now()}`,
      code: input.code.trim(),
      name: input.name.trim(),
      instructor: input.instructor.trim(),
      credits: input.credits,
      schedule: input.schedule.trim(),
      room: input.room.trim() || "—",
      color: input.color,
      progress: 0,
      currentGrade: "—",
      gradePercent: 0,
      attendance: 100,
      status: "in-progress",
    };
    // TODO: once POST /courses exists, call it here and use the returned
    // record (with server-issued id) instead of optimistically constructing
    // one locally. Keep this local-insert as the optimistic-update fallback.
    setCourses((list) => [newCourse, ...list]);
    setAddOpen(false);
  }

  const filtered = useMemo(() => {
    let list = courses.filter((c) => {
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
  }, [courses, query, statusFilter, sortKey]);

  const activeCourses = courses.filter((c) => c.status === "in-progress");
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
          <h1 className={`font-display text-2xl font-semibold tracking-tight ${cx.textPrimary}`}>My Courses</h1>
          <p className={`text-sm mt-1 ${cx.textSecondary}`}>
            {activeCourses.length} active course{activeCourses.length !== 1 ? "s" : ""} · {totalCredits} credits this semester
          </p>
        </div>
        <button
  onClick={() => navigate("/dashboard/courses/register")}
  className="inline-flex items-center gap-1.5 bg-[var(--color-accent-primary)] text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity shadow-[var(--shadow-cta-glow)]"
>
  <Plus className="w-4 h-4" />
  Register for courses
</button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total credits", value: totalCredits },
          { label: "Average grade", value: `${avgGrade}%` },
          { label: "Average attendance", value: `${avgAttendance}%` },
        ].map((stat) => (
          <div key={stat.label} className={`${cx.card} p-4`}>
            <div className={`text-xs mb-1 ${cx.textSecondary}`}>{stat.label}</div>
            <div className={`text-xl font-display font-semibold ${cx.textPrimary}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div
          className={`flex items-center gap-2 rounded-full px-3.5 py-2 flex-1 max-w-sm border bg-[var(--color-surface-alt)] ${cx.border}`}
        >
          <Search className={`w-4 h-4 shrink-0 ${cx.textTertiary}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or instructors"
            className={`bg-transparent text-sm focus:outline-none w-full ${cx.textPrimary} placeholder:text-[var(--color-text-tertiary)]`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusFilters.map((f) => {
            const active = statusFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                  active
                    ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/20"
                    : `${cx.textSecondary} border-[var(--color-border-hairline)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]`
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:ml-auto">
          {/* Sort dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              className={`inline-flex items-center gap-1.5 text-xs border rounded-full px-3.5 py-2 transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] ${cx.border}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort: {sortOptions.find((s) => s.value === sortKey)?.label}
              <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className={`absolute right-0 top-full mt-1.5 w-40 rounded-xl border py-1.5 z-30 ${cx.dropdown}`}>
                {sortOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      setSortKey(s.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      s.value === sortKey
                        ? "text-[var(--color-accent-primary)]"
                        : `${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid/list toggle */}
          <div className={`flex items-center gap-0.5 border rounded-full p-0.5 shrink-0 ${cx.border}`}>
            <button
              onClick={() => setView("grid")}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                view === "grid"
                  ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]"
                  : `${cx.textSecondary} hover:text-[var(--color-text-primary)]`
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                view === "list"
                  ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]"
                  : `${cx.textSecondary} hover:text-[var(--color-text-primary)]`
              }`}
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className={`rounded-2xl border py-16 text-center text-sm ${cx.textSecondary} ${cx.border}`}>
          No courses match your search.
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`rounded-2xl border overflow-hidden transition-colors hover:border-[var(--color-border-strong)] ${cx.border} bg-[var(--color-surface)]`}
            >
              <div className="h-1" style={{ backgroundColor: c.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className={`text-xs font-mono mb-1 ${cx.textSecondary}`}>{c.code}</div>
                    <h3 className={`font-display text-base font-semibold truncate ${cx.textPrimary}`}>{c.name}</h3>
                  </div>
                  <CourseMenu courseId={c.id} />
                </div>

                <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border mb-4 ${statusBadge[c.status]}`}>
                  {statusLabel[c.status]}
                </span>

                <div className={`space-y-1.5 mb-4 text-xs ${cx.textSecondary}`}>
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
                    <div className={`text-[10px] mb-0.5 ${cx.textTertiary}`}>Grade</div>
                    <div className={`text-sm font-medium ${cx.textPrimary}`}>{c.currentGrade}</div>
                  </div>
                  <div>
                    <div className={`text-[10px] mb-0.5 ${cx.textTertiary}`}>Attendance</div>
                    <div className={`text-sm font-medium ${cx.textPrimary}`}>{c.attendance}%</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] ${cx.textTertiary}`}>Course progress</span>
                    <span className={`text-[10px] ${cx.textTertiary}`}>{c.progress}%</span>
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
        <div className={`rounded-2xl border overflow-hidden ${cx.border}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className={`border-b text-left text-xs uppercase tracking-wide ${cx.textSecondary} ${cx.border}`}
                  style={{ background: "var(--color-surface-alt)" }}
                >
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
                  <tr
                    key={c.id}
                    className={`border-b last:border-0 transition-colors hover:bg-[var(--color-surface-alt)] ${cx.border}`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <div className="min-w-0">
                          <div className={`truncate ${cx.textPrimary}`}>{c.name}</div>
                          <div className={`text-xs font-mono ${cx.textSecondary}`}>{c.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3.5 ${cx.textSecondary}`}>{c.instructor}</td>
                    <td className={`px-4 py-3.5 ${cx.textSecondary}`}>{c.schedule}</td>
                    <td className={`px-4 py-3.5 text-center ${cx.textSecondary}`}>{c.credits}</td>
                    <td className={`px-4 py-3.5 text-center font-medium ${cx.textPrimary}`}>{c.currentGrade}</td>
                    <td className={`px-4 py-3.5 text-center ${cx.textSecondary}`}>{c.attendance}%</td>
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

      <AddCourseModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddCourse} />
    </motion.div>
  );
}