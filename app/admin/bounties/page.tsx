"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminApi } from "@/lib/api/admin";

export default function AdminBountiesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bounties, setBounties] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bountiesData, statsData] = await Promise.all([
        adminApi.getBounties({ 
          status: filter === "all" ? undefined : filter,
          search: searchTerm || undefined 
        }),
        adminApi.getBountyStats()
      ]);
      setBounties(bountiesData.bounties || bountiesData);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch bounties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForceClose = async (id: number) => {
    const reason = prompt("Enter reason for closing this bounty:");
    if (!reason) return;

    try {
      setProcessing(id);
      await adminApi.forceCloseBounty(id, reason);
      fetchData();
    } catch (err) {
      alert("Failed to close bounty");
    } finally {
      setProcessing(null);
    }
  };

  const handleRefund = async (id: number) => {
    const reason = prompt("Enter reason for refund:");
    if (!reason) return;

    if (!confirm("Issue full refund to buyer?")) return;

    try {
      setProcessing(id);
      await adminApi.refundBounty(id, reason);
      fetchData();
    } catch (err) {
      alert("Failed to refund bounty");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-500/20 text-green-400 border-green-500";
      case "claimed":
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
      case "submitted":
        return "bg-blue-500/20 text-blue-400 border-blue-500";
      case "completed":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500";
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Bounty Management">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading bounties...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Bounty Management">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <p className="text-gray-400">Manage all bounties, resolve disputes, and configure settings</p>
          <div className="flex gap-2">
            <Link
              href="/admin/bounties/disputes"
              className="px-4 py-2 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition font-semibold text-sm"
            >
              🚨 Disputes
            </Link>
            <Link
              href="/admin/bounties/settings"
              className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 text-purple-400 rounded-lg hover:bg-purple-600/30 transition font-semibold text-sm"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Total Bounties</div>
              <div className="text-3xl font-black text-white">{stats.total_bounties || 0}</div>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-green-600/30 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Active</div>
              <div className="text-3xl font-black text-green-400">{stats.active_bounties || 0}</div>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-blue-600/30 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Total Value</div>
              <div className="text-3xl font-black text-blue-400">${stats.total_value || 0}</div>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-red-600/30 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Disputes</div>
              <div className="text-3xl font-black text-red-400">{stats.disputed_bounties || 0}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { value: "all", label: "All", icon: "📋" },
              { value: "open", label: "Open", icon: "🟢" },
              { value: "claimed", label: "Claimed", icon: "🟡" },
              { value: "submitted", label: "Submitted", icon: "🔵" },
              { value: "disputed", label: "Disputed", icon: "🔴" },
              { value: "completed", label: "Completed", icon: "✅" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm ${
                  filter === f.value
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-slate-900/50 text-gray-400 border border-slate-700/50 hover:border-purple-600/50"
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
            placeholder="Search bounties..."
            className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none"
          />
        </div>

        {/* Bounties List */}
        {bounties.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-white mb-2">No bounties found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bounties.map((bounty) => (
              <div
                key={bounty.id}
                className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 hover:border-yellow-600/50 transition"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{bounty.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 border rounded-lg text-xs font-medium ${getStatusColor(bounty.status)}`}>
                            {bounty.status?.toUpperCase().replace('_', ' ')}
                          </span>
                          <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg text-xs">
                            {bounty.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-black text-yellow-400">${bounty.budget}</div>
                        <div className="text-xs text-gray-400">ID: #{bounty.id}</div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{bounty.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div>
                        Posted by <span className="text-white font-medium">{bounty.poster_username}</span>
                      </div>
                      {bounty.claimed_by_username && (
                        <>
                          <div>•</div>
                          <div>
                            Claimed by <span className="text-yellow-400 font-medium">{bounty.claimed_by_username}</span>
                          </div>
                        </>
                      )}
                      <div>•</div>
                      <div>
                        Deadline: {new Date(bounty.deadline).toLocaleDateString()}
                      </div>
                      <div>•</div>
                      <div>
                        Created: {new Date(bounty.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-56">
                    <Link
                      href={`/admin/bounties/${bounty.id}`}
                      className="px-4 py-2 bg-purple-600/20 border border-purple-600/50 text-purple-400 rounded-lg hover:bg-purple-600/30 transition font-semibold text-center text-sm"
                    >
                      View Details
                    </Link>

                    {bounty.status === "disputed" && (
                      <Link
                        href={`/admin/bounties/${bounty.id}/resolve`}
                        className="px-4 py-2 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition font-semibold text-center text-sm"
                      >
                        Resolve Dispute
                      </Link>
                    )}

                    {bounty.status === "submitted" && (
                      <Link
                        href={`/admin/bounties/${bounty.id}/review`}
                        className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 text-blue-400 rounded-lg hover:bg-blue-600/30 transition font-semibold text-center text-sm"
                      >
                        Review Submission
                      </Link>
                    )}

                    {(bounty.status === "open" || bounty.status === "claimed" || bounty.status === "in_progress") && (
                      <button
                        onClick={() => handleForceClose(bounty.id)}
                        disabled={processing === bounty.id}
                        className="px-4 py-2 bg-orange-600/20 border border-orange-600/50 text-orange-400 rounded-lg hover:bg-orange-600/30 transition font-semibold text-sm disabled:opacity-50"
                      >
                        {processing === bounty.id ? "Closing..." : "Force Close"}
                      </button>
                    )}

                    {bounty.status !== "completed" && bounty.status !== "cancelled" && (
                      <button
                        onClick={() => handleRefund(bounty.id)}
                        disabled={processing === bounty.id}
                        className="px-4 py-2 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition font-semibold text-sm disabled:opacity-50"
                      >
                        {processing === bounty.id ? "Processing..." : "Issue Refund"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
