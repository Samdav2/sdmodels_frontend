import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    topModels: [] as Array<{ name: string; sales: number; revenue: number }>,
    topCreators: [] as Array<{ name: string; models: number; revenue: number }>,
    trafficData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAnalytics();
      
      setAnalytics({
        topModels: data.topModels || [],
        topCreators: data.topCreators || [],
        trafficData: data.trafficData || null,
      });
    } catch (err: any) {
      console.error('Failed to fetch analytics:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, error, refetch: fetchAnalytics };
}
