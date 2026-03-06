"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminLeaderboard } from "@/lib/api/hooks/useAdminLeaderboard";
import { useAdminModal } from "@/components/admin/AdminModal";

export default function LeaderboardManagementPage() {
  const { 
    leaderboard, 
    settings, 
    loading, 
    error, 
    adjustUserPoints,
    updateSettings,
    refetch 
  } = useAdminLeaderboard();
  
  const { showAlert, showConfirm, showPrompt, AdminModalComponent } = useAdminModal();
  const [processing, setProcessing] = useState(false);
  const [seasonSettings, setSeasonSettings] = useState({
    name: "",
    end_date: "",
    points_per_upload: 10,
    points_per_sale: 50,
  });

  // Update local state when settings load
  useState(() => {
    if (settings) {
      setSeasonSettings({
        name: settings.season_name || "",
        end_date: settings.season_end_date || "",
        points_per_upload: settings.points_per_upload || 10,
        points_per_sale: settings.points_per_sale || 50,
      });
    }
  });

  const handleAdjustPoints = async (userId: number, username: string) => {
    const points = await showPrompt(
      "Adjust Points",
      `Enter new points for ${username}:`,
      "",
      "info"
    );
    
    if (points && !isNaN(parseInt(points))) {
      try {
        setProcessing(true);
        await adjustUserPoints(userId, parseInt(points), "Manual adjustment by admin");
        await showAlert("Success", "Points adjusted successfully!", "success");
        await refetch();
      } catch (err) {
        await showAlert("Error", "Failed to adjust points", "danger");
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleReset = async (userId: number, username: string) => {
    const confirmed = await showConfirm(
      "Reset Points",
      `Are you sure you want to reset ${username}'s points to 0?`,
      "danger"
    );
    
    if (confirmed) {
      try {
        setProcessing(true);
        await adjustUserPoints(userId, 0, "Reset by admin");
        await showAlert("Success", "Points reset successfully!", "success");
        await refetch();
      } catch (err) {
        await showAlert("Error", "Failed to reset points", "danger");
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      setProcessing(true);
      await updateSettings({
        season_name: seasonSettings.name,
        season_end_date: seasonSettings.end_date,
        points_per_upload: seasonSettings.points_per_upload,
        points_per_sale: seasonSettings.points_per_sale,
      });
      await showAlert("Success", "Settings saved successfully!", "success");
    } catch (err) {
      await showAlert("Error", "Failed to save settings", "danger");
    } finally {
      setProcessing(false);
    }
  };

  const handleStartNewSeason = async () => {
    const seasonName = await showPrompt(
      "Start New Season",
      "Enter new season name:",
      "",
      "info"
    );
    
    if (seasonName) {
      try {
        setProcessing(true);
        await updateSettings({
          season_name: seasonName,
          season_end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        await showAlert("Success", "New season started!", "success");
        await refetch();
      } catch (err) {
        await showAlert("Error", "Failed to start new season", "danger");
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout title="Leaderboard Management">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout title="Leaderboard Management">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Leaderboard</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout title="Leaderboard Management">
        {AdminModalComponent}
        
        {/* Current Rankings */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Current Rankings</h3>
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No leaderboard data available
              </div>
            ) : (
              leaderboard.map((user) => (
                <div key={user.id || user.rank} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{user.badge || `#${user.rank}`}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{user.name || user.username}</span>
                        {user.verified && <span className="text-green-400 text-sm">✓</span>}
                      </div>
                      <span className="text-gray-400 text-sm">{(user.points || 0).toLocaleString()} points</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAdjustPoints(user.id || user.rank, user.name || user.username)}
                      disabled={processing}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                    >
                      Adjust Points
                    </button>
                    <button 
                      onClick={() => handleReset(user.id || user.rank, user.name || user.username)}
                      disabled={processing}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Season Pass Settings */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Season Pass Configuration</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Current Season</label>
              <input
                type="text"
                value={seasonSettings.name}
                onChange={(e) => setSeasonSettings({ ...seasonSettings, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Season End Date</label>
              <input
                type="date"
                value={seasonSettings.end_date}
                onChange={(e) => setSeasonSettings({ ...seasonSettings, end_date: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Points per Upload</label>
              <input
                type="number"
                value={seasonSettings.points_per_upload}
                onChange={(e) => setSeasonSettings({ ...seasonSettings, points_per_upload: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Points per Sale</label>
              <input
                type="number"
                value={seasonSettings.points_per_sale}
                onChange={(e) => setSeasonSettings({ ...seasonSettings, points_per_sale: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={handleSaveSettings}
              disabled={processing}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold disabled:opacity-50"
            >
              💾 Save Settings
            </button>
            <button 
              onClick={handleStartNewSeason}
              disabled={processing}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition font-bold disabled:opacity-50"
            >
              🎮 Start New Season
            </button>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
