// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { useProjects } from '@/lib/hooks/useProjects';
// import { useIndicators, useIndicatorTimeline, Indicator } from '@/lib/hooks/useIndicators';
// import { useRole } from '@/lib/hooks/useRole';
// import api from '@/lib/api/client';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import {
//   TrendingUp,
//   Plus,
//   BarChart3,
//   Target,
//   ArrowRight,
//   DollarSign,
//   Calendar,
//   Activity,
//   ChevronRight,
//   Search,
//   Filter,
//   X,
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// type FilterType = 'all' | 'number' | 'percentage' | 'currency' | 'boolean';
// type SortBy = 'name' | 'progress' | 'recent';

// export default function IndicatorsPage() {
//   const searchParams = useSearchParams();
//   const projectFromUrl = searchParams.get('project');

//   const { data: projects, isLoading: projectsLoading } = useProjects();
//   const { canWrite, canAddValues } = useRole(); // ✅ hook rôle

//   const [selectedProject, setSelectedProject] = useState<string>(
//     projectFromUrl || '',
//   );
//   const [allIndicators, setAllIndicators] = useState<Indicator[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterType, setFilterType] = useState<FilterType>('all');
//   const [sortBy, setSortBy] = useState<SortBy>('recent');
//   const [showFilters, setShowFilters] = useState(false);

//   // Charge tous les indicateurs de tous les projets
//   useEffect(() => {
//     if (!projects) return;

//     const loadAllIndicators = async () => {
//       const allInds: Indicator[] = [];
//       for (const project of projects) {
//         try {
//           const response = await api.get(`/indicators/project/${project.id}`);
//           const indicators = response.data.map((ind: Indicator) => ({
//             ...ind,
//             projectName: project.name,
//             projectId: project.id,
//           }));
//           allInds.push(...indicators);
//         } catch (error) {
//           console.error(
//             `Erreur chargement indicateurs projet ${project.id}:`,
//             error,
//           );
//         }
//       }
//       setAllIndicators(allInds);
//     };

//     loadAllIndicators();
//   }, [projects]);

