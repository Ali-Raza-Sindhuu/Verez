import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  ChevronDown,
  MoreHorizontal,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  Upload,
  Eye,
  ArrowUpDown,
  Paperclip,
} from "lucide-react";

type AssignmentStatus = "upcoming" | "submitted" | "graded" | "overdue";

interface Assignment {
  id: string;
  title: string;
  course: string;
  courseColor: string;
  dueDate: string;
  dueSort: number;
  status: AssignmentStatus;
  grade?: string;
  gradePercent?: number;
  attachments: number;
  description: string;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    title: "Binary Tree Traversal — Problem Set 4",
    course: "Data Structures",
    courseColor: "#1EC2BC",
    dueDate: "Tomorrow, 11:59 PM",
    dueSort: 1,
    status: "upcoming",
    attachments: 2,
    description: "Implement pre-order, in-order, and post-order traversal for a binary search tree.",
  },
  {
    id: "a2",
    title: "Vector Spaces Homework",
    course: "Linear Algebra",
    courseColor: "#E7714A",
    dueDate: "Fri, 5:00 PM",
    dueSort: 3,
    status: "upcoming",
    attachments: 1,
    description: "Problems 4.1–4.8 covering vector space axioms and linear independence.",
  },
  {
    id: "a3",
    title: "Essay Draft — Revision 2",
    course: "Technical Writing",
    courseColor: "#9277ff",
    dueDate: "Mon, 9:00 AM",
    dueSort: 6,
    status: "upcoming",
    attachments: 0,
    description: "Second revision incorporating peer review feedback from workshop session.",
  },
  {
    id: "a4",
    title: "Process Scheduling Lab Report",
    course: "Operating Systems Lab",
    courseColor: "#65e6f4",
    dueDate: "Wed, 11:59 PM",
    dueSort: 8,
    status: "upcoming",
    attachments: 3,
    description: "Write-up comparing FCFS, SJF, and Round Robin scheduling results from lab simulation.",
  },
  {
    id: "a5",
    title: "Recursion Practice Set",
    course: "Data Structures",
    courseColor: "#1EC2BC",
    dueDate: "Submitted Aug 12",
    dueSort: -6,
    status: "submitted",
    attachments: 1,
    description: "Recursive implementations of factorial, fibonacci, and merge sort.",
  },
  {
    id: "a6",
    title: "Matrix Operations Quiz Prep",
    course: "Linear Algebra",
    courseColor: "#E7714A",
    dueDate: "Graded — 92%",
    dueSort: -10,
    status: "graded",
    grade: "A-",
    gradePercent: 92,
    attachments: 0,
    description: "Preparatory worksheet covering matrix multiplication and determinants.",
  },
  {
    id: "a7",
    title: "Outline — Research Proposal",
    course: "Technical Writing",
    courseColor: "#9277ff",
    dueDate: "Graded — 88%",
    dueSort: -14,
    status: "graded",
    grade: "B+",
    gradePercent: 88,
    attachments: 1,
    description: "One-page structured outline for the semester research proposal.",
  },
  {
    id: "a8",
    title: "Kernel Modules Reading Response",
    course: "Operating Systems Lab",
    courseColor: "#65e6f4",
    dueDate: "Was due Aug 15",
    dueSort: -3,
    status: "overdue",
    attachments: 0,
    description: "Short response to assigned reading on Linux kernel module architecture.",
  },
];

const courseNames = ["All courses", ...Array.from(new Set(MOCK_ASSIGNMENTS.map((a) => a.course)))];

type SortKey = "due" | "course" | "status";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Due date", value: "due" },
  { label: "Course", value: "course" },
  { label: "Status", value: "status" },
];

const statusFilters: { label: string; value: AssignmentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Submitted", value: "submitted" },
  { label: "Graded", value: "graded" },
  { label: "Overdue", value: "overdue" },
];

const statusStyle: Record<AssignmentStatus, { badge: string; icon: typeof Clock }> = {
  upcoming: { badge: "bg-teal/10 text-teal border-teal/20", icon: Clock },
  submitted: { badge: "bg-violet-500/10 text-violet-300 border-violet-500/20", icon: Upload },
  graded: { badge: "bg-white/5 text-slate-text border-white/10", icon: CheckCircle2 },
  overdue: { badge: "bg-red-500/10 text-red-400 border-red-500/20", icon: AlertCircle },
};

const statusLabel: Record<AssignmentStatus, string> = {
  upcoming: "Upcoming",
  submitted: "Submitted",
  graded: "Graded",
  overdue: "Overdue",
};

