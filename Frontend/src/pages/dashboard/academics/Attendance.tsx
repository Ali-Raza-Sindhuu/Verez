import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  ShieldAlert,
  CalendarCheck,
  X,
  RefreshCcw,
} from "lucide-react";

/* ==================================================
   1. TYPES
   ================================================== */

type AttendanceStatus = "good" | "at-risk" | "critical";
type SessionStatus = "present" | "absent" | "late" | "excused";

interface AttendanceRecord {
  id: string;
  date: string;
  topic: string;
  status: SessionStatus;
  time?: string;
}

interface CourseAttendance {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  color: string;
  department: string;
  credits: number;

  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  excused: number;

  attendancePercentage: number;
  status: AttendanceStatus;

  recentAttendance: AttendanceRecord[];
  calendarMonth: string; // e.g. "2026-08"
  calendarDays: { day: number; status: SessionStatus | null }[];
}

interface AttendanceSummary {
  overallPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  atRiskCourses: number;
}

interface AttendanceTrend {
  label: string;
  percentage: number;
}

/* ==================================================
   2. CONFIG (backend-replaceable thresholds)
   ================================================== */

const ATTENDANCE_THRESHOLDS = {
  good: 85,
  atRisk: 75,
  minimumRequired: 75,
};

function getAttendanceStatus(percentage: number): AttendanceStatus {
  if (percentage >= ATTENDANCE_THRESHOLDS.good) return "good";
  if (percentage >= ATTENDANCE_THRESHOLDS.atRisk) return "at-risk";
  return "critical";
}

function getAttendanceMessage(status: AttendanceStatus): string {
  if (status === "good") return "You're maintaining a healthy attendance rate. Keep it up!";
  if (status === "at-risk")
    return "Your attendance is below the recommended threshold. Try to attend upcoming classes consistently.";
  return "Your attendance is critically low. Check your university attendance policy.";
}

const statusMeta: Record<AttendanceStatus, { label: string; badge: string; icon: typeof CheckCircle2 }> = {
  good: { label: "Good", badge: "bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border-[var(--color-accent-success)]/20", icon: CheckCircle2 },
  "at-risk": { label: "At Risk", badge: "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] border-[var(--color-accent-secondary)]/20", icon: AlertTriangle },
  critical: { label: "Critical", badge: "bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border-[var(--color-accent-danger)]/20", icon: XCircle },
};

const sessionMeta: Record<SessionStatus, { label: string; badge: string; icon: typeof CheckCircle2; dot: string }> = {
  present: { label: "Present", badge: "bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border-[var(--color-accent-success)]/20", icon: CheckCircle2, dot: "bg-[var(--color-accent-success)]" },
  absent: { label: "Absent", badge: "bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border-[var(--color-accent-danger)]/20", icon: XCircle, dot: "bg-[var(--color-accent-danger)]" },
  late: { label: "Late", badge: "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] border-[var(--color-accent-secondary)]/20", icon: Clock3, dot: "bg-[var(--color-accent-secondary)]" },
  excused: { label: "Excused", badge: "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] border-[var(--color-border-strong)]", icon: ShieldAlert, dot: "bg-[var(--color-text-secondary)]" },
};

/* ==================================================
   3. MOCK DATA / SERVICE LAYER (attendanceService)
   ================================================== */

const SEMESTERS = ["Fall 2025", "Spring 2026", "Summer 2026", "Fall 2026"];

const TREND_BY_SEMESTER: Record<string, AttendanceTrend[]> = {
  "Fall 2026": [
    { label: "Week 1", percentage: 100 },
    { label: "Week 2", percentage: 96 },
    { label: "Week 3", percentage: 91 },
    { label: "Week 4", percentage: 95 },
    { label: "Week 5", percentage: 88 },
    { label: "Week 6", percentage: 94 },
    { label: "Week 7", percentage: 92 },
    { label: "Week 8", percentage: 96 },
  ],
  "Summer 2026": [
    { label: "Week 1", percentage: 100 },
    { label: "Week 2", percentage: 90 },
    { label: "Week 3", percentage: 85 },
    { label: "Week 4", percentage: 88 },
  ],
  "Spring 2026": [
    { label: "Week 1", percentage: 95 },
    { label: "Week 2", percentage: 92 },
    { label: "Week 3", percentage: 89 },
    { label: "Week 4", percentage: 93 },
    { label: "Week 5", percentage: 90 },
    { label: "Week 6", percentage: 87 },
  ],
  "Fall 2025": [
    { label: "Week 1", percentage: 98 },
    { label: "Week 2", percentage: 94 },
    { label: "Week 3", percentage: 90 },
    { label: "Week 4", percentage: 91 },
    { label: "Week 5", percentage: 86 },
  ],
};

