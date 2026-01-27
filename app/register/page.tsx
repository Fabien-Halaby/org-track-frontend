import Navbar from "@/components/Navbar";
import RegisterForm from "@/components/register/RegisterForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Retour à l'accueil</span>
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Créez votre compte EducNet
            </h1>
            <p className="text-xl text-gray-400">
              Commencez votre essai gratuit de 30 jours, sans carte bancaire requise
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
