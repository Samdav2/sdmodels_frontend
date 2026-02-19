import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminSlider() {
  const [sliderSlots, setSliderSlots] = useState<any[]>([]);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlider = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getSlider();
      setSliderSlots(data.slots || data || []);
      setAvailableModels(data.availableModels || []);
    } catch (err: any) {
      console.error('Failed to fetch slider:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch slider settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlider();
  }, []);

  const updateSlider = async (slots: any[]) => {
    try {
      await adminApi.updateSlider(slots);
      await fetchSlider();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update slider');
      throw err;
    }
  };

  return { sliderSlots, availableModels, loading, error, updateSlider, setSliderSlots, refetch: fetchSlider };
}
