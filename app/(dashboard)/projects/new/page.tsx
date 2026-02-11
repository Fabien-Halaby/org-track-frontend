'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProject } from '@/lib/hooks/useProjects';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft'),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'draft',
    },
  });

  const onSubmit = (data: ProjectForm) => {
    createProject.mutate(
      {
        ...data,
        budget: data.budget ? parseFloat(data.budget) : undefined,
      },
      {
        onSuccess: () => {
          router.push('/projects');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouveau projet</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du projet *
          </label>
          <input
            {...register('name')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Projet Insertion Jeunes 2024"
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
            placeholder="Décrivez l'objectif du projet..."
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
              placeholder="50000"
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

        {createProject.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            Erreur lors de la création du projet
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || createProject.isPending}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {createProject.isPending ? 'Création...' : 'Créer le projet'}
          </button>
          <Link
            href="/projects"
            className="px-6 py-3 text-gray-600 hover:text-gray-900"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}