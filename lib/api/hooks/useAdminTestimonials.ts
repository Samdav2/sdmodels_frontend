import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getTestimonials();
      setTestimonials(data.items || data || []);
    } catch (err: any) {
      console.error('Failed to fetch testimonials:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const deleteTestimonial = async (id: number) => {
    try {
      await adminApi.deleteTestimonial(id);
      await fetchTestimonials();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to delete testimonial');
      throw err;
    }
  };

  const toggleFeatured = async (id: number) => {
    try {
      // Toggle the featured status locally first for optimistic update
      setTestimonials(prev => prev.map(t => 
        t.id === id ? { ...t, featured: !t.featured } : t
      ));
      // In a real implementation, this would call an API endpoint
      // await adminApi.toggleTestimonialFeatured(id);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to toggle featured status');
      // Revert on error
      await fetchTestimonials();
      throw err;
    }
  };

  return { testimonials, loading, error, deleteTestimonial, toggleFeatured, refetch: fetchTestimonials };
}
