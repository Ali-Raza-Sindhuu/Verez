import type { ReactNode } from "react";
import { Search, Menu, Mail, Bell, Calendar } from "lucide-react";
import { ThemeToggle, type Theme } from "./ThemeToggle";
import { cn } from "../../utils/cn";

export interface AdminTopbarProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onMenuClick?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  hasUnreadMail?: boolean;
  hasUnreadNotifications?: boolean;
  avatar?: ReactNode;
  className?: string;
}

/**
 * AdminTopbar
 *
 * Topbar matching the ECOMS reference: mobile menu button, search input,
 * theme toggle, mail/notification/calendar icon buttons (with unread
 * dots), and an avatar slot on the far right.
 *
 * Example:
 *   <AdminTopbar
 *     theme={theme}
 *     onThemeChange={setTheme}
 *     onMenuClick={() => setMobileNavOpen(true)}
 *     searchValue={search}
 *     onSearchChange={setSearch}
 *     hasUnreadMail
 *     avatar={<img src="/avatar.jpg" className="h-8 w-8 rounded-full" />}
 *   />
 */
export function AdminTopbar({
  theme,
  onThemeChange,
  onMenuClick,
  searchValue,
  onSearchChange,
  hasUnreadMail = false,
  hasUnreadNotifications = false,
  avatar,
  className,
}: AdminTopbarProps) {
  return (
    <header
      className={cn(
        "flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4",
        "dark:border-slate-700 dark:bg-slate-800",
        className
      )}
    >
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 lg:hidden",
            "hover:bg-slate-100 dark:hover:bg-slate-700",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-500"
          )}
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className="relative flex-1 max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search anything's"
          className={cn(
            "h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900",
            "placeholder:text-slate-400",
            "focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200",
            "dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          )}
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle theme={theme} onChange={onThemeChange} className="hidden sm:flex" />

        <IconButton icon={Mail} label="Messages" hasDot={hasUnreadMail} />
        <IconButton
          icon={Bell}
          label="Notifications"
          hasDot={hasUnreadNotifications}
          className="hidden sm:flex"
        />
        <IconButton icon={Calendar} label="Calendar" className="hidden sm:flex" />

        {avatar && <div className="ml-1 shrink-0">{avatar}</div>}
      </div>
    </header>
  );
}

interface IconButtonProps {
  icon: typeof Mail;
  label: string;
  hasDot?: boolean;
  className?: string;
}

function IconButton({ icon: Icon, label, hasDot = false, className }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500",
        "hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-500",
        className
      )}
    >
      <Icon className="h-4.5 w-4.5" />
      {hasDot && (
        <span
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"
          aria-hidden="true"
        />
      )}
    </button>
  );
}