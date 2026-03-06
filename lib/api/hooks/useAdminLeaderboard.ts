import { useState, useEffect } from 'react';
import { api } from '../index';

export function useAdminLeaderboard(period = 'all_time') {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchLeaderboard = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getLeaderboard();
      setLeaderboard(data.leaderboard || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leaderboard');
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await api.admin.getLeaderboardSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings');
    }
  };

  const updateSettings = async (newSettings: any) => {
    try {
      await api.admin.updateLeaderboardSettings(newSettings);
      await fetchSettings();
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    }
  };

  const adjustUserPoints = async (userId: number, points: number, reason?: string) => {
    try {
      await api.admin.adjustUserPoints(userId, points, reason);
      await fetchLeaderboard();
    } catch (err: any) {
      setError(err.message || 'Failed to adjust points');
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchSettings();
  }, [period]);

  return { 
    leaderboard, 
    settings,
    loading, 
    error, 
    total,
    updateSettings,
    adjustUserPoints,
    refetch: fetchLeaderboard 
  };
}
