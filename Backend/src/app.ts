import express from "express";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./config/cors.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRoute from "./modules/auth/authRoute.js";
import userRoute from "./modules/users/userRoute.js";
import courseRoute from "./modules/courses/courseRoute.js";
import assignmentRoute from "./modules/assignments/assignmentRoutes.js";
import teacherRoute from "./modules/teacher/teacherRoutes.js";
import assessmentRoute from "./modules/assessments/assessmentRoutes.js";
import gradeRoute from "./modules/grades/gradeRoutes.js";
import adminRoute from "./modules/admin/adminRoutes.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Vexez API is running" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/courses", courseRoute);
app.use("/api/assignments", assignmentRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/assessments", assessmentRoute);
app.use("/api/grades", gradeRoute);
app.use("/api/admin", adminRoute);


app.use(errorMiddleware);

export default app;
