'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTest } from '@/hooks/useTest';
import { ROUTES } from '@/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { testHistory, getMyResults } = useTest();

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

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                🎓
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href={ROUTES.DASHBOARD_PROFILE}
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Profil
              </Link>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold cursor-pointer">
                {user.firstName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 md:p-12 rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
            </div>
            <div className="relative">
              <p className="text-blue-200 text-sm font-semibold mb-2">BIENVENUE</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Bonjour, {user.firstName}! 👋</h2>
              <p className="text-lg text-slate-300">Découvrez votre parcours idéal avec nos tests d'orientation scientifiques</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Tests passés', value: '5', icon: '📋', color: 'from-blue-500 to-cyan-500' },
            { label: 'Résultats', value: testHistory.length.toString(), icon: '📊', color: 'from-purple-500 to-pink-500' },
            { label: 'Moyenne', value: '87%', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
            { label: 'Recommandations', value: '12', icon: '🎯', color: 'from-emerald-500 to-teal-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
              <div className={`inline-block p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white text-2xl mb-4`}>
                {stat.icon}
              </div>
              <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href={ROUTES.DASHBOARD_TESTS}
            className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-3xl mb-4 group-hover:scale-110 transition-transform">
              📋
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Voir les tests</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Accédez à notre collection complète de tests d'orientation
            </p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              Parcourir →
            </div>
          </Link>

          <Link
            href={ROUTES.DASHBOARD_RESULTS}
            className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-3xl mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mes résultats</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Consultez vos résultats et recommandations personnalisées
            </p>
            <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
              Consulter →
            </div>
          </Link>

          <Link
            href={ROUTES.DASHBOARD_PROFILE}
            className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-3xl mb-4 group-hover:scale-110 transition-transform">
              👤
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mon profil</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Mettez à jour vos informations et préférences
            </p>
            <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all">
              Éditer →
            </div>
          </Link>
        </div>

        {/* Recent Results Table */}
        {testHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Résultats récents</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Test</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Test Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {testHistory.slice(0, 5).map((result) => (
                    <tr key={result.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{result.test.title}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(result.submittedAt || result.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              style={{width: `${result.totalPercentage}%`}}
                            ></div>
                          </div>
                          <span className="font-bold text-slate-900">{result.totalPercentage.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          result.totalPercentage >= 70 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : result.totalPercentage >= 50
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {result.totalPercentage >= 70 ? '✓ Excellent' : result.totalPercentage >= 50 ? '⚠ Bon' : '✎ À améliorer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/dashboard/results/${result.id}`}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all text-xs"
                        >
                          Détails
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {testHistory.length === 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucun résultat pour le moment</h3>
            <p className="text-slate-600 mb-6 text-lg">Commencez par prendre l'un de nos tests pour obtenir des recommandations personnalisées</p>
            <Link
              href={ROUTES.DASHBOARD_TESTS}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold"
            >
              Commencer un test
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
