import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
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
  X,
  LayoutGrid,
  List as ListIcon,
  UploadCloud,
  Download,
  Info,
  ClipboardCheck,
  CalendarClock,
  Sparkles,
  Inbox,
  SearchX,
  PartyPopper,
} from "lucide-react";

// =====================================================================
// TYPES
// =====================================================================

type AssignmentStatus = "upcoming" | "submitted" | "late-submitted" | "graded" | "overdue";
type AssignmentType = "Homework" | "Project" | "Quiz" | "Report" | "Essay" | "Lab";
type SubmissionType = "file" | "text" | "link";

interface AssignmentAttachment {
  id: string;
  name: string;
  sizeKB: number;
}

interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  courseColor: string;
  title: string;
  description: string;
  instructions: string;
  type: AssignmentType;
  points: number;
  dueDate: string; // ISO
  status: AssignmentStatus;
  submissionType: SubmissionType;
  allowedFileTypes: string[];
  maxFileSizeMB: number;
  attachments: AssignmentAttachment[];
  submittedAt?: string; // ISO
  submittedFiles?: { name: string; sizeKB: number }[];
  grade?: number;
  gradePercent?: number;
  feedback?: string;
}

// =====================================================================
// DESIGN TOKENS — same var(--color-*) system used across Vexez
// =====================================================================

const cx = {
  card: "rounded-2xl border border-[var(--color-border-hairline)] bg-[var(--color-surface)]",
  cardAlt: "rounded-xl border border-[var(--color-border-hairline)] bg-[var(--color-surface-alt)]",
  textPrimary: "text-[var(--color-text-primary)]",
  textSecondary: "text-[var(--color-text-secondary)]",
  textTertiary: "text-[var(--color-text-tertiary)]",
  border: "border-[var(--color-border-hairline)]",
  borderStrong: "border-[var(--color-border-strong)]",
  accentChip: "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]",
  accentBtn:
    "bg-[var(--color-accent-primary)] text-white hover:opacity-90 transition-opacity shadow-[var(--shadow-cta-glow)]",
  ghostBtn:
    "border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] transition-colors",
  dropdown: "bg-[var(--color-surface)] border-[var(--color-border-hairline)] shadow-[var(--shadow-lifted)]",
  danger: "text-[var(--color-accent-danger)]",
  dangerChip: "bg-[var(--color-accent-danger)]/10 text-[var(--color-accent-danger)]",
  success: "text-[var(--color-accent-success)]",
  successChip: "bg-[var(--color-accent-success)]/10 text-[var(--color-accent-success)]",
};

// =====================================================================
// MOCK DATA — easy to swap for GET /api/assignments later
// =====================================================================

