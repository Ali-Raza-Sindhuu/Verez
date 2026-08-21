import { Request, Response, NextFunction } from "express";
import { semesterParamSchema, courseOfferingIdParamSchema } from "./gradeValidation.js";
import {
  getGPAOverview,
  listSemesterGPAHistory,
  listCourseGradesForSemester,
  getCourseGradeDetail,
  getTranscript,
} from "./gradeService.js";

export const getOverviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getGPAOverview(req.userId!);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const listSemestersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await listSemesterGPAHistory(req.userId!);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSemesterCoursesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { semester } = semesterParamSchema.parse(req.params);
    const data = await listCourseGradesForSemester(req.userId!, semester);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCourseGradeController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseOfferingId } = courseOfferingIdParamSchema.parse(req.params);
    const data = await getCourseGradeDetail(req.userId!, courseOfferingId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTranscriptController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getTranscript(req.userId!);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
