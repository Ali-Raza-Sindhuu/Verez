import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Pin,
  PinOff,
  Trash2,
  ChevronDown,
  StickyNote,
  Clock,
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  course: string | null;
  courseColor: string | null;
  pinned: boolean;
  updatedAt: string;
  updatedSort: number;
}

const courseOptions = [
  { name: "Data Structures", color: "#1EC2BC" },
  { name: "Linear Algebra", color: "#E7714A" },
  { name: "Technical Writing", color: "#9277ff" },
  { name: "Operating Systems Lab", color: "#65e6f4" },
];

const initialNotes: Note[] = [
  {
    id: "n1",
    title: "Binary Search Tree properties",
    content:
      "A BST maintains the invariant: left subtree < node < right subtree.\n\nKey operations:\n- Insert: O(log n) average, O(n) worst case\n- Search: same complexity as insert\n- Delete: three cases — leaf, one child, two children\n\nFor two-child deletion, replace with in-order successor (smallest in right subtree) or predecessor.",
    course: "Data Structures",
    courseColor: "#1EC2BC",
    pinned: true,
    updatedAt: "2h ago",
    updatedSort: 0,
  },
  {
    id: "n2",
    title: "Vector space axioms — quick reference",
    content:
      "A set V is a vector space if it satisfies:\n1. Closure under addition and scalar multiplication\n2. Associativity and commutativity of addition\n3. Existence of zero vector\n4. Existence of additive inverse\n5. Distributivity of scalar multiplication",
    course: "Linear Algebra",
    courseColor: "#E7714A",
    pinned: true,
    updatedAt: "5h ago",
    updatedSort: 1,
  },
  {
    id: "n3",
    title: "Research proposal — structure notes",
    content:
      "Sections to include:\n- Problem statement\n- Literature review\n- Methodology\n- Expected outcomes\n- Timeline\n\nProf. Malik wants at least 6 sources cited, minimum 3 peer-reviewed.",
    course: "Technical Writing",
    courseColor: "#9277ff",
    pinned: false,
    updatedAt: "1d ago",
    updatedSort: 2,
  },
  {
    id: "n4",
    title: "Process scheduling algorithms comparison",
    content:
      "FCFS: simple, but poor average wait time.\nSJF: optimal average wait time, but starvation risk.\nRound Robin: fair, good for interactive systems, time quantum matters a lot.\n\nLab report needs a table comparing all three under the same workload.",
    course: "Operating Systems Lab",
    courseColor: "#65e6f4",
    pinned: false,
    updatedAt: "2d ago",
    updatedSort: 3,
  },
  {
    id: "n5",
    title: "General study tips from orientation",
    content:
      "- Review notes within 24h of lecture\n- Use active recall over re-reading\n- Spaced repetition for anything memorization-heavy\n- Study group once a week for Data Structures",
    course: null,
    courseColor: null,
    pinned: false,
    updatedAt: "5d ago",
    updatedSort: 4,
  },
];

type CourseFilter = "all" | "none" | string;

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<CourseFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useState<string | null>(initialNotes[0]?.id ?? null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");

  useEffect(() => {
    if (!filterOpen) return;
    const onClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [filterOpen]);

  const filtered = useMemo(() => {
    let list = notes.filter((n) => {
      const matchesQuery =
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        courseFilter === "all"
          ? true
          : courseFilter === "none"
          ? n.course === null
          : n.course === courseFilter;
      return matchesQuery && matchesFilter;
    });

    list = [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return a.updatedSort - b.updatedSort;
    });

    return list;
  }, [notes, query, courseFilter]);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedNote) {
      setDraftTitle(selectedNote.title);
      setDraftContent(selectedNote.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const selectNote = (id: string) => {
    setSelectedId(id);
  };

  const commitEdits = () => {
    if (!selectedId) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedId
          ? { ...n, title: draftTitle.trim() || "Untitled note", content: draftContent, updatedAt: "Just now", updatedSort: -1 }
          : n
      )
    );
  };

  const createNote = () => {
    const note: Note = {
      id: `n${Date.now()}`,
      title: "Untitled note",
      content: "",
      course: null,
      courseColor: null,
      pinned: false,
      updatedAt: "Just now",
      updatedSort: -1,
    };
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    }
  };

  const togglePin = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const filterLabel =
    courseFilter === "all" ? "All notes" : courseFilter === "none" ? "No course" : courseFilter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Notes</h1>
          <p className="text-sm text-slate-text mt-1">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={createNote}
          className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col overflow-hidden">
          <div className="p-3 border-b border-white/8 space-y-2">
            <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-2">
              <Search className="w-3.5 h-3.5 text-slate-text shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes"
                className="bg-transparent text-xs placeholder:text-slate-text focus:outline-none w-full"
              />
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="w-full flex items-center justify-between text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3 py-1.5 transition-colors"
              >
                <span className="truncate">{filterLabel}</span>
                <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>
              {filterOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      setCourseFilter("all");
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      courseFilter === "all" ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                    }`}
                  >
                    All notes
                  </button>
                  <button
                    onClick={() => {
                      setCourseFilter("none");
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      courseFilter === "none" ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                    }`}
                  >
                    No course
                  </button>
                  <div className="h-px bg-white/8 my-1" />
                  {courseOptions.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setCourseFilter(c.name);
                        setFilterOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 text-left px-3 py-1.5 text-xs transition-colors ${
                        courseFilter === c.name ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {filtered.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-text px-4">No notes match your search.</div>
            )}
            <AnimatePresence initial={false}>
              {filtered.map((n) => (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={() => selectNote(n.id)}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors ${
                    n.id === selectedId ? "bg-teal/[0.06]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm text-cream truncate flex items-center gap-1.5">
                      {n.pinned && <Pin className="w-3 h-3 text-teal shrink-0" />}
                      <span className="truncate">{n.title}</span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-text/70 line-clamp-1 mb-1.5">
                    {n.content.split("\n")[0] || "No content"}
                  </p>
                  <div className="flex items-center gap-2">
                    {n.course && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-text">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n.courseColor ?? undefined }} />
                        {n.course}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-text/60">{n.updatedAt}</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6 min-h-[500px] flex flex-col">
          {selectedNote ? (
            <>
              <div className="flex items-start justify-between gap-3 mb-4">
                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={commitEdits}
                  placeholder="Untitled note"
                  className="font-display text-xl font-semibold bg-transparent focus:outline-none w-full placeholder:text-slate-text"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => togglePin(selectedNote.id)}
                    className="text-slate-text hover:text-teal transition-colors p-1.5"
                    aria-label={selectedNote.pinned ? "Unpin note" : "Pin note"}
                  >
                    {selectedNote.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="text-slate-text hover:text-red-400 transition-colors p-1.5"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-5 text-xs text-slate-text">
                {selectedNote.course && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedNote.courseColor ?? undefined }} />
                    {selectedNote.course}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated {selectedNote.updatedAt}
                </span>
              </div>

              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                onBlur={commitEdits}
                placeholder="Start writing..."
                className="flex-1 bg-transparent text-sm text-cream leading-relaxed placeholder:text-slate-text focus:outline-none resize-none min-h-[320px]"
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-text">
              <StickyNote className="w-8 h-8 mb-3 opacity-40" />
              <p className="text-sm">No note selected.</p>
              <button
                onClick={createNote}
                className="mt-3 text-xs text-teal hover:text-teal-glow transition-colors"
              >
                Create your first note
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}