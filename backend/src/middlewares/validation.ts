import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError';

export const validate = (validators?: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // If no validators provided, just continue
      if (!validators) {
        return next();
      }

      // Run all validators
      if (Array.isArray(validators)) {
        await Promise.all(validators.map(validator => validator.run(req)));
      } else {
        await validators.run(req);
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const messages = errors.array().map(err => `${err.param}: ${err.msg}`);
        throw new AppError(messages.join(', '), 400);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
