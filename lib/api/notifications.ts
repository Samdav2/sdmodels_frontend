/**
 * Notifications API functions
 */

import apiClient from './client';
import { Notification, PaginatedResponse, ApiResponse } from './types';

export const notificationsApi = {
  // Get notifications
  getNotifications: async (page = 1, limit = 20, filter = 'all'): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get<PaginatedResponse<Notification>>('/notifications', {
      params: { page, limit, filter },
    });
    return response.data;
  },

  // Mark as read
  markAsRead: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/notifications/${id}`);
    return response.data;
  },
};
