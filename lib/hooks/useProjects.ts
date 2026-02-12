'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { useRouter } from 'next/navigation';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  budget: number | null;
  startDate: string | null;
  endDate: string | null;
  managerId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProjectData {
  name: string;
  description?: string;
  status?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
}

export function useProjects(status?: string) {
  return useQuery({
    queryKey: ['projects', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/projects${params}`);
      return response.data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProjectData) => {
      const response = await api.post('/projects', data);
      return response.data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await api.get(`/projects/${id}`);
      return response.data as Project;
    },
    enabled: !!id,
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (projectId: string) => {
      await api.delete(`/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      router.push('/projects');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateProjectData> }) => {
      const response = await api.patch(`/projects/${id}`, data);
      return response.data as Project;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });
}