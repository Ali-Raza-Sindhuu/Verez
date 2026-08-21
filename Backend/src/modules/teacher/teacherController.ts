import { Request, Response, NextFunction } from "express";
import {
  courseOfferingIdParamSchema,
  createAssignmentSchema,
  updateAssignmentSchema,
  assignmentIdParamSchema,
  submissionIdParamSchema,
  gradeSubmissionSchema,
} from "./teacherValidation.js";
import {
  listMyOfferings,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  listSubmissionsForAssignment,
  gradeSubmission,
} from "./teacherService.js";

export const listMyOfferingsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offerings = await listMyOfferings(req.userId!);
    res.status(200).json({ success: true, data: offerings });
  } catch (error) {
    next(error);
  }
};

export const createAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseOfferingId } = courseOfferingIdParamSchema.parse(req.params);
    const data = createAssignmentSchema.parse(req.body);
    const assignment = await createAssignment(req.userId!, courseOfferingId, data);
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

export const updateAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    const data = updateAssignmentSchema.parse(req.body);
    const assignment = await updateAssignment(req.userId!, assignmentId, data);
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

export const deleteAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    await deleteAssignment(req.userId!, assignmentId);
    res.status(200).json({ success: true, message: "Assignment deleted" });
  } catch (error) {
    next(error);
  }
};

export const listSubmissionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    const submissions = await listSubmissionsForAssignment(req.userId!, assignmentId);
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    next(error);
  }
};

export const gradeSubmissionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { submissionId } = submissionIdParamSchema.parse(req.params);
    const data = gradeSubmissionSchema.parse(req.body);
    const submission = await gradeSubmission(req.userId!, submissionId, data);
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};
