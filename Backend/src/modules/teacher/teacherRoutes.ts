import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/rbacMiddleware.js";
import {
  listMyOfferingsController,
  createAssignmentController,
  updateAssignmentController,
  deleteAssignmentController,
  listSubmissionsController,
  gradeSubmissionController,
} from "./teacherController.js";

const router = Router();

router.use(requireAuth, requireRole("TEACHER"));

// Course offerings — teachers view their admin-assigned offerings only
router.get("/offerings", listMyOfferingsController);

// Assignments — scoped to offerings the teacher owns
router.post("/offerings/:courseOfferingId/assignments", createAssignmentController);
router.patch("/assignments/:assignmentId", updateAssignmentController);
router.delete("/assignments/:assignmentId", deleteAssignmentController);

// Grading
router.get("/assignments/:assignmentId/submissions", listSubmissionsController);
router.patch("/submissions/:submissionId/grade", gradeSubmissionController);

export default router;
