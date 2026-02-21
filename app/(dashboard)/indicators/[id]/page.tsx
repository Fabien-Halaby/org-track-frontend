// 'use client';

// import { useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import {
//   ArrowLeft,
//   TrendingUp,
//   Target,
//   Calendar,
//   Plus,
//   Edit2,
//   Trash2,
//   X,
//   AlertTriangle,
//   Save,
//   Loader2,
// } from 'lucide-react';
// import {
//   useIndicator,
//   useIndicatorTimeline,
//   useAddValue,
//   useUpdateValue,
//   useDeleteIndicator,
//   useDeleteValue,
//   IndicatorValue,
//   IndicatorFrequency,
// } from '@/lib/hooks/useIndicators';
// import { useRole } from '@/lib/hooks/useRole';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';

// const valueSchema = z.object({
//   value: z.string().min(1, 'Valeur requise'),
//   period: z.string().min(1, 'Période requise'),
//   notes: z.string().optional(),
// });

// type ValueForm = z.infer<typeof valueSchema>;

// export default function IndicatorDetailPage() {
//   const params = useParams();
//   const indicatorId = params.id as string;

//   const { data: indicator, isLoading: indicatorLoading } = useIndicator(indicatorId);
//   const { data: timeline, isLoading: timelineLoading } = useIndicatorTimeline(indicatorId);
//   const addValue = useAddValue();
//   const updateValue = useUpdateValue();
//   const deleteIndicator = useDeleteIndicator();
//   const deleteValue = useDeleteValue();

//   // Hook rôle
//   const { isAdmin, canWrite, canAddValues } = useRole();

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [valueToDelete, setValueToDelete] = useState<string | null>(null);
//   const [editingValue, setEditingValue] = useState<IndicatorValue | null>(null);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<ValueForm>({
//     resolver: zodResolver(valueSchema),
//     defaultValues: {
//       period: new Date().toISOString().slice(0, 7),
//     },
//   });

//   const startEditing = (entry: IndicatorValue) => {
//     setEditingValue(entry);
//     setValue('value', entry.value.toString());
//     setValue('period', entry.period);
//     setValue('notes', entry.notes || '');
//     setShowAddForm(true);
//   };

//   const onSubmit = (data: ValueForm) => {
//     const payload = {
//       value: parseFloat(data.value),
//       period: data.period,
//       notes: data.notes,
//     };

//     if (editingValue) {
//       updateValue.mutate(
//         { indicatorId, valueId: editingValue.id, data: payload },
//         {
//           onSuccess: () => {
//             reset();
//             setShowAddForm(false);
//             setEditingValue(null);
//           },
//         },
//       );
//     } else {
//       addValue.mutate(
//         { indicatorId, data: payload },
//         {
//           onSuccess: () => {
//             reset();
//             setShowAddForm(false);
//           },
//         },
//       );
//     }
//   };

//   const handleCancel = () => {
//     setShowAddForm(false);
//     setEditingValue(null);
//     reset();
//   };

//   if (indicatorLoading || timelineLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (!indicator) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-500">Indicateur non trouvé</p>
//         <Link
//           href="/indicators"
//           className="text-primary hover:underline mt-2 inline-block"
//         >
//           Retour aux indicateurs
//         </Link>
//       </div>
//     );
//   }

//   const chartData =
//     timeline?.map((v) => ({
//       period: v.period,
//       value: Number(v.value),
//     })) || [];

//   const currentValue = timeline?.[timeline.length - 1]?.value || 0;
//   const progress = indicator.targetValue
//     ? Math.min(
//         (Number(currentValue) / Number(indicator.targetValue)) * 100,
//         100,
//       )
//     : 0;

//   const formatValue = (value: number) => {
//     if (indicator.type === 'currency')
//       return `${value.toLocaleString('fr-FR')} €`;
//     if (indicator.type === 'percentage') return `${value}%`;
//     if (indicator.type === 'boolean') return value ? 'Oui' : 'Non';
//     return value.toLocaleString('fr-FR');
//   };

