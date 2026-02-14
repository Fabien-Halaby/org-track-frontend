'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  TrendingUp,
  Target,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Save,
  Loader2
} from 'lucide-react';
import { 
  useIndicator, 
  useIndicatorTimeline, 
  useAddValue, 
  useUpdateValue,
  useDeleteIndicator, 
  useDeleteValue, 
  IndicatorValue
} from '@/lib/hooks/useIndicators';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const valueSchema = z.object({
  value: z.string().min(1, 'Valeur requise'),
  period: z.string().min(1, 'Période requise'),
  notes: z.string().optional(),
});

type ValueForm = z.infer<typeof valueSchema>;

export default function IndicatorDetailPage() {
  const params = useParams();
  const indicatorId = params.id as string;
  
  const { data: indicator, isLoading: indicatorLoading } = useIndicator(indicatorId);
  const { data: timeline, isLoading: timelineLoading } = useIndicatorTimeline(indicatorId);
  const addValue = useAddValue();
  const updateValue = useUpdateValue();
  const deleteIndicator = useDeleteIndicator();
  const deleteValue = useDeleteValue();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<IndicatorValue | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ValueForm>({
    resolver: zodResolver(valueSchema),
    defaultValues: {
      period: new Date().toISOString().slice(0, 7),
    },
  });

  const startEditing = (entry: IndicatorValue) => {
    setEditingValue(entry);
    setValue('value', entry.value.toString());
    setValue('period', entry.period);
    setValue('notes', entry.notes || '');
    setShowAddForm(true);
  };

  const onSubmit = (data: ValueForm) => {
    const payload = {
      value: parseFloat(data.value),
      period: data.period,
      notes: data.notes,
    };

    if (editingValue) {
      updateValue.mutate(
        {
          indicatorId,
          valueId: editingValue.id,
          data: payload,
        },
        {
          onSuccess: () => {
            reset();
            setShowAddForm(false);
            setEditingValue(null);
          },
        }
      );
    } else {
      addValue.mutate(
        {
          indicatorId,
          data: payload,
        },
        {
          onSuccess: () => {
            reset();
            setShowAddForm(false);
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingValue(null);
    reset();
  };

  if (indicatorLoading || timelineLoading) {
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

  const chartData = timeline?.map((v) => ({
    period: v.period,
    value: Number(v.value),
  })) || [];

  const currentValue = timeline?.[timeline.length - 1]?.value || 0;
  const progress = indicator.targetValue 
    ? Math.min((Number(currentValue) / Number(indicator.targetValue)) * 100, 100)
    : 0;

  const formatValue = (value: number) => {
    if (indicator.type === 'currency') return `${value.toLocaleString('fr-FR')} €`;
    if (indicator.type === 'percentage') return `${value}%`;
    if (indicator.type === 'boolean') return value ? 'Oui' : 'Non';
    return value.toLocaleString('fr-FR');
  };

  const typeLabels: Record<string, string> = {
    number: 'Nombre',
    percentage: 'Pourcentage',
    currency: 'Euros',
    boolean: 'Oui/Non',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/indicators?project=${indicator.projectId}`}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{indicator.name}</h1>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {typeLabels[indicator.type]}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              {indicator.description || 'Aucune description'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Link
            href={`/indicators/${indicatorId}/edit`}
            className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
            title="Modifier l'indicateur"
          >
            <Edit2 className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer l'indicateur"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            Valeur actuelle
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatValue(Number(currentValue))}</p>
        </div>

        {indicator.targetValue && (
          <>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
                <Target className="w-4 h-4" />
                Objectif
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatValue(Number(indicator.targetValue))}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-purple-600 text-sm mb-1">Progression</div>
              <p className="text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</p>
            </div>
          </>
        )}
      </div>

      {/* Graphique */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution</h2>
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value?: number) => [formatValue(value ?? 0), 'Valeur']} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Aucune donnée saisie</p>
          </div>
        )}
      </div>

      {/* Historique + Ajout */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Historique des saisies
          </h2>
          <button
            onClick={() => {
              if (showAddForm) {
                handleCancel();
              } else {
                setShowAddForm(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? 'Annuler' : 'Ajouter une valeur'}
          </button>
        </div>

        {/* Formulaire ajout/édition */}
        {showAddForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              {editingValue ? 'Modifier la valeur' : 'Nouvelle saisie'}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('value')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
                {errors.value && <p className="text-red-600 text-xs mt-1">{errors.value.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                <input
                  type="month"
                  {...register('period')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  {...register('notes')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Optionnel"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting || addValue.isPending || updateValue.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {addValue.isPending || updateValue.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              {editingValue && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        )}

        {/* Tableau historique */}
        <div className="space-y-2">
          {timeline && timeline.length > 0 ? (
            [...timeline].reverse().map((entry) => (
              <div 
                key={entry.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900 w-24">{entry.period}</span>
                  <span className="font-semibold text-gray-900">{formatValue(Number(entry.value))}</span>
                  {entry.notes && <span className="text-sm text-gray-500">- {entry.notes}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditing(entry)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setValueToDelete(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-gray-400">Aucune valeur enregistrée</p>
          )}
        </div>
      </div>

      {/* Modal suppression indicateur */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">{"Supprimer l'indicateur ?"}</h3>
            </div>
            <p className="text-gray-600 mb-6">
              <strong>{indicator.name}</strong> et tout son historique seront définitivement supprimés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteIndicator.mutate(indicatorId)}
                disabled={deleteIndicator.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {deleteIndicator.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression valeur */}
      {valueToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Supprimer cette valeur ?</h3>
            <p className="text-gray-600 mb-4">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  deleteValue.mutate({ indicatorId, valueId: valueToDelete });
                  setValueToDelete(null);
                }}
                disabled={deleteValue.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {deleteValue.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
              <button
                onClick={() => setValueToDelete(null)}
                className="flex-1 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
