"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AnalyticsPage() {
  const [topModels] = useState([
    { name: "Cyberpunk Mech", sales: 145, revenue: 21750 },
    { name: "Dragon Animated", sales: 98, revenue: 14700 },
    { name: "Sci-Fi Vehicle", sales: 87, revenue: 13050 },
  ]);

  const [topCreators] = useState([
    { name: "PixelForge", models: 45, revenue: 67500 },
    { name: "3D_Wizard", models: 32, revenue: 48000 },
    { name: "MeshMaster", models: 28, revenue: 42000 },
  ]);

  return (
    <AdminLayout title="Advanced Analytics">
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Models</h3>
          <div className="space-y-3">
            {topModels.map((model, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="text-white font-bold">{model.name}</div>
                  <div className="text-gray-400 text-sm">{model.sales} sales</div>
                </div>
                <div className="text-green-400 font-bold">${model.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Creators</h3>
          <div className="space-y-3">
            {topCreators.map((creator, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <div className="text-white font-bold">{creator.name}</div>
                  <div className="text-gray-400 text-sm">{creator.models} models</div>
                </div>
                <div className="text-green-400 font-bold">${creator.revenue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Traffic Analytics</h3>
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition">
            Export Report
          </button>
        </div>
        <div className="h-96 bg-slate-800/50 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-lg">Traffic analytics dashboard</p>
            <p className="text-sm">(Integrate with Google Analytics or custom tracking)</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
