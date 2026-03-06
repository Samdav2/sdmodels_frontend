import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminSlider() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlider = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getSlider();
      setSlides(data.slides || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch slider');
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSlider = async (newSlides: any[]) => {
    try {
      await api.admin.updateSlider(newSlides);
      await fetchSlider();
    } catch (err: any) {
      setError(err.message || 'Failed to update slider');
    }
  };

  useEffect(() => {
    fetchSlider();
  }, []);

  return { 
    slides, 
    loading, 
    error, 
    updateSlider,
    refetch: fetchSlider 
  };
}
