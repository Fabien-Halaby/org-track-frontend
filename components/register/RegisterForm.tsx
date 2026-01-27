"use client";

import { useState } from "react";
import { School, User, Mail, Phone, MapPin, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import StepIndicator from "./StepIndicator";
import { api, SchoolRegistrationData } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolType: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const validateStep1 = () => {
    if (!formData.schoolName.trim()) {
      toast.error("Le nom de l'école est requis");
      return false;
    }
    if (!formData.schoolType) {
      toast.error("Veuillez sélectionner un type d'établissement");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("L'adresse est requise");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("La ville est requise");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Le téléphone est requis");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Email valide requis");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.adminFirstName.trim()) {
      toast.error("Le prénom est requis");
      return false;
    }
    if (!formData.adminLastName.trim()) {
      toast.error("Le nom est requis");
      return false;
    }
    if (!formData.adminEmail.trim() || !formData.adminEmail.includes("@")) {
      toast.error("Email valide requis");
      return false;
    }
    if (!formData.adminPhone.trim()) {
      toast.error("Le téléphone est requis");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast.error("Vous devez accepter les conditions d'utilisation");
      return;
    }

    setLoading(true);

    const registrationData: SchoolRegistrationData = {
      school_name: formData.schoolName,
      admin_email: formData.adminEmail,
      admin_password: formData.password,
      admin_name: `${formData.adminFirstName} ${formData.adminLastName}`,
      phone: formData.adminPhone,
      address: `${formData.address}, ${formData.city}`,
    };

    const loadingToast = toast.loading("Création de votre compte en cours...");

    try {
      const response = await api.registerSchool(registrationData);

      if (response.success) {
        toast.success("École créée avec succès!", { id: loadingToast });
        
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
        }
        
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 1000);
      } else {
        toast.error(response.error || "Une erreur est survenue", { id: loadingToast });
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Erreur de connexion au serveur", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-12">
      <StepIndicator currentStep={currentStep} totalSteps={3} />

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">{"Informations de l'école"}</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {"Nom de l'école"}
              </label>
              <div className="relative">
                <School className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Ex: Lycée Andohalo"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {"Type d'établissement"}
              </label>
              <select
                name="schoolType"
                value={formData.schoolType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="primary">École Primaire</option>
                <option value="secondary">Collège</option>
                <option value="high">Lycée</option>
                <option value="university">Université</option>
                <option value="professional">École Professionnelle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Adresse complète"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ex: Antananarivo"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+261 34 00 000 00"
                    className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {"Email de l'école"}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@ecole.mg"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              Continuer
              <ArrowRight size={20} />
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Compte administrateur</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="adminFirstName"
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    placeholder="Prénom"
                    className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="adminLastName"
                  value={formData.adminLastName}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="admin@ecole.mg"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="adminPhone"
                  value={formData.adminPhone}
                  onChange={handleChange}
                  placeholder="+261 34 00 000 00"
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
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
                  placeholder="Minimum 8 caractères"
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="flex-1 bg-gray-700 text-white py-4 rounded-xl font-bold hover:bg-gray-600 transition-all"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Continuer
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Vérifiez vos informations</h2>
              <p className="text-gray-400">Assurez-vous que tout est correct avant de continuer</p>
            </div>

            <div className="bg-gray-900/50 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">École</h3>
                <p className="text-white font-semibold">{formData.schoolName}</p>
                <p className="text-gray-300 text-sm">{formData.schoolType}</p>
                <p className="text-gray-300 text-sm">{formData.address}, {formData.city}</p>
                <p className="text-gray-300 text-sm">{formData.phone}</p>
                <p className="text-gray-300 text-sm">{formData.email}</p>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Administrateur</h3>
                <p className="text-white font-semibold">{formData.adminFirstName} {formData.adminLastName}</p>
                <p className="text-gray-300 text-sm">{formData.adminEmail}</p>
                <p className="text-gray-300 text-sm">{formData.adminPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-900 text-blue-600 focus:ring-blue-500"
                required
              />
              <label className="text-sm text-gray-300">
                {"J'accepte les"}{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                  {"conditions d'utilisation"}
                </a>{" "}
                et la{" "}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                  politique de confidentialité
                </a>{" "}
                {"d'EducNet"}
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={loading}
                className="flex-1 bg-gray-700 text-white py-4 rounded-xl font-bold hover:bg-gray-600 transition-all disabled:opacity-50"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={!formData.acceptTerms || loading}
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Créer mon compte</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-8 text-center text-gray-400 text-sm">
        Vous avez déjà un compte ?{" "}
        <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
          Se connecter
        </a>
      </div>
    </div>
  );
}
