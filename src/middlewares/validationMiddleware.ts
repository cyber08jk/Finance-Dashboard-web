import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';

// Validates req.body against a Zod schema
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          fields[field] = err.message;
        });
        throw new ValidationError('Validation failed', fields);
      }
      throw error;
    }
  };
};

// Validates req.query against a Zod schema
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      // Merge parsed values back onto req.query (coercion results)
      Object.assign(req.query, parsed);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fields: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          fields[field] = err.message;
        });
        throw new ValidationError('Query parameter validation failed', fields);
      }
      throw error;
    }
  };
};
