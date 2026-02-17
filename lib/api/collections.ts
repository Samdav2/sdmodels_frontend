/**
 * Collections API functions
 */

import apiClient from './client';
import { Collection, Model, PaginatedResponse, ApiResponse } from './types';

export interface CollectionFilters {
  user_id?: number;
  page?: number;
  limit?: number;
}

export interface CreateCollectionData {
  name: string;
  description?: string;
  is_public: boolean;
}

export const collectionsApi = {
  // List collections
  getCollections: async (filters: CollectionFilters = {}): Promise<PaginatedResponse<Collection>> => {
    const response = await apiClient.get<PaginatedResponse<Collection>>('/collections', {
      params: filters,
    });
    return response.data;
  },

  // Get collection details
  getCollection: async (id: number): Promise<Collection> => {
    const response = await apiClient.get<Collection>(`/collections/${id}`);
    return response.data;
  },

  // Create collection
  createCollection: async (data: CreateCollectionData): Promise<Collection> => {
    const response = await apiClient.post<Collection>('/collections', data);
    return response.data;
  },

  // Update collection
  updateCollection: async (id: number, data: Partial<CreateCollectionData>): Promise<Collection> => {
    const response = await apiClient.put<Collection>(`/collections/${id}`, data);
    return response.data;
  },

  // Delete collection
  deleteCollection: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/collections/${id}`);
    return response.data;
  },

  // Follow collection
  followCollection: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/collections/${id}/follow`);
    return response.data;
  },

  // Get collection models
  getCollectionModels: async (id: number, page = 1, limit = 20): Promise<PaginatedResponse<Model>> => {
    const response = await apiClient.get<PaginatedResponse<Model>>(`/collections/${id}/models`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Add model to collection
  addModel: async (collectionId: number, modelId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/collections/${collectionId}/add-model`, {
      model_id: modelId,
    });
    return response.data;
  },

  // Remove model from collection
  removeModel: async (collectionId: number, modelId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/collections/${collectionId}/remove-model/${modelId}`
    );
    return response.data;
  },
};
