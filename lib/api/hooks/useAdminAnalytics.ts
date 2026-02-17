import { useState, useEffect } from 'react';

export function useAdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    topModels: [] as Array<{ name: string; sales: number; revenue: number }>,
    topCreators: [] as Array<{ name: string; models: number; revenue: number }>,
    trafficData: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getAnalytics();
        
        // Mock data for now
        setAnalytics({
          topModels: [
            { name: "Cyberpunk Mech", sales: 145, revenue: 21750 },
            { name: "Dragon Animated", sales: 98, revenue: 14700 },
            { name: "Sci-Fi Vehicle", sales: 87, revenue: 13050 },
          ],
          topCreators: [
            { name: "PixelForge", models: 45, revenue: 67500 },
            { name: "3D_Wizard", models: 32, revenue: 48000 },
            { name: "MeshMaster", models: 28, revenue: 42000 },
          ],
          trafficData: null,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { analytics, loading, error };
}
