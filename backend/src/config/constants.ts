// Application constants
export const APP_CONSTANTS = {
  // User roles
  ROLES: {
    STUDENT: 'student',
    PARENT: 'parent',
    COUNSELOR: 'counselor',
    ADMIN: 'admin',
  },

  // Subscription plans
  PLANS: {
    FREE: 'free',
    PREMIUM: 'premium',
    PRO: 'pro',
  },

  // Subscription pricing (in USD)
  PRICING: {
    free: 0,
    premium: 5,
    pro: 20,
  },

  // HTTP Status messages
  HTTP_MESSAGES: {
    SUCCESS: 'Success',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    BAD_REQUEST: 'Invalid request',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    CONFLICT: 'Resource conflict',
    INTERNAL_SERVER_ERROR: 'Internal server error',
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Time constants (in seconds)
  TIME: {
    JWT_EXPIRE: 15 * 60, // 15 minutes
    JWT_REFRESH_EXPIRE: 7 * 24 * 60 * 60, // 7 days
    CACHE_TTL: 60 * 60, // 1 hour
    SESSION_TTL: 24 * 60 * 60, // 1 day
  },

  // Rate limiting
  RATE_LIMIT: {
    GENERAL_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    GENERAL_MAX: 100,
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    AUTH_MAX: 5,
    PAYMENT_WINDOW_MS: 60 * 60 * 1000, // 1 hour
    PAYMENT_MAX: 10,
  },

  // Validation
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    PHONE_REGEX: /^\+?[\d\s\-()]{10,}$/,
  },

  // File uploads
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10 MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  },
};

export const CACHE_KEYS = {
  // User cache
  USER: (id: string) => `user:${id}`,
  USER_PROFILE: (id: string) => `user:profile:${id}`,

  // School cache
  SCHOOLS: 'schools:all',
  SCHOOL: (id: string) => `school:${id}`,
  SCHOOLS_BY_FIELD: (fieldId: string) => `schools:field:${fieldId}`,

  // Test cache
  TESTS: 'tests:all',
  TEST: (id: string) => `test:${id}`,

  // Field cache
  FIELDS: 'fields:all',
  FIELD: (id: string) => `field:${id}`,
};

export const STRIPE_EVENTS = {
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
};
