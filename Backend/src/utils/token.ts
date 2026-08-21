import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface TokenPayload {
  userId: number;
  role: UserRole;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn,
  } as jwt.SignOptions);
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
}

export interface ResetTokenPayload {
  userId: number;
  purpose: "password-reset";
}

export function signResetToken(payload: { userId: number }): string {
  const data: ResetTokenPayload = { userId: payload.userId, purpose: "password-reset" };
  return jwt.sign(data, env.jwtResetSecret, {
    expiresIn: env.jwtResetExpiresIn,
  } as jwt.SignOptions);
}

export function verifyResetToken(token: string): ResetTokenPayload {
  const payload = jwt.verify(token, env.jwtResetSecret) as ResetTokenPayload;
  if (payload.purpose !== "password-reset") {
    throw new Error("Invalid token purpose");
  }
  return payload;
}