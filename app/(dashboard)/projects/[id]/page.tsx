'use client';

import { useProject } from '@/lib/hooks/useProjects';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Edit,
  TrendingUp
} from 'lucide-react';

const statusLabels = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  active: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const { data: project, isLoading } = useProject(params.id as string);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  if (!project) {
    return <div>Projet non trouvé</div>;
  }

  const status = statusLabels[project.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux projets
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            {project.description && (
              <p className="text-gray-600">{project.description}</p>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            Modifier
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {project.budget && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Budget
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {project.budget.toLocaleString('fr-FR')} €
              </p>
            </div>
          )}
          
          {project.startDate && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Début
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(project.startDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
          
          {project.endDate && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Fin prévue
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(project.endDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Indicateurs
          </h2>
          <Link
            href={`/indicators?project=${project.id}`}
            className="text-primary hover:underline text-sm"
          >
            Voir tous les indicateurs
          </Link>
        </div>
        <p className="text-gray-500 text-sm">
          Aucun indicateur suivi pour ce projet. 
          <Link href={`/indicators/new?project=${project.id}`} className="text-primary hover:underline ml-1">
            En ajouter un
          </Link>
        </p>
      </div>
    </div>
  );
}