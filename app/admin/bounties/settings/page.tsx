"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminApi } from "@/lib/api/admin";

export default function BountySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    min_bounty_amount: 10,
    max_bounty_amount: 10000,
    platform_fee_percentage: 7.5,
    escrow_hold_days: 3,
    auto_approve_after_days: 14,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getBountySettings();
      setSettings(data.settings || data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminApi.updateBountySettings(settings);
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Bounty Settings">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading settings...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Bounty Settings">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">Configure bounty system settings and limits</p>
          <Link
            href="/admin/bounties"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            ← Back to bounties
          </Link>
        </div>

        {/* Settings Form */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-6">Bounty Limits</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Min Amount */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Minimum Bounty Amount ($)
              </label>
              <input
                type="number"
                value={settings.min_bounty_amount}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  min_bounty_amount: parseFloat(e.target.value) 
                }))}
                min="1"
                step="1"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-purple-600 focus:outline-none transition"
              />
              <p className="text-sm text-gray-400 mt-2">
                Minimum amount users can set for a bounty
              </p>
            </div>

            {/* Max Amount */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Maximum Bounty Amount ($)
              </label>
              <input
                type="number"
                value={settings.max_bounty_amount}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  max_bounty_amount: parseFloat(e.target.value) 
                }))}
                min="100"
                step="100"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-purple-600 focus:outline-none transition"
              />
              <p className="text-sm text-gray-400 mt-2">
                Maximum amount users can set for a bounty
              </p>
            </div>
          </div>
        </div>

        {/* Fee Settings */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-6">Platform Fees</h3>

          <div>
            <label className="block text-white font-semibold mb-2">
              Platform Fee Percentage (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={settings.platform_fee_percentage}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  platform_fee_percentage: parseFloat(e.target.value) 
                }))}
                className="flex-1"
              />
              <input
                type="number"
                value={settings.platform_fee_percentage}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  platform_fee_percentage: parseFloat(e.target.value) 
                }))}
                min="0"
                max="20"
                step="0.5"
                className="w-24 px-4 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-purple-600 focus:outline-none transition text-center"
              />
              <span className="text-white font-bold">%</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Fee charged on bounty payments (deducted from artist's earnings)
            </p>
            <div className="mt-4 p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
              <div className="text-sm text-gray-400 mb-2">Example for $100 bounty:</div>
              <div className="flex justify-between text-white">
                <span>Artist receives:</span>
                <span className="font-bold text-green-400">
                  ${(100 * (1 - settings.platform_fee_percentage / 100)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-white mt-1">
                <span>Platform fee:</span>
                <span className="font-bold text-yellow-400">
                  ${(100 * settings.platform_fee_percentage / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Escrow Settings */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-6">Escrow & Timing</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Escrow Hold Days */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Escrow Hold Period (days)
              </label>
              <input
                type="number"
                value={settings.escrow_hold_days}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  escrow_hold_days: parseInt(e.target.value) 
                }))}
                min="1"
                max="30"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-purple-600 focus:outline-none transition"
              />
              <p className="text-sm text-gray-400 mt-2">
                Days to hold payment in escrow after submission approval
              </p>
            </div>

            {/* Auto Approve Days */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Auto-Approve After (days)
              </label>
              <input
                type="number"
                value={settings.auto_approve_after_days}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  auto_approve_after_days: parseInt(e.target.value) 
                }))}
                min="7"
                max="60"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:border-purple-600 focus:outline-none transition"
              />
              <p className="text-sm text-gray-400 mt-2">
                Auto-approve submission if buyer doesn't respond
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6 mb-6">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>ℹ️</span>
            Important Notes
          </h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Changes to fee percentage only affect new bounties</li>
            <li>• Escrow hold period protects both buyers and artists</li>
            <li>• Auto-approve prevents indefinite pending submissions</li>
            <li>• All changes are logged for audit purposes</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <Link
            href="/admin/bounties"
            className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold text-center"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "💾 Save Settings"}
          </button>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
