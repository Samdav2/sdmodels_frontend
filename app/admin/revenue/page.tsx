"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminRevenue } from "@/lib/api/hooks/useAdminRevenue";

export default function RevenueVaultPage() {
  const { revenue, loading, error } = useAdminRevenue();

  if (loading) {
    return (<AdminLayout title="The 7.5% Vault Tracker">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading revenue data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="The 7.5% Vault Tracker">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Revenue</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  const { stats, transactions } = revenue;

  return (
    <ProtectedRoute>
    <AdminLayout title="The 7.5% Vault Tracker">
      {/* Vault Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-8 text-white">
          <div className="text-5xl mb-4">🏦</div>
          <div className="text-sm opacity-80 mb-2">Total Platform Fees</div>
          <div className="text-4xl font-black">${stats.platformFees.toLocaleString()}</div>
          <div className="text-sm opacity-80 mt-2">7.5% of ${stats.totalRevenue.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="text-5xl mb-4">📈</div>
          <div className="text-sm opacity-80 mb-2">This Month</div>
          <div className="text-4xl font-black">${stats.monthlyRevenue.toLocaleString()}</div>
          <div className="text-sm opacity-80 mt-2">+18% from last month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="text-5xl mb-4">💎</div>
          <div className="text-sm opacity-80 mb-2">Average Transaction</div>
          <div className="text-4xl font-black">${stats.avgTransaction}</div>
          <div className="text-sm opacity-80 mt-2">${(stats.avgTransaction * 0.075).toFixed(2)} fee per sale</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition">
            Export Data
          </button>
        </div>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex-1">
                <div className="text-white font-bold">{tx.model}</div>
                <div className="text-gray-400 text-sm">Purchased by {tx.buyer}</div>
              </div>
              <div className="text-right mr-6">
                <div className="text-white font-bold">${tx.amount}</div>
                <div className="text-green-400 text-sm">Fee: ${tx.fee.toFixed(2)}</div>
              </div>
              <div className="text-gray-400 text-sm">{tx.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Revenue Analytics</h3>
        <div className="h-64 bg-slate-800/50 rounded-xl flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-5xl mb-4">📊</div>
            <p>Revenue chart will be rendered here</p>
            <p className="text-sm">(Connect to FastAPI backend for live data)</p>
          </div>
        </div>
      </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
