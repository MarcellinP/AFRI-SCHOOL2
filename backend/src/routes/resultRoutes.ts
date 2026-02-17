import { Router } from 'express';
import { ResultController } from '../controllers/ResultController';
import { resultValidator } from '../validators/resultValidator';
import { protect, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validation';

const router = Router();

/**
 * STUDENT ROUTES - Authenticated students
 */

/**
 * POST /api/results/submit
 * Submit test answers
 */
router.post(
  '/submit',
  protect,
  authorize(['student', 'admin', 'counselor']),
  ResultController.submitTest
);

/**
 * GET /api/results
 * Get my test results
 */
router.get(
  '/',
  protect,
  authorize(['student', 'admin', 'counselor']),
  ResultController.getMyResults
);

/**
 * GET /api/results/:id
 * Get specific result details
 */
router.get(
  '/:id',
  protect,
  authorize(['student', 'admin', 'counselor']),
  ResultController.getResultById
);

/**
 * GET /api/results/:id/recommendations
 * Get recommendations from result
 */
router.get(
  '/:id/recommendations',
  protect,
  authorize(['student', 'admin', 'counselor']),
  ResultController.getRecommendations
);

/**
 * GET /api/results/:id/analysis
 * Get detailed result analysis
 */
router.get(
  '/:id/analysis',
  protect,
  authorize(['student', 'admin', 'counselor']),
  ResultController.getAnalysis
);

/**
 * GET /api/results/stats/me
 * Get my statistics
 */
router.get(
  '/stats/me',
  protect,
  authorize(['student', 'admin', 'counselor']),
  ResultController.getMyStats
);

/**
 * ADMIN/COUNSELOR ROUTES
 */

/**
 * GET /api/results/admin/all
 * Get all results with filtering
 */
router.get(
  '/admin/all',
  protect,
  authorize(['admin', 'counselor']),
  ResultController.getAllResults
);

export default router;
