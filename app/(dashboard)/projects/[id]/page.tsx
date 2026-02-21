// 'use client';

// import { useState } from 'react';
// import { useProject, useDeleteProject, useActivateProject, useCompleteProject, useCancelProject } from '@/lib/hooks/useProjects';
// import { useIndicators } from '@/lib/hooks/useIndicators';
// import { useRole } from '@/lib/hooks/useRole';
// import { downloadPdf, downloadExcel } from '@/lib/api/download';
// import Link from 'next/link';
// import { useParams } from 'next/navigation';
// import { format, isPast, isFuture, isToday, differenceInDays } from 'date-fns';
// import { fr } from 'date-fns/locale';
// import {
//   ArrowLeft,
//   Calendar,
//   DollarSign,
//   Edit,
//   TrendingUp,
//   Plus,
//   Download,
//   FileSpreadsheet,
//   Trash2,
//   AlertTriangle,
//   Play,
//   CheckCircle,
//   XCircle,
//   Clock,
//   AlertCircle,
//   Info,
// } from 'lucide-react';

// const statusConfig = {
//   draft: {
//     label: 'Brouillon',
//     color: 'bg-gray-100 text-gray-700 border-gray-200',
//     icon: Clock,
//     description: 'Projet en préparation',
//   },
//   active: {
//     label: 'Actif',
//     color: 'bg-green-100 text-green-700 border-green-200',
//     icon: Play,
//     description: "Projet en cours d'exécution",
//   },
//   completed: {
//     label: 'Terminé',
//     color: 'bg-blue-100 text-blue-700 border-blue-200',
//     icon: CheckCircle,
//     description: 'Projet terminé avec succès',
//   },
//   cancelled: {
//     label: 'Annulé',
//     color: 'bg-red-100 text-red-700 border-red-200',
//     icon: XCircle,
//     description: 'Projet annulé',
//   },
// };

// export default function ProjectDetailPage() {
//   const params = useParams();
//   const projectId = params.id as string;

//   const { data: project, isLoading: projectLoading } = useProject(projectId);
//   const { data: indicators, isLoading: indicatorsLoading } = useIndicators(projectId);
//   const deleteProject = useDeleteProject();
//   const activateProject = useActivateProject();
//   const completeProject = useCompleteProject();
//   const cancelProject = useCancelProject();

//   const { isAdmin, canWrite, canOnlyRead } = useRole();

//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState('');
//   const [actionError, setActionError] = useState<string | null>(null);

//   const handleDownloadPdf = () => {
//     if (project) downloadPdf(projectId, `rapport-${project.name}.pdf`);
//   };

//   const handleDownloadExcel = () => {
//     if (project) downloadExcel(projectId, `donnees-${project.name}.xlsx`);
//   };

//   const handleDelete = () => {
//     deleteProject.mutate(projectId, {
//       onError: (error) => setActionError(error.message),
//     });
//   };

//   const handleActivate = () => {
//     activateProject.mutate(projectId, {
//       onError: (error) => setActionError(error.message),
//     });
//   };

//   const handleComplete = () => {
//     completeProject.mutate(projectId, {
//       onError: (error) => setActionError(error.message),
//     });
//   };

//   const handleCancel = () => {
//     cancelProject.mutate(
//       { projectId, reason: cancelReason },
//       {
//         onSuccess: () => {
//           setShowCancelModal(false);
//           setCancelReason('');
//         },
//         onError: (error) => setActionError(error.message),
//       },
//     );
//   };

//   if (projectLoading) {
//     return <div className="flex items-center justify-center h-64">Chargement...</div>;
//   }

//   if (!project) {
//     return <div>Projet non trouvé</div>;
//   }

//   const status = statusConfig[project.status];
//   const StatusIcon = status.icon;
//   const hasIndicators = indicators && indicators.length > 0;

//   // Calculs de dates
//   const startDate = project.startDate ? new Date(project.startDate) : null;
//   const endDate = project.endDate ? new Date(project.endDate) : null;
//   const today = new Date();

//   const isStartToday = startDate && isToday(startDate);
//   const isStartPassed = startDate && isPast(startDate) && !isToday(startDate);
//   const isEndPassed = endDate && isPast(endDate) && !isToday(endDate);
//   const isEndToday = endDate && isToday(endDate);

