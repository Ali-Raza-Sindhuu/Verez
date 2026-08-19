import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreHorizontal,
  Users,
  Calendar,
  CheckSquare,
  Trash2,
  X,
  Check,
  FolderKanban,
  ChevronDown,
} from "lucide-react";

type ProjectStatus = "planning" | "in-progress" | "review" | "done";

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

interface Project {
  id: string;
  title: string;
  course: string | null;
  courseColor: string | null;
  status: ProjectStatus;
  dueDate: string;
  collaborators: string[];
  checklist: ChecklistItem[];
}

const courseOptions = [
  { name: "Data Structures", color: "#1EC2BC" },
  { name: "Linear Algebra", color: "#E7714A" },
  { name: "Technical Writing", color: "#9277ff" },
  { name: "Operating Systems Lab", color: "#65e6f4" },
  { name: "Personal", color: "#8ce9bd" },
];

const initialProjects: Project[] = [
  {
    id: "p1",
    title: "Graph Visualizer — Final Project",
    course: "Data Structures",
    courseColor: "#1EC2BC",
    status: "in-progress",
    dueDate: "Sep 15",
    collaborators: ["AK", "SM"],
    checklist: [
      { id: "c1", label: "Implement BFS/DFS traversal", done: true },
      { id: "c2", label: "Build adjacency list UI", done: true },
      { id: "c3", label: "Add Dijkstra's algorithm", done: false },
      { id: "c4", label: "Write documentation", done: false },
    ],
  },
  {
    id: "p2",
    title: "Group Research Proposal",
    course: "Technical Writing",
    courseColor: "#9277ff",
    status: "review",
    dueDate: "Sep 8",
    collaborators: ["AK", "RB", "TL"],
    checklist: [
      { id: "c5", label: "Draft introduction", done: true },
      { id: "c6", label: "Literature review", done: true },
      { id: "c7", label: "Peer review pass", done: false },
    ],
  },
  {
    id: "p3",
    title: "Custom Scheduler Simulation",
    course: "Operating Systems Lab",
    courseColor: "#65e6f4",
    status: "planning",
    dueDate: "Sep 22",
    collaborators: ["AK"],
    checklist: [
      { id: "c8", label: "Define workload test cases", done: false },
      { id: "c9", label: "Pick simulation framework", done: false },
    ],
  },
  {
    id: "p4",
    title: "Portfolio Website Refresh",
    course: "Personal",
    courseColor: "#8ce9bd",
    status: "in-progress",
    dueDate: "Ongoing",
    collaborators: ["AK"],
    checklist: [
      { id: "c10", label: "Redesign hero section", done: true },
      { id: "c11", label: "Add new projects", done: false },
    ],
  },
  {
    id: "p5",
    title: "Linear Algebra Study Guide (shared)",
    course: "Linear Algebra",
    courseColor: "#E7714A",
    status: "done",
    dueDate: "Aug 10",
    collaborators: ["AK", "SM", "RB"],
    checklist: [
      { id: "c12", label: "Compile formula sheet", done: true },
      { id: "c13", label: "Add worked examples", done: true },
      { id: "c14", label: "Distribute to study group", done: true },
    ],
  },
];

