import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminTestimonials(status?: string) {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchTestimonials = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getTestimonials(page, limit);
      setTestimonials(data.testimonials || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const approveTestimonial = async (id: number) => {
    try {
      await api.admin.approveTestimonial(id);
      await fetchTestimonials();
    } catch (err: any) {
      setError(err.message || 'Failed to approve testimonial');
    }
  };

  const deleteTestimonial = async (id: number) => {
    try {
      await api.admin.deleteTestimonial(id);
      await fetchTestimonials();
    } catch (err: any) {
      setError(err.message || 'Failed to delete testimonial');
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [status]);

  return { 
    testimonials, 
    loading, 
    error, 
    total,
    approveTestimonial, 
    deleteTestimonial,
    refetch: fetchTestimonials 
  };
}
