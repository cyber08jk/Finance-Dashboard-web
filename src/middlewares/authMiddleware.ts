import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken, JWTPayload } from '../utils/auth.js';
import { AuthenticationError } from '../utils/errors.js';
import { userRepository } from '../repositories/UserRepository.js';
import { UserStatus } from '../models/User.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AuthenticationError('Account is inactive. Contact an administrator');
    }

    // Keep role/email in sync with latest database state instead of trusting stale JWT claims.
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError('Invalid or expired token');
  }
};
