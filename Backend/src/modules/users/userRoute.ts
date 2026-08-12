import { Router } from "express";

import {
  createUserController,
  getUserByIdController,
  getUsersController,
} from "./userController.js";

const router = Router();

router.post("/", createUserController);

router.get("/", getUsersController);

router.get("/:id", getUserByIdController);

export default router;