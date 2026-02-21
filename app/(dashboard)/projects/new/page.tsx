// 'use client';

// import { useForm, useWatch } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useCreateProject } from '@/lib/hooks/useProjects';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { ArrowLeft, AlertCircle, Calendar, Info } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { addDays, format, isBefore, startOfDay, isToday, parseISO } from 'date-fns';
// import { fr } from 'date-fns/locale';

// const projectSchema = z.object({
//   name: z.string().min(2, 'Nom requis (min 2 caractères)'),
//   description: z.string().optional(),
//   status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft'),
//   budget: z.string().optional(),
//   startDate: z.string().optional(),
//   endDate: z.string().optional(),
// }).refine(
//   (data) => {
//     // Validation: date fin > date début (si les deux existent)
//     if (data.startDate && data.endDate) {
//       return data.endDate > data.startDate;
//     }
//     return true;
//   },
//   {
//     message: 'La date de fin doit être après la date de début',
//     path: ['endDate'],
//   }
// );

// type ProjectForm = z.infer<typeof projectSchema>;

// export default function NewProjectPage() {
//   const router = useRouter();
//   const createProject = useCreateProject();
//   const [minStartDate, setMinStartDate] = useState('');
//   const todayStr = format(new Date(), 'yyyy-MM-dd');
  
//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<ProjectForm>({
//     resolver: zodResolver(projectSchema),
//     defaultValues: {
//       status: 'draft',
//       startDate: '',
//       endDate: '',
//     },
//   });

//   const status = watch('status');
//   const startDate = watch('startDate');
//   const endDate = watch('endDate');

//   // Mettre à jour la date min au chargement
//   useEffect(() => {
//     const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
//     setMinStartDate(tomorrow);
//   }, []);

//   // Gestion automatique de la date selon le statut
//   useEffect(() => {
//     if (status === 'active') {
//       // Si statut = active → date début = aujourd'hui, verrouillée
//       setValue('startDate', todayStr);
//     } else if (status === 'draft' && startDate === todayStr) {
//       // Si on repasse en draft et que c'était aujourd'hui → reset
//       setValue('startDate', '');
//     }
//   }, [status, setValue, todayStr, startDate]);

//   // Auto-ajuster la date de fin si elle est avant la date de début
//   useEffect(() => {
//     if (startDate && endDate && endDate <= startDate) {
//       const newEndDate = format(addDays(new Date(startDate), 1), 'yyyy-MM-dd');
//       setValue('endDate', newEndDate);
//     }
//   }, [startDate, endDate, setValue]);

//   const onSubmit = (data: ProjectForm) => {
//     // Si statut active, on force la date de début à aujourd'hui
//     const submitData = {
//       ...data,
//       startDate: data.status === 'active' ? todayStr : data.startDate,
//       budget: data.budget ? parseFloat(data.budget) : undefined,
//     };

//     createProject.mutate(submitData, {
//       onSuccess: () => {
//         router.push('/projects');
//       },
//     });
//   };

//   const isActive = status === 'active';

//   return (
//     <div className="max-w-2xl">
//       <div className="flex items-center gap-4 mb-6">
//         <Link href="/projects" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
//           <ArrowLeft className="w-4 h-4" />
//           Retour
//         </Link>
//       </div>

//       <h1 className="text-2xl font-bold text-gray-900 mb-2">Nouveau projet</h1>
//       <p className="text-gray-500 mb-6">Créez un projet avec les bonnes dates</p>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
        
//         {/* Nom */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Nom du projet *
//           </label>
//           <input
//             {...register('name')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             placeholder="Projet Insertion Jeunes 2024"
//           />
//           {errors.name && (
//             <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//               <AlertCircle className="w-4 h-4" />
//               {errors.name.message}
//             </p>
//           )}
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description
//           </label>
//           <textarea
//             {...register('description')}
//             rows={4}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
//             placeholder="Décrivez l'objectif du projet..."
//           />
//         </div>

//         {/* Statut avec info contextuelle */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Statut initial *
//           </label>
//           <select
//             {...register('status')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//           >
//             <option value="draft">📝 Brouillon (démarrage programmé)</option>
//             <option value="active">🚀 Actif (démarrage immédiat)</option>
//           </select>
          
//           {/* Info contextuelle selon le statut */}
//           <div className={`mt-2 p-3 rounded-lg text-sm ${
//             isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
//           }`}>
//             {isActive ? (
//               <div className="flex items-start gap-2">
//                 <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="font-medium">Démarrage immédiat</p>
//                   <p>Le projet démarre aujourd'hui ({format(new Date(), 'dd MMMM yyyy', { locale: fr })}). 
//                      La date de début est verrouillée.</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-start gap-2">
//                 <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="font-medium">Démarrage différé</p>
//                   <p>Le projet reste en brouillon. Choisissez une date de début (demain ou plus tard). 
//                      Le projet s'activera automatiquement à cette date.</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Budget */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Budget (€)
//           </label>
//           <input
//             type="number"
//             {...register('budget')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             placeholder="50000"
//           />
//         </div>

//         {/* Dates */}
//         <div className="grid grid-cols-2 gap-4">
//           {/* Date de début */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//               <Calendar className="w-4 h-4" />
//               Date de début
//               {isActive && <span className="text-green-600 text-xs">(auto)</span>}
//             </label>
            
