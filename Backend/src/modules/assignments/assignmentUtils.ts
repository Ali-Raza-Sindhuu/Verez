import type { DerivedStatus } from "./assignmentTypes.js";

// The single source of truth for assignment status. Never stored, never
// trusted from the client — always recomputed from dueDate/submission/grade.
export function computeAssignmentStatus(params: {
  dueDate: Date;
  submission: { submittedAt: Date; grade: number | null } | null;
  now?: Date;
}): DerivedStatus {
  const now = params.now ?? new Date();
  const { dueDate, submission } = params;

  if (submission) {
    if (submission.grade !== null) return "GRADED";
    return submission.submittedAt > dueDate ? "LATE" : "SUBMITTED";
  }

  return dueDate > now ? "UPCOMING" : "OVERDUE";
}
