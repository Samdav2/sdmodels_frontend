import { useState, useEffect } from 'react';
import { api } from '../index';
import { Model } from '../types';

interface UseModelsOptions {
  featured?: boolean;
  category?: string;
  limit?: number;
  page?: number;
  sort?: 'newest' | 'popular' | 'price_low' | 'price_high';
  search?: string;
}

export function useModels(options: UseModelsOptions = {}) {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build filters for API call
        const filters: any = {
          page: options.page || 1,
          limit: options.limit || 20,
        };
        
        if (options.category) filters.category = options.category;
        if (options.search) filters.search = options.search;
        if (options.sort) filters.sort = options.sort;
        if (options.featured !== undefined) filters.is_featured = options.featured;
        
        // Make actual API call
        const data = await api.models.getModels(filters);
        
        setModels(data.items || []);
        setTotal(data.total || 0);
        setPages(data.pages || 0);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch models');
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [JSON.stringify(options)]);

  return { models, loading, error, total, pages };
}
