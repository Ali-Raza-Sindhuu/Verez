import { z } from "zod";

export const availableOfferingsQuerySchema = z.object({
  semesterId: z.coerce.number().int().positive().optional(),
  department: z.string().min(1).optional(),
  category: z.enum(["core", "elective", "gen-ed"]).optional(),
  level: z.enum(["100", "200", "300", "400"]).optional(),
  search: z.string().min(1).optional(),
});

export const registerCoursesSchema = z.object({
  offeringIds: z
    .array(z.number().int().positive())
    .min(1, "Select at least one course offering")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Duplicate offering IDs in the same request",
    }),
  semesterId: z.number().int().positive(),
});

export const dropEnrollmentParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
