import { useState, useEffect, type ReactNode } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./TopBar";
import { semesters, cx, type Theme } from "./navConfig";

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

  // Drive the CSS-variable palette by toggling the `dark` class on <html>.
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
    href === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(href);

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

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        semester={semester}
        setSemester={setSemester}
        isActive={isActive}
        sidebarWidth={sidebarWidth}
        showLabels={showLabels}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          isMobile={isMobile}
          onToggleMobileSidebar={() => setMobileOpen((o) => !o)}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        />

        <main className="flex-1 p-4 md:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}