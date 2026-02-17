import { useState, useEffect } from 'react';
import { api } from '../index';
import { Collection } from '../types';

interface UseCollectionsOptions {
  limit?: number;
  page?: number;
}

export function useCollections(options: UseCollectionsOptions = {}) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.collections.getCollections(options);
        setCollections(data.items || []);
        setTotal(data.total || 0);
        setPages(data.pages || 0);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch collections');
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [JSON.stringify(options)]);

  return { collections, loading, error, total, pages };
}
