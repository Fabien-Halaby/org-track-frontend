import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">EducNet</span>
            </div>
            <p className="text-gray-400 mb-6">
              La plateforme SaaS moderne qui transforme la gestion scolaire à Madagascar
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-all">
                <Facebook size={18} className="text-gray-400 hover:text-blue-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-all">
                <Twitter size={18} className="text-gray-400 hover:text-blue-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-all">
                <Linkedin size={18} className="text-gray-400 hover:text-blue-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:border-blue-500/50 transition-all">
                <Instagram size={18} className="text-gray-400 hover:text-blue-400" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Produit</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Fonctionnalités</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Tarifs</a></li>
              <li><a href="#demo" className="text-gray-400 hover:text-blue-400 transition-colors">Démo en ligne</a></li>
              <li><a href="#updates" className="text-gray-400 hover:text-blue-400 transition-colors">Mises à jour</a></li>
              <li><a href="#roadmap" className="text-gray-400 hover:text-blue-400 transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Entreprise</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">À propos</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#careers" className="text-gray-400 hover:text-blue-400 transition-colors">Carrières</a></li>
              <li><a href="#partners" className="text-gray-400 hover:text-blue-400 transition-colors">Partenaires</a></li>
              <li><a href="#legal" className="text-gray-400 hover:text-blue-400 transition-colors">Mentions légales</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-blue-400 mt-0.5" />
                <a href="mailto:contact@educnet.mg" className="text-gray-400 hover:text-blue-400 transition-colors">
                  contact@educnet.mg
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-blue-400 mt-0.5" />
                <a href="tel:+261340000000" className="text-gray-400 hover:text-blue-400 transition-colors">
                  +261 34 00 000 00
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-400 mt-0.5" />
                <span className="text-gray-400">
                  Antananarivo<br />Madagascar
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; 2026 EducNet. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
              Politique de confidentialité
            </a>
            <a href="#terms" className="text-gray-400 hover:text-blue-400 transition-colors">
              {"Conditions d'utilisation"}
            </a>
            <a href="#cookies" className="text-gray-400 hover:text-blue-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
