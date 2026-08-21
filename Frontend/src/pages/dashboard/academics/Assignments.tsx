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
  UploadCloud,
  Download,
  Info,
  ClipboardCheck,
  CalendarClock,
  Sparkles,
  Inbox,
  SearchX,
  PartyPopper,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAssignments,
  fetchAssignmentDetails,
  createSubmission,
  updateSubmission,
  clearCurrentAssignment,
  clearSubmitError,
  selectAssignmentList,
  selectAssignmentPagination,
  selectAssignmentListStatus,
  selectCurrentAssignment,
  selectCurrentAssignmentStatus,
  selectSubmitStatus,
  selectSubmitError,
  type AssignmentListItem,
  type AssignmentDetails as AssignmentDetailsDTO,
  type AssignmentStatus,
  type AssignmentFilters,
  type SubmissionInput,
} from "@/store/features/assignments/assignmentSlice";

// =====================================================================
// DESIGN TOKENS — unchanged, same var(--color-*) system used across Vexez
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
// HELPERS
// =====================================================================

// API doesn't return a per-course color — derive a stable one from courseId
// purely for the left accent bar. Not academic data, safe to compute client-side.
const COURSE_COLOR_PALETTE = ["#1EC2BC", "#E7714A", "#9277ff", "#65e6f4", "#60a5fa", "#f472b6", "#c084fc", "#fb7185", "#8ce9bd", "#e6b873"];
function courseColor(courseId: number): string {
  return COURSE_COLOR_PALETTE[courseId % COURSE_COLOR_PALETTE.length];
}

function formatDueLabel(a: AssignmentListItem): string {
  const due = new Date(a.dueDate);
  const diffDays = Math.round((due.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (a.status === "GRADED") return "Graded";
  if (a.status === "SUBMITTED" || a.status === "LATE") {
    return a.status === "LATE" ? "Submitted late" : "Submitted";
  }
  if (a.status === "OVERDUE") {
    const overdueDays = Math.abs(diffDays);
    return `${overdueDays} day${overdueDays !== 1 ? "s" : ""} overdue`;
  }
  if (diffDays <= 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays} days`;
}

function formatFullDueDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} · ${d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function formatFileSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}

const statusStyle: Record<AssignmentStatus, { badge: string; icon: typeof Clock; label: string }> = {
  UPCOMING: { badge: cx.accentChip, icon: Clock, label: "Upcoming" },
  SUBMITTED: { badge: "bg-[#9277ff]/10 text-[#9277ff]", icon: Upload, label: "Submitted" },
  LATE: { badge: "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)]", icon: Upload, label: "Late" },
  GRADED: { badge: cx.successChip, icon: CheckCircle2, label: "Graded" },
  OVERDUE: { badge: cx.dangerChip, icon: AlertCircle, label: "Overdue" },
};

// ---- Backend-supported options only (see AssignmentFilters/sortBy contract) ----
const mainTabs: { value: AssignmentStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Assignments" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "GRADED", label: "Graded" },
  { value: "OVERDUE", label: "Overdue" },
];

const sortOptions: { label: string; value: NonNullable<AssignmentFilters["sortBy"]> }[] = [
  { label: "Due date", value: "dueDate" },
  { label: "Points", value: "points" },
  { label: "Date created", value: "createdAt" },
];

const PAGE_SIZE = 12;

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
  value: number | string;
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
  status,
  onView,
  onSubmit,
}: {
  status: AssignmentStatus;
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
          {(status === "UPCOMING" || status === "OVERDUE") && (
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
          {status === "GRADED" && (
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
  onSelect,
  onSubmitClick,
}: {
  assignment: AssignmentListItem;
  selected: boolean;
  onSelect: () => void;
  onSubmitClick: () => void;
}) {
  const style = statusStyle[assignment.status];
  const StatusIcon = style.icon;
  const isOverdue = assignment.status === "OVERDUE";

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
        <span className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: courseColor(assignment.courseOfferingId) }} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="min-w-0">
              <div className={`text-xs font-mono ${cx.textSecondary}`}>{assignment.courseCode}</div>
              <h3 className={`text-sm font-medium truncate mt-0.5 ${cx.textPrimary}`}>{assignment.title}</h3>
            </div>
            <AssignmentMenu status={assignment.status} onView={onSelect} onSubmit={onSubmitClick} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
              <StatusIcon className="w-2.5 h-2.5" />
              {style.label}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cx.cardAlt} ${cx.textTertiary}`}>{assignment.type}</span>
            <span className={`text-xs font-medium ${isOverdue ? cx.danger : cx.textSecondary}`}>{formatDueLabel(assignment)}</span>
            <span className={`text-xs ${cx.textTertiary}`}>{assignment.points} pts</span>
          </div>
        </div>

        <div className="shrink-0 ml-2 hidden sm:flex items-center">
          {assignment.status === "GRADED" ? (
            <span className={`text-sm font-semibold ${cx.success}`}>View grade</span>
          ) : assignment.status === "UPCOMING" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSubmitClick();
              }}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors ${cx.accentBtn}`}
            >
              Submit
            </button>
          ) : assignment.status === "OVERDUE" ? (
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
            <span className={`text-xs font-medium px-3.5 py-1.5 rounded-full ${cx.cardAlt} ${cx.textSecondary}`}>Submitted</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =====================================================================
// EMPTY / SKELETON / ERROR STATES
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

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={`${cx.card} py-16 flex flex-col items-center justify-center text-center px-6`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cx.dangerChip}`}>
        <AlertCircle className="w-5 h-5" />
      </div>
      <p className={`text-sm font-medium ${cx.textPrimary}`}>Unable to load assignments</p>
      <p className={`text-xs mt-1 ${cx.textSecondary}`}>We couldn't retrieve your assignments.</p>
      <button onClick={onRetry} className={`mt-4 text-xs font-medium px-4 py-2 rounded-full transition-colors ${cx.accentChip}`}>
        Try Again
      </button>
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
// SUBMISSION DIALOG — reads submissionType/allowedFileTypes/maxFileSizeMb
// from AssignmentDetails (only available once details have been fetched).
// =====================================================================

