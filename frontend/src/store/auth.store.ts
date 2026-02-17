import { create } from 'zustand';
import { IUser, UserRole } from '@/types';
import { TokenManager } from '@/utils';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: IUser) => void;
  setToken: (token: string) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (role: UserRole) => boolean;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  logout: () => {
    TokenManager.clear();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  hasRole: (role: UserRole): boolean => {
    const { user } = get();
    return user?.role === role;
  },

  hasPermission: (requiredRole: UserRole): boolean => {
    const { user } = get();
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.STUDENT]: 1,
      [UserRole.ADVISOR]: 2,
      [UserRole.ADMIN]: 3,
      [UserRole.SUPERADMIN]: 4,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = TokenManager.getToken();
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({
            token,
            user,
            isAuthenticated: true,
          });
        } catch {
          TokenManager.clear();
          set({
            token: null,
            user: null,
            isAuthenticated: false,
          });
        }
      }
    }
  },
}));
