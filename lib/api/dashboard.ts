/**
 * Dashboard API functions
 */

import apiClient from './client';
import { ApiResponse } from './types';

export const dashboardApi = {
  // Messages
  getMessages: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/messages');
    return response.data.data || [];
  },

  sendReply: async (messageId: string, text: string): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(`/dashboard/messages/${messageId}/reply`, {
      text,
    });
    return response.data.data;
  },

  markAsRead: async (messageId: string): Promise<void> => {
    await apiClient.patch(`/dashboard/messages/${messageId}/read`);
  },

  // Social
  getFollowers: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/followers');
    return response.data.data || [];
  },

  getSocialStats: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/social/stats');
    return response.data.data;
  },

  getFollowerActivity: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/social/activity');
    return response.data.data || [];
  },

  // Financials
  getBalance: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/financials/balance');
    return response.data.data;
  },

  getTransactions: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/financials/transactions');
    return response.data.data || [];
  },

  getEarnings: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/financials/earnings');
    return response.data.data || [];
  },

  requestWithdrawal: async (amount: number, method: string): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/dashboard/financials/withdraw', {
      amount,
      payment_method: method,
    });
    return response.data.data;
  },

  // Settings
  getSettings: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/settings');
    return response.data.data;
  },

  updateProfile: async (data: any): Promise<any> => {
    const response = await apiClient.patch<ApiResponse<any>>('/dashboard/settings/profile', data);
    return response.data.data;
  },

  updateSecurity: async (data: any): Promise<any> => {
    const response = await apiClient.patch<ApiResponse<any>>('/dashboard/settings/security', data);
    return response.data.data;
  },

  updateNotifications: async (data: any): Promise<any> => {
    const response = await apiClient.patch<ApiResponse<any>>('/dashboard/settings/notifications', data);
    return response.data.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/dashboard/settings/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  getSessions: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/settings/sessions');
    return response.data.data || [];
  },

  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/dashboard/settings/sessions/${sessionId}`);
  },
};
