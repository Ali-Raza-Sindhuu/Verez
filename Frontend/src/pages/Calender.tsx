import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  BookOpen,
  FileText,
  GraduationCap,
  Users,
} from "lucide-react";

type EventType = "class" | "assignment" | "exam" | "meeting";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location?: string;
  type: EventType;
}

// The four event types map 1:1 onto the four Vexez accent hues — no colors invented
// beyond what's in the token system (wire blue / signal amber / ledger green / alert red).
const eventStyles: Record<EventType, { dot: string; badge: string; icon: typeof BookOpen }> = {
  class: {
    dot: "bg-[var(--color-accent-primary)]",
    badge: "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/20",
    icon: BookOpen,
  },
  assignment: {
    dot: "bg-[var(--color-accent-secondary)]",
    badge: "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] border-[var(--color-accent-secondary)]/20",
    icon: FileText,
  },
  exam: {
    dot: "bg-[var(--color-accent-danger)]",
    badge: "bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)] border-[var(--color-accent-danger)]/20",
    icon: GraduationCap,
  },
  meeting: {
    dot: "bg-[var(--color-accent-success)]",
    badge: "bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)] border-[var(--color-accent-success)]/20",
    icon: Users,
  },
};

const eventTypeLabel: Record<EventType, string> = {
  class: "Class",
  assignment: "Assignment",
  exam: "Exam",
  meeting: "Meeting",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

// Mock events anchored to the current month for a populated-looking demo
const today = new Date();
const Y = today.getFullYear();
const M = today.getMonth();

const MOCK_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Data Structures", date: toKey(Y, M, today.getDate()), time: "9:00 AM", location: "Room 204", type: "class" },
  { id: "e2", title: "Linear Algebra", date: toKey(Y, M, today.getDate()), time: "11:00 AM", location: "Room 118", type: "class" },
  { id: "e3", title: "Problem Set 4 due", date: toKey(Y, M, today.getDate() + 1), time: "11:59 PM", type: "assignment" },
  { id: "e4", title: "Midterm — Data Structures", date: toKey(Y, M, today.getDate() + 3), time: "10:00 AM", location: "Hall B", type: "exam" },
  { id: "e5", title: "Study group — OS Lab", date: toKey(Y, M, today.getDate() + 3), time: "3:00 PM", location: "Library rm. 2", type: "meeting" },
  { id: "e6", title: "Essay draft due", date: toKey(Y, M, today.getDate() + 5), time: "9:00 AM", type: "assignment" },
  { id: "e7", title: "Technical Writing", date: toKey(Y, M, today.getDate() + 6), time: "1:30 PM", location: "Online", type: "class" },
  { id: "e8", title: "Quiz — Linear Algebra", date: toKey(Y, M, today.getDate() + 8), time: "11:00 AM", location: "Room 118", type: "exam" },
  { id: "e9", title: "Project sync", date: toKey(Y, M, today.getDate() - 2), time: "4:00 PM", location: "Zoom", type: "meeting" },
  { id: "e10", title: "Operating Systems Lab", date: toKey(Y, M, today.getDate() - 1), time: "4:00 PM", location: "Lab 3", type: "class" },
];

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Shared class fragments — same `cx` pattern as DashboardLayout / Dashboard.
const cx = {
  card: "rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)]",
  textPrimary: "text-[var(--color-text-primary)]",
  textSecondary: "text-[var(--color-text-secondary)]",
  textTertiary: "text-[var(--color-text-tertiary)]",
  ghostChip:
    "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-strong)] hover:border-[var(--color-text-tertiary)] transition-colors",
};

