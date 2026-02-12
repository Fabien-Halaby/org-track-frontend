'use client';

import { useState, useEffect } from 'react';
import { useProjects } from '@/lib/hooks/useProjects';
import { useIndicators, useIndicatorTimeline } from '@/lib/hooks/useIndicators';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  TrendingUp, 
  Plus, 
  BarChart3,
  Target,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function IndicatorsPage() {
  const searchParams = useSearchParams();
  const projectFromUrl = searchParams.get('project');

  const { data: projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string>('');

  useEffect(() => {
    if (projectFromUrl) {
      setSelectedProject(projectFromUrl);
    }
  }, [projectFromUrl]);

  const { data: indicators, isLoading } = useIndicators(selectedProject || undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Indicateurs</h1>
          <p className="text-gray-500 mt-1">Suivez vos KPIs et mesurez votre impact</p>
        </div>
        {selectedProject && (
          <Link
            href={`/indicators/new?project=${selectedProject}`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvel indicateur
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner un projet
        </label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value="">Choisir un projet...</option>
          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedProject && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Sélectionnez un projet pour voir ses indicateurs</p>
        </div>
      )}

      {isLoading && selectedProject && (
        <div className="flex items-center justify-center h-64">Chargement...</div>
      )}

      {indicators && indicators.length === 0 && selectedProject && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Aucun indicateur pour ce projet</p>
          <Link
            href={`/indicators/new?project=${selectedProject}`}
            className="text-primary hover:underline mt-2 inline-block"
          >
            Créer votre premier indicateur
          </Link>
        </div>
      )}

      <div className="grid gap-6">
        {indicators?.map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>
    </div>
  );
}

function IndicatorCard({ indicator }: { indicator: import('@/lib/hooks/useIndicators').Indicator }) {
  const { data: timeline } = useIndicatorTimeline(indicator.id);
  
  const chartData = timeline?.map((v) => ({
    period: v.period,
    value: Number(v.value),
  })) || [];

  const currentValue = timeline?.[timeline.length - 1]?.value || 0;
  const progress = indicator.targetValue 
    ? Math.min((currentValue / indicator.targetValue) * 100, 100)
    : 0;

  const typeLabels = {
    number: 'Nombre',
    percentage: 'Pourcentage',
    currency: 'Euros',
    boolean: 'Oui/Non',
  };

  const formatValue = (value: number) => {
    if (indicator.type === 'currency') return `${value.toLocaleString('fr-FR')} €`;
    if (indicator.type === 'percentage') return `${value}%`;
    return value.toLocaleString('fr-FR');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{indicator.name}</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {typeLabels[indicator.type]}
            </span>
          </div>
          {indicator.description && (
            <p className="text-sm text-gray-500">{indicator.description}</p>
          )}
        </div>
        <Link
          href={`/indicators/${indicator.id}`}
          className="flex items-center gap-1 text-primary hover:underline text-sm"
        >
          Détails
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
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

      {chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="period" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => indicator.type === 'currency' ? `${value}€` : value}
              />
              <Tooltip 
                formatter={(value: number) => [formatValue(value), 'Valeur']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2 }}
              />
              {indicator.targetValue && (
                <Line 
                  type="monotone" 
                  dataKey={() => indicator.targetValue} 
                  stroke="#16a34a" 
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length === 0 && (
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-400 text-sm">Aucune donnée saisie</p>
        </div>
      )}
    </div>
  );
}