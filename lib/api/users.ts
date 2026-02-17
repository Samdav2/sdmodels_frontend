/**
 * Users API functions
 */

import apiClient from './client';
import { User, PaginatedResponse, ApiResponse } from './types';

export interface UpdateProfileData {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

export const usersApi = {
  // Get my profile
  getMyProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  // Update my profile
  updateMyProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await apiClient.put<User>('/users/me', data);
    return response.data;
  },

  // Get user profile by ID
  getUserProfile: async (userId: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },

  // Follow user
  followUser: async (userId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/users/${userId}/follow`);
    return response.data;
  },

  // Unfollow user
  unfollowUser: async (userId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${userId}/follow`);
    return response.data;
  },

  // Get user followers
  getFollowers: async (userId: number, page = 1, limit = 20): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(`/users/${userId}/followers`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get user following
  getFollowing: async (userId: number, page = 1, limit = 20): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(`/users/${userId}/following`, {
      params: { page, limit },
    });
    return response.data;
  },
};