export default function Calendar() {
  const [cursor, setCursor] = useState(new Date(Y, M, 1));
  const [selectedDate, setSelectedDate] = useState(toKey(Y, M, today.getDate()));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of MOCK_EVENTS) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    return map;
  }, []);

  const grid = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { day: number; key: string; inMonth: boolean }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const d = new Date(year, month - 1, day);
      cells.push({ day, key: toKey(d.getFullYear(), d.getMonth(), day), inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ day, key: toKey(year, month, day), inMonth: true });
    }
    while (cells.length % 7 !== 0 || cells.length < 42) {
      const nextIndex = cells.length - (startOffset + daysInMonth);
      const day = nextIndex + 1;
      const d = new Date(year, month + 1, day);
      cells.push({ day, key: toKey(d.getFullYear(), d.getMonth(), day), inMonth: false });
      if (cells.length >= 42) break;
    }
    return cells;
  }, [year, month]);

  const goToday = () => {
    setCursor(new Date(Y, M, 1));
    setSelectedDate(toKey(Y, M, today.getDate()));
  };

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));

  const selectedEvents = (eventsByDate[selectedDate] ?? []).sort((a, b) => a.time.localeCompare(b.time));

  const selectedDateObj = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDate]);

  const todayKey = toKey(Y, M, today.getDate());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={`font-display text-2xl font-semibold tracking-tight ${cx.textPrimary}`}>Calendar</h1>
          <p className={`text-sm mt-1 ${cx.textSecondary}`}>Classes, assignments, and exams in one place.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-[var(--color-accent-primary)] text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity self-start sm:self-auto shadow-[var(--shadow-cta-glow)]">
          <Plus className="w-4 h-4" />
          Add event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Month grid */}
        <div className={`${cx.card} p-4 sm:p-5`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`font-display text-base font-semibold ${cx.textPrimary}`}>{monthLabel}</h2>
            <div className="flex items-center gap-1.5">
              <button onClick={goToday} className={`text-xs rounded-full px-3 py-1.5 ${cx.ghostChip}`}>
                Today
              </button>
              <button
                onClick={prevMonth}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${cx.ghostChip}`}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${cx.ghostChip}`}
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {weekdayLabels.map((w) => (
              <div key={w} className={`text-center text-[10px] font-medium uppercase tracking-wide py-1 ${cx.textTertiary}`}>
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {grid.map((cell, i) => {
              const events = eventsByDate[cell.key] ?? [];
              const isToday = cell.key === todayKey;
              const isSelected = cell.key === selectedDate;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(cell.key)}
                  className={`relative aspect-square sm:aspect-[4/3] rounded-xl border p-1.5 sm:p-2 text-left transition-colors flex flex-col ${
                    isSelected
                      ? "border-[var(--color-accent-primary)]/40 bg-[var(--color-accent-primary)]/[0.06]"
                      : "border-[var(--color-border-hairline)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)]"
                  } ${!cell.inMonth ? "opacity-35" : ""}`}
                >
                  <span
                    className={`text-xs font-medium inline-flex items-center justify-center w-5 h-5 rounded-full ${
                      isToday ? "bg-[var(--color-accent-primary)] text-white" : cx.textPrimary
                    }`}
                  >
                    {cell.day}
                  </span>

                  <div className="mt-1 flex-1 flex flex-col gap-0.5 overflow-hidden">
                    {events.slice(0, 2).map((ev) => (
                      <div key={ev.id} className={`hidden sm:flex items-center gap-1 text-[9px] truncate ${cx.textSecondary}`}>
                        <span className={`w-1 h-1 rounded-full shrink-0 ${eventStyles[ev.type].dot}`} />
                        <span className="truncate">{ev.title}</span>
                      </div>
                    ))}
                    {events.length > 0 && (
                      <div className="flex sm:hidden gap-0.5 mt-0.5">
                        {events.slice(0, 3).map((ev) => (
                          <span key={ev.id} className={`w-1 h-1 rounded-full ${eventStyles[ev.type].dot}`} />
                        ))}
                      </div>
                    )}
                    {events.length > 2 && (
                      <span className={`hidden sm:block text-[9px] ${cx.textTertiary}`}>+{events.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side agenda */}
        <div className={`${cx.card} p-5`}>
          <h2 className={`font-display text-base font-semibold mb-1 ${cx.textPrimary}`}>
            {selectedDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h2>
          <p className={`text-xs mb-4 ${cx.textSecondary}`}>
            {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="space-y-2.5"
            >
              {selectedEvents.length === 0 && (
                <p className={`text-sm py-6 text-center ${cx.textSecondary}`}>No events on this day.</p>
              )}

              {selectedEvents.map((ev) => {
                const style = eventStyles[ev.type];
                const Icon = style.icon;
                return (
                  <div
                    key={ev.id}
                    className="rounded-xl border border-[var(--color-border-hairline)] p-3 hover:border-[var(--color-border-strong)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
                        <Icon className="w-2.5 h-2.5" />
                        {eventTypeLabel[ev.type]}
                      </span>
                    </div>
                    <div className={`text-sm mb-1.5 ${cx.textPrimary}`}>{ev.title}</div>
                    <div className={`flex items-center gap-3 text-xs ${cx.textSecondary}`}>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ev.time}
                      </span>
                      {ev.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {ev.location}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <div className={`mt-5 pt-4 border-t border-[var(--color-border-hairline)] flex items-center gap-4 text-[11px] ${cx.textSecondary}`}>
            {(Object.keys(eventTypeLabel) as EventType[]).map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${eventStyles[t].dot}`} />
                {eventTypeLabel[t]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}