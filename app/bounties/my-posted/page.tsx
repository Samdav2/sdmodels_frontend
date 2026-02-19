"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMyPostedBounties } from "@/lib/api/hooks/useBounties";
import { cancelBounty } from "@/lib/api/bounties";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function MyPostedBountiesPage() {
  const router = useRouter();
  const { bounties, loading, error } = useMyPostedBounties();
  const [cancelling, setCancelling] = useState<number | null>(null);

  const handleCancel = async (bountyId: number) => {
    if (!confirm("Are you sure you want to cancel this bounty?")) return;

    try {
      setCancelling(bountyId);
      await cancelBounty(bountyId);
      window.location.reload();
    } catch (err) {
      alert("Failed to cancel bounty");
    } finally {
      setCancelling(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-green-400 bg-green-500/20 border-green-500";
      case "claimed":
      case "in_progress":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500";
      case "submitted":
        return "text-blue-400 bg-blue-500/20 border-blue-500";
      case "completed":
        return "text-purple-400 bg-purple-500/20 border-purple-500";
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
              My Posted Bounties
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href="/bounties/create" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-sm">
              + New Bounty
            </Link>
            <Link href="/bounties" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Browse
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            📋 Your <span className="text-orange-500">Posted Bounties</span>
          </h2>
          <p className="text-slate-400">
            Manage your bounties, review applications, and approve submissions.
          </p>
        </div>

        {bounties.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-2">No bounties yet</h3>
            <p className="text-slate-400 mb-6">Create your first bounty to get started</p>
            <Link
              href="/bounties/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold"
            >
              Create Bounty
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
                        <span className="text-orange-400 font-bold">${bounty.budget}</span> budget
                      </div>
                      <div>•</div>
                      <div>
                        Deadline: {new Date(bounty.deadline).toLocaleDateString()}
                      </div>
                      <div>•</div>
                      <div>
                        {bounty.category}
                      </div>
                      {bounty.claimed_by_username && (
                        <>
                          <div>•</div>
                          <div>
                            Claimed by <span className="text-white font-medium">{bounty.claimed_by_username}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    {bounty.status === "open" && (
                      <>
                        <Link
                          href={`/bounties/${bounty.id}/applications`}
                          className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold text-center text-sm"
                        >
                          View Applications
                        </Link>
                        <button
                          onClick={() => handleCancel(bounty.id)}
                          disabled={cancelling === bounty.id}
                          className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition font-semibold text-sm disabled:opacity-50"
                        >
                          {cancelling === bounty.id ? "Cancelling..." : "Cancel Bounty"}
                        </button>
                      </>
                    )}

                    {(bounty.status === "claimed" || bounty.status === "in_progress") && (
                      <Link
                        href={`/bounties/${bounty.id}/manage`}
                        className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold text-center text-sm"
                      >
                        Manage Bounty
                      </Link>
                    )}

                    {bounty.status === "submitted" && (
                      <Link
                        href={`/bounties/${bounty.id}/review`}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-center text-sm shadow-lg shadow-orange-500/50"
                      >
                        Review Submission
                      </Link>
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
      </main>
    </div>
  );
}