//   // Filtres et recherche
//   const filteredIndicators = useMemo(() => {
//     let result = allIndicators;

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(
//         (ind) =>
//           ind.name.toLowerCase().includes(query) ||
//           ind.description?.toLowerCase().includes(query),
//       );
//     }

//     if (filterType !== 'all') {
//       result = result.filter((ind) => ind.type === filterType);
//     }

//     result = [...result].sort((a, b) => {
//       if (sortBy === 'name') return a.name.localeCompare(b.name);
//       if (sortBy === 'recent')
//         return (
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//       return 0;
//     });

//     return result;
//   }, [allIndicators, searchQuery, filterType, sortBy]);

//   // Stats globales
//   const globalStats = useMemo(() => {
//     if (!projects) return null;

//     const totalBudget = projects.reduce(
//       (sum, p) => sum + (Number(p.budget) || 0),
//       0,
//     );
//     const activeProjects = projects.filter((p) => p.status === 'active').length;
//     const totalIndicators = allIndicators.length;
//     const indicatorsWithTarget = allIndicators.filter(
//       (i) => i.targetValue !== null,
//     ).length;

//     return {
//       totalBudget,
//       activeProjects,
//       totalIndicators,
//       indicatorsWithTarget,
//       projectsCount: projects.length,
//     };
//   }, [projects, allIndicators]);

//   const { data: indicators, isLoading } = useIndicators(
//     selectedProject || undefined,
//   );

//   // === VUE GLOBALE ===
//   if (!selectedProject) {
//     return (
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Tableau de bord des indicateurs
//           </h1>
//           <p className="text-gray-500 mt-1">
//             Vue transversale de tous vos projets et performances
//           </p>
//         </div>

//         {projectsLoading ? (
//           <div className="animate-pulse space-y-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
//             ))}
//           </div>
//         ) : !globalStats ? (
//           <div className="text-center py-12">Aucune donnée</div>
//         ) : (
//           <>
//             {/* KPIs globaux */}
//             <div className="grid grid-cols-4 gap-4">
//               <KpiCard
//                 title="Budget total"
//                 value={`${globalStats.totalBudget.toLocaleString('fr-FR')} €`}
//                 subtitle={`${globalStats.projectsCount} projets`}
//                 icon={DollarSign}
//                 color="blue"
//               />
//               <KpiCard
//                 title="Projets actifs"
//                 value={globalStats.activeProjects}
//                 subtitle={`${Math.round(
//                   (globalStats.activeProjects / globalStats.projectsCount) *
//                     100,
//                 )}% en cours`}
//                 icon={Activity}
//                 color="green"
//               />
//               <KpiCard
//                 title="Indicateurs suivis"
//                 value={globalStats.totalIndicators}
//                 subtitle={`${globalStats.indicatorsWithTarget} avec objectif`}
//                 icon={BarChart3}
//                 color="purple"
//               />
//               <KpiCard
//                 title="Mois en cours"
//                 value={new Date().toLocaleDateString('fr-FR', {
//                   month: 'long',
//                   year: 'numeric',
//                 })}
//                 subtitle="Période de reporting"
//                 icon={Calendar}
//                 color="orange"
//               />
//             </div>

//             {/* Barre de recherche et filtres */}
//             <div className="bg-white rounded-xl border border-gray-200 p-4">
//               <div className="flex items-center gap-4">
//                 <div className="flex-1 relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Rechercher un indicateur..."
//                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
//                   />
//                   {searchQuery && (
//                     <button
//                       onClick={() => setSearchQuery('')}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>

//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
//                     showFilters
//                       ? 'bg-blue-50 border-primary text-primary'
//                       : 'border-gray-300 hover:bg-gray-50'
//                   }`}
//                 >
//                   <Filter className="w-4 h-4" />
//                   Filtres
//                   {(filterType !== 'all' || sortBy !== 'recent') && (
//                     <span className="w-2 h-2 bg-primary rounded-full"></span>
//                   )}
//                 </button>
//               </div>

//               {showFilters && (
//                 <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-500">Type:</span>
//                     <select
//                       value={filterType}
//                       onChange={(e) =>
//                         setFilterType(e.target.value as FilterType)
//                       }
//                       className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary outline-none"
//                     >
//                       <option value="all">Tous</option>
//                       <option value="number">Nombre</option>
//                       <option value="percentage">%</option>
//                       <option value="currency">€</option>
//                       <option value="boolean">Oui/Non</option>
//                     </select>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-500">Trier par:</span>
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value as SortBy)}
//                       className="px-3 py-1 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary outline-none"
//                     >
//                       <option value="recent">Plus récent</option>
//                       <option value="name">Nom</option>
//                     </select>
//                   </div>

//                   {(filterType !== 'all' || sortBy !== 'recent') && (
//                     <button
//                       onClick={() => {
//                         setFilterType('all');
//                         setSortBy('recent');
//                       }}
//                       className="text-sm text-red-600 hover:text-red-700"
//                     >
//                       Réinitialiser
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Liste des indicateurs filtrés */}
//             {filteredIndicators.length > 0 ? (
//               <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
//                   <h3 className="font-semibold text-gray-900">
//                     {filteredIndicators.length} indicateur
//                     {filteredIndicators.length > 1 ? 's' : ''}
//                   </h3>
//                 </div>
//                 <div className="divide-y divide-gray-100">
//                   {filteredIndicators.map((indicator) => (
//                     <IndicatorListItem key={indicator.id} indicator={indicator} />
//                   ))}
//                 </div>
//               </div>
//             ) : searchQuery ? (
//               <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//                 <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">
//                   Aucun indicateur ne correspond à votre recherche
//                 </p>
//               </div>
//             ) : null}

//             {/* Liste projets avec preview */}
//             <div className="bg-white rounded-xl border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Explorer par projet
//               </h3>

//               <div className="space-y-3">
//                 {projects?.map((project) => {
//                   const projectIndicators = allIndicators.filter(
//                     (ind) => ind.projectId === project.id,
//                   );
//                   const hasIndicators = projectIndicators.length > 0;

