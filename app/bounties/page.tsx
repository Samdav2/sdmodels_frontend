"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBounties, Bounty } from "@/lib/api/bounties";
import { getAccessToken } from "@/lib/api/client";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";

export default function BountiesPage() {
  const router = useRouter();
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "available" | "claimed">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
  };

  // Check authentication
  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  // Get current user ID
  const getCurrentUserId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
    return null;
  };

  // Fetch bounties
  useEffect(() => {
    fetchBounties();
  }, []);

  const fetchBounties = async () => {
    try {
      setLoading(true);
      const data = await getBounties({ status: 'open' });
      setBounties(data.bounties || data || []);
    } catch (error: any) {
      console.error("Failed to fetch bounties:", error);
      showNotification("error", "Error", "Failed to load bounties");
    } finally {
      setLoading(false);
    }
  };

  // Filter bounties
  const filteredBounties = bounties.filter((b) => {
    // Status filter
    if (filter === "available" && b.status !== 'open') return false;
    if (filter === "claimed" && b.status === 'open') return false;
    
    // Category filter
    if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
    
    // Difficulty filter
    if (difficultyFilter !== "all" && b.difficulty !== difficultyFilter) return false;
    
    return true;
  });

  const categories = ["all", "Characters", "Vehicles", "Weapons", "Environments", "Props", "Creatures", "Architecture", "UI Elements", "Other"];
  const difficulties = ["all", "easy", "medium", "hard"];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "hard":
        return "text-red-400 bg-red-500/20 border-red-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "claimed":
      case "in_progress":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "completed":
        return "text-blue-400 bg-blue-500/20 border-blue-500";
      case "cancelled":
        return "text-red-400 bg-red-500/20 border-red-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  const handleBountyClick = (bountyId: string) => {
    router.push(`/bounties/${bountyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg">SD</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Bounty Board
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/bounties" className="flex-1 sm:flex-none text-center text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
                  My Bounties
                </Link>
                <Link href="/bounties/create" className="flex-1 sm:flex-none text-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-sm shadow-lg shadow-orange-500/50">
                  Create Bounty
                </Link>
              </>
            ) : (
              <Link href="/auth" className="flex-1 sm:flex-none text-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-sm shadow-lg shadow-orange-500/50">
                Login to Apply
              </Link>
            )}
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
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 backdrop-blur">
              <div className="text-xs sm:text-sm text-slate-400 mb-1">Total Bounties</div>
              <div className="text-2xl sm:text-3xl font-black text-white">{bounties.length}</div>
            </div>
            <div className="bg-slate-900/50 border border-green-500/30 rounded-lg sm:rounded-xl p-4 backdrop-blur">
              <div className="text-xs sm:text-sm text-slate-400 mb-1">Available</div>
              <div className="text-2xl sm:text-3xl font-black text-green-400">
                {bounties.filter((b) => b.status === 'open').length}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-yellow-500/30 rounded-lg sm:rounded-xl p-4 backdrop-blur">
              <div className="text-xs sm:text-sm text-slate-400 mb-1">Total Value</div>
              <div className="text-2xl sm:text-3xl font-black text-yellow-400">
                ${bounties.reduce((sum, b) => sum + Number(b.budget), 0)}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg sm:rounded-xl p-4 backdrop-blur">
              <div className="text-xs sm:text-sm text-slate-400 mb-1">Avg. Budget</div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400">
                ${bounties.length > 0 ? Math.floor(bounties.reduce((sum, b) => sum + Number(b.budget), 0) / bounties.length) : 0}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Status Filter */}
          <div>
            <div className="text-sm text-slate-400 mb-2">Status:</div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
          </div>

          {/* Category Filter */}
          <div>
            <div className="text-sm text-slate-400 mb-2">Category:</div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm ${
                    categoryFilter === cat
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                      : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-purple-500/50"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <div className="text-sm text-slate-400 mb-2">Difficulty:</div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm capitalize ${
                    difficultyFilter === diff
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50"
                      : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:border-blue-500/50"
                  }`}
                >
                  {diff === "all" ? "All Levels" : diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bounties Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredBounties.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4">📭</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
              No Bounties Found
            </h3>
            <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Try adjusting your filters or check back later for new bounties
            </p>
            {isAuthenticated && (
              <Link
                href="/bounties/create"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold text-sm sm:text-base shadow-lg shadow-orange-500/50"
              >
                Create First Bounty
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredBounties.map((bounty) => (
              <div
                key={bounty.id}
                onClick={() => handleBountyClick(bounty.id)}
                className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur hover:border-orange-500 transition group cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition break-words">
                      {bounty.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 rounded text-xs">
                        {bounty.category}
                      </span>
                      <span className={`px-2 py-1 border rounded text-xs font-medium ${getDifficultyColor(bounty.difficulty)}`}>
                        {bounty.difficulty?.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 border rounded text-xs font-medium ${getStatusColor(bounty.status)}`}>
                        {bounty.status?.toUpperCase().replace('_', ' ')}
                      </span>
                      {bounty.has_milestones && (
                        <span className="px-2 py-1 bg-purple-500/20 border border-purple-500 text-purple-400 rounded text-xs font-medium">
                          🎯 MILESTONES
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-2xl sm:text-3xl font-black text-orange-400">${Number(bounty.budget)}</div>
                    <div className="text-xs text-slate-400">{new Date(bounty.deadline).toLocaleDateString()}</div>
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
                    Posted by <span className="text-white font-medium">{bounty.poster_username}</span>
                    <div className="mt-1">
                      {new Date(bounty.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {bounty.status === 'open' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const currentUserId = getCurrentUserId();
                        
                        // Check if user is trying to apply to their own bounty
                        if (currentUserId && bounty.poster_id === currentUserId) {
                          showNotification("info", "Your Bounty", "You cannot apply to your own bounty");
                          return;
                        }
                        
                        if (!isAuthenticated) {
                          showNotification("error", "Login Required", "Please login to apply for bounties");
                          setTimeout(() => router.push('/auth'), 1500);
                        } else {
                          router.push(`/bounties/${bounty.id}`);
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-sm shadow-lg shadow-orange-500/50"
                    >
                      View & Apply
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg text-xs font-bold">
                      {bounty.claimed_by_username ? `Claimed by ${bounty.claimed_by_username}` : 'In Progress'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