//   const typeLabels: Record<string, string> = {
//     number: 'Nombre',
//     percentage: 'Pourcentage',
//     currency: 'Euros',
//     boolean: 'Oui/Non',
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <Link
//             href={`/indicators?project=${indicator.projectId}`}
//             className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </Link>
//           <div>
//             <div className="flex items-center gap-2">
//               <h1 className="text-2xl font-bold text-gray-900">
//                 {indicator.name}
//               </h1>
//               <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                 {typeLabels[indicator.type]}
//               </span>
//             </div>
//             <p className="text-gray-500 text-sm">
//               {indicator.description || 'Aucune description'}
//             </p>
//           </div>
//         </div>

//         {/* Edit : admin et manager uniquement */}
//         <div className="flex items-center gap-1">
//           {canWrite && (
//             <Link
//               href={`/indicators/${indicatorId}/edit`}
//               className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
//               title="Modifier l'indicateur"
//             >
//               <Edit2 className="w-5 h-5" />
//             </Link>
//           )}
//           {/* Supprimer : admin uniquement */}
//           {isAdmin && (
//             <button
//               onClick={() => setShowDeleteConfirm(true)}
//               className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               title="Supprimer l'indicateur"
//             >
//               <Trash2 className="w-5 h-5" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4">
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

//       {/* Graphique */}
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution</h2>
//         {chartData.length > 0 ? (
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="period" stroke="#6b7280" />
//                 <YAxis stroke="#6b7280" />
//                 <Tooltip
//                   formatter={(value?: number) => [
//                     formatValue(value ?? 0),
//                     'Valeur',
//                   ]}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="value"
//                   stroke="#2563eb"
//                   strokeWidth={3}
//                   dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         ) : (
//           <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
//             <p className="text-gray-400">Aucune donnée saisie</p>
//           </div>
//         )}
//       </div>

//       {/* Historique + Ajout */}
//       <div className="bg-white rounded-xl border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//             <Calendar className="w-5 h-5" />
//             Historique des saisies
//           </h2>
//           {/* Bouton saisie : admin, manager et agent */}
//           {canAddValues && (
//             <button
//               onClick={() => {
//                 if (showAddForm) {
//                   handleCancel();
//                 } else {
//                   setShowAddForm(true);
//                 }
//               }}
//               className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
//             >
//               {showAddForm ? (
//                 <X className="w-4 h-4" />
//               ) : (
//                 <Plus className="w-4 h-4" />
//               )}
//               {showAddForm ? 'Annuler' : 'Ajouter une valeur'}
//             </button>
//           )}
//         </div>

//         {/* Formulaire ajout/édition */}
//         {showAddForm && canAddValues && (
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="bg-gray-50 rounded-lg p-4 mb-4"
//           >
//             <h3 className="font-semibold text-gray-900 mb-4">
//               {editingValue ? 'Modifier la valeur' : 'Nouvelle saisie'}
//             </h3>
//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Valeur
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   {...register('value')}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
//                 />
//                 {errors.value && (
//                   <p className="text-red-600 text-xs mt-1">
//                     {errors.value.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <PeriodInput frequency={indicator.frequency} register={register} error={errors.period?.message} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Notes
//                 </label>
//                 <input
//                   {...register('notes')}
//                   className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
//                   placeholder="Optionnel"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-2 mt-4">
//               <button
//                 type="submit"
//                 disabled={
//                   isSubmitting || addValue.isPending || updateValue.isPending
//                 }
//                 className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
//               >
//                 <Save className="w-4 h-4" />
//                 {addValue.isPending || updateValue.isPending
//                   ? 'Enregistrement...'
//                   : 'Enregistrer'}
//               </button>
//               {editingValue && (
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-900"
//                 >
//                   Annuler
//                 </button>
//               )}
//             </div>
//           </form>
//         )}

