import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.js";

// Requires a valid access token in the Authorization header.
// Rejects the request if missing/invalid/expired.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    req.userRole = payload.role;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
}

// Attaches req.userId/req.userRole if a valid access token is present, but
// doesn't reject the request if it's missing. Useful for optional-auth routes.
export function attachAuthIfPresent(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length);
    try {
      const payload = verifyAccessToken(token);
      req.userId = payload.userId;
      req.userRole = payload.role;
    } catch {
      // ignore invalid token, treat as unauthenticated
    }
  }

  next();
}