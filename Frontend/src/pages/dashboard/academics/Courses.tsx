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
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cx } from "./registration/token";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchMyEnrollments,
  dropEnrollment,
  selectMyEnrollments,
  selectMyEnrollmentsStatus,
  type MyEnrollment,
} from "@/store/features/course/courseSlice";

type CourseStatus = MyEnrollment["status"];
type SortKey = "name" | "credits";
type ViewMode = "grid" | "list";

const statusFilters: { label: string; value: CourseStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Dropped", value: "dropped" },
];

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Name", value: "name" },
  { label: "Credits", value: "credits" },
];

const statusBadge: Record<CourseStatus, string> = {
  active:
    "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/20",
  completed: `bg-[var(--color-surface-alt)] ${cx.textSecondary} ${cx.border}`,
  dropped:
    "bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border-[var(--color-accent-danger)]/20",
};

const statusLabel: Record<CourseStatus, string> = {
  active: "Active",
  completed: "Completed",
  dropped: "Dropped",
};

// Backend doesn't return a display color per enrollment — derive a stable
// one from the course code so each course keeps the same color across
// renders/sessions without needing a new field on the API.
const colorPalette = ["#1EC2BC", "#E7714A", "#9277ff", "#65e6f4", "#8ce9bd", "#e6b873", "#f472b6", "#60a5fa"];
function colorForCode(code: string): string {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) >>> 0;
  return colorPalette[hash % colorPalette.length];
}

function CourseMenu({ enrollment }: { enrollment: MyEnrollment }) {
  const [open, setOpen] = useState(false);
  const [confirmingDrop, setConfirmingDrop] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmingDrop(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const actions = [
    { label: "View syllabus", icon: FileText, href: `/dashboard/courses/${enrollment.id}/syllabus` },
    { label: "View assignments", icon: ClipboardList, href: `/dashboard/courses/${enrollment.id}/assignments` },
    { label: "View grades", icon: BarChart3, href: `/dashboard/courses/${enrollment.id}/grades` },
  ];

  function handleDropClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirmingDrop) {
      setConfirmingDrop(true);
      return;
    }
    dispatch(dropEnrollment(enrollment.id));
    setOpen(false);
    setConfirmingDrop(false);
  }

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
          {enrollment.status === "active" && (
            <>
              <div className={`h-px my-1.5 ${cx.border} border-t`} />
              <button
                onClick={handleDropClick}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-accent-danger)] hover:bg-[var(--color-accent-danger)]/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                {confirmingDrop ? "Click again to confirm" : "Drop course"}
              </button>
            </>
          )}
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

function CourseCardSkeleton() {
  return (
    <div className={`rounded-2xl border overflow-hidden ${cx.border} bg-[var(--color-surface)] animate-pulse`}>
      <div className="h-1 bg-[var(--color-surface-alt)]" />
      <div className="p-5 space-y-3">
        <div className="h-2.5 w-16 rounded bg-[var(--color-surface-alt)]" />
        <div className="h-4 w-40 rounded bg-[var(--color-surface-alt)]" />
        <div className="h-5 w-24 rounded-full bg-[var(--color-surface-alt)]" />
        <div className="h-2.5 w-full rounded bg-[var(--color-surface-alt)]" />
      </div>
    </div>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const courses = useAppSelector(selectMyEnrollments);
  const status = useAppSelector(selectMyEnrollmentsStatus);
  const loading = status === "idle" || status === "loading";

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMyEnrollments());
  }, [status, dispatch]);

  useEffect(() => {
    if (!sortOpen) return;
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [sortOpen]);

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
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [courses, query, statusFilter, sortKey]);

  const activeCourses = courses.filter((c) => c.status === "active");
  const totalCredits = activeCourses.reduce((sum, c) => sum + c.credits, 0);

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

      {status === "failed" && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-accent-danger)]/20 bg-[var(--color-accent-danger)]/5 px-4 py-3 mb-4 text-sm text-[var(--color-accent-danger)]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Couldn't load your courses. Please refresh the page.
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total credits", value: totalCredits },
        ].map((stat) => (
          <div key={stat.label} className={`${cx.card} p-4`}>
            <div className={`text-xs mb-1 ${cx.textSecondary}`}>{stat.label}</div>
            <div className={`text-xl font-display font-semibold ${cx.textPrimary}`}>{loading ? "—" : stat.value}</div>
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

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && status === "succeeded" && filtered.length === 0 && (
        <div className={`rounded-2xl border py-16 text-center text-sm ${cx.textSecondary} ${cx.border}`}>
          {courses.length === 0
            ? "You're not registered for any courses yet."
            : "No courses match your search."}
        </div>
      )}

      {/* Grid view */}
      {!loading && view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const color = colorForCode(c.code);
            return (
              <div
                key={c.id}
                className={`rounded-2xl border overflow-hidden transition-colors hover:border-[var(--color-border-strong)] ${cx.border} bg-[var(--color-surface)]`}
              >
                <div className="h-1" style={{ backgroundColor: color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <div className={`text-xs font-mono mb-1 ${cx.textSecondary}`}>{c.code}</div>
                      <h3 className={`font-display text-base font-semibold truncate ${cx.textPrimary}`}>{c.name}</h3>
                    </div>
                    <CourseMenu enrollment={c} />
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
                      <div className={`text-[10px] mb-0.5 ${cx.textTertiary}`}>Credits</div>
                      <div className={`text-sm font-medium ${cx.textPrimary}`}>{c.credits}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {!loading && view === "list" && filtered.length > 0 && (
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
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const color = colorForCode(c.code);
                  return (
                    <tr
                      key={c.id}
                      className={`border-b last:border-0 transition-colors hover:bg-[var(--color-surface-alt)] ${cx.border}`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: color }} />
                          <div className="min-w-0">
                            <div className={`truncate ${cx.textPrimary}`}>{c.name}</div>
                            <div className={`text-xs font-mono ${cx.textSecondary}`}>{c.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-3.5 ${cx.textSecondary}`}>{c.instructor}</td>
                      <td className={`px-4 py-3.5 ${cx.textSecondary}`}>{c.schedule}</td>
                      <td className={`px-4 py-3.5 text-center ${cx.textSecondary}`}>{c.credits}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${statusBadge[c.status]}`}>
                          {statusLabel[c.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <CourseMenu enrollment={c} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}