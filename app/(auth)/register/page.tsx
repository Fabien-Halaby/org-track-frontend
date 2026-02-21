// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useRegister } from '@/lib/hooks/useAuth';
// import Link from 'next/link';

// const registerSchema = z.object({
//   firstName: z.string().min(2, 'Prénom requis'),
//   lastName: z.string().min(2, 'Nom requis'),
//   email: z.string().email('Email invalide'),
//   password: z.string().min(8, '8 caractères minimum'),
//   organizationName: z.string().min(2, 'Nom d\'organisation requis'),
//   organizationDescription: z.string().optional(),
// });

// type RegisterForm = z.infer<typeof registerSchema>;

// export default function RegisterPage() {
//   const register = useRegister();
  
//   const {
//     register: registerField,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterForm>({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = (data: RegisterForm) => {
//     register.mutate(data);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-8">
//       <div className="text-center mb-8">
//         <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
//           <span className="text-white font-bold text-2xl">IT</span>
//         </div>
//         <h1 className="text-2xl font-bold text-gray-900">Créer votre espace</h1>
//         <p className="text-gray-500 mt-2">Inscrivez votre organisation</p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
//             <input
//               {...registerField('firstName')}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             />
//             {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
//             <input
//               {...registerField('lastName')}
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             />
//             {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//           <input
//             type="email"
//             {...registerField('email')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             placeholder="contact@asso.org"
//           />
//           {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
//           <input
//             type="password"
//             {...registerField('password')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//           />
//           {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Organisation</label>
//           <input
//             {...registerField('organizationName')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//             placeholder="Association Impact"
//           />
//           {errors.organizationName && <p className="mt-1 text-sm text-red-600">{errors.organizationName.message}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Description (optionnel)</label>
//           <textarea
//             {...registerField('organizationDescription')}
//             rows={3}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
//             placeholder="Mission de l'organisation..."
//           />
//         </div>

//         {register.isError && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//             {"Erreur lors de l'inscription"}
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={isSubmitting || register.isPending}
//           className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
//         >
//           {register.isPending ? 'Création...' : 'Créer mon espace'}
//         </button>
//       </form>

//       <p className="mt-6 text-center text-sm text-gray-600">
//         Déjà un compte ?{' '}
//         <Link href="/login" className="text-primary hover:underline font-medium">
//           Se connecter
//         </Link>
//       </p>
//     </div>
//   );
// }

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegister } from '@/lib/hooks/useAuth';
import Link from 'next/link';

const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum'),
  organizationName: z.string().min(2, "Nom d'organisation requis"),
  organizationDescription: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    register.mutate(data);
  };

  return (
    <div className="auth-card">
      {/* Logo */}
      <div className="text-center mb-7">
        <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
          <span className="text-white font-bold text-xl">IT</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Créer votre espace
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Inscrivez votre organisation sur ImpactTrack
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Prénom / Nom */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-base">Prénom</label>
            <input
              {...registerField('firstName')}
              className="input-base"
              placeholder="Marie"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label className="label-base">Nom</label>
            <input
              {...registerField('lastName')}
              className="input-base"
              placeholder="Dupont"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="label-base">Email</label>
          <input
            type="email"
            {...registerField('email')}
            className="input-base"
            placeholder="contact@asso.org"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="label-base">Mot de passe</label>
          <input
            type="password"
            {...registerField('password')}
            className="input-base"
            placeholder="8 caractères minimum"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium uppercase tracking-wide">
            Votre organisation
          </p>
          <div className="space-y-4">
            <div>
              <label className="label-base">{"Nom de l'organisation"}</label>
              <input
                {...registerField('organizationName')}
                className="input-base"
                placeholder="Association Impact"
              />
              {errors.organizationName && (
                <p className="mt-1 text-xs text-red-500">{errors.organizationName.message}</p>
              )}
            </div>

            <div>
              <label className="label-base">
                Description{' '}
                <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                {...registerField('organizationDescription')}
                rows={2}
                className="input-base resize-none"
                placeholder="Mission de l'organisation..."
              />
            </div>
          </div>
        </div>

        {/* ✅ Erreur sans rechargement */}
        {register.isError && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            Une erreur est survenue. Vérifiez vos informations.
          </div>
        )}

        <button
          type="submit"
          disabled={register.isPending}
          className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-indigo-900 mt-2"
        >
          {register.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Création...
            </span>
          ) : (
            'Créer mon espace'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  );
}