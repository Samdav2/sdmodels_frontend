"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const followers = [
  { id: 1, name: "Alex Chen", avatar: "👨‍💻", following: 245, models: 12, joined: "2 months ago" },
  { id: 2, name: "Sarah Martinez", avatar: "👩‍🎨", following: 189, models: 8, joined: "3 months ago" },
  { id: 3, name: "Mike Johnson", avatar: "🧑‍💼", following: 156, models: 5, joined: "1 month ago" },
  { id: 4, name: "Emma Wilson", avatar: "👩‍🔬", following: 134, models: 15, joined: "4 months ago" },
];

const ranks = [
  { name: "Bronze Modeller", minSales: 0, fee: 7.5, color: "text-orange-600", icon: "🥉" },
  { name: "Silver Modeller", minSales: 100, fee: 7.0, color: "text-slate-400", icon: "🥈" },
  { name: "Gold Modeller", minSales: 300, fee: 6.5, color: "text-yellow-400", icon: "🥇", current: true },
  { name: "Platinum Modeller", minSales: 500, fee: 6.0, color: "text-cyan-400", icon: "💎" },
  { name: "Mythic Modeller", minSales: 1000, fee: 5.0, color: "text-purple-400", icon: "👑" },
];

export default function SocialPage() {
  const currentRank = ranks.find((r) => r.current);
  const nextRank = ranks[ranks.findIndex((r) => r.current) + 1];
  const currentSales = 342;

  return (
    <DashboardLayout>
      <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8">Social & Reputation HUD</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Rank and Progress */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Current Rank */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-6 sm:p-8 backdrop-blur">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Rank</h2>
                <p className="text-sm sm:text-base text-slate-400">Level up to unlock better rewards</p>
              </div>
              <div className="text-5xl sm:text-6xl">{currentRank?.icon}</div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className={`text-2xl sm:text-3xl font-black ${currentRank?.color}`}>{currentRank?.name}</div>
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/20 border border-orange-500 rounded-full">
                <span className="text-xs sm:text-sm font-bold text-orange-400">{currentRank?.fee}% Fee</span>
              </div>
            </div>

            {/* Progress to Next Rank */}
            {nextRank && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Progress to {nextRank.name}</span>
                  <span className="text-sm font-mono text-orange-400">
                    {currentSales} / {nextRank.minSales} sales
                  </span>
                </div>
                <div className="relative h-4 bg-slate-950/50 rounded-lg overflow-hidden border border-slate-700/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentSales / nextRank.minSales) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                    style={{ boxShadow: "0 0 20px rgba(255, 107, 53, 0.5)" }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {nextRank.minSales - currentSales} more sales to unlock {nextRank.icon} {nextRank.name}
                </p>
              </div>
            )}
          </div>

          {/* Rank Tiers */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🏆</span>
              Rank Tiers & Benefits
            </h2>
            <div className="space-y-3">
              {ranks.map((rank, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    rank.current
                      ? "bg-orange-500/20 border-orange-500"
                      : "bg-slate-950/50 border-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{rank.icon}</span>
                    <div>
                      <div className={`text-sm font-bold ${rank.color}`}>{rank.name}</div>
                      <div className="text-xs text-slate-400">{rank.minSales}+ sales required</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{rank.fee}%</div>
                    <div className="text-xs text-slate-400">Platform Fee</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Follower Activity */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">👥</span>
              Recent Follower Activity
            </h2>
            <div className="space-y-3">
              {[
                { user: "Alex Chen", action: "liked", model: "Cyberpunk Vehicle", time: "2 hours ago" },
                { user: "Sarah Martinez", action: "purchased", model: "Sci-Fi Character", time: "5 hours ago" },
                { user: "Mike Johnson", action: "followed you", model: null, time: "1 day ago" },
                { user: "Emma Wilson", action: "liked", model: "Futuristic Weapon", time: "2 days ago" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-700/50 rounded-lg hover:border-orange-500/50 transition"
                >
                  <span className="text-2xl">
                    {activity.action === "liked" ? "❤️" : activity.action === "purchased" ? "💰" : "👤"}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm text-white">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-slate-400">{activity.action}</span>
                      {activity.model && <span className="text-orange-400"> {activity.model}</span>}
                    </div>
                    <div className="text-xs text-slate-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Followers List */}
        <div className="space-y-4 sm:space-y-6">
          {/* Follower Stats */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Follower Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Total Followers</div>
                <div className="text-3xl font-black text-orange-400">1,240</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">This Month</div>
                <div className="text-2xl font-bold text-green-400">+156</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Engagement Rate</div>
                <div className="text-2xl font-bold text-white">8.4%</div>
              </div>
            </div>
          </div>

          {/* Top Followers */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Top Followers</h3>
            <div className="space-y-3">
              {followers.map((follower) => (
                <div
                  key={follower.id}
                  className="flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-700/50 rounded-lg hover:border-orange-500/50 transition cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center text-2xl border border-orange-500/30">
                    {follower.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{follower.name}</div>
                    <div className="text-xs text-slate-400">
                      {follower.following} following · {follower.models} models
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-400 rounded-lg hover:border-orange-500/50 hover:text-white transition text-sm">
              View All Followers
            </button>
          </div>

          {/* Social Links */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Social Links</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-700/50 rounded-lg hover:border-orange-500/50 transition">
                <span className="text-xl">🐦</span>
                <span className="text-sm text-slate-400">Connect Twitter</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-700/50 rounded-lg hover:border-orange-500/50 transition">
                <span className="text-xl">📷</span>
                <span className="text-sm text-slate-400">Connect Instagram</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-950/50 border border-slate-700/50 rounded-lg hover:border-orange-500/50 transition">
                <span className="text-xl">🎨</span>
                <span className="text-sm text-slate-400">Connect ArtStation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
