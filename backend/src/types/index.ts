// User types
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'parent' | 'counselor' | 'admin';
  subscriptionPlan: 'free' | 'premium' | 'pro';
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload
export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Response types
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Pagination
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Auth response
export interface IAuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

// Token response
export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Request with user
export interface IAuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}
