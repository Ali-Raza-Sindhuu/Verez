import { Request, Response, NextFunction } from "express";
import {
  listAssignmentsQuerySchema,
  assignmentIdParamSchema,
  createSubmissionSchema,
  updateSubmissionSchema,
} from "./assignmentValidation.js";
import {
  listAssignmentsForStudent,
  getAssignmentDetails,
  createSubmission,
  updateSubmission,
  deleteSubmission,
  getSubmission,
  getAssignmentAttachments,
  getAssignmentGrade,
} from "./assignmentService.js";

export const listAssignmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters = listAssignmentsQuerySchema.parse(req.query);
    const result = await listAssignmentsForStudent(req.userId!, filters);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: "Assignments retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    const data = await getAssignmentDetails(req.userId!, assignmentId);
    res.status(200).json({
      success: true,
      data,
      message: "Assignment retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    const data = await getSubmission(req.userId!, assignmentId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createSubmissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    const input = createSubmissionSchema.parse(req.body);
    const data = await createSubmission(req.userId!, assignmentId, input);
    res.status(201).json({
      success: true,
      data,
      message: "Submission received",
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubmissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    const input = updateSubmissionSchema.parse(req.body);
    const data = await updateSubmission(req.userId!, assignmentId, input);
    res.status(200).json({
      success: true,
      data,
      message: "Submission updated",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmissionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    await deleteSubmission(req.userId!, assignmentId);
    res.status(200).json({ success: true, message: "Submission deleted" });
  } catch (error) {
    next(error);
  }
};

export const getAttachmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    const data = await getAssignmentAttachments(req.userId!, assignmentId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getGradeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = assignmentIdParamSchema.parse(req.params);
    const data = await getAssignmentGrade(req.userId!, assignmentId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
