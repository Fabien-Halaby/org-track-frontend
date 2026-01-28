// "use client";

// import { useAuth } from "@/contexts/AuthContext";
// import { CheckCircle } from "lucide-react";

// export default function DashboardPage() {
//   const { user, loading } = useAuth();

//   if (loading || !user) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-400">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
//         <h1 className="text-3xl font-bold mb-2">
//           Bienvenue, {user.full_name?.split(" ")[0]} ! 👋
//         </h1>
//         <p className="text-blue-100">
//           Vous êtes connecté en tant que <span className="font-semibold capitalize">{user.role}</span>
//         </p>
//       </div>

//       <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
//         <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
//           <CheckCircle className="text-green-400" size={24} />
//           {"Informations de l'utilisateur"}
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-gray-900 p-4 rounded-lg">
//             <p className="text-gray-400 text-sm mb-1">ID</p>
//             <p className="text-white font-semibold">{user.id}</p>
//           </div>

//           <div className="bg-gray-900 p-4 rounded-lg">
//             <p className="text-gray-400 text-sm mb-1">Nom complet</p>
//             <p className="text-white font-semibold">{user.full_name}</p>
//           </div>

//           <div className="bg-gray-900 p-4 rounded-lg">
//             <p className="text-gray-400 text-sm mb-1">Email</p>
//             <p className="text-white font-semibold">{user.email}</p>
//           </div>

//           <div className="bg-gray-900 p-4 rounded-lg">
//             <p className="text-gray-400 text-sm mb-1">Rôle</p>
//             <p className="text-white font-semibold capitalize">{user.role}</p>
//           </div>

//           <div className="bg-gray-900 p-4 rounded-lg">
//             <p className="text-gray-400 text-sm mb-1">Statut</p>
//             <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
//               {user.status}
//             </span>
//           </div>

//           <div className="bg-gray-900 p-4 rounded-lg">
//             <p className="text-gray-400 text-sm mb-1">ID École</p>
//             <p className="text-white font-semibold">{user.school_id}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  GraduationCap,
  BookOpen,
  BookMarked,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { DashboardData } from "@/lib/types";
import StatCard from "@/components/dashboard/StatCard";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboard();
    }
  }, [authLoading, user]);

  const fetchDashboard = async () => {
    setLoading(true);
    const response = await api.getDashboard();

    if (response.success && response.data) {
      setDashboardData(response.data);
    } else {
      toast.error(response.error || "Erreur lors du chargement");
    }
    setLoading(false);
  };

  if (authLoading || loading || !user || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const { stats, pending_users } = dashboardData;

  // Données pour le graphique en camembert (répartition des utilisateurs)
  const userDistributionData = [
    { name: "Enseignants", value: stats.total_teachers, color: "#3b82f6" },
    { name: "Élèves", value: stats.total_students, color: "#10b981" },
    { name: "Admins", value: stats.total_admins, color: "#ef4444" },
  ];

  // Données pour le graphique en barres (statuts des utilisateurs)
  const userStatusData = [
    { name: "En attente", value: stats.pending_users, fill: "#eab308" },
    { name: "Approuvés", value: stats.approved_users, fill: "#10b981" },
    { name: "Rejetés", value: stats.rejected_users, fill: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {user.full_name?.split(" ")[0]} ! 👋
        </h1>
        <p className="text-blue-100">
          Voici un aperçu de votre établissement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Utilisateurs"
          value={stats.total_users}
          icon={Users}
          iconColor="text-blue-400"
          bgColor="bg-blue-500/20"
        />
        <StatCard
          title="Enseignants"
          value={stats.total_teachers}
          icon={GraduationCap}
          iconColor="text-purple-400"
          bgColor="bg-purple-500/20"
        />
        <StatCard
          title="Élèves"
          value={stats.total_students}
          icon={UserCheck}
          iconColor="text-green-400"
          bgColor="bg-green-500/20"
        />
        <StatCard
          title="En attente"
          value={stats.pending_users}
          icon={Clock}
          iconColor="text-yellow-400"
          bgColor="bg-yellow-500/20"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Classes"
          value={stats.total_classes}
          icon={BookOpen}
          iconColor="text-cyan-400"
          bgColor="bg-cyan-500/20"
        />
        <StatCard
          title="Matières"
          value={stats.total_subjects}
          icon={BookMarked}
          iconColor="text-pink-400"
          bgColor="bg-pink-500/20"
        />
        <StatCard
          title="Approuvés"
          value={stats.approved_users}
          icon={CheckCircle}
          iconColor="text-emerald-400"
          bgColor="bg-emerald-500/20"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - User Distribution */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-400" size={24} />
            Répartition des utilisateurs
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - User Status */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="text-purple-400" size={24} />
            Statut des utilisateurs
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Users Section */}
      {pending_users.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="text-yellow-400" size={24} />
              Demandes en attente ({pending_users.length})
            </h2>
            <Link
              href="/dashboard/users/pending"
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Voir tout
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending_users.slice(0, 3).map((pendingUser) => (
              <div
                key={pendingUser.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-yellow-500/50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {pendingUser.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {pendingUser.full_name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {pendingUser.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {pendingUser.role === "teacher"
                          ? "Enseignant"
                          : pendingUser.role === "student"
                          ? "Élève"
                          : pendingUser.role}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(pendingUser.created_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/classes"
            className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-white transition-all flex items-center gap-3"
          >
            <BookOpen size={24} />
            <div>
              <p className="font-semibold">Gérer les classes</p>
              <p className="text-sm text-blue-100">{stats.total_classes} classes</p>
            </div>
          </Link>

          <Link
            href="/dashboard/subjects"
            className="p-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-lg text-white transition-all flex items-center gap-3"
          >
            <BookMarked size={24} />
            <div>
              <p className="font-semibold">Gérer les matières</p>
              <p className="text-sm text-purple-100">{stats.total_subjects} matières</p>
            </div>
          </Link>

          <Link
            href="/dashboard/users"
            className="p-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg text-white transition-all flex items-center gap-3"
          >
            <Users size={24} />
            <div>
              <p className="font-semibold">Gérer les utilisateurs</p>
              <p className="text-sm text-green-100">{stats.total_users} utilisateurs</p>
            </div>
          </Link>

          <Link
            href="/dashboard/users/pending"
            className="p-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 rounded-lg text-white transition-all flex items-center gap-3"
          >
            <Clock size={24} />
            <div>
              <p className="font-semibold">Demandes en attente</p>
              <p className="text-sm text-yellow-100">{stats.pending_users} en attente</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
