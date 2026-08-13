import { Drawer } from "../feedback/Drawer";
import type { SidebarNavItem } from "./Sidebar";
import { cn } from "../../utils/cn";

export interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  navItems: SidebarNavItem[];
  onNavigate?: (href: string) => void;
  header?: string;
}

/**
 * MobileNavigation
 *
 * Sidebar's mobile counterpart — same nav items, rendered inside a Drawer
 * that slides in from the left. Used together with Header's menu button:
 * Header opens it, this closes itself on navigation or overlay/Escape.
 *
 * Example:
 *   <MobileNavigation
 *     open={mobileNavOpen}
 *     onClose={() => setMobileNavOpen(false)}
 *     navItems={navItems}
 *     onNavigate={(href) => { navigate(href); setMobileNavOpen(false); }}
 *   />
 */
export function MobileNavigation({
  open,
  onClose,
  navItems,
  onNavigate,
  header = "Menu",
}: MobileNavigationProps) {
  return (
    <Drawer open={open} onClose={onClose} side="left" title={header}>
      <nav>
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
    </Drawer>
  );
}