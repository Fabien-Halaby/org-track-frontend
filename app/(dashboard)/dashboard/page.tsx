// 'use client';

// import { useState } from 'react';
// import { useAuthStore } from '@/lib/store/auth';
// import { useRole } from '@/lib/hooks/useRole';
// import {
//   useDashboardStats,
//   useDashboardTrends,
//   useDashboardAlerts,
//   useDashboardActivity,
// } from '@/lib/hooks/useDashboard';
// import Link from 'next/link';
// import {
//   FolderKanban,
//   TrendingUp,
//   AlertCircle,
//   CheckCircle2,
//   Clock,
//   DollarSign,
//   Activity,
//   ArrowUpRight,
//   ArrowDownRight,
//   Bell,
//   Target,
//   RefreshCw,
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from 'recharts';
// import { format } from 'date-fns';
// import { fr } from 'date-fns/locale';

// export default function DashboardPage() {
//   const { organization } = useAuthStore();
//   const { canWrite } = useRole(); // ✅ hook rôle
//   const [refreshKey, setRefreshKey] = useState(0);

//   const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
//   const { data: trends, isLoading: trendsLoading } = useDashboardTrends();
//   const { data: alerts, isLoading: alertsLoading } = useDashboardAlerts();
//   const { data: activities, isLoading: activityLoading } = useDashboardActivity();

//   const handleRefresh = () => {
//     refetchStats();
//     setRefreshKey((prev) => prev + 1);
//   };

//   const isLoading = statsLoading || trendsLoading || alertsLoading || activityLoading;

//   if (isLoading) {
//     return <DashboardSkeleton />;
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
//           <p className="text-gray-500 mt-2">
//             Bienvenue sur{' '}
//             <span className="font-medium text-gray-700">{organization?.name}</span>{' '}
//             •{' '}
//             {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
//           </p>
//         </div>
//         <button
//           onClick={handleRefresh}
//           className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//           title="Actualiser"
//         >
//           <RefreshCw className="w-5 h-5" />
//         </button>
//       </div>

//       {/* KPIs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <KpiCard
//           title="Projets actifs"
//           value={stats?.projects.active || 0}
//           total={stats?.projects.total || 0}
//           icon={FolderKanban}
//           color="blue"
//           trend={stats?.projects.completionRate || 0}
//           trendLabel="complétion"
//           href="/projects"
//         />
//         <KpiCard
//           title="Indicateurs suivis"
//           value={stats?.indicators.total || 0}
//           subtitle={`${stats?.indicators.withTarget || 0} avec objectif`}
//           icon={Target}
//           color="green"
//           trend={stats?.indicators.averageProgress || 0}
//           trendLabel="prog. moyenne"
//           href="/indicators"
//         />
//         <KpiCard
//           title="Budget total"
//           value={`${(stats?.financial.totalBudget || 0).toLocaleString('fr-FR')} €`}
//           subtitle={`${(stats?.financial.averageBudget || 0).toLocaleString('fr-FR')} € en moyenne`}
//           icon={DollarSign}
//           color="purple"
//           href="/projects"
//         />
//         <KpiCard
//           title="Saisies ce mois"
//           value={stats?.indicators.valuesThisMonth || 0}
//           icon={Activity}
//           color="orange"
//           href="/indicators"
//         />
//       </div>

//       {/* Graphiques et Alertes */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Évolution sur 12 mois
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {"Saisies d'indicateurs et création de projets"}
//               </p>
//             </div>
//             <div className="flex items-center gap-4 text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                 <span className="text-gray-600">Valeurs ajoutées</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                 <span className="text-gray-600">Projets créés</span>
//               </div>
//             </div>
//           </div>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={trends}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
//                 <XAxis
//                   dataKey="period"
//                   stroke="#9ca3af"
//                   fontSize={12}
//                   tickLine={false}
//                 />
//                 <YAxis
//                   stroke="#9ca3af"
//                   fontSize={12}
//                   tickLine={false}
//                   axisLine={false}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'white',
//                     border: 'none',
//                     borderRadius: '8px',
//                     boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
//                   }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="valuesAdded"
//                   stroke="#3b82f6"
//                   strokeWidth={3}
//                   dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="projectsCreated"
//                   stroke="#10b981"
//                   strokeWidth={3}
//                   dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Alertes */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <Bell className="w-5 h-5" />
//               Alertes
//             </h2>
//             {alerts && alerts.length > 0 && (
//               <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
//                 {alerts.length}
//               </span>
//             )}
//           </div>

