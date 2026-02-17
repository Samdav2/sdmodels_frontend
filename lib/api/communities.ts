/**
 * Communities API functions
 */

import apiClient from './client';
import { Community, CommunityPost, PaginatedResponse, Comment, ApiResponse } from './types';

export interface CommunityFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  status?: string;
}

export interface CreateCommunityData {
  name: string;
  description: string;
  icon: string;
  banner_gradient: string;
  category: string;
  is_private: boolean;
  require_approval: boolean;
  rules: string[];
}

export interface CreatePostData {
  content: string;
  image_url?: string;
  model_url?: string;
}

export const communitiesApi = {
  // List communities
  getCommunities: async (filters: CommunityFilters = {}): Promise<PaginatedResponse<Community>> => {
    const response = await apiClient.get<PaginatedResponse<Community>>('/communities', {
      params: filters,
    });
    return response.data;
  },

  // Get community details
  getCommunity: async (id: number): Promise<Community> => {
    const response = await apiClient.get<Community>(`/communities/${id}`);
    return response.data;
  },

  // Create community
  createCommunity: async (data: CreateCommunityData): Promise<Community> => {
    const response = await apiClient.post<Community>('/communities', data);
    return response.data;
  },

  // Update community
  updateCommunity: async (id: number, data: Partial<CreateCommunityData>): Promise<Community> => {
    const response = await apiClient.put<Community>(`/communities/${id}`, data);
    return response.data;
  },

  // Delete community
  deleteCommunity: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/communities/${id}`);
    return response.data;
  },

  // Join community
  joinCommunity: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/communities/${id}/join`);
    return response.data;
  },

  // Leave community
  leaveCommunity: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/communities/${id}/leave`);
    return response.data;
  },

  // Get members
  getMembers: async (id: number, page = 1, limit = 20): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(`/communities/${id}/members`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Create post
  createPost: async (communityId: number, data: CreatePostData): Promise<CommunityPost> => {
    const response = await apiClient.post<CommunityPost>(`/communities/${communityId}/posts`, data);
    return response.data;
  },

  // Get posts
  getPosts: async (communityId: number, filter = 'recent', page = 1, limit = 20): Promise<PaginatedResponse<CommunityPost>> => {
    const response = await apiClient.get<PaginatedResponse<CommunityPost>>(`/communities/${communityId}/posts`, {
      params: { filter, page, limit },
    });
    return response.data;
  },

  // Update post
  updatePost: async (postId: number, content: string): Promise<CommunityPost> => {
    const response = await apiClient.put<CommunityPost>(`/communities/posts/${postId}`, { content });
    return response.data;
  },

  // Delete post
  deletePost: async (postId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/communities/posts/${postId}`);
    return response.data;
  },

  // React to post
  reactToPost: async (postId: number, reactionType: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/communities/posts/${postId}/react`, {
      reaction_type: reactionType,
    });
    return response.data;
  },

  // Remove reaction
  removeReaction: async (postId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/communities/posts/${postId}/react`);
    return response.data;
  },

  // Add comment
  addComment: async (postId: number, content: string, parentId?: number): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/communities/posts/${postId}/comments`, {
      content,
      parent_id: parentId,
    });
    return response.data;
  },

  // Get comments
  getComments: async (postId: number, page = 1, limit = 50): Promise<PaginatedResponse<Comment>> => {
    const response = await apiClient.get<PaginatedResponse<Comment>>(`/communities/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },
};