const now = new Date();
function daysFromNow(n: number, hour = 23, minute = 59) {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "as1",
    courseCode: "CS-301",
    courseName: "Database Systems",
    courseColor: "#1EC2BC",
    title: "ER Diagram Design",
    description: "Design an ER diagram for the University Management System.",
    instructions:
      "Design an ER diagram for the University Management System including all entities, attributes, and relationships. Submit as a single PDF with a brief write-up explaining your key design decisions, including how you handled many-to-many relationships and weak entities.",
    type: "Homework",
    points: 100,
    dueDate: daysFromNow(2),
    status: "upcoming",
    submissionType: "file",
    allowedFileTypes: ["PDF", "DOCX", "ZIP"],
    maxFileSizeMB: 10,
    attachments: [
      { id: "att1", name: "assignment_requirements.pdf", sizeKB: 245 },
      { id: "att2", name: "er_diagram_example.png", sizeKB: 1200 },
    ],
  },
  {
    id: "as2",
    courseCode: "CS-302",
    courseName: "Web Engineering",
    courseColor: "#E7714A",
    title: "React Components Project",
    description: "Build a small component library with Storybook documentation.",
    instructions:
      "Build a reusable component library (minimum 6 components) using React and TypeScript. Each component must have prop typing, basic tests, and a Storybook entry. Push your repo and submit the GitHub link along with a short README summary.",
    type: "Project",
    points: 150,
    dueDate: daysFromNow(4),
    status: "upcoming",
    submissionType: "link",
    allowedFileTypes: [],
    maxFileSizeMB: 0,
    attachments: [{ id: "att3", name: "project_rubric.pdf", sizeKB: 180 }],
  },
  {
    id: "as3",
    courseCode: "MATH-201",
    courseName: "Discrete Mathematics",
    courseColor: "#9277ff",
    title: "Problem Set 5",
    description: "Combinatorics and graph theory problem set.",
    instructions:
      "Complete problems 5.1 through 5.12 covering combinatorics, pigeonhole principle, and introductory graph theory. Show all work — answers without justification will receive partial credit only.",
    type: "Homework",
    points: 50,
    dueDate: daysFromNow(6),
    status: "upcoming",
    submissionType: "file",
    allowedFileTypes: ["PDF"],
    maxFileSizeMB: 5,
    attachments: [{ id: "att4", name: "problem_set_5.pdf", sizeKB: 310 }],
  },
  {
    id: "as4",
    courseCode: "CS-305",
    courseName: "Artificial Intelligence",
    courseColor: "#65e6f4",
    title: "Search Algorithms Report",
    description: "Comparative analysis of A*, BFS, and DFS on the 8-puzzle problem.",
    instructions:
      "Implement A*, BFS, and DFS to solve the 8-puzzle problem. Write a 3–5 page report comparing runtime, memory usage, and solution optimality across the three approaches. Include your source code as an appendix.",
    type: "Report",
    points: 120,
    dueDate: daysFromNow(9),
    status: "upcoming",
    submissionType: "file",
    allowedFileTypes: ["PDF", "ZIP"],
    maxFileSizeMB: 20,
    attachments: [],
  },
  {
    id: "as5",
    courseCode: "CS-301",
    courseName: "Database Systems",
    courseColor: "#1EC2BC",
    title: "Normalization Practice Set",
    description: "Normalize the given schema to 3NF.",
    instructions:
      "Given the provided unnormalized schema, walk through 1NF, 2NF, and 3NF, showing your reasoning at each step. Submit as a single PDF.",
    type: "Homework",
    points: 60,
    dueDate: daysFromNow(-3),
    status: "submitted",
    submissionType: "file",
    allowedFileTypes: ["PDF"],
    maxFileSizeMB: 10,
    attachments: [{ id: "att5", name: "unnormalized_schema.pdf", sizeKB: 140 }],
    submittedAt: daysFromNow(-4, 20, 15),
    submittedFiles: [{ name: "normalization_pset.pdf", sizeKB: 512 }],
  },
  {
    id: "as6",
    courseCode: "SE-320",
    courseName: "Cloud & Distributed Systems",
    courseColor: "#f472b6",
    title: "Load Balancer Design Doc",
    description: "Design doc for a horizontally scalable load balancer.",
    instructions:
      "Write a design document proposing a load-balancing strategy for a hypothetical high-traffic service. Cover algorithm choice, failure handling, and scaling triggers.",
    type: "Report",
    points: 80,
    dueDate: daysFromNow(-1),
    status: "late-submitted",
    submissionType: "file",
    allowedFileTypes: ["PDF", "DOCX"],
    maxFileSizeMB: 10,
    attachments: [],
    submittedAt: daysFromNow(0, 8, 5),
    submittedFiles: [{ name: "load_balancer_design.pdf", sizeKB: 380 }],
  },
  {
    id: "as7",
    courseCode: "MATH-210",
    courseName: "Linear Algebra",
    courseColor: "#60a5fa",
    title: "Matrix Operations Quiz Prep",
    description: "Preparatory worksheet covering matrix multiplication and determinants.",
    instructions:
      "Complete the practice worksheet on matrix multiplication, determinants, and inverse matrices ahead of next week's quiz.",
    type: "Quiz",
    points: 40,
    dueDate: daysFromNow(-8),
    status: "graded",
    submissionType: "file",
    allowedFileTypes: ["PDF"],
    maxFileSizeMB: 5,
    attachments: [],
    submittedAt: daysFromNow(-10, 19, 40),
    submittedFiles: [{ name: "matrix_worksheet.pdf", sizeKB: 210 }],
    grade: 37,
    gradePercent: 92,
    feedback:
      "Excellent work. Your determinant calculations were clean and well-organized. Minor deduction on question 6 — double check the cofactor expansion sign pattern.",
  },
  {
    id: "as8",
    courseCode: "ENG-101",
    courseName: "Technical Communication",
    courseColor: "#e6b873",
    title: "Outline — Research Proposal",
    description: "One-page structured outline for the semester research proposal.",
    instructions:
      "Submit a one-page structured outline for your semester-long research proposal, including thesis statement, three supporting sections, and a preliminary source list.",
    type: "Essay",
    points: 30,
    dueDate: daysFromNow(-12),
    status: "graded",
    submissionType: "file",
    allowedFileTypes: ["PDF", "DOCX"],
    maxFileSizeMB: 5,
    attachments: [],
    submittedAt: daysFromNow(-13, 21, 0),
    submittedFiles: [{ name: "research_outline.docx", sizeKB: 95 }],
    grade: 26,
    gradePercent: 88,
    feedback:
      "Strong thesis statement and clear structure. Consider narrowing the scope of your second supporting section — it currently overlaps with the third.",
  },
  {
    id: "as9",
    courseCode: "CS-322",
    courseName: "Operating Systems Lab",
    courseColor: "#8ce9bd",
    title: "Kernel Modules Reading Response",
    description: "Short response to assigned reading on Linux kernel module architecture.",
    instructions:
      "Write a one-page response to the assigned reading on Linux kernel module architecture. Address at least two discussion questions from the syllabus.",
    type: "Essay",
    points: 25,
    dueDate: daysFromNow(-5),
    status: "overdue",
    submissionType: "file",
    allowedFileTypes: ["PDF", "DOCX"],
    maxFileSizeMB: 5,
    attachments: [{ id: "att6", name: "reading_discussion_questions.pdf", sizeKB: 90 }],
  },
  {
    id: "as10",
    courseCode: "CS-307",
    courseName: "Software Engineering",
    courseColor: "#c084fc",
    title: "Sprint Retrospective Report",
    description: "Retrospective write-up for capstone sprint 2.",
    instructions:
      "Summarize what went well, what didn't, and action items from your team's second capstone sprint. Minimum 400 words.",
    type: "Report",
    points: 40,
    dueDate: daysFromNow(-2),
    status: "overdue",
    submissionType: "text",
    allowedFileTypes: [],
    maxFileSizeMB: 0,
    attachments: [],
  },
  {
    id: "as11",
    courseCode: "GE-150",
    courseName: "Ethics in Technology",
    courseColor: "#fb7185",
    title: "AI Ethics Case Study",
    description: "Case study analysis on an AI ethics dilemma of your choice.",
    instructions:
      "Choose a real-world AI ethics case (algorithmic bias, surveillance, automation displacement, etc.) and write a 2-page analysis applying at least two ethical frameworks covered in class.",
    type: "Essay",
    points: 60,
    dueDate: daysFromNow(11),
    status: "upcoming",
    submissionType: "file",
    allowedFileTypes: ["PDF", "DOCX"],
    maxFileSizeMB: 8,
    attachments: [],
  },
  {
    id: "as12",
    courseCode: "CS-305",
    courseName: "Artificial Intelligence",
    courseColor: "#65e6f4",
    title: "Neural Network Mini-Project",
    description: "Train a small CNN on a provided image dataset.",
    instructions:
      "Train and evaluate a small convolutional neural network on the provided dataset. Submit your notebook along with a short results summary covering accuracy, loss curves, and misclassification examples.",
    type: "Project",
    points: 130,
    dueDate: daysFromNow(-15),
    status: "graded",
    submissionType: "file",
    allowedFileTypes: ["ZIP", "PDF"],
    maxFileSizeMB: 25,
    attachments: [],
    submittedAt: daysFromNow(-16, 22, 30),
    submittedFiles: [{ name: "cnn_project.zip", sizeKB: 4200 }],
    grade: 118,
    gradePercent: 91,
    feedback: "Solid implementation and clear analysis of the loss curves. Consider trying data augmentation next time to reduce overfitting.",
  },
];

