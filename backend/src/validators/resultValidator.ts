import { body, param, query } from 'express-validator';

export const resultValidator = {
  /**
   * Validate test submission
   */
  submitTest: [
    body('testId')
      .isMongoId()
      .withMessage('Invalid test ID'),

    body('answers')
      .isArray({ min: 1 })
      .withMessage('Answers array is required and must contain at least one answer'),

    body('answers.*.questionId')
      .isMongoId()
      .withMessage('Invalid question ID'),

    body('answers.*.selectedOptionIndex')
      .isInt({ min: 0, max: 3 })
      .withMessage('Selected option index must be between 0 and 3'),

    body('startTime')
      .isISO8601()
      .withMessage('Start time must be a valid ISO 8601 date'),

    body('endTime')
      .isISO8601()
      .withMessage('End time must be a valid ISO 8601 date')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startTime)) {
          throw new Error('End time must be after start time');
        }
        return true;
      }),
  ],

  /**
   * Validate result ID parameter
   */
  getResult: [
    param('id')
      .isMongoId()
      .withMessage('Invalid result ID'),
  ],

  /**
   * Validate pagination queries
   */
  getResults: [
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip must be a non-negative integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  /**
   * Validate admin get all results
   */
  getAllResults: [
    query('studentId')
      .optional()
      .isMongoId()
      .withMessage('Invalid student ID'),

    query('testId')
      .optional()
      .isMongoId()
      .withMessage('Invalid test ID'),

    query('status')
      .optional()
      .isIn(['pass', 'fail'])
      .withMessage('Status must be pass or fail'),

    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip must be a non-negative integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  /**
   * Validate analysis request
   */
  getAnalysis: [
    param('id')
      .isMongoId()
      .withMessage('Invalid result ID'),
  ],
};