//   const daysUntilStart =
//     startDate && isFuture(startDate) ? differenceInDays(startDate, today) : null;
//   const daysUntilEnd =
//     endDate && (isFuture(endDate) || isToday(endDate))
//       ? differenceInDays(endDate, today)
//       : null;

//   const isTerminal = ['completed', 'cancelled'].includes(project.status);

//   // ✅ Actions selon rôle + état projet
//   const canActivate =
//     canWrite &&
//     project.status === 'draft' &&
//     startDate &&
//     (isStartToday || isStartPassed);
//   const canComplete =
//     canWrite && project.status === 'active' && (isEndPassed || isEndToday);
//   const canCancel =
//     canWrite && ['draft', 'active'].includes(project.status);
//   const canDelete =
//     isAdmin && (project.status === 'draft' || project.status === 'cancelled');
//   const canEdit = canWrite && !isTerminal;

//   return (
//     <div className="space-y-6">
//       {/* Header navigation */}
//       <div className="flex items-center gap-4">
//         <Link
//           href="/projects"
//           className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </Link>
//       </div>

//       {/* Erreur d'action */}
//       {actionError && (
//         <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
//           <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
//           <div>
//             <p className="font-medium">Action impossible</p>
//             <p className="text-sm">{actionError}</p>
//             <button
//               onClick={() => setActionError(null)}
//               className="text-sm underline mt-2 hover:text-red-800"
//             >
//               Fermer
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Card principale */}
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
//               <span
//                 className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color} flex items-center gap-1.5`}
//               >
//                 <StatusIcon className="w-4 h-4" />
//                 {status.label}
//               </span>
//             </div>
//             <p className="text-gray-600">{status.description}</p>
//             {project.description && (
//               <p className="text-gray-500 mt-2 text-sm">{project.description}</p>
//             )}
//           </div>

//           {/* Boutons d'action */}
//           <div className="flex items-center gap-1">
//             {/* ✅ Edit : admin et manager uniquement, projet non terminal */}
//             {canEdit && (
//               <Link
//                 href={`/projects/${projectId}/edit`}
//                 className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
//                 title="Modifier"
//               >
//                 <Edit className="w-5 h-5" />
//               </Link>
//             )}

//             {/* Téléchargements : tous les rôles */}
//             <button
//               onClick={handleDownloadPdf}
//               className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               title="PDF"
//             >
//               <Download className="w-5 h-5" />
//             </button>

//             <button
//               onClick={handleDownloadExcel}
//               className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//               title="Excel"
//             >
//               <FileSpreadsheet className="w-5 h-5" />
//             </button>

//             {/* ✅ Supprimer : admin uniquement */}
//             {canDelete && (
//               <button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                 title={
//                   project.status === 'cancelled'
//                     ? 'Supprimer définitivement'
//                     : 'Supprimer'
//                 }
//               >
//                 <Trash2 className="w-5 h-5" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Alertes de workflow — visibles seulement pour admin/manager */}
//         {canWrite && (
//           <div className="space-y-3 mb-6">
//             {project.status === 'draft' && startDate && isStartPassed && (
//               <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
//                 <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="font-medium text-amber-800">Date de début dépassée</p>
//                   <p className="text-sm text-amber-700">
//                     Le projet devait démarrer le{' '}
//                     {format(startDate, 'dd MMMM yyyy', { locale: fr })}.{' '}
//                     {"En l'activant maintenant, la date sera ajustée à aujourd'hui."}
//                   </p>
//                   <button
//                     onClick={handleActivate}
//                     disabled={activateProject.isPending}
//                     className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
//                   >
//                     {activateProject.isPending
//                       ? 'Activation...'
//                       : 'Activer maintenant (date ajustée)'}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {project.status === 'active' &&
//               endDate &&
//               (isEndToday || isEndPassed) && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
//                   <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
//                   <div className="flex-1">
//                     <p className="font-medium text-blue-800">Date de fin atteinte</p>
//                     <p className="text-sm text-blue-700">
//                       Le projet se termine{' '}
//                       {isEndToday
//                         ? "aujourd'hui"
//                         : `le ${format(endDate, 'dd MMMM yyyy', { locale: fr })}`}
//                       . Marquez-le comme terminé si toutes les livrables sont OK.
//                     </p>
//                     <button
//                       onClick={handleComplete}
//                       disabled={completeProject.isPending}
//                       className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
//                     >
//                       {completeProject.isPending
//                         ? 'Clôture...'
//                         : 'Marquer comme terminé'}
//                     </button>
//                   </div>
//                 </div>
//               )}

