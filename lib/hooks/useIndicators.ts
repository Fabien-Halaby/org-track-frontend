'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { useRouter } from 'next/navigation';

export type IndicatorFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'free';

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





export const frequencyLabels: Record<IndicatorFrequency, string> = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  quarterly: 'Trimestriel',
  yearly: 'Annuel',
  free: 'Libre',
};

export const frequencyFormats: Record<IndicatorFrequency, string> = {
  daily: 'YYYY-MM-DD',
  weekly: 'YYYY-WXX',
  monthly: 'YYYY-MM',
  quarterly: 'YYYY-QX',
  yearly: 'YYYY',
  free: 'Libre',
};

export const frequencyExamples: Record<IndicatorFrequency, string> = {
  daily: '2026-02-19',
  weekly: '2026-W08',
  monthly: '2026-02',
  quarterly: '2026-Q1',
  yearly: '2026',
  free: 'Période personnalisée',
};

export function getCurrentPeriod(frequency: IndicatorFrequency): string {
  const now = new Date();
  const year = now.getFullYear();
  
  switch (frequency) {
    case 'daily':
      return now.toISOString().slice(0, 10);
    case 'weekly': {
      const startOfYear = new Date(year, 0, 1);
      const pastDays = (now.getTime() - startOfYear.getTime()) / 86400000;
      const week = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
      return `${year}-W${String(week).padStart(2, '0')}`;
    }
    case 'monthly':
      return now.toISOString().slice(0, 7);
    case 'quarterly': {
      const quarter = Math.ceil((now.getMonth() + 1) / 3);
      return `${year}-Q${quarter}`;
    }
    case 'yearly':
      return String(year);
    case 'free':
      return now.toISOString().slice(0, 7);
    default:
      return now.toISOString().slice(0, 7);
  }
}

export function validatePeriod(period: string, frequency: IndicatorFrequency): boolean {
  const patterns = {
    daily: /^\d{4}-\d{2}-\d{2}$/,
    weekly: /^\d{4}-W\d{2}$/,
    monthly: /^\d{4}-\d{2}$/,
    quarterly: /^\d{4}-Q[1-4]$/,
    yearly: /^\d{4}$/,
    free: /.*/,
  };
  return patterns[frequency].test(period);
}

export function getPeriodInputType(frequency: IndicatorFrequency): string {
  switch (frequency) {
    case 'daily':
      return 'date';
    case 'monthly':
      return 'month';
    case 'yearly':
      return 'number';
    default:
      return 'text';
  }
}