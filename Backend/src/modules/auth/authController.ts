import { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./authValidation.js";
import {
  registerUser,
  loginUser,
  refreshTokens,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
  findOrCreateOAuthUser,
  AuthError,
} from "./authService.js";
import { env } from "../../config/env.js";
import { getGoogleAuthUrl, exchangeGoogleCode } from "../../lib/googleOAuth.js";
import { getGithubAuthUrl, exchangeGithubCode } from "../../lib/githubOAuth.js";
import { signOAuthState, verifyOAuthState } from "../../lib/oauthState.js";
import type { UserRole } from "../../utils/token.js";

const REFRESH_COOKIE_NAME = "refreshToken";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax" as const,
  domain: env.cookieDomain,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days; keep in sync with JWT_REFRESH_EXPIRES_IN
};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = registerSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await registerUser(
      name,
      email,
      password,
      role
    );

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.status(201).json({ success: true, data: { user, accessToken } });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.status(200).json({ success: true, data: { user, accessToken } });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!token) {
      throw new AuthError("No refresh token provided", 401);
    }

    const { user, accessToken, refreshToken } = await refreshTokens(token);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.status(200).json({ success: true, data: { user, accessToken } });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      ...refreshCookieOptions,
      maxAge: undefined,
    });
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

export const meController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getCurrentUser(req.userId!);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("[forgotPasswordController] hit, body:", req.body);
    const { email } = forgotPasswordSchema.parse(req.body);
    console.log("[forgotPasswordController] parsed email:", email);

    await requestPasswordReset(email);
    console.log("[forgotPasswordController] requestPasswordReset completed");

    // Same response whether or not the email exists — prevents account enumeration.
    res.status(200).json({
      success: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    await resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: "Password updated. You can now log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

// ---- OAuth: Google ----

function parseRoleParam(value: unknown): UserRole {
  return value === "TEACHER" ? "TEACHER" : "STUDENT";
}

function redirectWithOAuthError(res: Response, message: string) {
  const url = new URL("/login", env.frontendUrl);
  url.searchParams.set("oauth_error", message);
  res.redirect(url.toString());
}

export const googleRedirectController = (req: Request, res: Response) => {
  const role = parseRoleParam(req.query.role);
  const state = signOAuthState(role);
  res.redirect(getGoogleAuthUrl(state));
};

export const googleCallbackController = async (
  req: Request,
  res: Response
) => {
  try {
    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;

    if (!code || !state) {
      return redirectWithOAuthError(res, "Missing code or state from Google");
    }

    const { role } = verifyOAuthState(state);
    const profile = await exchangeGoogleCode(code);

    if (!profile.verified_email) {
      return redirectWithOAuthError(res, "Google email is not verified");
    }

    const { refreshToken } = await findOrCreateOAuthUser(
      "google",
      profile.id,
      profile.email,
      profile.name,
      role
    );

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.redirect(new URL("/oauth/callback", env.frontendUrl).toString());
  } catch (error) {
    console.error(error);
    redirectWithOAuthError(res, "Google sign-in failed");
  }
};

// ---- OAuth: GitHub ----

export const githubRedirectController = (req: Request, res: Response) => {
  const role = parseRoleParam(req.query.role);
  const state = signOAuthState(role);
  res.redirect(getGithubAuthUrl(state));
};

export const githubCallbackController = async (
  req: Request,
  res: Response
) => {
  try {
    const code = req.query.code as string | undefined;
    const state = req.query.state as string | undefined;

    if (!code || !state) {
      return redirectWithOAuthError(res, "Missing code or state from GitHub");
    }

    const { role } = verifyOAuthState(state);
    const profile = await exchangeGithubCode(code);

    const { refreshToken } = await findOrCreateOAuthUser(
      "github",
      String(profile.id),
      profile.email,
      profile.name,
      role
    );

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.redirect(new URL("/oauth/callback", env.frontendUrl).toString());
  } catch (error) {
    console.error(error);
    redirectWithOAuthError(res, "GitHub sign-in failed");
  }
};