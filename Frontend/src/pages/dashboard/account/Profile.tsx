import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  Pencil,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Award,
  Shield,
  Bell,
  Check,
  Star,
  Clock,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectAuthUser, logoutUser } from "@/store/features/auth/authSlice";

interface EnrolledCourse {
  code: string;
  name: string;
  progress: number;
  instructor: string;
}

const enrolledCourses: EnrolledCourse[] = [
  { code: "CS 301", name: "Data Structures", progress: 78, instructor: "Dr. R. Iqbal" },
  { code: "MA 214", name: "Linear Algebra", progress: 62, instructor: "Dr. S. Farooq" },
  { code: "EN 110", name: "Technical Writing", progress: 91, instructor: "Prof. H. Malik" },
  { code: "CS 340L", name: "Operating Systems Lab", progress: 54, instructor: "Dr. A. Raza" },
];

interface Achievement {
  label: string;
  detail: string;
  icon: typeof Award;
}

const achievements: Achievement[] = [
  { label: "Dean's List", detail: "Fall 2025", icon: Award },
  { label: "Perfect attendance", detail: "3 semesters running", icon: CalendarCheck },
  { label: "Top 5% — Data Structures", detail: "Fall 2026 cohort", icon: Star },
];

interface Preference {
  id: string;
  label: string;
  detail: string;
}

