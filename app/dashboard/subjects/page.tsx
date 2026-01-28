"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, BookMarked, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { Subject, CreateSubjectData } from "@/lib/types";
import SubjectModal from "@/components/subjects/SubjectModal";
import toast from "react-hot-toast";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    const response = await api.getAllSubjects();
    
    if (response.success && response.data) {
      setSubjects(response.data);
    } else {
      toast.error(response.error || "Erreur lors du chargement");
    }
    setLoading(false);
  };

  const handleCreate = async (data: CreateSubjectData) => {
    setSubmitting(true);
    const loadingToast = toast.loading("Création en cours...");

    const response = await api.createSubject(data);

    if (response.success) {
      toast.success("Matière créée avec succès!", { id: loadingToast });
      setIsModalOpen(false);
      fetchSubjects();
    } else {
      toast.error(response.error || "Erreur lors de la création", {
        id: loadingToast,
      });
    }

    setSubmitting(false);
  };

  const handleUpdate = async (data: CreateSubjectData) => {
    if (!editingSubject) return;

    setSubmitting(true);
    const loadingToast = toast.loading("Mise à jour en cours...");

    const response = await api.updateSubject(editingSubject.id, data);

    if (response.success) {
      toast.success("Matière mise à jour avec succès!", { id: loadingToast });
      setIsModalOpen(false);
      setEditingSubject(null);
      fetchSubjects();
    } else {
      toast.error(response.error || "Erreur lors de la mise à jour", {
        id: loadingToast,
      });
    }

    setSubmitting(false);
  };

  const handleDelete = async (subject: Subject) => {
    if (!confirm(`Supprimer la matière ${subject.name} (${subject.code}) ?`)) return;

    const loadingToast = toast.loading("Suppression en cours...");

    const response = await api.deleteSubject(subject.id);

    if (response.success) {
      toast.success("Matière supprimée avec succès!", { id: loadingToast });
      fetchSubjects();
    } else {
      toast.error(response.error || "Erreur lors de la suppression", {
        id: loadingToast,
      });
    }
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const filteredSubjects = subjects.filter((subject) => {
    const query = searchQuery.toLowerCase();
    return (
      subject.name.toLowerCase().includes(query) ||
      subject.code.toLowerCase().includes(query) ||
      subject.description?.toLowerCase().includes(query)
    );
  });

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
            <BookMarked className="text-purple-400" size={32} />
            Gestion des matières
          </h1>
          <p className="text-gray-400 mt-1">
            {subjects.length} matière{subjects.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Créer une matière
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
            placeholder="Rechercher par nom, code ou description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
          <BookMarked className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400">Aucune matière trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {subject.code}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {subject.name}
                      </h3>
                      <p className="text-gray-400 text-sm">Code: {subject.code}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(subject)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(subject)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {subject.description && (
                <div className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FileText className="text-gray-400 flex-shrink-0 mt-1" size={16} />
                    <p className="text-gray-300 text-sm line-clamp-3">
                      {subject.description}
                    </p>
                  </div>
                </div>
              )}

              {!subject.description && (
                <div className="p-4 bg-gray-900 rounded-lg text-center">
                  <p className="text-gray-500 text-sm italic">Aucune description</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingSubject ? handleUpdate : handleCreate}
        editSubject={editingSubject}
        loading={submitting}
      />
    </div>
  );
}
