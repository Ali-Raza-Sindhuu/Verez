import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Plus,
  Sparkles,
  CalendarClock,
} from "lucide-react";

interface StudyBlock {
  id: string;
  dayIndex: number;
  startHour: number;
  duration: number;
  title: string;
  color: string;
}

interface Suggestion {
  id: string;
  title: string;
  course: string;
  color: string;
  reason: string;
  suggestedDuration: number;
}

const HOURS = Array.from({ length: 16 }, (_, i) => 7 + i);
const ROW_HEIGHT = 44;
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const courseColors = ["#1EC2BC", "#E7714A", "#9277ff", "#65e6f4", "#8ce9bd"];

const initialBlocks: StudyBlock[] = [
  { id: "b1", dayIndex: 0, startHour: 14, duration: 1.5, title: "Data Structures — review", color: "#1EC2BC" },
  { id: "b2", dayIndex: 1, startHour: 9, duration: 2, title: "Linear Algebra problem set", color: "#E7714A" },
  { id: "b3", dayIndex: 2, startHour: 16, duration: 1, title: "Essay outline", color: "#9277ff" },
  { id: "b4", dayIndex: 3, startHour: 10, duration: 1.5, title: "OS Lab prep", color: "#65e6f4" },
  { id: "b5", dayIndex: 4, startHour: 13, duration: 2, title: "Midterm prep — Data Structures", color: "#1EC2BC" },
];

const suggestions: Suggestion[] = [
  { id: "s1", title: "Midterm review session", course: "Data Structures", color: "#1EC2BC", reason: "Exam in 3 days", suggestedDuration: 2 },
  { id: "s2", title: "Vector spaces practice", course: "Linear Algebra", color: "#E7714A", reason: "Assignment due Friday", suggestedDuration: 1.5 },
  { id: "s3", title: "Lab practical prep", course: "Operating Systems Lab", color: "#65e6f4", reason: "Exam in 9 days", suggestedDuration: 1 },
];

