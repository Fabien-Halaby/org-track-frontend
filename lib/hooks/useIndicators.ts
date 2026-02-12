'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

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

export function useAddValue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ indicatorId, data }: { indicatorId: string; data: AddValueData }) => {
      const response = await api.post(`/indicators/${indicatorId}/values`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicators'] });
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