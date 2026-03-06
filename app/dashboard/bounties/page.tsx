"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMyPostedBounties, useMyClaimedBounties } from "@/lib/api/hooks/useBounties";
import { getBounties } from "@/lib/api/bounties";
import { getUnreadCount } from "@/lib/api/bountyChat";
import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function BountiesDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posted' | 'claimed' | 'available'>('posted');
  const [postedFilter, setPostedFilter] = useState<'all' | 'pending_review' | 'active' | 'completed'>('all');
  const [availableBounties, setAvailableBounties] = useState<any[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  const { bounties: postedBounties, loading: loadingPosted } = useMyPostedBounties();
  const { bounties: claimedBounties, loading: loadingClaimed } = useMyClaimedBounties();

  // Fetch available bounties when tab changes
  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailableBounties();
    }
  }, [activeTab]);

  // Fetch unread counts for claimed bounties
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const allBounties = [...postedBounties, ...claimedBounties];
      const claimedOrInProgress = allBounties.filter((b: any) => 
        b.status !== 'open' && b.status !== 'cancelled'
      );

      const counts: Record<string, number> = {};
      await Promise.all(
        claimedOrInProgress.map(async (bounty: any) => {
          try {
            const data = await getUnreadCount(bounty.id);
            counts[bounty.id] = data.unread_count || 0;
          } catch (error) {
            counts[bounty.id] = 0;
          }
        })
      );
      setUnreadCounts(counts);
    };

    if (postedBounties.length > 0 || claimedBounties.length > 0) {
      fetchUnreadCounts();
      // Poll every 15 seconds
      const interval = setInterval(fetchUnreadCounts, 15000);
      return () => clearInterval(interval);
    }
  }, [postedBounties, claimedBounties]);

  const fetchAvailableBounties = async () => {
    try {
      setLoadingAvailable(true);
      const data = await getBounties({ status: 'open' });
      const allBounties = data.bounties || data || [];
      
      // Get current user ID
      const userStr = localStorage.getItem('user');
      const currentUserId = userStr ? JSON.parse(userStr).id : null;
      
      // Filter out bounties posted by current user
      const filteredBounties = currentUserId 
        ? allBounties.filter((b: any) => b.poster_id !== currentUserId)
        : allBounties;
      
      setAvailableBounties(filteredBounties);
    } catch (error) {
      console.error("Failed to fetch available bounties:", error);
    } finally {
      setLoadingAvailable(false);
    }
  };

  // Filter posted bounties
  const filteredPostedBounties = postedBounties.filter((bounty: any) => {
    if (postedFilter === 'all') return true;
    if (postedFilter === 'pending_review') return bounty.status === 'submitted';
    if (postedFilter === 'active') return ['open', 'claimed', 'in_progress'].includes(bounty.status);
    if (postedFilter === 'completed') return ['completed', 'cancelled'].includes(bounty.status);
    return true;
  });

  const pendingReviewCount = postedBounties.filter((b: any) => b.status === 'submitted').length;

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

  const activeBounties = activeTab === 'posted' ? filteredPostedBounties : activeTab === 'claimed' ? claimedBounties : availableBounties;
  const loading = activeTab === 'posted' ? loadingPosted : activeTab === 'claimed' ? loadingClaimed : loadingAvailable;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 sm:mb-3">
            💼 My <span className="text-orange-500">Bounties</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage your bounty projects and applications
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link
            href="/bounties/create"
            className="p-4 sm:p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-xl hover:border-orange-500 transition group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                ➕
              </div>
              <div>
                <div className="text-white font-bold text-sm sm:text-base">Create Bounty</div>
                <div className="text-xs sm:text-sm text-slate-400">Post new project</div>
              </div>
            </div>
          </Link>

          <Link
            href="/bounties"
            className="p-4 sm:p-6 bg-slate-900/50 border-2 border-slate-700 rounded-xl hover:border-purple-500/50 transition group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                🔍
              </div>
              <div>
                <div className="text-white font-bold text-sm sm:text-base">Browse Bounties</div>
                <div className="text-xs sm:text-sm text-slate-400">Find projects</div>
              </div>
            </div>
          </Link>

          <div className="p-4 sm:p-6 bg-slate-900/50 border-2 border-slate-700 rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl">
                📝
              </div>
              <div>
                <div className="text-white font-bold text-sm sm:text-base">{postedBounties.length}</div>
                <div className="text-xs sm:text-sm text-slate-400">Posted Bounties</div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-slate-900/50 border-2 border-slate-700 rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl">
                🎯
              </div>
              <div>
                <div className="text-white font-bold text-sm sm:text-base">{claimedBounties.length}</div>
                <div className="text-xs sm:text-sm text-slate-400">Claimed Bounties</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('posted')}
            className={`px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base transition whitespace-nowrap relative ${
              activeTab === 'posted'
                ? 'text-orange-400 border-b-2 border-orange-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            📝 Posted by Me ({postedBounties.length})
            {pendingReviewCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('claimed')}
            className={`px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base transition whitespace-nowrap ${
              activeTab === 'claimed'
                ? 'text-orange-400 border-b-2 border-orange-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            🎯 Claimed by Me ({claimedBounties.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 sm:px-6 py-3 sm:py-4 font-bold text-sm sm:text-base transition whitespace-nowrap ${
              activeTab === 'available'
                ? 'text-orange-400 border-b-2 border-orange-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            🔍 Available to Apply ({availableBounties.length})
          </button>
        </div>

        {/* Filter Tabs for Posted Bounties */}
        {activeTab === 'posted' && postedBounties.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            <button
              onClick={() => setPostedFilter('all')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition ${
                postedFilter === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All ({postedBounties.length})
            </button>
            <button
              onClick={() => setPostedFilter('pending_review')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition relative ${
                postedFilter === 'pending_review'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🔍 Pending Review ({pendingReviewCount})
              {pendingReviewCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button
              onClick={() => setPostedFilter('active')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition ${
                postedFilter === 'active'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setPostedFilter('completed')}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition ${
                postedFilter === 'completed'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Completed
            </button>
          </div>
        )}

        {/* Bounties List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : activeBounties.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4">
              {activeTab === 'posted' 
                ? (postedFilter === 'pending_review' ? '🔍' : postedFilter === 'completed' ? '✅' : '📝')
                : activeTab === 'claimed'
                ? '🎯'
                : '🔍'}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
              {activeTab === 'posted' 
                ? (postedFilter === 'all' ? 'No Posted Bounties' 
                   : postedFilter === 'pending_review' ? 'No Submissions to Review'
                   : postedFilter === 'active' ? 'No Active Bounties'
                   : 'No Completed Bounties')
                : activeTab === 'claimed' 
                ? 'No Claimed Bounties'
                : 'No Available Bounties'}
            </h3>
            <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
              {activeTab === 'posted' 
                ? (postedFilter === 'all' ? 'Create your first bounty to get started'
                   : postedFilter === 'pending_review' ? 'Submissions will appear here when artists submit their work'
                   : postedFilter === 'active' ? 'Your active bounties will appear here'
                   : 'Completed bounties will appear here')
                : activeTab === 'claimed'
                ? 'Browse available bounties and apply to projects'
                : 'Check back later for new bounties to apply for'}
            </p>
            {((activeTab === 'posted' && postedFilter === 'all') || activeTab === 'claimed') ? (
              <Link
                href={activeTab === 'posted' ? '/bounties/create' : '/bounties'}
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold text-sm sm:text-base shadow-lg shadow-orange-500/50"
              >
                {activeTab === 'posted' ? 'Create Bounty' : 'Browse Bounties'}
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {activeBounties.map((bounty: any) => (
              <div
                key={bounty.id}
                onClick={() => router.push(`/bounties/${bounty.id}`)}
                className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 hover:border-orange-500 transition cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition break-words">
                      {bounty.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 sm:px-3 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg text-xs sm:text-sm">
                        {bounty.category}
                      </span>
                      <span className={`px-2 sm:px-3 py-1 border rounded-lg text-xs sm:text-sm font-medium ${getDifficultyColor(bounty.difficulty)}`}>
                        {bounty.difficulty?.toUpperCase()}
                      </span>
                      <span className={`px-2 sm:px-3 py-1 border rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(bounty.status)}`}>
                        {bounty.status?.toUpperCase().replace('_', ' ')}
                      </span>
                      {bounty.has_milestones && (
                        <span className="px-2 sm:px-3 py-1 bg-purple-500/20 border border-purple-500 text-purple-400 rounded-lg text-xs sm:text-sm font-medium">
                          🎯 MILESTONES
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 break-words">
                      {bounty.description}
                    </p>
                  </div>
                  
                  <div className="text-left sm:text-right w-full sm:w-auto flex-shrink-0">
                    <div className="text-2xl sm:text-3xl font-black text-orange-400 mb-1">
                      ${bounty.budget}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400">
                      Due: {new Date(bounty.deadline).toLocaleDateString()}
                    </div>
                    {bounty.max_revisions !== undefined && (
                      <div className="text-xs text-slate-500 mt-1">
                        Revisions: {bounty.revision_count || 0}/{bounty.max_revisions}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 pt-3 sm:pt-4 border-t border-slate-700/50">
                  <div>
                    Created: {new Date(bounty.created_at).toLocaleDateString()}
                  </div>
                  {bounty.claimed_by_username && (
                    <>
                      <div className="hidden sm:block">•</div>
                      <div className="w-full sm:w-auto">
                        {activeTab === 'posted' ? 'Claimed by' : 'Posted by'}{' '}
                        <span className="text-orange-400 font-medium">
                          {activeTab === 'posted' ? bounty.claimed_by_username : bounty.poster_username}
                        </span>
                      </div>
                    </>
                  )}
                  {bounty.has_milestones && bounty.milestones && (
                    <>
                      <div className="hidden sm:block">•</div>
                      <div className="w-full sm:w-auto">
                        Milestones: {bounty.milestones.filter((m: any) => m.status === 'completed').length}/{bounty.milestones.length} completed
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {/* Chat button for claimed bounties */}
                  {bounty.status !== 'open' && bounty.status !== 'cancelled' && (
                    <Link
                      href={`/bounties/${bounty.id}/chat`}
                      onClick={(e) => e.stopPropagation()}
                      className="relative px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500/30 to-red-600/30 border border-orange-500/50 text-orange-400 rounded-lg hover:from-orange-500/40 hover:to-red-600/40 transition text-xs sm:text-sm font-semibold"
                    >
                      💬 Chat
                      {unreadCounts[bounty.id] > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadCounts[bounty.id] > 9 ? '9+' : unreadCounts[bounty.id]}
                        </span>
                      )}
                    </Link>
                  )}

                  {activeTab === 'available' && bounty.status === 'open' && (
                    <Link
                      href={`/bounties/${bounty.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-400 hover:to-emerald-400 transition text-xs sm:text-sm font-semibold shadow-lg shadow-green-500/50"
                    >
                      📋 View & Apply
                    </Link>
                  )}
                  {activeTab === 'posted' && bounty.status === 'submitted' && (
                    <>
                      <Link
                        href={`/bounties/${bounty.id}/review`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition text-xs sm:text-sm font-semibold shadow-lg shadow-orange-500/50 animate-pulse"
                      >
                        🔍 Review Submission
                      </Link>
                      {bounty.submission_type && (
                        <div className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg text-xs font-medium">
                          {bounty.submission_type === 'upload' ? '📦 Model Uploaded' : '🔗 External Link'}
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === 'posted' && bounty.status === 'open' && (
                    <Link
                      href={`/bounties/${bounty.id}/applications`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-xs sm:text-sm font-semibold"
                    >
                      View Applications
                    </Link>
                  )}
                  {bounty.has_milestones && (
                    <Link
                      href={`/bounties/${bounty.id}/milestones`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-xs sm:text-sm font-semibold"
                    >
                      Milestones
                    </Link>
                  )}
                  {activeTab === 'claimed' && bounty.status === 'claimed' && (
                    <Link
                      href={`/bounties/${bounty.id}/submit`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition text-xs sm:text-sm font-semibold"
                    >
                      Submit Work
                    </Link>
                  )}
                  <Link
                    href={`/bounties/${bounty.id}/extensions`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition text-xs sm:text-sm font-semibold"
                    >
                    Extensions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
