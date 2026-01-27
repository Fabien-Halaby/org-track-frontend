"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api, LoginData } from "@/lib/api";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Afficher message de bienvenue si redirection depuis inscription
  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    const loginData: LoginData = {
      email: formData.email,
      password: formData.password,
    };

    const loadingToast = toast.loading("Connexion en cours...");

    try {
      const response = await api.login(loginData);

      if (response.success && response.data) {
        const { user, access_token, refresh_token, expires_in } = response.data;

        toast.success(`Bienvenue ${user.full_name}!`, { id: loadingToast });

        // Sauvegarde des tokens et infos utilisateur
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token_expires_in", expires_in.toString());

        // Option: Se souvenir de moi
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        // Redirection vers dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        toast.error(response.error || "Email ou mot de passe incorrect", { 
          id: loadingToast 
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Erreur de connexion au serveur", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-10">
      {showWelcome && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-green-400 font-semibold">Inscription réussie!</p>
            <p className="text-green-300 text-sm">Connectez-vous avec vos identifiants pour accéder à votre compte.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre.email@ecole.mg"
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <label className="text-sm text-gray-300">
              Se souvenir de moi
            </label>
          </div>
          <Link 
            href="/forgot-password" 
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Connexion en cours...</span>
            </>
          ) : (
            <>
              <LogIn size={20} />
              <span>Se connecter</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-800/50 text-gray-400">OU</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={loading}
            className="w-full bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continuer avec Google</span>
          </button>

          <button
            type="button"
            disabled={loading}
            className="w-full bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/>
            </svg>
            <span>Continuer avec Facebook</span>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        Vous n'avez pas encore de compte ?{" "}
        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
          Créer un compte
        </Link>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700 text-center">
        <p className="text-gray-500 text-xs">
          En vous connectant, vous acceptez nos{" "}
          <Link href="/terms" className="text-gray-400 hover:text-white underline">
            conditions d'utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="/privacy" className="text-gray-400 hover:text-white underline">
            politique de confidentialité
          </Link>
        </p>
      </div>
    </div>
  );
}
