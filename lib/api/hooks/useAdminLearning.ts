import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminLearning() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getLearning();
      setTutorials(data.items || data || []);
    } catch (err: any) {
      console.error('Failed to fetch tutorials:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch tutorials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const deleteTutorial = async (id: number) => {
    try {
      await adminApi.deleteTutorial(id);
      await fetchTutorials();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete tutorial');
      throw err;
    }
  };

  const togglePublish = async (id: number) => {
    try {
      // Toggle the published status locally first for optimistic update
      setTutorials(prev => prev.map(t => 
        t.id === id ? { ...t, published: !t.published } : t
      ));
      // In a real implementation, this would call an API endpoint
      // await adminApi.toggleTutorialPublish(id);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to toggle publish status');
      // Revert on error
      await fetchTutorials();
      throw err;
    }
  };

  return { tutorials, loading, error, deleteTutorial, togglePublish, refetch: fetchTutorials };
}
