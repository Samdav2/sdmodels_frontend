import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        // const response = await api.admin.getLeaderboard();
        
        // Mock data for now
        setLeaderboard([
          { rank: 1, name: "PixelForge", points: 15420, badge: "🥇", verified: true },
          { rank: 2, name: "3D_Wizard", points: 12890, badge: "🥈", verified: true },
          { rank: 3, name: "MeshMaster", points: 10560, badge: "🥉", verified: true },
          { rank: 4, name: "PolyPro", points: 8340, badge: "", verified: false },
        ]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const adjustPoints = async (rank: number, points: number) => {
    try {
      // TODO: Call API
      setLeaderboard(prev => prev.map(u => u.rank === rank ? { ...u, points } : u));
    } catch (err: any) {
      setError(err.message || 'Failed to adjust points');
    }
  };

  return { leaderboard, seasonSettings, loading, error, adjustPoints, setLeaderboard, setSeasonSettings };
}
