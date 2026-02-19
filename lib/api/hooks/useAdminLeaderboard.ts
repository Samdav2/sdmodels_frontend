import { useState, useEffect } from 'react';
import { adminApi } from '../admin';

export function useAdminLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [seasonSettings, setSeasonSettings] = useState({
    name: "Season 1: Genesis",
    endDate: "2024-12-31",
    pointsPerUpload: 100,
    pointsPerSale: 50,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [leaderboardData, settingsData] = await Promise.all([
        adminApi.getLeaderboard(),
        adminApi.getLeaderboardSettings(),
      ]);
      
      setLeaderboard(leaderboardData.users || leaderboardData || []);
      
      if (settingsData) {
        setSeasonSettings({
          name: settingsData.season_name || "Season 1: Genesis",
          endDate: settingsData.season_end_date || "2024-12-31",
          pointsPerUpload: settingsData.points_per_upload || 100,
          pointsPerSale: settingsData.points_per_sale || 50,
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch leaderboard:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const adjustPoints = async (userId: number, points: number, reason?: string) => {
    try {
      await adminApi.adjustUserPoints(userId, points, reason);
      await fetchLeaderboard(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to adjust points');
      throw err;
    }
  };

  const resetPoints = async (userId: number) => {
    try {
      await adminApi.resetUserPoints(userId);
      await fetchLeaderboard(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to reset points');
      throw err;
    }
  };

  const saveSettings = async () => {
    try {
      await adminApi.updateLeaderboardSettings({
        season_name: seasonSettings.name,
        season_end_date: seasonSettings.endDate,
        points_per_upload: seasonSettings.pointsPerUpload,
        points_per_sale: seasonSettings.pointsPerSale,
      });
      await fetchLeaderboard(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to save settings');
      throw err;
    }
  };

  const startNewSeason = async (seasonName: string, endDate: string) => {
    try {
      await adminApi.startNewSeason(seasonName, endDate);
      await fetchLeaderboard(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to start new season');
      throw err;
    }
  };

  return { 
    leaderboard, 
    seasonSettings, 
    loading, 
    error, 
    adjustPoints,
    resetPoints,
    saveSettings,
    startNewSeason,
    setLeaderboard, 
    setSeasonSettings,
    refetch: fetchLeaderboard,
  };
}