const statusColumns: { id: ProjectStatus; label: string }[] = [
  { id: "planning", label: "Planning" },
  { id: "in-progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

const statusBadge: Record<ProjectStatus, string> = {
  planning: "bg-white/5 text-slate-text border-white/10",
  "in-progress": "bg-teal/10 text-teal border-teal/20",
  review: "bg-clay/10 text-clay border-clay/20",
  done: "bg-violet-500/10 text-violet-300 border-violet-500/20",
};

function progressOf(checklist: ChecklistItem[]) {
  if (checklist.length === 0) return 0;
  return Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);
}

function ProjectMenu({
  onMoveTo,
  onDelete,
  currentStatus,
}: {
  onMoveTo: (status: ProjectStatus) => void;
  onDelete: () => void;
  currentStatus: ProjectStatus;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="text-slate-text hover:text-cream transition-colors p-1"
        aria-label="Project actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
          <div className="px-3 py-1 text-[10px] uppercase tracking-wide text-slate-text/60">Move to</div>
          {statusColumns
            .filter((s) => s.id !== currentStatus)
            .map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onMoveTo(s.id);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-[13px] text-slate-text hover:text-cream hover:bg-white/5 transition-colors"
              >
                {s.label}
              </button>
            ))}
          <div className="h-px bg-white/8 my-1.5" />
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete project
          </button>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onMoveTo,
  onDelete,
  onToggleChecklistItem,
  onAddChecklistItem,
  onRename,
}: {
  project: Project;
  onMoveTo: (status: ProjectStatus) => void;
  onDelete: () => void;
  onToggleChecklistItem: (itemId: string) => void;
  onAddChecklistItem: (label: string) => void;
  onRename: (title: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(project.title);
  const [newItem, setNewItem] = useState("");
  const percent = progressOf(project.checklist);

  const saveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed) onRename(trimmed);
    else setTitleDraft(project.title);
    setEditing(false);
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-colors overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          {editing ? (
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input
                autoFocus
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveTitle();
                  if (e.key === "Escape") {
                    setTitleDraft(project.title);
                    setEditing(false);
                  }
                }}
                className="w-full bg-white/5 border border-teal/30 rounded-lg px-2 py-1 text-sm text-cream focus:outline-none"
              />
              <button onClick={saveTitle} className="text-teal p-1 shrink-0" aria-label="Save">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <h3
              onDoubleClick={() => setEditing(true)}
              className="text-sm font-medium text-cream leading-snug flex-1 min-w-0 cursor-text"
              title="Double-click to rename"
            >
              {project.title}
            </h3>
          )}
          <ProjectMenu onMoveTo={onMoveTo} onDelete={onDelete} currentStatus={project.status} />
        </div>

        {project.course && (
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-text mb-3">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.courseColor ?? undefined }} />
            {project.course}
          </span>
        )}

        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-text">
              {project.checklist.filter((c) => c.done).length}/{project.checklist.length} tasks
            </span>
            <span className="text-[10px] text-slate-text">{percent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: project.courseColor ?? "#1EC2BC" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-text">
              <Calendar className="w-3 h-3" />
              {project.dueDate}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-slate-text">
              <Users className="w-3 h-3" />
              {project.collaborators.length}
            </span>
          </div>
          <div className="flex -space-x-1.5">
            {project.collaborators.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full bg-teal/15 border border-ink flex items-center justify-center text-[8px] font-semibold text-teal"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-center gap-1 text-[10px] text-slate-text hover:text-cream transition-colors mt-3 pt-3 border-t border-white/5"
        >
          <CheckSquare className="w-3 h-3" />
          {expanded ? "Hide checklist" : "View checklist"}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="p-4 space-y-1.5">
              {project.checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onToggleChecklistItem(item.id)}
                  className="w-full flex items-center gap-2 text-left py-1"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                      item.done ? "bg-teal border-teal" : "border-white/20"
                    }`}
                  >
                    {item.done && <Check className="w-2.5 h-2.5 text-ink" />}
                  </span>
                  <span className={`text-xs ${item.done ? "text-slate-text line-through" : "text-cream"}`}>
                    {item.label}
                  </span>
                </button>
              ))}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newItem.trim()) {
                      onAddChecklistItem(newItem.trim());
                      setNewItem("");
                    }
                  }}
                  placeholder="Add checklist item..."
                  className="flex-1 bg-white/5 border border-white/8 rounded-lg px-2 py-1 text-xs text-cream placeholder:text-slate-text focus:outline-none focus:border-teal/30"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [query, setQuery] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.course ?? "").toLowerCase().includes(query.toLowerCase())
    );
  }, [projects, query]);

  const byStatus = useMemo(() => {
    const map: Record<ProjectStatus, Project[]> = { planning: [], "in-progress": [], review: [], done: [] };
    for (const p of filtered) map[p.status].push(p);
    return map;
  }, [filtered]);

  const moveTo = (id: string, status: ProjectStatus) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleChecklistItem = (projectId: string, itemId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, checklist: p.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) }
          : p
      )
    );
  };

  const addChecklistItem = (projectId: string, label: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, checklist: [...p.checklist, { id: `ci${Date.now()}`, label, done: false }] }
          : p
      )
    );
  };

  const renameProject = (id: string, title: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, title } : p)));
  };

  const createProject = () => {
    const title = newTitle.trim();
    if (!title) return;
    const course = courseOptions.find((c) => c.name === newCourse);
    const project: Project = {
      id: `p${Date.now()}`,
      title,
      course: course?.name ?? null,
      courseColor: course?.color ?? null,
      status: "planning",
      dueDate: "No due date",
      collaborators: ["AK"],
      checklist: [],
    };
    setProjects((prev) => [project, ...prev]);
    setNewTitle("");
    setNewCourse(null);
    setShowNewForm(false);
  };

  const totalActive = projects.filter((p) => p.status !== "done").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-[1400px] mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-slate-text mt-1">{totalActive} active project{totalActive !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowNewForm((s) => !s)}
          className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New project
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
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createProject()}
                placeholder="Project title..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream placeholder:text-slate-text focus:outline-none focus:border-teal/40"
              />
              <select
                value={newCourse ?? ""}
                onChange={(e) => setNewCourse(e.target.value || null)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cream focus:outline-none focus:border-teal/40"
              >
                <option value="">No course</option>
                {courseOptions.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={createProject}
                  className="bg-teal text-ink text-xs font-medium px-4 py-2 rounded-lg hover:bg-teal-glow transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewForm(false)}
                  className="text-slate-text hover:text-cream p-2"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 max-w-sm mb-6">
        <Search className="w-4 h-4 text-slate-text shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects"
          className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusColumns.map((col) => (
          <div key={col.id}>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${statusBadge[col.id]}`}>
                {col.label}
              </span>
              <span className="text-xs text-slate-text">{byStatus[col.id].length}</span>
            </div>

            <div className="space-y-3">
              {byStatus[col.id].length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 py-8 text-center text-xs text-slate-text">
                  No projects
                </div>
              )}
              {byStatus[col.id].map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onMoveTo={(status) => moveTo(p.id, status)}
                  onDelete={() => deleteProject(p.id)}
                  onToggleChecklistItem={(itemId) => toggleChecklistItem(p.id, itemId)}
                  onAddChecklistItem={(label) => addChecklistItem(p.id, label)}
                  onRename={(title) => renameProject(p.id, title)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text mt-4">
          <FolderKanban className="w-6 h-6 mx-auto mb-2 opacity-40" />
          No projects match your search.
        </div>
      )}
    </motion.div>
  );
}