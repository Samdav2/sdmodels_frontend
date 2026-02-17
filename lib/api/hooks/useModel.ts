import { useState, useEffect } from 'react';
import { api } from '../index';
import { Model } from '../types';

export function useModel(id: string | number) {
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.models.getModel(Number(id));
        setModel(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch model');
        setModel(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchModel();
    }
  }, [id]);

  return { model, loading, error };
}
