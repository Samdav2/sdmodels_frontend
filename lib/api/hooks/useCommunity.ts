import { useState, useEffect } from 'react';
import { api } from '../index';
import { Community } from '../types';

export function useCommunity(id: string | number) {
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.communities.getCommunity(Number(id));
        setCommunity(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch community');
        setCommunity(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCommunity();
    }
  }, [id]);

  return { community, loading, error };
}