function buildCalendarDays(pattern: (SessionStatus | null)[]): { day: number; status: SessionStatus | null }[] {
  return pattern.map((status, i) => ({ day: i + 1, status }));
}

const COURSES_BY_SEMESTER: Record<string, CourseAttendance[]> = {
  "Fall 2026": [
    {
      id: "att-1",
      courseId: "CS-301",
      courseCode: "CS-301",
      courseName: "Database Systems",
      color: "#a78bfa",
      department: "Computer Science",
      credits: 3,
      totalClasses: 32,
      present: 30,
      absent: 2,
      late: 0,
      excused: 0,
      attendancePercentage: 93.8,
      status: getAttendanceStatus(93.8),
      recentAttendance: [
        { id: "r1", date: "Aug 21", topic: "Database Normalization", status: "present" },
        { id: "r2", date: "Aug 19", topic: "SQL Joins", status: "present" },
        { id: "r3", date: "Aug 17", topic: "ER Diagram Design", status: "present" },
        { id: "r4", date: "Aug 14", topic: "Indexing Techniques", status: "absent" },
        { id: "r5", date: "Aug 12", topic: "Transactions", status: "present" },
      ],
      calendarMonth: "August 2026",
      calendarDays: buildCalendarDays([
        "present", "present", null, null, "present", "present", null,
        null, "absent", "present", "present", null, null, "present",
        "present", null, null, "present", "present", null, "present",
      ]),
    },
    {
      id: "att-2",
      courseId: "CS-302",
      courseCode: "CS-302",
      courseName: "Web Engineering",
      color: "#818cf8",
      department: "Computer Science",
      credits: 3,
      totalClasses: 28,
      present: 26,
      absent: 2,
      late: 0,
      excused: 0,
      attendancePercentage: 92.86,
      status: getAttendanceStatus(92.86),
      recentAttendance: [
        { id: "r1", date: "Aug 20", topic: "REST API Design", status: "present" },
        { id: "r2", date: "Aug 18", topic: "Component Architecture", status: "present" },
        { id: "r3", date: "Aug 13", topic: "State Management", status: "absent" },
        { id: "r4", date: "Aug 11", topic: "Routing Patterns", status: "present" },
      ],
      calendarMonth: "August 2026",
      calendarDays: buildCalendarDays([
        "present", null, "present", "present", null, null, "absent",
        "present", null, null, "present", "present", null, "present",
      ]),
    },
    {
      id: "att-3",
      courseId: "CS-305",
      courseCode: "CS-305",
      courseName: "Artificial Intelligence",
      color: "#c4b5fd",
      department: "Computer Science",
      credits: 3,
      totalClasses: 25,
      present: 20,
      absent: 5,
      late: 0,
      excused: 0,
      attendancePercentage: 80.0,
      status: getAttendanceStatus(80.0),
      recentAttendance: [
        { id: "r1", date: "Aug 20", topic: "Search Algorithms", status: "present" },
        { id: "r2", date: "Aug 18", topic: "Knowledge Representation", status: "absent" },
        { id: "r3", date: "Aug 13", topic: "Neural Networks Intro", status: "absent" },
        { id: "r4", date: "Aug 11", topic: "Heuristics", status: "present" },
      ],
      calendarMonth: "August 2026",
      calendarDays: buildCalendarDays([
        "present", null, "absent", "present", null, null, "absent",
        "present", null, null, "absent", "present", null, "present",
      ]),
    },
    {
      id: "att-4",
      courseId: "MATH-201",
      courseCode: "MATH-201",
      courseName: "Discrete Mathematics",
      color: "#93c5fd",
      department: "Mathematics",
      credits: 3,
      totalClasses: 30,
      present: 27,
      absent: 3,
      late: 0,
      excused: 0,
      attendancePercentage: 90.0,
      status: getAttendanceStatus(90.0),
      recentAttendance: [
        { id: "r1", date: "Aug 21", topic: "Graph Theory", status: "present" },
        { id: "r2", date: "Aug 19", topic: "Combinatorics", status: "present" },
        { id: "r3", date: "Aug 14", topic: "Set Theory Review", status: "absent" },
      ],
      calendarMonth: "August 2026",
      calendarDays: buildCalendarDays([
        "present", "present", null, null, "present", "absent", null,
        null, "present", "present", null, "present", null, "present",
      ]),
    },
    {
      id: "att-5",
      courseId: "ENG-101",
      courseCode: "ENG-101",
      courseName: "Technical Communication",
      color: "#f0abfc",
      department: "English",
      credits: 2,
      totalClasses: 24,
      present: 23,
      absent: 1,
      late: 0,
      excused: 0,
      attendancePercentage: 95.83,
      status: getAttendanceStatus(95.83),
      recentAttendance: [
        { id: "r1", date: "Aug 20", topic: "Technical Reports", status: "present" },
        { id: "r2", date: "Aug 13", topic: "Proposal Writing", status: "present" },
        { id: "r3", date: "Aug 6", topic: "Peer Review Workshop", status: "absent" },
      ],
      calendarMonth: "August 2026",
      calendarDays: buildCalendarDays([
        "present", null, null, "present", "present", null, null,
        "absent", "present", null, null, "present", "present", null,
      ]),
    },
  ],
};
// Fall back to Fall 2026 dataset for other semesters (V1 mock scope)
COURSES_BY_SEMESTER["Summer 2026"] = COURSES_BY_SEMESTER["Fall 2026"];
COURSES_BY_SEMESTER["Spring 2026"] = COURSES_BY_SEMESTER["Fall 2026"];
COURSES_BY_SEMESTER["Fall 2025"] = COURSES_BY_SEMESTER["Fall 2026"];

