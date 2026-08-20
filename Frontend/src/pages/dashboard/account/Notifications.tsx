import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  FileText,
  GraduationCap,
  CalendarCheck,
  MessageSquare,
  Megaphone,
  Users,
  CheckCheck,
  X,
  Sparkles,
} from "lucide-react";

type NotifType = "assignment" | "grade" | "attendance" | "message" | "announcement" | "group" | "ai";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  timeSort: number;
  read: boolean;
}

const typeConfig: Record<NotifType, { icon: typeof Bell; color: string }> = {
  assignment: { icon: FileText, color: "#1EC2BC" },
  grade: { icon: GraduationCap, color: "#8ce9bd" },
  attendance: { icon: CalendarCheck, color: "#E7714A" },
  message: { icon: MessageSquare, color: "#9277ff" },
  announcement: { icon: Megaphone, color: "#65e6f4" },
  group: { icon: Users, color: "#f0b86e" },
  ai: { icon: Sparkles, color: "#5CF2E8" },
};

const initialNotifications: Notification[] = [
  { id: "n1", type: "assignment", title: "Assignment due tomorrow", body: "Binary Tree Traversal — Problem Set 4 is due tomorrow at 11:59 PM.", time: "10m ago", timeSort: 0, read: false },
  { id: "n2", type: "announcement", title: "Midterm exam moved to Hall B", body: "Data Structures midterm relocated from Room 204.", time: "2h ago", timeSort: 1, read: false },
  { id: "n3", type: "message", title: "New message from Priya Nair", body: "Thanks for the notes!", time: "3h ago", timeSort: 2, read: false },
  { id: "n4", type: "grade", title: "Grade posted — Linear Algebra", body: "Matrix Operations Quiz Prep graded: 92%.", time: "5h ago", timeSort: 3, read: true },
  { id: "n5", type: "group", title: "DS Study Circle", body: "3 new messages in your group chat.", time: "6h ago", timeSort: 4, read: false },
  { id: "n6", type: "attendance", title: "Attendance warning — OS Lab", body: "Your attendance has dropped to 60%, below the 85% minimum.", time: "1d ago", timeSort: 5, read: true },
  { id: "n7", type: "ai", title: "Study Assistant suggestion", body: "You have an exam in 3 days — want me to build a review schedule?", time: "1d ago", timeSort: 5, read: true },
  { id: "n8", type: "assignment", title: "Assignment graded", body: "Recursion Practice Set has been graded and returned.", time: "2d ago", timeSort: 6, read: true },
  { id: "n9", type: "announcement", title: "Lab 3 equipment maintenance", body: "Lab 3 will be closed Monday morning.", time: "2d ago", timeSort: 6, read: true },
];

type FilterTab = "all" | "unread" | NotifType;

const filterOptions: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Assignments", value: "assignment" },
  { label: "Grades", value: "grade" },
  { label: "Attendance", value: "attendance" },
  { label: "Messages", value: "message" },
  { label: "Announcements", value: "announcement" },
];

function groupByRecency(items: Notification[]) {
  const today = items.filter((n) => n.timeSort <= 4);
  const earlier = items.filter((n) => n.timeSort > 4);
  return { today, earlier };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "all") return true;
      if (filter === "unread") return !n.read;
      return n.type === filter;
    });
  }, [notifications, filter]);

  const { today, earlier } = useMemo(() => groupByRecency(filtered), [filtered]);

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderGroup = (label: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-5">
        <div className="text-[10px] uppercase tracking-wide text-slate-text/60 mb-2 px-1">{label}</div>
        <div className="space-y-2">
          {items.map((n) => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`group flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors ${
                  n.read ? "border-white/8 bg-white/[0.02] hover:border-white/15" : "border-teal/20 bg-teal/[0.03] hover:border-teal/35"
                }`}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cfg.color}1a`, color: cfg.color }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />}
                    <h3 className="text-sm text-cream truncate">{n.title}</h3>
                  </div>
                  <p className="text-xs text-slate-text/80 leading-relaxed">{n.body}</p>
                  <span className="text-[10px] text-slate-text/60 mt-1 block">{n.time}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismiss(n.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-text hover:text-red-400 transition-opacity shrink-0 p-1"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-text mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 text-sm text-slate-text hover:text-cream border border-white/10 rounded-full px-4 py-2 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
        {filterOptions.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === f.value
                ? "bg-teal/10 text-teal border-teal/20"
                : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          <Bell className="w-6 h-6 mx-auto mb-2 opacity-40" />
          No notifications here.
        </div>
      )}

      {renderGroup("Today", today)}
      {renderGroup("Earlier", earlier)}
    </motion.div>
  );
}