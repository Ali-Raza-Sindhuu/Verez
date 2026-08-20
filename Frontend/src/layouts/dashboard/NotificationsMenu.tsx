import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, FileText, MessageSquare, GraduationCap, CheckCheck } from "lucide-react";
import { cx } from "./navConfig";

interface NotificationItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    icon: FileText,
    title: "Assignment due tomorrow",
    description: "Data Structures — Problem Set 4",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n2",
    icon: GraduationCap,
    title: "Grade posted",
    description: "Linear Algebra — Midterm: B+",
    time: "3h ago",
    unread: true,
  },
  {
    id: "n3",
    icon: MessageSquare,
    title: "New message",
    description: "Sana Malik replied in Technical Writing",
    time: "Yesterday",
    unread: false,
  },
];

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = items.filter((n) => n.unread).length;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function markOneRead(id: string) {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  function markAllRead() {
    setItems((list) => list.map((n) => ({ ...n, unread: false })));
  }

  function viewAll() {
    setOpen(false);
    navigate("/dashboard/notifications");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
          open ? cx.navActive : cx.navHover
        }`}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-danger)]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full right-0 mt-1.5 w-80 rounded-xl border py-1.5 z-50 ${cx.dropdown}`}
          >
            <div className={`flex items-center justify-between px-3 py-2.5 border-b ${cx.border}`}>
              <p className={`text-sm font-medium ${cx.textPrimary}`}>
                Notifications{unreadCount > 0 && ` (${unreadCount})`}
              </p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className={`flex items-center gap-1 text-[11.5px] font-medium transition-colors ${cx.textTertiary} hover:text-[var(--color-accent-primary)]`}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto py-1">
              {items.length === 0 ? (
                <p className={`px-3 py-6 text-center text-[13px] ${cx.textTertiary}`}>
                  You're all caught up.
                </p>
              ) : (
                items.map((n) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => markOneRead(n.id)}
                      className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-[var(--color-surface-alt)]"
                    >
                      <span
                        className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          n.unread
                            ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]"
                            : `bg-[var(--color-surface-alt)] ${cx.textTertiary}`
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className={`text-[13px] font-medium truncate ${cx.textPrimary}`}>
                            {n.title}
                          </span>
                          {n.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-primary)] shrink-0" />
                          )}
                        </span>
                        <span className={`block text-[12px] truncate ${cx.textSecondary}`}>
                          {n.description}
                        </span>
                        <span className={`block text-[11px] mt-0.5 ${cx.textTertiary}`}>{n.time}</span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className={`h-px my-1 ${cx.border} border-t`} />

            <button
              onClick={viewAll}
              className="w-full px-3 py-2 text-[12.5px] font-medium text-center text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 transition-colors"
            >
              View all notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}