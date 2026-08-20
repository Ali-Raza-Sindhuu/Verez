import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarCheck,
  ArrowUpDown,
  ShieldAlert,
} from "lucide-react";

type SessionStatus = "present" | "absent" | "late" | "excused";

interface Session {
  date: string;
  status: SessionStatus;
}

interface CourseAttendance {
  id: string;
  code: string;
  name: string;
  color: string;
  minRequired: number; // institution's minimum attendance % to sit final exam
  sessions: Session[];
}

const MOCK_ATTENDANCE: CourseAttendance[] = [
  {
    id: "c1",
    code: "CS 301",
    name: "Data Structures",
    color: "#1EC2BC",
    minRequired: 80,
    sessions: [
      { date: "Aug 4", status: "present" },
      { date: "Aug 6", status: "present" },
      { date: "Aug 11", status: "present" },
      { date: "Aug 13", status: "late" },
      { date: "Aug 18", status: "present" },
    ],
  },
  {
    id: "c2",
    code: "MATH 210",
    name: "Linear Algebra",
    color: "#E7714A",
    minRequired: 80,
    sessions: [
      { date: "Aug 4", status: "present" },
      { date: "Aug 6", status: "absent" },
      { date: "Aug 11", status: "present" },
      { date: "Aug 13", status: "present" },
      { date: "Aug 18", status: "present" },
    ],
  },
  {
    id: "c3",
    code: "ENG 205",
    name: "Technical Writing",
    color: "#9277ff",
    minRequired: 75,
    sessions: [
      { date: "Aug 5", status: "present" },
      { date: "Aug 12", status: "present" },
      { date: "Aug 19", status: "present" },
    ],
  },
  {
    id: "c4",
    code: "CS 322",
    name: "Operating Systems Lab",
    color: "#65e6f4",
    minRequired: 85,
    sessions: [
      { date: "Aug 7", status: "present" },
      { date: "Aug 14", status: "absent" },
      { date: "Aug 21", status: "absent" },
      { date: "Aug 28", status: "excused" },
      { date: "Sep 4", status: "present" },
      { date: "Sep 11", status: "absent" },
    ],
  },
];

const statusStyle: Record<SessionStatus, { badge: string; icon: typeof CheckCircle2; dot: string }> = {
  present: { badge: "bg-teal/10 text-teal border-teal/20", icon: CheckCircle2, dot: "bg-teal" },
  absent: { badge: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle, dot: "bg-red-400" },
  late: { badge: "bg-clay/10 text-clay border-clay/20", icon: Clock3, dot: "bg-clay" },
  excused: { badge: "bg-white/5 text-slate-text border-white/10", icon: ShieldAlert, dot: "bg-slate-text" },
};

const statusLabel: Record<SessionStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
};

function computeAttendancePercent(sessions: Session[]) {
  if (sessions.length === 0) return 100;
  // present + late count as attended; excused is neutral (excluded from denominator); absent counts against
  const countable = sessions.filter((s) => s.status !== "excused");
  if (countable.length === 0) return 100;
  const attended = countable.filter((s) => s.status === "present" || s.status === "late").length;
  return Math.round((attended / countable.length) * 100);
}

type SortKey = "name" | "attendance";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Name", value: "name" },
  { label: "Attendance", value: "attendance" },
];

