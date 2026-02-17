/**
 * Models API functions
 */

import apiClient from './client';
import { Model, PaginatedResponse, Comment, ApiResponse } from './types';

export interface ModelFilters {
  page?: number;
  limit?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  is_free?: boolean;
  search?: string;
  sort?: 'newest' | 'popular' | 'price_low' | 'price_high';
}

export interface CreateModelData {
  title: string;
  description: string;
  price: number;
  is_free: boolean;
  category: string;
  tags: string[];
  file_url: string;
  thumbnail_url: string;
  preview_images: string[];
  file_size: number;
  file_formats: string[];
  poly_count: number;
  vertex_count: number;
  texture_resolution?: string;
  has_animations: boolean;
  has_rigging: boolean;
  has_materials: boolean;
  has_textures: boolean;
}

export const modelsApi = {
  // Get all models with filters
  getModels: async (filters: ModelFilters = {}): Promise<PaginatedResponse<Model>> => {
    const response = await apiClient.get<PaginatedResponse<Model>>('/models', { params: filters });
    return response.data;
  },

  // Get model by ID
  getModel: async (id: number): Promise<Model> => {
    const response = await apiClient.get<Model>(`/models/${id}`);
    return response.data;
  },

  // Create model
  createModel: async (data: CreateModelData): Promise<Model> => {
    const response = await apiClient.post<Model>('/models', data);
    return response.data;
  },

  // Update model
  updateModel: async (id: number, data: Partial<CreateModelData>): Promise<Model> => {
    const response = await apiClient.put<Model>(`/models/${id}`, data);
    return response.data;
  },

  // Delete model
  deleteModel: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/models/${id}`);
    return response.data;
  },

  // Like model
  likeModel: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/models/${id}/like`);
    return response.data;
  },

  // Unlike model
  unlikeModel: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/models/${id}/like`);
    return response.data;
  },

  // Add comment
  addComment: async (id: number, content: string, parentId?: number): Promise<Comment> => {
    const response = await apiClient.post<Comment>(`/models/${id}/comments`, {
      content,
      parent_id: parentId,
    });
    return response.data;
  },

  // Get comments
  getComments: async (id: number, page = 1, limit = 50): Promise<PaginatedResponse<Comment>> => {
    const response = await apiClient.get<PaginatedResponse<Comment>>(`/models/${id}/comments`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Increment view count
  incrementView: async (id: number): Promise<void> => {
    await apiClient.post(`/models/${id}/view`);
  },
};
