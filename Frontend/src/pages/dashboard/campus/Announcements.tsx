import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  Megaphone,
  Pin,
  CheckCheck,
  AlertCircle,
  Clock,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  body: string;
  source: string;
  sourceColor: string;
  author: string;
  time: string;
  timeSort: number;
  pinned: boolean;
  read: boolean;
  urgent: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Midterm exam moved to Hall B",
    body: "Due to a scheduling conflict, the Data Structures midterm on Friday has been relocated from Room 204 to Hall B. Same time, 10:00 AM. Please arrive 10 minutes early to find seating.",
    source: "Data Structures",
    sourceColor: "#1EC2BC",
    author: "Dr. Farah Zaidi",
    time: "2h ago",
    timeSort: 0,
    pinned: true,
    read: false,
    urgent: true,
  },
  {
    id: "a2",
    title: "Extra office hours this week",
    body: "I'll be holding an additional office hours session Thursday 2-4 PM ahead of the midterm. No appointment needed, just drop by.",
    source: "Data Structures",
    sourceColor: "#1EC2BC",
    author: "Dr. Farah Zaidi",
    time: "5h ago",
    timeSort: 1,
    pinned: false,
    read: false,
    urgent: false,
  },
  {
    id: "a3",
    title: "Homework 5 solutions posted",
    body: "Solutions for the vector spaces homework are now available on the course page. Please review before Friday's quiz.",
    source: "Linear Algebra",
    sourceColor: "#E7714A",
    author: "Prof. Imran Qureshi",
    time: "1d ago",
    timeSort: 2,
    pinned: false,
    read: true,
    urgent: false,
  },
  {
    id: "a4",
    title: "Research proposal deadline reminder",
    body: "Just a reminder that final research proposals are due September 8th at 9 AM sharp. Late submissions will not be accepted without prior arrangement.",
    source: "Technical Writing",
    sourceColor: "#9277ff",
    author: "Dr. Sana Malik",
    time: "1d ago",
    timeSort: 2,
    pinned: true,
    read: true,
    urgent: true,
  },
  {
    id: "a5",
    title: "Lab 3 equipment maintenance",
    body: "Lab 3 will be closed Monday morning for equipment maintenance. Thursday's session is unaffected.",
    source: "Operating Systems Lab",
    sourceColor: "#65e6f4",
    author: "Eng. Bilal Ahmed",
    time: "2d ago",
    timeSort: 3,
    pinned: false,
    read: true,
    urgent: false,
  },
  {
    id: "a6",
    title: "Study Circle meeting this Saturday",
    body: "We'll be covering tree traversal and graph algorithms this Saturday at 3 PM in the library, room 2. Bring your practice problems.",
    source: "DS Study Circle",
    sourceColor: "#8ce9bd",
    author: "Sana M.",
    time: "3d ago",
    timeSort: 4,
    pinned: false,
    read: true,
    urgent: false,
  },
];

const sourceOptions = ["All sources", ...Array.from(new Set(initialAnnouncements.map((a) => a.source)))];

type ReadFilter = "all" | "unread";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All sources");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [sourceOpen, setSourceOpen] = useState(false);
  const sourceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sourceOpen) return;
    const onClick = (e: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) setSourceOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [sourceOpen]);

  const filtered = useMemo(() => {
    let list = announcements.filter((a) => {
      const matchesQuery =
        a.title.toLowerCase().includes(query.toLowerCase()) || a.body.toLowerCase().includes(query.toLowerCase());
      const matchesSource = sourceFilter === "All sources" || a.source === sourceFilter;
      const matchesRead = readFilter === "all" || !a.read;
      return matchesQuery && matchesSource && matchesRead;
    });
    list = [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.timeSort - b.timeSort;
    });
    return list;
  }, [announcements, query, sourceFilter, readFilter]);

  const markRead = (id: string) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const unreadCount = announcements.filter((a) => !a.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Announcements</h1>
          <p className="text-sm text-slate-text mt-1">
            {unreadCount} unread{unreadCount > 0 ? "" : " · you're all caught up"}
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

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-text shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search announcements"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setReadFilter("all")}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              readFilter === "all" ? "bg-teal/10 text-teal border-teal/20" : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setReadFilter("unread")}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              readFilter === "unread" ? "bg-teal/10 text-teal border-teal/20" : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
            }`}
          >
            Unread
          </button>
        </div>

        <div className="relative md:ml-auto" ref={sourceRef}>
          <button
            onClick={() => setSourceOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors max-w-[180px]"
          >
            <span className="truncate">{sourceFilter}</span>
            <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${sourceOpen ? "rotate-180" : ""}`} />
          </button>
          {sourceOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30 max-h-64 overflow-y-auto">
              {sourceOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSourceFilter(s);
                    setSourceOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm truncate transition-colors ${
                    s === sourceFilter ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          <Megaphone className="w-6 h-6 mx-auto mb-2 opacity-40" />
          No announcements match your filters.
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((a) => (
          <button
            key={a.id}
            onClick={() => markRead(a.id)}
            className={`w-full text-left rounded-2xl border p-4 sm:p-5 transition-colors ${
              a.read ? "border-white/8 bg-white/[0.02] hover:border-white/15" : "border-teal/20 bg-teal/[0.03] hover:border-teal/35"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                {!a.read && <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />}
                <h3 className="text-sm font-medium text-cream truncate">{a.title}</h3>
                {a.pinned && <Pin className="w-3 h-3 text-clay shrink-0" />}
              </div>
              {a.urgent && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border bg-red-500/10 text-red-400 border-red-500/20 shrink-0">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Urgent
                </span>
              )}
            </div>

            <p className="text-xs text-slate-text/80 leading-relaxed mb-3 line-clamp-2">{a.body}</p>

            <div className="flex items-center gap-3 text-[11px] text-slate-text">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: a.sourceColor }} />
                {a.source}
              </span>
              <span>{a.author}</span>
              <span className="inline-flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3" />
                {a.time}
              </span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}