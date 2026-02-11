'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth';
import { 
  FolderKanban, 
  TrendingUp, 
  Users,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { organization } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const projectsRes = await api.get('/projects');
      return {
        projectsCount: projectsRes.data.length,
        // On ajoutera plus tard les vraies stats
        indicatorsCount: 0,
        recentActivity: [],
      };
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bonjour, {organization?.name} 👋
        </h1>
        <p className="text-gray-500 mt-2">
          Voici un aperçu de votre activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Projets actifs"
          value={stats?.projectsCount || 0}
          icon={FolderKanban}
          href="/projects"
          color="blue"
        />
        <StatCard
          title="Indicateurs suivis"
          value={stats?.indicatorsCount || 0}
          icon={TrendingUp}
          href="/indicators"
          color="green"
        />
        <StatCard
          title="Membres"
          value={1}
          icon={Users}
          href="/settings"
          color="purple"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Actions rapides
        </h2>
        <div className="flex gap-4">
          <Link
            href="/projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FolderKanban className="w-4 h-4" />
            Nouveau projet
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  href, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  href: string;
  color: 'blue' | 'green' | 'purple';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span>Voir détails</span>
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </Link>
  );
}