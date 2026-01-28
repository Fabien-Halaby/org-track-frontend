"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, BookOpen, Users } from "lucide-react";
import { api } from "@/lib/api";
import { Class, CreateClassData } from "@/lib/types";
import ClassModal from "@/components/classes/ClassModal";
import toast from "react-hot-toast";

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    const response = await api.getAllClasses();
    
    if (response.success && response.data) {
      setClasses(response.data);
    } else {
      toast.error(response.error || "Erreur lors du chargement");
    }
    setLoading(false);
  };

  const handleCreate = async (data: CreateClassData) => {
    setSubmitting(true);
    const loadingToast = toast.loading("Création en cours...");

    const response = await api.createClass(data);

    if (response.success) {
      toast.success("Classe créée avec succès!", { id: loadingToast });
      setIsModalOpen(false);
      fetchClasses();
    } else {
      toast.error(response.error || "Erreur lors de la création", {
        id: loadingToast,
      });
    }

    setSubmitting(false);
  };

  const handleUpdate = async (data: CreateClassData) => {
    if (!editingClass) return;

    setSubmitting(true);
    const loadingToast = toast.loading("Mise à jour en cours...");

    const response = await api.updateClass(editingClass.id, data);

    if (response.success) {
      toast.success("Classe mise à jour avec succès!", { id: loadingToast });
      setIsModalOpen(false);
      setEditingClass(null);
      fetchClasses();
    } else {
      toast.error(response.error || "Erreur lors de la mise à jour", {
        id: loadingToast,
      });
    }

    setSubmitting(false);
  };

  const handleDelete = async (classItem: Class) => {
    if (!confirm(`Supprimer la classe ${classItem.name} ?`)) return;

    const loadingToast = toast.loading("Suppression en cours...");

    const response = await api.deleteClass(classItem.id);

    if (response.success) {
      toast.success("Classe supprimée avec succès!", { id: loadingToast });
      fetchClasses();
    } else {
      toast.error(response.error || "Erreur lors de la suppression", {
        id: loadingToast,
      });
    }
  };

  const openEditModal = (classItem: Class) => {
    setEditingClass(classItem);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const filteredClasses = classes.filter((classItem) => {
    const query = searchQuery.toLowerCase();
    return (
      classItem.name.toLowerCase().includes(query) ||
      classItem.level.toLowerCase().includes(query) ||
      classItem.section.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    fetchClasses();
  }, []);

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
            <BookOpen className="text-blue-400" size={32} />
            Gestion des classes
          </h1>
          <p className="text-gray-400 mt-1">
            {classes.length} classe{classes.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Créer une classe
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Rechercher par nom, niveau ou section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
          <BookOpen className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400">Aucune classe trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {classItem.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {classItem.level} - Section {classItem.section}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(classItem)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(classItem)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400 text-sm">Capacité</span>
                  <span className="text-white font-semibold">
                    {classItem.capacity} élèves
                  </span>
                </div>

                {classItem.student_count !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <Users size={16} />
                      Inscrits
                    </span>
                    <span className="text-white font-semibold">
                      {classItem.student_count}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-400 text-sm">Année académique</span>
                  <span className="text-white font-semibold">
                    {classItem.academic_year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingClass ? handleUpdate : handleCreate}
        editClass={editingClass}
        loading={submitting}
      />
    </div>
  );
}
