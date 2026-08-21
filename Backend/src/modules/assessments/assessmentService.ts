import { prisma } from "../../config/database.js";
import { computeAssessmentStatus } from "./assessmentUtils.js";
import { sanitizeQuestion, finalizeAttempt } from "./assessmentScoring.js";
import type {
  AssessmentListItemDTO,
  AssessmentDetailsDTO,
  ActiveAttemptDTO,
  AssessmentResultDTO,
  AssessmentReviewItemDTO,
} from "./assessmentTypes.js";

export class AssessmentError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 400, code = "ASSESSMENT_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ---- Authorization gate — every function below goes through this ----
async function assertEnrolledInAssessmentCourse(
  studentId: number,
  assessmentId: number
) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { courseOffering: true },
  });

  if (!assessment) {
    throw new AssessmentError("Assessment not found", 404, "ASSESSMENT_NOT_FOUND");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      semesterRegistration: { studentId },
      courseOfferingId: assessment.courseOfferingId,
    },
  });

  if (!enrollment || enrollment.status === "dropped") {
    throw new AssessmentError(
      "You are not enrolled in this course",
      403,
      "NOT_ENROLLED"
    );
  }

  return assessment;
}

// If an IN_PROGRESS attempt has expired, finalize it before doing anything
// else. This is what makes the timer server-authoritative — every read/write
// path that touches an attempt calls this first.
async function finalizeIfExpired<T extends { id: number; status: string; expiresAt: Date }>(attempt: T) {
  if (attempt.status === "IN_PROGRESS" && new Date() > attempt.expiresAt) {
    return (await finalizeAttempt(attempt.id, "AUTO_SUBMITTED")) as unknown as T;
  }
  return attempt;
}

// ---- List (Section 7) ----

interface ListFilters {
  type?: string;
  courseId?: number;
  status?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy: "startTime" | "endTime" | "createdAt";
  sortOrder: "asc" | "desc";
}

