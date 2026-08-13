import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { cn } from "../../utils/cn";

export interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Header (Topbar)
 *
 * Top bar for AdminLayout / DashboardLayout. Shows a menu button on mobile
 * (wire `onMenuClick` to open MobileNavigation), an optional page title,
 * and a right-aligned actions slot (search, notifications, user menu).
 *
 * Example:
 *   <Header
 *     title="Products"
 *     onMenuClick={() => setMobileNavOpen(true)}
 *     actions={<DropdownMenu items={userMenuItems} trigger={<Avatar />} />}
 *   />
 */
export function Header({ onMenuClick, title, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-slate-600 lg:hidden",
              "hover:bg-slate-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500"
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {title && (
          <h1 className="text-base font-semibold text-slate-900">{title}</h1>
        )}
      </div>

      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}