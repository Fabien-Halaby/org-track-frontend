'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProject, useUpdateProject } from '@/lib/hooks/useProjects';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Calendar, Info } from 'lucide-react';
import { format, addDays, isBefore, startOfDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Schéma de validation dynamique selon le statut
const getProjectSchema = (currentStatus: string) => z.object({
  name: z.string().min(2, 'Nom requis (min 2 caractères)'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine(
  (data) => {
    // Validation: date fin > date début
    if (data.startDate && data.endDate) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  {
    message: 'La date de fin doit être après la date de début',
    path: ['endDate'],
  }
).refine(
  (data) => {
    // Si on essaie d'activer, il faut une date de début
    if (data.status === 'active' && !data.startDate) {
      return false;
    }
    return true;
  },
  {
    message: 'Un projet actif doit avoir une date de début',
    path: ['startDate'],
  }
);

type ProjectForm = z.infer<ReturnType<typeof getProjectSchema>>;

const statusOptions = [
  { value: 'draft', label: '📝 Brouillon', description: 'Projet en préparation' },
  { value: 'active', label: '🚀 Actif', description: 'En cours d\'exécution' },
  { value: 'completed', label: '✅ Terminé', description: 'Projet terminé' },
  { value: 'cancelled', label: '❌ Annulé', description: 'Projet annulé' },
];

const statusTransitions: Record<string, string[]> = {
  draft: ['active', 'cancelled', 'draft'], // peut rester draft
  active: ['completed', 'cancelled', 'active'], // peut rester active
  completed: ['completed'], // terminal
  cancelled: ['cancelled'], // terminal
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();
  const [apiError, setApiError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProjectForm>({
    resolver: zodResolver(getProjectSchema(project?.status || 'draft')),
    defaultValues: {
      name: '',
      description: '',
      status: 'draft',
      budget: '',
      startDate: '',
      endDate: '',
    },
  });

  const currentStatus = watch('status');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Pré-remplir le formulaire
  useEffect(() => {
    if (project && !isLoading) {
      reset({
        name: project.name,
        description: project.description || '',
        status: project.status,
        budget: project.budget?.toString() || '',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        endDate: project.endDate ? project.endDate.split('T')[0] : '',
      });
    }
  }, [project, isLoading, reset]);

  // Auto-ajuster la date de fin si nécessaire
  useEffect(() => {
    if (startDate && endDate && endDate <= startDate) {
      const newEndDate = format(addDays(new Date(startDate), 1), 'yyyy-MM-dd');
      setValue('endDate', newEndDate);
    }
  }, [startDate, endDate, setValue]);

  // Calculer les statuts disponibles
  const availableStatuses = project ? statusTransitions[project.status] || [project.status] : [];

  // Vérifier si une transition est valide
  const isValidTransition = (newStatus: string) => {
    if (!project) return false;
    if (newStatus === project.status) return true;
    return availableStatuses.includes(newStatus);
  };

  const onSubmit = (data: ProjectForm) => {
    setApiError(null);

    // Vérifier la transition côté client
    if (!isValidTransition(data.status)) {
      setApiError(`Transition invalide: ${project?.status} → ${data.status}`);
      return;
    }

    updateProject.mutate(
      {
        id: projectId,
        data: {
          ...data,
          budget: data.budget ? parseFloat(data.budget) : undefined,
        },
      },
      {
        onSuccess: () => {
          router.push(`/projects/${projectId}`);
        },
        onError: (error) => {
          setApiError(error.message);
        },
      }
    );
  };

  // Calculer la date min pour le début
  const getMinStartDate = () => {
    if (!project?.startDate) return format(new Date(), 'yyyy-MM-dd');
    const projectStart = parseISO(project.startDate);
    const today = startOfDay(new Date());
    // Si le projet a déjà commencé, on ne peut pas reculer
    if (isBefore(projectStart, today)) {
      return format(projectStart, 'yyyy-MM-dd');
    }
    return format(today, 'yyyy-MM-dd');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Projet non trouvé</p>
        <Link href="/projects" className="text-primary hover:underline mt-2 inline-block">
          Retour aux projets
        </Link>
      </div>
    );
  }

  const isTerminal = ['completed', 'cancelled'].includes(project.status);
  const currentStatusConfig = statusOptions.find(s => s.value === project.status);

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/projects/${projectId}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Modifier le projet</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-500">Statut actuel:</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
            {currentStatusConfig?.label}
          </span>
        </div>
      </div>

      {/* Warning si terminal */}
      {isTerminal && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Projet {project.status === 'completed' ? 'terminé' : 'annulé'}</p>
            <p className="text-sm text-amber-700">
              Ce projet est en statut terminal. Seules les informations de base peuvent être modifiées.
            </p>
          </div>
        </div>
      )}

      {/* Erreur API */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erreur</p>
            <p className="text-sm">{apiError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du projet *
          </label>
          <input
            {...register('name')}
            disabled={isTerminal}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            disabled={isTerminal}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Statut avec transitions validées */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            {...register('status')}
            disabled={isTerminal}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50"
          >
            {statusOptions.map((option) => {
              const isAvailable = availableStatuses.includes(option.value);
              const isCurrent = project.status === option.value;
              return (
                <option 
                  key={option.value} 
                  value={option.value}
                  disabled={!isAvailable}
                >
                  {option.label} {isCurrent ? '(actuel)' : ''} {!isAvailable && '— indisponible'}
                </option>
              );
            })}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            {currentStatus === project.status 
              ? 'Aucun changement de statut' 
              : `Transition: ${currentStatusConfig?.label} → ${statusOptions.find(s => s.value === currentStatus)?.label}`}
          </p>
          {!isValidTransition(currentStatus) && currentStatus !== project.status && (
            <p className="mt-1 text-sm text-red-600">
              Cette transition n'est pas autorisée
            </p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget (€)
          </label>
          <input
            type="number"
            {...register('budget')}
            disabled={isTerminal}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date de début
              {currentStatus === 'active' && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              min={getMinStartDate()}
              {...register('startDate')}
              disabled={isTerminal || (project.status === 'active' && !!project.startDate)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.startDate.message}
              </p>
            )}
            {project.status === 'active' && project.startDate && (
              <p className="text-xs text-gray-500 mt-1">
                Déjà démarré le {format(parseISO(project.startDate), 'dd/MM/yyyy', { locale: fr })}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date de fin
            </label>
            <input
              type="date"
              min={startDate ? format(addDays(new Date(startDate), 1), 'yyyy-MM-dd') : getMinStartDate()}
              {...register('endDate')}
              disabled={isTerminal}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={!isDirty || updateProject.isPending || !isValidTransition(currentStatus)}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateProject.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <Link
            href={`/projects/${projectId}`}
            className="px-6 py-3 text-gray-600 hover:text-gray-900"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}