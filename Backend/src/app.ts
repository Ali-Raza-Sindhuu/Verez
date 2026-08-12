import express from "express";
import cors from "cors";

import userRoutes from "./modules/users/userRoute.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { requirePermission } from "./middleware/rbacMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

// TEMPORARY test route — remove after verifying, before building real auth
app.get(
  "/api/test-rbac/:userId",
  (req, res, next) => {
    req.userId = Number(req.params.userId);
    next();
  },
  requirePermission("users.read"),
  (req, res) => {
    res.json({ success: true, message: "Permission granted" });
  }
);

app.use("/api/users", userRoutes);

app.use(errorMiddleware);

export default app;