//                   return (
//                     <button
//                       key={project.id}
//                       onClick={() => setSelectedProject(project.id)}
//                       className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                             project.status === 'active'
//                               ? 'bg-green-100 text-green-600'
//                               : project.status === 'completed'
//                               ? 'bg-blue-100 text-blue-600'
//                               : 'bg-gray-100 text-gray-600'
//                           }`}
//                         >
//                           <Activity className="w-5 h-5" />
//                         </div>
//                         <div>
//                           <h4 className="font-medium text-gray-900">
//                             {project.name}
//                           </h4>
//                           <p className="text-sm text-gray-500">
//                             {project.budget
//                               ? `${Number(project.budget).toLocaleString('fr-FR')} € • `
//                               : ''}
//                             {projectIndicators.length} indicateur
//                             {projectIndicators.length !== 1 ? 's' : ''}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         {hasIndicators && (
//                           <div className="flex -space-x-2">
//                             {projectIndicators.slice(0, 3).map((_, i) => (
//                               <div
//                                 key={i}
//                                 className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs text-blue-600 font-medium"
//                               >
//                                 {i + 1}
//                               </div>
//                             ))}
//                             {projectIndicators.length > 3 && (
//                               <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
//                                 +{projectIndicators.length - 3}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                         <ChevronRight className="w-5 h-5 text-gray-400" />
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     );
//   }

//   // === VUE PROJET SÉLECTIONNÉ ===
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setSelectedProject('')}
//             className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//             title="Retour au tableau de bord"
//           >
//             <ArrowRight className="w-5 h-5 rotate-180" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Indicateurs</h1>
//             <p className="text-gray-500 text-sm">
//               {projects?.find((p) => p.id === selectedProject)?.name}
//             </p>
//           </div>
//         </div>

//         {/* ✅ Bouton "Nouvel indicateur" : admin et manager uniquement */}
//         {canWrite && (
//           <Link
//             href={`/indicators/new?project=${selectedProject}`}
//             className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
//           >
//             <Plus className="w-4 h-4" />
//             Nouvel indicateur
//           </Link>
//         )}
//       </div>

//       {isLoading && (
//         <div className="flex items-center justify-center h-64">
//           Chargement...
//         </div>
//       )}

//       {indicators && indicators.length === 0 && (
//         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//           <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-500">Aucun indicateur pour ce projet</p>
//           {/* ✅ Lien créer : admin et manager uniquement */}
//           {canWrite && (
//             <Link
//               href={`/indicators/new?project=${selectedProject}`}
//               className="text-primary hover:underline mt-2 inline-block"
//             >
//               Créer votre premier indicateur
//             </Link>
//           )}
//         </div>
//       )}

//       <div className="grid gap-6">
//         {indicators?.map((indicator) => (
//           <IndicatorCard
//             key={indicator.id}
//             indicator={indicator}
//             canAddValues={canAddValues} // ✅ passer la permission
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Composants ────────────────────────────────────────────────────────────────

// type KpiCardProps = {
//   title: string;
//   value: string | number;
//   subtitle?: string;
//   icon: React.ComponentType<{ className?: string }>;
//   color: 'blue' | 'green' | 'purple' | 'orange';
// };

// function KpiCard({ title, value, subtitle, icon: Icon, color }: KpiCardProps) {
//   const colors: Record<string, { bg: string; icon: string }> = {
//     blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
//     green: { bg: 'bg-green-50', icon: 'text-green-600' },
//     purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
//     orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
//   };

//   const theme = colors[color];

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
//       <div
//         className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${theme.bg}`}
//       >
//         <Icon className={`w-6 h-6 ${theme.icon}`} />
//       </div>
//       <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
//       <p className="text-sm font-medium text-gray-600">{title}</p>
//       {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
//     </div>
//   );
// }

