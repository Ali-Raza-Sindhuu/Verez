import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface SidebarProps {
  navItems: SidebarNavItem[];
  onNavigate?: (href: string) => void;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Sidebar
 *
 * Structural nav panel for AdminLayout / DashboardLayout. Router-agnostic:
 * pass `onNavigate` wired to your router (React Router's `navigate`), and
 * mark the current item via `active` on the matching SidebarNavItem.
 *
 * Example:
 *   <Sidebar
 *     header={<span className="text-lg font-semibold">Velour Admin</span>}
 *     navItems={[
 *       { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} />, active: true },
 *       { label: "Products", href: "/admin/products", icon: <Package size={18} /> },
 *     ]}
 *     onNavigate={(href) => navigate(href)}
 *   />
 */
export function Sidebar({ navItems, onNavigate, header, footer, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white",
        className
      )}
    >
      {header && (
        <div className="flex h-16 items-center border-b border-slate-100 px-4">
          {header}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => onNavigate?.(item.href)}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-indigo-500",
                  item.active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {item.icon && (
                  <span className="shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {footer && (
        <div className="border-t border-slate-100 p-3">{footer}</div>
      )}
    </aside>
  );
}