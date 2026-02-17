'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock data for admin dashboard
  const stats = [
    { label: 'Total Utilisateurs', value: '2,456', change: '+12%', icon: '👥', color: 'from-blue-500 to-cyan-500' },
    { label: 'Tests Complétés', value: '8,932', change: '+23%', icon: '📋', color: 'from-purple-500 to-pink-500' },
    { label: 'Taux de Satisfaction', value: '94%', change: '+5%', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
    { label: 'Revenus Mensuels', value: '$12.5K', change: '+31%', icon: '💰', color: 'from-emerald-500 to-teal-500' },
  ];

  const topPrograms = [
    { name: 'Ingénierie Informatique', students: 342, trend: 'up', completion: 89 },
    { name: 'Business Management', students: 287, trend: 'up', completion: 76 },
    { name: 'Sciences Médicales', students: 256, trend: 'down', completion: 82 },
    { name: 'Arts & Design', students: 198, trend: 'up', completion: 71 },
    { name: 'Sciences Humaines', students: 156, trend: 'down', completion: 65 },
  ];

  const recentActivity = [
    { user: 'Alice Johnson', action: 'a complété le test', program: 'Engineering', time: '2 min' },
    { user: 'Mohamed Ben Ali', action: 'sest inscrit', program: 'Business', time: '15 min' },
    { user: 'Sophie Martin', action: 'a obtenu une recommandation', program: 'Medicine', time: '1 h' },
    { user: 'Omar Hassan', action: 'a complété le test', program: 'Design', time: '3 h' },
    { user: 'Emma Wilson', action: 'a mis à jour son profil', program: 'Humanities', time: '5 h' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Top Navigation */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                ⚙️
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Center</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold cursor-pointer">
                {user.firstName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-blue-200 text-sm font-semibold mb-2">TABLEAUX DE BORD</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white">Aperçu des performances</h2>
            </div>
            <p className="text-slate-300">Semaine du 15 au 21 janvier 2024</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 hover:bg-white/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white text-2xl`}>
                  {stat.icon}
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/20">
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-300 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-slate-400 text-xs">vs dernière semaine</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Completion Rate Chart */}
          <div className="md:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Taux de complétion par jour</h3>
            <div className="flex items-end justify-between h-64 gap-2">
              {[65, 72, 68, 82, 75, 88, 92].map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full h-48 flex items-end">
                    <div className={`w-full bg-gradient-to-t ${idx === 6 ? 'from-cyan-500 to-blue-500' : 'from-slate-600 to-slate-700'} rounded-t-lg opacity-70 hover:opacity-100 transition-opacity group-hover:shadow-lg group-hover:shadow-cyan-500/50`} 
                      style={{height: `${(value / 100) * 100}%`}}></div>
                  </div>
                  <span className="text-xs text-slate-300">Jour {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-6">Distribution des utilisateurs</h3>
            <div className="space-y-4">
              {[
                { label: 'Étudiants', value: 1847, color: 'from-blue-500 to-cyan-500' },
                { label: 'Éducateurs', value: 456, color: 'from-purple-500 to-pink-500' },
                { label: 'Administrateurs', value: 89, color: 'from-yellow-500 to-orange-500' },
                { label: 'Guests', value: 64, color: 'from-emerald-500 to-teal-500' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${item.color}`} 
                      style={{width: `${(item.value / 1900) * 100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Programs */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Programmes populaires</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Programme</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Étudiants</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Complétion</th>
                  </tr>
                </thead>
                <tbody>
                  {topPrograms.map((prog, idx) => (
                    <tr key={idx} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{prog.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{prog.students}</span>
                          <span className={`text-xs ${prog.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {prog.trend === 'up' ? '↑' : '↓'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{width: `${prog.completion}%`}}></div>
                          </div>
                          <span className="text-slate-300">{prog.completion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Activité récente</h3>
            </div>
            <div className="divide-y divide-white/10">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="p-4 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">{activity.user}</p>
                      <p className="text-slate-400 text-sm">{activity.action}</p>
                    </div>
                    <span className="text-slate-400 text-xs">{activity.time}</span>
                  </div>
                  <div className="inline-block px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                    {activity.program}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pb-8 flex justify-center gap-6">
          <Link href={ROUTES.DASHBOARD} className="text-slate-300 hover:text-white transition-colors">
            Retour au tableau de bord
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="#" className="text-slate-300 hover:text-white transition-colors">
            Exporter les données
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="#" className="text-slate-300 hover:text-white transition-colors">
            Paramètres avancés
          </Link>
        </div>
      </main>
    </div>
  );
}