//             {project.status === 'draft' &&
//               daysUntilStart &&
//               daysUntilStart > 0 && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
//                   <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
//                   <div className="flex-1">
//                     <p className="font-medium text-blue-800">Démarrage programmé</p>
//                     <p className="text-sm text-blue-700">
//                       Le projet est prévu pour le{' '}
//                       {format(startDate!, 'dd MMMM yyyy', { locale: fr })}.{' '}
//                       {"Vous pouvez l'activer maintenant pour démarrer plus tôt."}
//                     </p>
//                     <button
//                       onClick={handleActivate}
//                       disabled={activateProject.isPending}
//                       className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
//                     >
//                       {activateProject.isPending
//                         ? 'Activation...'
//                         : 'Démarrer maintenant (avance le projet)'}
//                     </button>
//                   </div>
//                 </div>
//               )}
//           </div>
//         )}

//         {/* Infos projet */}
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           {project.budget && (
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
//                 <DollarSign className="w-4 h-4" />
//                 Budget
//               </div>
//               <p className="text-xl font-semibold text-gray-900">
//                 {Number(project.budget).toLocaleString('fr-FR')} €
//               </p>
//             </div>
//           )}

//           {startDate && (
//             <div
//               className={`rounded-lg p-4 ${isStartPassed ? 'bg-green-50' : 'bg-gray-50'}`}
//             >
//               <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
//                 <Calendar className="w-4 h-4" />
//                 Début
//               </div>
//               <p className="text-lg font-semibold text-gray-900">
//                 {format(startDate, 'dd MMM yyyy', { locale: fr })}
//               </p>
//               {isStartToday && (
//                 <span className="text-xs text-green-600 font-medium">
//                   Aujourd&apos;hui
//                 </span>
//               )}
//             </div>
//           )}

//           {endDate && (
//             <div
//               className={`rounded-lg p-4 ${
//                 isEndPassed
//                   ? 'bg-blue-50'
//                   : daysUntilEnd && daysUntilEnd <= 7
//                   ? 'bg-amber-50'
//                   : 'bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
//                 <Calendar className="w-4 h-4" />
//                 Fin prévue
//               </div>
//               <p className="text-lg font-semibold text-gray-900">
//                 {format(endDate, 'dd MMM yyyy', { locale: fr })}
//               </p>
//               {daysUntilEnd && daysUntilEnd > 0 && (
//                 <span
//                   className={`text-xs font-medium ${
//                     daysUntilEnd <= 7 ? 'text-amber-600' : 'text-gray-500'
//                   }`}
//                 >
//                   {daysUntilEnd} jour{daysUntilEnd > 1 ? 's' : ''} restant
//                   {daysUntilEnd > 1 ? 's' : ''}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ✅ Actions de workflow : admin et manager uniquement */}
//         {!isTerminal && canWrite && (
//           <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
//             {canActivate && (
//               <button
//                 onClick={handleActivate}
//                 disabled={activateProject.isPending}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
//               >
//                 <Play className="w-4 h-4" />
//                 {activateProject.isPending ? 'Activation...' : 'Activer le projet'}
//               </button>
//             )}

//             {canComplete && (
//               <button
//                 onClick={handleComplete}
//                 disabled={completeProject.isPending}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
//               >
//                 <CheckCircle className="w-4 h-4" />
//                 {completeProject.isPending ? 'Clôture...' : 'Terminer le projet'}
//               </button>
//             )}

//             {canCancel && (
//               <button
//                 onClick={() => setShowCancelModal(true)}
//                 disabled={cancelProject.isPending}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
//               >
//                 <XCircle className="w-4 h-4" />
//                 Annuler le projet
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Section Indicateurs */}
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//             <TrendingUp className="w-5 h-5" />
//             Indicateurs
//             {indicatorsLoading && (
//               <span className="text-sm font-normal text-gray-400">
//                 (chargement...)
//               </span>
//             )}
//           </h2>
//           {project.status === 'active' && (
//             <Link
//               href={`/indicators?project=${project.id}`}
//               className="text-primary hover:underline text-sm"
//             >
//               Voir tous
//             </Link>
//           )}
//         </div>

//         {project.status !== 'active' && (
//           <div
//             className={`rounded-lg p-4 mb-4 flex items-start gap-3 ${
//               project.status === 'draft'
//                 ? 'bg-amber-50 border border-amber-200'
//                 : 'bg-gray-50 border border-gray-200'
//             }`}
//           >
//             <AlertCircle
//               className={`w-5 h-5 shrink-0 mt-0.5 ${
//                 project.status === 'draft' ? 'text-amber-600' : 'text-gray-500'
//               }`}
//             />
//             <div>
//               <p
//                 className={`font-medium ${
//                   project.status === 'draft' ? 'text-amber-800' : 'text-gray-700'
//                 }`}
//               >
//                 Projet{' '}
//                 {project.status === 'draft'
//                   ? 'en brouillon'
//                   : project.status === 'completed'
//                   ? 'terminé'
//                   : 'annulé'}
//               </p>
//               <p
//                 className={`text-sm ${
//                   project.status === 'draft' ? 'text-amber-700' : 'text-gray-600'
//                 }`}
//               >
//                 {project.status === 'draft'
//                   ? 'Activez le projet pour pouvoir créer des indicateurs et suivre vos performances.'
//                   : 'Ce projet est clôturé. Les indicateurs ne peuvent plus être modifiés.'}
//               </p>
//               {/* ✅ Bouton activer dans le bloc indicateurs : admin/manager seulement */}
//               {project.status === 'draft' && canWrite && (
//                 <button
//                   onClick={handleActivate}
//                   disabled={activateProject.isPending}
//                   className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
//                 >
//                   {activateProject.isPending ? 'Activation...' : 'Activer le projet'}
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {indicatorsLoading ? (
//           <div className="animate-pulse space-y-3">
//             <div className="h-12 bg-gray-100 rounded-lg"></div>
//             <div className="h-12 bg-gray-100 rounded-lg"></div>
//           </div>
//         ) : hasIndicators ? (
//           <div className="space-y-3">
//             {indicators.map((indicator) => (
//               <Link
//                 key={indicator.id}
//                 href={`/indicators/${indicator.id}`}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div>
//                   <h3 className="font-medium text-gray-900">{indicator.name}</h3>
//                   <p className="text-sm text-gray-500">
//                     {indicator.values?.length || 0} valeur(s) •{' '}
//                     {indicator.targetValue &&
//                       ` Objectif: ${indicator.targetValue}`}
//                   </p>
//                 </div>
//                 <TrendingUp className="w-5 h-5 text-gray-400" />
//               </Link>
//             ))}
//             {/* ✅ Ajouter indicateur : admin et manager uniquement */}
//             {project.status === 'active' && canWrite && (
//               <Link
//                 href={`/indicators/new?project=${project.id}`}
//                 className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors text-gray-500"
//               >
//                 <Plus className="w-4 h-4" />
//                 Ajouter un indicateur
//               </Link>
//             )}
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-500 mb-4">Aucun indicateur</p>
//             {project.status === 'active' ? (
//               canWrite ? (
//                 <Link
//                   href={`/indicators/new?project=${project.id}`}
//                   className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Créer un indicateur
//                 </Link>
//               ) : (
//                 <p className="text-sm text-gray-400">
//                   {canOnlyRead
//                     ? 'Aucun indicateur à afficher pour ce projet.'
//                     : 'Contactez un manager pour créer des indicateurs.'}
//                 </p>
//               )
//             ) : project.status === 'draft' ? (
//               <p className="text-sm text-amber-600">
//                 {canWrite
//                   ? 'Activez le projet pour créer des indicateurs'
//                   : 'Le projet est en brouillon'}
//               </p>
//             ) : (
//               <p className="text-sm text-gray-400">
//                 Projet{' '}
//                 {project.status === 'completed' ? 'terminé' : 'annulé'}
//               </p>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Modal suppression */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
//             <div className="flex items-center gap-3 text-red-600 mb-4">
//               <AlertTriangle className="w-6 h-6" />
//               <h3 className="text-lg font-semibold">
//                 {project.status === 'cancelled'
//                   ? 'Supprimer le projet annulé ?'
//                   : 'Supprimer le projet ?'}
//               </h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               <strong>&quot;{project.name}&quot;</strong> sera définitivement
//               supprimé avec tous ses indicateurs.
//               {project.status === 'cancelled' && (
//                 <span className="block mt-2 text-amber-600 text-sm">
//                   Ce projet est déjà annulé. Cette action est irréversible.
//                 </span>
//               )}
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleDelete}
//                 disabled={deleteProject.isPending}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
//               >
//                 {deleteProject.isPending
//                   ? 'Suppression...'
//                   : 'Supprimer définitivement'}
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal annulation */}
//       {showCancelModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
//             <div className="flex items-center gap-3 text-red-600 mb-4">
//               <XCircle className="w-6 h-6" />
//               <h3 className="text-lg font-semibold">Annuler le projet ?</h3>
//             </div>
//             <p className="text-gray-600 mb-4">
//               Cette action est irréversible. Le projet{' '}
//               <strong>&quot;{project.name}&quot;</strong> sera marqué comme
//               annulé.
//             </p>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Motif d&apos;annulation (optionnel)
//               </label>
//               <textarea
//                 value={cancelReason}
//                 onChange={(e) => setCancelReason(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
//                 rows={3}
//                 placeholder="Pourquoi ce projet est-il annulé ?"
//               />
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleCancel}
//                 disabled={cancelProject.isPending}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
//               >
//                 {cancelProject.isPending
//                   ? 'Annulation...'
//                   : "Confirmer l'annulation"}
//               </button>
//               <button
//                 onClick={() => {
//                   setShowCancelModal(false);
//                   setCancelReason('');
//                 }}
//                 className="flex-1 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Retour
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
import { useProject, useDeleteProject, useActivateProject, useCompleteProject, useCancelProject } from '@/lib/hooks/useProjects';
import { useIndicators } from '@/lib/hooks/useIndicators';
import { useRole } from '@/lib/hooks/useRole';
import { downloadPdf, downloadExcel } from '@/lib/api/download';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format, isPast, isFuture, isToday, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ArrowLeft, Calendar, DollarSign, Edit, TrendingUp, Plus,
  Download, FileSpreadsheet, Trash2, AlertTriangle, Play,
  CheckCircle, XCircle, Clock, AlertCircle, Info,
} from 'lucide-react';

