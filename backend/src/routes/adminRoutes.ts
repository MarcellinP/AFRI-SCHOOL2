import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/Role';
import { catchAsync } from '../middlewares/errorHandler';
import { BadRequestError, NotFoundError } from '../utils/AppError';
import { seedRoles, addPermissionToRole, removePermissionFromRole, listAllRoles } from '../services/RoleService';
import logger from '../utils/logger';

const router = Router();

/**
 * Admin Routes - Role Management
 * All routes are protected and require admin role
 */

// GET /api/admin/roles - List all roles
router.get(
  '/roles',
  protect,
  authorize('admin'),
  catchAsync(async (req, res) => {
    const roles = await listAllRoles();

    res.status(200).json({
      success: true,
      message: 'Roles retrieved successfully',
      data: { roles },
    });
  })
);

// GET /api/admin/roles/:id - Get role details
router.get(
  '/roles/:id',
  protect,
  authorize('admin'),
  catchAsync(async (req, res) => {
    const role = await Role.findById(req.params.id);

    if (!role) {
      throw new NotFoundError('Role not found');
    }

    res.status(200).json({
      success: true,
      message: 'Role retrieved successfully',
      data: { role },
    });
  })
);

// POST /api/admin/roles/seed - Seed default roles
router.post(
  '/roles/seed',
  protect,
  authorize('admin'),
  catchAsync(async (req, res) => {
    await seedRoles();

    res.status(201).json({
      success: true,
      message: 'Roles seeded successfully',
    });
  })
);

// POST /api/admin/roles/:roleId/permissions - Add permission to role
router.post(
  '/roles/:roleId/permissions',
  protect,
  authorize('admin'),
  catchAsync(async (req, res) => {
    const { roleId } = req.params;
    const { resource, action, name } = req.body;

    if (!resource || !action) {
      throw new BadRequestError('Resource and action are required');
    }

    const role = await Role.findById(roleId);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // Check if permission already exists
    const exists = role.permissions.some(
      (perm) =>
        perm.resource === resource.toLowerCase() &&
        perm.action === action.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        error: 'Permission already exists for this role',
      });
    }

    role.permissions.push({
      name: name || `${action}_${resource}`,
      description: `${action} ${resource}`,
      resource: resource.toLowerCase(),
      action: action.toLowerCase(),
    });

    await role.save();
    logger.info(`Permission added to role ${role.name} by ${req.user?.email}`);

    res.status(201).json({
      success: true,
      message: 'Permission added successfully',
      data: { role },
    });
  })
);

// DELETE /api/admin/roles/:roleId/permissions/:permissionId - Remove permission
router.delete(
  '/roles/:roleId/permissions/:permissionId',
  protect,
  authorize('admin'),
  catchAsync(async (req, res) => {
    const { roleId, permissionId } = req.params;

    const role = await Role.findById(roleId);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // Remove permission by index
    const index = role.permissions.findIndex(
      (p) => p._id?.toString() === permissionId
    );

    if (index === -1) {
      throw new NotFoundError('Permission not found');
    }

    role.permissions.splice(index, 1);
    await role.save();

    logger.info(`Permission removed from role ${role.name} by ${req.user?.email}`);

    res.status(200).json({
      success: true,
      message: 'Permission removed successfully',
      data: { role },
    });
  })
);

// GET /api/admin/users - List users (admin only)
router.get(
  '/users',
  protect,
  authorize('admin'),
  catchAsync(async (req, res) => {
    const { role, skip = 0, limit = 20 } = req.query;

    const filter: any = { isActive: true };
    if (role) filter.role = role;

    const users = await require('../models/User').User.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .select('-password');

    const total = await require('../models/User').User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          total,
          skip: Number(skip),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  })
);

export default router;
