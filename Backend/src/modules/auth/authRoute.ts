import { Router } from "express";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  meController,
  forgotPasswordController,
  resetPasswordController,
  googleRedirectController,
  googleCallbackController,
  githubRedirectController,
  githubCallbackController,
} from "./authController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", requireAuth, meController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

// OAuth — ?role=STUDENT|TEACHER is optional, only used if a new account gets created
router.get("/google", googleRedirectController);
router.get("/google/callback", googleCallbackController);
router.get("/github", githubRedirectController);
router.get("/github/callback", githubCallbackController);

export default router;
