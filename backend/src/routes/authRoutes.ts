import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import {
  registerValidationRules,
  loginValidationRules,
  refreshTokenValidationRules,
  validate,
} from '../validators/authValidator';
import { authLimiter } from '../middlewares/rateLimiter';
import { protect } from '../middlewares/auth';

const router = Router();

/**
 * Auth Routes
 */

// Register - POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  registerValidationRules(),
  validate,
  AuthController.register
);

// Login - POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  loginValidationRules(),
  validate,
  AuthController.login
);

// Refresh Token - POST /api/auth/refresh
router.post(
  '/refresh',
  refreshTokenValidationRules(),
  validate,
  AuthController.refreshToken
);

// Logout - POST /api/auth/logout
router.post('/logout', protect, AuthController.logout);

// Get Current User - GET /api/auth/me
router.get('/me', protect, AuthController.getCurrentUser);

export default router;
