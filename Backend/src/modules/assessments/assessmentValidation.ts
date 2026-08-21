import { z } from "zod";

export const listAssessmentsQuerySchema = z.object({
  type: z.enum(["EXAM", "QUIZ"]).optional(),
  courseId: z.coerce.number().int().positive().optional(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "MISSED"]).optional(),
  search: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["startTime", "endTime", "createdAt"]).default("startTime"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const assessmentIdParamSchema = z.object({
  assessmentId: z.coerce.number().int().positive(),
});

export const attemptIdParamSchema = z.object({
  assessmentId: z.coerce.number().int().positive(),
  attemptId: z.coerce.number().int().positive(),
});

export const answerParamSchema = z.object({
  assessmentId: z.coerce.number().int().positive(),
  attemptId: z.coerce.number().int().positive(),
  questionId: z.coerce.number().int().positive(),
});

export const saveAnswerSchema = z.object({
  answer: z.string().min(1).max(5000),
});
