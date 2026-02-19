import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getCategories();
      setCategories(data.items || data || []);
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleEnabled = async (id: number) => {
    try {
      const category = categories.find(c => c.id === id);
      if (category) {
        await adminApi.updateCategory(id, category.name, category.description);
        await fetchCategories();
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to toggle category');
      throw err;
    }
  };

  return { categories, loading, error, toggleEnabled, refetch: fetchCategories };
}
