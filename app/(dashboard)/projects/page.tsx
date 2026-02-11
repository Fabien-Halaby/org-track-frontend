'use client';

import { useState } from 'react';
import { useProjects, useCreateProject } from '@/lib/hooks/useProjects';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';

const statusLabels = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700', icon: FileText },
  active: { label: 'Actif', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  completed: { label: 'Terminé', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('');
  const { data: projects, isLoading } = useProjects(filter || undefined);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-500 mt-1">
            {projects?.length || 0} projet{projects?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            className="flex-1 outline-none text-gray-700"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="outline-none text-gray-700 bg-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="active">Actif</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        {projects?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">Aucun projet trouvé</p>
            <Link
              href="/projects/new"
              className="text-primary hover:underline mt-2 inline-block"
            >
              Créer votre premier projet
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = statusLabels[project.status];
  const StatusIcon = status.icon;

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            
            {project.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500">
              {project.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {project.budget.toLocaleString('fr-FR')} €
                </div>
              )}
              {project.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(project.startDate).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          </div>
          
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}