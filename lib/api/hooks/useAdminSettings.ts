import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminSettings() {
  const [general, setGeneral] = useState({
    platformName: "SDModels",
    platformFee: 7.5,
    maintenanceMode: false,
  });
  const [security, setSecurity] = useState({
    require2FA: true,
    apiRateLimit: 100,
  });
  const [notifications, setNotifications] = useState({
    newModels: true,
    userRegistrations: true,
    payments: true,
    securityAlerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getSettings();
      
      if (data.general) setGeneral(data.general);
      if (data.security) setSecurity(data.security);
      if (data.notifications) setNotifications(data.notifications);
    } catch (err: any) {
      console.error('Failed to fetch settings:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await adminApi.updateSettings({ general, security, notifications });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save settings');
      return false;
    }
  };

  return { 
    general, 
    security, 
    notifications, 
    loading, 
    error, 
    setGeneral, 
    setSecurity, 
    setNotifications, 
    saveSettings,
    refetch: fetchSettings,
  };
}
