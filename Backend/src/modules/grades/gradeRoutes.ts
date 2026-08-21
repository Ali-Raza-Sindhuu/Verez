import { Router } from "express";
import { requireAuth } from "../../middleware/authMiddleware.js";
import {
  getOverviewController,
  listSemestersController,
  getSemesterCoursesController,
  getCourseGradeController,
  getTranscriptController,
} from "./gradeController.js";

const router = Router();

router.use(requireAuth);

router.get("/overview", getOverviewController);
router.get("/semesters", listSemestersController);
// :semester is the semester name string, e.g. "Fall%202026"
router.get("/semester/:semester", getSemesterCoursesController);
// :courseOfferingId is the offering ID
router.get("/offerings/:courseOfferingId", getCourseGradeController);
router.get("/transcript", getTranscriptController);

export default router;
