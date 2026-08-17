import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  ChevronsLeft,
  Menu,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const sidebarWidth = collapsed ? 76 : 248;

  return (
    <div className="min-h-screen bg-ink text-cream flex">
      {/* Mobile overlay */}
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

      {/* Sidebar */}
      <motion.aside
        animate={{
          width: isMobile ? (mobileOpen ? 248 : 0) : sidebarWidth,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`fixed md:sticky top-0 h-screen z-50 border-r border-white/8 bg-ink flex flex-col overflow-hidden ${
          isMobile && !mobileOpen ? "pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center h-16 px-4 border-b border-white/8 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight shrink-0">
            <span className="w-8 h-8 rounded-md bg-teal flex items-center justify-center text-ink font-bold shrink-0">
              V
            </span>
            {(!collapsed || isMobile) && <span className="whitespace-nowrap">Vexez</span>}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => isMobile && setMobileOpen(false)}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-teal/10 text-teal"
                    : "text-slate-text hover:text-cream hover:bg-white/5"
                }`}
                title={collapsed && !isMobile ? item.label : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-teal"
                  />
                )}
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {(!collapsed || isMobile) && (
                  <span className="whitespace-nowrap font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {!isMobile && (
          <div className="p-3 border-t border-white/8 shrink-0">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-text hover:text-cream hover:bg-white/5 transition-colors"
            >
              <ChevronsLeft
                className={`w-[18px] h-[18px] shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
              />
              {!collapsed && <span className="whitespace-nowrap">Collapse</span>}
            </button>
          </div>
        )}
      </motion.aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
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
                placeholder="Search orders, products..."
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

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}