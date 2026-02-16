"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Bounty {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  claimed: boolean;
  claimedBy?: string;
  requirements: string[];
  poster: string;
  postedDate: string;
}

const mockBounties: Bounty[] = [
  {
    id: "1",
    title: "Cyberpunk Toyota Vehicle",
    description: "Need a futuristic cyberpunk-style Toyota vehicle with neon accents and detailed interior. Must be game-ready with LODs.",
    budget: 200,
    deadline: "3 days",
    category: "Vehicles",
    difficulty: "Hard",
    claimed: false,
    requirements: ["Game-ready topology", "PBR textures", "3 LOD levels", "Rigged doors"],
    poster: "GameStudio_XYZ",
    postedDate: "2 hours ago",
  },
  {
    id: "2",
    title: "Low-Poly Forest Asset Pack",
    description: "Collection of 20+ low-poly trees, rocks, and plants for a mobile game. Stylized art style preferred.",
    budget: 150,
    deadline: "5 days",
    category: "Environments",
    difficulty: "Medium",
    claimed: true,
    claimedBy: "PolyPro",
    requirements: ["Mobile-optimized", "Under 500 polys each", "Modular pieces", "Color variations"],
    poster: "IndieDev_Studios",
    postedDate: "5 hours ago",
  },
  {
    id: "3",
    title: "Sci-Fi Weapon Set (5 weapons)",
    description: "Five unique sci-fi weapons with glowing elements and animated parts. High detail for first-person view.",
    budget: 300,
    deadline: "7 days",
    category: "Weapons",
    difficulty: "Hard",
    claimed: false,
    requirements: ["First-person ready", "Animated parts", "Emission maps", "4K textures"],
    poster: "FPS_GameDev",
    postedDate: "1 day ago",
  },
  {
    id: "4",
    title: "Stylized Character Base Mesh",
    description: "Clean base mesh for stylized character creation. Must have proper topology for animation.",
    budget: 80,
    deadline: "2 days",
    category: "Characters",
    difficulty: "Easy",
    claimed: false,
    requirements: ["Clean topology", "UV unwrapped", "Symmetrical", "T-pose"],
    poster: "AnimationStudio",
    postedDate: "3 hours ago",
  },
  {
    id: "5",
    title: "Medieval Castle Interior",
    description: "Detailed medieval castle interior with modular pieces. Throne room, dining hall, and corridors.",
    budget: 250,
    deadline: "10 days",
    category: "Environments",
    difficulty: "Hard",
    claimed: false,
    requirements: ["Modular design", "PBR materials", "Optimized for UE5", "Lighting ready"],
    poster: "RPG_Devs",
    postedDate: "6 hours ago",
  },
];

export default function BountiesPage() {
  const [bounties, setBounties] = useState<Bounty[]>(mockBounties);
  const [filter, setFilter] = useState<"all" | "available" | "claimed">("all");
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const filteredBounties = bounties.filter((b) => {
    if (filter === "available") return !b.claimed;
    if (filter === "claimed") return b.claimed;
    return true;
  });

  const handleClaim = (bountyId: string) => {
    setBounties((prev) =>
      prev.map((b) =>
        b.id === bountyId ? { ...b, claimed: true, claimedBy: "You" } : b
      )
    );
    setShowClaimModal(false);
    setSelectedBounty(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "Medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "Hard":
        return "text-red-400 bg-red-500/20 border-red-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg sm:text-xl">3D</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              BOUNTY BOARD
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href="/dashboard" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Dashboard
            </Link>
            <Link href="/" className="text-sm sm:text-base text-slate-400 hover:text-slate-300 transition">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            💼 Freelance <span className="text-orange-500">Bounties</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Claim bounties, create models, and get paid through secure escrow. Money held until delivery.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 backdrop-blur">
            <div className="text-xs sm:text-sm text-slate-400 mb-1">Total Bounties</div>
            <div className="text-2xl sm:text-3xl font-black text-white">{bounties.length}</div>
          </div>
          <div className="bg-slate-900/50 border border-green-500/30 rounded-lg sm:rounded-xl p-4 backdrop-blur">
            <div className="text-xs sm:text-sm text-slate-400 mb-1">Available</div>
            <div className="text-2xl sm:text-3xl font-black text-green-400">
              {bounties.filter((b) => !b.claimed).length}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-yellow-500/30 rounded-lg sm:rounded-xl p-4 backdrop-blur">
            <div className="text-xs sm:text-sm text-slate-400 mb-1">Total Value</div>
            <div className="text-2xl sm:text-3xl font-black text-yellow-400">
              ${bounties.reduce((sum, b) => sum + b.budget, 0)}
            </div>
          </div>
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg sm:rounded-xl p-4 backdrop-blur">
            <div className="text-xs sm:text-sm text-slate-400 mb-1">Avg. Budget</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">
              ${Math.floor(bounties.reduce((sum, b) => sum + b.budget, 0) / bounties.length)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { value: "all", label: "All Bounties", icon: "📬" },
            { value: "available", label: "Available", icon: "✅" },
            { value: "claimed", label: "Claimed", icon: "🔒" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-4 sm:px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                filter === f.value
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50"
                  : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-orange-500/50"
              }`}
            >
              <span className="mr-2">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Bounties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredBounties.map((bounty) => (
            <motion.div
              key={bounty.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur hover:border-orange-500 transition group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition truncate">
                    {bounty.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 rounded text-xs">
                      {bounty.category}
                    </span>
                    <span className={`px-2 py-1 border rounded text-xs font-medium ${getDifficultyColor(bounty.difficulty)}`}>
                      {bounty.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="text-2xl sm:text-3xl font-black text-orange-400">${bounty.budget}</div>
                  <div className="text-xs text-slate-400">{bounty.deadline}</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 mb-4 line-clamp-2">{bounty.description}</p>

              {/* Requirements */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 mb-2">Requirements:</div>
                <div className="flex flex-wrap gap-1">
                  {bounty.requirements.slice(0, 3).map((req, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-300 rounded text-xs">
                      {req}
                    </span>
                  ))}
                  {bounty.requirements.length > 3 && (
                    <span className="px-2 py-1 text-slate-400 text-xs">
                      +{bounty.requirements.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-400">
                  Posted by <span className="text-white font-medium">{bounty.poster}</span> • {bounty.postedDate}
                </div>
                {bounty.claimed ? (
                  <span className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg text-xs font-bold">
                    Claimed by {bounty.claimedBy}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedBounty(bounty);
                      setShowClaimModal(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-sm shadow-lg shadow-orange-500/50"
                  >
                    Claim Bounty
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Claim Modal */}
        <AnimatePresence>
          {showClaimModal && selectedBounty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowClaimModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 border-2 border-orange-500 rounded-xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">{selectedBounty.title}</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm text-slate-400 mb-2">Description</div>
                    <p className="text-slate-300">{selectedBounty.description}</p>
                  </div>

                  <div>
                    <div className="text-sm text-slate-400 mb-2">Requirements</div>
                    <ul className="space-y-1">
                      {selectedBounty.requirements.map((req, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-orange-400">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                    <div>
                      <div className="text-xs text-slate-400">Budget</div>
                      <div className="text-2xl font-black text-orange-400">${selectedBounty.budget}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Deadline</div>
                      <div className="text-2xl font-black text-white">{selectedBounty.deadline}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <p className="text-sm text-slate-300">
                      💡 <strong>Escrow Protection:</strong> Payment is held securely until you deliver the model and the buyer approves it.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowClaimModal(false)}
                    className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleClaim(selectedBounty.id)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50"
                  >
                    Claim & Start Work
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
