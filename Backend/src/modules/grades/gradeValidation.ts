import { z } from "zod";

export const semesterParamSchema = z.object({
  semester: z.string().min(1).transform((s) => decodeURIComponent(s)),
});

export const courseOfferingIdParamSchema = z.object({
  courseOfferingId: z.coerce.number().int().positive(),
});
