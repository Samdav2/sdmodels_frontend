/**
 * Admin API functions
 */

import apiClient from './client';
import { Model, User, PaginatedResponse, ApiResponse } from './types';

export interface AdminStats {
  total_revenue: number;
  platform_fees: number;
  active_users: number;
  pending_models: number;
  total_models: number;
  server_load: number;
}

export interface AdminUser extends User {
  models: number;
  revenue: number;
  joined: string;
}

export const adminApi = {
  // Get platform statistics
  getStats: async (): Promise<AdminStats> => {
    const response = await apiClient.get<AdminStats>('/admin/stats');
    return response.data;
  },

  // User Management
  getUsers: async (page = 1, limit = 20, search?: string): Promise<PaginatedResponse<AdminUser>> => {
    const response = await apiClient.get<PaginatedResponse<AdminUser>>('/admin/users', {
      params: { page, limit, search },
    });
    return response.data;
  },

  verifyCreator: async (userId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/admin/users/${userId}/verify`);
    return response.data;
  },

  banUser: async (userId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/admin/users/${userId}/ban`);
    return response.data;
  },

  // Model Management
  getPendingModels: async (page = 1, limit = 20): Promise<PaginatedResponse<Model>> => {
    const response = await apiClient.get<PaginatedResponse<Model>>('/admin/models/pending', {
      params: { page, limit },
    });
    return response.data;
  },

  approveModel: async (modelId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/admin/models/${modelId}/approve`);
    return response.data;
  },

  rejectModel: async (modelId: number, reason?: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/admin/models/${modelId}/reject`, {
      reason,
    });
    return response.data;
  },

  // Content Reports
  getReports: async (page = 1, limit = 20): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>('/admin/reports', {
      params: { page, limit },
    });
    return response.data;
  },

  resolveReport: async (reportId: number, action: 'remove' | 'dismiss'): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/admin/reports/${reportId}/resolve`, {
      action,
    });
    return response.data;
  },
};