function CourseAttendanceCard({ course }: { course: CourseAttendance }) {
  const [expanded, setExpanded] = useState(false);
  const percent = computeAttendancePercent(course.sessions);
  const belowMin = percent < course.minRequired;
  const presentCount = course.sessions.filter((s) => s.status === "present").length;
  const absentCount = course.sessions.filter((s) => s.status === "absent").length;
  const lateCount = course.sessions.filter((s) => s.status === "late").length;
  const excusedCount = course.sessions.filter((s) => s.status === "excused").length;

  return (
    <div
      className={`rounded-2xl border bg-white/[0.02] transition-colors overflow-hidden ${
        belowMin ? "border-red-500/25 hover:border-red-500/40" : "border-white/8 hover:border-white/15"
      }`}
    >
      <button onClick={() => setExpanded((e) => !e)} className="w-full flex items-center gap-4 p-4 sm:p-5 text-left">
        <span className="w-1.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: course.color }} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-text">{course.code}</span>
            <span className="text-xs text-slate-text">· {course.sessions.length} sessions logged</span>
          </div>
          <h3 className="text-sm font-medium text-cream truncate flex items-center gap-2">
            {course.name}
            {belowMin && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border bg-red-500/10 text-red-400 border-red-500/20">
                <AlertTriangle className="w-2.5 h-2.5" />
                Below minimum
              </span>
            )}
          </h3>
        </div>

        <div className="text-right shrink-0 w-20">
          <div className={`text-lg font-display font-semibold ${belowMin ? "text-red-400" : "text-cream"}`}>
            {percent}%
          </div>
          <div className="text-[10px] text-slate-text">min {course.minRequired}%</div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-text shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Progress bar always visible */}
      <div className="px-5 pb-4">
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: belowMin ? "#f87171" : course.color }}
          />
          <div
            className="absolute top-0 bottom-0 w-px bg-white/30"
            style={{ left: `${course.minRequired}%` }}
            title={`Minimum required: ${course.minRequired}%`}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-white/8">
              <div className="grid grid-cols-4 gap-3 py-4">
                <div>
                  <div className="text-[10px] text-slate-text mb-0.5">Present</div>
                  <div className="text-sm font-medium text-teal">{presentCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-text mb-0.5">Absent</div>
                  <div className="text-sm font-medium text-red-400">{absentCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-text mb-0.5">Late</div>
                  <div className="text-sm font-medium text-clay">{lateCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-text mb-0.5">Excused</div>
                  <div className="text-sm font-medium text-slate-text">{excusedCount}</div>
                </div>
              </div>

              <div className="text-xs text-slate-text mb-2">Session log</div>
              <div className="space-y-1.5">
                {[...course.sessions].reverse().map((s, i) => {
                  const style = statusStyle[s.status];
                  const Icon = style.icon;
                  return (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-cream">{s.date}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
                        <Icon className="w-2.5 h-2.5" />
                        {statusLabel[s.status]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Attendance() {
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
    let list = MOCK_ATTENDANCE.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      if (sortKey === "attendance") {
        return computeAttendancePercent(a.sessions) - computeAttendancePercent(b.sessions);
      }
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [query, sortKey]);

  const overallPercent = Math.round(
    MOCK_ATTENDANCE.reduce((sum, c) => sum + computeAttendancePercent(c.sessions), 0) / MOCK_ATTENDANCE.length
  );
  const totalSessions = MOCK_ATTENDANCE.reduce((sum, c) => sum + c.sessions.length, 0);
  const totalAbsences = MOCK_ATTENDANCE.reduce(
    (sum, c) => sum + c.sessions.filter((s) => s.status === "absent").length,
    0
  );
  const coursesAtRisk = MOCK_ATTENDANCE.filter(
    (c) => computeAttendancePercent(c.sessions) < c.minRequired
  ).length;

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
          <h1 className="font-display text-2xl font-semibold tracking-tight">Attendance</h1>
          <p className="text-sm text-slate-text mt-1">Fall 2026 · {totalSessions} sessions tracked</p>
        </div>
      </div>

      {/* At-risk banner */}
      {coursesAtRisk > 0 && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.04] p-4 sm:p-5 mb-6 flex items-center gap-4">
          <span className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-cream font-medium">
              {coursesAtRisk} course{coursesAtRisk !== 1 ? "s" : ""} below minimum attendance
            </div>
            <div className="text-xs text-slate-text mt-0.5">
              You may be barred from sitting the final exam if attendance doesn't improve.
            </div>
          </div>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal mb-3">
            <CalendarCheck className="w-[18px] h-[18px]" />
          </div>
          <div className="text-2xl font-display font-semibold">{overallPercent}%</div>
          <div className="text-xs text-slate-text mt-1">Overall attendance</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal mb-3">
            <CheckCircle2 className="w-[18px] h-[18px]" />
          </div>
          <div className="text-2xl font-display font-semibold">{totalSessions}</div>
          <div className="text-xs text-slate-text mt-1">Sessions tracked</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-3">
            <XCircle className="w-[18px] h-[18px]" />
          </div>
          <div className="text-2xl font-display font-semibold">{totalAbsences}</div>
          <div className="text-xs text-slate-text mt-1">Total absences</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-5 bg-white/[0.02]">
          <div className="w-9 h-9 rounded-xl bg-clay/10 flex items-center justify-center text-clay mb-3">
            <AlertTriangle className="w-[18px] h-[18px]" />
          </div>
          <div className="text-2xl font-display font-semibold">{coursesAtRisk}</div>
          <div className="text-xs text-slate-text mt-1">Courses at risk</div>
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

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-slate-text mb-4">
        {(Object.keys(statusLabel) as SessionStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle[s].dot}`} />
            {statusLabel[s]}
          </span>
        ))}
      </div>

      {/* Per-course cards */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          No courses match your search.
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((c) => (
          <CourseAttendanceCard key={c.id} course={c} />
        ))}
      </div>
    </motion.div>
  );
}