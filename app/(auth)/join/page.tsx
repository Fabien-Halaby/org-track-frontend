'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useVerifyInvitation, useJoin } from '@/lib/hooks/useInvitations';
import { useAuthStore } from '@/lib/store/auth';

const joinSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum'),
  token: z.string(),
});

type JoinForm = z.infer<typeof joinSchema>;

export default function JoinPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [verification, setVerification] = useState<any>(null);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const verifyMutation = useVerifyInvitation();
  const joinMutation = useJoin();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JoinForm>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      token: token || '',
    },
  });

  useEffect(() => {
    if (!token) {
      setError('Lien d\'invitation invalide');
      setVerifying(false);
      return;
    }

    verifyMutation.mutate(token, {
      onSuccess: (data) => {
        setVerification(data.invitation);
        if (data.invitation.email) {
          setValue('email', data.invitation.email);
        }
        setVerifying(false);
      },
      onError: () => {
        setError('Invitation invalide ou expirée');
        setVerifying(false);
      },
    });
  }, [token, setValue]);

  const onSubmit = (data: JoinForm) => {
    joinMutation.mutate(data, {
      onSuccess: (response) => {
        setAuth({
          user: response.user,
          organization: response.user.organization,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        router.push('/dashboard');
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      },
    });
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation invalide</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Rejoindre l'équipe</h1>
          <p className="text-gray-500 mt-2">
            Vous êtes invité en tant que{' '}
            <span className="font-semibold capitalize text-blue-600">{verification?.role}</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">{verification?.organizationName}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                {...register('firstName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                {...register('lastName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              disabled={!!verification?.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="8 caractères minimum"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {joinMutation.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {joinMutation.error?.response?.data?.message || 'Erreur lors de l\'inscription'}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || joinMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {joinMutation.isPending ? 'Création...' : 'Rejoindre l\'équipe'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
