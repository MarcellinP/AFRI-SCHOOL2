import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError';
import { AuthService } from '../services/AuthService';
import logger from '../utils/logger';

// Extend Express Request with user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to protect routes - requires valid JWT token
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verify token
    const payload = JwtService.verifyAccessToken(token);

    // Get user from database
    const user = await AuthService.getUserById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Attach user to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    logger.error('Auth protection error:', error);

    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: error.message,
      });
    }

    res.status(401).json({
      success: false,
      message: 'Unauthorized',
      error: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to authorize based on roles
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        error: 'No user data found',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by ${req.user.email} (${req.user.role})`
      );

      return res.status(403).json({
        success: false,
        message: 'Forbidden',
        error: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};

/**
 * Optional auth - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = JwtService.verifyAccessToken(token);

      const user = await AuthService.getUserById(payload.userId);
      if (user) {
        req.user = {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        };
      }
    }
  } catch (error) {
    logger.debug('Optional auth failed, continuing without user:', error);
  }

  next();
};
