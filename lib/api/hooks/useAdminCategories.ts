import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getCategories();
      setCategories(data.categories || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (name: string, description?: string) => {
    try {
      await api.admin.createCategory(name, description);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    }
  };

  const updateCategory = async (id: number, name: string, description?: string) => {
    try {
      await api.admin.updateCategory(id, name, description);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to update category');
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await api.admin.deleteCategory(id);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { 
    categories, 
    loading, 
    error, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    refetch: fetchCategories 
  };
}