function AssignmentSubmissionDialog({
  assignment,
  loading,
  hasExistingSubmission,
  submitStatus,
  submitError,
  onClose,
  onSubmit,
}: {
  assignment: AssignmentDetailsDTO | null;
  loading: boolean;
  hasExistingSubmission: boolean;
  submitStatus: "idle" | "loading" | "succeeded" | "failed";
  submitError: string | null;
  onClose: () => void;
  onSubmit: (input: SubmissionInput) => void;
}) {
  const [textContent, setTextContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState<{ fileName: string; fileType: string; fileSize: number }[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!assignment) {
      setTextContent("");
      setLinkUrl("");
      setComments("");
      setFiles([]);
      setFileError(null);
    }
  }, [assignment]);

  const submissionType = assignment?.submissionType?.toLowerCase();

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || !assignment) return;
      setFileError(null);
      const incoming = Array.from(fileList);

      for (const f of incoming) {
        const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
        const allowed = assignment.allowedFileTypes.map((t) => t.toLowerCase());
        if (allowed.length > 0 && !allowed.includes(ext)) {
          setFileError(`${f.name}: only ${assignment.allowedFileTypes.join(", ")} files are allowed.`);
          return;
        }
        const sizeMB = f.size / (1024 * 1024);
        if (assignment.maxFileSizeMb > 0 && sizeMB > assignment.maxFileSizeMb) {
          setFileError(`${f.name} exceeds the ${assignment.maxFileSizeMb} MB limit.`);
          return;
        }
      }

      setFiles((prev) => [
        ...prev,
        ...incoming.map((f) => ({
          fileName: f.name,
          fileType: f.type || f.name.split(".").pop() || "",
          fileSize: f.size,
        })),
      ]);
    },
    [assignment]
  );

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.fileName !== name));
  }

  function handleSubmitClick() {
    if (!assignment) return;
    if (submissionType === "file" && files.length === 0) {
      setFileError("Add at least one file before submitting.");
      return;
    }
    if (submissionType === "link" && !linkUrl.trim()) {
      setFileError("Add a submission link before submitting.");
      return;
    }
    if (submissionType === "text" && !textContent.trim()) {
      setFileError("Write a response before submitting.");
      return;
    }

    const input: SubmissionInput = {
      ...(submissionType === "text" ? { textContent } : {}),
      ...(submissionType === "link" ? { linkUrl } : {}),
      ...(comments ? { comments } : {}),
      ...(submissionType === "file" && files.length > 0 ? { file: files[0] } : {}),
    };
    onSubmit(input);
  }

  return (
    <AnimatePresence>
      {assignment !== null || loading ? (
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
                  {hasExistingSubmission ? "Update Submission" : "Submit Assignment"}
                </h2>
                <button
                  onClick={onClose}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${cx.textTertiary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {loading || !assignment ? (
                <div className="p-5 space-y-3">
                  <div className={`h-4 w-40 rounded animate-pulse ${cx.cardAlt}`} />
                  <div className={`h-24 w-full rounded-xl animate-pulse ${cx.cardAlt}`} />
                  <div className={`h-10 w-full rounded-xl animate-pulse ${cx.cardAlt}`} />
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  <div>
                    <div className={`text-sm font-medium ${cx.textPrimary}`}>{assignment.title}</div>
                    <div className={`text-xs mt-0.5 ${cx.textSecondary}`}>
                      {assignment.courseCode} · {assignment.courseName}
                    </div>
                  </div>

                  {submissionType === "file" && (
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
                          className="hidden"
                          aria-label="Choose a file to submit"
                          onChange={(e) => addFiles(e.target.files)}
                        />
                        {assignment.allowedFileTypes.length > 0 && (
                          <p className={`text-[10px] mt-3 ${cx.textTertiary}`}>
                            Allowed: {assignment.allowedFileTypes.join(", ")} · Max {assignment.maxFileSizeMb} MB
                          </p>
                        )}
                      </div>

                      {files.length > 0 && (
                        <div className="space-y-1.5">
                          {files.map((f) => (
                            <div key={f.fileName} className={`flex items-center justify-between rounded-lg px-3 py-2 ${cx.cardAlt}`}>
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className={`w-3.5 h-3.5 shrink-0 ${cx.textTertiary}`} />
                                <span className={`text-xs truncate ${cx.textPrimary}`}>{f.fileName}</span>
                                <span className={`text-[10px] shrink-0 ${cx.textTertiary}`}>{formatFileSize(Math.round(f.fileSize / 1024))}</span>
                              </div>
                              <button
                                onClick={() => removeFile(f.fileName)}
                                aria-label={`Remove ${f.fileName}`}
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${cx.textTertiary} hover:text-[var(--color-accent-danger)]`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className={`text-[10px] ${cx.textTertiary}`}>
                        Note: only file metadata is sent here — actual binary upload plumbing (e.g. a presigned URL step) isn't defined by
                        the current API contract and needs to be wired separately.
                      </p>
                    </>
                  )}

                  {submissionType === "link" && (
                    <div>
                      <label htmlFor="submission-link" className={`text-[11px] font-medium mb-1.5 block ${cx.textSecondary}`}>
                        Submission link
                      </label>
                      <input
                        id="submission-link"
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://github.com/your-repo"
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent-primary)]/50 transition-colors bg-[var(--color-surface-alt)] ${cx.border} ${cx.textPrimary}`}
                      />
                    </div>
                  )}

                  {submissionType === "text" && (
                    <div>
                      <label htmlFor="submission-text" className={`text-[11px] font-medium mb-1.5 block ${cx.textSecondary}`}>
                        Your response
                      </label>
                      <textarea
                        id="submission-text"
                        rows={5}
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
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

                  {(fileError || submitError) && <p className={`text-[11px] ${cx.danger}`}>{fileError ?? submitError}</p>}

                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={onClose} className={`flex-1 rounded-full text-sm font-medium px-4 py-2.5 transition-colors ${cx.ghostBtn}`}>
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitClick}
                      disabled={submitStatus === "loading"}
                      className={`flex-1 rounded-full text-sm font-medium px-4 py-2.5 transition-colors disabled:opacity-60 ${cx.accentBtn}`}
                    >
                      {submitStatus === "loading" ? "Submitting..." : hasExistingSubmission ? "Update Submission" : "Submit Assignment"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

// =====================================================================
// ASSIGNMENT DETAILS PANEL
// =====================================================================

type DetailsTab = "details" | "instructions" | "submission";

function AssignmentDetailsPanel({
  assignment,
  loading,
  onClose,
  onSubmitClick,
}: {
  assignment: AssignmentDetailsDTO | null;
  loading: boolean;
  onClose: () => void;
  onSubmitClick: () => void;
}) {
  const [tab, setTab] = useState<DetailsTab>("details");

  useEffect(() => {
    setTab("details");
  }, [assignment?.id]);

  if (loading || !assignment) {
    return (
      <div className={`${cx.card} p-5 space-y-3`}>
        <div className={`h-4 w-40 rounded animate-pulse ${cx.cardAlt}`} />
        <div className={`h-3 w-56 rounded animate-pulse ${cx.cardAlt}`} />
        <div className={`h-32 w-full rounded-xl animate-pulse ${cx.cardAlt}`} />
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
        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>{assignment.type}</span>
      </div>

      <div className={`flex items-center gap-1 px-3 pt-3 border-b ${cx.border}`}>
        {([
          { id: "details" as const, label: "Details" },
          { id: "instructions" as const, label: "Instructions" },
          { id: "submission" as const, label: "Submissions" },
        ]).map((t) => (
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
                { icon: Upload, label: "Instructor", value: assignment.instructor },
                ...(assignment.allowedFileTypes.length > 0
                  ? [{ icon: Paperclip, label: "Allowed File Types", value: assignment.allowedFileTypes.join(", ") }]
                  : []),
                ...(assignment.maxFileSizeMb > 0 ? [{ icon: Info, label: "Maximum File Size", value: `${assignment.maxFileSizeMb} MB` }] : []),
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

            {assignment.description && (
              <div>
                <div className={`text-xs font-medium mb-1.5 ${cx.textSecondary}`}>Description</div>
                <p className={`text-sm leading-relaxed ${cx.textSecondary}`}>{assignment.description}</p>
              </div>
            )}

            {assignment.attachments.length > 0 && (
              <div>
                <div className={`text-xs font-medium mb-2 ${cx.textSecondary}`}>Attachments</div>
                <div className="space-y-1.5">
                  {assignment.attachments.map((att) => (
                    <div key={att.id} className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${cx.cardAlt}`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${cx.textTertiary}`} />
                        <div className="min-w-0">
                          <div className={`text-xs truncate ${cx.textPrimary}`}>{att.fileName}</div>
                          <div className={`text-[10px] ${cx.textTertiary}`}>{formatFileSize(Math.round(att.fileSize / 1024))}</div>
                        </div>
                      </div>
                      <button
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${cx.textSecondary} hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/10`}
                        aria-label={`Download ${att.fileName}`}
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
          <p className={`text-sm leading-relaxed whitespace-pre-line ${cx.textSecondary}`}>
            {assignment.instructions ?? "No additional instructions provided."}
          </p>
        )}

        {tab === "submission" && (
          <div className="space-y-4">
            {assignment.status === "UPCOMING" && !assignment.submission && (
              <p className={`text-xs ${cx.textTertiary}`}>You haven't submitted this assignment yet.</p>
            )}

            {assignment.submission && assignment.status !== "GRADED" && (
              <div className={`rounded-xl px-3.5 py-3 ${cx.cardAlt}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${cx.success}`} />
                  <span className={`text-xs font-medium ${cx.textPrimary}`}>{assignment.submission.isLate ? "Submitted late" : "Submitted"}</span>
                </div>
                <p className={`text-[11px] ${cx.textTertiary}`}>{formatFullDueDate(assignment.submission.submittedAt)}</p>
                {assignment.submission.fileName && (
                  <div className={`flex items-center gap-2 mt-2 text-xs ${cx.textSecondary}`}>
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{assignment.submission.fileName}</span>
                  </div>
                )}
                {assignment.submission.linkUrl && (
                  <div className={`flex items-center gap-2 mt-2 text-xs ${cx.textSecondary}`}>
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{assignment.submission.linkUrl}</span>
                  </div>
                )}
              </div>
            )}

            {assignment.status === "GRADED" && assignment.submission && (
              <div className="space-y-3">
                <div className={`rounded-xl px-4 py-4 ${cx.successChip}`}>
                  <div className="text-[11px] font-medium opacity-80 mb-1">Grade</div>
                  {/* Grade/points come from the backend once grading APIs exist; the
                      current AssignmentSubmission DTO doesn't carry a score field yet. */}
                  <div className="text-sm mt-0.5 opacity-80">Graded — see feedback below</div>
                </div>
                {assignment.submission.comments && (
                  <div>
                    <div className={`text-xs font-medium mb-1.5 ${cx.textSecondary}`}>Feedback</div>
                    <p className={`text-sm leading-relaxed ${cx.textSecondary}`}>{assignment.submission.comments}</p>
                  </div>
                )}
              </div>
            )}

            {assignment.status === "OVERDUE" && (
              <div className={`rounded-xl px-3.5 py-3 ${cx.dangerChip}`}>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{formatDueLabel(assignment)}</span>
                </div>
                {assignment.allowLateSubmit && (
                  <p className="text-[11px] mt-1 opacity-80">Late submissions are still accepted for this assignment.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {(assignment.status === "UPCOMING" || assignment.status === "OVERDUE") && (
        <div className={`p-4 border-t ${cx.border}`}>
          <button
            onClick={onSubmitClick}
            className={`w-full inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-medium px-4 py-2.5 transition-colors ${cx.accentBtn}`}
          >
            <Upload className="w-4 h-4" />
            {assignment.submission ? "Update Submission" : "Submit Assignment"}
          </button>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// MAIN PAGE
// =====================================================================

export default function Assignments() {
  const dispatch = useAppDispatch();

  const list = useAppSelector(selectAssignmentList);
  const pagination = useAppSelector(selectAssignmentPagination);
  const listStatus = useAppSelector(selectAssignmentListStatus);

  const currentAssignment = useAppSelector(selectCurrentAssignment);
  const currentAssignmentStatus = useAppSelector(selectCurrentAssignmentStatus);

  const submitStatus = useAppSelector(selectSubmitStatus);
  const submitError = useAppSelector(selectSubmitError);

  const [mainTab, setMainTab] = useState<AssignmentStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortKey, setSortKey] = useState<NonNullable<AssignmentFilters["sortBy"]>>("dueDate");
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submitTargetId, setSubmitTargetId] = useState<number | null>(null);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const filters: AssignmentFilters = useMemo(
    () => ({
      status: mainTab === "ALL" ? undefined : mainTab,
      search: debouncedQuery || undefined,
      sortBy: sortKey,
      sortOrder: sortKey === "dueDate" ? "asc" : "desc",
      page,
      limit: PAGE_SIZE,
    }),
    [mainTab, debouncedQuery, sortKey, page]
  );

  useEffect(() => {
    dispatch(fetchAssignments(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function selectAssignment(a: AssignmentListItem) {
    setSelectedId(a.id);
    setMobileDetailsOpen(true);
    dispatch(fetchAssignmentDetails(a.id));
  }

  function openSubmitDialog(assignmentId: number) {
    setSubmitTargetId(assignmentId);
    if (currentAssignment?.id !== assignmentId) {
      dispatch(fetchAssignmentDetails(assignmentId));
    }
  }

  function closeSubmitDialog() {
    setSubmitTargetId(null);
    dispatch(clearSubmitError());
  }

  async function handleSubmitAssignment(input: SubmissionInput) {
    if (!submitTargetId) return;
    const hasExisting = currentAssignment?.submission != null;
    const action = hasExisting ? updateSubmission : createSubmission;
    const result = await dispatch(action({ assignmentId: submitTargetId, input }));
    if (action.fulfilled.match(result)) {
      setSubmitTargetId(null);
      dispatch(fetchAssignments(filters));
    }
  }

  const hasActiveFilters = debouncedQuery.trim().length > 0;
  const loading = listStatus === "loading" || listStatus === "idle";
  const totalPages = pagination?.totalPages ?? 1;

  const submitDialogAssignment = submitTargetId && currentAssignment?.id === submitTargetId ? currentAssignment : null;
  const submitDialogLoading = submitTargetId !== null && (currentAssignment?.id !== submitTargetId || currentAssignmentStatus === "loading");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div>
          <h1 className={`font-display text-2xl font-semibold tracking-tight ${cx.textPrimary}`}>Assignments</h1>
          <p className={`text-sm mt-1 ${cx.textSecondary}`}>Manage your coursework, deadlines, submissions, and grades.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {mainTabs.map((t) => {
          const active = mainTab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => {
                setMainTab(t.value);
                setPage(1);
              }}
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

      {/* Note: precise cross-status counts (Upcoming/Submitted/To Review/Overdue
          all at once) aren't derivable from a single filtered+paginated list
          without a dedicated summary endpoint. Showing the active filter's
          total instead of fabricating the other three. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Showing"
          value={pagination?.total ?? 0}
          sub={mainTab === "ALL" ? "All assignments" : statusStyle[mainTab].label}
          icon={ClipboardCheck}
          tone="accent"
          loading={loading}
        />
        <StatCard
          label="Page"
          value={pagination ? `${pagination.page} / ${pagination.totalPages}` : "—"}
          sub={`${PAGE_SIZE} per page`}
          icon={FileText}
          tone="neutral"
          loading={loading}
        />
        <StatCard
          label="Overdue"
          value={mainTab === "OVERDUE" ? pagination?.total ?? 0 : "—"}
          sub={mainTab === "OVERDUE" ? "Past due" : "Switch to Overdue tab"}
          icon={AlertCircle}
          tone="danger"
          loading={loading}
        />
        <StatCard
          label="Graded"
          value={mainTab === "GRADED" ? pagination?.total ?? 0 : "—"}
          sub={mainTab === "GRADED" ? "Graded so far" : "Switch to Graded tab"}
          icon={CheckCircle2}
          tone="success"
          loading={loading}
        />
      </div>

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

        <div className="flex items-center gap-2 md:ml-auto">
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
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      s.value === sortKey
                        ? "text-[var(--color-accent-primary)]"
                        : `${cx.textSecondary} hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]`
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          {listStatus === "failed" ? (
            <ErrorState onRetry={() => dispatch(fetchAssignments(filters))} />
          ) : loading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <AssignmentCardSkeleton key={i} />
              ))}
            </div>
          ) : list.length === 0 ? (
            hasActiveFilters ? (
              <EmptyState icon={SearchX} title="No assignments found" subtitle="Try changing your search or filters." />
            ) : mainTab === "OVERDUE" ? (
              <EmptyState icon={PartyPopper} title="No overdue assignments" subtitle="Nice work — you're on track." />
            ) : (
              <EmptyState icon={Inbox} title="No assignments yet" subtitle="You're all caught up." />
            )
          ) : (
            <>
              <div className="space-y-2.5">
                {list.map((a) => (
                  <AssignmentCard
                    key={a.id}
                    assignment={a}
                    selected={a.id === selectedId}
                    onSelect={() => selectAssignment(a)}
                    onSubmitClick={() => openSubmitDialog(a.id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 ${cx.ghostBtn}`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous
                  </button>
                  <span className={`text-xs ${cx.textTertiary}`}>
                    Page {pagination?.page ?? 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 ${cx.ghostBtn}`}
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-6 h-[calc(100vh-8rem)]">
            {selectedId === null ? (
              <div className={`${cx.card} p-8 h-full flex items-center justify-center text-center`}>
                <div>
                  <Info className={`w-6 h-6 mx-auto mb-2 ${cx.textTertiary}`} />
                  <p className={`text-xs ${cx.textTertiary}`}>Select an assignment to view details.</p>
                </div>
              </div>
            ) : (
              <AssignmentDetailsPanel
                assignment={currentAssignment?.id === selectedId ? currentAssignment : null}
                loading={currentAssignmentStatus === "loading" || currentAssignment?.id !== selectedId}
                onClose={() => {
                  setSelectedId(null);
                  dispatch(clearCurrentAssignment());
                }}
                onSubmitClick={() => selectedId && openSubmitDialog(selectedId)}
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileDetailsOpen && selectedId !== null && (
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
              <AssignmentDetailsPanel
                assignment={currentAssignment?.id === selectedId ? currentAssignment : null}
                loading={currentAssignmentStatus === "loading" || currentAssignment?.id !== selectedId}
                onClose={() => setMobileDetailsOpen(false)}
                onSubmitClick={() => selectedId && openSubmitDialog(selectedId)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AssignmentSubmissionDialog
        assignment={submitDialogAssignment}
        loading={submitDialogLoading}
        hasExistingSubmission={submitDialogAssignment?.submission != null}
        submitStatus={submitStatus}
        submitError={submitError}
        onClose={closeSubmitDialog}
        onSubmit={handleSubmitAssignment}
      />
    </motion.div>
  );
}