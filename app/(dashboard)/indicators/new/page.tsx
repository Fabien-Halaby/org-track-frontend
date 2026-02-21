// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useCreateIndicator } from '@/lib/hooks/useIndicators';
// import { useProjects } from '@/lib/hooks/useProjects';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { ArrowLeft } from 'lucide-react';

// const indicatorSchema = z.object({
//   name: z.string().min(2, 'Nom requis'),
//   description: z.string().optional(),
//   type: z.enum(['number', 'percentage', 'currency', 'boolean']),
//   frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'free']),
//   targetValue: z.union([
//     z.string().min(1).transform((val) => parseFloat(val)),
//     z.literal(''),
//     z.undefined(),
//   ]).optional(),
//   projectId: z.string().min(1, 'Projet requis'),
// });

// type IndicatorForm = z.infer<typeof indicatorSchema>;

// export default function NewIndicatorPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const preselectedProject = searchParams.get('project') || '';
  
//   const { data: projects } = useProjects();
//   const createIndicator = useCreateIndicator();
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<IndicatorForm>({
//     resolver: zodResolver(indicatorSchema),
//     defaultValues: {
//       projectId: preselectedProject,
//       type: 'number',
//       frequency: 'monthly',
//     },
//   });

//   const onSubmit = (data: IndicatorForm) => {
//     const payload: any = {
//       name: data.name,
//       description: data.description || undefined,
//       type: data.type,
//       frequency: data.frequency,
//       projectId: data.projectId,
//     };
    
//     // N'ajouter targetValue que s'il est valide
//     if (data.targetValue && data.targetValue !== '' && !isNaN(Number(data.targetValue))) {
//       payload.targetValue = Number(data.targetValue);
//     }
    
//     console.log('Payload:', payload);
    
//     createIndicator.mutate(payload, {
//       onSuccess: () => {
//         router.push(`/indicators?project=${data.projectId}`);
//       },
//       onError: (error: any) => {
//         console.error('Erreur:', error.response?.data);
//       },
//     });
//   };

//   return (
//     <div className="max-w-2xl">
//       <div className="flex items-center gap-4 mb-6">
//         <Link
//           href="/indicators"
//           className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Retour
//         </Link>
//       </div>

//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Nouvel indicateur</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-gray-200 p-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Projet *
//           </label>
//           <select
//             {...register('projectId')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             disabled={!!preselectedProject}
//           >
//             <option value="">Sélectionner un projet...</option>
//             {projects?.map((project) => (
//               <option key={project.id} value={project.id}>
//                 {project.name}
//               </option>
//             ))}
//           </select>
//           {errors.projectId && (
//             <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             {"Nom de l'indicateur *"}
//           </label>
//           <input
//             {...register('name')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             placeholder="Nombre de bénéficiaires"
//           />
//           {errors.name && (
//             <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description
//           </label>
//           <textarea
//             {...register('description')}
//             rows={3}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
//             placeholder="Décrivez ce que mesure cet indicateur..."
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Fréquence de saisie *
//           </label>
//           <select
//             {...register('frequency')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             // defaultValue={"monthly"}
//           >
//             <option value="daily">Quotidien (ex: bénéficiaires accueillis)</option>
//             <option value="weekly">Hebdomadaire (ex: sessions de formation)</option>
//             <option value="monthly">Mensuel (ex: budget consommé)</option>
//             <option value="quarterly">{"Trimestriel (ex: rapport d'impact)"}</option>
//             <option value="yearly">Annuel (ex: audit financier)</option>
//             <option value="free">Libre (pas de contrainte)</option>
//           </select>
//           <p className="text-xs text-gray-500 mt-1">
//             Définit la périodicité de saisie des données
//           </p>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Type de mesure *
//             </label>
//             <select
//               {...register('type')}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             >
//               <option value="number">Nombre (ex: 50 personnes)</option>
//               <option value="percentage">Pourcentage (ex: 75%)</option>
//               <option value="currency">Montant en € (ex: 10 000 €)</option>
//               <option value="boolean">Oui/Non (ex: Objectif atteint)</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Objectif cible (optionnel)
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               {...register('targetValue')}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//               placeholder="100"
//             />
//           </div>
//         </div>

//         {createIndicator.isError && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//             {"Erreur lors de la création de l'indicateur"}
//           </div>
//         )}

//         <div className="flex items-center gap-4 pt-4">
//           <button
//             type="submit"
//             disabled={isSubmitting || createIndicator.isPending}
//             className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
//           >
//             {createIndicator.isPending ? 'Création...' : 'Créer l\'indicateur'}
//           </button>
//           <Link
//             href="/indicators"
//             className="px-6 py-3 text-gray-600 hover:text-gray-900"
//           >
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
import { useCreateIndicator } from '@/lib/hooks/useIndicators';
import { useProjects } from '@/lib/hooks/useProjects';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const indicatorSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  description: z.string().optional(),
  type: z.enum(['number', 'percentage', 'currency', 'boolean']),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'free']),
  targetValue: z.union([
    z.string().min(1).transform(v => parseFloat(v)),
    z.literal(''),
    z.undefined(),
  ]).optional(),
  projectId: z.string().min(1, 'Projet requis'),
});

