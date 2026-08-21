import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  listAssignmentsController,
  getAssignmentController,
  getSubmissionController,
  createSubmissionController,
  updateSubmissionController,
  deleteSubmissionController,
  getAttachmentsController,
  getGradeController,
} from "./assignmentController.js";

const router = Router();

router.use(requireAuth);

router.get("/", listAssignmentsController);
router.get("/:assignmentId", getAssignmentController);
router.get("/:assignmentId/submission", getSubmissionController);
router.post("/:assignmentId/submission", createSubmissionController);
router.patch("/:assignmentId/submission", updateSubmissionController);
router.delete("/:assignmentId/submission", deleteSubmissionController);
router.get("/:assignmentId/attachments", getAttachmentsController);
router.get("/:assignmentId/grade", getGradeController);

export default router;
