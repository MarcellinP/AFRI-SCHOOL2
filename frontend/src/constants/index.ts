// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  DASHBOARD: '/dashboard',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_TESTS: '/dashboard/tests',
  DASHBOARD_RESULTS: '/dashboard/results',
  TEST: '/test',
  TEST_ID: (id: string) => `/test/${id}`,
  TEST_RESULT: (id: string) => `/test/${id}/result`,
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_SCHOOLS: '/admin/schools',
  ADMIN_PROGRAMS: '/admin/programs',
  ADMIN_TESTS: '/admin/tests',
  ADMIN_RESULTS: '/admin/results',
  PRICING: '/pricing',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_NOT_FOUND: 'User not found.',
  SCHOOL_NOT_FOUND: 'School not found.',
  PROGRAM_NOT_FOUND: 'Program not found.',
  TEST_NOT_FOUND: 'Test not found.',
  RESULT_NOT_FOUND: 'Result not found.',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again later.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  INVALID_PASSWORD: 'Password must be at least 8 characters.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully.',
  REGISTER_SUCCESS: 'Account created successfully. Please check your email to verify your account.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  TEST_SUBMITTED: 'Test submitted successfully.',
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_REGEX: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  TRUE_FALSE: 'TRUE_FALSE',
  RATING: 'RATING',
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
};

// Program Levels
export const PROGRAM_LEVELS = {
  BACHELOR: 'BACHELOR',
  MASTER: 'MASTER',
  DIPLOMA: 'DIPLOMA',
  CERTIFICATE: 'CERTIFICATE',
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
  ENTERPRISE: 'ENTERPRISE',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Time Delays (in milliseconds)
export const DELAYS = {
  DEBOUNCE: 300,
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
};

// Categories for Tests
export const TEST_CATEGORIES = [
  'Mathematics',
  'Science',
  'Language',
  'Logic',
  'Creativity',
  'Communication',
  'Problem Solving',
  'Technical Skills',
];

// User Roles
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  ADVISOR: 'ADVISOR',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
};

// Test Status
export const TEST_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  GRADED: 'GRADED',
};

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  CANCELLED: 'CANCELLED',
};
