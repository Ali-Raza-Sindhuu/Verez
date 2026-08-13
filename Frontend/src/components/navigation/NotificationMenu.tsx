import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "../../utils/cn";

export type NotificationKind = "order" | "stock" | "vendor" | "general";

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread: boolean;
  kind?: NotificationKind;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "notif-1", title: "New order received", time: "2 minutes ago", unread: true, kind: "order" },
  { id: "notif-2", title: "Product stock is low", time: "10 minutes ago", unread: true, kind: "stock" },
  { id: "notif-3", title: "Vendor approval required", time: "30 minutes ago", unread: true, kind: "vendor" },
  { id: "notif-4", title: "Order #4821 has been shipped", time: "1 hour ago", unread: false, kind: "order" },
  { id: "notif-5", title: "New vendor registered", time: "3 hours ago", unread: false, kind: "vendor" },
];

export interface NotificationMenuProps {
  notifications?: NotificationItem[];
  onViewAll?: () => void;
  className?: string;
}

/**
 * NotificationMenu
 *
 * Header button + dropdown listing recent notifications. Static mock
 * data for now — no API wiring. Unread count renders as a small orange
 * badge on the bell; the list is capped in height and scrolls once it
 * overflows.
 *
 * Closes on outside click and Escape. Shares its dropdown shell styling
 * with MessageMenu (white bg, border, shadow, rounded corners,
 * fade/scale-in) so both read as one consistent popover system.
 *
 * Example:
 *   <NotificationMenu onViewAll={() => navigate("/notifications")} />
 */
export function NotificationMenu({
  notifications = MOCK_NOTIFICATIONS,
  onViewAll,
  className,
}: NotificationMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        title="Notifications"
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500",
          "transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
          open && "bg-slate-100 text-slate-800"
        )}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1",
              "bg-orange-500 text-[10px] font-semibold leading-none text-white ring-2 ring-white"
            )}
            aria-hidden="true"
          >
            {badgeLabel}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className={cn(
            "absolute right-0 top-[calc(100%+8px)] z-20 w-80 origin-top-right",
            "rounded-xl border border-slate-200 bg-white shadow-lg",
            "animate-in fade-in zoom-in-95 duration-150"
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">Notifications</p>
            {unreadCount > 0 && (
              <span className="text-xs font-medium text-orange-600">{unreadCount} new</span>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto py-1">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-400">You're all caught up</li>
            ) : (
              notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    role="menuitem"
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-2.5 text-left",
                      "transition-colors duration-150 hover:bg-slate-50"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        notification.unread ? "bg-orange-500" : "bg-transparent"
                      )}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block truncate text-sm",
                          notification.unread ? "font-medium text-slate-800" : "text-slate-600"
                        )}
                      >
                        {notification.title}
                      </span>
                      <span className="block text-xs text-slate-400">{notification.time}</span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="border-t border-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onViewAll?.();
              }}
              className={cn(
                "w-full rounded-lg px-2.5 py-2 text-center text-sm font-medium text-orange-600",
                "hover:bg-orange-50"
              )}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}