import type { Course, RegistrationConflict } from "./types";

export const MIN_CREDITS = 3;
export const MAX_CREDITS = 18;

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function schedulesOverlap(a: Course, b: Course): boolean {
  const sharedDay = a.schedule.days.some((d) => b.schedule.days.includes(d));
  if (!sharedDay) return false;

  const aStart = timeToMinutes(a.schedule.startTime);
  const aEnd = timeToMinutes(a.schedule.endTime);
  const bStart = timeToMinutes(b.schedule.startTime);
  const bEnd = timeToMinutes(b.schedule.endTime);

  return aStart < bEnd && bStart < aEnd;
}

function overlappingDayLabel(a: Course, b: Course): string {
  const shared = a.schedule.days.find((d) => b.schedule.days.includes(d));
  return shared ?? "";
}

/**
 * Client-side conflict detection — used ONLY for instant UI feedback before
 * hitting the API. The backend re-validates all of this (credit limits,
 * schedule conflicts, prerequisites, duplicates, seat availability) and is
 * the actual source of truth; this must never be trusted as enforcement.
 *
 * @param selected the courses currently selected for registration
 * @param registeredCodes course codes the student is already enrolled in
 *   (any non-dropped status) — derive from the courses slice's myEnrollments
 * @param completedCodes course codes the student has already completed —
 *   derive from myEnrollments where status === "completed"
 */
export function detectConflicts(
  selected: Course[],
  registeredCodes: string[],
  completedCodes: string[]
): RegistrationConflict[] {
  const conflicts: RegistrationConflict[] = [];

  // Schedule overlaps — pairwise check.
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const a = selected[i];
      const b = selected[j];
      if (schedulesOverlap(a, b)) {
        const day = overlappingDayLabel(a, b);
        conflicts.push({
          type: "schedule",
          message: `${a.code} and ${b.code} both occur ${day} at ${a.schedule.startTime}.`,
          courseIds: [a.id, b.id],
        });
      }
    }
  }

  // Credit limit.
  const totalCredits = selected.reduce((sum, c) => sum + c.credits, 0);
  if (totalCredits > MAX_CREDITS) {
    conflicts.push({
      type: "credit-limit",
      message: `You've selected ${totalCredits} credits, which exceeds the ${MAX_CREDITS}-credit maximum.`,
      courseIds: selected.map((c) => c.id),
    });
  }

  // Missing prerequisites.
  for (const c of selected) {
    const missing = c.prerequisites.filter(
      (p) => !completedCodes.includes(p) && !selected.some((s) => s.code === p)
    );
    if (missing.length > 0) {
      conflicts.push({
        type: "prerequisite",
        message: `${c.code} requires ${missing.join(", ")}, which you haven't completed.`,
        courseIds: [c.id],
      });
    }
  }

  // Already registered.
  for (const c of selected) {
    if (registeredCodes.includes(c.code)) {
      conflicts.push({
        type: "already-registered",
        message: `You're already registered for ${c.code}.`,
        courseIds: [c.id],
      });
    }
  }

  // No seats available.
  for (const c of selected) {
    if (c.seatsTaken >= c.seatsTotal) {
      conflicts.push({
        type: "no-seats",
        message: `${c.code} has no available seats.`,
        courseIds: [c.id],
      });
    }
  }

  return conflicts;
}

export function totalCreditsOf(selected: Course[]): number {
  return selected.reduce((sum, c) => sum + c.credits, 0);
}