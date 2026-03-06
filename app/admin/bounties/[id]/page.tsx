"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminApi } from "@/lib/api/admin";
import ConfirmModal from "@/components/ConfirmModal";
import InputModal from "@/components/InputModal";
import AlertModal from "@/components/AlertModal";

export default function AdminBountyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as string; // UUID string, not integer
  
  const [loading, setLoading] = useState(true);
  const [bounty, setBounty] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [submission, setSubmission] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);

  // Modal states
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; status: string }>({ isOpen: false, status: "" });
  const [payoutModal, setPayoutModal] = useState(false);
  const [banReasonModal, setBanReasonModal] = useState<{ isOpen: boolean; userId: number | null; username: string }>({ isOpen: false, userId: null, username: "" });
  const [banDurationModal, setBanDurationModal] = useState<{ isOpen: boolean; userId: number | null; username: string; reason: string }>({ isOpen: false, userId: null, username: "", reason: "" });
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: "success" | "error" }>({ isOpen: false, title: "", message: "", type: "success" });

  useEffect(() => {
    fetchData();
  }, [bountyId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getBountyDetails(bountyId);
      setBounty(data.bounty);
      setApplications(data.applications || []);
      setSubmission(data.submission);
      
      const txData = await adminApi.getBountyTransactions(bountyId);
      setTransactions(txData.transactions || []);
    } catch (err) {
      console.error("Failed to fetch bounty details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!statusModal.status) return;

    try {
      setProcessing(true);
      await adminApi.updateBountyStatus(bountyId, statusModal.status);
      fetchData();
      setAlertModal({ isOpen: true, title: "Success", message: "Status updated successfully", type: "success" });
    } catch (err) {
      setAlertModal({ isOpen: true, title: "Error", message: "Failed to update status", type: "error" });
    } finally {
      setProcessing(false);
      setStatusModal({ isOpen: false, status: "" });
    }
  };

  const handleApprovePayout = async () => {
    try {
      setProcessing(true);
      await adminApi.approveBountyPayout(bountyId);
      fetchData();
      setAlertModal({ isOpen: true, title: "Success", message: "Payout approved successfully", type: "success" });
    } catch (err) {
      setAlertModal({ isOpen: true, title: "Error", message: "Failed to approve payout", type: "error" });
    } finally {
      setProcessing(false);
      setPayoutModal(false);
    }
  };

  const handleBanReason = async (reason: string) => {
    if (!banReasonModal.userId) return;
    
    // Move to duration modal
    setBanReasonModal({ isOpen: false, userId: null, username: "" });
    setBanDurationModal({ 
      isOpen: true, 
      userId: banReasonModal.userId, 
      username: banReasonModal.username, 
      reason 
    });
  };

  const handleBanDuration = async (duration: string) => {
    if (!banDurationModal.userId) return;

    try {
      setProcessing(true);
      await adminApi.banUserFromBounties(
        banDurationModal.userId, 
        banDurationModal.reason, 
        duration ? parseInt(duration) : undefined
      );
      setAlertModal({ isOpen: true, title: "Success", message: "User banned from bounties", type: "success" });
    } catch (err) {
      setAlertModal({ isOpen: true, title: "Error", message: "Failed to ban user", type: "error" });
    } finally {
      setProcessing(false);
      setBanDurationModal({ isOpen: false, userId: null, username: "", reason: "" });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout title="Bounty Details">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading bounty details...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (!bounty) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout title="Bounty Details">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-2xl font-bold text-white mb-2">Bounty not found</h3>
            <Link href="/admin/bounties" className="text-purple-400 hover:text-purple-300">
              ← Back to bounties
            </Link>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout title={`Bounty #${bountyId}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/bounties"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            ← Back to bounties
          </Link>
          <div className="flex gap-2">
            {bounty.status === "disputed" && (
              <Link
                href={`/admin/bounties/${bountyId}/resolve`}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition font-semibold text-sm"
              >
                Resolve Dispute
              </Link>
            )}
          </div>
        </div>

        {/* Bounty Info */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-3xl font-black text-white mb-4">{bounty.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg text-sm font-medium">
                  {bounty.status?.toUpperCase().replace('_', ' ')}
                </span>
                <span className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg text-sm">
                  {bounty.category}
                </span>
                <span className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 text-slate-300 rounded-lg text-sm">
                  {bounty.difficulty?.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-black text-yellow-400 mb-2">${bounty.budget}</div>
              <div className="text-sm text-gray-400">
                Deadline: {new Date(bounty.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
            <div>
              <div className="text-xs text-gray-400">Poster</div>
              <div className="text-white font-medium">{bounty.poster_username}</div>
              <button
                onClick={() => setBanReasonModal({ isOpen: true, userId: bounty.poster_id, username: bounty.poster_username })}
                className="text-xs text-red-400 hover:text-red-300 mt-1"
              >
                Ban user
              </button>
            </div>
            {bounty.claimed_by_username && (
              <div>
                <div className="text-xs text-gray-400">Artist</div>
                <div className="text-white font-medium">{bounty.claimed_by_username}</div>
                <button
                  onClick={() => setBanReasonModal({ isOpen: true, userId: bounty.claimed_by_id, username: bounty.claimed_by_username })}
                  className="text-xs text-red-400 hover:text-red-300 mt-1"
                >
                  Ban user
                </button>
              </div>
            )}
            <div>
              <div className="text-xs text-gray-400">Created</div>
              <div className="text-white font-medium">
                {new Date(bounty.created_at).toLocaleDateString()}
              </div>
            </div>
            {bounty.completed_at && (
              <div>
                <div className="text-xs text-gray-400">Completed</div>
                <div className="text-white font-medium">
                  {new Date(bounty.completed_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Description</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{bounty.description}</p>
        </div>

        {/* Requirements */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
          <ul className="space-y-2">
            {bounty.requirements?.map((req: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <span className="text-yellow-400 mt-1">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Applications */}
        {applications.length > 0 && (
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Applications ({applications.length})
            </h3>
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div key={app.id} className="p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-white">{app.applicant_username}</div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      app.status === "approved" ? "bg-green-500/20 text-green-400" :
                      app.status === "rejected" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{app.proposal}</p>
                  <div className="text-xs text-gray-400">
                    Estimated delivery: {new Date(app.estimated_delivery).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submission */}
        {submission && (
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Submission</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">
                  {submission.submission_type === 'upload' ? 'Uploaded Model' : 'External Model Link'}
                </div>
                {submission.submission_type === 'upload' ? (
                  <a
                    href={submission.model_file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition font-semibold text-sm"
                  >
                    Download Model →
                  </a>
                ) : (
                  <a
                    href={submission.external_model_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-semibold text-sm"
                  >
                    Open External Link →
                  </a>
                )}
              </div>
              {submission.notes && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">Notes</div>
                  <p className="text-gray-300">{submission.notes}</p>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-400 mb-2">Status</div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  submission.status === "approved" ? "bg-green-500/20 text-green-400" :
                  submission.status === "rejected" ? "bg-red-500/20 text-red-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {submission.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        {transactions.length > 0 && (
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Transactions</h3>
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-950/50 rounded-lg border border-slate-700/50">
                  <div>
                    <div className="text-white font-medium">{tx.type}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(tx.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-yellow-400">${tx.amount}</div>
                    <div className="text-xs text-gray-400">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Actions */}
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-red-600/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Admin Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setStatusModal({ isOpen: true, status: "open" })}
              disabled={processing}
              className="px-4 py-3 bg-green-600/20 border border-green-600/50 text-green-400 rounded-lg hover:bg-green-600/30 transition font-semibold disabled:opacity-50"
            >
              Set to Open
            </button>
            <button
              onClick={() => setStatusModal({ isOpen: true, status: "in_progress" })}
              disabled={processing}
              className="px-4 py-3 bg-yellow-600/20 border border-yellow-600/50 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition font-semibold disabled:opacity-50"
            >
              Set to In Progress
            </button>
            <button
              onClick={() => setStatusModal({ isOpen: true, status: "completed" })}
              disabled={processing}
              className="px-4 py-3 bg-purple-600/20 border border-purple-600/50 text-purple-400 rounded-lg hover:bg-purple-600/30 transition font-semibold disabled:opacity-50"
            >
              Mark Completed
            </button>
            <button
              onClick={() => setPayoutModal(true)}
              disabled={processing}
              className="px-4 py-3 bg-blue-600/20 border border-blue-600/50 text-blue-400 rounded-lg hover:bg-blue-600/30 transition font-semibold disabled:opacity-50"
            >
              Approve Payout
            </button>
            <button
              onClick={() => router.push(`/admin/bounties/${bountyId}/resolve`)}
              disabled={processing}
              className="px-4 py-3 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition font-semibold disabled:opacity-50"
            >
              Resolve Dispute
            </button>
            <button
              onClick={() => setStatusModal({ isOpen: true, status: "cancelled" })}
              disabled={processing}
              className="px-4 py-3 bg-gray-600/20 border border-gray-600/50 text-gray-400 rounded-lg hover:bg-gray-600/30 transition font-semibold disabled:opacity-50"
            >
              Cancel Bounty
            </button>
          </div>
        </div>
      </AdminLayout>

      {/* Modals */}
      <ConfirmModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, status: "" })}
        onConfirm={handleStatusChange}
        title="Change Bounty Status"
        message={`Are you sure you want to change the bounty status to "${statusModal.status}"?`}
        confirmText="Change Status"
        type="warning"
      />

      <ConfirmModal
        isOpen={payoutModal}
        onClose={() => setPayoutModal(false)}
        onConfirm={handleApprovePayout}
        title="Approve Payout"
        message="Manually approve payout and release escrow? This action cannot be undone."
        confirmText="Approve Payout"
        type="warning"
      />

      <InputModal
        isOpen={banReasonModal.isOpen}
        onClose={() => setBanReasonModal({ isOpen: false, userId: null, username: "" })}
        onConfirm={handleBanReason}
        title={`Ban ${banReasonModal.username}`}
        message="Enter the reason for banning this user from bounties:"
        placeholder="e.g., Violated terms of service"
        confirmText="Continue"
      />

      <InputModal
        isOpen={banDurationModal.isOpen}
        onClose={() => setBanDurationModal({ isOpen: false, userId: null, username: "", reason: "" })}
        onConfirm={handleBanDuration}
        title="Ban Duration"
        message="Enter ban duration in days (leave empty for permanent ban):"
        placeholder="e.g., 30"
        type="number"
        required={false}
        confirmText="Ban User"
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </ProtectedRoute>
  );
}