//         {/* Tableau historique */}
//         <div className="space-y-2">
//           {timeline && timeline.length > 0 ? (
//             [...timeline].reverse().map((entry) => (
//               <div
//                 key={entry.id}
//                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex items-center gap-4">
//                   <span className="font-medium text-gray-900 w-24">
//                     {entry.period}
//                   </span>
//                   <span className="font-semibold text-gray-900">
//                     {formatValue(Number(entry.value))}
//                   </span>
//                   {entry.notes && (
//                     <span className="text-sm text-gray-500">
//                       - {entry.notes}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-1">
//                   {/* Modifier valeur : admin, manager et agent */}
//                   {canAddValues && (
//                     <button
//                       onClick={() => startEditing(entry)}
//                       className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
//                       title="Modifier"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                   )}
//                   {/* Supprimer valeur : admin et manager uniquement */}
//                   {canWrite && (
//                     <button
//                       onClick={() => setValueToDelete(entry.id)}
//                       className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       title="Supprimer"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center py-8 text-gray-400">
//               {canAddValues
//                 ? 'Aucune valeur enregistrée — utilisez le bouton ci-dessus pour en ajouter'
//                 : 'Aucune valeur enregistrée'}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Modal suppression indicateur */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
//             <div className="flex items-center gap-3 text-red-600 mb-4">
//               <AlertTriangle className="w-6 h-6" />
//               <h3 className="text-lg font-semibold">
//                 {"Supprimer l'indicateur ?"}
//               </h3>
//             </div>
//             <p className="text-gray-600 mb-6">
//               <strong>{indicator.name}</strong> et tout son historique seront
//               définitivement supprimés.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => deleteIndicator.mutate(indicatorId)}
//                 disabled={deleteIndicator.isPending}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
//               >
//                 {deleteIndicator.isPending ? 'Suppression...' : 'Supprimer'}
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal suppression valeur */}
//       {valueToDelete && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Supprimer cette valeur ?
//             </h3>
//             <p className="text-gray-600 mb-4">Cette action est irréversible.</p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   deleteValue.mutate({ indicatorId, valueId: valueToDelete });
//                   setValueToDelete(null);
//                 }}
//                 disabled={deleteValue.isPending}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
//               >
//                 {deleteValue.isPending ? 'Suppression...' : 'Supprimer'}
//               </button>
//               <button
//                 onClick={() => setValueToDelete(null)}
//                 className="flex-1 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
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


// const frequencyLabels: Record<IndicatorFrequency, string> = {
//   daily: 'Quotidien',
//   weekly: 'Hebdomadaire',
//   monthly: 'Mensuel',
//   quarterly: 'Trimestriel',
//   yearly: 'Annuel',
//   free: 'Libre',
// };

// const frequencyExamples: Record<IndicatorFrequency, string> = {
//   daily: 'ex: 2026-01-15',
//   weekly: 'ex: 2026-W03',
//   monthly: 'ex: 2026-01',
//   quarterly: 'ex: 2026-T1',
//   yearly: 'ex: 2026',
//   free: 'ex: Janvier 2026',
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const PeriodInput = ({ frequency, register, error }: { frequency: IndicatorFrequency, register: any, error?: string }) => {
//   const label = frequencyLabels[frequency];
  
//   switch (frequency) {
//     case 'daily':
//       return (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//           <input type="date" {...register('period')} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
//         </div>
//       );
//     case 'weekly':
//       return (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Semaine</label>
//           <input type="week" {...register('period')} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
//         </div>
//       );
//     case 'quarterly':
//       return (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Trimestre</label>
//           <select {...register('period')} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none">
//             <option value="">Sélectionner...</option>
//             {[2023, 2026, 2025, 2026].map(year =>
//               ['T1', 'T2', 'T3', 'T4'].map(q => (
//                 <option key={`${year}-${q}`} value={`${year}-${q}`}>{year} — {q}</option>
//               ))
//             )}
//           </select>
//           {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
//         </div>
//       );
//     case 'monthly':
//       return (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Mois</label>
//           <input type="month" {...register('period')} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
//         </div>
//       );
//     case 'yearly':
//       return (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
//           <input type="number" min="2000" max="2100" {...register('period')} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none" />
//         </div>
//       );
//     default: // free
//       return (
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Période ({label})</label>
//           <input
//             {...register('period')}
//             placeholder={frequencyExamples[frequency]}
//             className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
//           />
//           {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
//         </div>
//       );
//   }
// };


'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, TrendingUp, Target, Calendar, Plus,
  Edit2, Trash2, X, AlertTriangle, Save,
} from 'lucide-react';
import {
  useIndicator, useIndicatorTimeline, useAddValue,
  useUpdateValue, useDeleteIndicator, useDeleteValue,
  IndicatorValue, IndicatorFrequency,
} from '@/lib/hooks/useIndicators';
import { useRole } from '@/lib/hooks/useRole';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const valueSchema = z.object({
  value: z.string().min(1, 'Valeur requise'),
  period: z.string().min(1, 'Période requise'),
  notes: z.string().optional(),
});

type ValueForm = z.infer<typeof valueSchema>;

