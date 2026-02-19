import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminHomepage() {
  const [homepage, setHomepage] = useState({
    heroTitle: "High-End Web Cinematic 3D Models",
    heroSubtitle: "Premium 3D assets for game developers, animators, and digital artists",
    featuredCategories: [] as Array<{ id: number; name: string; icon: string; enabled: boolean }>,
    stats: {
      totalModels: 1834,
      activeCreators: 247,
      downloadsToday: 1523,
    },
    ctas: {
      primaryText: "Browse Models",
      primaryLink: "/marketplace",
      secondaryText: "Start Selling",
      secondaryLink: "/upload",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepage = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getHomepage();
      setHomepage(data || homepage);
    } catch (err: any) {
      console.error('Failed to fetch homepage:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch homepage settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepage();
  }, []);

  const updateHomepage = async (data: any) => {
    try {
      await adminApi.updateHomepage(data);
      setHomepage(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update homepage');
      throw err;
    }
  };

  return { homepage, loading, error, updateHomepage, setHomepage, refetch: fetchHomepage };
}
