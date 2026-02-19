"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminApi } from "@/lib/api/admin";

export default function AdminBountyDisputesPage() {
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<any[]>([]);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getBountyDisputes();
      setDisputes(data.disputes || data);
    } catch (err) {
      console.error("Failed to fetch disputes:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Bounty Disputes">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading disputes...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Bounty Disputes">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">Resolve disputes between buyers and artists</p>
          <Link
            href="/admin/bounties"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            ← Back to bounties
          </Link>
        </div>

        {/* Disputes List */}
        {disputes.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-2">No active disputes</h3>
            <p className="text-gray-400">All bounties are running smoothly!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-slate-900/70 backdrop-blur-xl border-2 border-red-600/30 rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {dispute.bounty_title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-xs font-medium">
                            🚨 DISPUTED
                          </span>
                          <span className="px-3 py-1 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg text-xs">
                            #{dispute.bounty_id}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-black text-yellow-400">
                          ${dispute.bounty_budget}
                        </div>
                        <div className="text-xs text-gray-400">At stake</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Buyer</div>
                        <div className="text-white font-medium">{dispute.buyer_username}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Artist</div>
                        <div className="text-white font-medium">{dispute.artist_username}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">Dispute Reason</div>
                      <p className="text-gray-300">{dispute.reason || "No reason provided"}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div>
                        Opened: {new Date(dispute.created_at).toLocaleDateString()}
                      </div>
                      <div>•</div>
                      <div>
                        Status: <span className="text-red-400 font-medium">{dispute.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-48">
                    <Link
                      href={`/admin/bounties/${dispute.bounty_id}/resolve`}
                      className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition font-semibold text-center text-sm"
                    >
                      Resolve Dispute
                    </Link>
                    <Link
                      href={`/admin/bounties/${dispute.bounty_id}`}
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
      </AdminLayout>
    </ProtectedRoute>
  );
}
