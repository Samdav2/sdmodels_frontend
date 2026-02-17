import { useState, useEffect } from 'react';
import { api } from '../index';
import { Collection } from '../types';

export function useCollection(id: string | number) {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.collections.getCollection(Number(id));
        setCollection(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch collection');
        setCollection(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCollection();
    }
  }, [id]);

  return { collection, loading, error };
}
