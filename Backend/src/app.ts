import express from "express";
import cors from "cors";

import userRoutes from "./modules/users/userRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

app.use("/api/users", userRoutes);

export default app;