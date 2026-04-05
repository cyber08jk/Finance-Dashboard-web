import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.js';

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

export const comparePassword = async (password: string, passwordHash: string): Promise<boolean> => {
  return await bcryptjs.compare(password, passwordHash);
};

// JWT utilities
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, envConfig.jwt.secret, {
    expiresIn: envConfig.jwt.expiration as string,
  } as any);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, envConfig.jwt.secret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};
