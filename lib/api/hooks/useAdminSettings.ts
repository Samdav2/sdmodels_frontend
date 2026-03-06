import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings');
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: any) => {
    try {
      await api.admin.updateSettings(newSettings);
      await fetchSettings();
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { 
    settings, 
    loading, 
    error, 
    updateSettings,
    refetch: fetchSettings 
  };
}
