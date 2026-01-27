import { Users, BookOpen, MessageSquare, BarChart3, Calendar, Shield, Bell, FileText } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion Complète des Utilisateurs",
    description: "Gérez élèves, enseignants, parents et admins avec des rôles et permissions personnalisés.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Suivi Pédagogique Avancé",
    description: "Notes, devoirs, bulletins, absences - tout centralisé pour un suivi optimal des élèves.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Communication en Temps Réel",
    description: "Messagerie intégrée pour connecter enseignants, élèves et parents instantanément.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Tableaux de Bord Intelligents",
    description: "Statistiques détaillées et rapports automatiques pour des décisions éclairées.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Calendar,
    title: "Emploi du Temps Dynamique",
    description: "Créez, modifiez et partagez emplois du temps et événements en quelques clics.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Sécurité & Confidentialité",
    description: "Données cryptées, backups automatiques et conformité RGPD garantie.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Bell,
    title: "Notifications Intelligentes",
    description: "Alertes personnalisées pour notes, absences, événements et communications importantes.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: FileText,
    title: "Documents & Archives",
    description: "Stockage illimité pour bulletins, certificats, documents administratifs et plus.",
    gradient: "from-teal-500 to-green-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            FONCTIONNALITÉS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Tout ce dont votre école a besoin
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Une plateforme complète et moderne pour digitaliser la gestion de votre établissement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <div className={`w-14 h-14 bg-linear-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