//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {alerts && alerts.length > 0 ? (
//               alerts.map((alert, idx) => (
//                 <AlertCard key={idx} alert={alert} />
//               ))
//             ) : (
//               <div className="text-center py-8 text-gray-400">
//                 <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
//                 <p>Tout va bien !</p>
//                 <p className="text-sm">Aucune alerte à signaler</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Activité récente et Répartition */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
//             <Clock className="w-5 h-5" />
//             Activité récente
//           </h2>
//           <div className="space-y-4">
//             {activities && activities.length > 0 ? (
//               activities.map((activity, idx) => (
//                 <ActivityItem key={idx} activity={activity} />
//               ))
//             ) : (
//               <p className="text-center py-8 text-gray-400">
//                 Aucune activité récente
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Répartition projets */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-6">
//             Répartition des projets
//           </h2>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={[
//                     {
//                       name: 'Actifs',
//                       value: stats?.projects.active || 0,
//                       color: '#10b981',
//                     },
//                     {
//                       name: 'Terminés',
//                       value: stats?.projects.completed || 0,
//                       color: '#3b82f6',
//                     },
//                     {
//                       name: 'Brouillons',
//                       value: Math.max(
//                         0,
//                         (stats?.projects.total || 0) -
//                           (stats?.projects.active || 0) -
//                           (stats?.projects.completed || 0),
//                       ),
//                       color: '#6b7280',
//                     },
//                   ].filter((item) => item.value > 0)}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {[
//                     {
//                       name: 'Actifs',
//                       value: stats?.projects.active || 0,
//                       color: '#10b981',
//                     },
//                     {
//                       name: 'Terminés',
//                       value: stats?.projects.completed || 0,
//                       color: '#3b82f6',
//                     },
//                     {
//                       name: 'Brouillons',
//                       value: Math.max(
//                         0,
//                         (stats?.projects.total || 0) -
//                           (stats?.projects.active || 0) -
//                           (stats?.projects.completed || 0),
//                       ),
//                       color: '#6b7280',
//                     },
//                   ]
//                     .filter((item) => item.value > 0)
//                     .map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value: number, name: string) => [
//                     `${value} projet${value > 1 ? 's' : ''}`,
//                     name,
//                   ]}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
//             {stats?.projects.active ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                 <span className="text-gray-600">
//                   Actifs ({stats.projects.active})
//                 </span>
//               </div>
//             ) : null}
//             {stats?.projects.completed ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//                 <span className="text-gray-600">
//                   Terminés ({stats.projects.completed})
//                 </span>
//               </div>
//             ) : null}
//             {(() => {
//               const drafts = Math.max(
//                 0,
//                 (stats?.projects.total || 0) -
//                   (stats?.projects.active || 0) -
//                   (stats?.projects.completed || 0),
//               );
//               return drafts > 0 ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-gray-500"></div>
//                   <span className="text-gray-600">Brouillons ({drafts})</span>
//                 </div>
//               ) : null;
//             })()}
//           </div>
//         </div>
//       </div>

//       {/* ✅ Actions rapides : adaptées selon le rôle */}
//       <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Actions rapides</h2>
//             <p className="text-blue-100">
//               {canWrite
//                 ? 'Gérez vos projets et indicateurs efficacement'
//                 : 'Consultez vos projets et indicateurs'}
//             </p>
//           </div>
//           <div className="flex gap-3">
//             {/* ✅ Bouton "Nouveau projet" : admin et manager uniquement */}
//             {canWrite && (
//               <Link
//                 href="/projects/new"
//                 className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
//               >
//                 Nouveau projet
//               </Link>
//             )}
//             <Link
//               href="/projects"
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
//             >
//               Voir les projets
//             </Link>
//             <Link
//               href="/indicators"
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
//             >
//               Voir les indicateurs
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Composants internes ───────────────────────────────────────────────────────

