import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(8000),

  FRONTEND_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),

  REDIS_URL: z.string().min(1),

  CLERK_PUBLISHABLE_KEY: z.string().min(1),

  CLERK_SECRET_KEY: z.string().min(1),

  RESEND_API_KEY: z.string().min(1),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment variables:");
  console.error(result.error.flatten().fieldErrors);

  process.exit(1);
}

export const env = {
  nodeEnv: result.data.NODE_ENV,
  port: result.data.PORT,

  frontendUrl: result.data.FRONTEND_URL,

  databaseUrl: result.data.DATABASE_URL,
  redisUrl: result.data.REDIS_URL,

  clerkPublishableKey: result.data.CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: result.data.CLERK_SECRET_KEY,

  resendApiKey: result.data.RESEND_API_KEY,
};