'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api-client';
import TokenManager from '@/lib/token-manager';
import { IUser } from '@/types';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Refresh access token using httpOnly cookie
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ accessToken: string }>('/api/auth/refresh', {});

      if (!response.success) {
        throw new Error(response.message || 'Token refresh failed');
      }

      const { accessToken } = response.data!;
      TokenManager.setAccessToken(accessToken, 15 * 60 * 1000);
      return true;
    } catch (err) {
      console.error('Token refresh failed:', err);
      return false;
    }
  }, []);

  /**
   * Login user with email and password
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        user: IUser;
        accessToken: string;
      }>('/api/auth/login', { email, password });

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { user, accessToken } = response.data!;
      TokenManager.setAccessToken(accessToken, 15 * 60 * 1000);

      authStore.setUser(user);
      authStore.setAuthenticated(true);

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authenticated', 'true');
      }

      router.push('/dashboard');
      return { success: true, message: 'Login successful!' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [authStore, router]);

  /**
   * Register new user
   */
  const register = useCallback(async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        user: IUser;
        accessToken: string;
      }>('/api/auth/register', userData);

      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }

      const { user, accessToken } = response.data!;
      TokenManager.setAccessToken(accessToken, 15 * 60 * 1000);

      authStore.setUser(user);
      authStore.setAuthenticated(true);

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authenticated', 'true');
      }

      router.push('/dashboard');
      return { success: true, message: 'Registration successful!' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      console.error('Registration error:', err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [authStore, router]);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/api/auth/logout', {});
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      TokenManager.clear();
      authStore.logout();

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('authenticated');
      }

      setIsLoading(false);
      router.push('/auth/login');
    }
  }, [authStore, router]);

  /**
   * Get current user
   */
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await apiClient.get<{ user: IUser }>('/api/auth/me');

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user');
      }

      const user = response.data!.user;
      authStore.setUser(user);

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    } catch (err) {
      console.error('Failed to get current user:', err);
      return null;
    }
  }, [authStore]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: string): boolean => {
    if (!authStore.user) return false;
    return authStore.user.role === role;
  }, [authStore.user]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    if (!authStore.user) return false;

    const rolePermissions: Record<string, string[]> = {
      admin: ['read', 'write', 'delete', 'manage'],
      educator: ['read', 'write', 'manage'],
      student: ['read'],
    };

    const userPermissions = rolePermissions[authStore.user.role] || [];
    return userPermissions.includes(permission);
  }, [authStore.user]);

  /**
   * Initialize authentication on app startup
   */
  const initializeAuth = useCallback(async () => {
    setIsLoading(true);

    try {
      if (typeof window === 'undefined') return;

      const authenticated = localStorage.getItem('authenticated') === 'true';
      const userStr = localStorage.getItem('user');

      if (authenticated && userStr) {
        try {
          const user = JSON.parse(userStr) as IUser;
          authStore.setUser(user);

          const refreshed = await refreshToken();
          if (refreshed) {
            authStore.setAuthenticated(true);
          } else {
            localStorage.removeItem('user');
            localStorage.removeItem('authenticated');
            authStore.logout();
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('user');
          localStorage.removeItem('authenticated');
          authStore.logout();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [authStore, refreshToken]);

  /**
   * Get token information (for debugging)
   */
  const getTokenInfo = useCallback(() => {
    return TokenManager.getTokenInfo();
  }, []);

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshToken,
    getCurrentUser,
    hasRole,
    hasPermission,
    initializeAuth,
    getTokenInfo,
  };
}
