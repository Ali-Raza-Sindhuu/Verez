import type { DerivedStatus } from "./assessmentTypes.js";

export function computeAssessmentStatus(params: {
  startTime: Date;
  endTime: Date;
  hasFinalizedAttempt: boolean; // any SUBMITTED or AUTO_SUBMITTED attempt
  now?: Date;
}): DerivedStatus {
  const now = params.now ?? new Date();

  if (params.hasFinalizedAttempt) return "COMPLETED";
  if (now < params.startTime) return "UPCOMING";
  if (now <= params.endTime) return "ONGOING";
  return "MISSED";
}
