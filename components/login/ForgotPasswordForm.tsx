"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation d'appel API
    setTimeout(() => {
      console.log("Password reset for:", email);
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-10 text-center">
        <div className="w-20 h-20 bg-linear-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-white" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Email envoyé !</h2>
        <p className="text-gray-400 mb-8">
          Nous avons envoyé un lien de réinitialisation à <strong className="text-white">{email}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
        </p>
        <Link 
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@ecole.mg"
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Nous vous enverrons un lien pour réinitialiser votre mot de passe
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Envoi en cours...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Envoyer le lien</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link 
          href="/login" 
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Vous vous souvenez de votre mot de passe ? Se connecter
        </Link>
      </div>
    </div>
  );
}
