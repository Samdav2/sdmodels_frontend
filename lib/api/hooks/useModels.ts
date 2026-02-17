/**
 * Models hooks
 */

import { useState, useEffect } from 'react';
import { modelsApi, ModelFilters } from '../models';
import { Model, PaginatedResponse } from '../types';

export const useModels = (filters: ModelFilters = {}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  });

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await modelsApi.getModels(filters);
        setModels(response.items);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          pages: response.pages,
        });
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [JSON.stringify(filters)]);

  return {
    models,
    loading,
    error,
    pagination,
  };
};

export const useModel = (id: number) => {
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await modelsApi.getModel(id);
        setModel(data);
        
        // Increment view count
        await modelsApi.incrementView(id);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch model');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchModel();
    }
  }, [id]);

  return {
    model,
    loading,
    error,
  };
};