function computeSummary(courses: CourseAttendance[]): AttendanceSummary {
  const totalClasses = courses.reduce((s, c) => s + c.totalClasses, 0);
  const attendedClasses = courses.reduce((s, c) => s + c.present, 0);
  const missedClasses = courses.reduce((s, c) => s + c.absent, 0);
  const atRiskCourses = courses.filter((c) => c.status !== "good").length;
  const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 0;
  return { overallPercentage, totalClasses, attendedClasses, missedClasses, atRiskCourses };
}

/** Mock async service layer — swap internals for real fetch calls later. */
const attendanceService = {
  async getSemesterAttendance(semesterId: string): Promise<{ summary: AttendanceSummary; trend: AttendanceTrend[]; courses: CourseAttendance[] }> {
    await new Promise((r) => setTimeout(r, 500));
    const courses = COURSES_BY_SEMESTER[semesterId] ?? [];
    return {
      summary: computeSummary(courses),
      trend: TREND_BY_SEMESTER[semesterId] ?? [],
      courses,
    };
  },
};

/* ==================================================
   4. SHARED UI PIECES
   ================================================== */

function RingProgress({ percent, size = 40 }: { percent: number; size?: number }) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, percent) / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#a78bfa"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </svg>
  );
}

function ProgressBar({ percent, color, markerAt }: { percent: number; color?: string; markerAt?: number }) {
  return (
    <div className="h-1.5 rounded-full bg-[var(--color-surface-alt)] overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color ?? "#a78bfa" }}
      />
      {markerAt !== undefined && (
        <div
          className="absolute top-0 bottom-0 w-px bg-[var(--color-text-tertiary)]"
          style={{ left: `${markerAt}%` }}
          title={`Minimum required: ${markerAt}%`}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${meta.badge}`}>
      <Icon className="w-2.5 h-2.5" />
      {meta.label}
    </span>
  );
}

function KpiSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 sm:p-5 animate-pulse">
      <div className="h-3 w-16 bg-[var(--color-surface-alt)] rounded mb-4" />
      <div className="h-6 w-20 bg-[var(--color-surface-alt)] rounded mb-2" />
      <div className="h-2.5 w-24 bg-[var(--color-surface-alt)] rounded" />
    </div>
  );
}

function CourseRowSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 sm:p-5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-1 self-stretch bg-[var(--color-surface-alt)] rounded-full hidden sm:block" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-16 bg-[var(--color-surface-alt)] rounded" />
          <div className="h-4 w-40 bg-[var(--color-surface-alt)] rounded" />
        </div>
        <div className="h-8 w-24 bg-[var(--color-surface-alt)] rounded-full shrink-0" />
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border-hairline)] py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center mx-auto mb-3 text-[var(--color-text-secondary)]">
        <CalendarCheck className="w-5 h-5" />
      </div>
      <div className="text-sm text-[var(--color-text-primary)] font-medium">{title}</div>
      {subtitle && <div className="text-xs text-[var(--color-text-secondary)] mt-1">{subtitle}</div>}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border-hairline)] py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-accent-danger)]/10 flex items-center justify-center mx-auto mb-3 text-[var(--color-accent-danger)]">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="text-sm text-[var(--color-text-primary)] font-medium mb-1">Unable to load attendance</div>
      <div className="text-xs text-[var(--color-text-secondary)] mb-4">We couldn't retrieve your attendance information.</div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full bg-[#9277ff]/10 text-[#9277ff] border border-[#9277ff]/20 hover:bg-[#9277ff]/15 transition-colors"
      >
        <RefreshCcw className="w-3.5 h-3.5" />
        Try Again
      </button>
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
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-primary)] border border-[var(--color-border-strong)] rounded-full px-4 py-2 hover:border-[var(--color-border-strong)] transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="listbox" className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-bg)] shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
          {SEMESTERS.slice()
            .reverse()
            .map((s) => (
              <button
                key={s}
                role="option"
                aria-selected={s === value}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  s === value ? "text-[#9277ff]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]"
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
   6. SUMMARY CARDS
   ================================================== */

function AttendanceSummaryCards({ summary, loading }: { summary: AttendanceSummary; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--color-text-secondary)]">Overall Attendance</span>
          <RingProgress percent={summary.overallPercentage} size={36} />
        </div>
        <div className="text-2xl font-display font-semibold text-[var(--color-text-primary)]">{summary.overallPercentage}%</div>
        <div className="text-xs text-[var(--color-text-secondary)] mt-1.5">Across all classes</div>
      </div>

      <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--color-text-secondary)]">Classes Attended</span>
          <span className="w-8 h-8 rounded-lg bg-[#9277ff]/10 flex items-center justify-center text-[#9277ff] shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-display font-semibold text-[var(--color-text-primary)]">
          {summary.attendedClasses} <span className="text-sm text-[var(--color-text-secondary)] font-normal">/ {summary.totalClasses}</span>
        </div>
        <div className="text-xs text-[var(--color-text-secondary)] mt-1.5">Classes attended</div>
      </div>

      <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--color-text-secondary)]">Classes Missed</span>
          <span className="w-8 h-8 rounded-lg bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-text-secondary)] shrink-0">
            <XCircle className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-display font-semibold text-[var(--color-text-primary)]">{summary.missedClasses}</div>
        <div className="text-xs text-[var(--color-text-secondary)] mt-1.5">Across all courses</div>
      </div>

      <div
        className={`rounded-2xl border p-4 sm:p-5 ${
          summary.atRiskCourses > 0 ? "border-[var(--color-accent-secondary)]/20 bg-[var(--color-accent-secondary)]/[0.04]" : "border-[var(--color-border-hairline)] bg-[var(--color-surface)]"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--color-text-secondary)]">At Risk</span>
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              summary.atRiskCourses > 0 ? "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)]" : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </span>
        </div>
        <div className="text-2xl font-display font-semibold text-[var(--color-text-primary)]">{summary.atRiskCourses}</div>
        <div className="text-xs text-[var(--color-text-secondary)] mt-1.5">
          {summary.atRiskCourses === 1 ? "Course needs attention" : "Courses need attention"}
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   7. ATTENDANCE TREND CHART
   ================================================== */

function AttendanceTrendChart({ trend, loading }: { trend: AttendanceTrend[]; loading: boolean }) {
  const [hover, setHover] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-5 animate-pulse">
        <div className="h-4 w-40 bg-[var(--color-surface-alt)] rounded mb-2" />
        <div className="h-3 w-56 bg-[var(--color-surface-alt)] rounded mb-6" />
        <div className="h-40 w-full bg-[var(--color-surface-alt)] rounded" />
      </div>
    );
  }

  if (trend.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-5">
        <h2 className="font-display text-base font-semibold text-[var(--color-text-primary)] mb-1">Attendance Overview</h2>
        <p className="text-xs text-[var(--color-text-secondary)] mb-6">Your attendance over the current semester</p>
        <EmptyState title="No attendance data available for this semester." />
      </div>
    );
  }

  const w = 480;
  const h = 160;
  const min = 60;
  const max = 100;
  const scaleY = (v: number) => h - ((v - min) / (max - min)) * h;
  const points = trend.map((t, i) => ({ x: (i / (trend.length - 1)) * w, y: scaleY(t.percentage), ...t }));
  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `0,${h} ${linePoints} ${w},${h}`;
  const thresholdY = scaleY(ATTENDANCE_THRESHOLDS.minimumRequired);
  const yTicks = [60, 70, 80, 90, 100];

  return (
    <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] p-5">
      <div className="mb-5">
        <h2 className="font-display text-base font-semibold text-[var(--color-text-primary)]">Attendance Overview</h2>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Your attendance over the current semester</p>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-[10px] text-[var(--color-text-secondary)] py-1 shrink-0">
          {yTicks
            .slice()
            .reverse()
            .map((t) => (
              <span key={t}>{t}%</span>
            ))}
        </div>

        <div className="flex-1 min-w-0 relative">
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="w-full h-40"
            preserveAspectRatio="none"
            role="img"
            aria-label="Weekly attendance percentage trend"
          >
            <defs>
              <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </linearGradient>
            </defs>

            {yTicks.map((t) => (
              <line key={t} x1={0} x2={w} y1={scaleY(t)} y2={scaleY(t)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}

            <line
              x1={0}
              x2={w}
              y1={thresholdY}
              y2={thresholdY}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />

            <motion.polygon points={areaPoints} fill="url(#attFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
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
                key={p.label}
                cx={p.x}
                cy={p.y}
                r={hover === i ? 5 : 3}
                fill="#c4b5fd"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer"
              />
            ))}
          </svg>

          {hover !== null && (
            <div
              className="absolute -translate-x-1/2 -translate-y-full bg-[var(--color-bg)] border border-[var(--color-border-strong)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--color-text-primary)] shadow-[0_10px_30px_rgba(0,0,0,.5)] pointer-events-none"
              style={{ left: `${(points[hover].x / w) * 100}%`, top: `${(points[hover].y / h) * 100}%` }}
            >
              {points[hover].label}: {points[hover].percentage}%
            </div>
          )}

          <div className="flex items-center justify-between mt-2 text-[10px] text-[var(--color-text-secondary)]">
            {trend.map((t) => (
              <span key={t.label}>{t.label.replace("Week ", "W")}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-[var(--color-text-secondary)]">
        <span className="w-2.5 border-t border-dashed border-[var(--color-accent-secondary)]/60" />
        Minimum required: {ATTENDANCE_THRESHOLDS.minimumRequired}%
      </div>
    </div>
  );
}

/* ==================================================
   8. COURSE ATTENDANCE TOOLBAR + ROW
   ================================================== */

function AttendanceToolbar({
  query,
  onQuery,
  course,
  onCourse,
  courses,
  status,
  onStatus,
}: {
  query: string;
  onQuery: (v: string) => void;
  course: string;
  onCourse: (v: string) => void;
  courses: string[];
  status: string;
  onStatus: (v: string) => void;
}) {
  const [courseOpen, setCourseOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const courseRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Good", value: "good" },
    { label: "At Risk", value: "at-risk" },
    { label: "Critical", value: "critical" },
  ];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (courseRef.current && !courseRef.current.contains(e.target as Node)) setCourseOpen(false);
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
      <div className="relative shrink-0" ref={courseRef}>
        <button
          onClick={() => setCourseOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-strong)] rounded-full px-3.5 py-2 transition-colors max-w-[180px]"
        >
          <span className="truncate">{course}</span>
          <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${courseOpen ? "rotate-180" : ""}`} />
        </button>
        {courseOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-bg)] shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
            {courses.map((c) => (
              <button
                key={c}
                onClick={() => {
                  onCourse(c);
                  setCourseOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm truncate transition-colors ${
                  c === course ? "text-[#9277ff]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]"
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
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-strong)] rounded-full px-3.5 py-2 transition-colors"
        >
          {statusOptions.find((s) => s.value === status)?.label}
          <ChevronDown className={`w-3 h-3 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
        </button>
        {statusOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-40 rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-bg)] shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
            {statusOptions.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  onStatus(s.value);
                  setStatusOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  s.value === status ? "text-[#9277ff]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 bg-[var(--color-surface-alt)] border border-[var(--color-border-hairline)] rounded-full px-3.5 py-2 flex-1 max-w-sm">
        <Search className="w-4 h-4 text-[var(--color-text-secondary)] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search courses..."
          className="bg-transparent text-sm placeholder:text-[var(--color-text-secondary)] focus:outline-none w-full"
          aria-label="Search courses"
        />
      </div>
    </div>
  );
}

