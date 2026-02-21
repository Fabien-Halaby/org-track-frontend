// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useLogin } from '@/lib/hooks/useAuth';
// import Link from 'next/link';

// const loginSchema = z.object({
//   email: z.string().email('Email invalide'),
//   password: z.string().min(1, 'Mot de passe requis'),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export default function LoginPage() {
//   const login = useLogin();
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginForm>({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = (data: LoginForm) => {
//     login.mutate(data);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-8">
//       <div className="text-center mb-8">
//         <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
//           <span className="text-white font-bold text-2xl">IT</span>
//         </div>
//         <h1 className="text-2xl font-bold text-gray-900">ImpactTrack</h1>
//         <p className="text-gray-500 mt-2">Connectez-vous à votre espace</p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Email
//           </label>
//           <input
//             type="email"
//             {...register('email')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
//             placeholder="contact@asso.org"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Mot de passe
//           </label>
//           <input
//             type="password"
//             {...register('password')}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
//           )}
//         </div>

//         {login.isError && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
//             Identifiants incorrects
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={isSubmitting || login.isPending}
//           className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
//         >
//           {login.isPending ? 'Connexion...' : 'Se connecter'}
//         </button>
//       </form>

//       <p className="mt-6 text-center text-sm text-gray-600">
//         Pas encore de compte ?{' '}
//         <Link href="/register" className="text-primary hover:underline font-medium">
//           Créer une organisation
//         </Link>
//       </p>
//     </div>
//   );
// }

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLogin } from '@/lib/hooks/useAuth';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate(data);
  };

  return (
    <div className="auth-card">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
          <span className="text-white font-bold text-xl">IT</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ImpactTrack
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Connectez-vous à votre espace
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="label-base">Email</label>
          <input
            type="email"
            {...register('email')}
            className="input-base"
            placeholder="contact@asso.org"
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="label-base">Mot de passe</label>
          <input
            type="password"
            {...register('password')}
            className="input-base"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* ✅ Erreur sans rechargement */}
        {login.isError && (
          <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
            Identifiants incorrects. Vérifiez votre email et mot de passe.
          </div>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 dark:shadow-indigo-900 mt-2"
        >
          {login.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Connexion...
            </span>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Pas encore de compte ?{' '}
        <Link href="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">
          Créer une organisation
        </Link>
      </p>
    </div>
  );
}