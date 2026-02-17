"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAnalytics } from "@/lib/api/hooks/useAdminAnalytics";

export default function AnalyticsPage() {
  const { analytics, loading, error } = useAdminAnalytics();

  if (loading) {
    return (<AdminLayout title="Advanced Analytics">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Advanced Analytics">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Analytics</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  const { topModels, topCreators } = analytics;

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
