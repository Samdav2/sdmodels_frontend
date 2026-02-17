"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useFinancials } from "@/lib/api/hooks/useDashboard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function FinancialsPage() {
  const { balance, transactions, earnings, loading, error, requestWithdrawal } = useFinancials();
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const availableBalance = balance?.available || 0;
  const pendingBalance = balance?.pending || 0;
  const totalEarnings = balance?.total || 0;
  const platformFees = balance?.fees || 0;

  // Mock earnings data for chart - use API data when available
  const chartData = {
    labels: earnings.length > 0 ? earnings.map((e: any) => e.month) : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Earnings",
        data: earnings.length > 0 ? earnings.map((e: any) => e.amount) : [2100, 3200, 2800, 4100, 3600, 4200],
        borderColor: "#ff6b35",
        backgroundColor: "rgba(255, 107, 53, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Projected",
        data: [null, null, null, null, null, 4200, 4800, 5200],
        borderColor: "#ffa552",
        backgroundColor: "rgba(255, 165, 82, 0.05)",
        borderDash: [5, 5],
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#94a3b8",
        },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#94a3b8",
        borderColor: "#ff6b35",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 107, 53, 0.1)",
        },
        ticks: {
          color: "#94a3b8",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 107, 53, 0.1)",
        },
        ticks: {
          color: "#94a3b8",
          callback: (value: any) => "$" + value,
        },
      },
    },
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) > availableBalance) return;
    
    try {
      await requestWithdrawal(parseFloat(withdrawAmount), 'bank_account');
      setWithdrawAmount("");
      // Show success message
    } catch (err) {
      console.error('Withdrawal failed:', err);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8">Revenue Vault</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading financial data...</div>
      ) : (
        <>
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-slate-900/50 border border-green-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
          <div className="text-xs sm:text-sm text-slate-400 mb-2">Available Balance</div>
          <div className="text-2xl sm:text-4xl font-black text-green-400 mb-2">
            ${availableBalance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Ready to withdraw</div>
        </div>

        <div className="bg-slate-900/50 border border-yellow-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
          <div className="text-xs sm:text-sm text-slate-400 mb-2">Pending</div>
          <div className="text-2xl sm:text-4xl font-black text-yellow-400 mb-2">
            ${pendingBalance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Processing (3-5 days)</div>
        </div>

        <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
          <div className="text-xs sm:text-sm text-slate-400 mb-2">Total Earnings</div>
          <div className="text-2xl sm:text-4xl font-black text-orange-400 mb-2">
            ${totalEarnings.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">All-time</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Chart and Projections */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Earnings Chart */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📈</span>
              Earnings & Projections
            </h2>
            <div className="h-[250px] sm:h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* AI Predictions */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🤖</span>
              AI Revenue Predictions
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg">
                <div>
                  <div className="text-sm font-semibold text-white">Next Month</div>
                  <div className="text-xs text-slate-400">Based on current trends</div>
                </div>
                <div className="text-2xl font-black text-green-400">$4,800</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg">
                <div>
                  <div className="text-sm font-semibold text-white">Next Quarter</div>
                  <div className="text-xs text-slate-400">Optimistic projection</div>
                </div>
                <div className="text-2xl font-black text-orange-400">$14,200</div>
              </div>
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-orange-400 mb-1">Growth Tip</h4>
                    <p className="text-xs text-slate-300">
                      Upload 2-3 more models this month to potentially increase earnings by 35%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📜</span>
              Recent Transactions
            </h2>
            <div className="space-y-2">
              {transactions.length === 0 ? (
                <div className="text-center py-4 text-slate-400">No transactions yet</div>
              ) : (
                transactions.map((tx: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-700/50 rounded-lg hover:border-orange-500/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tx.type === "sale" ? "💰" : "🏦"}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{tx.description || tx.model}</div>
                      <div className="text-xs text-slate-400">{tx.created_at || tx.date}</div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-bold ${
                      tx.amount > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Withdrawal Terminal */}
        <div className="space-y-4 sm:space-y-6">
          {/* Withdrawal Terminal */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🏦</span>
              Withdrawal Terminal
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={availableBalance}
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white text-lg font-mono focus:outline-none focus:border-orange-500 transition"
                    placeholder="0.00"
                  />
                </div>
                <button
                  onClick={() => setWithdrawAmount(availableBalance.toString())}
                  className="text-xs text-orange-400 hover:text-orange-300 mt-2"
                >
                  Withdraw all available
                </button>
              </div>

              {/* Fee Breakdown */}
              <div className="p-4 bg-slate-950/30 border border-slate-700/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Gross Earnings</span>
                  <span className="text-white font-mono">${totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Platform Fee (7.5%)</span>
                  <span className="text-red-400 font-mono">-${platformFees.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-700/50 pt-2 flex justify-between">
                  <span className="text-white font-semibold">Your Take-Home</span>
                  <span className="text-green-400 font-bold font-mono">
                    ${availableBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) > availableBalance}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Initiate Withdrawal
              </button>

              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-xs text-slate-300">
                  💡 Withdrawals are processed within 3-5 business days. No hidden fees.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <h3 className="text-lg font-bold text-white mb-4">Payment Methods</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-950/50 border border-green-500/50 rounded-lg">
                <span className="text-2xl">🏦</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">Bank Account</div>
                  <div className="text-xs text-slate-400">****1234</div>
                </div>
                <span className="text-xs text-green-400 font-medium">Active</span>
              </div>
              <button className="w-full py-2 bg-slate-800/50 border border-slate-700/50 text-slate-400 rounded-lg hover:border-orange-500/50 hover:text-white transition text-sm">
                + Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </DashboardLayout>
    </ProtectedRoute>
  );
}
