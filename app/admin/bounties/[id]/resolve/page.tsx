"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminApi } from "@/lib/api/admin";

export default function ResolveDisputePage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [bounty, setBounty] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [resolution, setResolution] = useState({
    winner: "" as "buyer" | "artist" | "",
    refund_percentage: 100,
    notes: "",
  });

  useEffect(() => {
    fetchBounty();
  }, [bountyId]);

  const fetchBounty = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getBountyDetails(bountyId);
      setBounty(data.bounty);
    } catch (err) {
      console.error("Failed to fetch bounty:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution.winner) {
      alert("Please select a winner");
      return;
    }

    if (!resolution.notes.trim()) {
      alert("Please provide resolution notes");
      return;
    }

    if (!confirm(`Resolve dispute in favor of ${resolution.winner}?`)) return;

    try {
      setProcessing(true);
      await adminApi.resolveBountyDispute(bountyId, {
        winner: resolution.winner,
        refund_percentage: resolution.winner === "buyer" ? resolution.refund_percentage : undefined,
        notes: resolution.notes,
      });
      router.push("/admin/bounties/disputes");
    } catch (err) {
      alert("Failed to resolve dispute");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Resolve Dispute">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading dispute details...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (!bounty) {
    return (
      <ProtectedRoute>
        <AdminLayout title="Resolve Dispute">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-white mb-2">Bounty not found</h3>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout title="Resolve Dispute">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/bounties/disputes"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            ← Back to disputes
          </Link>
        </div>

        {/* Bounty Info */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-red-600/30 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-black text-white mb-4">{bounty.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-400">Bounty ID</div>
              <div className="text-white font-bold">#{bounty.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Budget</div>
              <div className="text-yellow-400 font-bold">${bounty.budget}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Buyer</div>
              <div className="text-white font-medium">{bounty.poster_username}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Artist</div>
              <div className="text-white font-medium">{bounty.claimed_by_username || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Resolution Form */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-6">Dispute Resolution</h3>

          {/* Winner Selection */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">
              Who should win the dispute? <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setResolution(prev => ({ ...prev, winner: "buyer" }))}
                className={`p-6 rounded-xl border-2 transition ${
                  resolution.winner === "buyer"
                    ? "bg-blue-600/20 border-blue-600 text-blue-400"
                    : "bg-slate-950/50 border-slate-700 text-gray-400 hover:border-blue-600/50"
                }`}
              >
                <div className="text-4xl mb-2">👤</div>
                <div className="font-bold text-lg">Buyer Wins</div>
                <div className="text-sm mt-2">
                  Refund buyer, artist gets nothing
                </div>
              </button>

              <button
                onClick={() => setResolution(prev => ({ ...prev, winner: "artist" }))}
                className={`p-6 rounded-xl border-2 transition ${
                  resolution.winner === "artist"
                    ? "bg-green-600/20 border-green-600 text-green-400"
                    : "bg-slate-950/50 border-slate-700 text-gray-400 hover:border-green-600/50"
                }`}
              >
                <div className="text-4xl mb-2">🎨</div>
                <div className="font-bold text-lg">Artist Wins</div>
                <div className="text-sm mt-2">
                  Release payment to artist
                </div>
              </button>
            </div>
          </div>

          {/* Refund Percentage (if buyer wins) */}
          {resolution.winner === "buyer" && (
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3">
                Refund Percentage
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={resolution.refund_percentage}
                  onChange={(e) => setResolution(prev => ({ 
                    ...prev, 
                    refund_percentage: parseInt(e.target.value) 
                  }))}
                  className="flex-1"
                />
                <div className="text-2xl font-bold text-white w-20 text-right">
                  {resolution.refund_percentage}%
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Buyer receives: ${(bounty.budget * resolution.refund_percentage / 100).toFixed(2)} | 
                Artist receives: ${(bounty.budget * (100 - resolution.refund_percentage) / 100).toFixed(2)}
              </p>
            </div>
          )}

          {/* Resolution Notes */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3">
              Resolution Notes <span className="text-red-400">*</span>
            </label>
            <textarea
              value={resolution.notes}
              onChange={(e) => setResolution(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Explain your decision and reasoning..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none transition resize-none"
            />
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-sm">
              ⚠️ This action is final and cannot be undone. Both parties will be notified of your decision.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              href="/admin/bounties/disputes"
              className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold text-center"
            >
              Cancel
            </Link>
            <button
              onClick={handleResolve}
              disabled={processing || !resolution.winner || !resolution.notes.trim()}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Resolving..." : "Resolve Dispute"}
            </button>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
