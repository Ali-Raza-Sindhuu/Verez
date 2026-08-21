export type DerivedStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "MISSED";

export interface AssessmentListItemDTO {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  title: string;
  type: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  status: DerivedStatus;
}

export interface AssessmentDetailsDTO extends AssessmentListItemDTO {
  description: string;
  totalMarks: number;
  passingMarks: number;
  attemptsAllowed: number;
  attemptsUsed: number;
  reviewAllowed: boolean;
}

// Structurally excludes correctAnswer/explanation — this type has no field
// for them, so there is no way to accidentally leak them by forgetting a
// `select`/`omit` at a call site.
export interface SanitizedQuestionDTO {
  id: number;
  questionText: string;
  questionType: string;
  marks: number;
  order: number;
  options: { id: string; text: string }[] | null;
}

export interface ActiveAttemptDTO {
  attemptId: number;
  startedAt: Date;
  expiresAt: Date;
  status: string;
  answeredQuestionIds: number[];
  questions: SanitizedQuestionDTO[];
}

export interface AssessmentResultDTO {
  assessment: { id: number; title: string };
  attempt: {
    attemptNumber: number;
    submittedAt: Date | null;
    score: number | null;
    totalMarks: number;
    percentage: number | null;
    passed: boolean | null;
  };
}

export interface AssessmentReviewItemDTO {
  question: string;
  questionType: string;
  marks: number;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean | null;
  marksAwarded: number | null;
  explanation: string | null;
}
