'use client';

import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
    completionRate: number;
  };
  indicators: {
    total: number;
    withTarget: number;
    averageProgress: number;
    valuesThisMonth: number;
  };
  financial: {
    totalBudget: number;
    averageBudget: number;
  };
}

export interface Trend {
  period: string;
  valuesAdded: number;
  projectsCreated: number;
}

export interface Alert {
  type: 'no_data' | 'stale_data' | 'low_progress';
  severity: 'critical' | 'warning' | 'info';
  indicator: { id: string; name: string };
  project: { id: string; name: string };
  message: string;
  since?: string;
  lastUpdate?: string;
  progress?: number;
}

export interface Activity {
  type: 'value_added' | 'project_created';
  date: string;
  description: string;
  project: string;
  details: string;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data as DashboardStats;
    },
  });
}

export function useDashboardTrends() {
  return useQuery({
    queryKey: ['dashboard', 'trends'],
    queryFn: async () => {
      const response = await api.get('/dashboard/trends');
      return response.data as Trend[];
    },
  });
}

export function useDashboardAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: async () => {
      const response = await api.get('/dashboard/alerts');
      return response.data as Alert[];
    },
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      const response = await api.get('/dashboard/recent-activity');
      return response.data as Activity[];
    },
  });
}