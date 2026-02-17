import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    platformFees: 0,
    activeUsers: 0,
    pendingModels: 0,
    totalModels: 0,
    serverLoad: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.admin.getStats();
        setStats({
          totalRevenue: data.total_revenue,
          platformFees: data.platform_fees,
          activeUsers: data.active_users,
          pendingModels: data.pending_models,
          totalModels: data.total_models,
          serverLoad: data.server_load,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error };
}
