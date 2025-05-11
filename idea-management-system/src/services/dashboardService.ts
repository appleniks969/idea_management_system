import { ApiResponse, createApiResponse, handleApiError } from './api';
import {
  getDashboardMetrics,
  getStatusDistributionData,
  getDepartmentDistributionData,
  getIdeaSubmissionTimelineData,
  getImpactVsEffortData,
  getCategoryApprovalRateData,
  getImplementationTimelineData
} from '../mockData/dashboardData';
import { DashboardMetrics } from '../types';

export const fetchDashboardMetrics = async (): Promise<ApiResponse<DashboardMetrics>> => {
  try {
    const metrics = getDashboardMetrics();
    return createApiResponse(metrics);
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchStatusDistribution = async (): Promise<ApiResponse<any[]>> => {
  try {
    const data = getStatusDistributionData();
    return createApiResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchDepartmentDistribution = async (): Promise<ApiResponse<any[]>> => {
  try {
    const data = getDepartmentDistributionData();
    return createApiResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchIdeaSubmissionTimeline = async (): Promise<ApiResponse<any[]>> => {
  try {
    const data = getIdeaSubmissionTimelineData();
    return createApiResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchImpactVsEffortData = async (): Promise<ApiResponse<any[]>> => {
  try {
    const data = getImpactVsEffortData();
    return createApiResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchCategoryApprovalRates = async (): Promise<ApiResponse<any[]>> => {
  try {
    const data = getCategoryApprovalRateData();
    return createApiResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchImplementationTimelines = async (): Promise<ApiResponse<any[]>> => {
  try {
    const data = getImplementationTimelineData();
    return createApiResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
};