import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/AppError';

interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  status: number;
  stack?: string;
}

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const statusCode =
    err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : 'Internal Server Error';

  // Log error
  logger.error({
    message: err.message,
    statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Send response
  const errorResponse: ErrorResponse = {
    success: false,
    message: 'An error occurred',
    error: message,
    status: statusCode,
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack || '';
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper for route handlers
export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler - must be last
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new AppError(
    `Route ${req.originalUrl} not found`,
    404
  );
  next(err);
};
