import { Request, Response, NextFunction } from "express";
import {
  listAssessmentsQuerySchema,
  assessmentIdParamSchema,
  attemptIdParamSchema,
  answerParamSchema,
  saveAnswerSchema,
} from "./assessmentValidation.js";
import {
  listAssessmentsForStudent,
  getAssessmentDetails,
  startAssessment,
  getActiveAttempt,
  saveAnswer,
  submitAttempt,
  getResult,
  getReview,
} from "./assessmentService.js";

export const listAssessmentsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = listAssessmentsQuerySchema.parse(req.query);
    const result = await listAssessmentsForStudent(req.userId!, filters);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Assessments retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId } = assessmentIdParamSchema.parse(req.params);
    const data = await getAssessmentDetails(req.userId!, assessmentId);
    res.status(200).json({ success: true, data, message: "Assessment retrieved successfully" });
  } catch (error) {
    next(error);
  }
};

export const startAssessmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId } = assessmentIdParamSchema.parse(req.params);
    const data = await startAssessment(req.userId!, assessmentId);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getActiveAttemptController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId } = assessmentIdParamSchema.parse(req.params);
    const data = await getActiveAttempt(req.userId!, assessmentId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const saveAnswerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId, attemptId, questionId } = answerParamSchema.parse(req.params);
    const { answer } = saveAnswerSchema.parse(req.body);
    await saveAnswer(req.userId!, assessmentId, attemptId, questionId, answer);
    res.status(200).json({ success: true, message: "Answer saved" });
  } catch (error) {
    next(error);
  }
};

export const submitAttemptController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId, attemptId } = attemptIdParamSchema.parse(req.params);
    const data = await submitAttempt(req.userId!, assessmentId, attemptId);
    res.status(200).json({ success: true, data, message: "Assessment submitted" });
  } catch (error) {
    next(error);
  }
};

export const getResultController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId } = assessmentIdParamSchema.parse(req.params);
    const data = await getResult(req.userId!, assessmentId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assessmentId, attemptId } = attemptIdParamSchema.parse(req.params);
    const data = await getReview(req.userId!, assessmentId, attemptId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
