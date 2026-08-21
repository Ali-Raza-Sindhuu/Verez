import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { requireRole } from "../../middleware/rbacMiddleware.js";
import {
  createAcademicYearController,
  createSemesterController,
  createCourseController,
  createCourseOfferingController,
  assignTeacherController,
} from "./adminController.js";

const router = Router();

// All admin routes require ADMIN role
router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.post("/academic-years", createAcademicYearController);
router.post("/semesters", createSemesterController);
router.post("/courses", createCourseController);
router.post("/offerings", createCourseOfferingController);
router.patch("/offerings/:id/assign-teacher", assignTeacherController);

export default router;
