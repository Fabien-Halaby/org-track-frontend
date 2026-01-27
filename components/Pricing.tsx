import { Check, Zap, Crown, Rocket } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "Gratuit",
    period: "30 jours",
    description: "Parfait pour tester la plateforme",
    features: [
      "Jusqu'à 100 élèves",
      "5 enseignants",
      "Gestion des notes",
      "Tableaux de bord basiques",
      "Support email",
    ],
    cta: "Commencer Gratuitement",
    highlighted: false,
  },
  {
    name: "Professional",
    icon: Crown,
    price: "49 000 Ar",
    period: "/mois",
    description: "Pour les écoles en croissance",
    features: [
      "Jusqu'à 500 élèves",
      "Enseignants illimités",
      "Toutes les fonctionnalités",
      "Messagerie intégrée",
      "Rapports avancés",
      "Support prioritaire 24/7",
      "Formation incluse",
    ],
    cta: "Démarrer Maintenant",
    highlighted: true,
  },
  {
    name: "Enterprise",
    icon: Rocket,
    price: "Sur mesure",
    period: "",
    description: "Pour les grands établissements",
    features: [
      "Élèves illimités",
      "Multi-campus",
      "API personnalisée",
      "Intégrations avancées",
      "Serveur dédié",
      "Support 24/7 + Manager dédié",
      "SLA garanti 99.9%",
    ],
    cta: "Nous Contacter",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            TARIFS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Un plan adapté à chaque école
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transparence totale, sans frais cachés. Essayez gratuitement pendant 30 jours.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                plan.highlighted
                  ? "border-blue-500 shadow-2xl shadow-blue-500/30 md:-mt-4 md:scale-105"
                  : "border-gray-700 hover:border-blue-500/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-blue-500 to-purple-500 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  POPULAIRE
                </div>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 bg-linear-to-br ${plan.highlighted ? 'from-blue-500 to-purple-500' : 'from-gray-700 to-gray-600'} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <plan.icon className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={20} className="text-green-400 mt-0.5 shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/register"
                className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${
                  plan.highlighted
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105"
                    : "bg-gray-700 border border-gray-600 text-white hover:border-blue-500/50"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-gray-400">
          <p>Paiement sécurisé par carte bancaire ou Mobile Money</p>
          <p className="mt-2">Annulez à tout moment, sans engagement</p>
        </div>
      </div>
    </section>
  );
}
