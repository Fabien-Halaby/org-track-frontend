// 'use client';

// import { useState } from 'react';
// import { Project, useProjects, useDeleteProject } from '@/lib/hooks/useProjects';
// import { useRole } from '@/lib/hooks/useRole';
// import Link from 'next/link';
// import {
//   Plus, Search, Filter, MoreHorizontal, Calendar,
//   DollarSign, CheckCircle2, XCircle, FileText,
//   Edit, Trash2, AlertTriangle,
// } from 'lucide-react';

// const statusLabels = {
//   draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700', icon: FileText },
//   active: { label: 'Actif', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
//   completed: { label: 'Terminé', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
//   cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700', icon: XCircle },
// };

// export default function ProjectsPage() {
//   const [filter, setFilter] = useState<string>('');
//   const { data: projects, isLoading } = useProjects(filter || undefined);
//   const { canWrite } = useRole(); // ← hook rôle

//   if (isLoading) {
//     return <div className="flex items-center justify-center h-64">Chargement...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
//           <p className="text-gray-500 mt-1">
//             {projects?.length || 0} projet{projects?.length !== 1 ? 's' : ''}
//           </p>
//         </div>
//         {/* Caché pour agent et observer */}
//         {canWrite && (
//           <Link
//             href="/projects/new"
//             className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
//           >
//             <Plus className="w-4 h-4" />
//             Nouveau projet
//           </Link>
//         )}
//       </div>

//       <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
//         <div className="flex items-center gap-2 flex-1">
//           <Search className="w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Rechercher un projet..."
//             className="flex-1 outline-none text-gray-700"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           <Filter className="w-5 h-5 text-gray-400" />
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="outline-none text-gray-700 bg-transparent"
//           >
//             <option value="">Tous les statuts</option>
//             <option value="draft">Brouillon</option>
//             <option value="active">Actif</option>
//             <option value="completed">Terminé</option>
//             <option value="cancelled">Annulé</option>
//           </select>
//         </div>
//       </div>

//       <div className="grid gap-4">
//         {projects?.map((project) => (
//           <ProjectCard key={project.id} project={project} />
//         ))}

//         {projects?.length === 0 && (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <p className="text-gray-500">Aucun projet trouvé</p>
//             {canWrite && (
//               <Link href="/projects/new" className="text-primary hover:underline mt-2 inline-block">
//                 Créer votre premier projet
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function ProjectCard({ project }: { project: Project }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const deleteProject = useDeleteProject();
//   const { isAdmin, canWrite } = useRole(); // ← hook rôle

//   const status = statusLabels[project.status];
//   const StatusIcon = status.icon;

//   const handleDelete = () => {
//     deleteProject.mutate(project.id);
//     setShowDeleteConfirm(false);
//   };

//   // Menu visible seulement si on peut faire quelque chose
//   const showActions = canWrite || isAdmin;

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between">
//         <Link href={`/projects/${project.id}`} className="flex-1">
//           <div className="flex items-center gap-3 mb-2">
//             <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
//             <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
//               <StatusIcon className="w-3 h-3" />
//               {status.label}
//             </span>
//           </div>

//           {project.description && (
//             <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
//           )}

//           <div className="flex items-center gap-6 text-sm text-gray-500">
//             {project.budget && (
//               <div className="flex items-center gap-1">
//                 <DollarSign className="w-4 h-4" />
//                 {project.budget.toLocaleString('fr-FR')} €
//               </div>
//             )}
//             {project.startDate && (
//               <div className="flex items-center gap-1">
//                 <Calendar className="w-4 h-4" />
//                 {new Date(project.startDate).toLocaleDateString('fr-FR')}
//               </div>
//             )}
//           </div>
//         </Link>

//         {/* Menu actions masqué pour observer */}
//         {showActions && (
//           <div className="relative">
//             <button
//               onClick={() => setShowMenu(!showMenu)}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <MoreHorizontal className="w-5 h-5 text-gray-400" />
//             </button>

//             {showMenu && (
//               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
//                 {canWrite && (
//                   <Link
//                     href={`/projects/${project.id}/edit`}
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                     onClick={() => setShowMenu(false)}
//                   >
//                     <Edit className="w-4 h-4" />
//                     Modifier
//                   </Link>
//                 )}
//                 {/* Suppression réservée à l'admin */}
//                 {isAdmin && (
//                   <button
//                     onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
//                     className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Supprimer
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
//             <div className="flex items-center gap-3 text-red-600 mb-4">
//               <AlertTriangle className="w-6 h-6" />
//               <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               Êtes-vous sûr de vouloir supprimer le projet <strong>&quot;{project.name}&quot;</strong> ?
//               Cette action est irréversible.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleDelete}
//                 disabled={deleteProject.isPending}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
//               >
//                 {deleteProject.isPending ? 'Suppression...' : 'Supprimer'}
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 py-2 text-gray-600 hover:text-gray-900"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { Project, useProjects, useDeleteProject } from '@/lib/hooks/useProjects';
import { useRole } from '@/lib/hooks/useRole';
import Link from 'next/link';
import {
  Plus, Search, Filter, MoreHorizontal, Calendar,
  DollarSign,
  Edit, Trash2, AlertTriangle, FolderOpen,
} from 'lucide-react';

const statusConfig = {
  draft:     { label: 'Brouillon', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' },
  active:    { label: 'Actif',     color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  completed: { label: 'Terminé',   color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400', dot: 'bg-indigo-500' },
  cancelled: { label: 'Annulé',    color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400', dot: 'bg-red-500' },
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const { data: projects, isLoading } = useProjects(filter || undefined);
  const { canWrite } = useRole();

  const filtered = projects?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {filtered?.length || 0} projet{(filtered?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        {canWrite && (
          <Link
            href="/projects/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Link>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="flex-1 outline-none text-sm text-gray-700 dark:text-gray-300 bg-transparent placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="outline-none text-sm text-gray-700 dark:text-gray-300 bg-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="active">Actif</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filtered?.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {filtered?.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <FolderOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="font-medium text-gray-500 dark:text-gray-400">Aucun projet trouvé</p>
            {canWrite && (
              <Link href="/projects/new" className="text-indigo-500 hover:text-indigo-600 text-sm mt-2 inline-block">
                Créer votre premier projet
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteProject = useDeleteProject();
  const { isAdmin, canWrite } = useRole();

  const status = statusConfig[project.status];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md dark:hover:shadow-gray-900 transition-all hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/projects/${project.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {project.name}
            </h3>
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          {project.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">{project.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            {project.budget && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {Number(project.budget).toLocaleString('fr-FR')} €
              </span>
            )}
            {project.startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.startDate).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        </Link>

        {(canWrite || isAdmin) && (
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-20">
                  {canWrite && (
                    <Link
                      href={`/projects/${project.id}/edit`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setShowMenu(false)}
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Link>
                  )}
                  {isAdmin && (
                    <button
                      onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Supprimer le projet ?</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              <strong className="text-gray-900 dark:text-white">&quot;{project.name}&quot;</strong> sera définitivement supprimé avec tous ses indicateurs. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { deleteProject.mutate(project.id); setShowDeleteConfirm(false); }}
                disabled={deleteProject.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors"
              >
                {deleteProject.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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