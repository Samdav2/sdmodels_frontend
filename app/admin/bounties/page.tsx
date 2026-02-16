"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function BountyManagementPage() {
  const [bounties, setBounties] = useState([
    { id: 1, title: "Sci-Fi Character Rig", budget: 500, creator: "GameStudio", status: "Open", applicants: 5 },
    { id: 2, title: "Medieval Weapon Pack", budget: 300, creator: "IndieGame", status: "In Progress", applicants: 1 },
    { id: 3, title: "Futuristic Vehicle", budget: 750, creator: "VRCompany", status: "Completed", applicants: 8 },
  ]);
  const [settings, setSettings] = useState({ minAmount: 50, platformFee: 10 });

  const handleClose = (id: number) => {
    if (confirm("Close this bounty?")) {
      setBounties(prev => prev.filter(b => b.id !== id));
      alert("Bounty closed!");
    }
  };

  return (
    <AdminLayout title="Bounty Board Management">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">Manage all bounties and configure settings</p>
        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition font-bold">
          ➕ Create Bounty
        </button>
      </div>

      <div className="grid gap-4 mb-6">
        {bounties.map((bounty) => (
          <div key={bounty.id} className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{bounty.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>💰 ${bounty.budget}</span>
                  <span>👤 by {bounty.creator}</span>
                  <span>📝 {bounty.applicants} applicants</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  bounty.status === "Open" ? "bg-green-900/30 text-green-400" :
                  bounty.status === "In Progress" ? "bg-yellow-900/30 text-yellow-400" :
                  "bg-blue-900/30 text-blue-400"
                }`}>
                  {bounty.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition">
                  View Details
                </button>
                <button 
                  onClick={() => handleClose(bounty.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bounty Settings */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Bounty Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Minimum Bounty Amount ($)</label>
            <input
              type="number"
              value={settings.minAmount}
              onChange={(e) => setSettings({ ...settings, minAmount: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Platform Fee on Bounties (%)</label>
            <input
              type="number"
              value={settings.platformFee}
              onChange={(e) => setSettings({ ...settings, platformFee: parseFloat(e.target.value) })}
              step="0.5"
              className="w-full px-4 py-2 bg-slate-800 border border-yellow-600/30 rounded-lg text-white focus:outline-none focus:border-yellow-600"
            />
          </div>
        </div>
        <button className="mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition font-bold">
          💾 Save Settings
        </button>
      </div>
    </AdminLayout>
  );
}
