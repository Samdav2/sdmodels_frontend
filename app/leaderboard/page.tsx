"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface Artist {
  rank: number;
  name: string;
  avatar: string;
  sales: number;
  revenue: number;
  models: number;
  rating: number;
  badge?: string;
  feeRate: number;
  trend: 'up' | 'down' | 'same';
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'month' | 'season' | 'alltime'>('month');

  // Mock data
  const currentSeason = {
    number: 3,
    name: "Neon Forge",
    endsIn: { days: 12, hours: 8, minutes: 34 },
    prize: "0% Platform Fees for 30 Days + Golden Vertex Badge",
  };

  const topArtists: Artist[] = [
    {
      rank: 1,
      name: "PixelForge Studio",
      avatar: "🎨",
      sales: 1240,
      revenue: 48560,
      models: 87,
      rating: 4.9,
      badge: "👑",
      feeRate: 0,
      trend: 'up',
    },
    {
      rank: 2,
      name: "3D_Wizard",
      avatar: "🧙",
      sales: 980,
      revenue: 39200,
      models: 64,
      rating: 4.8,
      badge: "🥈",
      feeRate: 5.0,
      trend: 'up',
    },
    {
      rank: 3,
      name: "MeshMaster",
      avatar: "⚡",
      sales: 856,
      revenue: 34240,
      models: 52,
      rating: 4.7,
      badge: "🥉",
      feeRate: 5.5,
      trend: 'down',
    },
    {
      rank: 4,
      name: "PolyPro",
      avatar: "💎",
      sales: 742,
      revenue: 29680,
      models: 48,
      rating: 4.8,
      feeRate: 6.0,
      trend: 'up',
    },
    {
      rank: 5,
      name: "VoxelVerse",
      avatar: "🌟",
      sales: 698,
      revenue: 27920,
      models: 41,
      rating: 4.6,
      feeRate: 6.5,
      trend: 'same',
    },
    {
      rank: 6,
      name: "CyberCraft",
      avatar: "🤖",
      sales: 654,
      revenue: 26160,
      models: 39,
      rating: 4.7,
      feeRate: 6.5,
      trend: 'up',
    },
    {
      rank: 7,
      name: "NeonArtist",
      avatar: "✨",
      sales: 612,
      revenue: 24480,
      models: 35,
      rating: 4.5,
      feeRate: 7.0,
      trend: 'down',
    },
    {
      rank: 8,
      name: "VertexVault",
      avatar: "🔷",
      sales: 589,
      revenue: 23560,
      models: 33,
      rating: 4.6,
      feeRate: 7.0,
      trend: 'up',
    },
    {
      rank: 9,
      name: "ModelMaven",
      avatar: "🎯",
      sales: 543,
      revenue: 21720,
      models: 29,
      rating: 4.4,
      feeRate: 7.5,
      trend: 'same',
    },
    {
      rank: 10,
      name: "DigitalDynamo",
      avatar: "⚙️",
      sales: 521,
      revenue: 20840,
      models: 27,
      rating: 4.5,
      feeRate: 7.5,
      trend: 'up',
    },
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up': return <span className="text-green-400">↗</span>;
      case 'down': return <span className="text-red-400">↘</span>;
      case 'same': return <span className="text-gray-400">→</span>;
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500/20 to-orange-500/20 border-yellow-500';
    if (rank === 2) return 'from-gray-400/20 to-gray-500/20 border-gray-400';
    if (rank === 3) return 'from-orange-700/20 to-orange-800/20 border-orange-700';
    return 'from-slate-800/50 to-slate-900/50 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg sm:text-xl">3D</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              NEXUS MODELS
            </h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-sm font-bold backdrop-blur-sm">
              🏆 SEASON PASS LEADERBOARD
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">
            Top <span className="text-orange-500">Modellers</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Compete for the Golden Vertex badge and 0% platform fees
          </p>
        </div>

        {/* Current Season Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 bg-gradient-to-r from-purple-500/20 via-orange-500/20 to-purple-500/20 border-2 border-purple-500/50 rounded-2xl p-6 sm:p-8 backdrop-blur"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="text-sm text-purple-300 mb-2">Current Season</div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                Season {currentSeason.number}: {currentSeason.name}
              </div>
              <div className="text-orange-400 font-bold text-lg">
                {currentSeason.prize}
              </div>
            </div>
            
            <div className="bg-slate-950/50 border border-purple-500/30 rounded-xl p-4 sm:p-6 text-center">
              <div className="text-sm text-gray-400 mb-2">Season Ends In</div>
              <div className="flex gap-2 sm:gap-4 justify-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{currentSeason.endsIn.days}</div>
                  <div className="text-xs text-gray-400">Days</div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">:</div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{currentSeason.endsIn.hours}</div>
                  <div className="text-xs text-gray-400">Hours</div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">:</div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">{currentSeason.endsIn.minutes}</div>
                  <div className="text-xs text-gray-400">Mins</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeframe Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {(['month', 'season', 'alltime'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {tf === 'month' && 'This Month'}
              {tf === 'season' && 'This Season'}
              {tf === 'alltime' && 'All Time'}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 sm:order-1"
          >
            <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-2 border-gray-400 rounded-2xl p-6 backdrop-blur text-center">
              <div className="text-6xl mb-4">{topArtists[1].avatar}</div>
              <div className="text-5xl mb-2">🥈</div>
              <div className="text-2xl font-black text-white mb-2">{topArtists[1].name}</div>
              <div className="text-orange-400 font-bold text-xl mb-4">{topArtists[1].sales} sales</div>
              <div className="text-sm text-gray-300">
                Fee Rate: <span className="text-green-400 font-bold">{topArtists[1].feeRate}%</span>
              </div>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-1 sm:order-2"
          >
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500 rounded-2xl p-8 backdrop-blur text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 animate-pulse" />
              <div className="text-7xl mb-4">{topArtists[0].avatar}</div>
              <div className="text-6xl mb-2">👑</div>
              <div className="text-3xl font-black text-white mb-2">{topArtists[0].name}</div>
              <div className="text-orange-400 font-bold text-2xl mb-4">{topArtists[0].sales} sales</div>
              <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500 rounded-lg inline-block">
                <div className="text-sm text-yellow-300 font-bold">
                  Fee Rate: <span className="text-green-400">{topArtists[0].feeRate}%</span> 🎉
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-3"
          >
            <div className="bg-gradient-to-br from-orange-700/20 to-orange-800/20 border-2 border-orange-700 rounded-2xl p-6 backdrop-blur text-center">
              <div className="text-6xl mb-4">{topArtists[2].avatar}</div>
              <div className="text-5xl mb-2">🥉</div>
              <div className="text-2xl font-black text-white mb-2">{topArtists[2].name}</div>
              <div className="text-orange-400 font-bold text-xl mb-4">{topArtists[2].sales} sales</div>
              <div className="text-sm text-gray-300">
                Fee Rate: <span className="text-green-400 font-bold">{topArtists[2].feeRate}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-slate-900/50 border border-orange-500/30 rounded-2xl backdrop-blur overflow-hidden">
          <div className="p-6 border-b border-orange-500/20">
            <h2 className="text-2xl font-black text-white">Full Rankings</h2>
          </div>

          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-950/50 border-b border-slate-700 text-sm font-semibold text-gray-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Artist</div>
            <div className="col-span-2">Sales</div>
            <div className="col-span-2">Revenue</div>
            <div className="col-span-2">Models</div>
            <div className="col-span-1">Rating</div>
            <div className="col-span-1">Fee</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-700">
            {topArtists.map((artist, index) => (
              <motion.div
                key={artist.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-6 py-4 sm:py-6 hover:bg-slate-800/50 transition-all cursor-pointer bg-gradient-to-r ${getRankColor(artist.rank)}`}
              >
                {/* Mobile Layout */}
                <div className="sm:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{artist.badge || `#${artist.rank}`}</div>
                      <div className="text-4xl">{artist.avatar}</div>
                      <div>
                        <div className="font-bold text-white">{artist.name}</div>
                        <div className="text-sm text-gray-400">{artist.models} models</div>
                      </div>
                    </div>
                    {getTrendIcon(artist.trend)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-950/50 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Sales</div>
                      <div className="text-orange-400 font-bold">{artist.sales}</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Revenue</div>
                      <div className="text-green-400 font-bold">${(artist.revenue / 1000).toFixed(1)}k</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Fee</div>
                      <div className="text-purple-400 font-bold">{artist.feeRate}%</div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:contents">
                  <div className="col-span-1 flex items-center gap-2">
                    <span className="text-2xl">{artist.badge || `#${artist.rank}`}</span>
                    {getTrendIcon(artist.trend)}
                  </div>
                  
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="text-4xl">{artist.avatar}</div>
                    <div>
                      <div className="font-bold text-white">{artist.name}</div>
                      <div className="text-sm text-gray-400">⭐ {artist.rating}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <div className="text-orange-400 font-bold">{artist.sales}</div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <div className="text-green-400 font-bold">${artist.revenue.toLocaleString()}</div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <div className="text-white">{artist.models}</div>
                  </div>
                  
                  <div className="col-span-1 flex items-center">
                    <div className="text-yellow-400">⭐ {artist.rating}</div>
                  </div>
                  
                  <div className="col-span-1 flex items-center">
                    <div className={`font-bold ${artist.feeRate === 0 ? 'text-green-400' : artist.feeRate < 7.5 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {artist.feeRate}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 text-center">
            How the Season Pass Works
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h4 className="text-white font-bold mb-2">Compete Monthly</h4>
              <p className="text-gray-400 text-sm">
                Upload quality models and make sales to climb the leaderboard each month
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏆</span>
              </div>
              <h4 className="text-white font-bold mb-2">Win Rewards</h4>
              <p className="text-gray-400 text-sm">
                Top artist gets 0% fees for 30 days. Top 3 get reduced fees and badges
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h4 className="text-white font-bold mb-2">Keep More Money</h4>
              <p className="text-gray-400 text-sm">
                Standard fee is 7.5%. Winners pay as low as 0% - keep 100% of your sales!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
