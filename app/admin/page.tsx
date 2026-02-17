"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminStats } from "@/lib/api/hooks/useAdminStats";

export default function SuperAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // In production, check auth
  const { stats, loading, error } = useAdminStats();
  
  const [liveStats, setLiveStats] = useState({
    totalRevenue: stats.totalRevenue,
    platformFees: stats.platformFees,
    activeUsers: stats.activeUsers,
    pendingModels: stats.pendingModels,
    totalModels: stats.totalModels,
    serverLoad: stats.serverLoad,
  });

  // Update liveStats when backend data changes
  useEffect(() => {
    setLiveStats({
      totalRevenue: stats.totalRevenue,
      platformFees: stats.platformFees,
      activeUsers: stats.activeUsers,
      pendingModels: stats.pendingModels,
      totalModels: stats.totalModels,
      serverLoad: stats.serverLoad,
    });
  }, [stats]);

  // Simulate live updates for server load
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        serverLoad: Math.max(10, Math.min(90, prev.serverLoad + (Math.random() - 0.5) * 10)),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-red-500 mb-4">ACCESS DENIED</h1>
          <p className="text-gray-400">SuperAdmin credentials required</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const adminSections = [
    { id: "overview", icon: "📊", label: "Overview", href: "/admin", color: "from-yellow-600 to-orange-600" },
    { id: "homepage", icon: "🏠", label: "Homepage Editor", href: "/admin/homepage", color: "from-orange-600 to-red-600" },
    { id: "slider", icon: "🎬", label: "Slider Manager", href: "/admin/slider", color: "from-cyan-600 to-blue-600" },
    { id: "models", icon: "🎨", label: "Model Review", href: "/admin/models", color: "from-purple-600 to-pink-600" },
    { id: "users", icon: "👥", label: "User Management", href: "/admin/users", color: "from-green-600 to-emerald-600" },
    { id: "bounties", icon: "💼", label: "Bounty Board", href: "/admin/bounties", color: "from-indigo-600 to-purple-600" },
    { id: "leaderboard", icon: "🏆", label: "Leaderboard", href: "/admin/leaderboard", color: "from-yellow-600 to-orange-600" },
    { id: "testimonials", icon: "💬", label: "Testimonials", href: "/admin/testimonials", color: "from-pink-600 to-rose-600" },
    { id: "learning", icon: "📚", label: "Learning Center", href: "/admin/learning", color: "from-blue-600 to-cyan-600" },
    { id: "categories", icon: "📁", label: "Categories", href: "/admin/categories", color: "from-teal-600 to-green-600" },
    { id: "revenue", icon: "💰", label: "Revenue Vault", href: "/admin/revenue", color: "from-green-600 to-emerald-600" },
    { id: "content", icon: "📝", label: "Content CMS", href: "/admin/content", color: "from-purple-600 to-pink-600" },
    { id: "emails", icon: "📧", label: "Email System", href: "/admin/emails", color: "from-red-600 to-pink-600" },
    { id: "analytics", icon: "📈", label: "Analytics", href: "/admin/analytics", color: "from-cyan-600 to-blue-600" },
    { id: "settings", icon: "⚙️", label: "Settings", href: "/admin/settings", color: "from-slate-600 to-gray-600" },
  ];

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Top Command Bar */}
      <div className="relative z-50 border-b-2 border-yellow-600/30 bg-slate-900/95 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  COMMAND BRIDGE
                </h1>
                <p className="text-xs text-gray-400">SuperAdmin Control Center</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Live Server Status */}
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-gray-400">Server Online</span>
              </div>

              <Link href="/">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition text-sm">
                  Exit to Site →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[2000px] mx-auto px-6 py-8">
        {/* Overview Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-black text-white mb-6">Global Health Monitor</h2>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              icon="💰"
              label="Total Revenue"
              value={`$${liveStats.totalRevenue.toLocaleString()}`}
              change="+12.5%"
              color="green"
            />
            <MetricCard
              icon="🏦"
              label="Platform Fees (7.5%)"
              value={`$${liveStats.platformFees.toLocaleString()}`}
              change="+8.3%"
              color="yellow"
            />
            <MetricCard
              icon="👥"
              label="Active Users"
              value={liveStats.activeUsers.toLocaleString()}
              change="+5.2%"
              color="cyan"
            />
            <MetricCard
              icon="⏳"
              label="Pending Review"
              value={liveStats.pendingModels}
              change="Needs attention"
              color="orange"
            />
          </div>

          {/* Server Health */}
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Server Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">CPU Load</span>
                  <span className="text-white font-bold">{liveStats.serverLoad.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      liveStats.serverLoad > 70 ? "bg-red-500" : liveStats.serverLoad > 40 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    animate={{ width: `${liveStats.serverLoad}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm text-gray-400">FastAPI</div>
                  <div className="text-green-400 font-bold">Online</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl mb-2">🗄️</div>
                  <div className="text-sm text-gray-400">Database</div>
                  <div className="text-green-400 font-bold">Healthy</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-sm text-gray-400">Security</div>
                  <div className="text-green-400 font-bold">Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Sections Grid */}
          <div className="mt-12">
            <h2 className="text-3xl font-black text-white mb-6">Management Sections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {adminSections.slice(1).map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => router.push(section.href)}
                  className="cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${section.color} rounded-2xl p-6 h-full`}>
                    <div className="text-5xl mb-4">{section.icon}</div>
                    <h3 className="text-white font-bold text-lg mb-2">{section.label}</h3>
                    <p className="text-white/80 text-sm">Manage and configure</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

function MetricCard({ icon, label, value, change, color }: any) {
  const colorClasses: Record<string, string> = {
    green: "from-green-600 to-emerald-600",
    yellow: "from-yellow-600 to-orange-600",
    cyan: "from-cyan-600 to-blue-600",
    orange: "from-orange-600 to-red-600",
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color] || colorClasses.green} rounded-xl flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <span className={`text-xs font-bold ${color === 'orange' ? 'text-orange-400' : 'text-green-400'}`}>
          {change}
        </span>
      </div>
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}
