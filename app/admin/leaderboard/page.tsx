"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminLeaderboard } from "@/lib/api/hooks/useAdminLeaderboard";

export default function LeaderboardManagementPage() {
  const { leaderboard, seasonSettings, loading, error, adjustPoints, setLeaderboard, setSeasonSettings } = useAdminLeaderboard();

  const handleAdjustPoints = async (rank: number) => {
    const points = prompt("Enter new points:");
    if (points) {
      await adjustPoints(rank, parseInt(points));
    }
  };

  const handleReset = (rank: number) => {
    if (confirm("Reset this user's points?")) {
      setLeaderboard(prev => prev.map(u => 
        u.rank === rank ? { ...u, points: 0 } : u
      ));
    }
  };

  if (loading) {
    return (<AdminLayout title="Leaderboard Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading leaderboard...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Leaderboard Management">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Leaderboard</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <ProtectedRoute>
    <AdminLayout title="Leaderboard Management">
      {/* Current Rankings */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Current Rankings</h3>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div key={user.rank} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{user.badge || `#${user.rank}`}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{user.name}</span>
                    {user.verified && <span className="text-green-400 text-sm">✓</span>}
                  </div>
                  <span className="text-gray-400 text-sm">{user.points.toLocaleString()} points</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAdjustPoints(user.rank)}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Adjust Points
                </button>
                <button 
                  onClick={() => handleReset(user.rank)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Reset
                </button>
              </div>
            </div>
          ))}
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
              value={seasonSettings.endDate}
              onChange={(e) => setSeasonSettings({ ...seasonSettings, endDate: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Points per Upload</label>
            <input
              type="number"
              value={seasonSettings.pointsPerUpload}
              onChange={(e) => setSeasonSettings({ ...seasonSettings, pointsPerUpload: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Points per Sale</label>
            <input
              type="number"
              value={seasonSettings.pointsPerSale}
              onChange={(e) => setSeasonSettings({ ...seasonSettings, pointsPerSale: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold">
            💾 Save Settings
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition font-bold">
            🎮 Start New Season
          </button>
        </div>
      </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
