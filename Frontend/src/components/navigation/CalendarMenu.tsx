import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "../../utils/cn";

export interface UpcomingEvent {
  id: string;
  title: string;
  time?: string;
}

const MOCK_EVENTS: UpcomingEvent[] = [
  { id: "evt-1", title: "Team meeting", time: "10:00 AM" },
  { id: "evt-2", title: "Order review", time: "2:00 PM" },
  { id: "evt-3", title: "Vendor onboarding call", time: "4:30 PM" },
];

const TODAY_LABEL = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date());

export interface CalendarMenuProps {
  events?: UpcomingEvent[];
  todayLabel?: string;
  className?: string;
}

/**
 * CalendarMenu
 *
 * Header button + lightweight popover — today's date and a short list of
 * mock upcoming events. This is a UI placeholder only: no calendar
 * library, no month grid, no scheduling logic. A future calendar
 * feature can replace the popover body without touching the trigger.
 *
 * Closes on outside click and Escape, matching MessageMenu /
 * NotificationMenu.
 *
 * Example:
 *   <CalendarMenu />
 */
export function CalendarMenu({ events = MOCK_EVENTS, todayLabel = TODAY_LABEL, className }: CalendarMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        aria-label="Calendar"
        title="Calendar"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg text-slate-500",
          "transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-orange-400",
          open && "bg-slate-100 text-slate-800"
        )}
      >
        <CalendarDays className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Calendar"
          className={cn(
            "absolute right-0 top-[calc(100%+8px)] z-20 w-72 origin-top-right",
            "rounded-xl border border-slate-200 bg-white shadow-lg",
            "animate-in fade-in zoom-in-95 duration-150"
          )}
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">Calendar</p>
          </div>

          <div className="px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Today</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{todayLabel}</p>
          </div>

          <div className="border-t border-slate-100 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Upcoming</p>
            {events.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">Nothing scheduled</p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {events.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" aria-hidden="true" />
                      {event.title}
                    </span>
                    {event.time && <span className="shrink-0 text-xs text-slate-400">{event.time}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}