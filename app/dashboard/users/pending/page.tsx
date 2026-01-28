"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, User, Mail, Phone, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { AdminUser } from "@/lib/types";
import toast from "react-hot-toast";

export default function PendingUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    const response = await api.getPendingUsers();
    
    if (response.success && response.data) {
      setUsers(response.data.users);
    } else {
      toast.error(response.error || "Erreur lors du chargement");
    }
    setLoading(false);
  };

  const handleApprove = async (userId: number, userName: string) => {
    if (!confirm(`Approuver l'utilisateur ${userName} ?`)) return;

    setProcessingId(userId);
    const loadingToast = toast.loading("Approbation en cours...");

    const response = await api.approveUser(userId);

    if (response.success) {
      toast.success("Utilisateur approuvé avec succès!", { id: loadingToast });
      fetchPendingUsers();
    } else {
      toast.error(response.error || "Erreur lors de l'approbation", {
        id: loadingToast,
      });
    }

    setProcessingId(null);
  };

  const handleReject = async (userId: number, userName: string) => {
    if (!confirm(`Rejeter l'utilisateur ${userName} ?`)) return;

    setProcessingId(userId);
    const loadingToast = toast.loading("Rejet en cours...");

    const response = await api.rejectUser(userId);

    if (response.success) {
      toast.success("Utilisateur rejeté", { id: loadingToast });
      fetchPendingUsers();
    } else {
      toast.error(response.error || "Erreur lors du rejet", {
        id: loadingToast,
      });
    }

    setProcessingId(null);
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      teacher: "bg-blue-500/20 text-blue-400",
      student: "bg-green-500/20 text-green-400",
      parent: "bg-purple-500/20 text-purple-400",
      admin: "bg-red-500/20 text-red-400",
    };
    return colors[role as keyof typeof colors] || "bg-gray-500/20 text-gray-400";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Clock className="text-yellow-400" size={32} />
            Utilisateurs en attente
          </h1>
          <p className="text-gray-400 mt-1">
            {users.length} demande{users.length !== 1 ? "s" : ""} d'inscription en attente
          </p>
        </div>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
          <Clock className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Aucune demande en attente</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {user.full_name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role === "teacher" ? "Enseignant" : 
                         user.role === "student" ? "Élève" : 
                         user.role === "parent" ? "Parent" : user.role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail size={18} />
                      <span className="text-sm">{user.email}</span>
                    </div>

                    {user.phone && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone size={18} />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}

                    {user.class_name && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={18} />
                        <span className="text-sm">Classe: {user.class_name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={18} />
                      <span className="text-sm">
                        {new Date(user.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(user.id, user.full_name)}
                    disabled={processingId === user.id}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={18} />
                    Approuver
                  </button>
                  <button
                    onClick={() => handleReject(user.id, user.full_name)}
                    disabled={processingId === user.id}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={18} />
                    Rejeter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
