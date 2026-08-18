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
} from "lucide-react";
import { useSemester } from "../app/Provider";

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
      { label: "Dashboard", href: "/app", icon: LayoutDashboard },
      { label: "Calendar", href: "/app/calendar", icon: Calendar },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "My Courses", href: "/app/courses", icon: BookOpen },
      { label: "Assignments", href: "/app/assignments", icon: FileText },
      { label: "Exams & Quizzes", href: "/app/exams", icon: GraduationCap },
      { label: "Grades & GPA", href: "/app/grades", icon: BarChart3 },
      { label: "Attendance", href: "/app/attendance", icon: CalendarCheck },
    ],
  },
  {
    label: "Study",
    items: [
      { label: "Tasks", href: "/app/tasks", icon: ListChecks },
      { label: "Study Planner", href: "/app/planner", icon: CalendarClock },
      { label: "Notes", href: "/app/notes", icon: StickyNote },
      { label: "Projects", href: "/app/projects", icon: FolderKanban },
    ],
  },
  {
    label: "Campus",
    items: [
      { label: "Groups & Teams", href: "/app/groups", icon: Users },
      { label: "Announcements", href: "/app/announcements", icon: Megaphone },
      { label: "Messages", href: "/app/messages", icon: MessageSquare },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Progress", href: "/app/progress", icon: TrendingUp },
      { label: "AI Study Assistant", href: "/app/assistant", icon: Sparkles },
    ],
  },
];

const bottomNav: NavItem[] = [
  { label: "Notifications", href: "/app/notifications", icon: Bell },
  { label: "Settings", href: "/app/settings", icon: Settings },
  { label: "Profile", href: "/app/profile", icon: UserCircle },
];

export default function DashboardLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [semesterOpen, setSemesterOpen] = useState(false);
  const semesterRef = useRef<HTMLDivElement>(null);

  const { semesters, selectedSemester, setSelectedSemesterId } = useSemester();

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
    setSemesterOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!semesterOpen) return;
    const onClick = (e: MouseEvent) => {
      if (semesterRef.current && !semesterRef.current.contains(e.target as Node)) {
        setSemesterOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [semesterOpen]);

  const sidebarWidth = collapsed ? 76 : 248;
  const showLabels = !collapsed || isMobile;

  const isActive = (href: string) =>
    href === "/app" ? location.pathname === "/app" : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-ink text-cream flex">
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: isMobile ? (mobileOpen ? 248 : 0) : sidebarWidth }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed md:sticky top-0 h-screen z-50 border-r border-white/8 bg-ink flex flex-col overflow-hidden ${
          isMobile && !mobileOpen ? "pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center h-16 px-4 border-b border-white/8 shrink-0">
          <Link to="/app" className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight shrink-0">
            <span className="w-8 h-8 rounded-md bg-teal flex items-center justify-center text-ink font-bold shrink-0">
              V
            </span>
            {showLabels && <span className="whitespace-nowrap">Vexez</span>}
          </Link>
        </div>

        <div className="px-3 pt-3 shrink-0" ref={semesterRef}>
          <div className="relative">
            <button
              onClick={() => showLabels && setSemesterOpen((o) => !o)}
              className={`w-full flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/5 transition-colors ${
                showLabels ? "px-3 py-2.5 justify-between" : "px-0 py-2.5 justify-center"
              }`}
              title={!showLabels ? selectedSemester.label : undefined}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-teal/10 text-teal flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </span>
                {showLabels && (
                  <span className="text-sm font-medium truncate">{selectedSemester.label}</span>
                )}
              </div>
              {showLabels && (
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-text shrink-0 transition-transform ${
                    semesterOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {semesterOpen && showLabels && (
              <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-50">
                {semesters.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSemesterId(s.id);
                      setSemesterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      s.id === selectedSemester.id
                        ? "text-teal"
                        : "text-slate-text hover:text-cream hover:bg-white/5"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {sections.map((section) => (
            <div key={section.label}>
              {showLabels && (
                <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-text/60">
                  {section.label}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        active ? "bg-teal/10 text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                      }`}
                      title={!showLabels ? item.label : undefined}
                    >
                      {active && (
                        <motion.span
                          layoutId="active-nav-pill"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-teal"
                        />
                      )}
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      {showLabels && <span className="whitespace-nowrap font-medium">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/8 shrink-0 space-y-0.5">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active ? "bg-teal/10 text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                }`}
                title={!showLabels ? item.label : undefined}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {showLabels && <span className="whitespace-nowrap font-medium">{item.label}</span>}
              </Link>
            );
          })}

          {!isMobile && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-text hover:text-cream hover:bg-white/5 transition-colors mt-1"
            >
              <ChevronsLeft
                className={`w-[18px] h-[18px] shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
              />
              {!collapsed && <span className="whitespace-nowrap">Collapse</span>}
            </button>
          )}
        </div>
      </motion.aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 border-b border-white/8 bg-ink/85 backdrop-blur-md flex items-center justify-between px-4 md:px-6 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden shrink-0"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-text shrink-0" />
              <input
                type="text"
                placeholder="Search courses, assignments..."
                className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-[18px] h-[18px] text-slate-text" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-clay" />
            </button>

            <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition-colors">
              <span className="w-8 h-8 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center text-teal text-xs font-semibold">
                AK
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-text hidden sm:block" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}