// =====================================================================
// HELPERS
// =====================================================================

function formatDueLabel(a: Assignment): string {
  const due = new Date(a.dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (a.status === "graded") return `Graded — ${a.gradePercent}%`;
  if (a.status === "submitted" || a.status === "late-submitted") {
    const d = a.submittedAt ? new Date(a.submittedAt) : due;
    return `Submitted ${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }
  if (a.status === "overdue") {
    const overdueDays = Math.abs(diffDays);
    return `${overdueDays} day${overdueDays !== 1 ? "s" : ""} overdue`;
  }
  if (diffDays <= 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays} days`;
}

function formatFullDueDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} · ${d.toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit" }
  )}`;
}

function formatFileSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

const statusStyle: Record<AssignmentStatus, { badge: string; icon: typeof Clock; label: string }> = {
  upcoming: { badge: cx.accentChip, icon: Clock, label: "Upcoming" },
  submitted: { badge: "bg-[#9277ff]/10 text-[#9277ff]", icon: Upload, label: "Submitted" },
  "late-submitted": { badge: "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)]", icon: Upload, label: "Late submitted" },
  graded: { badge: cx.successChip, icon: CheckCircle2, label: "Graded" },
  overdue: { badge: cx.dangerChip, icon: AlertCircle, label: "Overdue" },
};

const dueSortValue = (a: Assignment) => new Date(a.dueDate).getTime();

// =====================================================================
// STAT CARD
// =====================================================================

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
  loading,
}: {
  label: string;
  value: number;
  sub: string;
  icon: typeof Clock;
  tone: "accent" | "success" | "danger" | "neutral";
  loading: boolean;
}) {
  const toneClass =
    tone === "accent" ? cx.accentChip : tone === "success" ? cx.successChip : tone === "danger" ? cx.dangerChip : cx.cardAlt;

  if (loading) {
    return (
      <div className={`${cx.card} p-4 animate-pulse`}>
        <div className={`w-9 h-9 rounded-xl mb-4 ${cx.cardAlt}`} />
        <div className={`h-6 w-10 rounded mb-2 ${cx.cardAlt}`} />
        <div className={`h-3 w-24 rounded ${cx.cardAlt}`} />
      </div>
    );
  }

  return (
    <div className={`${cx.card} p-4`}>
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${toneClass}`}>
        <Icon className="w-[18px] h-[18px]" />
      </span>
      <div className={`text-2xl font-display font-semibold tracking-tight ${cx.textPrimary}`}>{value}</div>
      <div className={`text-xs mt-1 ${cx.textSecondary}`}>{sub}</div>
    </div>
  );
}

// =====================================================================
// ASSIGNMENT CARD
// =====================================================================

