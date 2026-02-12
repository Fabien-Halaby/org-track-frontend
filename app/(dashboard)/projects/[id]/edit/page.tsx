'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProject, useUpdateProject } from '@/lib/hooks/useProjects';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'draft',
      budget: '',
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (project && !isLoading) {
      reset({
        name: project.name,
        description: project.description || '',
        status: project.status,
        budget: project.budget?.toString() || '',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',  // ← Format YYYY-MM-DD
        endDate: project.endDate ? project.endDate.split('T')[0] : '',
      });
    }
  }, [project, isLoading, reset]);

  const onSubmit = (data: ProjectForm) => {
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
      }
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  if (!project) {
    return <div>Projet non trouvé</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/projects/${projectId}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier le projet</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du projet *
          </label>
          <input
            {...register('name')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="draft">Brouillon</option>
              <option value="active">Actif</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (€)
            </label>
            <input
              type="number"
              {...register('budget')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        {updateProject.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            Erreur lors de la modification
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || updateProject.isPending}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {updateProject.isPending ? 'Enregistrement...' : 'Enregistrer'}
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