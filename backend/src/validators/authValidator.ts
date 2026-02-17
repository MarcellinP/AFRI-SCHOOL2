import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Validation rules
export const registerValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('role')
      .optional()
      .isIn(['student', 'parent', 'counselor'])
      .withMessage('Invalid role'),
  ];
};

export const loginValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ];
};

export const refreshTokenValidationRules = () => {
  return [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ];
};

// Validation middleware
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn('Validation error:', errors.array());
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      error: 'Please check your input',
      errors: errors.array().map((err: any) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }

  next();
};
