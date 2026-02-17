import { Role, IRole } from '../models/Role';
import { DEFAULT_ROLES } from '../config/permissions';
import logger from '../utils/logger';

/**
 * Seed the database with default roles and permissions
 * Should be run once during application initialization or setup
 */
export const seedRoles = async (): Promise<void> => {
  try {
    logger.info('🌱 Starting role seeding...');

    // Check if roles already exist
    const existingRoles = await Role.countDocuments({});

    if (existingRoles > 0) {
      logger.info('✅ Roles already seeded, skipping...');
      return;
    }

    // Create default roles
    const rolesToCreate = Object.values(DEFAULT_ROLES);

    const createdRoles = await Role.insertMany(rolesToCreate);

    logger.info(`✅ Successfully seeded ${createdRoles.length} default roles:`);
    createdRoles.forEach((role: IRole) => {
      logger.info(`   - ${role.displayName} (${role.name})`);
    });
  } catch (error) {
    logger.error('❌ Error seeding roles:', error);
    throw error;
  }
};

/**
 * Add a new permission to a role
 */
export const addPermissionToRole = async (
  roleName: string,
  resource: string,
  action: string,
  permissionName?: string
): Promise<IRole | null> => {
  try {
    const role = await Role.findOne({ name: roleName.toLowerCase() });

    if (!role) {
      logger.warn(`Role not found: ${roleName}`);
      return null;
    }

    // Check if permission already exists
    const exists = role.permissions.some(
      (perm) =>
        perm.resource === resource.toLowerCase() &&
        perm.action === action.toLowerCase()
    );

    if (exists) {
      logger.info(`Permission already exists for role ${roleName}`);
      return role;
    }

    // Add permission
    role.permissions.push({
      name: permissionName || `${action}_${resource}`,
      description: `${action} ${resource}`,
      resource: resource.toLowerCase(),
      action: action.toLowerCase(),
    });

    await role.save();
    logger.info(`✅ Permission added: ${resource}:${action} to ${roleName}`);

    return role;
  } catch (error) {
    logger.error('Error adding permission to role:', error);
    throw error;
  }
};

/**
 * Remove a permission from a role
 */
export const removePermissionFromRole = async (
  roleName: string,
  resource: string,
  action: string
): Promise<IRole | null> => {
  try {
    const role = await Role.findOne({ name: roleName.toLowerCase() });

    if (!role) {
      return null;
    }

    role.permissions = role.permissions.filter(
      (perm) =>
        !(
          perm.resource === resource.toLowerCase() &&
          perm.action === action.toLowerCase()
        )
    );

    await role.save();
    logger.info(`✅ Permission removed: ${resource}:${action} from ${roleName}`);

    return role;
  } catch (error) {
    logger.error('Error removing permission from role:', error);
    throw error;
  }
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = async (
  roleName: string
): Promise<any[] | null> => {
  try {
    const role = await Role.findOne({ name: roleName.toLowerCase() });

    if (!role) {
      return null;
    }

    return role.permissions;
  } catch (error) {
    logger.error('Error getting role permissions:', error);
    throw error;
  }
};

/**
 * List all roles with their permissions
 */
export const listAllRoles = async (): Promise<IRole[]> => {
  try {
    return await Role.find({ isActive: true }).sort({ name: 1 });
  } catch (error) {
    logger.error('Error listing roles:', error);
    throw error;
  }
};
