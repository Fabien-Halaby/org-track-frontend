"use client";

import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-black/80 backdrop-blur-xl z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              EducNet
            </span>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Tarifs
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Témoignages
            </a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Connexion
            </a>
            <a
              href="/register"
              className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/30"
            >
              Essai Gratuit
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <a
              href="#features"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              Fonctionnalités
            </a>
            <a
              href="#pricing"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              Tarifs
            </a>
            <a
              href="#testimonials"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              Témoignages
            </a>
            <a
              href="#contact"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            >
              Contact
            </a>
            <a
              href="/login"
              className="block px-4 py-3 text-blue-400 hover:text-blue-300 font-medium hover:bg-gray-800 rounded-lg transition-all"
            >
              Connexion
            </a>
            <a
              href="/register"
              className="block px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center font-semibold"
            >
              Essai Gratuit
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
