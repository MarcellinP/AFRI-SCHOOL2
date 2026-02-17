import { create } from 'zustand';
import { ITest, ITestResult, IProgram } from '@/types';

interface TestState {
  currentTest: ITest | null;
  currentResult: ITestResult | null;
  testHistory: ITestResult[];
  recommendations: IProgram[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentTest: (test: ITest | null) => void;
  setCurrentResult: (result: ITestResult | null) => void;
  setTestHistory: (results: ITestResult[]) => void;
  setRecommendations: (programs: IProgram[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  currentTest: null,
  currentResult: null,
  testHistory: [],
  recommendations: [],
  isLoading: false,
  error: null,

  setCurrentTest: (test) => set({ currentTest: test }),
  setCurrentResult: (result) => set({ currentResult: result }),
  setTestHistory: (results) => set({ testHistory: results }),
  setRecommendations: (programs) => set({ recommendations: programs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reset: () => set({
    currentTest: null,
    currentResult: null,
    testHistory: [],
    recommendations: [],
    isLoading: false,
    error: null,
  }),
}));
