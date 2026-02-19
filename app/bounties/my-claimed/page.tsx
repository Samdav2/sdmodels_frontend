"use client";

import Link from "next/link";
import { useMyClaimedBounties } from "@/lib/api/hooks/useBounties";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function MyClaimedBountiesPage() {
  const { bounties, loading, error } = useMyClaimedBounties();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "claimed":
      case "in_progress":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "submitted":
        return "text-blue-400 bg-blue-500/20 border-blue-500";
      case "completed":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "cancelled":
        return "text-red-400 bg-red-500/20 border-red-500";
      default:
        return "text-slate-400 bg-slate-500/20 border-slate-500";
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg">SD</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              My Claimed Bounties
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href="/bounties" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Browse Bounties
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            🎨 Your <span className="text-orange-500">Active Work</span>
          </h2>
          <p className="text-slate-400">
            Track your claimed bounties and submit your completed work.
          </p>
        </div>

        {bounties.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">No claimed bounties</h3>
            <p className="text-slate-400 mb-6">Browse available bounties and start earning!</p>
            <Link
              href="/bounties"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold"
            >
              Browse Bounties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bounties.map((bounty: any) => (
              <div
                key={bounty.id}
                className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur hover:border-orange-500 transition"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{bounty.title}</h3>
                      <span className={`px-3 py-1 border rounded-lg text-xs font-medium whitespace-nowrap ml-4 ${getStatusColor(bounty.status)}`}>
                        {bounty.status?.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {bounty.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <div>
                        <span className="text-orange-400 font-bold">${bounty.budget}</span> payment
                      </div>
                      <div>•</div>
                      <div>
                        Deadline: {new Date(bounty.deadline).toLocaleDateString()}
                      </div>
                      <div>•</div>
                      <div>
                        Client: <span className="text-white font-medium">{bounty.poster_username}</span>
                      </div>
                      {bounty.claimed_at && (
                        <>
                          <div>•</div>
                          <div>
                            Claimed: {new Date(bounty.claimed_at).toLocaleDateString()}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-3 h-3 rounded-full ${
                          bounty.status === "completed" ? "bg-green-500" :
                          bounty.status === "submitted" ? "bg-blue-500" :
                          "bg-yellow-500 animate-pulse"
                        }`} />
                        <span className="text-slate-300">
                          {bounty.status === "completed" && "Payment received"}
                          {bounty.status === "submitted" && "Awaiting buyer review"}
                          {(bounty.status === "claimed" || bounty.status === "in_progress") && "Work in progress"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    {(bounty.status === "claimed" || bounty.status === "in_progress") && (
                      <Link
                        href={`/bounties/${bounty.id}/submit`}
                        className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-center text-sm shadow-lg shadow-orange-500/50"
                      >
                        Submit Work
                      </Link>
                    )}

                    {bounty.status === "submitted" && (
                      <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg text-center text-sm font-semibold">
                        ⏳ Under Review
                      </div>
                    )}

                    {bounty.status === "completed" && (
                      <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-center text-sm font-semibold">
                        ✓ Completed
                      </div>
                    )}

                    <Link
                      href={`/bounties/${bounty.id}`}
                      className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold text-center text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Earnings Summary */}
        {bounties.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
              <div className="text-sm text-slate-400 mb-2">Active Bounties</div>
              <div className="text-3xl font-black text-white">
                {bounties.filter((b: any) => b.status === "claimed" || b.status === "in_progress").length}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-blue-500/30 rounded-xl p-6 backdrop-blur">
              <div className="text-sm text-slate-400 mb-2">Pending Review</div>
              <div className="text-3xl font-black text-blue-400">
                {bounties.filter((b: any) => b.status === "submitted").length}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-green-500/30 rounded-xl p-6 backdrop-blur">
              <div className="text-sm text-slate-400 mb-2">Total Earned</div>
              <div className="text-3xl font-black text-green-400">
                ${bounties.filter((b: any) => b.status === "completed").reduce((sum: number, b: any) => sum + b.budget, 0)}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
