import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getHomepageSettings();
        
        // Mock data for now
        setHomepage({
          heroTitle: "High-End Web Cinematic 3D Models",
          heroSubtitle: "Premium 3D assets for game developers, animators, and digital artists",
          featuredCategories: [
            { id: 1, name: "Characters", icon: "🤖", enabled: true },
            { id: 2, name: "Vehicles", icon: "🚗", enabled: true },
            { id: 3, name: "Environments", icon: "🏰", enabled: true },
            { id: 4, name: "Weapons", icon: "⚔️", enabled: true },
          ],
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
      } catch (err: any) {
        setError(err.message || 'Failed to fetch homepage settings');
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  const updateHomepage = async (data: any) => {
    try {
      // TODO: Call API
      setHomepage(data);
    } catch (err: any) {
      setError(err.message || 'Failed to update homepage');
    }
  };

  return { homepage, loading, error, updateHomepage };
}