function formatHour(h: number) {
  const period = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display} ${period}`;
}

function getWeekDates(anchor: Date) {
  const day = anchor.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() + diffToMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function StudyPlanner() {
  const [weekAnchor, setWeekAnchor] = useState(new Date());
  const [blocks, setBlocks] = useState<StudyBlock[]>(initialBlocks);
  const [composer, setComposer] = useState<{ dayIndex: number; startHour: number } | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDuration, setDraftDuration] = useState(1);
  const [draftColor, setDraftColor] = useState(courseColors[0]);
  const composerRef = useRef<HTMLDivElement>(null);

  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);
  const weekLabel = `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  useEffect(() => {
    if (!composer) return;
    const onClick = (e: MouseEvent) => {
      if (composerRef.current && !composerRef.current.contains(e.target as Node)) {
        setComposer(null);
        setDraftTitle("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [composer]);

  const openComposer = (dayIndex: number, startHour: number) => {
    setComposer({ dayIndex, startHour });
    setDraftTitle("");
    setDraftDuration(1);
    setDraftColor(courseColors[0]);
  };

  const saveBlock = () => {
    if (!composer) return;
    const title = draftTitle.trim();
    if (!title) return;
    const block: StudyBlock = {
      id: `b${Date.now()}`,
      dayIndex: composer.dayIndex,
      startHour: composer.startHour,
      duration: draftDuration,
      title,
      color: draftColor,
    };
    setBlocks((prev) => [...prev, block]);
    setComposer(null);
    setDraftTitle("");
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const scheduleSuggestion = (s: Suggestion) => {
    const block: StudyBlock = {
      id: `b${Date.now()}`,
      dayIndex: 1,
      startHour: 16,
      duration: s.suggestedDuration,
      title: s.title,
      color: s.color,
    };
    setBlocks((prev) => [...prev, block]);
  };

  const totalHoursThisWeek = blocks.reduce((sum, b) => sum + b.duration, 0);

  const blocksByDay = useMemo(() => {
    const map: Record<number, StudyBlock[]> = {};
    for (let i = 0; i < 7; i++) map[i] = [];
    for (const b of blocks) map[b.dayIndex]?.push(b);
    return map;
  }, [blocks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Study Planner</h1>
          <p className="text-sm text-slate-text mt-1">
            {totalHoursThisWeek}h planned this week · click any slot to add a session
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setWeekAnchor(new Date())}
            className="text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3 py-1.5 transition-colors"
          >
            This week
          </button>
          <button
            onClick={() => setWeekAnchor((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-text hover:text-cream hover:border-white/20 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekAnchor((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-text hover:text-cream hover:border-white/20 transition-colors"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
            <span className="text-sm font-medium text-cream">{weekLabel}</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-white/8">
                <div />
                {dayLabels.map((label, i) => {
                  const isToday = weekDates[i].toDateString() === new Date().toDateString();
                  return (
                    <div key={label} className="px-2 py-2.5 text-center border-l border-white/5">
                      <div className="text-[10px] uppercase tracking-wide text-slate-text/60">{label}</div>
                      <div className={`text-sm font-medium mt-0.5 ${isToday ? "text-teal" : "text-cream"}`}>
                        {weekDates[i].getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="relative grid grid-cols-[56px_repeat(7,1fr)]">
                <div>
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      style={{ height: ROW_HEIGHT }}
                      className="text-[10px] text-slate-text/60 pr-2 text-right pt-1 border-b border-white/5"
                    >
                      {formatHour(h)}
                    </div>
                  ))}
                </div>

                {dayLabels.map((_, dayIndex) => (
                  <div key={dayIndex} className="relative border-l border-white/5">
                    {HOURS.map((h) => (
                      <button
                        key={h}
                        onClick={() => openComposer(dayIndex, h)}
                        style={{ height: ROW_HEIGHT }}
                        className="w-full border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                      />
                    ))}

                    {blocksByDay[dayIndex].map((b) => (
                      <div
                        key={b.id}
                        className="group absolute left-0.5 right-0.5 rounded-lg px-2 py-1 overflow-hidden cursor-pointer"
                        style={{
                          top: (b.startHour - 7) * ROW_HEIGHT + 2,
                          height: b.duration * ROW_HEIGHT - 4,
                          backgroundColor: `${b.color}26`,
                          borderLeft: `2px solid ${b.color}`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[10px] font-medium text-cream leading-tight line-clamp-2">
                            {b.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBlock(b.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-slate-text hover:text-red-400 transition-opacity shrink-0"
                            aria-label="Remove block"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[9px] text-slate-text/70">{b.duration}h</span>
                      </div>
                    ))}
                  </div>
                ))}

                {composer && (
                  <div
                    ref={composerRef}
                    className="absolute z-40 w-56 rounded-xl border border-teal/25 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.6)] p-3"
                    style={{
                      top: (composer.startHour - 7) * ROW_HEIGHT,
                      left: `calc(56px + ${composer.dayIndex} * ((100% - 56px) / 7))`,
                    }}
                  >
                    <div className="text-[10px] text-slate-text mb-2">
                      {dayLabels[composer.dayIndex]} · {formatHour(composer.startHour)}
                    </div>
                    <input
                      autoFocus
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveBlock()}
                      placeholder="What are you studying?"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-cream placeholder:text-slate-text focus:outline-none focus:border-teal/40 mb-2"
                    />
                    <div className="flex items-center gap-1.5 mb-2">
                      {[0.5, 1, 1.5, 2, 3].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDraftDuration(d)}
                          className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                            draftDuration === d
                              ? "bg-teal/10 text-teal border-teal/20"
                              : "text-slate-text border-white/10 hover:text-cream"
                          }`}
                        >
                          {d}h
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 mb-3">
                      {courseColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setDraftColor(c)}
                          className={`w-5 h-5 rounded-full transition-transform ${
                            draftColor === c ? "scale-110 ring-2 ring-white/40" : ""
                          }`}
                          style={{ backgroundColor: c }}
                          aria-label={`Color ${c}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={saveBlock}
                        className="flex-1 bg-teal text-ink text-xs font-medium py-1.5 rounded-lg hover:bg-teal-glow transition-colors"
                      >
                        Add session
                      </button>
                      <button
                        onClick={() => setComposer(null)}
                        className="text-xs text-slate-text hover:text-cream px-2 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-teal" />
              <h2 className="font-display text-sm font-semibold">Suggested sessions</h2>
            </div>
            <div className="space-y-2.5">
              {suggestions.map((s) => (
                <div key={s.id} className="rounded-xl border border-white/8 p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: s.color }} />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-cream truncate">{s.title}</div>
                      <div className="text-[10px] text-slate-text">{s.course}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-clay">{s.reason}</span>
                    <button
                      onClick={() => scheduleSuggestion(s)}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-teal hover:text-teal-glow transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarClock className="w-4 h-4 text-teal" />
              <h2 className="font-display text-sm font-semibold">This week</h2>
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-text">Total planned</span>
              <span className="text-xs text-cream font-medium">{totalHoursThisWeek}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-text">Sessions</span>
              <span className="text-xs text-cream font-medium">{blocks.length}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-text shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-text leading-relaxed">
              Click any empty slot on the grid to add a study session, or use a suggestion on the right to auto-schedule one.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}