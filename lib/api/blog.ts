/**
 * Blog API functions
 */

import apiClient from './client';
import { BlogPost, PaginatedResponse, Comment, ApiResponse } from './types';

export interface BlogFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const blogApi = {
  // Get all blog posts
  getPosts: async (filters: BlogFilters = {}): Promise<PaginatedResponse<BlogPost>> => {
    const response = await apiClient.get<PaginatedResponse<BlogPost>>('/blog/posts', {
      params: filters,
    });
    return response.data;
  },

  // Get blog categories
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/blog/categories');
    return response.data;
  },

  // Get featured posts
  getFeaturedPosts: async (): Promise<BlogPost[]> => {
    const response = await apiClient.get<BlogPost[]>('/blog/featured');
    return response.data;
  },

  // Get post by ID
  getPost: async (id: number): Promise<BlogPost> => {
    const response = await apiClient.get<BlogPost>(`/blog/posts/${id}`);
    return response.data;
  },

  // Like post
  likePost: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/blog/posts/${id}/like`);
    return response.data;
  },

  // Unlike post
  unlikePost: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/blog/posts/${id}/like`);
    return response.data;
  },

  // Add comment
  addComment: async (id: number, content: string, parentId?: number): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/blog/posts/${id}/comments`, {
      content,
      parent_id: parentId,
    });
    return response.data;
  },

  // Get comments
  getComments: async (id: number, page = 1, limit = 50): Promise<PaginatedResponse<Comment>> => {
    const response = await apiClient.get<PaginatedResponse<Comment>>(`/blog/posts/${id}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Share post
  sharePost: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/blog/posts/${id}/share`);
    return response.data;
  },
};
