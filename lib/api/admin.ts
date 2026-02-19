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

  // Bounty Management (updated to use /admin/bounties/* endpoints)
  getBounties: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<any> => {
    const response = await apiClient.get('/admin/bounties', { params });
    return response.data;
  },

  getBountyDetails: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/admin/bounties/${id}`);
    return response.data;
  },

  updateBountyStatus: async (id: number, status: string): Promise<any> => {
    const response = await apiClient.put(`/admin/bounties/${id}/status`, { status });
    return response.data;
  },

  forceCloseBounty: async (id: number, reason: string): Promise<any> => {
    const response = await apiClient.post(`/admin/bounties/${id}/force-close`, { reason });
    return response.data;
  },

  resolveBountyDispute: async (id: number, resolution: {
    winner: 'buyer' | 'artist';
    refund_percentage?: number;
    notes: string;
  }): Promise<any> => {
    const response = await apiClient.post(`/admin/bounties/${id}/resolve-dispute`, resolution);
    return response.data;
  },

  getBountyDisputes: async (): Promise<any> => {
    const response = await apiClient.get('/admin/bounties/disputes');
    return response.data;
  },

  getBountyStats: async (): Promise<any> => {
    const response = await apiClient.get('/admin/bounties/stats');
    return response.data;
  },

  approveBountyPayout: async (id: number): Promise<any> => {
    const response = await apiClient.post(`/admin/bounties/${id}/approve-payout`);
    return response.data;
  },

  refundBounty: async (id: number, reason: string): Promise<any> => {
    const response = await apiClient.post(`/admin/bounties/${id}/refund`, { reason });
    return response.data;
  },

  banUserFromBounties: async (userId: number, reason: string, duration?: number): Promise<any> => {
    const response = await apiClient.post('/admin/bounties/ban-user', { 
      user_id: userId, 
      reason,
      duration_days: duration 
    });
    return response.data;
  },

  getBountyTransactions: async (bountyId: number): Promise<any> => {
    const response = await apiClient.get(`/admin/bounties/${bountyId}/transactions`);
    return response.data;
  },

  updateBountySettings: async (settings: {
    min_bounty_amount?: number;
    max_bounty_amount?: number;
    platform_fee_percentage?: number;
    escrow_hold_days?: number;
    auto_approve_after_days?: number;
  }): Promise<any> => {
    const response = await apiClient.put('/admin/bounties/settings', settings);
    return response.data;
  },

  getBountySettings: async (): Promise<any> => {
    const response = await apiClient.get('/admin/bounties/settings');
    return response.data;
  },

  // Leaderboard Management
  getLeaderboard: async (): Promise<any> => {
    const response = await apiClient.get('/admin/leaderboard');
    return response.data;
  },

  getLeaderboardSettings: async (): Promise<any> => {
    const response = await apiClient.get('/admin/leaderboard/settings');
    return response.data;
  },

  updateLeaderboardSettings: async (settings: {
    season_name?: string;
    season_end_date?: string;
    points_per_upload?: number;
    points_per_sale?: number;
  }): Promise<any> => {
    const response = await apiClient.put('/admin/leaderboard/settings', settings);
    return response.data;
  },

  adjustUserPoints: async (userId: number, points: number, reason?: string): Promise<any> => {
    const response = await apiClient.post(`/admin/leaderboard/users/${userId}/adjust-points`, {
      points,
      reason,
    });
    return response.data;
  },

  resetUserPoints: async (userId: number): Promise<any> => {
    const response = await apiClient.post(`/admin/leaderboard/users/${userId}/reset-points`);
    return response.data;
  },

  startNewSeason: async (seasonName: string, endDate: string): Promise<any> => {
    const response = await apiClient.post('/admin/leaderboard/new-season', {
      season_name: seasonName,
      season_end_date: endDate,
    });
    return response.data;
  },

  // Settings Management
  getSettings: async (): Promise<any> => {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  },

  updateSettings: async (settings: any): Promise<any> => {
    const response = await apiClient.put('/admin/settings', settings);
    return response.data;
  },

  // Analytics
  getAnalytics: async (): Promise<any> => {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  },

  // Content Management
  getContent: async (page?: number, limit?: number): Promise<any> => {
    const response = await apiClient.get('/admin/content', { params: { page, limit } });
    return response.data;
  },

  publishContent: async (title: string, content: string, type?: string): Promise<any> => {
    const response = await apiClient.post('/admin/content', { title, content, type });
    return response.data;
  },

  deleteContent: async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/admin/content/${id}`);
    return response.data;
  },

  // Revenue Management
  getRevenue: async (): Promise<any> => {
    const response = await apiClient.get('/admin/revenue');
    return response.data;
  },

  getTransactions: async (page?: number, limit?: number): Promise<any> => {
    const response = await apiClient.get('/admin/revenue/transactions', { params: { page, limit } });
    return response.data;
  },

  // Categories Management
  getCategories: async (): Promise<any> => {
    const response = await apiClient.get('/admin/categories');
    return response.data;
  },

  createCategory: async (name: string, description?: string): Promise<any> => {
    const response = await apiClient.post('/admin/categories', { name, description });
    return response.data;
  },

  updateCategory: async (id: number, name: string, description?: string): Promise<any> => {
    const response = await apiClient.put(`/admin/categories/${id}`, { name, description });
    return response.data;
  },

  deleteCategory: async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Learning Management
  getLearning: async (page?: number, limit?: number): Promise<any> => {
    const response = await apiClient.get('/admin/learning', { params: { page, limit } });
    return response.data;
  },

  createTutorial: async (title: string, description: string, content: string): Promise<any> => {
    const response = await apiClient.post('/admin/learning', { title, description, content });
    return response.data;
  },

  deleteTutorial: async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/admin/learning/${id}`);
    return response.data;
  },

  // Testimonials Management
  getTestimonials: async (page?: number, limit?: number): Promise<any> => {
    const response = await apiClient.get('/admin/testimonials', { params: { page, limit } });
    return response.data;
  },

  approveTestimonial: async (id: number): Promise<any> => {
    const response = await apiClient.put(`/admin/testimonials/${id}/approve`);
    return response.data;
  },

  deleteTestimonial: async (id: number): Promise<any> => {
    const response = await apiClient.delete(`/admin/testimonials/${id}`);
    return response.data;
  },

  // Slider Management
  getSlider: async (): Promise<any> => {
    const response = await apiClient.get('/admin/slider');
    return response.data;
  },

  updateSlider: async (slots: any[]): Promise<any> => {
    const response = await apiClient.put('/admin/slider', { slots });
    return response.data;
  },

  // Homepage Management
  getHomepage: async (): Promise<any> => {
    const response = await apiClient.get('/admin/homepage');
    return response.data;
  },

  updateHomepage: async (config: any): Promise<any> => {
    const response = await apiClient.put('/admin/homepage', config);
    return response.data;
  },

  // Email Management
  getEmailTemplates: async (): Promise<any> => {
    const response = await apiClient.get('/admin/emails/templates');
    return response.data;
  },

  sendEmail: async (recipientType: string, subject: string, body: string): Promise<any> => {
    const response = await apiClient.post('/admin/emails/send', { recipientType, subject, body });
    return response.data;
  },

  updateEmailTemplate: async (id: number, subject: string, body: string): Promise<any> => {
    const response = await apiClient.put(`/admin/emails/templates/${id}`, { subject, body });
    return response.data;
  },
};
