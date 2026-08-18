import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  UserCircle,
  ChevronsLeft,
  ChevronDown,
  Menu,
  Search,
  Sun,
  Moon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sections: NavSection[] = [
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

// Notifications & Settings live in the bottom nav; Profile is rendered separately as the
// final, visually distinct entry (avatar + name) rather than a plain icon row item.
const bottomNav: NavItem[] = [
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const semesters = ["Fall 2026", "Summer 2026", "Spring 2026", "Fall 2025"];

type Theme = "dark" | "light";

// Shared class fragments built on the CSS variables from the Vexez token system
// (--color-bg, --color-surface, --color-accent-primary, etc). Swapping the `dark`
// class on <html> flips every one of these at once — no JS-side palette object needed.
const cx = {
  page: "bg-[var(--color-bg)] text-[var(--color-text-primary)]",
  surface: "bg-[var(--color-surface)]",
  border: "border-[var(--color-border-hairline)]",
  borderStrong: "border-[var(--color-border-strong)]",
  textPrimary: "text-[var(--color-text-primary)]",
  textSecondary: "text-[var(--color-text-secondary)]",
  textTertiary: "text-[var(--color-text-tertiary)]",
  navHover: "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]",
  navActive: "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]",
  activePill: "bg-[var(--color-accent-primary)]",
  chip: "bg-[var(--color-surface)] hover:bg-[var(--color-surface-alt)] border-[var(--color-border-hairline)]",
  avatar: "bg-[var(--color-accent-primary)]/15 border-[var(--color-accent-primary)]/30 text-[var(--color-accent-primary)]",
  dropdown: "bg-[var(--color-surface)] border-[var(--color-border-hairline)] shadow-[var(--shadow-lifted)]",
};

// Reusable NavItemLink component
interface NavItemLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  showLabel: boolean;
  onClick?: () => void;
}

function NavItemLink({ to, icon: Icon, label, active, showLabel, onClick }: NavItemLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
        active ? cx.navActive : cx.navHover
      }`}
      title={!showLabel ? label : undefined}
    >
      {active && (
        <motion.span
          layoutId="active-nav-pill"
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full ${cx.activePill}`}
        />
      )}
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {showLabel && <span className="whitespace-nowrap font-medium">{label}</span>}
    </Link>
  );
}

// Reusable SemesterDropdown component
interface SemesterDropdownProps {
  semester: string;
  semesters: string[];
  onSelect: (semester: string) => void;
  showLabel: boolean;
}

function SemesterDropdown({ semester, semesters, onSelect, showLabel }: SemesterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="px-3 pt-3 shrink-0" ref={ref}>
      <div className="relative">
        <button
          onClick={() => showLabel && setOpen((o) => !o)}
          className={`w-full flex items-center gap-2.5 rounded-xl border transition-colors ${cx.chip} ${
            showLabel ? "px-3 py-2.5 justify-between" : "px-0 py-2.5 justify-center"
          }`}
          title={!showLabel ? semester : undefined}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            {showLabel && <span className="text-sm font-medium truncate">{semester}</span>}
          </div>
          {showLabel && (
            <ChevronDown
              className={`w-3.5 h-3.5 ${cx.textTertiary} shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {open && showLabel && (
          <div className={`absolute left-0 right-0 top-full mt-1.5 rounded-xl border py-1.5 z-50 ${cx.dropdown}`}>
            {semesters.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onSelect(s);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  s === semester
                    ? "text-[var(--color-accent-primary)]"
                    : `${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [semester, setSemester] = useState(semesters[0]);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("vexez-theme") as Theme) || "dark";
  });

  // Drive the CSS-variable palette by toggling the `dark` class on <html>, per the token setup.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("vexez-theme", theme);
  }, [theme]);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const sidebarWidth = collapsed ? 76 : 248;
  const showLabels = !collapsed || isMobile;

  const isActive = (href: string) =>
    href === "/app" ? location.pathname === "/app" : location.pathname.startsWith(href);

  const profileActive = isActive("/dashboard/profile");

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${cx.page}`}>
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: isMobile ? (mobileOpen ? 248 : 0) : sidebarWidth }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed md:sticky top-0 h-screen z-50 border-r flex flex-col overflow-hidden transition-colors duration-300 ${cx.surface} ${cx.border} ${
          isMobile && !mobileOpen ? "pointer-events-none" : ""
        }`}
      >
        <div className={`flex items-center h-16 px-4 border-b shrink-0 ${cx.border}`}>
          <Link
            to="/app"
            className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight shrink-0 min-w-0"
          >
            <span className="w-8 h-8 rounded-md bg-[var(--color-accent-primary)] flex items-center justify-center text-white font-bold shrink-0">
              V
            </span>
            {showLabels && <span className="whitespace-nowrap truncate">Vexez</span>}
          </Link>

          {/* Collapse toggle lives up top, next to the brand — not a standalone bottom button. */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className={`ml-auto shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${cx.navHover}`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronsLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        <SemesterDropdown semester={semester} semesters={semesters} onSelect={setSemester} showLabel={showLabels} />

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              {showLabels && (
                <div className={`px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${cx.textTertiary}`}>
                  {section.label}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItemLink
                    key={item.href}
                    to={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(item.href)}
                    showLabel={showLabels}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className={`p-3 border-t shrink-0 space-y-0.5 ${cx.border}`}>
          {bottomNav.map((item) => (
            <NavItemLink
              key={item.href}
              to={item.href}
              icon={item.icon}
              label={item.label}
              active={isActive(item.href)}
              showLabel={showLabels}
            />
          ))}

          {/* Profile sits at the very bottom, in place of the old standalone collapse button. */}
          <Link
            to="/dashboard/profile"
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              profileActive ? cx.navActive : cx.navHover
            }`}
            title={!showLabels ? "Profile" : undefined}
          >
            {profileActive && (
              <motion.span
                layoutId="active-nav-pill"
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full ${cx.activePill}`}
              />
            )}
            <span className={`w-[18px] h-[18px] shrink-0 rounded-full border flex items-center justify-center overflow-hidden ${cx.avatar}`}>
              <UserCircle className="w-full h-full" strokeWidth={1.5} />
            </span>
            {showLabels && <span className="whitespace-nowrap font-medium">Profile</span>}
          </Link>
        </div>
      </motion.aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className={`sticky top-0 z-30 h-16 border-b backdrop-blur-md flex items-center justify-between px-4 md:px-6 gap-4 transition-colors duration-300 ${cx.surface}/85 ${cx.border}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden shrink-0" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle sidebar">
              <Menu className="w-5 h-5" />
            </button>

            <div className={`hidden sm:flex items-center gap-2 border rounded-full px-3.5 py-2 w-full max-w-xs bg-[var(--color-surface-alt)] ${cx.border}`}>
              <Search className={`w-4 h-4 shrink-0 ${cx.textTertiary}`} />
              <input
                type="text"
                placeholder="Search tasks, projects..."
                className={`bg-transparent text-sm focus:outline-none w-full ${cx.textPrimary} placeholder:text-[var(--color-text-tertiary)]`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${cx.navHover}`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            <button className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${cx.navHover}`} aria-label="Notifications">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-danger)]" />
            </button>

            <button className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition-colors ${cx.navHover}`}>
              <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-semibold ${cx.avatar}`}>
                AK
              </span>
              <ChevronDown className={`w-3.5 h-3.5 hidden sm:block ${cx.textTertiary}`} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}