// function IndicatorListItem({
//   indicator,
// }: {
//   indicator: Indicator & { projectName?: string };
// }) {
//   return (
//     <Link
//       href={`/indicators/${indicator.id}`}
//       className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
//     >
//       <div className="flex items-center gap-4">
//         <div
//           className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//             indicator.type === 'currency'
//               ? 'bg-green-100 text-green-600'
//               : indicator.type === 'percentage'
//               ? 'bg-purple-100 text-purple-600'
//               : indicator.type === 'boolean'
//               ? 'bg-orange-100 text-orange-600'
//               : 'bg-blue-100 text-blue-600'
//           }`}
//         >
//           <BarChart3 className="w-5 h-5" />
//         </div>
//         <div>
//           <h4 className="font-medium text-gray-900">{indicator.name}</h4>
//           <p className="text-sm text-gray-500">
//             {indicator.projectName} • {indicator.values?.length || 0} valeur(s)
//             saisie(s)
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         {indicator.targetValue && (
//           <div className="text-right">
//             <p className="text-sm text-gray-500">Objectif</p>
//             <p className="font-medium text-gray-900">
//               {indicator.type === 'currency'
//                 ? `${Number(indicator.targetValue).toLocaleString('fr-FR')} €`
//                 : indicator.type === 'percentage'
//                 ? `${indicator.targetValue}%`
//                 : indicator.targetValue}
//             </p>
//           </div>
//         )}
//         <ChevronRight className="w-5 h-5 text-gray-400" />
//       </div>
//     </Link>
//   );
// }

// function IndicatorCard({
//   indicator,
//   canAddValues,
// }: {
//   indicator: Indicator;
//   canAddValues: boolean; // ✅ prop permission
// }) {
//   const { data: timeline } = useIndicatorTimeline(indicator.id);

//   const chartData =
//     timeline?.map((v) => ({
//       period: v.period,
//       value: Number(v.value),
//     })) || [];

//   const currentValue = timeline?.[timeline.length - 1]?.value || 0;
//   const progress = indicator.targetValue
//     ? Math.min((currentValue / indicator.targetValue) * 100, 100)
//     : 0;

//   const typeLabels: Record<string, string> = {
//     number: 'Nombre',
//     percentage: 'Pourcentage',
//     currency: 'Euros',
//     boolean: 'Oui/Non',
//   };

//   const formatValue = (value: number) => {
//     if (indicator.type === 'currency')
//       return `${value.toLocaleString('fr-FR')} €`;
//     if (indicator.type === 'percentage') return `${value}%`;
//     return value.toLocaleString('fr-FR');
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6">
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <h3 className="text-lg font-semibold text-gray-900">
//               {indicator.name}
//             </h3>
//             <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//               {typeLabels[indicator.type]}
//             </span>
//           </div>
//           {indicator.description && (
//             <p className="text-sm text-gray-500">{indicator.description}</p>
//           )}
//         </div>
//         <Link
//           href={`/indicators/${indicator.id}`}
//           className="flex items-center gap-1 text-primary hover:underline text-sm"
//         >
//           Détails
//           <ArrowRight className="w-4 h-4" />
//         </Link>
//       </div>

//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div className="bg-blue-50 rounded-lg p-4">
//           <div className="flex items-center gap-2 text-blue-600 text-sm mb-1">
//             <TrendingUp className="w-4 h-4" />
//             Valeur actuelle
//           </div>
//           <p className="text-2xl font-bold text-gray-900">
//             {formatValue(Number(currentValue))}
//           </p>
//         </div>

//         {indicator.targetValue && (
//           <>
//             <div className="bg-green-50 rounded-lg p-4">
//               <div className="flex items-center gap-2 text-green-600 text-sm mb-1">
//                 <Target className="w-4 h-4" />
//                 Objectif
//               </div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {formatValue(Number(indicator.targetValue))}
//               </p>
//             </div>

//             <div className="bg-purple-50 rounded-lg p-4">
//               <div className="text-purple-600 text-sm mb-1">Progression</div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {progress.toFixed(0)}%
//               </p>
//             </div>
//           </>
//         )}
//       </div>

//       {chartData.length > 0 ? (
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
//               <YAxis stroke="#6b7280" fontSize={12} />
//               <Tooltip
//                 formatter={(value?: number) => [
//                   formatValue(value ?? 0),
//                   'Valeur',
//                 ]}
//                 contentStyle={{
//                   borderRadius: '8px',
//                   border: 'none',
//                   boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#2563eb"
//                 strokeWidth={2}
//                 dot={{ fill: '#2563eb', strokeWidth: 2 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       ) : (
//         <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
//           {/* Message adapté selon le rôle */}
//           <p className="text-gray-400 text-sm">
//             {canAddValues
//               ? 'Aucune donnée saisie — rendez-vous sur la page détail pour saisir des valeurs'
//               : 'Aucune donnée disponible pour cet indicateur'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useMemo } from 'react';
import { useProjects } from '@/lib/hooks/useProjects';
import { useIndicators, useIndicatorTimeline, Indicator } from '@/lib/hooks/useIndicators';
import { useRole } from '@/lib/hooks/useRole';
import api from '@/lib/api/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  TrendingUp, Plus, BarChart3, Target, ArrowRight,
  DollarSign, Calendar, Activity, ChevronRight,
  Search, Filter, X, ArrowLeft,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type FilterType = 'all' | 'number' | 'percentage' | 'currency' | 'boolean';
type SortBy = 'name' | 'progress' | 'recent';

const typeColors: Record<string, string> = {
  currency:   'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  percentage: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  boolean:    'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
  number:     'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
};

const statusProjectColors: Record<string, string> = {
  active:    'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  completed: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
  draft:     'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  cancelled: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
};

export default function IndicatorsPage() {
  const searchParams = useSearchParams();
  const projectFromUrl = searchParams.get('project');
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { canWrite, canAddValues } = useRole();

  const [selectedProject, setSelectedProject] = useState<string>(projectFromUrl || '');
  const [allIndicators, setAllIndicators] = useState<Indicator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!projects) return;
    const load = async () => {
      const all: Indicator[] = [];
      for (const project of projects) {
        try {
          const res = await api.get(`/indicators/project/${project.id}`);
          all.push(...res.data.map((ind: Indicator) => ({ ...ind, projectName: project.name, projectId: project.id })));
        } catch {}
      }
      setAllIndicators(all);
    };
    load();
  }, [projects]);

  const filteredIndicators = useMemo(() => {
    let result = allIndicators;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q));
    }
    if (filterType !== 'all') result = result.filter(i => i.type === filterType);
    return [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [allIndicators, searchQuery, filterType, sortBy]);

  const globalStats = useMemo(() => {
    if (!projects) return null;
    return {
      totalBudget: projects.reduce((s, p) => s + (Number(p.budget) || 0), 0),
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalIndicators: allIndicators.length,
      indicatorsWithTarget: allIndicators.filter(i => i.targetValue !== null).length,
      projectsCount: projects.length,
    };
  }, [projects, allIndicators]);

  const { data: indicators, isLoading } = useIndicators(selectedProject || undefined);

  // === VUE GLOBALE ===
  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Indicateurs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Vue transversale de tous vos projets</p>
        </div>

        {projectsLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
          </div>
        ) : !globalStats ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">Aucune donnée</div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Budget total" value={`${globalStats.totalBudget.toLocaleString('fr-FR')} €`} subtitle={`${globalStats.projectsCount} projets`} icon={DollarSign} color="indigo" />
              <StatCard title="Projets actifs" value={globalStats.activeProjects} subtitle={`${Math.round((globalStats.activeProjects / Math.max(globalStats.projectsCount, 1)) * 100)}% en cours`} icon={Activity} color="green" />
              <StatCard title="Indicateurs" value={globalStats.totalIndicators} subtitle={`${globalStats.indicatorsWithTarget} avec objectif`} icon={BarChart3} color="purple" />
              <StatCard title="Période" value={new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} subtitle="Reporting actuel" icon={Calendar} color="orange" />
            </div>

            {/* Recherche + filtres */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un indicateur..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${showFilters ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <Filter className="w-4 h-4" />
                  Filtres
                  {(filterType !== 'all' || sortBy !== 'recent') && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                </button>
              </div>

              {showFilters && (
                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Type :</span>
                    <select value={filterType} onChange={e => setFilterType(e.target.value as FilterType)}
                      className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs outline-none">
                      <option value="all">Tous</option>
                      <option value="number">Nombre</option>
                      <option value="percentage">%</option>
                      <option value="currency">€</option>
                      <option value="boolean">Oui/Non</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Trier :</span>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}
                      className="px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs outline-none">
                      <option value="recent">Plus récent</option>
                      <option value="name">Nom</option>
                    </select>
                  </div>
                  {(filterType !== 'all' || sortBy !== 'recent') && (
                    <button onClick={() => { setFilterType('all'); setSortBy('recent'); }} className="text-xs text-red-500 hover:text-red-600">
                      Réinitialiser
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Liste indicateurs */}
            {filteredIndicators.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {filteredIndicators.length} indicateur{filteredIndicators.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredIndicators.map(ind => <IndicatorListItem key={ind.id} indicator={ind} />)}
                </div>
              </div>
            )}

            {filteredIndicators.length === 0 && searchQuery && (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Aucun résultat pour &quot;{searchQuery}&quot;</p>
              </div>
            )}

            {/* Explorer par projet */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Explorer par projet</h3>
              <div className="space-y-2">
                {projects?.map(project => {
                  const projectInds = allIndicators.filter(i => i.projectId === project.id);
                  return (
                    <button key={project.id} onClick={() => setSelectedProject(project.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-200 dark:hover:border-indigo-800 border border-transparent transition-all text-left group">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${statusProjectColors[project.status]}`}>
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{project.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{projectInds.length} indicateur{projectInds.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-400" />
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

  // === VUE PROJET ===
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedProject('')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Indicateurs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{projects?.find(p => p.id === selectedProject)?.name}</p>
          </div>
        </div>
        {canWrite && (
          <Link href={`/indicators/new?project=${selectedProject}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900 text-sm">
            <Plus className="w-4 h-4" />
            Nouvel indicateur
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3 animate-pulse">
          {[1,2].map(i => <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
        </div>
      )}

      {indicators && indicators.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <BarChart3 className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="font-medium text-gray-500 dark:text-gray-400">Aucun indicateur</p>
          {canWrite && (
            <Link href={`/indicators/new?project=${selectedProject}`} className="text-indigo-500 hover:text-indigo-600 text-sm mt-2 inline-block">
              Créer votre premier indicateur
            </Link>
          )}
        </div>
      )}

      <div className="space-y-4">
        {indicators?.map(indicator => (
          <IndicatorCard key={indicator.id} indicator={indicator} canAddValues={canAddValues} />
        ))}
      </div>
    </div>
  );
}

// ── Composants ────────────────────────────────────────────────────────────────

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  const colors: Record<string, { bg: string; icon: string }> = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/50', icon: 'text-indigo-600 dark:text-indigo-400' },
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-950/50', icon: 'text-emerald-600 dark:text-emerald-400' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/50', icon: 'text-purple-600 dark:text-purple-400' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/50', icon: 'text-orange-600 dark:text-orange-400' },
  };
  const t = colors[color] ?? colors.indigo;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${t.bg}`}>
        <Icon className={`w-5 h-5 ${t.icon}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function IndicatorListItem({ indicator }: { indicator: Indicator & { projectName?: string } }) {
  return (
    <Link href={`/indicators/${indicator.id}`}
      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${typeColors[indicator.type]}`}>
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <p className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{indicator.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{indicator.projectName} · {indicator.values?.length || 0} valeur(s)</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {indicator.targetValue && (
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Objectif</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{indicator.targetValue}</p>
          </div>
        )}
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-400" />
      </div>
    </Link>
  );
}

function IndicatorCard({ indicator, canAddValues }: { indicator: Indicator; canAddValues: boolean }) {
  const { data: timeline } = useIndicatorTimeline(indicator.id);
  const chartData = timeline?.map(v => ({ period: v.period, value: Number(v.value) })) || [];
  const currentValue = timeline?.[timeline.length - 1]?.value || 0;
  const progress = indicator.targetValue ? Math.min((Number(currentValue) / Number(indicator.targetValue)) * 100, 100) : 0;

  const formatValue = (v: number) => {
    if (indicator.type === 'currency') return `${v.toLocaleString('fr-FR')} €`;
    if (indicator.type === 'percentage') return `${v}%`;
    return v.toLocaleString('fr-FR');
  };

  const typeLabels: Record<string, string> = {
    number: 'Nombre', percentage: '%', currency: '€', boolean: 'Oui/Non',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{indicator.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[indicator.type]}`}>
              {typeLabels[indicator.type]}
            </span>
          </div>
          {indicator.description && <p className="text-xs text-gray-500 dark:text-gray-400">{indicator.description}</p>}
        </div>
        <Link href={`/indicators/${indicator.id}`}
          className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600 font-medium shrink-0">
          Détails <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-3">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-1"><TrendingUp className="w-3 h-3" />Actuel</p>
          <p className="font-bold text-gray-900 dark:text-white">{formatValue(Number(currentValue))}</p>
        </div>
        {indicator.targetValue ? (
          <>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1"><Target className="w-3 h-3" />Objectif</p>
              <p className="font-bold text-gray-900 dark:text-white">{formatValue(Number(indicator.targetValue))}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3">
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Progression</p>
              <p className="font-bold text-gray-900 dark:text-white">{progress.toFixed(0)}%</p>
            </div>
          </>
        ) : (
          <div className="col-span-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">Pas d'objectif défini</p>
          </div>
        )}
      </div>

      {chartData.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" className="dark:stroke-gray-800" />
              <XAxis dataKey="period" stroke="#9ca3af" fontSize={10} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v?: number) => [formatValue(v ?? 0), 'Valeur']}
                contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '10px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {canAddValues ? 'Aucune donnée — ajoutez une valeur depuis la page détail' : 'Aucune donnée disponible'}
          </p>
        </div>
      )}
    </div>
  );
}