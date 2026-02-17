import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// School validation rules
export const createSchoolValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('School name is required')
      .isLength({ min: 3 })
      .withMessage('School name must be at least 3 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('abbreviation')
      .trim()
      .notEmpty()
      .withMessage('Abbreviation is required')
      .isLength({ min: 2, max: 10 })
      .withMessage('Abbreviation must be 2-10 characters'),
    body('location')
      .trim()
      .notEmpty()
      .withMessage('Location (city) is required'),
    body('country')
      .trim()
      .notEmpty()
      .withMessage('Country is required'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone is required'),
    body('schoolType')
      .isIn(['Public', 'Private', 'International'])
      .withMessage('School type must be Public, Private, or International'),
    body('studentCapacity')
      .isInt({ min: 1 })
      .withMessage('Student capacity must be at least 1'),
    body('establishedYear')
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage(`Established year must be between 1800 and ${new Date().getFullYear()}`),
    body('averageFees')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Average fees must be a positive number'),
    body('admissionRate')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Admission rate must be between 0 and 100'),
  ];
};

// Update validation (most fields optional)
export const updateSchoolValidationRules = () => {
  return [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage('School name must be at least 3 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('abbreviation')
      .optional()
      .trim()
      .isLength({ min: 2, max: 10 })
      .withMessage('Abbreviation must be 2-10 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('schoolType')
      .optional()
      .isIn(['Public', 'Private', 'International'])
      .withMessage('School type must be Public, Private, or International'),
    body('studentCapacity')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Student capacity must be at least 1'),
    body('establishedYear')
      .optional()
      .isInt({ min: 1800, max: new Date().getFullYear() })
      .withMessage(`Established year must be between 1800 and ${new Date().getFullYear()}`),
    body('averageFees')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Average fees must be a positive number'),
    body('admissionRate')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Admission rate must be between 0 and 100'),
  ];
};

// Validation middleware
export const validateSchool = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn('School validation error:', errors.array());
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
