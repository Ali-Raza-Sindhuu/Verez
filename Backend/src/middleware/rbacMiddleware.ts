import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";

// Temporary: until JWT auth exists, req.userId is attached manually for testing.
// Later, an auth middleware will set this from the decoded JWT.
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function requirePermission(permissionName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRoles = await prisma.userRole.findMany({
        where: { userId: req.userId },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      const permissionNames = new Set<string>();
      for (const userRole of userRoles) {
        for (const rolePermission of userRole.role.rolePermissions) {
          permissionNames.add(rolePermission.permission.name);
        }
      }

      if (!permissionNames.has(permissionName)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireBranchAccess(getBranchId: (req: Request) => number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const branchId = getBranchId(req);

      const access = await prisma.userBranch.findUnique({
        where: {
          userId_branchId: {
            userId: req.userId,
            branchId,
          },
        },
      });

      if (!access) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this branch",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}