function AssignmentMenu({
  assignment,
  onView,
  onSubmit,
}: {
  assignment: Assignment;
  onView: () => void;
  onSubmit: () => void;
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
        className={`p-1 transition-colors ${cx.textTertiary} hover:text-[var(--color-text-primary)]`}
        aria-label="Assignment actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1.5 w-44 rounded-xl border py-1.5 z-30 ${cx.dropdown}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onView();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
          >
            <Eye className="w-3.5 h-3.5" />
            View details
          </button>
          {(assignment.status === "upcoming" || assignment.status === "overdue") && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onSubmit();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Submit work
            </button>
          )}
          {assignment.status === "graded" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onView();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
            >
              <FileText className="w-3.5 h-3.5" />
              View feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function AssignmentCard({
  assignment,
  selected,
  view,
  onSelect,
  onSubmitClick,
}: {
  assignment: Assignment;
  selected: boolean;
  view: "list" | "grid";
  onSelect: () => void;
  onSubmitClick: () => void;
}) {
  const style = statusStyle[assignment.status];
  const StatusIcon = style.icon;
  const isOverdue = assignment.status === "overdue";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className={`rounded-2xl border p-4 sm:p-5 cursor-pointer transition-colors ${
        isOverdue ? "border-[var(--color-accent-danger)]/25 bg-[var(--color-accent-danger)]/[0.03]" : cx.border
      } ${
        selected
          ? "border-[var(--color-accent-primary)]/50 bg-[var(--color-accent-primary)]/[0.04]"
          : "bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: assignment.courseColor }} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="min-w-0">
              <div className={`text-xs font-mono ${cx.textSecondary}`}>{assignment.courseCode}</div>
              <h3 className={`text-sm font-medium truncate mt-0.5 ${cx.textPrimary}`}>{assignment.title}</h3>
            </div>
            <AssignmentMenu assignment={assignment} onView={onSelect} onSubmit={onSubmitClick} />
          </div>

          <p className={`text-xs mb-3 line-clamp-1 ${cx.textSecondary}`}>{assignment.description}</p>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
              <StatusIcon className="w-2.5 h-2.5" />
              {style.label}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cx.cardAlt} ${cx.textTertiary}`}>
              {assignment.type}
            </span>
            <span className={`text-xs font-medium ${isOverdue ? cx.danger : cx.textSecondary}`}>
              {formatDueLabel(assignment)}
            </span>
            <span className={`text-xs ${cx.textTertiary}`}>{assignment.points} pts</span>
            {assignment.attachments.length > 0 && (
              <span className={`inline-flex items-center gap-1 text-xs ${cx.textTertiary}`}>
                <Paperclip className="w-3 h-3" />
                {assignment.attachments.length}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 ml-2 hidden sm:flex items-center">
          {assignment.status === "graded" ? (
            <span className={`text-sm font-semibold ${cx.success}`}>
              {assignment.grade}/{assignment.points}
            </span>
          ) : assignment.status === "upcoming" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSubmitClick();
              }}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${cx.accentBtn}`}
            >
              Submit
            </button>
          ) : assignment.status === "overdue" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSubmitClick();
              }}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${cx.dangerChip} hover:opacity-80`}
            >
              Overdue
            </button>
          ) : (
            <span className={`text-xs font-medium px-3.5 py-1.5 rounded-full ${cx.cardAlt} ${cx.textSecondary}`}>
              Submitted
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =====================================================================
// EMPTY / SKELETON STATES
// =====================================================================

function EmptyState({ icon: Icon, title, subtitle }: { icon: typeof Inbox; title: string; subtitle: string }) {
  return (
    <div className={`${cx.card} py-16 flex flex-col items-center justify-center text-center px-6`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cx.cardAlt}`}>
        <Icon className={`w-5 h-5 ${cx.textTertiary}`} />
      </div>
      <p className={`text-sm font-medium ${cx.textPrimary}`}>{title}</p>
      <p className={`text-xs mt-1 max-w-xs ${cx.textSecondary}`}>{subtitle}</p>
    </div>
  );
}

function AssignmentCardSkeleton() {
  return (
    <div className={`${cx.card} p-4 sm:p-5 animate-pulse`}>
      <div className="flex items-start gap-3">
        <div className={`w-1 self-stretch rounded-full shrink-0 ${cx.cardAlt}`} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className={`h-2.5 w-14 rounded ${cx.cardAlt}`} />
          <div className={`h-4 w-56 rounded ${cx.cardAlt}`} />
          <div className={`h-2.5 w-full max-w-xs rounded ${cx.cardAlt}`} />
          <div className="flex gap-2 pt-1">
            <div className={`h-5 w-16 rounded-full ${cx.cardAlt}`} />
            <div className={`h-5 w-20 rounded-full ${cx.cardAlt}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SUBMISSION DIALOG
// =====================================================================

function AssignmentSubmissionDialog({
  assignment,
  onClose,
  onSubmitted,
}: {
  assignment: Assignment | null;
  onClose: () => void;
  onSubmitted: (id: string, files: { name: string; sizeKB: number }[], comments: string) => void;
}) {
  const [files, setFiles] = useState<{ name: string; sizeKB: number }[]>([]);
  const [comments, setComments] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!assignment) {
      setFiles([]);
      setComments("");
      setFileError(null);
    }
  }, [assignment]);

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || !assignment) return;
      setFileError(null);
      const incoming = Array.from(fileList);

      for (const f of incoming) {
        const ext = f.name.split(".").pop()?.toUpperCase() ?? "";
        if (assignment.allowedFileTypes.length > 0 && !assignment.allowedFileTypes.includes(ext)) {
          setFileError(`${f.name}: only ${assignment.allowedFileTypes.join(", ")} files are allowed.`);
          return;
        }
        const sizeMB = f.size / (1024 * 1024);
        if (assignment.maxFileSizeMB > 0 && sizeMB > assignment.maxFileSizeMB) {
          setFileError(`${f.name} exceeds the ${assignment.maxFileSizeMB} MB limit.`);
          return;
        }
      }

      setFiles((prev) => [...prev, ...incoming.map((f) => ({ name: f.name, sizeKB: Math.round(f.size / 1024) }))]);
    },
    [assignment]
  );

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  function handleSubmit() {
    if (!assignment) return;
    if (assignment.submissionType === "file" && files.length === 0) {
      setFileError("Add at least one file before submitting.");
      return;
    }
    onSubmitted(assignment.id, files, comments);
  }

  return (
    <AnimatePresence>
      {assignment && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={`w-full max-w-md rounded-2xl border shadow-[var(--shadow-lifted)] max-h-[90vh] overflow-y-auto bg-[var(--color-surface)] ${cx.border}`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="submit-assignment-title"
            >
              <div className={`flex items-center justify-between px-5 py-4 border-b ${cx.border}`}>
                <h2 id="submit-assignment-title" className={`font-display text-base font-semibold ${cx.textPrimary}`}>
                  Submit Assignment
                </h2>
                <button
                  onClick={onClose}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${cx.textTertiary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className={`text-sm font-medium ${cx.textPrimary}`}>{assignment.title}</div>
                  <div className={`text-xs mt-0.5 ${cx.textSecondary}`}>
                    {assignment.courseCode} · {assignment.courseName}
                  </div>
                </div>

                {assignment.submissionType === "file" && (
                  <>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        addFiles(e.dataTransfer.files);
                      }}
                      className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                        dragActive ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/5" : cx.borderStrong
                      }`}
                    >
                      <UploadCloud className={`w-6 h-6 mx-auto mb-2 ${cx.textTertiary}`} />
                      <p className={`text-xs ${cx.textSecondary}`}>Drag files here</p>
                      <p className={`text-[11px] my-1 ${cx.textTertiary}`}>or</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${cx.ghostBtn}`}
                      >
                        Choose Files
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        aria-label="Choose files to submit"
                        onChange={(e) => addFiles(e.target.files)}
                      />
                      {assignment.allowedFileTypes.length > 0 && (
                        <p className={`text-[10px] mt-3 ${cx.textTertiary}`}>
                          Allowed: {assignment.allowedFileTypes.join(", ")} · Max {assignment.maxFileSizeMB} MB
                        </p>
                      )}
                    </div>

                    {fileError && <p className={`text-[11px] ${cx.danger}`}>{fileError}</p>}

                    {files.length > 0 && (
                      <div className="space-y-1.5">
                        <div className={`text-[11px] font-medium ${cx.textSecondary}`}>Selected Files</div>
                        {files.map((f) => (
                          <div key={f.name} className={`flex items-center justify-between rounded-lg px-3 py-2 ${cx.cardAlt}`}>
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className={`w-3.5 h-3.5 shrink-0 ${cx.textTertiary}`} />
                              <span className={`text-xs truncate ${cx.textPrimary}`}>{f.name}</span>
                              <span className={`text-[10px] shrink-0 ${cx.textTertiary}`}>{formatFileSize(f.sizeKB)}</span>
                            </div>
                            <button
                              onClick={() => removeFile(f.name)}
                              aria-label={`Remove ${f.name}`}
                              className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${cx.textTertiary} hover:text-[var(--color-accent-danger)]`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {assignment.submissionType === "link" && (
                  <div>
                    <label htmlFor="submission-link" className={`text-[11px] font-medium mb-1.5 block ${cx.textSecondary}`}>
                      Submission link
                    </label>
                    <input
                      id="submission-link"
                      type="url"
                      placeholder="https://github.com/your-repo"
                      onChange={(e) => setFiles(e.target.value ? [{ name: e.target.value, sizeKB: 0 }] : [])}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50 transition-colors bg-[var(--color-surface-alt)] ${cx.border} ${cx.textPrimary}`}
                    />
                  </div>
                )}

                {assignment.submissionType === "text" && (
                  <div>
                    <label htmlFor="submission-text" className={`text-[11px] font-medium mb-1.5 block ${cx.textSecondary}`}>
                      Your response
                    </label>
                    <textarea
                      id="submission-text"
                      rows={5}
                      onChange={(e) => setFiles(e.target.value ? [{ name: "Text response", sizeKB: 0 }] : [])}
                      placeholder="Write your response here..."
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50 transition-colors resize-none bg-[var(--color-surface-alt)] ${cx.border} ${cx.textPrimary}`}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="submission-comments" className={`text-[11px] font-medium mb-1.5 block ${cx.textSecondary}`}>
                    Comments (optional)
                  </label>
                  <textarea
                    id="submission-comments"
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Optional comments..."
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50 transition-colors resize-none bg-[var(--color-surface-alt)] ${cx.border} ${cx.textPrimary}`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={onClose}
                    className={`flex-1 rounded-full text-sm font-medium px-4 py-2.5 transition-colors ${cx.ghostBtn}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`flex-1 rounded-full text-sm font-medium px-4 py-2.5 transition-colors ${cx.accentBtn}`}
                  >
                    Submit Assignment
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// =====================================================================
// ASSIGNMENT DETAILS PANEL
// =====================================================================

type DetailsTab = "details" | "instructions" | "submission";

function AssignmentDetails({
  assignment,
  onClose,
  onSubmitClick,
}: {
  assignment: Assignment | null;
  onClose: () => void;
  onSubmitClick: () => void;
}) {
  const [tab, setTab] = useState<DetailsTab>("details");

  useEffect(() => {
    setTab("details");
  }, [assignment?.id]);

  if (!assignment) {
    return (
      <div className={`hidden lg:flex ${cx.card} p-8 h-full items-center justify-center text-center`}>
        <div>
          <Info className={`w-6 h-6 mx-auto mb-2 ${cx.textTertiary}`} />
          <p className={`text-xs ${cx.textTertiary}`}>Select an assignment to view details.</p>
        </div>
      </div>
    );
  }

  const style = statusStyle[assignment.status];

  return (
    <div className={`${cx.card} overflow-hidden flex flex-col h-full`}>
      <div className={`px-5 py-4 border-b ${cx.border}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h2 className={`font-display text-base font-semibold truncate ${cx.textPrimary}`}>{assignment.title}</h2>
            <p className={`text-xs mt-0.5 ${cx.textSecondary}`}>
              {assignment.courseCode} · {assignment.courseName}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors lg:hidden ${cx.textTertiary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
          {assignment.type}
        </span>
      </div>

      <div className={`flex items-center gap-1 px-3 pt-3 border-b ${cx.border}`}>
        {(
          [
            { id: "details" as const, label: "Details" },
            { id: "instructions" as const, label: "Instructions" },
            { id: "submission" as const, label: "Submissions" },
          ]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-3 py-2 text-xs font-medium transition-colors ${
              tab === t.id ? cx.textPrimary : `${cx.textTertiary} hover:text-[var(--color-text-secondary)]`
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="assignment-detail-tab"
                className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-[var(--color-accent-primary)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-5 overflow-y-auto flex-1">
        {tab === "details" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: CalendarClock, label: "Due Date", value: formatFullDueDate(assignment.dueDate) },
                { icon: Sparkles, label: "Points", value: `${assignment.points} Points` },
                { icon: FileText, label: "Type", value: assignment.type },
                { icon: ClipboardCheck, label: "Status", value: statusStyle[assignment.status].label },
                {
                  icon: Upload,
                  label: "Submission Type",
                  value:
                    assignment.submissionType === "file" ? "File Upload" : assignment.submissionType === "link" ? "Link" : "Text response",
                },
                ...(assignment.allowedFileTypes.length > 0
                  ? [{ icon: Paperclip, label: "Allowed File Types", value: assignment.allowedFileTypes.join(", ") }]
                  : []),
                ...(assignment.maxFileSizeMB > 0
                  ? [{ icon: Info, label: "Maximum File Size", value: `${assignment.maxFileSizeMB} MB` }]
                  : []),
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-start gap-2.5">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cx.accentChip}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className={`text-[10px] ${cx.textTertiary}`}>{f.label}</div>
                      <div className={`text-xs mt-0.5 ${cx.textPrimary}`}>{f.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {assignment.attachments.length > 0 && (
              <div>
                <div className={`text-xs font-medium mb-2 ${cx.textSecondary}`}>Attachments</div>
                <div className="space-y-1.5">
                  {assignment.attachments.map((att) => (
                    <div key={att.id} className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${cx.cardAlt}`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${cx.textTertiary}`} />
                        <div className="min-w-0">
                          <div className={`text-xs truncate ${cx.textPrimary}`}>{att.name}</div>
                          <div className={`text-[10px] ${cx.textTertiary}`}>{formatFileSize(att.sizeKB)}</div>
                        </div>
                      </div>
                      <button
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${cx.textSecondary} hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10`}
                        aria-label={`Download ${att.name}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "instructions" && (
          <p className={`text-sm leading-relaxed whitespace-pre-line ${cx.textSecondary}`}>{assignment.instructions}</p>
        )}

        {tab === "submission" && (
          <div className="space-y-4">
            {assignment.status === "upcoming" && (
              <p className={`text-xs ${cx.textTertiary}`}>You haven't submitted this assignment yet.</p>
            )}

            {(assignment.status === "submitted" || assignment.status === "late-submitted") && (
              <div className={`rounded-xl px-3.5 py-3 ${cx.cardAlt}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${cx.success}`} />
                  <span className={`text-xs font-medium ${cx.textPrimary}`}>
                    {assignment.status === "late-submitted" ? "Submitted late" : "Submitted"}
                  </span>
                </div>
                {assignment.submittedAt && (
                  <p className={`text-[11px] ${cx.textTertiary}`}>{formatFullDueDate(assignment.submittedAt)}</p>
                )}
                {assignment.submittedFiles?.map((f) => (
                  <div key={f.name} className={`flex items-center gap-2 mt-2 text-xs ${cx.textSecondary}`}>
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </div>
                ))}
              </div>
            )}

            {assignment.status === "graded" && (
              <div className="space-y-3">
                <div className={`rounded-xl px-4 py-4 ${cx.successChip}`}>
                  <div className="text-[11px] font-medium opacity-80 mb-1">Grade</div>
                  <div className="text-2xl font-display font-semibold">
                    {assignment.grade} / {assignment.points}
                  </div>
                  <div className="text-xs mt-0.5 opacity-80">{assignment.gradePercent}%</div>
                </div>
                {assignment.feedback && (
                  <div>
                    <div className={`text-xs font-medium mb-1.5 ${cx.textSecondary}`}>Feedback</div>
                    <p className={`text-sm leading-relaxed ${cx.textSecondary}`}>{assignment.feedback}</p>
                  </div>
                )}
              </div>
            )}

            {assignment.status === "overdue" && (
              <div className={`rounded-xl px-3.5 py-3 ${cx.dangerChip}`}>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatDueLabel(assignment)}</span>
                </div>
                <p className="text-[11px] mt-1 opacity-80">Late submissions may still be accepted — submit as soon as possible.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {(assignment.status === "upcoming" || assignment.status === "overdue") && (
        <div className={`p-4 border-t ${cx.border}`}>
          <button
            onClick={onSubmitClick}
            className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium px-4 py-2.5 transition-colors ${cx.accentBtn}`}
          >
            <Upload className="w-4 h-4" />
            Submit Assignment
          </button>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// MAIN PAGE
// =====================================================================

type MainTab = "all" | "submitted" | "graded" | "overdue";
type SortKey = "due" | "course" | "status";
type ViewMode = "list" | "grid";

const mainTabs: { value: MainTab; label: string }[] = [
  { value: "all", label: "All Assignments" },
  { value: "submitted", label: "Submitted" },
  { value: "graded", label: "Graded" },
  { value: "overdue", label: "Overdue" },
];

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Due date", value: "due" },
  { label: "Course", value: "course" },
  { label: "Status", value: "status" },
];

export default function Assignments() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [mainTab, setMainTab] = useState<MainTab>("all");
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [sortKey, setSortKey] = useState<SortKey>("due");
  const [view, setView] = useState<ViewMode>("list");

  const [courseOpen, setCourseOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const courseRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitTarget, setSubmitTarget] = useState<Assignment | null>(null);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  // Simulated fetch — swap for GET /api/assignments.
  useEffect(() => {
    const timer = setTimeout(() => {
      setAssignments(MOCK_ASSIGNMENTS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (courseRef.current && !courseRef.current.contains(e.target as Node)) setCourseOpen(false);
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const courseNames = useMemo(
    () => ["All courses", ...Array.from(new Set(assignments.map((a) => `${a.courseCode} · ${a.courseName}`)))],
    [assignments]
  );
  const typeNames = useMemo(
    () => ["All types", ...Array.from(new Set(assignments.map((a) => a.type)))],
    [assignments]
  );

  const counts = useMemo(
    () => ({
      upcoming: assignments.filter((a) => a.status === "upcoming").length,
      submitted: assignments.filter((a) => a.status === "submitted" || a.status === "late-submitted" || a.status === "graded").length,
      toReview: assignments.filter((a) => a.status === "submitted" || a.status === "late-submitted").length,
      overdue: assignments.filter((a) => a.status === "overdue").length,
    }),
    [assignments]
  );

  const baseFiltered = useMemo(() => {
    return assignments.filter((a) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || a.title.toLowerCase().includes(q) || a.courseName.toLowerCase().includes(q) || a.courseCode.toLowerCase().includes(q);
      const matchesCourse = courseFilter === "All courses" || `${a.courseCode} · ${a.courseName}` === courseFilter;
      const matchesType = typeFilter === "All types" || a.type === typeFilter;
      return matchesQuery && matchesCourse && matchesType;
    });
  }, [assignments, query, courseFilter, typeFilter]);

  function sortList(list: Assignment[]): Assignment[] {
    return [...list].sort((a, b) => {
      switch (sortKey) {
        case "course":
          return a.courseCode.localeCompare(b.courseCode);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return dueSortValue(a) - dueSortValue(b);
      }
    });
  }

  const tabFiltered = useMemo(() => {
    if (mainTab === "all") return baseFiltered;
    if (mainTab === "submitted") return baseFiltered.filter((a) => a.status === "submitted" || a.status === "late-submitted");
    if (mainTab === "graded") return baseFiltered.filter((a) => a.status === "graded");
    return baseFiltered.filter((a) => a.status === "overdue");
  }, [baseFiltered, mainTab]);

  const sortedFlat = useMemo(() => sortList(tabFiltered), [tabFiltered, sortKey]);

  const grouped = useMemo(() => {
    if (mainTab !== "all") return null;
    return {
      overdue: sortList(baseFiltered.filter((a) => a.status === "overdue")),
      upcoming: sortList(baseFiltered.filter((a) => a.status === "upcoming")),
      submitted: sortList(baseFiltered.filter((a) => a.status === "submitted" || a.status === "late-submitted")),
      graded: sortList(baseFiltered.filter((a) => a.status === "graded")),
    };
  }, [baseFiltered, mainTab, sortKey]);

  const selectedAssignment = assignments.find((a) => a.id === selectedId) ?? null;

  function selectAssignment(a: Assignment) {
    setSelectedId(a.id);
    setMobileDetailsOpen(true);
  }

  function handleSubmitted(id: string, files: { name: string; sizeKB: number }[], _comments: string) {
    // TODO: once POST /api/assignments/:id/submissions exists, call it here
    // with { files, comments } and use the server response instead of this
    // optimistic local update.
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: new Date(a.dueDate) < new Date() ? "late-submitted" : "submitted",
              submittedAt: new Date().toISOString(),
              submittedFiles: files.length > 0 ? files : a.submittedFiles,
            }
          : a
      )
    );
    setSubmitTarget(null);
  }

  const hasActiveFilters = query.trim().length > 0 || courseFilter !== "All courses" || typeFilter !== "All types";

  function renderList(list: Assignment[]) {
    if (loading) {
      return (
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-2.5"}>
          {Array.from({ length: 4 }).map((_, i) => (
            <AssignmentCardSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (list.length === 0) return null;
    return (
      <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-2.5"}>
        {list.map((a) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            selected={a.id === selectedId}
            view={view}
            onSelect={() => selectAssignment(a)}
            onSubmitClick={() => setSubmitTarget(a)}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h1 className={`font-display text-2xl font-semibold tracking-tight ${cx.textPrimary}`}>Assignments</h1>
          <p className={`text-sm mt-1 ${cx.textSecondary}`}>Manage your coursework, deadlines, submissions, and grades.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {mainTabs.map((t) => {
          const active = mainTab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setMainTab(t.value)}
              className={`relative shrink-0 text-xs font-medium px-3.5 py-2 rounded-full transition-colors ${
                active ? cx.textPrimary : `${cx.textSecondary} hover:text-[var(--color-text-primary)]`
              }`}
            >
              {active && (
                <motion.span
                  layoutId="assignment-main-tab"
                  className="absolute inset-0 rounded-full bg-[var(--color-accent-primary)]/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Upcoming" value={counts.upcoming} sub="Due this week" icon={Clock} tone="accent" loading={loading} />
        <StatCard label="Submitted" value={counts.submitted} sub="Total submitted" icon={Upload} tone="neutral" loading={loading} />
        <StatCard label="To Review" value={counts.toReview} sub="Awaiting feedback" icon={ClipboardCheck} tone="neutral" loading={loading} />
        <StatCard label="Overdue" value={counts.overdue} sub="Past due" icon={AlertCircle} tone="danger" loading={loading} />
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className={`flex items-center gap-2 rounded-full px-3.5 py-2 flex-1 max-w-sm border bg-[var(--color-surface-alt)] ${cx.border}`}>
          <Search className={`w-4 h-4 shrink-0 ${cx.textTertiary}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments..."
            className={`bg-transparent text-sm focus:outline-none w-full ${cx.textPrimary} placeholder:text-[var(--color-text-tertiary)]`}
            aria-label="Search assignments"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 md:ml-auto">
          <div className="relative" ref={courseRef}>
            <button
              onClick={() => setCourseOpen((o) => !o)}
              className={`inline-flex items-center gap-1.5 text-xs rounded-full px-3.5 py-2 border transition-colors max-w-[170px] ${cx.textSecondary} hover:text-[var(--color-text-primary)] ${cx.border}`}
            >
              <span className="truncate">{courseFilter}</span>
              <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${courseOpen ? "rotate-180" : ""}`} />
            </button>
            {courseOpen && (
              <div className={`absolute right-0 top-full mt-1.5 w-56 rounded-xl border py-1.5 z-30 max-h-72 overflow-y-auto ${cx.dropdown}`}>
                {courseNames.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCourseFilter(c);
                      setCourseOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm truncate transition-colors ${
                      c === courseFilter ? "text-[var(--color-accent-primary)]" : `${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={typeRef}>
            <button
              onClick={() => setTypeOpen((o) => !o)}
              className={`inline-flex items-center gap-1.5 text-xs rounded-full px-3.5 py-2 border transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] ${cx.border}`}
            >
              <span className="truncate">{typeFilter}</span>
              <ChevronDown className={`w-3 h-3 shrink-0 transition-transform ${typeOpen ? "rotate-180" : ""}`} />
            </button>
            {typeOpen && (
              <div className={`absolute right-0 top-full mt-1.5 w-40 rounded-xl border py-1.5 z-30 ${cx.dropdown}`}>
                {typeNames.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTypeFilter(t);
                      setTypeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm truncate transition-colors ${
                      t === typeFilter ? "text-[var(--color-accent-primary)]" : `${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((o) => !o)}
              className={`inline-flex items-center gap-1.5 text-xs rounded-full px-3.5 py-2 border transition-colors ${cx.textSecondary} hover:text-[var(--color-text-primary)] ${cx.border}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort by {sortOptions.find((s) => s.value === sortKey)?.label}
              <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className={`absolute right-0 top-full mt-1.5 w-40 rounded-xl border py-1.5 z-30 ${cx.dropdown}`}>
                {sortOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      setSortKey(s.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      s.value === sortKey ? "text-[var(--color-accent-primary)]" : `${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`flex items-center gap-0.5 rounded-full p-0.5 border shrink-0 ${cx.border}`}>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                view === "list" ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]" : `${cx.textSecondary} hover:text-[var(--color-text-primary)]`
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                view === "grid" ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]" : `${cx.textSecondary} hover:text-[var(--color-text-primary)]`
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content: list (+ grouped sections) / details split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          {!loading && tabFiltered.length === 0 ? (
            hasActiveFilters ? (
              <EmptyState icon={SearchX} title="No assignments found" subtitle="Try changing your search or filters." />
            ) : mainTab === "overdue" ? (
              <EmptyState icon={PartyPopper} title="No overdue assignments" subtitle="Nice work — you're on track." />
            ) : (
              <EmptyState icon={Inbox} title="No assignments yet" subtitle="You're all caught up." />
            )
          ) : mainTab === "all" && grouped ? (
            <div className="space-y-6">
              {grouped.overdue.length > 0 && (
                <div>
                  <h2 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${cx.danger}`}>Overdue Assignments</h2>
                  {renderList(grouped.overdue)}
                </div>
              )}
              {grouped.upcoming.length > 0 && (
                <div>
                  <h2 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${cx.textSecondary}`}>Upcoming Assignments</h2>
                  {renderList(grouped.upcoming)}
                </div>
              )}
              {grouped.submitted.length > 0 && (
                <div>
                  <h2 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${cx.textSecondary}`}>Submitted</h2>
                  {renderList(grouped.submitted)}
                </div>
              )}
              {grouped.graded.length > 0 && (
                <div>
                  <h2 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${cx.textSecondary}`}>Graded</h2>
                  {renderList(grouped.graded)}
                </div>
              )}
            </div>
          ) : (
            renderList(sortedFlat)
          )}
        </div>

        {/* Desktop details panel */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6 h-[calc(100vh-8rem)]">
            <AssignmentDetails
              assignment={selectedAssignment}
              onClose={() => setSelectedId(null)}
              onSubmitClick={() => selectedAssignment && setSubmitTarget(selectedAssignment)}
            />
          </div>
        </div>
      </div>

      {/* Mobile details sheet */}
      <AnimatePresence>
        {mobileDetailsOpen && selectedAssignment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileDetailsOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-0 top-16 z-50 lg:hidden"
            >
              <AssignmentDetails
                assignment={selectedAssignment}
                onClose={() => setMobileDetailsOpen(false)}
                onSubmitClick={() => setSubmitTarget(selectedAssignment)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AssignmentSubmissionDialog assignment={submitTarget} onClose={() => setSubmitTarget(null)} onSubmitted={handleSubmitted} />
    </motion.div>
  );
}