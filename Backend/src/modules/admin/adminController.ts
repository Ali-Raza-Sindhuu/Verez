import { Request, Response, NextFunction } from "express";
import * as adminService from "./adminService.js";
import {
  createAcademicYearSchema,
  createSemesterSchema,
  createCourseSchema,
  createCourseOfferingSchema,
  assignTeacherSchema,
  courseOfferingIdParamSchema,
} from "./adminValidation.js";

export const createAcademicYearController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createAcademicYearSchema.parse(req.body);
    const result = await adminService.createAcademicYear(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createSemesterController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createSemesterSchema.parse(req.body);
    const result = await adminService.createSemester(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createCourseController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCourseSchema.parse(req.body);
    const result = await adminService.createCourse(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const createCourseOfferingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCourseOfferingSchema.parse(req.body);
    const result = await adminService.createCourseOffering(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const assignTeacherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = courseOfferingIdParamSchema.parse(req.params);
    const { teacherId } = assignTeacherSchema.parse(req.body);
    const result = await adminService.assignTeacherToOffering(id, teacherId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
