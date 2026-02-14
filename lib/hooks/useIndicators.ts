'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { useRouter } from 'next/navigation';

export interface Indicator {
  id: string;
  name: string;
  description: string | null;
  type: 'number' | 'percentage' | 'currency' | 'boolean';
  targetValue: number | null;
  projectId: string;
  values: IndicatorValue[];
  createdAt: string;
}

export interface IndicatorValue {
  id: string;
  value: number;
  period: string;
  notes: string | null;
  createdAt: string;
}

interface CreateIndicatorData {
  name: string;
  description?: string;
  type: string;
  targetValue?: number;
  projectId: string;
}

interface AddValueData {
  value: number;
  period: string;
  notes?: string;
}

export function useIndicator(indicatorId: string) {
  return useQuery({
    queryKey: ['indicator', indicatorId],
    queryFn: async () => {
      const response = await api.get(`/indicators/${indicatorId}`);
      return response.data as Indicator;
    },
    enabled: !!indicatorId,
  });
}

export function useIndicators(projectId?: string) {
  return useQuery({
    queryKey: ['indicators', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const response = await api.get(`/indicators/project/${projectId}`);
      return response.data as Indicator[];
    },
    enabled: !!projectId,
  });
}

export function useCreateIndicator() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateIndicatorData) => {
      const response = await api.post('/indicators', data);
      return response.data as Indicator;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['indicators', variables.projectId] });
    },
  });
}

export function useUpdateIndicator() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateIndicatorData> }) => {
      const response = await api.patch(`/indicators/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
      queryClient.invalidateQueries({ queryKey: ['indicator', variables.id] });
    },
  });
}

export function useDeleteIndicator() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/indicators/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
      router.push('/indicators');
    },
  });
}

export function useAddValue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ indicatorId, data }: { indicatorId: string; data: AddValueData }) => {
      const response = await api.post(`/indicators/${indicatorId}/values`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['indicator-timeline', variables.indicatorId] });
      queryClient.invalidateQueries({ queryKey: ['indicator', variables.indicatorId] });
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
    },
  });
}

export function useUpdateValue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      indicatorId, 
      valueId, 
      data 
    }: { 
      indicatorId: string; 
      valueId: string; 
      data: Partial<AddValueData> 
    }) => {
      const response = await api.patch(`/indicators/${indicatorId}/values/${valueId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['indicator-timeline', variables.indicatorId] });
      queryClient.invalidateQueries({ queryKey: ['indicator', variables.indicatorId] });
    },
  });
}

export function useDeleteValue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ indicatorId, valueId }: { indicatorId: string; valueId: string }) => {
      await api.delete(`/indicators/${indicatorId}/values/${valueId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['indicator-timeline', variables.indicatorId] });
      queryClient.invalidateQueries({ queryKey: ['indicator', variables.indicatorId] });
    },
  });
}

export function useIndicatorTimeline(indicatorId: string) {
  return useQuery({
    queryKey: ['indicator-timeline', indicatorId],
    queryFn: async () => {
      const response = await api.get(`/indicators/${indicatorId}/timeline`);
      return response.data as IndicatorValue[];
    },
    enabled: !!indicatorId,
  });
}
