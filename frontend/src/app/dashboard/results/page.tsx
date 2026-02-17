'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTest } from '@/hooks/useTest';
import { ROUTES } from '@/constants';

export default function ResultsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { testHistory, getMyResults, isLoading } = useTest();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      getMyResults();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
            <Link href={ROUTES.DASHBOARD} className="text-primary-600 hover:text-primary-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading results...</p>
            </div>
          </div>
        ) : testHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-600 mb-6">You haven't taken any tests yet. Start a test to see your results.</p>
            <Link
              href={ROUTES.DASHBOARD_TESTS}
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
            >
              Take a Test
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {testHistory.map((result) => (
              <div key={result.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{result.test.title}</h3>
                      <p className="text-gray-600 text-sm">
                        Submitted on {new Date(result.submittedAt || result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-semibold ${
                      result.totalPercentage >= result.test.passingScore
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.totalPercentage.toFixed(2)}%
                    </span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Score</p>
                      <p className="text-xl font-bold text-gray-900">{result.totalScore.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="text-xl font-bold text-gray-900 capitalize">{result.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Answers Submitted</p>
                      <p className="text-xl font-bold text-gray-900">{result.answers.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Recommendations</p>
                      <p className="text-xl font-bold text-gray-900">{result.recommendations.length}</p>
                    </div>
                  </div>

                  {/* Category Scores */}
                  {result.categoryScores.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-900 mb-3">Category Breakdown</p>
                      <div className="space-y-2">
                        {result.categoryScores.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{category.category}</span>
                            <div className="flex items-center gap-4">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-12">{category.percentage.toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/dashboard/results/${result.id}`}
                    className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors"
                  >
                    View Detailed Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
