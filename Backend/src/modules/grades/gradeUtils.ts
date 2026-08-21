export interface GradeBand {
  letter: string;
  gradePoints: number;
  minPercent: number;
}

// Single source of truth for letter grade / GPA points — matches the
// frontend's Grade Scale section exactly. Ordered highest to lowest;
// letterGradeFor() picks the first band the percentage qualifies for.
export const GRADE_SCALE: GradeBand[] = [
  { letter: "A", gradePoints: 4.0, minPercent: 90 },
  { letter: "A-", gradePoints: 3.7, minPercent: 85 },
  { letter: "B+", gradePoints: 3.3, minPercent: 80 },
  { letter: "B", gradePoints: 3.0, minPercent: 75 },
  { letter: "B-", gradePoints: 2.7, minPercent: 70 },
  { letter: "C+", gradePoints: 2.3, minPercent: 65 },
  { letter: "C", gradePoints: 2.0, minPercent: 60 },
  { letter: "F", gradePoints: 0.0, minPercent: 0 },
];

export function letterGradeFor(percentage: number): { letter: string; gradePoints: number } {
  const band = GRADE_SCALE.find((b) => percentage >= b.minPercent) ?? GRADE_SCALE[GRADE_SCALE.length - 1];
  return { letter: band.letter, gradePoints: band.gradePoints };
}

// V1 placeholder: there's no per-student degree-plan/program model yet to
// derive a real total-credits-to-graduate figure from. Hardcoded until one
// exists — flagged clearly rather than silently baked into a calculation.
export const DEGREE_TOTAL_CREDITS = 120;

export function computeAcademicStanding(cumulativeGPA: number): { label: string; onTrack: boolean } {
  if (cumulativeGPA >= 3.5) return { label: "Good Standing", onTrack: true };
  if (cumulativeGPA >= 2.0) return { label: "Satisfactory Standing", onTrack: true };
  return { label: "Academic Probation", onTrack: false };
}
