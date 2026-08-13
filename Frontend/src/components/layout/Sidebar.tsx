import { useState, useRef, useEffect, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { navigationConfig, isNavParent, type NavItem, type NavParentItem } from "./navigationConfig";

export interface SidebarUser {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface SidebarProps {
  logo?: ReactNode;
  items?: NavItem[];
  className?: string;
  user?: SidebarUser;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

const DEFAULT_USER: SidebarUser = { name: "John Doe", role: "Admin" };

/**
 * Sidebar
 *
 * Primary admin navigation panel. Renders `navigationConfig` data-driven —
 * Settings, Notifications, and Access Control are entries in that config
 * (not hardcoded here), so they render once, in their config-defined
 * position, with permission gating applied consistently with every
 * other nav item.
 *
 * Shares background color with the main content area (#f8f7fa light /
 * #1a1c31 dark) — no border between sidebar and content.
 *
 * Collapsible: toggling the chevron shrinks the rail to an icon-only
 * strip. Parent sections become flyout menus on hover/click when
 * collapsed, mirroring the expanded tree structure.
 *
 * Uses React Router's <NavLink> for active-state detection — never
 * compares window.location.pathname manually.
 */
export function Sidebar({
  logo,
  items = navigationConfig,
  className,
  user = DEFAULT_USER,
  onProfile,
  onSettings,
  onLogout,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [flyout, setFlyout] = useState<string | null>(null);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <aside
  aria-label="Primary"
  className={cn(
    "flex h-full shrink-0 flex-col", // was h-screen — now fills the flex parent, not the viewport directly
    "bg-[#f8f7fa] dark:bg-[#1a1c31]",
    "transition-[width] duration-200 ease-out",
    collapsed ? "w-[76px]" : "w-[270px]",
    className
  )}
>
      {/* Header: logo + collapse toggle */}
      <div className="relative flex h-16 shrink-0 items-center justify-center border-b border-slate-200/70 dark:border-white/10 px-5">
        <div className={cn("flex w-full items-center", collapsed ? "justify-center" : "justify-start")}>
          {logo}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center",
            "rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#242745] text-slate-400 shadow-sm",
            "hover:text-slate-700 dark:hover:text-slate-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 pt-4">
        {collapsed ? (
          <button
            type="button"
            aria-label="Search"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-400",
              "hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-slate-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400"
            )}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 px-3 text-slate-400">
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 text-sm">Search</span>
            <kbd className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 dark:bg-white/10 text-[11px] font-medium text-slate-500 dark:text-slate-300">
              ⌘
            </kbd>
            <kbd className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 dark:bg-white/10 text-[11px] font-medium text-slate-500 dark:text-slate-300">
              S
            </kbd>
          </div>
        )}
      </div>

      {/* Nav — Settings, Notifications, Access Control all render from
          navigationConfig itself, in whatever position defined there */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="px-3 pb-2 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">MAIN</p>
        )}
        <ul className="flex flex-col gap-0.5">
          {items.map((item) =>
            isNavParent(item) ? (
              <SidebarSection
                key={item.label}
                item={item}
                collapsed={collapsed}
                isOpen={openSections.has(item.label)}
                onToggle={() => toggleSection(item.label)}
                flyoutOpen={flyout === item.label}
                onFlyoutToggle={() => setFlyout((v) => (v === item.label ? null : item.label))}
                onFlyoutClose={() => setFlyout((v) => (v === item.label ? null : v))}
              />
            ) : (
              <li key={item.path}>
                <SidebarLink to={item.path} icon={item.icon} label={item.label} collapsed={collapsed} />
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Profile */}
      <div className="shrink-0 border-t border-slate-200/70 dark:border-white/10 p-3">
        <ProfileMenu
          user={user}
          collapsed={collapsed}
          onProfile={onProfile}
          onSettings={onSettings}
          onLogout={onLogout}
        />
      </div>
    </aside>
  );
}

interface SidebarSectionProps {
  item: NavParentItem;
  collapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
  flyoutOpen: boolean;
  onFlyoutToggle: () => void;
  onFlyoutClose: () => void;
}

function SidebarSection({
  item,
  collapsed,
  isOpen,
  onToggle,
  flyoutOpen,
  onFlyoutToggle,
  onFlyoutClose,
}: SidebarSectionProps) {
  const Icon = item.icon;
  const sectionRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!flyoutOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        onFlyoutClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [flyoutOpen, onFlyoutClose]);

  if (collapsed) {
    return (
      <li ref={sectionRef} className="relative">
        <button
          type="button"
          onClick={onFlyoutToggle}
          aria-expanded={flyoutOpen}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg text-slate-400",
            "transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
            flyoutOpen && "bg-slate-200/60 dark:bg-white/10 text-slate-700 dark:text-slate-100"
          )}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>

        {flyoutOpen && (
          <div className="absolute left-full top-0 z-20 ml-2 min-w-[160px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#242745] p-1.5 shadow-lg">
            <p className="px-2.5 pb-1 pt-1 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
              {item.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {item.children.map((child) => (
                <li key={child.path}>
                  <SidebarLink to={child.path} label={child.label} nested collapsed={false} onClick={onFlyoutClose} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200",
          "transition-colors duration-150",
          "hover:bg-slate-100 dark:hover:bg-white/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400"
        )}
      >
        <span className="flex items-center gap-2.5">
          <Icon className="h-[18px] w-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          {item.label}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <ul className="relative min-h-0 flex flex-col gap-0.5 py-1 pl-[34px]">
          <span className="absolute bottom-3 left-[19px] top-1 w-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
          {item.children.map((child) => (
            <li key={child.path} className="relative">
              <span className="absolute -left-[15px] top-1/2 h-px w-3 -translate-y-1/2 bg-slate-200 dark:bg-white/10" aria-hidden="true" />
              <SidebarLink to={child.path} label={child.label} nested collapsed={false} />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

interface SidebarLinkProps {
  to: string;
  label: string;
  icon?: NavParentItem["icon"];
  nested?: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

function SidebarLink({ to, label, icon: Icon, nested = false, collapsed, onClick }: SidebarLinkProps) {
  if (collapsed && !nested) {
    return (
      <NavLink
        to={to}
        end
        title={label}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            "flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
            isActive
              ? "bg-orange-50 dark:bg-orange-400/10 text-orange-600 dark:text-orange-400"
              : "text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200"
          )
        }
      >
        {Icon && <Icon className="h-[18px] w-[18px]" aria-hidden="true" />}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
          nested ? "text-[13px]" : "text-sm font-medium",
          isActive
            ? "bg-orange-50 dark:bg-orange-400/10 font-medium text-orange-600 dark:text-orange-400"
            : nested
            ? "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-100"
            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
        )
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-orange-500" : "text-slate-400")}
              aria-hidden="true"
            />
          )}
          {!Icon && nested && (
            <span
              className={cn("h-1 w-1 shrink-0 rounded-full", isActive ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600")}
              aria-hidden="true"
            />
          )}
          {label}
        </>
      )}
    </NavLink>
  );
}

interface ProfileMenuProps {
  user: SidebarUser;
  collapsed: boolean;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

function ProfileMenu({ user, collapsed, onProfile, onSettings, onLogout }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatar = (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-white/10 text-xs font-medium text-slate-600 dark:text-slate-200">
      {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}
    </span>
  );

  return (
    <div ref={ref} className="relative">
      {open && (
        <div
          className={cn(
            "absolute bottom-[calc(100%+8px)] z-20 min-w-[200px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#242745] p-1.5 shadow-lg",
            collapsed ? "left-0" : "left-0 right-0"
          )}
        >
          <div className="border-b border-slate-100 dark:border-white/10 px-2.5 py-2">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{user.role}</p>
          </div>
          <ul className="flex flex-col gap-0.5 pt-1">
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onProfile?.();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <UserRound className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Profile
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSettings?.();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <Settings className="h-4 w-4 text-slate-400" aria-hidden="true" />
                Settings
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onLogout?.();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg border border-slate-200 dark:border-white/10 p-1.5",
          "transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-white/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
          collapsed && "justify-center"
        )}
      >
        {avatar}
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">{user.name}</span>
              <span className="block truncate text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {user.role}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}