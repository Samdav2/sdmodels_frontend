/**
 * Dashboard API functions
 */

import apiClient from './client';
import { ApiResponse } from './types';

export interface DashboardStats {
  total_sales: number;
  total_models: number;
  followers_count: number;
  total_downloads: number;
  total_revenue: number;
  pending_models: number;
}

export const dashboardApi = {
  // Stats
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  // Recent Activity
  getRecentActivity: async (): Promise<any[]> => {
    const response = await apiClient.get<any[]>('/dashboard/recent-activity');
    return response.data;
  },

  // Sales Chart
  getSalesChart: async (): Promise<any> => {
    const response = await apiClient.get<any>('/dashboard/sales-chart');
    return response.data;
  },

  // Revenue
  getRevenue: async (): Promise<any> => {
    const response = await apiClient.get<any>('/dashboard/revenue');
    return response.data;
  },

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

  // Get profile information
  getProfile: async (): Promise<any> => {
    const response = await apiClient.get<any>('/dashboard/settings/profile');
    return response.data;
  },

  updateProfile: async (data: any): Promise<any> => {
    const response = await apiClient.patch<any>('/dashboard/settings/profile', data);
    // Backend returns { message, profile }
    if (response.data.profile) {
      // Update localStorage with new profile data
      if (typeof window !== 'undefined') {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response.data.profile;
    }
    return response.data;
  },

  updateSecurity: async (data: any): Promise<any> => {
    const response = await apiClient.patch<any>('/dashboard/settings/security', data);
    // Backend returns { message, user } or { message, settings }
    if (response.data.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data.user;
    }
    return response.data;
  },

  // Get security status
  getSecurityStatus: async (): Promise<any> => {
    const response = await apiClient.get<any>('/dashboard/settings/security/status');
    return response.data;
  },

  // Get active sessions
  getSessions: async (): Promise<any[]> => {
    try {
      // Try primary endpoint first
      let response = await apiClient.get<any>('/dashboard/settings/security/sessions');
      console.log('Sessions API response (security/sessions):', response.data);
      
      // Backend returns { sessions: [...] }
      if (response.data && Array.isArray(response.data.sessions)) {
        return response.data.sessions;
      }
      
      // Fallback if response is directly an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      console.warn('Unexpected sessions response format:', response.data);
      return [];
    } catch (error: any) {
      console.error('Failed to fetch sessions from primary endpoint:', error);
      
      // Try alias endpoint as fallback
      try {
        const response = await apiClient.get<any>('/dashboard/settings/sessions');
        console.log('Sessions API response (settings/sessions):', response.data);
        
        if (response.data && Array.isArray(response.data.sessions)) {
          return response.data.sessions;
        }
        
        if (Array.isArray(response.data)) {
          return response.data;
        }
        
        return [];
      } catch (fallbackError) {
        console.error('Failed to fetch sessions from fallback endpoint:', fallbackError);
        return [];
      }
    }
  },

  // Revoke session
  revokeSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/dashboard/settings/security/sessions/${sessionId}`);
  },

  updateNotifications: async (data: any): Promise<any> => {
    const response = await apiClient.patch<any>('/dashboard/settings/notifications', data);
    // Backend returns { message, settings } or { message, user }
    if (response.data.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data.user;
    }
    return response.data;
  },

  // Get alert settings
  getAlertSettings: async (): Promise<any> => {
    const response = await apiClient.get<any>('/dashboard/settings/alerts');
    return response.data;
  },

  // Update alert settings
  updateAlertSettings: async (data: any): Promise<any> => {
    const response = await apiClient.patch<any>('/dashboard/settings/alerts', data);
    return response.data;
  },

  // Get billing settings
  getBillingSettings: async (): Promise<any> => {
    const response = await apiClient.get<any>('/dashboard/settings/billing');
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (data: any): Promise<any> => {
    const response = await apiClient.post<any>('/dashboard/settings/billing/payment-methods', data);
    return response.data;
  },

  // Remove payment method
  removePaymentMethod: async (methodId: number): Promise<void> => {
    await apiClient.delete(`/dashboard/settings/billing/payment-methods/${methodId}`);
  },

  // Set primary payment method
  setPrimaryPaymentMethod: async (methodId: number): Promise<any> => {
    const response = await apiClient.patch<any>(`/dashboard/settings/billing/payment-methods/${methodId}/primary`);
    return response.data;
  },

  // Update tax information
  updateTaxInfo: async (data: any): Promise<any> => {
    const response = await apiClient.patch<any>('/dashboard/settings/billing/tax', data);
    return response.data;
  },

  // Social Links
  getSocialLinks: async (): Promise<any> => {
    const response = await apiClient.get<any>('/dashboard/settings/social');
    return response.data;
  },

  updateSocialLinks: async (data: any): Promise<any> => {
    const response = await apiClient.patch<any>('/dashboard/settings/social', data);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/dashboard/settings/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};
