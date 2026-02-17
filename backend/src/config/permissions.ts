// Permissions du système
export const PERMISSIONS = {
  // Users
  USER_CREATE: { resource: 'users', action: 'create', name: 'Create Users' },
  USER_READ: { resource: 'users', action: 'read', name: 'Read Users' },
  USER_UPDATE: { resource: 'users', action: 'update', name: 'Update Users' },
  USER_DELETE: { resource: 'users', action: 'delete', name: 'Delete Users' },

  // Schools
  SCHOOL_CREATE: { resource: 'schools', action: 'create', name: 'Create Schools' },
  SCHOOL_READ: { resource: 'schools', action: 'read', name: 'Read Schools' },
  SCHOOL_UPDATE: { resource: 'schools', action: 'update', name: 'Update Schools' },
  SCHOOL_DELETE: { resource: 'schools', action: 'delete', name: 'Delete Schools' },

  // Programs/Fields
  PROGRAM_CREATE: { resource: 'programs', action: 'create', name: 'Create Programs' },
  PROGRAM_READ: { resource: 'programs', action: 'read', name: 'Read Programs' },
  PROGRAM_UPDATE: { resource: 'programs', action: 'update', name: 'Update Programs' },
  PROGRAM_DELETE: { resource: 'programs', action: 'delete', name: 'Delete Programs' },

  // Tests
  TEST_CREATE: { resource: 'tests', action: 'create', name: 'Create Tests' },
  TEST_READ: { resource: 'tests', action: 'read', name: 'Read Tests' },
  TEST_UPDATE: { resource: 'tests', action: 'update', name: 'Update Tests' },
  TEST_DELETE: { resource: 'tests', action: 'delete', name: 'Delete Tests' },

  // Results
  RESULT_CREATE: { resource: 'results', action: 'create', name: 'Create Results' },
  RESULT_READ: { resource: 'results', action: 'read', name: 'Read Results' },
  RESULT_UPDATE: { resource: 'results', action: 'update', name: 'Update Results' },
  RESULT_DELETE: { resource: 'results', action: 'delete', name: 'Delete Results' },

  // Subscriptions
  SUBSCRIPTION_CREATE: { resource: 'subscriptions', action: 'create', name: 'Create Subscriptions' },
  SUBSCRIPTION_READ: { resource: 'subscriptions', action: 'read', name: 'Read Subscriptions' },
  SUBSCRIPTION_UPDATE: { resource: 'subscriptions', action: 'update', name: 'Update Subscriptions' },
  SUBSCRIPTION_DELETE: { resource: 'subscriptions', action: 'delete', name: 'Delete Subscriptions' },

  // Reports
  REPORT_READ: { resource: 'reports', action: 'read', name: 'Read Reports' },
  REPORT_CREATE: { resource: 'reports', action: 'create', name: 'Create Reports' },

  // Admin
  ADMIN_ACCESS: { resource: 'admin', action: 'read', name: 'Admin Access' },
};

export const DEFAULT_ROLES = {
  ADMIN: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access with all permissions',
    isSystem: true,
    permissions: [
      // All permissions for admin (ensure `description` exists for each permission)
      ...Object.values(PERMISSIONS).map((p) => ({ ...p, description: (p as any).name || '' })),
    ],
  },

  COUNSELOR: {
    name: 'counselor',
    displayName: 'Orientation Counselor',
    description: 'Can manage tests, view results, and provide guidance',
    isSystem: true,
    permissions: [
      PERMISSIONS.TEST_READ,
      PERMISSIONS.TEST_CREATE,
      PERMISSIONS.RESULT_READ,
      PERMISSIONS.RESULT_CREATE,
      PERMISSIONS.SCHOOL_READ,
      PERMISSIONS.PROGRAM_READ,
      PERMISSIONS.REPORT_READ,
      PERMISSIONS.USER_READ,
    ].map((p) => ({ ...p, description: (p as any).name || '' })),
  },

  STUDENT: {
    name: 'student',
    displayName: 'Student',
    description: 'Can take tests and view recommendations',
    isSystem: true,
    permissions: [
      PERMISSIONS.TEST_READ,
      PERMISSIONS.TEST_CREATE, // Can start tests
      PERMISSIONS.RESULT_READ,
      PERMISSIONS.RESULT_CREATE,
      PERMISSIONS.SCHOOL_READ,
      PERMISSIONS.PROGRAM_READ,
    ].map((p) => ({ ...p, description: (p as any).name || '' })),
  },

  PARENT: {
    name: 'parent',
    displayName: 'Parent',
    description: 'Can monitor student progress and recommendations',
    isSystem: true,
    permissions: [
      PERMISSIONS.RESULT_READ,
      PERMISSIONS.SCHOOL_READ,
      PERMISSIONS.PROGRAM_READ,
    ].map((p) => ({ ...p, description: (p as any).name || '' })),
  },
};
