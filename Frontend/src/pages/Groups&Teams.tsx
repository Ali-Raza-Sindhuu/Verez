import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MessageSquare,
  X,
  Crown,
  LogOut,
  MoreHorizontal,
} from "lucide-react";

interface Member {
  initials: string;
  isOwner?: boolean;
}

interface Group {
  id: string;
  name: string;
  course: string | null;
  courseColor: string | null;
  description: string;
  members: Member[];
  joined: boolean;
  unread: number;
}

const courseOptions = [
  { name: "Data Structures", color: "#1EC2BC" },
  { name: "Linear Algebra", color: "#E7714A" },
  { name: "Technical Writing", color: "#9277ff" },
  { name: "Operating Systems Lab", color: "#65e6f4" },
];

const initialGroups: Group[] = [
  {
    id: "g1",
    name: "DS Study Circle",
    course: "Data Structures",
    courseColor: "#1EC2BC",
    description: "Weekly problem-solving sessions before quizzes and exams.",
    members: [{ initials: "AK", isOwner: true }, { initials: "SM" }, { initials: "RB" }, { initials: "TL" }],
    joined: true,
    unread: 3,
  },
  {
    id: "g2",
    name: "Linear Algebra Homework Help",
    course: "Linear Algebra",
    courseColor: "#E7714A",
    description: "Ask questions and share worked solutions for weekly homework.",
    members: [{ initials: "SM", isOwner: true }, { initials: "AK" }, { initials: "PN" }],
    joined: true,
    unread: 0,
  },
  {
    id: "g3",
    name: "Research Proposal Team",
    course: "Technical Writing",
    courseColor: "#9277ff",
    description: "Group project team for the semester research proposal.",
    members: [{ initials: "AK" }, { initials: "RB", isOwner: true }, { initials: "TL" }],
    joined: true,
    unread: 1,
  },
  {
    id: "g4",
    name: "OS Lab Partners",
    course: "Operating Systems Lab",
    courseColor: "#65e6f4",
    description: "Coordination for lab exercises and the final scheduler project.",
    members: [{ initials: "DM", isOwner: true }, { initials: "YK" }],
    joined: false,
    unread: 0,
  },
  {
    id: "g5",
    name: "Campus Chess Club",
    course: null,
    courseColor: null,
    description: "Casual games and weekly tournaments, all skill levels welcome.",
    members: [{ initials: "IQ", isOwner: true }, { initials: "AK" }, { initials: "FM" }, { initials: "PN" }, { initials: "SM" }],
    joined: true,
    unread: 0,
  },
  {
    id: "g6",
    name: "Data Structures TA Office Hours",
    course: "Data Structures",
    courseColor: "#1EC2BC",
    description: "Announcements and Q&A thread for TA office hours.",
    members: [{ initials: "FZ", isOwner: true }, { initials: "AK" }, { initials: "SM" }, { initials: "RB" }],
    joined: false,
    unread: 0,
  },
];

type FilterTab = "all" | "joined" | "discover";

export default function GroupsTeams() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCourse, setNewCourse] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      const matchesQuery =
        g.name.toLowerCase().includes(query.toLowerCase()) ||
        (g.course ?? "").toLowerCase().includes(query.toLowerCase());
      const matchesTab = tab === "all" ? true : tab === "joined" ? g.joined : !g.joined;
      return matchesQuery && matchesTab;
    });
  }, [groups, query, tab]);

  const toggleJoin = (id: string) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, joined: !g.joined, unread: g.joined ? 0 : g.unread } : g)));
  };

  const createGroup = () => {
    const name = newName.trim();
    if (!name) return;
    const course = courseOptions.find((c) => c.name === newCourse);
    const group: Group = {
      id: `g${Date.now()}`,
      name,
      course: course?.name ?? null,
      courseColor: course?.color ?? null,
      description: "New study group.",
      members: [{ initials: "AK", isOwner: true }],
      joined: true,
      unread: 0,
    };
    setGroups((prev) => [group, ...prev]);
    setNewName("");
    setNewCourse(null);
    setShowNewForm(false);
  };

  const joinedCount = groups.filter((g) => g.joined).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Groups & Teams</h1>
          <p className="text-sm text-slate-text mt-1">{joinedCount} groups joined</p>
        </div>
        <button
          onClick={() => setShowNewForm((s) => !s)}
          className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create group
        </button>
      </div>

      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-2xl border border-teal/25 bg-teal/[0.03] p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createGroup()}
                placeholder="Group name..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream placeholder:text-slate-text focus:outline-none focus:border-teal/40"
              />
              <select
                value={newCourse ?? ""}
                onChange={(e) => setNewCourse(e.target.value || null)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-teal/40"
              >
                <option value="">No course</option>
                {courseOptions.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={createGroup}
                  className="bg-teal text-ink text-xs font-medium px-4 py-2 rounded-lg hover:bg-teal-glow transition-colors"
                >
                  Create
                </button>
                <button onClick={() => setShowNewForm(false)} className="text-slate-text hover:text-cream p-2" aria-label="Cancel">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-text shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search groups"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "joined", "discover"] as FilterTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors capitalize ${
                tab === t ? "bg-teal/10 text-teal border-teal/20" : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          No groups match your search.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <div key={g.id} className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-colors p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-medium text-cream flex items-center gap-1.5">
                {g.name}
                {g.unread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-teal text-ink text-[9px] font-bold flex items-center justify-center shrink-0">
                    {g.unread}
                  </span>
                )}
              </h3>
              <button className="text-slate-text hover:text-cream transition-colors shrink-0" aria-label="Group actions">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {g.course && (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-text mb-3">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.courseColor ?? undefined }} />
                {g.course}
              </span>
            )}

            <p className="text-xs text-slate-text/80 mb-4 leading-relaxed">{g.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {g.members.slice(0, 4).map((m, i) => (
                    <span
                      key={i}
                      className="relative w-6 h-6 rounded-full bg-teal/15 border border-ink flex items-center justify-center text-[9px] font-semibold text-teal"
                    >
                      {m.initials}
                      {m.isOwner && (
                        <Crown className="w-2.5 h-2.5 text-clay absolute -top-1 -right-1" />
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-slate-text">{g.members.length} members</span>
              </div>

              {g.joined ? (
                <div className="flex items-center gap-1">
                  <button className="text-slate-text hover:text-teal transition-colors p-1.5" aria-label="Open messages">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleJoin(g.id)}
                    className="text-slate-text hover:text-red-400 transition-colors p-1.5"
                    aria-label="Leave group"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => toggleJoin(g.id)}
                  className="text-xs font-medium text-teal hover:text-teal-glow transition-colors px-3 py-1.5 rounded-full border border-teal/20 bg-teal/10"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}