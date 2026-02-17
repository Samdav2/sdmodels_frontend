import { useState, useEffect } from 'react';

export function useAdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getCategories();
        
        // Mock data for now
        setCategories([
          { id: 1, name: "Characters", icon: "🤖", count: 456, enabled: true },
          { id: 2, name: "Vehicles", icon: "🚗", count: 234, enabled: true },
          { id: 3, name: "Environments", icon: "🏰", count: 189, enabled: true },
          { id: 4, name: "Weapons", icon: "⚔️", count: 167, enabled: true },
          { id: 5, name: "Props", icon: "📦", count: 345, enabled: true },
          { id: 6, name: "UI Elements", icon: "🎮", count: 123, enabled: false },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleEnabled = async (id: number) => {
    try {
      // TODO: Call API
      setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, enabled: !cat.enabled } : cat));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle category');
    }
  };

  return { categories, loading, error, toggleEnabled };
}
