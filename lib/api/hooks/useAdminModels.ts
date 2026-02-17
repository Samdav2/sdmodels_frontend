import { useState, useEffect } from 'react';
import { api } from '../index';
import { Model } from '../types';

export function useAdminModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getPendingModels(1, 100);
      setModels(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending models');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const approveModel = async (modelId: number) => {
    try {
      await api.admin.approveModel(modelId);
      await fetchModels(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to approve model');
    }
  };

  const rejectModel = async (modelId: number, reason?: string) => {
    try {
      await api.admin.rejectModel(modelId, reason);
      await fetchModels(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to reject model');
    }
  };

  return { models, loading, error, approveModel, rejectModel, refetch: fetchModels };
}
