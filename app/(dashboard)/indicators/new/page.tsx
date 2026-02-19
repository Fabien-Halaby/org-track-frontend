'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateIndicator } from '@/lib/hooks/useIndicators';
import { useProjects } from '@/lib/hooks/useProjects';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const indicatorSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().optional(),
  type: z.enum(['number', 'percentage', 'currency', 'boolean']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'free']),
  targetValue: z.union([
    z.string().min(1).transform((val) => parseFloat(val)),
    z.literal(''),
    z.undefined(),
  ]).optional(),
  projectId: z.string().min(1, 'Projet requis'),
});

type IndicatorForm = z.infer<typeof indicatorSchema>;

export default function NewIndicatorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProject = searchParams.get('project') || '';
  
  const { data: projects } = useProjects();
  const createIndicator = useCreateIndicator();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndicatorForm>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: {
      projectId: preselectedProject,
      type: 'number',
      frequency: 'monthly',
    },
  });

  const onSubmit = (data: IndicatorForm) => {
    const payload: any = {
      name: data.name,
      description: data.description || undefined,
      type: data.type,
      frequency: data.frequency,
      projectId: data.projectId,
    };
    
    // N'ajouter targetValue que s'il est valide
    if (data.targetValue && data.targetValue !== '' && !isNaN(Number(data.targetValue))) {
      payload.targetValue = Number(data.targetValue);
    }
    
    console.log('Payload:', payload);
    
    createIndicator.mutate(payload, {
      onSuccess: () => {
        router.push(`/indicators?project=${data.projectId}`);
      },
      onError: (error: any) => {
        console.error('Erreur:', error.response?.data);
      },
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/indicators"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvel indicateur</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Projet *
          </label>
          <select
            {...register('projectId')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            disabled={!!preselectedProject}
          >
            <option value="">Sélectionner un projet...</option>
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {"Nom de l'indicateur *"}
          </label>
          <input
            {...register('name')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Nombre de bénéficiaires"
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
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            placeholder="Décrivez ce que mesure cet indicateur..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fréquence de saisie *
          </label>
          <select
            {...register('frequency')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            // defaultValue={"monthly"}
          >
            <option value="daily">Quotidien (ex: bénéficiaires accueillis)</option>
            <option value="weekly">Hebdomadaire (ex: sessions de formation)</option>
            <option value="monthly">Mensuel (ex: budget consommé)</option>
            <option value="quarterly">{"Trimestriel (ex: rapport d'impact)"}</option>
            <option value="yearly">Annuel (ex: audit financier)</option>
            <option value="free">Libre (pas de contrainte)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Définit la périodicité de saisie des données
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de mesure *
            </label>
            <select
              {...register('type')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="number">Nombre (ex: 50 personnes)</option>
              <option value="percentage">Pourcentage (ex: 75%)</option>
              <option value="currency">Montant en € (ex: 10 000 €)</option>
              <option value="boolean">Oui/Non (ex: Objectif atteint)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objectif cible (optionnel)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('targetValue')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="100"
            />
          </div>
        </div>

        {createIndicator.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {"Erreur lors de la création de l'indicateur"}
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || createIndicator.isPending}
            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {createIndicator.isPending ? 'Création...' : 'Créer l\'indicateur'}
          </button>
          <Link
            href="/indicators"
            className="px-6 py-3 text-gray-600 hover:text-gray-900"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}