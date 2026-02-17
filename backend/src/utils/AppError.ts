// Custom error class
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factory functions
export const NotFoundError = (message: string) =>
  new AppError(message, 404);

export const BadRequestError = (message: string) =>
  new AppError(message, 400);

export const UnauthorizedError = (message: string) =>
  new AppError(message, 401);

export const ForbiddenError = (message: string) =>
  new AppError(message, 403);

export const ConflictError = (message: string) =>
  new AppError(message, 409);

export const ValidationError = (message: string) =>
  new AppError(message, 422);