const initialPreferences: Preference[] = [
  { id: "assignments", label: "Assignment reminders", detail: "Email + push, 24h before due" },
  { id: "grades", label: "Grade updates", detail: "Notify when a grade is posted" },
  { id: "announcements", label: "Course announcements", detail: "From instructors and TAs" },
  { id: "digest", label: "Weekly digest", detail: "Summary every Sunday evening" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// Shared class fragments — same `cx` pattern used across DashboardLayout / Dashboard / Calendar.
const cx = {
  card: "rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)]",
  textPrimary: "text-[var(--color-text-primary)]",
  textSecondary: "text-[var(--color-text-secondary)]",
  textTertiary: "text-[var(--color-text-tertiary)]",
  accentChip: "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]",
  ghostBtn:
    "border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors",
};

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`relative w-10 h-6 rounded-full shrink-0 transition-colors ${
        on ? "bg-[var(--color-accent-primary)]" : "bg-[var(--color-surface-alt)] border border-[var(--color-border-strong)]"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm ${on ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );
}

export default function Profile() {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState(
    () => new Map(initialPreferences.map((p) => [p.id, p.id !== "digest"]))
  );

  const togglePreference = (id: string) => {
    setPreferences((prev) => {
      const next = new Map(prev);
      next.set(id, !next.get(id));
      return next;
    });
  };

  async function handleLogout() {
    await dispatch(logoutUser());
    navigate("/login");
  }

  const initials = user
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const roleLabel = user?.role === "TEACHER" ? "Teacher" : "Student";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-display text-2xl font-semibold tracking-tight ${cx.textPrimary}`}>Profile</h1>
          <p className={`text-sm mt-1 ${cx.textSecondary}`}>Your academic identity across Vexez.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleLogout}
            className={`inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full ${cx.ghostBtn}`}
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
          <button className="inline-flex items-center gap-1.5 bg-[var(--color-accent-primary)] text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity shadow-[var(--shadow-cta-glow)]">
            <Pencil className="w-3.5 h-3.5" />
            Edit profile
          </button>
        </div>
      </motion.div>

      {/* Identity banner */}
      <motion.div variants={item} className={`${cx.card} p-5 sm:p-6 mb-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="w-20 h-20 rounded-2xl bg-[var(--color-accent-primary)]/15 border border-[var(--color-accent-primary)]/30 flex items-center justify-center text-[var(--color-accent-primary)] text-2xl font-display font-semibold">
              {initials}
            </div>
            <button
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] flex items-center justify-center hover:bg-[var(--color-surface-alt)] transition-colors"
              aria-label="Change photo"
            >
              <Camera className={`w-3.5 h-3.5 ${cx.textSecondary}`} />
            </button>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className={`font-display text-lg font-semibold ${cx.textPrimary}`}>{user?.name}</div>
            <div className={`text-sm mt-0.5 ${cx.textSecondary}`}>Computer Science · Class of 2027</div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${cx.accentChip}`}>
                <GraduationCap className="w-3 h-3" />
                {roleLabel}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${cx.accentChip}`}>
                3.72 GPA
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)]">
                <Check className="w-3 h-3" />
                Enrolled — Fall 2026
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 shrink-0 border-t sm:border-t-0 sm:border-l border-[var(--color-border-hairline)] pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
            {[
              { label: "Courses", value: "5" },
              { label: "Credits", value: "84" },
              { label: "Attendance", value: "94%" },
            ].map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <div className={`font-display text-lg font-semibold ${cx.textPrimary}`}>{s.value}</div>
                <div className={`text-[11px] ${cx.textTertiary}`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Personal information */}
        <motion.div variants={item} className={`lg:col-span-2 ${cx.card} p-5`}>
          <h2 className={`font-display text-base font-semibold mb-4 ${cx.textPrimary}`}>Personal information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Email", value: user?.email ?? "", icon: Mail },
              { label: "Phone", value: "+92 300 1234567", icon: Phone },
              { label: "Location", value: "Lahore, Pakistan", icon: MapPin },
              { label: "Student ID", value: "VX-2027-00842", icon: Shield },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-start gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cx.accentChip}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <div className={`text-[11px] ${cx.textTertiary}`}>{f.label}</div>
                    <div className={`text-sm truncate ${cx.textPrimary}`}>{f.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        {/* Academic snapshot */}
        <motion.div variants={item} className={`${cx.card} p-5`}>
          <h2 className={`font-display text-base font-semibold mb-4 ${cx.textPrimary}`}>Academic snapshot</h2>
          <div className="space-y-3">
            {[
              { label: "Major", value: "Computer Science" },
              { label: "Advisor", value: "Dr. R. Iqbal" },
              { label: "Semester", value: "7th of 8" },
              { label: "Standing", value: "Good standing" },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between text-sm">
                <span className={cx.textSecondary}>{f.label}</span>
                <span className={`font-medium ${cx.textPrimary}`}>{f.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Enrolled courses */}
        <motion.div variants={item} className={`lg:col-span-2 ${cx.card} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>Enrolled courses</h2>
            <span className={`text-xs ${cx.textTertiary}`}>{enrolledCourses.length} this semester</span>
          </div>
          <div className="space-y-3">
            {enrolledCourses.map((c) => (
              <div key={c.code} className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cx.accentChip}`}>
                  <BookOpen className="w-[18px] h-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`text-sm truncate ${cx.textPrimary}`}>
                      {c.name} <span className={cx.textTertiary}>· {c.code}</span>
                    </div>
                    <span className={`text-xs shrink-0 ${cx.textSecondary}`}>{c.progress}%</span>
                  </div>
                  <div className={`text-xs mb-1.5 ${cx.textTertiary}`}>{c.instructor}</div>
                  <div className="h-1.5 rounded-full bg-[var(--color-surface-alt)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.progress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-[var(--color-accent-primary)]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements + preferences */}
        <div className="space-y-4">
          <motion.div variants={item} className={`${cx.card} p-5`}>
            <h2 className={`font-display text-base font-semibold mb-4 ${cx.textPrimary}`}>Achievements</h2>
            <div className="space-y-3">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.label} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)]">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className={`text-sm truncate ${cx.textPrimary}`}>{a.label}</div>
                      <div className={`text-[11px] ${cx.textTertiary}`}>{a.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={item} className={`${cx.card} p-5`}>
            <div className="flex items-center gap-2 mb-4">
              <Bell className={`w-4 h-4 ${cx.textSecondary}`} />
              <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>Notifications</h2>
            </div>
            <div className="space-y-4">
              {initialPreferences.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className={`text-sm ${cx.textPrimary}`}>{p.label}</div>
                    <div className={`text-[11px] mt-0.5 ${cx.textTertiary}`}>{p.detail}</div>
                  </div>
                  <Toggle on={!!preferences.get(p.id)} onClick={() => togglePreference(p.id)} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Security */}
      <motion.div variants={item} className={`${cx.card} p-5 mt-4`}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className={`w-4 h-4 ${cx.textSecondary}`} />
          <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>Security</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between rounded-xl border border-[var(--color-border-hairline)] px-4 py-3">
            <div>
              <div className={`text-sm ${cx.textPrimary}`}>Password</div>
              <div className={`text-[11px] mt-0.5 ${cx.textTertiary}`}>Last changed 3 months ago</div>
            </div>
            <Clock className={`w-4 h-4 ${cx.textTertiary}`} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[var(--color-border-hairline)] px-4 py-3">
            <div>
              <div className={`text-sm ${cx.textPrimary}`}>Two-factor auth</div>
              <div className="text-[11px] mt-0.5 text-[var(--color-accent-success)]">Enabled</div>
            </div>
            <Check className="w-4 h-4 text-[var(--color-accent-success)]" />
          </div>
          <button className={`flex items-center justify-center rounded-xl px-4 py-3 text-sm ${cx.ghostBtn}`}>
            Manage sessions
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}