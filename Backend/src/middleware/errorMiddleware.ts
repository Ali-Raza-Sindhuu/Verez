import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { ZodError } from "zod";
import { AuthError } from "../modules/auth/authService.js";
import { CourseError } from "../modules/courses/courseService.js";
import { AssignmentError } from "../modules/assignments/assignmentService.js";
import { TeacherError } from "../modules/teacher/teacherService.js";
import { AssessmentError } from "../modules/assessments/assessmentService.js";
import { GradeError } from "../modules/grades/gradeService.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AssignmentError || error instanceof AssessmentError) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      code: error.code,
    });

    return;
  }

  if (
    error instanceof AuthError ||
    error instanceof CourseError ||
    error instanceof TeacherError ||
    error instanceof GradeError
  ) {
    // Expected client-side failures (validation, conflicts, no seats left,
    // etc.) — not server bugs, don't spam the logs.
    res.status(error.status).json({
      success: false,
      message: error.message,
    });

    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });

    return;
  }

  // Only log genuinely unexpected errors.
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