// function KpiCard({
//   title,
//   value,
//   total,
//   subtitle,
//   icon: Icon,
//   color,
//   trend,
//   trendLabel,
//   href,
// }: any) {
//   const colors: Record<string, { bg: string; icon: string; border: string }> = {
//     blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
//     green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
//     purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
//     orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200' },
//   };

//   const theme = colors[color];

//   return (
//     <Link href={href} className="block group">
//       <div
//         className={`bg-white rounded-2xl shadow-sm border ${theme.border} p-6 hover:shadow-md transition-all h-56 flex flex-col justify-between`}
//       >
//         <div className="flex items-start justify-between">
//           <div>
//             <p className="text-sm font-medium text-gray-600">{title}</p>
//             <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
//             {total !== undefined && (
//               <p className="text-sm text-gray-500 mt-1">sur {total} total</p>
//             )}
//             {subtitle && (
//               <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
//             )}
//           </div>
//           <div
//             className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.bg} group-hover:scale-110 transition-transform`}
//           >
//             <Icon className={`w-6 h-6 ${theme.icon}`} />
//           </div>
//         </div>
//         {trend !== undefined && (
//           <div className="mt-4 flex items-center gap-2">
//             <div
//               className={`flex items-center gap-1 text-sm font-medium ${
//                 trend > 50 ? 'text-green-600' : 'text-orange-600'
//               }`}
//             >
//               {trend > 50 ? (
//                 <ArrowUpRight className="w-4 h-4" />
//               ) : (
//                 <ArrowDownRight className="w-4 h-4" />
//               )}
//               {trend}%
//             </div>
//             <span className="text-sm text-gray-400">{trendLabel}</span>
//           </div>
//         )}
//       </div>
//     </Link>
//   );
// }

// function AlertCard({ alert }: { alert: any }) {
//   const severityColors: Record<string, string> = {
//     critical: 'bg-red-50 border-red-200 text-red-800',
//     warning: 'bg-orange-50 border-orange-200 text-orange-800',
//     info: 'bg-blue-50 border-blue-200 text-blue-800',
//   };

//   const icons: Record<string, any> = {
//     no_data: AlertCircle,
//     stale_data: Clock,
//     low_progress: TrendingUp,
//   };

//   const Icon = icons[alert.type] || AlertCircle;

//   return (
//     <Link
//       href={`/indicators/${alert.indicator.id}`}
//       className={`block p-4 rounded-xl border ${severityColors[alert.severity]} hover:shadow-sm transition-shadow`}
//     >
//       <div className="flex items-start gap-3">
//         <Icon className="w-5 h-5 mt-0.5 shrink-0" />
//         <div className="flex-1 min-w-0">
//           <p className="font-medium text-sm">{alert.message}</p>
//           <p className="text-sm opacity-75 mt-1">{alert.indicator.name}</p>
//           <p className="text-xs opacity-60 mt-1">{alert.project.name}</p>
//         </div>
//       </div>
//     </Link>
//   );
// }

// function ActivityItem({ activity }: { activity: any }) {
//   const icons: Record<string, any> = {
//     value_added: Activity,
//     project_created: FolderKanban,
//   };

//   const colors: Record<string, string> = {
//     value_added: 'bg-blue-100 text-blue-600',
//     project_created: 'bg-green-100 text-green-600',
//   };

//   const Icon = icons[activity.type] || Activity;

