import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen bg-linear-to-b from-black via-gray-900 to-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 text-blue-300 px-5 py-2.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles size={16} className="animate-pulse" />
            <span>Plateforme N°1 à Madagascar - 500+ Écoles</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Gérez votre école
            <br />
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              avec simplicité
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            EducNet transforme la gestion scolaire avec une plateforme SaaS moderne. 
            Notes, absences, communication, tableaux de bord - tout en un seul endroit.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle size={20} className="text-green-400" />
              <span>30 jours gratuits</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle size={20} className="text-green-400" />
              <span>Sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle size={20} className="text-green-400" />
              <span>Support 7j/7</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="/register"
              className="group inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105"
            >
              Commencer Gratuitement
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-3 bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-bold border border-gray-700 hover:border-blue-500/50 transition-all hover:scale-105"
            >
              Voir la Démo
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
              <div className="text-4xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-gray-400 text-sm">Écoles Partenaires</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
              <div className="text-4xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-gray-400 text-sm">Élèves Actifs</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
              <div className="text-4xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">5K+</div>
              <div className="text-gray-400 text-sm">Enseignants</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
              <div className="text-4xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime Garanti</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
