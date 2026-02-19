import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'agent' | 'observer';
}

interface Organization {
  id: string;
  name: string;
}

// Compte renvoyé par le backend quand multipleAccounts: true
export interface PendingAccount {
  userId: string;
  organizationId: string;
  organizationName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  pendingAccounts: PendingAccount[]; // ← liste en attente de sélection

  setAuth: (data: {
    user: User;
    organization: Organization;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setPendingAccounts: (accounts: PendingAccount[]) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
      pendingAccounts: [],

      setAuth: (data) =>
        set({
          user: data.user,
          organization: data.organization,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isLoading: false,
          pendingAccounts: [],
        }),

      setPendingAccounts: (accounts) =>
        set({
          pendingAccounts: accounts,
          isLoading: false,
        }),

      updateTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      logout: () =>
        set({
          user: null,
          organization: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          pendingAccounts: [],
        }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: 'auth-storage' }
  )
);
