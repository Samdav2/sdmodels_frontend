import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getSettings();
        
        // Settings already initialized with defaults
      } catch (err: any) {
        setError(err.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    try {
      // TODO: Call API
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
      return false;
    }
  };

  return { general, security, notifications, loading, error, setGeneral, setSecurity, setNotifications, saveSettings };
}