const typeColors: Record<string, string> = {
  currency:   'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
  percentage: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  boolean:    'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
  number:     'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
};

const typeLabels: Record<string, string> = {
  number: 'Nombre', percentage: '%', currency: '€', boolean: 'Oui/Non',
};

const frequencyLabels: Record<IndicatorFrequency, string> = {
  daily: 'Quotidien', weekly: 'Hebdomadaire', monthly: 'Mensuel',
  quarterly: 'Trimestriel', yearly: 'Annuel', free: 'Libre',
};

const frequencyExamples: Record<IndicatorFrequency, string> = {
  daily: 'ex: 2026-01-15', weekly: 'ex: 2026-W03', monthly: 'ex: 2026-01',
  quarterly: 'ex: 2026-T1', yearly: 'ex: 2026', free: 'ex: Janvier 2026',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PeriodInput({ frequency, register, error }: { frequency: IndicatorFrequency; register: any; error?: string }) {
  const label = frequencyLabels[frequency];
  const inputClass = "input-base";

  switch (frequency) {
    case 'daily':
      return <div><label className="label-base">Date</label><input type="date" {...register('period')} className={inputClass} /></div>;
    case 'weekly':
      return <div><label className="label-base">Semaine</label><input type="week" {...register('period')} className={inputClass} /></div>;
    case 'monthly':
      return <div><label className="label-base">Mois</label><input type="month" {...register('period')} className={inputClass} /></div>;
    case 'quarterly':
      return (
        <div>
          <label className="label-base">Trimestre</label>
          <select {...register('period')} className={inputClass}>
            <option value="">Sélectionner...</option>
            {[2023, 2024, 2025, 2026].map(year =>
              ['T1','T2','T3','T4'].map(q => (
                <option key={`${year}-${q}`} value={`${year}-${q}`}>{year} — {q}</option>
              ))
            )}
          </select>
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    case 'yearly':
      return <div><label className="label-base">Année</label><input type="number" min="2000" max="2100" {...register('period')} className={inputClass} /></div>;
    default:
      return (
        <div>
          <label className="label-base">Période ({label})</label>
          <input {...register('period')} placeholder={frequencyExamples[frequency]} className={inputClass} />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
  }
}

export default function IndicatorDetailPage() {
  const params = useParams();
  const indicatorId = params.id as string;

  const { data: indicator, isLoading: indicatorLoading } = useIndicator(indicatorId);
  const { data: timeline, isLoading: timelineLoading } = useIndicatorTimeline(indicatorId);
  const addValue = useAddValue();
  const updateValue = useUpdateValue();
  const deleteIndicator = useDeleteIndicator();
  const deleteValue = useDeleteValue();
  const { isAdmin, canWrite, canAddValues } = useRole();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [valueToDelete, setValueToDelete] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<IndicatorValue | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ValueForm>({
    resolver: zodResolver(valueSchema),
    defaultValues: { period: new Date().toISOString().slice(0, 7) },
  });

  const startEditing = (entry: IndicatorValue) => {
    setEditingValue(entry);
    setValue('value', entry.value.toString());
    setValue('period', entry.period);
    setValue('notes', entry.notes || '');
    setShowAddForm(true);
  };

  const handleCancel = () => { setShowAddForm(false); setEditingValue(null); reset(); };

  const onSubmit = (data: ValueForm) => {
    const payload = { value: parseFloat(data.value), period: data.period, notes: data.notes };
    if (editingValue) {
      updateValue.mutate({ indicatorId, valueId: editingValue.id, data: payload }, {
        onSuccess: () => { reset(); setShowAddForm(false); setEditingValue(null); },
      });
    } else {
      addValue.mutate({ indicatorId, data: payload }, {
        onSuccess: () => { reset(); setShowAddForm(false); },
      });
    }
  };

  if (indicatorLoading || timelineLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
    </div>
  );

  if (!indicator) return (
    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
      Indicateur non trouvé — <Link href="/indicators" className="text-indigo-500 hover:underline">Retour</Link>
    </div>
  );

  const chartData = timeline?.map(v => ({ period: v.period, value: Number(v.value) })) || [];
  const currentValue = timeline?.[timeline.length - 1]?.value || 0;
  const progress = indicator.targetValue
    ? Math.min((Number(currentValue) / Number(indicator.targetValue)) * 100, 100) : 0;

  const formatValue = (v: number) => {
    if (indicator.type === 'currency') return `${v.toLocaleString('fr-FR')} €`;
    if (indicator.type === 'percentage') return `${v}%`;
    if (indicator.type === 'boolean') return v ? 'Oui' : 'Non';
    return v.toLocaleString('fr-FR');
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/indicators?project=${indicator.projectId}`}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-bold text-gray-900 dark:text-white text-xl">{indicator.name}</h1>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[indicator.type]}`}>
                {typeLabels[indicator.type]}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {frequencyLabels[indicator.frequency ?? 'monthly']}
              </span>
            </div>
            {indicator.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{indicator.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-4">
          {canWrite && (
            <Link href={`/indicators/${indicatorId}/edit`}
              className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl transition-colors">
              <Edit2 className="w-4 h-4" />
            </Link>
          )}
          {isAdmin && (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-4">
          <p className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-1"><TrendingUp className="w-3 h-3" />Valeur actuelle</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatValue(Number(currentValue))}</p>
        </div>
        {indicator.targetValue ? (
          <>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1"><Target className="w-3 h-3" />Objectif</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatValue(Number(indicator.targetValue))}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl p-4">
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Progression</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{progress.toFixed(0)}%</p>
              <div className="mt-2 h-1.5 bg-purple-200 dark:bg-purple-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">{"Pas d'objectif défini"}</p>
          </div>
        )}
      </div>

      {/* Graphique */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm">Évolution</h2>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" className="dark:stroke-gray-800" />
                <XAxis dataKey="period" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v?: number) => [formatValue(v ?? 0), 'Valeur']}
                  contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5}
                  dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-400 dark:text-gray-500">Aucune donnée saisie</p>
          </div>
        )}
      </div>

      {/* Historique */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Historique des saisies
          </h2>
          {canAddValues && (
            <button onClick={() => showAddForm ? handleCancel() : setShowAddForm(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${showAddForm ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' : 'bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900'}`}>
              {showAddForm ? <><X className="w-3.5 h-3.5" />Annuler</> : <><Plus className="w-3.5 h-3.5" />Ajouter</>}
            </button>
          )}
        </div>

        {/* Formulaire */}
        {showAddForm && canAddValues && (
          <form onSubmit={handleSubmit(onSubmit)}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {editingValue ? 'Modifier la valeur' : 'Nouvelle saisie'}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label-base">Valeur</label>
                <input type="number" step="0.01" {...register('value')} className="input-base" />
                {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value.message}</p>}
              </div>
              <PeriodInput frequency={indicator.frequency ?? 'monthly'} register={register} error={errors.period?.message} />
              <div>
                <label className="label-base">Notes</label>
                <input {...register('notes')} className="input-base" placeholder="Optionnel" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={addValue.isPending || updateValue.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-colors">
                <Save className="w-3.5 h-3.5" />
                {addValue.isPending || updateValue.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              {editingValue && (
                <button type="button" onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Annuler
                </button>
              )}
            </div>
          </form>
        )}

        {/* Liste */}
        <div className="space-y-2">
          {timeline && timeline.length > 0 ? (
            [...timeline].reverse().map(entry => (
              <div key={entry.id}
                className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20 shrink-0">{entry.period}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatValue(Number(entry.value))}</span>
                  {entry.notes && <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">— {entry.notes}</span>}
                </div>
                <div className="flex items-center gap-1">
                  {canAddValues && (
                    <button onClick={() => startEditing(entry)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canWrite && (
                    <button onClick={() => setValueToDelete(entry.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {canAddValues ? 'Aucune valeur — utilisez le bouton "Ajouter" pour commencer' : 'Aucune valeur enregistrée'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal suppression indicateur */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{"Supprimer l'indicateur ?"}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              <strong className="text-gray-900 dark:text-white">{indicator.name}</strong> et tout son historique seront définitivement supprimés.
            </p>
            <div className="flex gap-3">
              <button onClick={() => deleteIndicator.mutate(indicatorId)} disabled={deleteIndicator.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50">
                {deleteIndicator.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression valeur */}
      {valueToDelete && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Supprimer cette valeur ?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => { deleteValue.mutate({ indicatorId, valueId: valueToDelete }); setValueToDelete(null); }}
                disabled={deleteValue.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-50">
                {deleteValue.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
              <button onClick={() => setValueToDelete(null)}
                className="flex-1 py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}