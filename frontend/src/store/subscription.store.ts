import { create } from 'zustand';
import { ISubscription } from '@/types';

interface SubscriptionState {
  subscription: ISubscription | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSubscription: (subscription: ISubscription | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  isPremium: () => boolean;
  isEnterprise: () => boolean;
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  isLoading: false,
  error: null,

  setSubscription: (subscription) => set({ subscription }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  isPremium: () => {
    const { subscription } = get();
    return subscription?.planType === 'PREMIUM' || subscription?.planType === 'ENTERPRISE';
  },

  isEnterprise: () => {
    const { subscription } = get();
    return subscription?.planType === 'ENTERPRISE';
  },

  reset: () => set({
    subscription: null,
    isLoading: false,
    error: null,
  }),
}));
