import { z } from "zod";

export const listAssignmentsQuerySchema = z.object({
  courseId: z.coerce.number().int().positive().optional(),
  status: z.enum(["UPCOMING", "OVERDUE", "SUBMITTED", "LATE", "GRADED"]).optional(),
  type: z.enum(["HOMEWORK", "PROJECT", "QUIZ", "REPORT", "ESSAY"]).optional(),
  search: z.string().min(1).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(["dueDate", "createdAt", "points"]).default("dueDate"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const assignmentIdParamSchema = z.object({
  assignmentId: z.coerce.number().int().positive(),
});

// One of textContent/linkUrl/file* must be present depending on the
// assignment's submissionType — checked in the service against the actual
// assignment record, not purely at the schema level, since it's contextual.
export const createSubmissionSchema = z.object({
  textContent: z.string().max(20000).optional(),
  linkUrl: z.string().url().optional(),
  comments: z.string().max(2000).optional(),
  file: z
    .object({
      fileName: z.string().min(1),
      fileType: z.string().min(1),
      fileSize: z.number().int().positive(),
    })
    .optional(),
});

export const updateSubmissionSchema = createSubmissionSchema;