//             {isActive ? (
//               // Mode actif: date verrouillée à aujourd'hui
//               <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   <span className="font-medium">
//                     {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
//                   </span>
//                 </div>
//                 <p className="text-xs text-green-600 mt-1">Démarrage immédiat</p>
//               </div>
//             ) : (
//               // Mode brouillon: date choisie par l'utilisateur (demain+)
//               <input
//                 type="date"
//                 min={minStartDate}
//                 {...register('startDate')}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//               />
//             )}
            
//             {errors.startDate && !isActive && (
//               <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                 <AlertCircle className="w-4 h-4" />
//                 {errors.startDate.message}
//               </p>
//             )}
            
//             {!isActive && (
//               <p className="text-xs text-gray-500 mt-1">
//                 Minimum: demain ({format(addDays(new Date(), 1), 'dd/MM/yyyy')})
//               </p>
//             )}
//           </div>

//           {/* Date de fin */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//               <Calendar className="w-4 h-4" />
//               Date de fin
//             </label>
//             <input
//               type="date"
//               min={isActive ? todayStr : (startDate || minStartDate)}
//               {...register('endDate')}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             />
//             {errors.endDate && (
//               <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                 <AlertCircle className="w-4 h-4" />
//                 {errors.endDate.message}
//               </p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">
//               Doit être après la date de début
//             </p>
//           </div>
//         </div>

//         {/* Erreur API */}
//         {createProject.isError && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
//             <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
//             <div>
//               <p className="font-medium">Erreur de validation</p>
//               <p className="text-sm">{(createProject.error as Error)?.message}</p>
//               {(createProject.error as Error)?.message?.includes('demain') && (
//                 <p className="text-sm mt-2 text-red-600">
//                   💡 <strong>Conseil:</strong> Pour démarrer aujourd'hui, choisissez le statut "Actif".
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
//           <button
//             type="submit"
//             disabled={isSubmitting || createProject.isPending}
//             className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
//           >
//             {createProject.isPending ? 'Création...' : 'Créer le projet'}
//           </button>
//           <Link href="/projects" className="px-6 py-3 text-gray-600 hover:text-gray-900">
//             Annuler
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }


'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateProject } from '@/lib/hooks/useProjects';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Calendar, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const projectSchema = z.object({
  name: z.string().min(2, 'Nom requis (min 2 caractères)'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft'),
  budget: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine(
  data => !(data.startDate && data.endDate && data.endDate <= data.startDate),
  { message: 'La date de fin doit être après la date de début', path: ['endDate'] }
);

type ProjectForm = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();
  const [minStartDate, setMinStartDate] = useState('');
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: 'draft', startDate: '', endDate: '' },
  });

  const status = watch('status');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const isActive = status === 'active';

  useEffect(() => {
    setMinStartDate(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  }, []);

  useEffect(() => {
    if (isActive) setValue('startDate', todayStr);
    else if (startDate === todayStr) setValue('startDate', '');
  }, [isActive]);

  useEffect(() => {
    if (startDate && endDate && endDate <= startDate) {
      setValue('endDate', format(addDays(new Date(startDate), 1), 'yyyy-MM-dd'));
    }
  }, [startDate, endDate, setValue]);

  const onSubmit = (data: ProjectForm) => {
    createProject.mutate({
      ...data,
      startDate: isActive ? todayStr : data.startDate,
      budget: data.budget ? parseFloat(data.budget) : undefined,
    }, { onSuccess: () => router.push('/projects') });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/projects" className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nouveau projet</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Créez un projet pour votre organisation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div>
          <label className="label-base">Nom du projet *</label>
          <input {...register('name')} className="input-base" placeholder="Projet Insertion Jeunes 2025" />
          {errors.name && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name.message}</p>}
        </div>

        <div>
          <label className="label-base">Description</label>
          <textarea {...register('description')} rows={3} className="input-base resize-none" placeholder="Décrivez l'objectif du projet..." />
        </div>

        <div>
          <label className="label-base">Statut initial *</label>
          <select {...register('status')} className="input-base">
            <option value="draft">Brouillon (démarrage programmé)</option>
            <option value="active">Actif (démarrage immédiat)</option>
          </select>
          <div className={`mt-2 p-3 rounded-xl text-xs flex items-start gap-2 ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'}`}>
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {isActive
              ? `Démarrage immédiat — date fixée à aujourd'hui (${format(new Date(), 'dd MMMM yyyy', { locale: fr })})`
              : 'Le projet reste en brouillon. Choisissez une date de début (demain ou plus tard).'}
          </div>
        </div>

        <div>
          <label className="label-base">Budget (€)</label>
          <input type="number" {...register('budget')} className="input-base" placeholder="50000" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-base flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date de début
              {isActive && <span className="text-emerald-500 text-xs font-normal">(auto)</span>}
            </label>
            {isActive ? (
              <div className="input-base bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm">
                {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
              </div>
            ) : (
              <input type="date" min={minStartDate} {...register('startDate')} className="input-base" />
            )}
            {errors.startDate && !isActive && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="label-base flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date de fin
            </label>
            <input type="date" min={isActive ? todayStr : (startDate || minStartDate)} {...register('endDate')} className="input-base" />
            {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
          </div>
        </div>

        {createProject.isError && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {(createProject.error as Error)?.message}
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={createProject.isPending}
            className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-900"
          >
            {createProject.isPending ? 'Création...' : 'Créer le projet'}
          </button>
          <Link href="/projects" className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}