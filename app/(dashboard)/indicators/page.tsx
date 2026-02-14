'use client';

import { useState, useEffect, useMemo } from 'react';
import { useProjects } from '@/lib/hooks/useProjects';
import { useIndicators, useIndicatorTimeline, Indicator } from '@/lib/hooks/useIndicators';
import api from '@/lib/api/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  TrendingUp, 
  Plus, 
  BarChart3,
  Target,
  ArrowRight,
  DollarSign,
  Calendar,
  Activity,
  ChevronRight,
  Search,
  Filter,
  X} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type FilterType = 'all' | 'number' | 'percentage' | 'currency' | 'boolean';
type SortBy = 'name' | 'progress' | 'recent';

export default function IndicatorsPage() {
  const searchParams = useSearchParams();
  const projectFromUrl = searchParams.get('project');

  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string>(projectFromUrl || '');
  const [allIndicators, setAllIndicators] = useState<Indicator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Removed unnecessary effect that sets state synchronously from effect

  // Charge tous les indicateurs de tous les projets
  useEffect(() => {
    if (!projects) return;
    
    const loadAllIndicators = async () => {
      const allInds: Indicator[] = [];
      for (const project of projects) {
        try {
          const response = await api.get(`/indicators/project/${project.id}`);
          const indicators = response.data.map((ind: Indicator) => ({
            ...ind,
            projectName: project.name,
            projectId: project.id
          }));
          allInds.push(...indicators);
        } catch (error) {
          console.error(`Erreur chargement indicateurs projet ${project.id}:`, error);
        }
      }
      setAllIndicators(allInds);
    };
    
    loadAllIndicators();
  }, [projects]);

  // Filtres et recherche
  const filteredIndicators = useMemo(() => {
    let result = allIndicators;

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ind => 
        ind.name.toLowerCase().includes(query) ||
        ind.description?.toLowerCase().includes(query)
      );
    }

    // Filtre par type
    if (filterType !== 'all') {
      result = result.filter(ind => ind.type === filterType);
    }

    // Tri
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [allIndicators, searchQuery, filterType, sortBy]);

  // Stats globales
  const globalStats = useMemo(() => {
    if (!projects) return null;
    
    const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalIndicators = allIndicators.length;
    const indicatorsWithTarget = allIndicators.filter(i => i.targetValue !== null).length;

    return {
      totalBudget,
      activeProjects,
      totalIndicators,
      indicatorsWithTarget,
      projectsCount: projects.length
    };
  }, [projects, allIndicators]);

  // Vue détail projet sélectionné
  const { data: indicators, isLoading } = useIndicators(selectedProject || undefined);

  //! === VUE GLOBALE (aucun projet sélectionné) ===
  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord des indicateurs</h1>
          <p className="text-gray-500 mt-1">Vue transversale de tous vos projets et performances</p>
        </div>

        {projectsLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
          </div>
        ) : !globalStats ? (
          <div className="text-center py-12">Aucune donnée</div>
        ) : (
          <>
            {/* KPIs globaux */}
            <div className="grid grid-cols-4 gap-4">
              <KpiCard
                title="Budget total"
                value={`${globalStats.totalBudget.toLocaleString('fr-FR')} €`}
                subtitle={`${globalStats.projectsCount} projets`}
                icon={DollarSign}
                color="blue"
              />
              <KpiCard
                title="Projets actifs"
                value={globalStats.activeProjects}
                subtitle={`${Math.round((globalStats.activeProjects / globalStats.projectsCount) * 100)}% en cours`}
                icon={Activity}
                color="green"
              />
              <KpiCard
                title="Indicateurs suivis"
                value={globalStats.totalIndicators}
                subtitle={`${globalStats.indicatorsWithTarget} avec objectif`}
                icon={BarChart3}
                color="purple"
              />
              <KpiCard
                title="Mois en cours"
                value={new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                subtitle="Période de reporting"
                icon={Calendar}
                color="orange"
              />
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un indicateur..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    showFilters ? 'bg-blue-50 border-primary text-primary' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filtres
                  {(filterType !== 'all' || sortBy !== 'recent') && (
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Filtres avancés */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Type:</span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as FilterType)}
                      className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="all">Tous</option>
                      <option value="number">Nombre</option>
                      <option value="percentage">%</option>
                      <option value="currency">€</option>
                      <option value="boolean">Oui/Non</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Trier par:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="recent">Plus récent</option>
                      <option value="name">Nom</option>
                    </select>
                  </div>

                  {(filterType !== 'all' || sortBy !== 'recent') && (
                    <button
                      onClick={() => {
                        setFilterType('all');
                        setSortBy('recent');
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Liste des indicateurs filtrés */}
            {filteredIndicators.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {filteredIndicators.length} indicateur{filteredIndicators.length > 1 ? 's' : ''}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {filteredIndicators.map((indicator) => (
                    <IndicatorListItem key={indicator.id} indicator={indicator} />
                  ))}
                </div>
              </div>
            ) : searchQuery ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun indicateur ne correspond à votre recherche</p>
              </div>
            ) : null}

            {/* Liste projets avec preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Explorer par projet</h3>
              
              <div className="space-y-3">
                {projects?.map(project => {
                  const projectIndicators = allIndicators.filter(ind => ind.projectId === project.id);
                  const hasIndicators = projectIndicators.length > 0;
                  
                  return (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          project.status === 'active' ? 'bg-green-100 text-green-600' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-500">
                            {project.budget ? `${Number(project.budget).toLocaleString('fr-FR')} € • ` : ''}
                            {projectIndicators.length} indicateur{projectIndicators.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {hasIndicators && (
                          <div className="flex -space-x-2">
                            {projectIndicators.slice(0, 3).map((_, i) => (
                              <div 
                                key={i} 
                                className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs text-blue-600 font-medium"
                              >
                                {i + 1}
                              </div>
                            ))}
                            {projectIndicators.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                +{projectIndicators.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // === VUE PROJET SÉLECTIONNÉ ===
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedProject('')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Retour au tableau de bord"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Indicateurs</h1>
            <p className="text-gray-500 text-sm">
              {projects?.find(p => p.id === selectedProject)?.name}
            </p>
          </div>
        </div>
        <Link
          href={`/indicators/new?project=${selectedProject}`}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel indicateur
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">Chargement...</div>
      )}

      {indicators && indicators.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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

type KpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
};

function KpiCard({ title, value, subtitle, icon: Icon, color }: KpiCardProps) {
  const colors: Record<string, { bg: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
  };

  const theme = colors[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${theme.bg}`}>
        <Icon className={`w-6 h-6 ${theme.icon}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function IndicatorListItem({ indicator }: { indicator: Indicator & { projectName?: string } }) {
  return (
    <Link
      href={`/indicators/${indicator.id}`}
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          indicator.type === 'currency' ? 'bg-green-100 text-green-600' :
          indicator.type === 'percentage' ? 'bg-purple-100 text-purple-600' :
          indicator.type === 'boolean' ? 'bg-orange-100 text-orange-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{indicator.name}</h4>
          <p className="text-sm text-gray-500">
            {indicator.projectName} • {indicator.values?.length || 0} valeur(s) saisie(s)
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {indicator.targetValue && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Objectif</p>
            <p className="font-medium text-gray-900">
              {indicator.type === 'currency' ? `${Number(indicator.targetValue).toLocaleString('fr-FR')} €` :
               indicator.type === 'percentage' ? `${indicator.targetValue}%` :
               indicator.targetValue}
            </p>
          </div>
        )}
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Link>
  );
}

function IndicatorCard({ indicator }: { indicator: Indicator }) {
  const { data: timeline } = useIndicatorTimeline(indicator.id);
  
  const chartData = timeline?.map((v) => ({
    period: v.period,
    value: Number(v.value),
  })) || [];

  const currentValue = timeline?.[timeline.length - 1]?.value || 0;
  const progress = indicator.targetValue 
    ? Math.min((currentValue / indicator.targetValue) * 100, 100)
    : 0;

  const typeLabels: Record<string, string> = {
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
              <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                formatter={(value?: number) => [formatValue(value ?? 0), 'Valeur']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2 }}
              />
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
