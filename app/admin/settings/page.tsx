"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function SettingsPage() {
  const [general, setGeneral] = useState({
    platformName: "Nexus Models",
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

  const handleSave = () => {
    // TODO: Call API
    alert("Settings saved!");
  };

  return (
    <AdminLayout title="Platform Settings">
      <div className="grid md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Platform Name</label>
              <input
                type="text"
                value={general.platformName}
                onChange={(e) => setGeneral({ ...general, platformName: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Platform Fee (%)</label>
              <input
                type="number"
                value={general.platformFee}
                onChange={(e) => setGeneral({ ...general, platformFee: parseFloat(e.target.value) })}
                step="0.1"
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Maintenance Mode</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={general.maintenanceMode}
                  onChange={(e) => setGeneral({ ...general, maintenanceMode: e.target.checked })}
                  className="w-5 h-5" 
                />
                <span className="text-white">Enable maintenance mode</span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Two-Factor Authentication</label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={security.require2FA}
                  onChange={(e) => setSecurity({ ...security, require2FA: e.target.checked })}
                  className="w-5 h-5" 
                />
                <span className="text-white">Require 2FA for admin access</span>
              </label>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">API Rate Limiting</label>
              <input
                type="number"
                value={security.apiRateLimit}
                onChange={(e) => setSecurity({ ...security, apiRateLimit: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
              />
              <p className="text-gray-500 text-xs mt-1">Requests per minute</p>
            </div>
            <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition">
              🔒 Change Admin Password
            </button>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Email Notifications</h3>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={value}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="w-5 h-5" 
                />
                <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Backup & Export */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Backup & Export</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-500 hover:to-blue-500 transition font-semibold">
              💾 Backup Database
            </button>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition font-semibold">
              📊 Export Analytics
            </button>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition font-semibold">
              📦 Export All Models
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button 
          onClick={handleSave}
          className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-500 hover:to-orange-500 transition font-bold text-lg"
        >
          💾 SAVE ALL SETTINGS
        </button>
      </div>
    </AdminLayout>
  );
}
