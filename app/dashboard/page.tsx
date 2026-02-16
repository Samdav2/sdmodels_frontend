"use client";

import dynamic from "next/dynamic";
import SalesGoalProgress from "@/components/dashboard/SalesGoalProgress";
import ActivityStream from "@/components/dashboard/ActivityStream";
import FeeCalculator from "@/components/dashboard/FeeCalculator";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Dynamically import GlobalSalesMap with SSR disabled to avoid React Three Fiber hydration issues
const GlobalSalesMap = dynamic(() => import("@/components/dashboard/GlobalSalesMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-950/50 rounded-lg border border-orange-500/20 flex items-center justify-center">
      <div className="text-orange-400 animate-pulse">Loading Globe...</div>
    </div>
  ),
});

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
          <div className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">Total Sales</div>
          <div className="text-xl sm:text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            $12,450
          </div>
          <div className="text-xs text-green-400 mt-1 sm:mt-2">+23% this month</div>
        </div>
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
          <div className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">Models Sold</div>
          <div className="text-xl sm:text-3xl font-black text-white">342</div>
          <div className="text-xs text-green-400 mt-1 sm:mt-2">+18 today</div>
        </div>
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
          <div className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">Active Models</div>
          <div className="text-xl sm:text-3xl font-black text-white">28</div>
          <div className="text-xs text-slate-400 mt-1 sm:mt-2">3 pending review</div>
        </div>
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
          <div className="text-xs sm:text-sm text-slate-400 mb-1 sm:mb-2">Avg. Rating</div>
          <div className="text-xl sm:text-3xl font-black text-white">4.8</div>
          <div className="text-xs text-orange-400 mt-1 sm:mt-2">⭐⭐⭐⭐⭐</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Globe and Progress */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Global Sales Map */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🌍</span>
              Global Sales Map
            </h2>
            <GlobalSalesMap />
          </div>

          {/* Sales Goals */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎯</span>
              Sales Goals
            </h2>
            <SalesGoalProgress />
          </div>
        </div>

        {/* Right Column - Activity and Calculator */}
        <div className="space-y-4 sm:space-y-6">
          {/* Fee Calculator */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">💰</span>
              Fee Calculator
            </h2>
            <FeeCalculator />
          </div>

          {/* Activity Stream */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📡</span>
              Live Activity
            </h2>
            <ActivityStream />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
