import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");

    app.listen(env.port, () => {
      console.log(
        `Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    await prisma.$disconnect();

    process.exit(1);
  }
};

startServer();