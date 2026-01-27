import Navbar from "@/components/Navbar";
import LoginForm from "@/components/login/LoginForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Retour à l'accueil</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Connexion
            </h1>
            <p className="text-xl text-gray-400">
              Accédez à votre tableau de bord EducNet
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
