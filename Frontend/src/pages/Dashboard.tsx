import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock,
  FileText,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: typeof GraduationCap;
}

const stats: Stat[] = [
  { label: "Current GPA", value: "3.72", sub: "Fall 2026", icon: GraduationCap },
  { label: "Assignments due", value: "4", sub: "This week", icon: FileText },
  { label: "Attendance", value: "94%", sub: "Across 5 courses", icon: CalendarCheck },
  { label: "Study hours", value: "12.5h", sub: "Logged this week", icon: Clock },
];

interface ScheduleItem {
  time: string;
  course: string;
  room: string;
  active?: boolean;
}

const schedule: ScheduleItem[] = [
  { time: "9:00 AM", course: "Data Structures", room: "Room 204", active: true },
  { time: "11:00 AM", course: "Linear Algebra", room: "Room 118" },
  { time: "1:30 PM", course: "Technical Writing", room: "Online" },
  { time: "4:00 PM", course: "Operating Systems Lab", room: "Lab 3" },
];

interface DueItem {
  id: string;
  title: string;
  course: string;
  due: string;
  urgent?: boolean;
}

const dueSoon: DueItem[] = [
  { id: "a1", title: "Binary Tree Traversal — Problem Set 4", course: "Data Structures", due: "Tomorrow, 11:59 PM", urgent: true },
  { id: "a2", title: "Vector Spaces Homework", course: "Linear Algebra", due: "Fri, 5:00 PM" },
  { id: "a3", title: "Essay Draft — Revision 2", course: "Technical Writing", due: "Mon, 9:00 AM" },
  { id: "a4", title: "Process Scheduling Lab Report", course: "Operating Systems Lab", due: "Wed, 11:59 PM" },
];

interface TaskItem {
  id: string;
  label: string;
  done: boolean;
}

const tasks: TaskItem[] = [
  { id: "t1", label: "Review lecture notes — Ch. 6", done: true },
  { id: "t2", label: "Email TA about extension", done: true },
  { id: "t3", label: "Prep slides for group project", done: false },
  { id: "t4", label: "Practice quiz — Linear Algebra", done: false },
  { id: "t5", label: "Read Chapter 7 before Friday", done: false },
];

const gpaTrend = [3.4, 3.5, 3.45, 3.6, 3.58, 3.65, 3.7, 3.72];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// Shared class fragments built on the Vexez CSS variables — mirrors the same `cx` pattern
// used in DashboardLayout so both files draw from one consistent token system.
const cx = {
  card: "rounded-2xl border border-[var(--color-border-hairline)] p-5 bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition-colors",
  textPrimary: "text-[var(--color-text-primary)]",
  textSecondary: "text-[var(--color-text-secondary)]",
  accentChip: "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]",
  accentLink: "text-[var(--color-accent-primary)] hover:opacity-80 transition-opacity",
  accentDot: "bg-[var(--color-accent-primary)]",
};

export default function Dashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-display text-2xl font-semibold tracking-tight ${cx.textPrimary}`}>Good morning, Ali</h1>
          <p className={`text-sm mt-1 ${cx.textSecondary}`}>Here's what's on your plate today.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-[var(--color-accent-primary)] text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity self-start sm:self-auto shadow-[var(--shadow-cta-glow)]">
          <Sparkles className="w-4 h-4" />
          Ask AI Assistant
        </button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={cx.card}>
              <div className="flex items-center justify-between mb-4">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${cx.accentChip}`}>
                  <Icon className="w-[18px] h-[18px]" />
                </span>
              </div>
              <div className={`text-2xl font-display font-semibold tracking-tight ${cx.textPrimary}`}>{s.value}</div>
              <div className={`text-xs mt-1 ${cx.textSecondary}`}>
                {s.label} · {s.sub}
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <motion.div variants={item} className={`lg:col-span-2 ${cx.card}`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>Today's schedule</h2>
              <p className={`text-xs mt-0.5 ${cx.textSecondary}`}>Tuesday, August 18</p>
            </div>
            <a href="/app/calendar" className={`text-xs ${cx.accentLink}`}>
              View calendar
            </a>
          </div>

          <div className="space-y-1">
            {schedule.map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 py-3 px-3 rounded-xl border-b border-[var(--color-border-hairline)] last:border-0 ${
                  s.active ? "bg-[var(--color-accent-primary)]/5 border border-[var(--color-accent-primary)]/15" : ""
                }`}
              >
                <div className={`w-20 shrink-0 text-xs font-mono ${cx.textSecondary}`}>{s.time}</div>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cx.accentDot}`} />
                <div className="min-w-0 flex-1">
                  <div className={`text-sm truncate ${cx.textPrimary}`}>{s.course}</div>
                  <div className={`text-xs ${cx.textSecondary}`}>{s.room}</div>
                </div>
                {s.active && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border border-[var(--color-accent-primary)]/20 shrink-0 ${cx.accentChip}`}>
                    Now
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className={cx.card}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>GPA trend</h2>
              <p className={`text-xs mt-0.5 ${cx.textSecondary}`}>Last 8 semesters</p>
            </div>
            <button className={`transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)]`} aria-label="Chart options">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <svg viewBox="0 0 260 110" className="w-full h-32" preserveAspectRatio="none">
            <motion.polyline
              points={gpaTrend
                .map((v, i) => `${(i / (gpaTrend.length - 1)) * 260},${110 - (v - 3) * 140}`)
                .join(" ")}
              fill="none"
              style={{ stroke: "var(--color-accent-primary)" }}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
            {gpaTrend.map((v, i) => (
              <circle
                key={i}
                cx={(i / (gpaTrend.length - 1)) * 260}
                cy={110 - (v - 3) * 140}
                r={i === gpaTrend.length - 1 ? 3.5 : 2}
                style={{ fill: "var(--color-accent-primary)" }}
                opacity={i === gpaTrend.length - 1 ? 1 : 0.75}
              />
            ))}
          </svg>
          <div className={`flex items-center justify-between mt-2 text-xs ${cx.textSecondary}`}>
            <span>Spring '23</span>
            <span className="text-[var(--color-accent-success)] font-medium inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +0.32
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className={`lg:col-span-2 ${cx.card}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>Due soon</h2>
            <a href="/app/assignments" className={`text-xs ${cx.accentLink}`}>
              View all
            </a>
          </div>

          <div className="space-y-1">
            {dueSoon.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-3 border-b border-[var(--color-border-hairline)] last:border-0">
                <div className="min-w-0 flex-1">
                  <div className={`text-sm truncate ${cx.textPrimary}`}>{d.title}</div>
                  <div className={`text-xs ${cx.textSecondary}`}>{d.course}</div>
                </div>
                <div className="shrink-0 ml-3 text-right">
                  <span
                    className={`text-xs font-medium ${
                      d.urgent ? "text-[var(--color-accent-danger)]" : cx.textSecondary
                    }`}
                  >
                    {d.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className={cx.card}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>Today's tasks</h2>
            <a href="/app/tasks" className={`text-xs ${cx.accentLink}`}>
              View all
            </a>
          </div>

          <div className="space-y-2.5">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5">
                {t.done ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-success)] shrink-0" />
                ) : (
                  <Circle className={`w-4 h-4 shrink-0 ${cx.textSecondary}`} />
                )}
                <span className={`text-sm truncate ${t.done ? `${cx.textSecondary} line-through` : cx.textPrimary}`}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}