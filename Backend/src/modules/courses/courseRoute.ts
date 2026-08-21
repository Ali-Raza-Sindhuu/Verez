import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  getMyEnrollmentsController,
  getAvailableCoursesController,
  registerCoursesController,
  dropEnrollmentController,
} from "./courseController.js";

const router = Router();

router.use(requireAuth);

// "My Courses" — the student's registered enrollments
router.get("/", getMyEnrollmentsController);

// Catalog browsing for registration
router.get("/available", getAvailableCoursesController);

// Batch registration — creates Enrollment rows, never Course rows.
// Course catalog management is a separate teacher/admin concern, not here.
router.post("/register", registerCoursesController);

// Drop a course (soft — flips status to "dropped", frees the seat)
router.patch("/enrollments/:id/drop", dropEnrollmentController);

export default router;