export async function listAssessmentsForStudent(studentId: number, filters: ListFilters) {
  const enrolledOfferingIds = (
    await prisma.enrollment.findMany({
      where: {
        semesterRegistration: { studentId },
        status: { not: "dropped" },
      },
      select: { courseOfferingId: true },
    })
  ).map((e) => e.courseOfferingId);

  const empty = { data: [], pagination: { page: filters.page, limit: filters.limit, total: 0, totalPages: 0 } };
  if (enrolledOfferingIds.length === 0) return empty;

  if (filters.courseId && !enrolledOfferingIds.includes(filters.courseId)) {
    return empty;
  }

  const where = {
    courseOfferingId: filters.courseId ? filters.courseId : { in: enrolledOfferingIds },
    type: filters.type as never,
    ...(filters.search
      ? { title: { contains: filters.search, mode: "insensitive" as const } }
      : {}),
  };

  const [total, assessments] = await Promise.all([
    prisma.assessment.count({ where }),
    prisma.assessment.findMany({
      where,
      include: {
        courseOffering: { include: { course: { select: { code: true, name: true } } } },
        attempts: {
          where: { studentId, status: { not: "IN_PROGRESS" } },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { [filters.sortBy]: filters.sortOrder },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
  ]);

  let data: AssessmentListItemDTO[] = assessments.map((a) => ({
    id: a.id,
    courseId: a.courseOfferingId,
    courseCode: a.courseOffering.course.code,
    courseName: a.courseOffering.course.name,
    title: a.title,
    type: a.type,
    startTime: a.startTime,
    endTime: a.endTime,
    durationMinutes: a.durationMinutes,
    status: computeAssessmentStatus({
      startTime: a.startTime,
      endTime: a.endTime,
      hasFinalizedAttempt: a.attempts.length > 0,
    }),
  }));

  // Status is derived, not a DB column — filter in application code.
  if (filters.status) {
    data = data.filter((a) => a.status === filters.status);
  }

  return {
    data,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

// ---- Details (Section 9) ----

export async function getAssessmentDetails(
  studentId: number,
  assessmentId: number
): Promise<AssessmentDetailsDTO> {
  await assertEnrolledInAssessmentCourse(studentId, assessmentId);

  const assessment = await prisma.assessment.findUniqueOrThrow({
    where: { id: assessmentId },
    include: {
      courseOffering: { include: { course: { select: { code: true, name: true } } } },
      attempts: { where: { studentId } },
    },
  });

  const finalizedAttempts = assessment.attempts.filter((a) => a.status !== "IN_PROGRESS");

  return {
    id: assessment.id,
    courseId: assessment.courseOfferingId,
    courseCode: assessment.courseOffering.course.code,
    courseName: assessment.courseOffering.course.name,
    title: assessment.title,
    description: assessment.description,
    type: assessment.type,
    startTime: assessment.startTime,
    endTime: assessment.endTime,
    durationMinutes: assessment.durationMinutes,
    totalMarks: assessment.totalMarks,
    passingMarks: assessment.passingMarks,
    attemptsAllowed: assessment.attemptsAllowed,
    attemptsUsed: finalizedAttempts.length,
    reviewAllowed: assessment.reviewAllowed,
    status: computeAssessmentStatus({
      startTime: assessment.startTime,
      endTime: assessment.endTime,
      hasFinalizedAttempt: finalizedAttempts.length > 0,
    }),
  };
}

// ---- Start (Section 10, 18, 19) ----

export async function startAssessment(studentId: number, assessmentId: number) {
  const assessment = await assertEnrolledInAssessmentCourse(studentId, assessmentId);
  const now = new Date();

  if (now < assessment.startTime) {
    throw new AssessmentError("This assessment has not started yet", 403, "NOT_STARTED");
  }
  if (now > assessment.endTime) {
    throw new AssessmentError("This assessment has ended", 403, "ASSESSMENT_ENDED");
  }

  const existingAttempts = await prisma.assessmentAttempt.findMany({
    where: { assessmentId, studentId },
    orderBy: { attemptNumber: "desc" },
  });

  // Reuse an active, unexpired attempt instead of creating a duplicate.
  const activeAttempt = existingAttempts.find((a) => a.status === "IN_PROGRESS");
  if (activeAttempt) {
    const finalized = await finalizeIfExpired(activeAttempt);
    if (finalized.status === "IN_PROGRESS") {
      return getActiveAttempt(studentId, assessmentId);
    }
    // fell through: it just got auto-submitted, so re-check attempt limits below
  }

  const finalizedCount = existingAttempts.filter((a) => a.status !== "IN_PROGRESS").length;
  if (finalizedCount >= assessment.attemptsAllowed) {
    throw new AssessmentError(
      "You have used all available attempts.",
      409,
      "ATTEMPT_LIMIT_REACHED"
    );
  }

  const startedAt = now;
  const byDuration = new Date(startedAt.getTime() + assessment.durationMinutes * 60_000);
  const expiresAt = byDuration < assessment.endTime ? byDuration : assessment.endTime;

  const attempt = await prisma.assessmentAttempt.create({
    data: {
      assessmentId,
      studentId,
      attemptNumber: finalizedCount + 1,
      startedAt,
      expiresAt,
      status: "IN_PROGRESS",
    },
  });

  const questions = await prisma.assessmentQuestion.findMany({
    where: { assessmentId },
    orderBy: { order: "asc" },
  });

  return {
    attemptId: attempt.id,
    startedAt: attempt.startedAt,
    expiresAt: attempt.expiresAt,
    durationMinutes: assessment.durationMinutes,
    status: attempt.status,
    questions: questions.map(sanitizeQuestion),
  };
}

// ---- Active attempt (Section 12) ----

export async function getActiveAttempt(
  studentId: number,
  assessmentId: number
): Promise<ActiveAttemptDTO | null> {
  await assertEnrolledInAssessmentCourse(studentId, assessmentId);

  let attempt = await prisma.assessmentAttempt.findFirst({
    where: { assessmentId, studentId, status: "IN_PROGRESS" },
    include: { answers: true },
  });

  if (!attempt) return null;

  const finalized = await finalizeIfExpired(attempt);
  if (finalized.status !== "IN_PROGRESS") return null; // just auto-submitted

  const questions = await prisma.assessmentQuestion.findMany({
    where: { assessmentId },
    orderBy: { order: "asc" },
  });

  return {
    attemptId: attempt.id,
    startedAt: attempt.startedAt,
    expiresAt: attempt.expiresAt,
    status: attempt.status,
    answeredQuestionIds: attempt.answers.map((a) => a.questionId),
    questions: questions.map(sanitizeQuestion),
  };
}

// ---- Save answer (Section 14) ----

async function loadOwnedAttempt(studentId: number, assessmentId: number, attemptId: number) {
  const attempt = await prisma.assessmentAttempt.findUnique({ where: { id: attemptId } });

  if (!attempt || attempt.assessmentId !== assessmentId) {
    throw new AssessmentError("Attempt not found", 404, "ATTEMPT_NOT_FOUND");
  }
  // Ownership: never trust anything but the JWT-derived studentId here.
  if (attempt.studentId !== studentId) {
    throw new AssessmentError("This attempt does not belong to you", 403, "FORBIDDEN");
  }

  return attempt;
}

export async function saveAnswer(
  studentId: number,
  assessmentId: number,
  attemptId: number,
  questionId: number,
  answer: string
) {
  await assertEnrolledInAssessmentCourse(studentId, assessmentId);
  let attempt = await loadOwnedAttempt(studentId, assessmentId, attemptId);

  attempt = await finalizeIfExpired(attempt);
  if (attempt.status !== "IN_PROGRESS") {
    throw new AssessmentError(
      "This attempt has already been submitted",
      409,
      "ATTEMPT_NOT_IN_PROGRESS"
    );
  }

  const question = await prisma.assessmentQuestion.findUnique({ where: { id: questionId } });
  if (!question || question.assessmentId !== assessmentId) {
    throw new AssessmentError("Question not found for this assessment", 404, "QUESTION_NOT_FOUND");
  }

  await prisma.assessmentAnswer.upsert({
    where: { attemptId_questionId: { attemptId, questionId } },
    update: { answer },
    create: { attemptId, questionId, answer },
  });
}

// ---- Submit (Section 16, 35) ----

export async function submitAttempt(
  studentId: number,
  assessmentId: number,
  attemptId: number
) {
  await assertEnrolledInAssessmentCourse(studentId, assessmentId);
  const attempt = await loadOwnedAttempt(studentId, assessmentId, attemptId);

  // Idempotent: if it's already finalized (double-click, network retry,
  // or a race with the expiry auto-finalizer), just return the existing
  // result instead of re-grading.
  const finalized = await finalizeAttempt(
    attemptId,
    attempt.status === "IN_PROGRESS" && new Date() > attempt.expiresAt
      ? "AUTO_SUBMITTED"
      : "SUBMITTED"
  );

  return {
    attemptId: finalized.id,
    status: finalized.status,
    score: finalized.score,
    percentage: finalized.percentage,
    passed: finalized.passed,
  };

  // TODO: emit "assessment:graded" / "assessment:result-available" Socket.IO
  // event once a socket server exists in this project (skipped for now).
}

// ---- Result (Section 20) ----

export async function getResult(
  studentId: number,
  assessmentId: number
): Promise<AssessmentResultDTO> {
  const assessment = await assertEnrolledInAssessmentCourse(studentId, assessmentId);

  const attempt = await prisma.assessmentAttempt.findFirst({
    where: { assessmentId, studentId, status: { not: "IN_PROGRESS" } },
    orderBy: { attemptNumber: "desc" },
  });

  if (!attempt) {
    throw new AssessmentError("No submitted attempt found", 404, "NO_RESULT");
  }

  return {
    assessment: { id: assessment.id, title: assessment.title },
    attempt: {
      attemptNumber: attempt.attemptNumber,
      submittedAt: attempt.submittedAt,
      score: attempt.score,
      totalMarks: assessment.totalMarks,
      percentage: attempt.percentage,
      passed: attempt.passed,
    },
  };
}

// ---- Review (Section 21) ----

export async function getReview(
  studentId: number,
  assessmentId: number,
  attemptId: number
): Promise<AssessmentReviewItemDTO[]> {
  const assessment = await assertEnrolledInAssessmentCourse(studentId, assessmentId);

  if (!assessment.reviewAllowed) {
    throw new AssessmentError(
      "Answer review is not available for this assessment.",
      403,
      "REVIEW_NOT_ALLOWED"
    );
  }

  const attempt = await loadOwnedAttempt(studentId, assessmentId, attemptId);
  if (attempt.status === "IN_PROGRESS") {
    throw new AssessmentError(
      "This attempt has not been submitted yet",
      403,
      "ATTEMPT_NOT_SUBMITTED"
    );
  }

  const [questions, answers] = await Promise.all([
    prisma.assessmentQuestion.findMany({ where: { assessmentId }, orderBy: { order: "asc" } }),
    prisma.assessmentAnswer.findMany({ where: { attemptId } }),
  ]);

  const answersByQuestionId = new Map(answers.map((a) => [a.questionId, a]));

  return questions.map((q) => {
    const answer = answersByQuestionId.get(q.id);
    return {
      question: q.questionText,
      questionType: q.questionType,
      marks: q.marks,
      studentAnswer: answer?.answer ?? "",
      correctAnswer: q.correctAnswer,
      isCorrect: answer?.isCorrect ?? null,
      marksAwarded: answer?.marksAwarded ?? null,
      explanation: q.explanation,
    };
  });
}
