import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User.js';
import { AuthorizationError, AuthenticationError } from '../utils/errors.js';
import { hasPermission, Permission } from '../config/permissions.js';

// Middleware to require specific role(s)
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('User not authenticated');
    }

    const userRole = req.user.role as UserRole;
    if (!roles.includes(userRole)) {
      throw new AuthorizationError(
        `This action requires one of the following roles: ${roles.join(', ')}`
      );
    }

    next();
  };
};

// Middleware to require specific permission(s)
export const requirePermission = (...permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('User not authenticated');
    }

    const userRole = req.user.role as UserRole;
    const hasRequiredPermission = permissions.some((permission) =>
      hasPermission(userRole, permission)
    );

    if (!hasRequiredPermission) {
      throw new AuthorizationError(
        `Insufficient permissions. Required: ${permissions.join(', ')}`
      );
    }

    next();
  };
};

// Middleware for attribute-based access control
// Checks if user can access a specific resource (their own or if admin)
export const canAccessRecord = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AuthenticationError('User not authenticated');
  }

  const userRole = req.user.role as UserRole;
  const ownerUserId = req.params.userId || req.body.user_id;

  // Admin can access anything
  if (userRole === UserRole.ADMIN) {
    return next();
  }

  // Others can only access their own resources
  if (req.user.userId !== ownerUserId) {
    throw new AuthorizationError('You can only access your own records');
  }

  next();
};
