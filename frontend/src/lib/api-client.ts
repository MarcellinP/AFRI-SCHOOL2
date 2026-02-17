import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants';
import { IApiResponse } from '@/types';
import TokenManager from './token-manager';

/**
 * API Client with JWT Authentication and Auto-Refresh
 * 
 * Security Strategy:
 * - Access Token: Stored in memory (secure)
 * - Refresh Token: httpOnly cookie (secure, auto-sent)
 * - Automatic token refresh on 401
 * - Interceptors for request/response handling
 */
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshQueue: Array<() => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      withCredentials: true, // Enable sending cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add access token to all requests
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = TokenManager.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor - Handle 401 and refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized - Token might be expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Prevent multiple simultaneous refresh attempts
          if (this.isRefreshing) {
            // Queue this request to retry after token is refreshed
            return new Promise((resolve) => {
              this.refreshQueue.push(() => {
                resolve(this.client(originalRequest));
              });
            });
          }

          this.isRefreshing = true;
          originalRequest._retry = true;

          try {
            // Attempt to refresh the token using the httpOnly cookie
            const response = await this.refreshAccessToken();

            if (response.success) {
              // Process queued requests
              this.refreshQueue.forEach((callback) => callback());
              this.refreshQueue = [];

              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${TokenManager.getAccessToken()}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Token refresh failed, redirect to login
            this.handleAuthenticationFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Refresh access token using httpOnly cookie
   */
  private async refreshAccessToken(): Promise<IApiResponse> {
    try {
      const response = await axios.post<IApiResponse>(
        `${API_BASE_URL}/auth/refresh`,
        {}, // Empty body - cookie is auto-sent
        {
          withCredentials: true, // Enable sending cookies
          timeout: API_TIMEOUT,
        }
      );

      if (response.data.success && response.data.data?.accessToken) {
        // Store new access token in memory
        TokenManager.setAccessToken(response.data.data.accessToken);
        return response.data;
      }

      throw new Error('Invalid refresh response');
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Handle authentication failure (invalid/expired refresh token)
   */
  private handleAuthenticationFailure(): void {
    TokenManager.clear();

    // Clear user data from localStorage if needed
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('authenticated');
    }

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  async get<T = unknown>(url: string, config?: any): Promise<IApiResponse<T>> {
    try {
      const response = await this.client.get<IApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T = unknown>(url: string, data?: any, config?: any): Promise<IApiResponse<T>> {
    try {
      const response = await this.client.post<IApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T = unknown>(url: string, data?: any, config?: any): Promise<IApiResponse<T>> {
    try {
      const response = await this.client.put<IApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T = unknown>(url: string, data?: any, config?: any): Promise<IApiResponse<T>> {
    try {
      const response = await this.client.patch<IApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T = unknown>(url: string, config?: any): Promise<IApiResponse<T>> {
    try {
      const response = await this.client.delete<IApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): IApiResponse {
    const response = error.response;

    if (response) {
      return {
        success: false,
        message: response.data?.message || 'An error occurred',
        error: response.data?.error,
        statusCode: response.status,
      };
    }

    if (error.request) {
      return {
        success: false,
        message: 'No response from server',
        error: 'Network error',
        statusCode: 0,
      };
    }

    return {
      success: false,
      message: error.message || 'An error occurred',
      error: error.message,
      statusCode: 0,
    };
  }
}

export const apiClient = new ApiClient();
