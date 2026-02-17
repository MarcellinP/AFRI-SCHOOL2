import { useState, useCallback, useEffect } from 'react';
import { useTestStore } from '@/store/test.store';
import { apiClient } from '@/lib/api-client';
import { ErrorUtils } from '@/utils';
import { ITest, ITestResult, IStudentAnswer } from '@/types';

export const useTest = () => {
  const testStore = useTestStore();
  const [tests, setTests] = useState<ITest[]>([]);

  const fetchTests = useCallback(async () => {
    testStore.setLoading(true);
    testStore.setError(null);

    try {
      const response = await apiClient.get<ITest[]>('/tests');

      if (response.success && response.data) {
        setTests(response.data);
      } else {
        testStore.setError(response.message || 'Failed to fetch tests');
      }
    } catch (error) {
      const errorMessage = ErrorUtils.getErrorMessage(error);
      testStore.setError(errorMessage);
    } finally {
      testStore.setLoading(false);
    }
  }, [testStore]);

  const getTest = useCallback(
    async (testId: string) => {
      testStore.setLoading(true);
      testStore.setError(null);

      try {
        const response = await apiClient.get<ITest>(`/tests/${testId}`);

        if (response.success && response.data) {
          testStore.setCurrentTest(response.data);
          return response.data;
        } else {
          testStore.setError(response.message || 'Failed to fetch test');
        }
      } catch (error) {
        const errorMessage = ErrorUtils.getErrorMessage(error);
        testStore.setError(errorMessage);
      } finally {
        testStore.setLoading(false);
      }
    },
    [testStore]
  );

  const submitTest = useCallback(
    async (testId: string, answers: IStudentAnswer[]) => {
      testStore.setLoading(true);
      testStore.setError(null);

      try {
        const response = await apiClient.post<ITestResult>('/results/submit', {
          testId,
          answers,
        });

        if (response.success && response.data) {
          testStore.setCurrentResult(response.data);
          testStore.setRecommendations(response.data.recommendations.map((r) => r.program));
          return response.data;
        } else {
          testStore.setError(response.message || 'Failed to submit test');
        }
      } catch (error) {
        const errorMessage = ErrorUtils.getErrorMessage(error);
        testStore.setError(errorMessage);
      } finally {
        testStore.setLoading(false);
      }
    },
    [testStore]
  );

  const getMyResults = useCallback(async () => {
    testStore.setLoading(true);
    testStore.setError(null);

    try {
      const response = await apiClient.get<ITestResult[]>('/results/my-results');

      if (response.success && response.data) {
        testStore.setTestHistory(response.data);
      } else {
        testStore.setError(response.message || 'Failed to fetch results');
      }
    } catch (error) {
      const errorMessage = ErrorUtils.getErrorMessage(error);
      testStore.setError(errorMessage);
    } finally {
      testStore.setLoading(false);
    }
  }, [testStore]);

  const getResult = useCallback(
    async (resultId: string) => {
      testStore.setLoading(true);
      testStore.setError(null);

      try {
        const response = await apiClient.get<ITestResult>(`/results/${resultId}`);

        if (response.success && response.data) {
          testStore.setCurrentResult(response.data);
          testStore.setRecommendations(response.data.recommendations.map((r) => r.program));
          return response.data;
        } else {
          testStore.setError(response.message || 'Failed to fetch result');
        }
      } catch (error) {
        const errorMessage = ErrorUtils.getErrorMessage(error);
        testStore.setError(errorMessage);
      } finally {
        testStore.setLoading(false);
      }
    },
    [testStore]
  );

  const getRecommendations = useCallback(
    async (resultId: string) => {
      try {
        const response = await apiClient.get(`/results/${resultId}/recommendations`);

        if (response.success && response.data) {
          testStore.setRecommendations(response.data.recommendations.map((r: any) => r.program));
          return response.data;
        }
      } catch (error) {
        const errorMessage = ErrorUtils.getErrorMessage(error);
        testStore.setError(errorMessage);
      }
    },
    [testStore]
  );

  return {
    tests,
    currentTest: testStore.currentTest,
    currentResult: testStore.currentResult,
    testHistory: testStore.testHistory,
    recommendations: testStore.recommendations,
    isLoading: testStore.isLoading,
    error: testStore.error,
    fetchTests,
    getTest,
    submitTest,
    getMyResults,
    getResult,
    getRecommendations,
  };
};