function AssignmentMenu({ status }: { status: AssignmentStatus }) {
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
        aria-label="Assignment actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-text hover:text-cream hover:bg-white/5 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            View details
          </button>
          {(status === "upcoming" || status === "overdue") && (
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-teal hover:bg-teal/10 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Submit work
            </button>
          )}
          {status === "graded" && (
            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-text hover:text-cream hover:bg-white/5 transition-colors">
              <FileText className="w-3.5 h-3.5" />
              View feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Assignments() {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("due");
  const [sortOpen, setSortOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const courseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (courseRef.current && !courseRef.current.contains(e.target as Node)) setCourseOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_ASSIGNMENTS.filter((a) => {
      const matchesQuery =
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.course.toLowerCase().includes(query.toLowerCase());
      const matchesCourse = courseFilter === "All courses" || a.course === courseFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesQuery && matchesCourse && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "course":
          return a.course.localeCompare(b.course);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return a.dueSort - b.dueSort;
      }
    });

    return list;
  }, [query, courseFilter, statusFilter, sortKey]);

  const counts = {
    upcoming: MOCK_ASSIGNMENTS.filter((a) => a.status === "upcoming").length,
    overdue: MOCK_ASSIGNMENTS.filter((a) => a.status === "overdue").length,
    submitted: MOCK_ASSIGNMENTS.filter((a) => a.status === "submitted").length,
    graded: MOCK_ASSIGNMENTS.filter((a) => a.status === "graded").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Assignments</h1>
          <p className="text-sm text-slate-text mt-1">
            {counts.upcoming} upcoming · {counts.overdue} overdue
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-teal text-ink text-sm font-medium px-4 py-2 rounded-full hover:bg-teal-glow transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New reminder
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Upcoming</div>
          <div className="text-xl font-display font-semibold text-teal">{counts.upcoming}</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Overdue</div>
          <div className="text-xl font-display font-semibold text-red-400">{counts.overdue}</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Submitted</div>
          <div className="text-xl font-display font-semibold">{counts.submitted}</div>
        </div>
        <div className="rounded-2xl border border-white/8 p-4 bg-white/[0.02]">
          <div className="text-xs text-slate-text mb-1">Graded</div>
          <div className="text-xl font-display font-semibold">{counts.graded}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3.5 py-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-text shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments"
            className="bg-transparent text-sm placeholder:text-slate-text focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                statusFilter === f.value
                  ? "bg-teal/10 text-teal border-teal/20"
                  : "text-slate-text border-white/10 hover:text-cream hover:border-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:ml-auto">
          <div className="relative" ref={courseRef}>
            <button
              onClick={() => setCourseOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors max-w-[160px]"
            >
              <span className="truncate">{courseFilter}</span>
              <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${courseOpen ? "rotate-180" : ""}`} />
            </button>
            {courseOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
                {courseNames.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCourseFilter(c);
                      setCourseOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm truncate transition-colors ${
                      c === courseFilter ? "text-teal" : "text-slate-text hover:text-cream hover:bg-white/5"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-text hover:text-cream border border-white/10 rounded-full px-3.5 py-2 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOptions.find((s) => s.value === sortKey)?.label}
              <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-white/8 bg-ink shadow-[0_20px_50px_rgba(0,0,0,.5)] py-1.5 z-30">
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
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 py-16 text-center text-sm text-slate-text">
          No assignments match your search.
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((a) => {
          const style = statusStyle[a.status];
          const StatusIcon = style.icon;
          return (
            <div
              key={a.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-colors ${
                a.status === "overdue"
                  ? "border-red-500/25 bg-red-500/[0.03] hover:border-red-500/40"
                  : "border-white/8 bg-white/[0.02] hover:border-white/15"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: a.courseColor }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-cream truncate">{a.title}</h3>
                      <div className="text-xs text-slate-text mt-0.5">{a.course}</div>
                    </div>
                    <AssignmentMenu status={a.status} />
                  </div>

                  <p className="text-xs text-slate-text/80 mb-3 line-clamp-1">{a.description}</p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {statusLabel[a.status]}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        a.status === "overdue" ? "text-red-400" : "text-slate-text"
                      }`}
                    >
                      {a.dueDate}
                    </span>
                    {a.attachments > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-text">
                        <Paperclip className="w-3 h-3" />
                        {a.attachments} file{a.attachments !== 1 ? "s" : ""}
                      </span>
                    )}
                    {a.grade && (
                      <span className="text-xs font-medium text-teal">{a.grade}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}