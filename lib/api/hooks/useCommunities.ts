import { useState, useEffect } from 'react';
import { api } from '../index';
import { Community } from '../types';

interface UseCommunitiesOptions {
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
}

export function useCommunities(options: UseCommunitiesOptions = {}) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.communities.getCommunities(options);
        setCommunities(data.items || []);
        setTotal(data.total || 0);
        setPages(data.pages || 0);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch communities');
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [JSON.stringify(options)]);

  return { communities, loading, error, total, pages };
}
