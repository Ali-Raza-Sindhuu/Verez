import { z } from "zod";

export const createAcademicYearSchema = z.object({
  name: z.string().min(4),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const createSemesterSchema = z.object({
  name: z.string().min(1),
  term: z.string().min(1),
  academicYearId: z.number().int().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const createCourseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  category: z.string().default("core"),
  level: z.string().default("100"),
  credits: z.number().int().nonnegative().default(3),
  department: z.string().min(1),
});

export const createCourseOfferingSchema = z.object({
  courseId: z.number().int().positive(),
  semesterId: z.number().int().positive(),
  teacherId: z.number().int().positive().optional(),
  scheduleDays: z.array(z.string()).default([]),
  startTime: z.string().default("09:00"),
  endTime: z.string().default("10:00"),
  room: z.string().default("TBA"),
  seatsTotal: z.number().int().positive().default(30),
});

export const assignTeacherSchema = z.object({
  teacherId: z.number().int().positive(),
});

export const courseOfferingIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
