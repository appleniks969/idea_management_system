import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardMetrics,
  fetchStatusDistribution,
  fetchDepartmentDistribution,
  fetchIdeaSubmissionTimeline,
  fetchImpactVsEffortData,
  fetchCategoryApprovalRates,
  fetchImplementationTimelines
} from '../services/dashboardService';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
  statusDistribution: () => [...dashboardKeys.all, 'statusDistribution'] as const,
  departmentDistribution: () => [...dashboardKeys.all, 'departmentDistribution'] as const,
  submissionTimeline: () => [...dashboardKeys.all, 'submissionTimeline'] as const,
  impactVsEffort: () => [...dashboardKeys.all, 'impactVsEffort'] as const,
  categoryApprovalRates: () => [...dashboardKeys.all, 'categoryApprovalRates'] as const,
  implementationTimelines: () => [...dashboardKeys.all, 'implementationTimelines'] as const,
};

export function useDashboardMetrics() {
  return useQuery({
    queryKey: dashboardKeys.metrics(),
    queryFn: async () => {
      const response = await fetchDashboardMetrics();
      return response.data;
    },
  });
}

export function useStatusDistribution() {
  return useQuery({
    queryKey: dashboardKeys.statusDistribution(),
    queryFn: async () => {
      const response = await fetchStatusDistribution();
      return response.data;
    },
  });
}

export function useDepartmentDistribution() {
  return useQuery({
    queryKey: dashboardKeys.departmentDistribution(),
    queryFn: async () => {
      const response = await fetchDepartmentDistribution();
      return response.data;
    },
  });
}

export function useIdeaSubmissionTimeline() {
  return useQuery({
    queryKey: dashboardKeys.submissionTimeline(),
    queryFn: async () => {
      const response = await fetchIdeaSubmissionTimeline();
      return response.data;
    },
  });
}

export function useImpactVsEffortData() {
  return useQuery({
    queryKey: dashboardKeys.impactVsEffort(),
    queryFn: async () => {
      const response = await fetchImpactVsEffortData();
      return response.data;
    },
  });
}

export function useCategoryApprovalRates() {
  return useQuery({
    queryKey: dashboardKeys.categoryApprovalRates(),
    queryFn: async () => {
      const response = await fetchCategoryApprovalRates();
      return response.data;
    },
  });
}

export function useImplementationTimelines() {
  return useQuery({
    queryKey: dashboardKeys.implementationTimelines(),
    queryFn: async () => {
      const response = await fetchImplementationTimelines();
      return response.data;
    },
  });
}