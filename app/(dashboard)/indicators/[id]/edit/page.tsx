'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  BarChart3,
  Target,
  FileText,
  Tag,
  Clock,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useIndicator, useUpdateIndicator } from '@/lib/hooks/useIndicators';

const indicatorSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  type: z.enum(['number', 'percentage', 'currency', 'boolean']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'free']),
  targetValue: z.string().optional(),
});

type IndicatorForm = z.infer<typeof indicatorSchema>;

const typeOptions = [
  { value: 'number', label: 'Nombre', description: 'Valeur numérique simple' },
  { value: 'percentage', label: 'Pourcentage', description: 'Taux ou proportion' },
  { value: 'currency', label: 'Montant', description: 'En euros (€)' },
  { value: 'boolean', label: 'Oui/Non', description: 'État binaire' },
];

const frequencyOptions = [
  { value: 'daily', label: 'Quotidien', description: 'Saisie chaque jour', example: 'Bénéficiaires accueillis' },
  { value: 'weekly', label: 'Hebdomadaire', description: 'Saisie chaque semaine', example: 'Sessions de formation' },
  { value: 'monthly', label: 'Mensuel', description: 'Saisie chaque mois', example: 'Budget consommé' },
  { value: 'quarterly', label: 'Trimestriel', description: 'Saisie chaque trimestre', example: 'Rapport d\'impact' },
  { value: 'yearly', label: 'Annuel', description: 'Saisie chaque année', example: 'Audit financier' },
  { value: 'free', label: 'Libre', description: 'Pas de contrainte de période', example: 'Événement ponctuel' },
];

export default function EditIndicatorPage() {
  const params = useParams();
  const router = useRouter();
  const indicatorId = params.id as string;

  const { data: indicator, isLoading } = useIndicator(indicatorId);
  const updateIndicator = useUpdateIndicator();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<IndicatorForm>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'number',
      frequency: 'monthly',
      targetValue: '',
    },
  });

  useEffect(() => {
    if (indicator) {
      reset({
        name: indicator.name,
        description: indicator.description || '',
        type: indicator.type,
        frequency: indicator.frequency ?? 'monthly',
        targetValue: indicator.targetValue?.toString() || '',
      });
    }
  }, [indicator, reset]);

  const selectedType = watch('type');
  const selectedFrequency = watch('frequency');

  const onSubmit = (data: IndicatorForm) => {
    const payload: any = {
      name: data.name,
      description: data.description || null,
      type: data.type,
      frequency: data.frequency,
    };

    if (data.targetValue && data.targetValue.trim() !== '') {
      if (data.type === 'boolean') {
        payload.targetValue = data.targetValue === '1' ? 1 : 0;
      } else {
        payload.targetValue = parseFloat(data.targetValue);
      }
    } else {
      payload.targetValue = null;
    }

    updateIndicator.mutate(
      { id: indicatorId, data: payload },
      {
        onSuccess: () => {
          router.push(`/indicators/${indicatorId}`);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!indicator) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Indicateur non trouvé</p>
        <Link href="/indicators" className="text-primary hover:underline mt-2 inline-block">
          Retour aux indicateurs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/indicators/${indicatorId}`}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l'indicateur</h1>
          <p className="text-gray-500 text-sm">Modifiez les informations de {indicator.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">

        {/* Nom */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            {"Nom de l'indicateur *"}
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="Ex: Nombre de bénéficiaires"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
            placeholder="Décrivez ce que mesure cet indicateur..."
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Type de mesure *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {typeOptions.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  selectedType === option.value
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('type')}
                  className="sr-only"
                />
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </label>
            ))}
          </div>
        </div>

        {/* ✅ Fréquence — nouveau champ */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Fréquence de saisie *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {frequencyOptions.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                  selectedFrequency === option.value
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register('frequency')}
                  className="sr-only"
                />
                <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                <div className="text-xs text-gray-400 mt-1 italic">{option.example}</div>
              </label>
            ))}
          </div>
          {/* ✅ Avertissement si changement de fréquence sur un indicateur avec données */}
          {indicator.values && indicator.values.length > 0 && isDirty && (
            <p className="text-amber-600 text-xs mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⚠️ Cet indicateur contient déjà des valeurs saisies. Changer la fréquence n'affecte pas les données existantes mais modifiera le format des futures saisies.
            </p>
          )}
        </div>

        {/* Objectif */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Valeur cible (optionnel)
          </label>
          {selectedType === 'boolean' ? (
            <select
              {...register('targetValue')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Pas d'objectif</option>
              <option value="1">Oui (1)</option>
              <option value="0">Non (0)</option>
            </select>
          ) : (
            <input
              type="number"
              step={selectedType === 'currency' ? '0.01' : selectedType === 'percentage' ? '0.1' : '1'}
              {...register('targetValue')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder={
                selectedType === 'currency' ? 'Ex: 50000' :
                selectedType === 'percentage' ? 'Ex: 75' :
                'Ex: 100'
              }
            />
          )}
          <p className="text-sm text-gray-500 mt-1">
            Définissez un objectif à atteindre pour suivre la progression
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={!isDirty || updateIndicator.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateIndicator.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer les modifications
          </button>

          <Link
            href={`/indicators/${indicatorId}`}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>

      {/* Info projet */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>Projet :</strong> {indicator.project?.name || 'Non disponible'}
        </p>
        <p className="text-sm text-blue-600 mt-1">
          Créé le {new Date(indicator.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>
  );
}
