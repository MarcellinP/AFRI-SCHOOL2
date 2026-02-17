import { Router } from 'express';
import { TestController } from '../controllers/TestController';
import { testValidator } from '../validators/testValidator';
import { protect, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';

const router = Router();

/**
 * ADMIN ROUTES - Specific routes first to avoid parameter capture
 */

/**
 * GET /api/tests/stats/overview
 * Get test statistics
 */
router.get(
  '/stats/overview',
  protect,
  authorize(['admin']),
  (req, res) => {
    res.json({success: true, message: 'Stats endpoint'});
  }
);

/**
 * POST /api/tests
 * Create new test
 */
router.post(
  '/',
  protect,
  authorize(['admin']),
  TestController.createTest
);

/**
 * PUBLIC ROUTES - Any authenticated user
 */

/**
 * GET /api/tests/:id/questions
 * Get test questions for taking test
 */
router.get(
  '/:id/questions',
  protect,
  TestController.getTestQuestions
);

/**
 * GET /api/tests/:id
 * Get test details
 */
router.get(
  '/:id',
  protect,
  TestController.getTestById
);

/**
 * PUT /api/tests/:id
 * Update test
 */
router.put(
  '/:id',
  protect,
  authorize(['admin']),
  TestController.updateTest
);

/**
 * DELETE /api/tests/:id
 * Delete test
 */
router.delete(
  '/:id',
  protect,
  authorize(['admin']),
  TestController.deleteTest
);

/**
 * GET /api/tests
 * List all tests with filtering
 */
router.get(
  '/',
  protect,
  TestController.listTests
);

export default router;
