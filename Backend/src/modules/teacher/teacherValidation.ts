import { z } from "zod";

// Teachers can only view their assigned offerings — creation is admin-only.
export const courseOfferingIdParamSchema = z.object({
  courseOfferingId: z.coerce.number().int().positive(),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  instructions: z.string().optional(),
  type: z.enum(["HOMEWORK", "PROJECT", "QUIZ", "REPORT", "ESSAY"]),
  points: z.number().int().positive(),
  dueDate: z.coerce.date(),
  submissionType: z.enum(["FILE", "TEXT", "LINK"]),
  allowLateSubmit: z.boolean().default(false),
  allowedFileTypes: z.array(z.string()).default([]),
  maxFileSizeMb: z.number().int().positive().default(25),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

export const assignmentIdParamSchema = z.object({
  assignmentId: z.coerce.number().int().positive(),
});

export const submissionIdParamSchema = z.object({
  submissionId: z.coerce.number().int().positive(),
});

export const gradeSubmissionSchema = z.object({
  grade: z.number().int().min(0),
  feedback: z.string().max(5000).optional(),
});
