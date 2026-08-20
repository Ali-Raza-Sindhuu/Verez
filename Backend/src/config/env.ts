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

  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  JWT_RESET_SECRET: z.string().min(32, "JWT_RESET_SECRET must be at least 32 characters"),
  JWT_RESET_EXPIRES_IN: z.string().default("30m"),

  COOKIE_DOMAIN: z.string().optional(),

  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),

  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  GITHUB_REDIRECT_URI: z.string().url(),
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

  jwtAccessSecret: result.data.JWT_ACCESS_SECRET,
  jwtRefreshSecret: result.data.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: result.data.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshExpiresIn: result.data.JWT_REFRESH_EXPIRES_IN,

  jwtResetSecret: result.data.JWT_RESET_SECRET,
  jwtResetExpiresIn: result.data.JWT_RESET_EXPIRES_IN,

  cookieDomain: result.data.COOKIE_DOMAIN,

  resendApiKey: result.data.RESEND_API_KEY,
  resendFromEmail: result.data.RESEND_FROM_EMAIL,

  googleClientId: result.data.GOOGLE_CLIENT_ID,
  googleClientSecret: result.data.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: result.data.GOOGLE_REDIRECT_URI,

  githubClientId: result.data.GITHUB_CLIENT_ID,
  githubClientSecret: result.data.GITHUB_CLIENT_SECRET,
  githubRedirectUri: result.data.GITHUB_REDIRECT_URI,
};
