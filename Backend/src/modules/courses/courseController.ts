import { Request, Response, NextFunction } from "express";
import {
  availableOfferingsQuerySchema,
  registerCoursesSchema,
  dropEnrollmentParamsSchema,
} from "./courseValidation.js";
import {
  getAvailableOfferings,
  getMyEnrollments,
  registerCourses,
  dropEnrollment,
} from "./courseService.js";

export const getMyEnrollmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enrollments = await getMyEnrollments(req.userId!);
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
};

export const getAvailableCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = availableOfferingsQuerySchema.parse(req.query);
    const offerings = await getAvailableOfferings(filters);
    res.status(200).json({ success: true, data: offerings });
  } catch (error) {
    next(error);
  }
};

export const registerCoursesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { offeringIds, semesterId } = registerCoursesSchema.parse(req.body);
    const enrollments = await registerCourses(req.userId!, offeringIds, semesterId);
    res.status(201).json({ success: true, data: enrollments });
  } catch (error) {
    next(error);
  }
};

export const dropEnrollmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = dropEnrollmentParamsSchema.parse(req.params);
    await dropEnrollment(req.userId!, id);
    res.status(200).json({ success: true, message: "Course dropped" });
  } catch (error) {
    next(error);
  }
};
