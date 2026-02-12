'use client';

import { useState } from 'react';
import { useIndicatorTimeline, useAddValue, type Indicator } from '@/lib/hooks/useIndicators';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQueryClient } from '@tanstack/react-query';

const valueSchema = z.object({
  value: z.string().min(1, 'Valeur requise'),
  period: z.string().min(1, 'Période requise'),
  notes: z.string().optional(),
});

type ValueForm = z.infer<typeof valueSchema>;

// Mock indicator pour l'exemple - à remplacer par vrai fetch
const mockIndicator: Indicator = {
  id: '1',
  name: 'Nombre de bénéficiaires',
  description: 'Nombre total de jeunes accompagnés',
  type: 'number',
  targetValue: 100,
  projectId: '1',
  values: [],
  createdAt: new Date().toISOString(),
};

export default function IndicatorDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const indicatorId = params.id as string;
  
  const { data: timeline, isLoading } = useIndicatorTimeline(indicatorId);
  const addValue = useAddValue();
  
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ValueForm>({
    resolver: zodResolver(valueSchema),
    defaultValues: {
      period: new Date().toISOString().slice(0, 7), //! YYYY-MM
    },
  });

  const onSubmit = (data: ValueForm) => {
    addValue.mutate(
      {
        indicatorId,
        data: {
          value: parseFloat(data.value),
          period: data.period,
          notes: data.notes,
        },
      },
      {
        onSuccess: () => {
          reset();
          setShowForm(false);
          queryClient.invalidateQueries({ queryKey: ['indicator-timeline', indicatorId] });
          queryClient.invalidateQueries({ queryKey: ['indicators'] });
        },
      }
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  const chartData = timeline?.map((v) => ({
    period: v.period,
    value: Number(v.value),
  })) || [];

  const currentValue = timeline?.[timeline.length - 1]?.value || 0;
  const progress = mockIndicator.targetValue 
    ? Math.min((Number(currentValue) / mockIndicator.targetValue) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/indicators"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux indicateurs
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mockIndicator.name}</h1>
            {mockIndicator.description && (
              <p className="text-gray-600 mt-1">{mockIndicator.description}</p>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une valeur
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Valeur actuelle
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentValue}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Objectif
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockIndicator.targetValue}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-600 text-sm mb-1">Progression</div>
            <p className="text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</p>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Nouvelle saisie</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valeur</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('value')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
                {errors.value && <p className="text-red-600 text-xs mt-1">{errors.value.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période (YYYY-MM)</label>
                <input
                  type="month"
                  {...register('period')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                />
                {errors.period && <p className="text-red-600 text-xs mt-1">{errors.period.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
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
                disabled={isSubmitting || addValue.isPending}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {addValue.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="period" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Aucune donnée. Ajoutez votre première valeur !</p>
          </div>
        )}
      </div>

      {timeline && timeline.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des saisies</h2>
          <div className="space-y-2">
            {[...timeline].reverse().map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{entry.period}</span>
                  {entry.notes && <span className="text-gray-500 text-sm">- {entry.notes}</span>}
                </div>
                <span className="font-semibold text-gray-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}