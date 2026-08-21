import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  listAssessmentsController,
  getAssessmentController,
  startAssessmentController,
  getActiveAttemptController,
  saveAnswerController,
  submitAttemptController,
  getResultController,
  getReviewController,
} from "./assessmentController.js";

const router = Router();

router.use(requireAuth);

router.get("/", listAssessmentsController);
router.get("/:assessmentId", getAssessmentController);
router.post("/:assessmentId/start", startAssessmentController);
router.get("/:assessmentId/attempt", getActiveAttemptController);
router.put("/:assessmentId/attempts/:attemptId/answers/:questionId", saveAnswerController);
router.post("/:assessmentId/attempts/:attemptId/submit", submitAttemptController);
router.get("/:assessmentId/result", getResultController);
router.get("/:assessmentId/attempts/:attemptId/review", getReviewController);

export default router;
