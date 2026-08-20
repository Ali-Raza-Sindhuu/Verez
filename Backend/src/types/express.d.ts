import type { UserRole } from "../utils/token.js";

// Central augmentation for Express's Request type.
// Do not redeclare `req.userId`/`req.userRole` elsewhere — import/rely on this file instead.
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: UserRole;
    }
  }
}

export {};