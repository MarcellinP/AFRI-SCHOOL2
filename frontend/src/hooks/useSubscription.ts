import { useCallback, useState, useEffect } from 'react';
import { useSubscriptionStore } from '@/store/subscription.store';
import { apiClient } from '@/lib/api-client';
import { ErrorUtils } from '@/utils';
import { ISubscription } from '@/types';

export const useSubscription = () => {
  const subscriptionStore = useSubscriptionStore();

  const fetchSubscription = useCallback(async () => {
    subscriptionStore.setLoading(true);
    subscriptionStore.setError(null);

    try {
      const response = await apiClient.get<ISubscription>('/subscriptions/my-subscription');

      if (response.success && response.data) {
        subscriptionStore.setSubscription(response.data);
      } else {
        subscriptionStore.setError(response.message || 'Failed to fetch subscription');
      }
    } catch (error) {
      const errorMessage = ErrorUtils.getErrorMessage(error);
      subscriptionStore.setError(errorMessage);
    } finally {
      subscriptionStore.setLoading(false);
    }
  }, [subscriptionStore]);

  const upgradeToPremium = useCallback(
    async (paymentMethodId: string) => {
      subscriptionStore.setLoading(true);
      subscriptionStore.setError(null);

      try {
        const response = await apiClient.post<ISubscription>('/subscriptions/upgrade-premium', {
          paymentMethodId,
        });

        if (response.success && response.data) {
          subscriptionStore.setSubscription(response.data);
          return response.data;
        } else {
          subscriptionStore.setError(response.message || 'Upgrade failed');
        }
      } catch (error) {
        const errorMessage = ErrorUtils.getErrorMessage(error);
        subscriptionStore.setError(errorMessage);
      } finally {
        subscriptionStore.setLoading(false);
      }
    },
    [subscriptionStore]
  );

  const downgradeToFree = useCallback(async () => {
    subscriptionStore.setLoading(true);
    subscriptionStore.setError(null);

    try {
      const response = await apiClient.post('/api/subscriptions/downgrade-free', {});

      if (response.success) {
        subscriptionStore.setSubscription(null);
        return true;
      } else {
        subscriptionStore.setError(response.message || 'Downgrade failed');
        return false;
      }
    } catch (error) {
      const errorMessage = ErrorUtils.getErrorMessage(error);
      subscriptionStore.setError(errorMessage);
      return false;
    } finally {
      subscriptionStore.setLoading(false);
    }
  }, [subscriptionStore]);

  const cancelSubscription = useCallback(async () => {
    subscriptionStore.setLoading(true);
    subscriptionStore.setError(null);

    try {
      const response = await apiClient.post('/api/subscriptions/cancel', {});

      if (response.success) {
        subscriptionStore.setSubscription(null);
        return true;
      } else {
        subscriptionStore.setError(response.message || 'Cancellation failed');
        return false;
      }
    } catch (error) {
      const errorMessage = ErrorUtils.getErrorMessage(error);
      subscriptionStore.setError(errorMessage);
      return false;
    } finally {
      subscriptionStore.setLoading(false);
    }
  }, [subscriptionStore]);

  return {
    subscription: subscriptionStore.subscription,
    isLoading: subscriptionStore.isLoading,
    error: subscriptionStore.error,
    isPremium: subscriptionStore.isPremium,
    isEnterprise: subscriptionStore.isEnterprise,
    fetchSubscription,
    upgradeToPremium,
    downgradeToFree,
    cancelSubscription,
  };
};