type IndicatorForm = z.infer<typeof indicatorSchema>;

const typeOptions = [
  { value: 'number', label: 'Nombre', desc: 'ex: 50 personnes' },
  { value: 'percentage', label: 'Pourcentage', desc: 'ex: 75%' },
  { value: 'currency', label: 'Montant €', desc: 'ex: 10 000 €' },
  { value: 'boolean', label: 'Oui / Non', desc: 'ex: Objectif atteint' },
];

const frequencyOptions = [
  { value: 'daily', label: 'Quotidien', desc: 'Bénéficiaires accueillis' },
  { value: 'weekly', label: 'Hebdomadaire', desc: 'Sessions de formation' },
  { value: 'monthly', label: 'Mensuel', desc: 'Budget consommé' },
  { value: 'quarterly', label: 'Trimestriel', desc: "Rapport d'impact" },
  { value: 'yearly', label: 'Annuel', desc: 'Audit financier' },
  { value: 'free', label: 'Libre', desc: 'Pas de contrainte' },
];

export default function NewIndicatorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProject = searchParams.get('project') || '';
  const { data: projects } = useProjects();
  const createIndicator = useCreateIndicator();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<IndicatorForm>({
    resolver: zodResolver(indicatorSchema),
    defaultValues: { projectId: preselectedProject, type: 'number', frequency: 'monthly' },
  });

  const selectedType = watch('type');
  const selectedFrequency = watch('frequency');

  const onSubmit = (data: IndicatorForm) => {
    const payload: any = {
      name: data.name,
      description: data.description || undefined,
      type: data.type,
      frequency: data.frequency,
      projectId: data.projectId,
    };
    if (data.targetValue && data.targetValue !== '' && !isNaN(Number(data.targetValue))) {
      payload.targetValue = Number(data.targetValue);
    }
    createIndicator.mutate(payload, {
      onSuccess: () => router.push(`/indicators?project=${data.projectId}`),
    });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/indicators"
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nouvel indicateur</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Créez un indicateur de suivi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        {/* Projet */}
        <div>
          <label className="label-base">Projet *</label>
          <select {...register('projectId')} disabled={!!preselectedProject} className="input-base disabled:opacity-60">
            <option value="">Sélectionner un projet...</option>
            {projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {errors.projectId && <p className="mt-1 text-xs text-red-500">{errors.projectId.message}</p>}
        </div>

        {/* Nom */}
        <div>
          <label className="label-base">Nom de l'indicateur *</label>
          <input {...register('name')} className="input-base" placeholder="Nombre de bénéficiaires" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label-base">Description</label>
          <textarea {...register('description')} rows={2} className="input-base resize-none" placeholder="Décrivez ce que mesure cet indicateur..." />
        </div>

        {/* Type */}
        <div>
          <label className="label-base">Type de mesure *</label>
          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map(opt => (
              <label key={opt.value} className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${selectedType === opt.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                <input type="radio" value={opt.value} {...register('type')} className="sr-only" />
                <p className="font-medium text-sm text-gray-900 dark:text-white">{opt.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Fréquence */}
        <div>
          <label className="label-base">Fréquence de saisie *</label>
          <div className="grid grid-cols-3 gap-2">
            {frequencyOptions.map(opt => (
              <label key={opt.value} className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${selectedFrequency === opt.value ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                <input type="radio" value={opt.value} {...register('frequency')} className="sr-only" />
                <p className="font-medium text-xs text-gray-900 dark:text-white">{opt.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{opt.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Objectif */}
        <div>
          <label className="label-base">Objectif cible <span className="text-gray-400 font-normal">(optionnel)</span></label>
          <input type="number" step="0.01" {...register('targetValue')} className="input-base" placeholder="100" />
        </div>

        {createIndicator.isError && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Erreur lors de la création de l'indicateur
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button type="submit" disabled={createIndicator.isPending}
            className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
            {createIndicator.isPending ? 'Création...' : "Créer l'indicateur"}
          </button>
          <Link href="/indicators"
            className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}