function CourseAttendanceRow({ course, onView }: { course: CourseAttendance; onView: (c: CourseAttendance) => void }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-colors p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="hidden sm:block w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: course.color }} />

        <div className="min-w-0 flex-1">
          <div className="text-xs text-[var(--color-text-secondary)]">{course.courseCode}</div>
          <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">{course.courseName}</h3>
          <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            {course.credits} Credits • {course.department}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 sm:w-auto w-full">
          <div>
            <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">Classes</div>
            <div className="text-xs text-[var(--color-text-primary)]">{course.totalClasses}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">Present</div>
            <div className="text-xs text-[var(--color-accent-success)]">{course.present}</div>
          </div>
          <div>
            <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">Absent</div>
            <div className="text-xs text-[var(--color-accent-danger)]">{course.absent}</div>
          </div>
        </div>

        <div className="w-full sm:w-40 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--color-text-primary)] font-medium">{course.attendancePercentage}%</span>
            <StatusBadge status={course.status} />
          </div>
          <ProgressBar
            percent={course.attendancePercentage}
            color={course.status === "good" ? "#34d399" : course.status === "at-risk" ? "#fbbf24" : "#f87171"}
            markerAt={ATTENDANCE_THRESHOLDS.minimumRequired}
          />
        </div>

        <button
          onClick={() => onView(course)}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#9277ff] hover:text-[#9277ff] border border-[#9277ff]/20 bg-[#9277ff]/10 rounded-full px-3.5 py-1.5 transition-colors shrink-0 self-start sm:self-center"
        >
          View Details
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/* ==================================================
   9. COMPACT ATTENDANCE CALENDAR
   ================================================== */

function AttendanceCalendar({ month, days }: { month: string; days: { day: number; status: SessionStatus | null }[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-[var(--color-text-primary)]">{month}</div>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors" aria-label="Previous month" disabled>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors" aria-label="Next month" disabled>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const meta = d.status ? sessionMeta[d.status] : null;
          return (
            <div
              key={d.day}
              className={`aspect-square rounded-lg flex items-center justify-center text-[11px] border ${
                meta ? meta.badge : "border-[var(--color-border-hairline)] text-[var(--color-text-tertiary)]"
              }`}
              title={meta ? `${d.day}: ${meta.label}` : undefined}
            >
              {d.day}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] text-[var(--color-text-secondary)]">
        {(Object.keys(sessionMeta) as SessionStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${sessionMeta[s].dot}`} />
            {sessionMeta[s].label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ==================================================
   10. ATTENDANCE DETAILS DRAWER
   ================================================== */

function AttendanceDetailsDrawer({ course, onClose }: { course: CourseAttendance | null; onClose: () => void }) {
  if (!course) return null;
  const message = getAttendanceMessage(course.status);
  const meta = statusMeta[course.status];
  const StatusIcon = meta.icon;

  const breakdown = [
    { label: "Present", value: course.present, color: "#34d399" },
    { label: "Absent", value: course.absent, color: "#f87171" },
    { label: "Late", value: course.late, color: "#fbbf24" },
    { label: "Excused", value: course.excused, color: "#94a3b8" },
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
        aria-label={`${course.courseName} attendance details`}
        className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[var(--color-bg)] border-l border-[var(--color-border-hairline)] overflow-y-auto"
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-lg font-display font-semibold text-[var(--color-text-primary)]">{course.courseName}</h3>
              <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {course.courseCode} · {course.department}
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close details"
              className="p-1.5 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-xl border border-[var(--color-border-hairline)] p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-display font-semibold text-[var(--color-text-primary)]">{course.attendancePercentage}%</span>
              <StatusBadge status={course.status} />
            </div>
            <ProgressBar
              percent={course.attendancePercentage}
              color={course.status === "good" ? "#34d399" : course.status === "at-risk" ? "#fbbf24" : "#f87171"}
              markerAt={ATTENDANCE_THRESHOLDS.minimumRequired}
            />
            <div className="text-xs text-[var(--color-text-secondary)] mt-2">
              {course.present} / {course.totalClasses} classes attended
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs font-medium text-[var(--color-text-primary)] mb-3">Attendance Breakdown</div>
            <div className="space-y-3">
              {breakdown.map((b) => {
                const pct = course.totalClasses > 0 ? Math.round((b.value / course.totalClasses) * 100) : 0;
                return (
                  <div key={b.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--color-text-primary)]">{b.label}</span>
                      <span className="text-xs text-[var(--color-text-secondary)]">{b.value}</span>
                    </div>
                    <ProgressBar percent={pct} color={b.color} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border-hairline)] p-4 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <StatusIcon className="w-4 h-4 shrink-0 text-[#9277ff]" />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">{meta.label}</span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{message}</p>
          </div>

          <div className="mb-6">
            <div className="text-xs font-medium text-[var(--color-text-primary)] mb-3">Recent Classes</div>
            {course.recentAttendance.length === 0 ? (
              <EmptyState title="No attendance records available yet." />
            ) : (
              <div className="space-y-1">
                {course.recentAttendance.map((r) => {
                  const rm = sessionMeta[r.status];
                  const Icon = rm.icon;
                  return (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-[var(--color-border-hairline)] last:border-0">
                      <div className="min-w-0">
                        <div className="text-xs text-[var(--color-text-primary)] truncate">{r.topic}</div>
                        <div className="text-[10px] text-[var(--color-text-secondary)]">
                          {r.date}
                          {r.time ? ` · ${r.time}` : ""}
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${rm.badge}`}>
                        <Icon className="w-2.5 h-2.5" />
                        {rm.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs font-medium text-[var(--color-text-primary)] mb-3">Attendance Calendar</div>
            <div className="rounded-xl border border-[var(--color-border-hairline)] p-4">
              <AttendanceCalendar month={course.calendarMonth} days={course.calendarDays} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ==================================================
   11. ROOT: AttendancePage
   ================================================== */

export default function AttendancePage() {
  const [semester, setSemester] = useState("Fall 2026");
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [status, setStatus] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseAttendance | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<{ summary: AttendanceSummary; trend: AttendanceTrend[]; courses: CourseAttendance[] } | null>(null);

  const load = useCallback((semesterId: string) => {
    setLoading(true);
    setError(false);
    attendanceService
      .getSemesterAttendance(semesterId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load(semester);
    setQuery("");
    setCourse("All Courses");
    setStatus("all");
  }, [semester, load]);

  const courses = data?.courses ?? [];
  const courseNames = ["All Courses", ...Array.from(new Set(courses.map((c) => c.courseName)))];

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesQuery =
        c.courseName.toLowerCase().includes(query.toLowerCase()) ||
        c.courseCode.toLowerCase().includes(query.toLowerCase()) ||
        c.department.toLowerCase().includes(query.toLowerCase());
      const matchesCourse = course === "All Courses" || c.courseName === course;
      const matchesStatus = status === "all" || c.status === status;
      return matchesQuery && matchesCourse && matchesStatus;
    });
  }, [courses, query, course, status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">Attendance</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Track your class attendance and stay on top of your classes.</p>
        </div>
        <div className="self-start sm:self-auto">
          <SemesterSelector value={semester} onChange={setSemester} />
        </div>
      </div>

      {error ? (
        <ErrorState onRetry={() => load(semester)} />
      ) : (
        <>
          <AttendanceSummaryCards summary={data?.summary ?? { overallPercentage: 0, totalClasses: 0, attendedClasses: 0, missedClasses: 0, atRiskCourses: 0 }} loading={loading} />

          <div className="mb-6">
            <AttendanceTrendChart trend={data?.trend ?? []} loading={loading} />
          </div>

          <div>
            <div className="mb-1">
              <h2 className="font-display text-base font-semibold text-[var(--color-text-primary)]">Course Attendance</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 mb-4">Attendance breakdown by course.</p>
            </div>

            <AttendanceToolbar
              query={query}
              onQuery={setQuery}
              course={course}
              onCourse={setCourse}
              courses={courseNames}
              status={status}
              onStatus={setStatus}
            />

            {loading ? (
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <CourseRowSkeleton key={i} />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <EmptyState title="No courses available for this semester." />
            ) : filtered.length === 0 ? (
              <EmptyState title="No courses match your search." subtitle="Try adjusting your filters or search." />
            ) : (
              <div className="space-y-2.5">
                {filtered.map((c) => (
                  <CourseAttendanceRow key={c.id} course={c} onView={setSelectedCourse} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <AttendanceDetailsDrawer course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </motion.div>
  );
}