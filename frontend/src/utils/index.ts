// JWT Token Management
export const TokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  setRefreshToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  },

  getRefreshToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },

  removeRefreshToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh_token');
    }
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  decodeToken: (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },
};

// Form Validation Utilities
export const ValidationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    return password.length >= 8;
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  },

  isValidName: (name: string): boolean => {
    return name.length >= 2 && name.length <= 50;
  },
};

// Date and Time Utilities
export const DateUtils = {
  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString();
  },

  formatTime: (date: string | Date): string => {
    return new Date(date).toLocaleTimeString();
  },

  formatDateTime: (date: string | Date): string => {
    return new Date(date).toLocaleString();
  },

  formatRelative: (date: string | Date): string => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return past.toLocaleDateString();
  },

  isWithinLast24Hours: (date: string | Date): boolean => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();
    return diff < 24 * 60 * 60 * 1000;
  },
};

// String Utilities
export const StringUtils = {
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  titleCase: (str: string): string => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  truncate: (str: string, length: number): string => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },

  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  getInitials: (firstName: string, lastName: string): string => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  },
};

// Number Utilities
export const NumberUtils = {
  formatScore: (score: number, totalScore: number): string => {
    const percentage = (score / totalScore) * 100;
    return `${score}/${totalScore} (${percentage.toFixed(2)}%)`;
  },

  formatPercentage: (percentage: number, decimals: number = 2): string => {
    return `${percentage.toFixed(decimals)}%`;
  },

  roundToTwo: (num: number): number => {
    return Math.round(num * 100) / 100;
  },

  clamp: (num: number, min: number, max: number): number => {
    return Math.max(min, Math.min(max, num));
  },
};

// Class Name Utilities
export const classNameUtils = {
  cn: (...classes: (string | undefined | false | null)[]): string => {
    return classes.filter((cls) => typeof cls === 'string').join(' ');
  },
};

// Error Handling Utilities
export const ErrorUtils = {
  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'An error occurred';
  },

  isNetworkError: (error: any): boolean => {
    return !error.response && error.request;
  },

  isServerError: (error: any): boolean => {
    return error.response?.status >= 500;
  },

  isClientError: (error: any): boolean => {
    return error.response?.status >= 400 && error.response?.status < 500;
  },
};
