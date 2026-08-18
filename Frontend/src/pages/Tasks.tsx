import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Circle,
  CheckCircle2,
  Trash2,
  Pencil,
  Flag,
  Calendar,
  ArrowUpDown,
  X,
  Check,
} from "lucide-react";

type Priority = "high" | "medium" | "low";
type Filter = "all" | "active" | "completed" | "overdue";

interface Task {
  id: string;
  title: string;
  course?: string;
  courseColor?: string;
  dueDate?: string;
  dueSort: number;
  priority: Priority;
  done: boolean;
}

const initialTasks: Task[] = [
  { id: "t1", title: "Review lecture notes — Ch. 6", course: "Data Structures", courseColor: "#1EC2BC", dueDate: "Today", dueSort: 0, priority: "medium", done: true },
  { id: "t2", title: "Email TA about extension", dueSort: 0, dueDate: "Today", priority: "low", done: true },
  { id: "t3", title: "Prep slides for group project", course: "Technical Writing", courseColor: "#9277ff", dueDate: "Tomorrow", dueSort: 1, priority: "high", done: false },
  { id: "t4", title: "Practice quiz — Linear Algebra", course: "Linear Algebra", courseColor: "#E7714A", dueDate: "Fri", dueSort: 3, priority: "medium", done: false },
  { id: "t5", title: "Read Chapter 7 before Friday", course: "Data Structures", courseColor: "#1EC2BC", dueDate: "Fri", dueSort: 3, priority: "low", done: false },
  { id: "t6", title: "Return library books", dueDate: "Was due yesterday", dueSort: -1, priority: "low", done: false },
  { id: "t7", title: "Buy new notebook for lab", dueSort: 999, priority: "low", done: false },
  { id: "t8", title: "Set up study group chat", dueSort: 999, priority: "medium", done: true },
];

const priorityStyle: Record<Priority, { dot: string; badge: string; label: string }> = {
  high: { dot: "bg-red-400", badge: "bg-red-500/10 text-red-400 border-red-500/20", label: "High" },
  medium: { dot: "bg-clay", badge: "bg-clay/10 text-clay border-clay/20", label: "Medium" },
  low: { dot: "bg-slate-text", badge: "bg-white/5 text-slate-text border-white/10", label: "Low" },
};

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "overdue" },
];

type SortKey = "due" | "priority" | "title";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Due date", value: "due" },
  { label: "Priority", value: "priority" },
  { label: "Title", value: "title" },
];

const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function TaskRow({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) onEdit(task.id, trimmed);
    else setDraft(task.title);
    setEditing(false);
  };

  const isOverdue = !task.done && task.dueSort < 0;

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
        isOverdue ? "border-red-500/25 bg-red-500/[0.03]" : "border-white/8 bg-white/[0.02] hover:border-white/15"
      }`}
    >
      <button onClick={() => onToggle(task.id)} className="shrink-0" aria-label="Toggle complete">
        {task.done ? (
          <CheckCircle2 className="w-[18px] h-[18px] text-teal" />
        ) : (
          <Circle className="w-[18px] h-[18px] text-slate-text hover:text-cream transition-colors" />
        )}
      </button>

      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityStyle[task.priority].dot}`} />

      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") {
                  setDraft(task.title);
                  setEditing(false);
                }
              }}
              className="w-full bg-white/5 border border-teal/30 rounded-lg px-2.5 py-1 text-sm text-cream focus:outline-none"
            />
            <button onClick={saveEdit} className="text-teal shrink-0 p-1" aria-label="Save">
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setDraft(task.title);
                setEditing(false);
              }}
              className="text-slate-text shrink-0 p-1"
              aria-label="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className={`text-sm truncate ${task.done ? "text-slate-text line-through" : "text-cream"}`}>
              {task.title}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {task.course && (
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-text">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.courseColor }} />
                  {task.course}
                </span>
              )}
              {task.dueDate && (
                <span className={`inline-flex items-center gap-1 text-[11px] ${isOverdue ? "text-red-400" : "text-slate-text"}`}>
                  <Calendar className="w-2.5 h-2.5" />
                  {task.dueDate}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-slate-text hover:text-cream transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Task actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
              <button
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-text hover:text-cream hover:bg-white/5 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("due");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [priorityPickerOpen, setPriorityPickerOpen] = useState(false);
  const priorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) setPriorityPickerOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const addTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    const task: Task = {
      id: `t${Date.now()}`,
      title,
      dueSort: 999,
      priority: newPriority,
      done: false,
    };
    setTasks((prev) => [task, ...prev]);
    setNewTitle("");
    setNewPriority("medium");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const editTask = (id: string, title: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  };

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => {
      const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
          ? !t.done
          : filter === "completed"
          ? t.done
          : !t.done && t.dueSort < 0;
      return matchesQuery && matchesFilter;
    });

    list = [...list].sort((a, b) => {
      if (sortKey === "priority") return priorityRank[a.priority] - priorityRank[b.priority];
      if (sortKey === "title") return a.title.localeCompare(b.title);
      return a.dueSort - b.dueSort;
    });

    return list;
  }, [tasks, query, filter, sortKey]);

  const activeCount = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.filter((t) => t.done).length;
  const overdueCount = tasks.filter((t) => !t.done && t.dueSort < 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="text-sm text-slate-text mt-1">
          {activeCount} active · {completedCount} completed{overdueCount > 0 ? ` · ${overdueCount} overdue` : ""}
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-3 mb-6 flex items-center gap-2">
        <Plus className="w-4 h-4 text-slate-text shrink-0 ml-1" />
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a task..."
          className="flex-1 bg-transparent text-sm placeholder:text-slate-text focus:outline-none min-w-0"
        />

        <div className="relative shrink-0" ref={priorityRef}>
          <button
            onClick={() => setPriorityPickerOpen((o) => !o)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-colors ${priorityStyle[newPriority].badge}`}
          >
            <Flag className="w-3 h-3" />
            {priorityStyle[newPriority].label}
          </button>
          {priorityPickerOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-32 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
              {(Object.keys(priorityStyle) as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setNewPriority(p);
                    setPriorityPickerOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                    p === newPriority ? "text-cream" : "text-slate-text hover:text-cream hover:bg-white/5"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle[p].dot}`} />
                  {priorityStyle[p].label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={addTask}
          className="shrink-0 bg-teal text-ink text-xs font-medium px-3.5 py-2 rounded-full hover:bg-teal-glow transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-text shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {filters.map((f) => (
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

        <div className="relative md:ml-auto" ref={sortRef}>
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortOptions.find((s) => s.value === sortKey)?.label}
            <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
              {sortOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => {
                    setSortKey(s.value);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    s.value === sortKey ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          {tasks.length === 0 ? "No tasks yet — add one above." : "No tasks match your filters."}
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {filtered.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TaskRow task={t} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}