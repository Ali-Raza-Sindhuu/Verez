import { prisma } from "../../config/database.js";
import type { SanitizedQuestionDTO } from "./assessmentTypes.js";

export function sanitizeQuestion(q: {
  id: number;
  questionText: string;
  questionType: string;
  marks: number;
  order: number;
  options: unknown;
}): SanitizedQuestionDTO {
  return {
    id: q.id,
    questionText: q.questionText,
    questionType: q.questionType,
    marks: q.marks,
    order: q.order,
    options: (q.options as { id: string; text: string }[] | null) ?? null,
  };
}

// Grades one answer against its question. MCQ/TRUE_FALSE are auto-graded by
// exact match; SHORT_ANSWER is left pending (marksAwarded: null) — no AI or
// exact-match grading for free text in V1, per spec.
function gradeAnswer(
  questionType: string,
  correctAnswer: string,
  marks: number,
  studentAnswer: string
): { isCorrect: boolean | null; marksAwarded: number | null } {
  if (questionType === "SHORT_ANSWER") {
    return { isCorrect: null, marksAwarded: null };
  }
  const isCorrect = studentAnswer.trim() === correctAnswer.trim();
  return { isCorrect, marksAwarded: isCorrect ? marks : 0 };
}

// The single place attempt finalization happens — called from submit,
// and also from any read path that discovers an expired IN_PROGRESS
// attempt (save-answer, get-active-attempt, start). This is what makes
// the timer server-authoritative rather than advisory.
export async function finalizeAttempt(
  attemptId: number,
  finalStatus: "SUBMITTED" | "AUTO_SUBMITTED"
) {
  return prisma.$transaction(async (tx) => {
    const attempt = await tx.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: true,
        assessment: { include: { questions: true } },
      },
    });

    if (!attempt) throw new Error("Attempt not found during finalization");

    // Idempotent — a race between two finalize calls (double-submit, or
    // submit racing an expiry-triggered auto-finalize) must not double-grade.
    if (attempt.status !== "IN_PROGRESS") {
      return attempt;
    }

    const answersByQuestionId = new Map(attempt.answers.map((a) => [a.questionId, a]));

    let score = 0;
    let hasPendingGrading = false;

    for (const question of attempt.assessment.questions) {
      const existingAnswer = answersByQuestionId.get(question.id);
      if (!existingAnswer) continue; // unanswered — 0 marks, nothing to grade

      const { isCorrect, marksAwarded } = gradeAnswer(
        question.questionType,
        question.correctAnswer,
        question.marks,
        existingAnswer.answer
      );

      if (marksAwarded === null) {
        hasPendingGrading = true;
      } else {
        score += marksAwarded;
      }

      await tx.assessmentAnswer.update({
        where: { id: existingAnswer.id },
        data: { isCorrect, marksAwarded },
      });
    }

    const totalMarks = attempt.assessment.totalMarks;
    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    // If short-answer questions are still pending grading, pass/fail is
    // provisional (computed on what's graded so far) — there is no
    // teacher-grading flow for this yet, matching the assignments module's
    // current scope.
    const passed = !hasPendingGrading
      ? percentage >= attempt.assessment.passingMarks
      : null;

    return tx.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        status: finalStatus,
        submittedAt: attempt.submittedAt ?? new Date(),
        score,
        percentage,
        passed,
      },
    });
  });
}
