'use client';

import { useState } from 'react';
import { useProject, useDeleteProject, useActivateProject, useCompleteProject, useCancelProject } from '@/lib/hooks/useProjects';
import { useIndicators } from '@/lib/hooks/useIndicators';
import { downloadPdf, downloadExcel } from '@/lib/api/download';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format, isPast, isFuture, isToday, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Edit,
  TrendingUp,
  Plus,
  Download,
  FileSpreadsheet,
  Trash2,
  AlertTriangle,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';

const statusConfig = {
  draft: { 
    label: 'Brouillon', 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Clock,
    description: 'Projet en préparation'
  },
  active: { 
    label: 'Actif', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: Play,
    description: 'Projet en cours d\'exécution'
  },
  completed: { 
    label: 'Terminé', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircle,
    description: 'Projet terminé avec succès'
  },
  cancelled: { 
    label: 'Annulé', 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    description: 'Projet annulé'
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: indicators, isLoading: indicatorsLoading } = useIndicators(projectId);
  const deleteProject = useDeleteProject();
  const activateProject = useActivateProject();
  const completeProject = useCompleteProject();
  const cancelProject = useCancelProject();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDownloadPdf = () => {
    if (project) downloadPdf(projectId, `rapport-${project.name}.pdf`);
  };

  const handleDownloadExcel = () => {
    if (project) downloadExcel(projectId, `donnees-${project.name}.xlsx`);
  };

  const handleDelete = () => {
    deleteProject.mutate(projectId, {
      onError: (error) => setActionError(error.message),
    });
  };

  const handleActivate = () => {
    activateProject.mutate(projectId, {
      onError: (error) => setActionError(error.message),
    });
  };

  const handleComplete = () => {
    completeProject.mutate(projectId, {
      onError: (error) => setActionError(error.message),
    });
  };

  const handleCancel = () => {
    cancelProject.mutate(
      { projectId, reason: cancelReason },
      {
        onSuccess: () => {
          setShowCancelModal(false);
          setCancelReason('');
        },
        onError: (error) => setActionError(error.message),
      }
    );
  };

  if (projectLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  if (!project) {
    return <div>Projet non trouvé</div>;
  }

  const status = statusConfig[project.status];
  const StatusIcon = status.icon;
  const hasIndicators = indicators && indicators.length > 0;

  // Calculs de dates
  const startDate = project.startDate ? new Date(project.startDate) : null;
  const endDate = project.endDate ? new Date(project.endDate) : null;
  const today = new Date();
  
  const isStartToday = startDate && isToday(startDate);
  const isStartPassed = startDate && isPast(startDate) && !isToday(startDate);
  const isEndPassed = endDate && isPast(endDate) && !isToday(endDate);
  const isEndToday = endDate && isToday(endDate);
  
  const daysUntilStart = startDate && isFuture(startDate) 
    ? differenceInDays(startDate, today) 
    : null;
  const daysUntilEnd = endDate && (isFuture(endDate) || isToday(endDate))
    ? differenceInDays(endDate, today)
    : null;

  // Déterminer les actions disponibles
  const canActivate = project.status === 'draft' && startDate && (isStartToday || isStartPassed);
  const canComplete = project.status === 'active' && (isEndPassed || isEndToday);
  const canCancel = ['draft', 'active'].includes(project.status);
  const isTerminal = ['completed', 'cancelled'].includes(project.status);

  return (
    <div className="space-y-6">
      {/* Header navigation */}
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Erreur d'action */}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Action impossible</p>
            <p className="text-sm">{actionError}</p>
            <button 
              onClick={() => setActionError(null)}
              className="text-sm underline mt-2 hover:text-red-800"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Card principale */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color} flex items-center gap-1.5`}>
                <StatusIcon className="w-4 h-4" />
                {status.label}
              </span>
            </div>
            <p className="text-gray-600">{status.description}</p>
            {project.description && (
              <p className="text-gray-500 mt-2 text-sm">{project.description}</p>
            )}
          </div>
          
          {/* Boutons d'action */}
          <div className="flex items-center gap-1">
            {!isTerminal && (
              <Link
                href={`/projects/${projectId}/edit`}
                className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={handleDownloadPdf}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="PDF"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={handleDownloadExcel}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Excel"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>

            {/* SUPPRIMER: uniquement pour draft ou cancelled */}
            {(project.status === 'draft' || project.status === 'cancelled') && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title={project.status === 'cancelled' ? 'Supprimer définitivement' : 'Supprimer'}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Alertes de workflow */}
        <div className="space-y-3 mb-6">
          {project.status === 'draft' && startDate && isStartPassed && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-800">Date de début dépassée</p>
                <p className="text-sm text-amber-700">
                  Le projet devait démarrer le {format(startDate, 'dd MMMM yyyy', { locale: fr })}.
                  Activez-le maintenant ou modifiez les dates.
                </p>
                <button
                  onClick={handleActivate}
                  disabled={activateProject.isPending}
                  className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {activateProject.isPending ? 'Activation...' : 'Activer maintenant'}
                </button>
              </div>
            </div>
          )}

          {project.status === 'active' && endDate && (isEndToday || isEndPassed) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">Date de fin atteinte</p>
                <p className="text-sm text-blue-700">
                  Le projet se termine {isEndToday ? 'aujourd\'hui' : `le ${format(endDate, 'dd MMMM yyyy', { locale: fr })}`}.
                  Marquez-le comme terminé si toutes les livrables sont OK.
                </p>
                <button
                  onClick={handleComplete}
                  disabled={completeProject.isPending}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {completeProject.isPending ? 'Clôture...' : 'Marquer comme terminé'}
                </button>
              </div>
            </div>
          )}

            {project.status === 'draft' && startDate && isStartPassed && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-800">Date de début dépassée</p>
                <p className="text-sm text-amber-700">
                  Le projet devait démarrer le {format(startDate, 'dd MMMM yyyy', { locale: fr })}.
                  {"En l'activant maintenant, la date sera ajustée à aujourd'hui."}
                </p>
                <button
                  onClick={handleActivate}
                  disabled={activateProject.isPending}
                  className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {activateProject.isPending ? 'Activation...' : 'Activer maintenant (date ajustée)'}
                </button>
              </div>
            </div>
          )}

          {project.status === 'draft' && daysUntilStart && daysUntilStart > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">Démarrage programmé</p>
                <p className="text-sm text-blue-700">
                  Le projet est prévu pour le {format(startDate!, 'dd MMMM yyyy', { locale: fr })}.
                  {"Vous pouvez l'activer maintenant pour démarrer plus tôt."}
                </p>
                <button
                  onClick={handleActivate}
                  disabled={activateProject.isPending}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {activateProject.isPending ? 'Activation...' : 'Démarrer maintenant (avance le projet)'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Infos projet */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {project.budget && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Budget
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {Number(project.budget).toLocaleString('fr-FR')} €
              </p>
            </div>
          )}
          
          {startDate && (
            <div className={`rounded-lg p-4 ${isStartPassed ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Début
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {format(startDate, 'dd MMM yyyy', { locale: fr })}
              </p>
              {isStartToday && <span className="text-xs text-green-600 font-medium">Aujourd&apos;hui</span>}
            </div>
          )}
          
          {endDate && (
            <div className={`rounded-lg p-4 ${isEndPassed ? 'bg-blue-50' : daysUntilEnd && daysUntilEnd <= 7 ? 'bg-amber-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Fin prévue
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {format(endDate, 'dd MMM yyyy', { locale: fr })}
              </p>
              {daysUntilEnd && daysUntilEnd > 0 && (
                <span className={`text-xs font-medium ${daysUntilEnd <= 7 ? 'text-amber-600' : 'text-gray-500'}`}>
                  {daysUntilEnd} jour{daysUntilEnd > 1 ? 's' : ''} restant{daysUntilEnd > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions de workflow */}
        {!isTerminal && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
            {canActivate && (
              <button
                onClick={handleActivate}
                disabled={activateProject.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {activateProject.isPending ? 'Activation...' : 'Activer le projet'}
              </button>
            )}

            {canComplete && (
              <button
                onClick={handleComplete}
                disabled={completeProject.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {completeProject.isPending ? 'Clôture...' : 'Terminer le projet'}
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={cancelProject.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Annuler le projet
              </button>
            )}
          </div>
        )}
      </div>

      {/* Section Indicateurs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Indicateurs
            {indicatorsLoading && <span className="text-sm font-normal text-gray-400">(chargement...)</span>}
          </h2>
          {project.status === 'active' && (
            <Link
              href={`/indicators?project=${project.id}`}
              className="text-primary hover:underline text-sm"
            >
              Voir tous
            </Link>
          )}
        </div>

        {project.status !== 'active' && (
          <div className={`rounded-lg p-4 mb-4 flex items-start gap-3 ${
            project.status === 'draft' ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'
          }`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              project.status === 'draft' ? 'text-amber-600' : 'text-gray-500'
            }`} />
            <div>
              <p className={`font-medium ${
                project.status === 'draft' ? 'text-amber-800' : 'text-gray-700'
              }`}>
                Projet {project.status === 'draft' ? 'en brouillon' : project.status === 'completed' ? 'terminé' : 'annulé'}
              </p>
              <p className={`text-sm ${
                project.status === 'draft' ? 'text-amber-700' : 'text-gray-600'
              }`}>
                {project.status === 'draft' 
                  ? 'Activez le projet pour pouvoir créer des indicateurs et suivre vos performances.'
                  : 'Ce projet est clôturé. Les indicateurs ne peuvent plus être modifiés.'}
              </p>
              {project.status === 'draft' && (
                <button
                  onClick={handleActivate}
                  disabled={activateProject.isPending}
                  className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {activateProject.isPending ? 'Activation...' : 'Activer le projet'}
                </button>
              )}
            </div>
          </div>
        )}

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
                    {indicator.values?.length || 0} valeur(s) • 
                    {indicator.targetValue && ` Objectif: ${indicator.targetValue}`}
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
            {project.status === 'active' && (
              <Link
                href={`/indicators/new?project=${project.id}`}
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors text-gray-500"
              >
                <Plus className="w-4 h-4" />
                Ajouter un indicateur
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucun indicateur</p>
            {project.status === 'active' ? (
              <Link 
                href={`/indicators/new?project=${project.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer un indicateur
              </Link>
            ) : project.status === 'draft' ? (
              <p className="text-sm text-amber-600">
                Activez le projet pour créer des indicateurs
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                Projet {project.status === 'completed' ? 'terminé' : 'annulé'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">
                {project.status === 'cancelled' ? 'Supprimer le projet annulé ?' : 'Supprimer le projet ?'}
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              <strong>&quot;{project.name}&quot;</strong> sera définitivement supprimé avec tous ses indicateurs.
              {project.status === 'cancelled' && (
                <span className="block mt-2 text-amber-600 text-sm">
                  Ce projet est déjà annulé. Cette action est irréversible.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteProject.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {deleteProject.isPending ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Annuler le projet ?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Cette action est irréversible. Le projet <strong>&quot;{project.name}&quot;</strong> sera marqué comme annulé.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif d&apos;annulation (optionnel)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                rows={3}
                placeholder="Pourquoi ce projet est-il annulé ?"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelProject.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {cancelProject.isPending ? 'Annulation...' : 'Confirmer l\'annulation'}
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}