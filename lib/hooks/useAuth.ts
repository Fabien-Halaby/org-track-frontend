'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '../api/client';
import { useAuthStore } from '../store/auth';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
  organizationDescription?: string;
}

export function useLogin() {
  const router = useRouter();
  const { setAuth, setPendingAccounts } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.multipleAccounts) {
        // Stocker la liste et rediriger vers la page de sélection
        setPendingAccounts(data.accounts);
        router.push('/select-account');
      } else {
        setAuth(data);
        router.push('/dashboard');
      }
    },
  });
}

export function useSelectAccount() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.post('/auth/select-account', { userId });
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      router.push('/dashboard');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // pas d'appel API nécessaire, on vide juste le store
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push('/login');
    },
  });
}
