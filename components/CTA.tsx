import { ArrowRight, CheckCircle } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-linear-to-b from-black via-gray-900 to-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Prêt à transformer votre école ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez plus de 500 écoles qui ont déjà choisi EducNet pour digitaliser leur gestion
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle size={20} className="text-green-400" />
              <span>Installation en 5 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle size={20} className="text-green-400" />
              <span>Migration de données gratuite</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle size={20} className="text-green-400" />
              <span>Formation complète incluse</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="group inline-flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl text-lg font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105"
            >
              Essai Gratuit 30 Jours
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-3 bg-gray-800 text-white px-10 py-5 rounded-xl text-lg font-bold border border-gray-700 hover:border-blue-500/50 transition-all hover:scale-105"
            >
              Planifier une Démo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
