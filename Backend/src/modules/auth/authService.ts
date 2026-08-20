import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  signResetToken,
  verifyResetToken,
  type UserRole,
} from "../../utils/token.js";
import { sendPasswordResetEmail } from "../../lib/resend.js";
import { env } from "../../config/env.js";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  provider: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = "STUDENT"
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AuthError("An account with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
    select: publicUserSelect,
  });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  return { user, accessToken, refreshToken };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  if (!user.password) {
    throw new AuthError(
      `This account uses ${user.provider ?? "social"} sign-in. Log in with that instead.`,
      400
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AuthError("Invalid email or password", 401);
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  const { password: _password, ...publicUser } = user;

  return { user: publicUser, accessToken, refreshToken };
}

// Finds a user by (provider, providerId). If not found, links to an existing
// account with the same email (OAuth providers guarantee verified emails),
// or creates a new user. Returns our own JWT pair either way.
export async function findOrCreateOAuthUser(
  provider: "google" | "github",
  providerId: string,
  email: string,
  name: string,
  role: UserRole
) {
  let user = await prisma.user.findUnique({
    where: { provider_providerId: { provider, providerId } },
    select: publicUserSelect,
  });

  if (!user) {
    const existingByEmail = await prisma.user.findUnique({ where: { email } });

    if (existingByEmail) {
      user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: { provider, providerId },
        select: publicUserSelect,
      });
    } else {
      user = await prisma.user.create({
        data: { name, email, role, provider, providerId },
        select: publicUserSelect,
      });
    }
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

  return { user, accessToken, refreshToken };
}

export async function refreshTokens(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError("Invalid or expired refresh token", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: publicUserSelect,
  });

  if (!user) {
    throw new AuthError("User no longer exists", 401);
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user.id, role: user.role });

  return { user, accessToken, refreshToken: newRefreshToken };
}

export async function getCurrentUser(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });
}

// Always resolves successfully regardless of whether the email exists —
// callers must not use this to reveal account existence (enumeration risk).
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  console.log("[requestPasswordReset] lookup for", email, "-> found:", !!user, "has password:", user?.password ? true : false);

  if (!user || !user.password) {
    console.log("[requestPasswordReset] no-op (no user or OAuth-only account)");
    return; // no-op for missing accounts and OAuth-only accounts alike
  }

  const resetToken = signResetToken({ userId: user.id });
  const resetUrl = `${env.frontendUrl}/reset-password?token=${resetToken}`;
  console.log("[requestPasswordReset] sending to:", user.email, "url:", resetUrl);

  await sendPasswordResetEmail(user.email, resetUrl);
  console.log("[requestPasswordReset] sendPasswordResetEmail resolved");
}

export async function resetPassword(token: string, newPassword: string) {
  let payload;
  try {
    payload = verifyResetToken(token);
  } catch {
    throw new AuthError("Invalid or expired reset link", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new AuthError("Invalid or expired reset link", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
}