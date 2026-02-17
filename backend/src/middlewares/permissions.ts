import { Request, Response, NextFunction } from 'express';
import { Role } from '../models/Role';
import { UnauthorizedError, ForbiddenError } from '../utils/AppError';
import logger from '../utils/logger';

/**
 * Middleware to check if user has permission
 * Usage: router.post('/admin/users', protect, hasPermission('users', 'create'), handler)
 */
export const hasPermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      // Get user role from database
      const role = await Role.findOne({ name: req.user.role, isActive: true });

      if (!role) {
        logger.warn(`Role not found: ${req.user.role}`);
        throw new ForbiddenError('Role not found or inactive');
      }

      // Check if role has permission
      const hasAccess = role.hasPermission(resource, action);

      if (!hasAccess) {
        logger.warn(
          `Permission denied for user ${req.user.email} (${req.user.role}) ` +
          `trying to ${action} ${resource}`
        );

        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: `You do not have permission to ${action} ${resource}`,
        });
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);

      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        return res.status(error instanceof UnauthorizedError ? 401 : 403).json({
          success: false,
          message: error instanceof UnauthorizedError ? 'Unauthorized' : 'Forbidden',
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: 'An error occurred while checking permissions',
      });
    }
  };
};

/**
 * Middleware to check multiple permissions (OR logic)
 * Usage: router.get('/reports', protect, hasAnyPermission(['reports', 'read']), handler)
 */
export const hasAnyPermission = (permissions: Array<[string, string]>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const role = await Role.findOne({ name: req.user.role, isActive: true });

      if (!role) {
        throw new ForbiddenError('Role not found or inactive');
      }

      // Check if user has at least one permission
      const hasAccess = permissions.some(([resource, action]) =>
        role.hasPermission(resource, action)
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'You do not have permission to access this resource',
        });
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);

      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        return res.status(error instanceof UnauthorizedError ? 401 : 403).json({
          success: false,
          message: error instanceof UnauthorizedError ? 'Unauthorized' : 'Forbidden',
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: 'An error occurred',
      });
    }
  };
};

/**
 * Middleware to check multiple permissions (AND logic)
 * Usage: router.delete('/admin/users/:id', protect, hasAllPermissions([['users', 'delete'], ['users', 'read']]), handler)
 */
export const hasAllPermissions = (permissions: Array<[string, string]>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const role = await Role.findOne({ name: req.user.role, isActive: true });

      if (!role) {
        throw new ForbiddenError('Role not found or inactive');
      }

      // Check if user has all permissions
      const hasAccess = permissions.every(([resource, action]) =>
        role.hasPermission(resource, action)
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
          error: 'You do not have all required permissions',
        });
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);

      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        return res.status(error instanceof UnauthorizedError ? 401 : 403).json({
          success: false,
          message: error instanceof UnauthorizedError ? 'Unauthorized' : 'Forbidden',
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Permission check failed',
        error: 'An error occurred',
      });
    }
  };
};
