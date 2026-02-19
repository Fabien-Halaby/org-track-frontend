import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/client';

export type MemberProject = {
  id: string;
  name: string;
  status: string;
  accessId: string;
};

export type Member = {
  accessId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  role: string;
  permissions: string[];
  createdAt: string;
  projects: MemberProject[];
};

export function useMembers() {
  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await api.get('/members');
      return res.data;
    },
  });
}

export function useAssignProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, projectId }: { userId: string; projectId: string }) =>
      api.post(`/members/${userId}/projects`, { projectId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
  });
}

export function useRevokeProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ accessId }: { accessId: string }) =>
      api.delete(`/members/access/${accessId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      api.patch(`/members/${userId}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
  });
}

export function useRevokeMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      api.delete(`/members/${userId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['members'] }),
  });
}
