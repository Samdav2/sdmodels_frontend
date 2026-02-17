import { useState, useEffect } from 'react';

export function useAdminLearning() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getTutorials();
        
        // Mock data for now
        setTutorials([
          { id: 1, title: "Getting Started with 3D Modeling", category: "Beginner", views: 2340, published: true },
          { id: 2, title: "Advanced Rigging Techniques", category: "Advanced", views: 1560, published: true },
          { id: 3, title: "PBR Texturing Masterclass", category: "Intermediate", views: 890, published: false },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tutorials');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  const togglePublish = async (id: number) => {
    try {
      // TODO: Call API
      setTutorials(prev => prev.map(t => t.id === id ? { ...t, published: !t.published } : t));
    } catch (err: any) {
      setError(err.message || 'Failed to toggle publish');
    }
  };

  const deleteTutorial = async (id: number) => {
    try {
      // TODO: Call API
      setTutorials(prev => prev.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete tutorial');
    }
  };

  return { tutorials, loading, error, togglePublish, deleteTutorial };
}
