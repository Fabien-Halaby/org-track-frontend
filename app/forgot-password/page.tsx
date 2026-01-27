import Navbar from "@/components/Navbar";
import ForgotPasswordForm from "@/components/login/ForgotPasswordForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Retour à la connexion</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Mot de passe oublié ?
            </h1>
            <p className="text-lg text-gray-400">
              Entrez votre email pour réinitialiser votre mot de passe
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}