//   return (
//     <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
//       <div
//         className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[activity.type]}`}
//       >
//         <Icon className="w-5 h-5" />
//       </div>
//       <div className="flex-1">
//         <p className="font-medium text-gray-900">{activity.description}</p>
//         <p className="text-sm text-gray-500">{activity.details}</p>
//         <p className="text-xs text-gray-400 mt-1">
//           {format(new Date(activity.date), 'dd MMM yyyy à HH:mm', {
//             locale: fr,
//           })}
//         </p>
//       </div>
//     </div>
//   );
// }

// function DashboardSkeleton() {
//   return (
//     <div className="space-y-8 animate-pulse">
//       <div className="h-8 bg-gray-200 rounded w-1/3"></div>
//       <div className="grid grid-cols-4 gap-6">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
//         ))}
//       </div>
//       <div className="grid grid-cols-3 gap-6">
//         <div className="col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
//         <div className="h-96 bg-gray-200 rounded-2xl"></div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useRole } from '@/lib/hooks/useRole';
import {
  useDashboardStats, useDashboardTrends,
  useDashboardAlerts, useDashboardActivity,
} from '@/lib/hooks/useDashboard';
import Link from 'next/link';
import {
  FolderKanban, TrendingUp, AlertCircle, CheckCircle2,
  Clock, DollarSign, Activity, ArrowUpRight, ArrowDownRight,
  Bell, Target, RefreshCw, Plus,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const { organization } = useAuthStore();
  const { canWrite } = useRole();
  const [, setRefreshKey] = useState(0);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: trends, isLoading: trendsLoading } = useDashboardTrends();
  const { data: alerts, isLoading: alertsLoading } = useDashboardAlerts();
  const { data: activities, isLoading: activityLoading } = useDashboardActivity();

  const handleRefresh = () => {
    refetchStats();
    setRefreshKey(p => p + 1);
  };

  if (statsLoading || trendsLoading || alertsLoading || activityLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bonjour 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">{organization?.name}</span>
            {' · '}
            {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          title="Actualiser"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Projets actifs"
          value={stats?.projects.active || 0}
          subtitle={`sur ${stats?.projects.total || 0} total`}
          icon={FolderKanban}
          color="indigo"
          trend={stats?.projects.completionRate || 0}
          trendLabel="complétion"
          href="/projects"
        />
        <KpiCard
          title="Indicateurs"
          value={stats?.indicators.total || 0}
          subtitle={`${stats?.indicators.withTarget || 0} avec objectif`}
          icon={Target}
          color="green"
          trend={stats?.indicators.averageProgress || 0}
          trendLabel="progression"
          href="/indicators"
        />
        <KpiCard
          title="Budget total"
          value={`${(stats?.financial.totalBudget || 0).toLocaleString('fr-FR')} €`}
          subtitle={`moy. ${(stats?.financial.averageBudget || 0).toLocaleString('fr-FR')} €`}
          icon={DollarSign}
          color="purple"
          href="/projects"
        />
        <KpiCard
          title="Saisies ce mois"
          value={stats?.indicators.valuesThisMonth || 0}
          subtitle="entrées de données"
          icon={Activity}
          color="orange"
          href="/indicators"
        />
      </div>

      {/* Graphiques + Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Graphique */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Évolution sur 12 mois</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Saisies et création de projets</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                Valeurs
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Projets
              </span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" className="dark:stroke-gray-800" />
                <XAxis dataKey="period" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="valuesAdded" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }} />
                <Line type="monotone" dataKey="projectsCreated" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alertes
            </h2>
            {alerts && alerts.length > 0 && (
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                {alerts.length}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-72">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert, idx) => <AlertCard key={idx} alert={alert} />)
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">Tout va bien !</p>
                <p className="text-xs text-gray-400 mt-1">Aucune alerte à signaler</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activité + Répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activité */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4" />
            Activité récente
          </h2>
          <div className="space-y-1">
            {activities && activities.length > 0 ? (
              activities.map((activity, idx) => <ActivityItem key={idx} activity={activity} />)
            ) : (
              <p className="text-center py-10 text-gray-400 text-sm">Aucune activité récente</p>
            )}
          </div>
        </div>

        {/* Répartition */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Répartition</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Actifs', value: stats?.projects.active || 0, color: '#10b981' },
                    { name: 'Terminés', value: stats?.projects.completed || 0, color: '#6366f1' },
                    { name: 'Brouillons', value: Math.max(0, (stats?.projects.total || 0) - (stats?.projects.active || 0) - (stats?.projects.completed || 0)), color: '#9ca3af' },
                  ].filter(i => i.value > 0)}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={70}
                  paddingAngle={4} dataKey="value"
                >
                  {[
                    { color: '#10b981' },
                    { color: '#6366f1' },
                    { color: '#9ca3af' },
                  ].map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: number, n: string) => [`${v} projet${v > 1 ? 's' : ''}`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {stats?.projects.active ? (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Actifs
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.projects.active}</span>
              </div>
            ) : null}
            {stats?.projects.completed ? (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />Terminés
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.projects.completed}</span>
              </div>
            ) : null}
            {(() => {
              const d = Math.max(0, (stats?.projects.total || 0) - (stats?.projects.active || 0) - (stats?.projects.completed || 0));
              return d > 0 ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />Brouillons
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">{d}</span>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Actions rapides</h2>
            <p className="text-indigo-200 text-sm mt-0.5">
              {canWrite ? 'Gérez vos projets et indicateurs' : 'Consultez vos projets et indicateurs'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canWrite && (
              <Link
                href="/projects/new"
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Nouveau projet
              </Link>
            )}
            <Link
              href="/projects"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors text-sm"
            >
              Projets
            </Link>
            <Link
              href="/indicators"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors text-sm"
            >
              Indicateurs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composants ────────────────────────────────────────────────────────────────

function KpiCard({ title, value, subtitle, icon: Icon, color, trend, trendLabel, href }: any) {
  const colors: Record<string, { bg: string; icon: string; ring: string }> = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/50', icon: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-100 dark:ring-indigo-900' },
    green:  { bg: 'bg-emerald-50 dark:bg-emerald-950/50', icon: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-100 dark:ring-emerald-900' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/50', icon: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-100 dark:ring-purple-900' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/50', icon: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-100 dark:ring-orange-900' },
  };

  const t = colors[color] ?? colors.indigo;

  return (
    <Link href={href} className="block group h-full">
      <div className="h-full min-h-40 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col justify-between hover:shadow-md dark:hover:shadow-gray-900 transition-all hover:-translate-y-0.5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.bg} ring-1 ${t.ring} group-hover:scale-110 transition-transform`}>
            <Icon className={`w-5 h-5 ${t.icon}`} />
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {value}
          </p>

          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {title}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Trend (toujours même espace) */}
        <div className="h-5 mt-3">
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend > 50
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-orange-500 dark:text-orange-400'
            }`}>
              {trend > 50
                ? <ArrowUpRight className="w-3 h-3" />
                : <ArrowDownRight className="w-3 h-3" />
              }
              {trend}% {trendLabel}
            </div>
          )}
        </div>

      </div>
    </Link>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const styles: Record<string, string> = {
    critical: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
    warning: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400',
    info: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
  };
  const icons: Record<string, any> = { no_data: AlertCircle, stale_data: Clock, low_progress: TrendingUp };
  const Icon = icons[alert.type] || AlertCircle;

  return (
    <Link href={`/indicators/${alert.indicator.id}`}
      className={`block p-3 rounded-xl border ${styles[alert.severity]} hover:shadow-sm transition-all text-xs`}
    >
      <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="font-medium">{alert.message}</p>
          <p className="opacity-75 mt-0.5 truncate">{alert.indicator.name}</p>
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ activity }: { activity: any }) {
  const icons: Record<string, any> = { value_added: Activity, project_created: FolderKanban };
  const colors: Record<string, string> = {
    value_added: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
    project_created: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  };
  const Icon = icons[activity.type] || Activity;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors[activity.type]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.description}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{format(new Date(activity.date), 'dd MMM à HH:mm', { locale: fr })}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded-xl w-48" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-36 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    </div>
  );
}