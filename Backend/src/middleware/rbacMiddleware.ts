import { Request, Response, NextFunction } from "express";
import type { UserRole } from "../utils/token.js";

// req.userId/req.userRole are set by requireAuth (authMiddleware.ts) after
// verifying the access token. Type augmentation lives in src/types/express.d.ts.

// Use after requireAuth on any route that should only be reachable by
// specific roles, e.g.:
//   router.post("/courses", requireAuth, requireRole("TEACHER"), createCourse)
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId || !req.userRole) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(req.userRole)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
      return;
    }

    next();
  };
}