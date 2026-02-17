'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) return null;

  return (
    <main className="flex-1 bg-white">
      {/* Hero Section - Premium SaaS Style */}
      <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full">
                  <span className="text-sm font-semibold text-blue-200">✨ Transformez votre avenir</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Votre avenir professionnel commence ici
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Découvrez les programmes qui correspondent à votre profil grâce à nos tests d'orientation scientifiques et nos conseils personnalisés.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={ROUTES.REGISTER}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Commencer maintenant
                  <span className="ml-2">→</span>
                </Link>
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-400 text-white font-bold rounded-lg hover:bg-slate-800/50 transition-all duration-300"
                >
                  Se connecter
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700">
                <div>
                  <div className="text-2xl font-bold text-blue-400">50K+</div>
                  <div className="text-sm text-slate-400">Étudiants aidés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">98%</div>
                  <div className="text-sm text-slate-400">Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">20+</div>
                  <div className="text-sm text-slate-400">Pays couverts</div>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative h-96 md:h-full hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl border border-slate-700/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <p className="text-slate-400">Illustration interactive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Card Design */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">FONCTIONNALITÉS</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Outils complètes pour découvrir votre future carrière
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📋',
                title: 'Tests d\'orientation',
                description: 'Tests scientifiques pour évaluer vos forces et intérêts professionnels.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: '🎯',
                title: 'Recommandations intelligentes',
                description: 'Découvrez les écoles et programmes parfaits pour votre profil.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: '📊',
                title: 'Résultats détaillés',
                description: 'Analysez vos performances avec des graphiques et statistiques avancées.',
                color: 'from-emerald-500 to-teal-500',
              },
              {
                icon: '🏫',
                title: 'Écoles vérifiées',
                description: 'Catalogue complet des meilleures institutions éducatives d\'Afrique.',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: '👥',
                title: 'Conseils personnalisés',
                description: 'Connectez-vous avec nos conseillers experts en orientation.',
                color: 'from-indigo-500 to-blue-500',
              },
              {
                icon: '⭐',
                title: 'Accès Premium',
                description: 'Débloquez des fonctionnalités avancées pour un parcours optimisé.',
                color: 'from-yellow-500 to-orange-500',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className={`inline-block p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Pourquoi AFRI-SCHOOL ?
              </h2>
              <ul className="space-y-4">
                {[
                  'Orientation scientifique basée sur des tests validés',
                  'Résultats crédibles et détaillés',
                  'Plus de 50 000 étudiants aidés',
                  'Disponible dans 20+ pays africains',
                  'Support disponible 24/7',
                  'Confidentiel et sécurisé',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-slate-700">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white mr-4 font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 border border-blue-200">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl mb-2">👨‍🎓</div>
                  <p className="text-slate-600">Étudiants satisfaits</p>
                  <p className="text-3xl font-bold text-blue-600">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">TARIFICATION</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
              Choisissez votre plan
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des plans flexibles adaptés à chaque budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '0 €',
                description: 'Parfait pour commencer',
                features: [
                  'Accès à 3 tests',
                  'Recommandations basiques',
                  'Profil étudiant',
                  'Support email',
                ],
                cta: 'Commencer',
                highlight: false,
              },
              {
                name: 'Premium',
                price: '6 €',
                period: '/mois',
                description: 'Le plus populaire',
                features: [
                  'Accès illimité aux tests',
                  'Recommandations avancées',
                  'Analyses détaillées',
                  'Priorité support',
                  'Comparateur d\'écoles',
                ],
                cta: 'Essayer 7 jours',
                highlight: true,
              },
              {
                name: 'Pro',
                price: '15 €',
                period: '/mois',
                description: 'Pour les sérieux',
                features: [
                  'Tout Premium +',
                  'Conseils personnalisés',
                  'Historique complet',
                  'Export rapports',
                  'Accès écoles premium',
                  'Priorité 24/7',
                ],
                cta: 'Passer à Pro',
                highlight: false,
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl transition-all duration-300 ${
                  plan.highlight
                    ? 'ring-2 ring-blue-500 transform md:scale-105 bg-white shadow-2xl'
                    : 'bg-white border border-slate-200'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold rounded-full">
                      Populaire
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-600">{plan.period}</span>}
                  </div>

                  <button
                    className={`w-full py-3 px-6 font-bold rounded-lg transition-all duration-300 mb-8 ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg'
                        : 'border-2 border-slate-300 text-slate-900 hover:border-blue-500 hover:text-blue-500'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center text-slate-700">
                        <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-3">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Prêt à transformer votre avenir ?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants qui ont découvert leur chemin grâce à AFRI-SCHOOL
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={ROUTES.REGISTER}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Commencer maintenant
              <span className="ml-2">→</span>
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎓</span>
                <span className="text-xl font-bold text-white">AFRI-SCHOOL</span>
              </div>
              <p className="text-sm">Transformez votre avenir éducatif</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Tests</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Écoles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Résultats</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-sm">&copy; 2026 AFRI-SCHOOL. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
