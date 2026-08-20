import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  FileText,
  GraduationCap,
  BarChart3,
  CalendarCheck,
  ListChecks,
  CalendarClock,
  StickyNote,
  FolderKanban,
  Users,
  Megaphone,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Bell,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "My Courses", href: "/dashboard/courses", icon: BookOpen },
      { label: "Assignments", href: "/dashboard/assignments", icon: FileText },
      { label: "Exams & Quizzes", href: "/dashboard/exams", icon: GraduationCap },
      { label: "Grades & GPA", href: "/dashboard/grades", icon: BarChart3 },
      { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
    ],
  },
  {
    label: "Study",
    items: [
      { label: "Tasks", href: "/dashboard/tasks", icon: ListChecks },
      { label: "Study Planner", href: "/dashboard/planner", icon: CalendarClock },
      { label: "Notes", href: "/dashboard/notes", icon: StickyNote },
      { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    ],
  },
  {
    label: "Campus",
    items: [
      { label: "Groups & Teams", href: "/dashboard/groups", icon: Users },
      { label: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
      { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
      { label: "AI Study Assistant", href: "/dashboard/assistant", icon: Sparkles },
    ],
  },
];

// Notifications & Settings live in the bottom nav; Profile is rendered separately
// (avatar + name) as the final, visually distinct entry.
export const bottomNav: NavItem[] = [
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const semesters = ["Fall 2026", "Summer 2026", "Spring 2026", "Fall 2025"];

// Shared class fragments built on the CSS variables from the Vexez token system
// (--color-bg, --color-surface, --color-accent-primary, etc). Swapping the `dark`
// class on <html> flips every one of these at once — no JS-side palette object needed.
export const cx = {
  page: "bg-[var(--color-bg)] text-[var(--color-text-primary)]",
  surface: "bg-[var(--color-surface)]",
  border: "border-[var(--color-border-hairline)]",
  borderStrong: "border-[var(--color-border-strong)]",
  textPrimary: "text-[var(--color-text-primary)]",
  textSecondary: "text-[var(--color-text-secondary)]",
  textTertiary: "text-[var(--color-text-tertiary)]",
  navHover:
    "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]",
  navActive: "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]",
  activePill: "bg-[var(--color-accent-primary)]",
  chip: "bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] border-[var(--color-border-hairline)]",
  avatar:
    "bg-[var(--color-accent-primary)]/15 border-[var(--color-accent-primary)]/30 text-[var(--color-accent-primary)]",
  dropdown: "bg-[var(--color-surface)] border-[var(--color-border-hairline)] shadow-[var(--shadow-lifted)]",
};

export type Theme = "dark" | "light";