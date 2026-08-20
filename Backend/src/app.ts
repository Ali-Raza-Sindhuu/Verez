import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./config/cors.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRoute from "./modules/auth/authRoute.js";
import userRoute from "./modules/users/userRoute.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Vexez API is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.use(errorMiddleware);

export default app;
