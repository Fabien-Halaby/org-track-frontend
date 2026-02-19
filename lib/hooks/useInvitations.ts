import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export interface CreateInvitationData {
  role: 'admin' | 'manager' | 'agent' | 'observer';
  email?: string;
  projectIds?: string[];
  expiresInDays?: number;
}

export function useInvitations() {
  return useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const res = await api.get('/invitations');
      return res.data;
    },
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateInvitationData) => {
      const res = await api.post('/invitations', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

export function useRevokeInvitation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/invitations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
  });
}

export function useVerifyInvitation() {
  return useMutation({
    mutationFn: async (token: string) => {
      const res = await api.post('/invitations/verify', { token });
      return res.data;
    },
  });
}

export function useJoin() {
  return useMutation({
    mutationFn: async (data: {
      token: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const res = await api.post('/auth/join', data);
      return res.data;
    },
  });
}