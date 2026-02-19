'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useRole } from '@/lib/hooks/useRole';
import {
  useDashboardStats,
  useDashboardTrends,
  useDashboardAlerts,
  useDashboardActivity,
} from '@/lib/hooks/useDashboard';
import Link from 'next/link';
import {
  FolderKanban,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Target,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const { organization } = useAuthStore();
  const { canWrite } = useRole(); // ✅ hook rôle
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: trends, isLoading: trendsLoading } = useDashboardTrends();
  const { data: alerts, isLoading: alertsLoading } = useDashboardAlerts();
  const { data: activities, isLoading: activityLoading } = useDashboardActivity();

  const handleRefresh = () => {
    refetchStats();
    setRefreshKey((prev) => prev + 1);
  };

  const isLoading = statsLoading || trendsLoading || alertsLoading || activityLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-2">
            Bienvenue sur{' '}
            <span className="font-medium text-gray-700">{organization?.name}</span>{' '}
            •{' '}
            {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Projets actifs"
          value={stats?.projects.active || 0}
          total={stats?.projects.total || 0}
          icon={FolderKanban}
          color="blue"
          trend={stats?.projects.completionRate || 0}
          trendLabel="complétion"
          href="/projects"
        />
        <KpiCard
          title="Indicateurs suivis"
          value={stats?.indicators.total || 0}
          subtitle={`${stats?.indicators.withTarget || 0} avec objectif`}
          icon={Target}
          color="green"
          trend={stats?.indicators.averageProgress || 0}
          trendLabel="prog. moyenne"
          href="/indicators"
        />
        <KpiCard
          title="Budget total"
          value={`${(stats?.financial.totalBudget || 0).toLocaleString('fr-FR')} €`}
          subtitle={`${(stats?.financial.averageBudget || 0).toLocaleString('fr-FR')} € en moyenne`}
          icon={DollarSign}
          color="purple"
          href="/projects"
        />
        <KpiCard
          title="Saisies ce mois"
          value={stats?.indicators.valuesThisMonth || 0}
          icon={Activity}
          color="orange"
          href="/indicators"
        />
      </div>

      {/* Graphiques et Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Évolution sur 12 mois
              </h2>
              <p className="text-sm text-gray-500">
                {"Saisies d'indicateurs et création de projets"}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Valeurs ajoutées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Projets créés</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="period"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="valuesAdded"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="projectsCreated"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alertes
            </h2>
            {alerts && alerts.length > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                {alerts.length}
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert, idx) => (
                <AlertCard key={idx} alert={alert} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <p>Tout va bien !</p>
                <p className="text-sm">Aucune alerte à signaler</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activité récente et Répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Activité récente
          </h2>
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity, idx) => (
                <ActivityItem key={idx} activity={activity} />
              ))
            ) : (
              <p className="text-center py-8 text-gray-400">
                Aucune activité récente
              </p>
            )}
          </div>
        </div>

        {/* Répartition projets */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Répartition des projets
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Actifs',
                      value: stats?.projects.active || 0,
                      color: '#10b981',
                    },
                    {
                      name: 'Terminés',
                      value: stats?.projects.completed || 0,
                      color: '#3b82f6',
                    },
                    {
                      name: 'Brouillons',
                      value: Math.max(
                        0,
                        (stats?.projects.total || 0) -
                          (stats?.projects.active || 0) -
                          (stats?.projects.completed || 0),
                      ),
                      color: '#6b7280',
                    },
                  ].filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    {
                      name: 'Actifs',
                      value: stats?.projects.active || 0,
                      color: '#10b981',
                    },
                    {
                      name: 'Terminés',
                      value: stats?.projects.completed || 0,
                      color: '#3b82f6',
                    },
                    {
                      name: 'Brouillons',
                      value: Math.max(
                        0,
                        (stats?.projects.total || 0) -
                          (stats?.projects.active || 0) -
                          (stats?.projects.completed || 0),
                      ),
                      color: '#6b7280',
                    },
                  ]
                    .filter((item) => item.value > 0)
                    .map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} projet${value > 1 ? 's' : ''}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            {stats?.projects.active ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">
                  Actifs ({stats.projects.active})
                </span>
              </div>
            ) : null}
            {stats?.projects.completed ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">
                  Terminés ({stats.projects.completed})
                </span>
              </div>
            ) : null}
            {(() => {
              const drafts = Math.max(
                0,
                (stats?.projects.total || 0) -
                  (stats?.projects.active || 0) -
                  (stats?.projects.completed || 0),
              );
              return drafts > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-gray-600">Brouillons ({drafts})</span>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      </div>

      {/* ✅ Actions rapides : adaptées selon le rôle */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Actions rapides</h2>
            <p className="text-blue-100">
              {canWrite
                ? 'Gérez vos projets et indicateurs efficacement'
                : 'Consultez vos projets et indicateurs'}
            </p>
          </div>
          <div className="flex gap-3">
            {/* ✅ Bouton "Nouveau projet" : admin et manager uniquement */}
            {canWrite && (
              <Link
                href="/projects/new"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Nouveau projet
              </Link>
            )}
            <Link
              href="/projects"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
            >
              Voir les projets
            </Link>
            <Link
              href="/indicators"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
            >
              Voir les indicateurs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composants internes ───────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  total,
  subtitle,
  icon: Icon,
  color,
  trend,
  trendLabel,
  href,
}: any) {
  const colors: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200' },
  };

  const theme = colors[color];

  return (
    <Link href={href} className="block group">
      <div
        className={`bg-white rounded-2xl shadow-sm border ${theme.border} p-6 hover:shadow-md transition-all h-56 flex flex-col justify-between`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {total !== undefined && (
              <p className="text-sm text-gray-500 mt-1">sur {total} total</p>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.bg} group-hover:scale-110 transition-transform`}
          >
            <Icon className={`w-6 h-6 ${theme.icon}`} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend > 50 ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              {trend > 50 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {trend}%
            </div>
            <span className="text-sm text-gray-400">{trendLabel}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const severityColors: Record<string, string> = {
    critical: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons: Record<string, any> = {
    no_data: AlertCircle,
    stale_data: Clock,
    low_progress: TrendingUp,
  };

  const Icon = icons[alert.type] || AlertCircle;

  return (
    <Link
      href={`/indicators/${alert.indicator.id}`}
      className={`block p-4 rounded-xl border ${severityColors[alert.severity]} hover:shadow-sm transition-shadow`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{alert.message}</p>
          <p className="text-sm opacity-75 mt-1">{alert.indicator.name}</p>
          <p className="text-xs opacity-60 mt-1">{alert.project.name}</p>
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ activity }: { activity: any }) {
  const icons: Record<string, any> = {
    value_added: Activity,
    project_created: FolderKanban,
  };

  const colors: Record<string, string> = {
    value_added: 'bg-blue-100 text-blue-600',
    project_created: 'bg-green-100 text-green-600',
  };

  const Icon = icons[activity.type] || Activity;

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[activity.type]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{activity.description}</p>
        <p className="text-sm text-gray-500">{activity.details}</p>
        <p className="text-xs text-gray-400 mt-1">
          {format(new Date(activity.date), 'dd MMM yyyy à HH:mm', {
            locale: fr,
          })}
        </p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );
}