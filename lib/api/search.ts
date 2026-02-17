/**
 * Search API functions
 */

import apiClient from './client';
import { PaginatedResponse } from './types';

export interface SearchFilters {
  q: string;
  type?: 'models' | 'users' | 'communities' | 'courses';
  page?: number;
  limit?: number;
}

export const searchApi = {
  // Global search
  search: async (filters: SearchFilters): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>('/search', {
      params: filters,
    });
    return response.data;
  },
};
