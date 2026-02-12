'use client';

import { useProject } from '@/lib/hooks/useProjects';
import { useIndicators } from '@/lib/hooks/useIndicators';
import { downloadPdf, downloadExcel } from '@/lib/api/download';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Edit,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Download, FileSpreadsheet } from 'lucide-react';

const statusLabels = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  active: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Terminé', color: 'bg-blue-100 text-blue-700' },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: indicators, isLoading: indicatorsLoading } = useIndicators(projectId);

  const handleDownloadPdf = () => {
    if (project) {
      downloadPdf(projectId, `rapport-${project.name}.pdf`);
    }
  };

  const handleDownloadExcel = () => {
    if (project) {
      downloadExcel(projectId, `donnees-${project.name}.xlsx`);
    }
  };

  if (projectLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  if (!project) {
    return <div>Projet non trouvé</div>;
  }

  const status = statusLabels[project.status];
  const hasIndicators = indicators && indicators.length > 0;

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
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          </div>

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
            {indicatorsLoading && <span className="text-sm font-normal text-gray-400">(chargement...)</span>}
          </h2>
          <Link
            href={`/indicators?project=${project.id}`}
            className="text-primary hover:underline text-sm"
          >
            Voir tous les indicateurs
          </Link>
        </div>

        {indicatorsLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-gray-100 rounded-lg"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
          </div>
        ) : hasIndicators ? (
          <div className="space-y-3">
            {indicators.map((indicator) => (
              <Link 
                key={indicator.id} 
                href={`/indicators/${indicator.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{indicator.name}</h3>
                  <p className="text-sm text-gray-500">
                    {indicator.values?.length || 0} valeur(s) saisie(s)
                    {indicator.targetValue && ` • Objectif: ${indicator.targetValue}`}
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
            <Link
              href={`/indicators/new?project=${project.id}`}
              className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors text-gray-500"
            >
              <Plus className="w-4 h-4" />
              Ajouter un indicateur
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucun indicateur suivi pour ce projet</p>
            <Link 
              href={`/indicators/new?project=${project.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" />
              En ajouter un
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}