const statusConfig = {
  draft:     { label: 'Brouillon', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700', icon: Clock },
  active:    { label: 'Actif',     color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', icon: Play },
  completed: { label: 'Terminé',   color: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800', icon: CheckCircle },
  cancelled: { label: 'Annulé',    color: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800', icon: XCircle },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: indicators, isLoading: indicatorsLoading } = useIndicators(projectId);
  const deleteProject = useDeleteProject();
  const activateProject = useActivateProject();
  const completeProject = useCompleteProject();
  const cancelProject = useCancelProject();
  const { isAdmin, canWrite, canOnlyRead } = useRole();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  if (projectLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (!project) return (
    <div className="text-center py-16 text-gray-500 dark:text-gray-400">Projet non trouvé</div>
  );

  const status = statusConfig[project.status];
  const StatusIcon = status.icon;

  const startDate = project.startDate ? new Date(project.startDate) : null;
  const endDate = project.endDate ? new Date(project.endDate) : null;
  const today = new Date();

  const isStartToday = startDate && isToday(startDate);
  const isStartPassed = startDate && isPast(startDate) && !isToday(startDate);
  const isEndPassed = endDate && isPast(endDate) && !isToday(endDate);
  const isEndToday = endDate && isToday(endDate);
  const daysUntilStart = startDate && isFuture(startDate) ? differenceInDays(startDate, today) : null;
  const daysUntilEnd = endDate && (isFuture(endDate) || isToday(endDate)) ? differenceInDays(endDate, today) : null;
  const isTerminal = ['completed', 'cancelled'].includes(project.status);

  const canActivate = canWrite && project.status === 'draft' && startDate && (isStartToday || isStartPassed);
  const canComplete = canWrite && project.status === 'active' && (isEndPassed || isEndToday);
  const canCancel = canWrite && ['draft', 'active'].includes(project.status);
  const canDelete = isAdmin && ['draft', 'cancelled'].includes(project.status);
  const canEdit = canWrite && !isTerminal;

  const handleDelete = () => deleteProject.mutate(projectId, { onError: e => setActionError(e.message) });
  const handleActivate = () => activateProject.mutate(projectId, { onError: e => setActionError(e.message) });
  const handleComplete = () => completeProject.mutate(projectId, { onError: e => setActionError(e.message) });
  const handleCancel = () => cancelProject.mutate({ projectId, reason: cancelReason }, {
    onSuccess: () => { setShowCancelModal(false); setCancelReason(''); },
    onError: e => setActionError(e.message),
  });

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back */}
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux projets
      </Link>

      {/* Erreur */}
      {actionError && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            {actionError}
            <button onClick={() => setActionError(null)} className="block text-xs underline mt-1 opacity-75 hover:opacity-100">Fermer</button>
          </div>
        </div>
      )}

      {/* Card principale */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {status.label}
              </span>
            </div>
            {project.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-4 shrink-0">
            {canEdit && (
              <Link href={`/projects/${projectId}/edit`}
                className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl transition-colors"
                title="Modifier"
              >
                <Edit className="w-4 h-4" />
              </Link>
            )}
            <button onClick={() => downloadPdf(projectId, `rapport-${project.name}.pdf`)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors" title="PDF">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => downloadExcel(projectId, `donnees-${project.name}.xlsx`)}
              className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors" title="Excel">
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            {canDelete && (
              <button onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors" title="Supprimer">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Alertes workflow */}
        {canWrite && (
          <div className="space-y-3 mb-5">
            {project.status === 'draft' && startDate && isStartPassed && (
              <Alert color="amber" icon={Clock} title="Date de début dépassée">
                Le projet devait démarrer le {format(startDate, 'dd MMMM yyyy', { locale: fr })}.
                <button onClick={handleActivate} disabled={activateProject.isPending}
                  className="mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50 block">
                  {activateProject.isPending ? 'Activation...' : 'Activer maintenant'}
                </button>
              </Alert>
            )}
            {project.status === 'active' && endDate && (isEndToday || isEndPassed) && (
              <Alert color="indigo" icon={CheckCircle} title="Date de fin atteinte">
                Le projet se termine {isEndToday ? "aujourd'hui" : `le ${format(endDate, 'dd MMMM yyyy', { locale: fr })}`}.
                <button onClick={handleComplete} disabled={completeProject.isPending}
                  className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50 block">
                  {completeProject.isPending ? 'Clôture...' : 'Marquer comme terminé'}
                </button>
              </Alert>
            )}
            {project.status === 'draft' && daysUntilStart && daysUntilStart > 0 && (
              <Alert color="blue" icon={Info} title="Démarrage programmé">
                Prévu le {format(startDate!, 'dd MMMM yyyy', { locale: fr })} ({daysUntilStart} jour{daysUntilStart > 1 ? 's' : ''}).
                <button onClick={handleActivate} disabled={activateProject.isPending}
                  className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50 block">
                  {activateProject.isPending ? 'Activation...' : 'Démarrer maintenant'}
                </button>
              </Alert>
            )}
          </div>
        )}

        {/* Infos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {project.budget && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <DollarSign className="w-3.5 h-3.5" /> Budget
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{Number(project.budget).toLocaleString('fr-FR')} €</p>
            </div>
          )}
          {startDate && (
            <div className={`rounded-xl p-4 ${isStartPassed ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Début
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{format(startDate, 'dd MMM yyyy', { locale: fr })}</p>
              {isStartToday && <p className="text-xs text-emerald-600 mt-0.5">{"Aujourd'hui"}</p>}
            </div>
          )}
          {endDate && (
            <div className={`rounded-xl p-4 ${isEndPassed ? 'bg-indigo-50 dark:bg-indigo-950/30' : daysUntilEnd && daysUntilEnd <= 7 ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Fin prévue
              </div>
              <p className="font-bold text-gray-900 dark:text-white">{format(endDate, 'dd MMM yyyy', { locale: fr })}</p>
              {daysUntilEnd && daysUntilEnd > 0 && (
                <p className={`text-xs mt-0.5 ${daysUntilEnd <= 7 ? 'text-amber-600' : 'text-gray-500 dark:text-gray-400'}`}>
                  {daysUntilEnd}j restant{daysUntilEnd > 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions workflow */}
        {!isTerminal && canWrite && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            {canActivate && (
              <button onClick={handleActivate} disabled={activateProject.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                <Play className="w-4 h-4" />
                {activateProject.isPending ? 'Activation...' : 'Activer'}
              </button>
            )}
            {canComplete && (
              <button onClick={handleComplete} disabled={completeProject.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                <CheckCircle className="w-4 h-4" />
                {completeProject.isPending ? 'Clôture...' : 'Terminer'}
              </button>
            )}
            {canCancel && (
              <button onClick={() => setShowCancelModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-sm font-medium transition-colors">
                <XCircle className="w-4 h-4" />
                Annuler
              </button>
            )}
          </div>
        )}
      </div>

      {/* Indicateurs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Indicateurs
          </h2>
          {project.status === 'active' && (
            <Link href={`/indicators?project=${project.id}`} className="text-xs text-indigo-500 hover:text-indigo-600">
              Voir tous →
            </Link>
          )}
        </div>

        {project.status !== 'active' && (
          <div className={`rounded-xl p-4 mb-4 flex items-start gap-3 text-sm ${project.status === 'draft' ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800' : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
            <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${project.status === 'draft' ? 'text-amber-500' : 'text-gray-400'}`} />
            <div>
              <p className={`font-medium text-sm ${project.status === 'draft' ? 'text-amber-800 dark:text-amber-400' : 'text-gray-700 dark:text-gray-300'}`}>
                Projet {project.status === 'draft' ? 'en brouillon' : project.status === 'completed' ? 'terminé' : 'annulé'}
              </p>
              <p className={`text-xs mt-0.5 ${project.status === 'draft' ? 'text-amber-700 dark:text-amber-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {project.status === 'draft' ? 'Activez le projet pour créer des indicateurs.' : 'Ce projet est clôturé.'}
              </p>
            </div>
          </div>
        )}

        {indicatorsLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            <div className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          </div>
        ) : indicators && indicators.length > 0 ? (
          <div className="space-y-2">
            {indicators.map(indicator => (
              <Link key={indicator.id} href={`/indicators/${indicator.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors group">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{indicator.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {indicator.values?.length || 0} valeur(s){indicator.targetValue ? ` · Objectif: ${indicator.targetValue}` : ''}
                  </p>
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
              </Link>
            ))}
            {project.status === 'active' && canWrite && (
              <Link href={`/indicators/new?project=${project.id}`}
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-500 text-gray-400 text-sm transition-colors">
                <Plus className="w-4 h-4" /> Ajouter un indicateur
              </Link>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <TrendingUp className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Aucun indicateur</p>
            {project.status === 'active' && canWrite && (
              <Link href={`/indicators/new?project=${project.id}`}
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all">
                <Plus className="w-4 h-4" /> Créer un indicateur
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Modal suppression */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Supprimer le projet ?</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
            <strong className="text-gray-900 dark:text-white">&quot;{project.name}&quot;</strong> sera définitivement supprimé avec tous ses indicateurs.
          </p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleteProject.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50">
              {deleteProject.isPending ? 'Suppression...' : 'Supprimer'}
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
              Annuler
            </button>
          </div>
        </Modal>
      )}

      {/* Modal annulation */}
      {showCancelModal && (
        <Modal onClose={() => { setShowCancelModal(false); setCancelReason(''); }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Annuler le projet ?</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <strong className="text-gray-900 dark:text-white">"{project.name}"</strong> sera marqué comme annulé. Cette action est irréversible.
          </p>
          <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)}
            className="input-base resize-none mb-4" rows={3} placeholder="Motif d'annulation (optionnel)" />
          <div className="flex gap-3">
            <button onClick={handleCancel} disabled={cancelProject.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50">
              {cancelProject.isPending ? 'Annulation...' : "Confirmer l'annulation"}
            </button>
            <button onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
              className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
              Retour
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Alert({ color, icon: Icon, title, children }: any) {
  const styles: Record<string, string> = {
    amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-400',
    blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400',
  };
  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${styles[color]}`}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="text-sm">
        <p className="font-medium">{title}</p>
        <div className="opacity-80 mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
        {children}
      </div>
    </div>
  );
}