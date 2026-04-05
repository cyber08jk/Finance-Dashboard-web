import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';

export interface ErrorResponse {
  status: number;
  error_code: string;
  message: string;
  timestamp: string;
  fields?: Record<string, string>;
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error response
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let fields: Record<string, string> | undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorCode = error.errorCode;
    message = error.message;

    if (error instanceof ValidationError) {
      fields = error.fields;
    }
  } else {
    // Log unexpected errors for debugging
    console.error('Unexpected error:', error);
  }

  const errorResponse: ErrorResponse = {
    status: statusCode,
    error_code: errorCode,
    message,
    timestamp: new Date().toISOString(),
  };

  if (fields) {
    errorResponse.fields = fields;
  }

  res.status(statusCode).json(errorResponse);
};
