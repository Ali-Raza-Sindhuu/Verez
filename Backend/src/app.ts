import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());

// Attaches req.auth to every request — does NOT protect routes yet
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Vexez API is running" });
});



export default app;