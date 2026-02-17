import { body, param, query } from 'express-validator';

export const testValidator = {
  /**
   * Validate test creation
   */
  createTest: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Test title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),

    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['Aptitude', 'Subject', 'Career'])
      .withMessage(
        'Category must be one of: Aptitude, Subject, Career'
      ),

    body('subcategories')
      .isArray({ min: 1 })
      .withMessage('At least one subcategory is required')
      .custom((value) => {
        const validSubcategories = [
          'Verbal',
          'Numerical',
          'Logical',
          'Spatial',
          'Abstract',
          'Science',
          'Math',
          'English',
          'French',
          'Arabic',
          'Interests',
          'Strengths',
        ];
        return value.every((sub: string) =>
          validSubcategories.includes(sub)
        );
      })
      .withMessage('Invalid subcategory provided'),

    body('difficulty')
      .notEmpty()
      .withMessage('Difficulty is required')
      .isIn(['Easy', 'Medium', 'Hard'])
      .withMessage('Difficulty must be one of: Easy, Medium, Hard'),

    body('duration')
      .isInt({ min: 1, max: 480 })
      .withMessage('Duration must be between 1 and 480 minutes'),

    body('totalPoints')
      .isInt({ min: 1, max: 1000 })
      .withMessage('Total points must be between 1 and 1000'),

    body('passingScore')
      .isInt({ min: 0, max: 100 })
      .withMessage('Passing score must be between 0 and 100'),

    body('questions')
      .isArray({ min: 1 })
      .withMessage('At least one question is required'),

    body('questions.*.text')
      .trim()
      .notEmpty()
      .withMessage('Question text is required'),

    body('questions.*.type')
      .notEmpty()
      .withMessage('Question type is required')
      .isIn(['MultipleChoice', 'TrueFalse'])
      .withMessage('Question type must be MultipleChoice or TrueFalse'),

    body('questions.*.category')
      .notEmpty()
      .withMessage('Question category is required'),

    body('questions.*.difficulty')
      .notEmpty()
      .withMessage('Question difficulty is required')
      .isIn(['Easy', 'Medium', 'Hard'])
      .withMessage('Difficulty must be one of: Easy, Medium, Hard'),

    body('questions.*.points')
      .isInt({ min: 1, max: 100 })
      .withMessage('Points must be between 1 and 100'),

    body('questions.*.options')
      .isArray({ min: 2 })
      .withMessage('Question must have at least 2 options'),

    body('questions.*.correctOptionIndex')
      .isInt({ min: 0 })
      .custom((value, { req }) => {
        const path = req.path;
        // Get question index to check options length
        return value < 4; // Basic validation, specific check in service
      })
      .withMessage('Correct option index must be valid'),
  ],

  /**
   * Validate test update
   */
  updateTest: [
    param('id')
      .isMongoId()
      .withMessage('Invalid test ID'),

    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),

    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),

    body('difficulty')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard'])
      .withMessage('Difficulty must be one of: Easy, Medium, Hard'),

    body('duration')
      .optional()
      .isInt({ min: 1, max: 480 })
      .withMessage('Duration must be between 1 and 480 minutes'),

    body('passingScore')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Passing score must be between 0 and 100'),
  ],

  /**
   * Validate test ID parameter
   */
  getTest: [
    param('id')
      .isMongoId()
      .withMessage('Invalid test ID'),
  ],

  /**
   * Validate test delete
   */
  deleteTest: [
    param('id')
      .isMongoId()
      .withMessage('Invalid test ID'),
  ],

  /**
   * Validate list tests query
   */
  listTests: [
    query('category')
      .optional()
      .isIn(['Aptitude', 'Subject', 'Career'])
      .withMessage('Invalid category'),

    query('difficulty')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard'])
      .withMessage('Invalid difficulty'),

    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip must be a non-negative integer'),

    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
};
