'use client';

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import {
  useVerifyInvitation,
  useJoin,
  useCheckEmail,
  useJoinExisting,
} from '@/lib/hooks/useInvitations';
import { useAuthStore } from '@/lib/store/auth';

const joinSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum'),
  token: z.string(),
});

const joinExistingSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, '8 caractères minimum'),
});

type JoinForm = z.infer<typeof joinSchema>;
type JoinExistingForm = z.infer<typeof joinExistingSchema>;

export default function JoinPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [verification, setVerification] = useState<any>(null);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailLocked, setEmailLocked] = useState(false);
  const [existingUser, setExistingUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  const verifyMutation = useVerifyInvitation();
  const checkEmailMutation = useCheckEmail();
  const joinMutation = useJoin();
  const joinExistingMutation = useJoinExisting();
  const { setAuth } = useAuthStore();

  // Formulaire nouveau compte
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JoinForm>({
    resolver: zodResolver(joinSchema),
    defaultValues: { token: token || '' },
  });

  // Formulaire compte existant
  const {
    register: registerExisting,
    handleSubmit: handleSubmitExisting,
    reset: resetExisting, // ← clé du fix
    formState: { errors: errorsExisting },
  } = useForm<JoinExistingForm>({
    resolver: zodResolver(joinExistingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Lien d'invitation invalide");
      setVerifying(false);
      return;
    }

    verifyMutation.mutate(token, {
      onSuccess: (data) => {
        setVerification(data.invitation);

        const emailFromInvitation = data.invitation.email;

        if (emailFromInvitation) {
          setEmailLocked(true);
          setValue('email', emailFromInvitation);

          checkEmailMutation.mutate(emailFromInvitation, {
            onSuccess: (result) => {
              if (result.exists) {
                const userData = {
                  firstName: result.firstName ?? '',
                  lastName: result.lastName ?? '',
                  email: emailFromInvitation,
                };
                setExistingUser(userData);

                // ✅ reset() pour forcer l'initialisation du formulaire
                // avec les vraies valeurs après réception des données
                resetExisting({
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  password: '',
                });
              }
              setVerifying(false);
            },
            onError: () => setVerifying(false),
          });
        } else {
          setEmailLocked(false);
          setVerifying(false);
        }
      },
      onError: () => {
        setError('Invitation invalide ou expirée');
        setVerifying(false);
      },
    });
  }, [token]);

  const onSubmitExisting = (data: JoinExistingForm) => {
    if (!token) return;
    joinExistingMutation.mutate(
      { token, ...data },
      {
        onSuccess: (response) => {
          setAuth({
            user: response.user,
            organization: response.organization,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
          router.push('/dashboard');
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || 'Erreur lors de la jonction');
        },
      },
    );
  };

  const onSubmit = (data: JoinForm) => {
    joinMutation.mutate(data, {
      onSuccess: (response) => {
        setAuth({
          user: response.user,
          organization: response.organization,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        router.push('/dashboard');
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      },
    });
  };

  // ── Chargement ─────────────────────────────────────────────────────────────
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">{"Vérification de l'invitation..."}</p>
        </div>
      </div>
    );
  }

  // ── Erreur ─────────────────────────────────────────────────────────────────
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

  // ── CAS 1 : email connu → infos pré-remplies et modifiables, email verrouillé ──
  if (existingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{"Rejoindre l'équipe"}</h1>
            <p className="text-gray-500 mt-2">
              Invité en tant que{' '}
              <span className="font-semibold capitalize text-blue-600">
                {verification?.role}
              </span>{' '}
              dans{' '}
              <span className="font-semibold">{verification?.organizationName}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Vous pouvez modifier vos informations si nécessaire
            </p>
          </div>

          <form onSubmit={handleSubmitExisting(onSubmitExisting)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  {...registerExisting('firstName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {errorsExisting.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errorsExisting.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  {...registerExisting('lastName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {errorsExisting.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errorsExisting.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...registerExisting('email')}
                disabled={emailLocked}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
              {emailLocked && (
                <p className="mt-1 text-xs text-gray-400">
                  {"Email défini par l'administrateur"}
                </p>
              )}
              {errorsExisting.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsExisting.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe{' '}
                <span className="text-gray-400 font-normal">(pour ce nouveau compte)</span>
              </label>
              <input
                type="password"
                {...registerExisting('password')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="8 caractères minimum"
                autoFocus
              />
              {errorsExisting.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errorsExisting.password.message}
                </p>
              )}
            </div>

            {joinExistingMutation.isError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {(joinExistingMutation.error as any)?.response?.data?.message ||
                  'Erreur lors de la jonction'}
              </div>
            )}

            <button
              type="submit"
              disabled={joinExistingMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {joinExistingMutation.isPending
                ? 'Jonction...'
                : "Rejoindre l'organisation"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            {"Ce n'est pas vous ?"}{' '}
            <button
              onClick={() => setExistingUser(null)}
              className="text-blue-500 hover:underline"
            >
              Créer un nouveau compte
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── CAS 2 : nouvel utilisateur → formulaire complet ───────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{"Rejoindre l'équipe"}</h1>
          <p className="text-gray-500 mt-2">
            Invité en tant que{' '}
            <span className="font-semibold capitalize text-blue-600">
              {verification?.role}
            </span>
          </p>
          <p className="text-sm text-gray-400 mt-1">{verification?.organizationName}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                {...register('firstName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              disabled={emailLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            />
            {emailLocked && (
              <p className="mt-1 text-xs text-gray-400">
                {"Email défini par l'administrateur"}
              </p>
            )}
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
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

          <input type="hidden" {...register('token')} />

          {joinMutation.isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {(joinMutation.error as any)?.response?.data?.message ||
                "Erreur lors de l'inscription"}
            </div>
          )}

          <button
            type="submit"
            disabled={joinMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {joinMutation.isPending ? 'Création...' : "Rejoindre l'équipe"}
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