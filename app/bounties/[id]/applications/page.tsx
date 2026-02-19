"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBounty, useBountyApplications } from "@/lib/api/hooks/useBounties";
import { approveApplication, rejectApplication } from "@/lib/api/bounties";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function BountyApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = parseInt(params.id as string);
  
  const { bounty, loading: bountyLoading } = useBounty(bountyId);
  const { applications, loading: appsLoading, error } = useBountyApplications(bountyId);
  const [processing, setProcessing] = useState<number | null>(null);

  const handleApprove = async (applicationId: number) => {
    if (!confirm("Approve this application? The artist will be assigned to this bounty.")) return;

    try {
      setProcessing(applicationId);
      await approveApplication(bountyId, applicationId);
      router.push(`/bounties/${bountyId}/manage`);
    } catch (err) {
      alert("Failed to approve application");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (applicationId: number) => {
    if (!confirm("Reject this application?")) return;

    try {
      setProcessing(applicationId);
      await rejectApplication(bountyId, applicationId);
      window.location.reload();
    } catch (err) {
      alert("Failed to reject application");
    } finally {
      setProcessing(null);
    }
  };

  if (bountyLoading || appsLoading) return <LoadingSpinner />;
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
              Applications
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href={`/bounties/${bountyId}`} className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              View Bounty
            </Link>
            <Link href="/bounties/my-posted" className="text-sm sm:text-base text-slate-400 hover:text-slate-300 transition">
              My Bounties
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Bounty Info */}
        <div className="bg-slate-900/50 border-2 border-orange-500/30 rounded-xl p-6 backdrop-blur mb-8">
          <h2 className="text-2xl font-black text-white mb-2">{bounty?.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div>
              <span className="text-orange-400 font-bold">${bounty?.budget}</span> budget
            </div>
            <div>•</div>
            <div>
              Deadline: {bounty?.deadline && new Date(bounty.deadline).toLocaleDateString()}
            </div>
            <div>•</div>
            <div>
              <span className="text-white font-medium">{applications.length}</span> applications
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-2">
            📝 Applications <span className="text-orange-500">({applications.length})</span>
          </h3>
          <p className="text-slate-400">
            Review applications and choose the best artist for your project.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border-2 border-orange-500/30 rounded-2xl">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-white mb-2">No applications yet</h3>
            <p className="text-slate-400">Artists will apply soon. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app: any) => (
              <div
                key={app.id}
                className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      {app.applicant_username}
                    </h4>
                    <div className="text-sm text-slate-400">
                      Applied {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400 mb-1">Estimated Delivery</div>
                    <div className="text-white font-semibold">
                      {new Date(app.estimated_delivery).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Proposal */}
                <div className="mb-4">
                  <div className="text-sm text-slate-400 mb-2">Proposal</div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {app.proposal}
                  </p>
                </div>

                {/* Portfolio Links */}
                {app.portfolio_links && app.portfolio_links.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-slate-400 mb-2">Portfolio</div>
                    <div className="flex flex-wrap gap-2">
                      {app.portfolio_links.map((link: string, index: number) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition text-sm"
                        >
                          View Portfolio {index + 1} →
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {app.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={processing === app.id}
                      className="flex-1 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition font-semibold disabled:opacity-50"
                    >
                      {processing === app.id ? "Processing..." : "Reject"}
                    </button>
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={processing === app.id}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 disabled:opacity-50"
                    >
                      {processing === app.id ? "Processing..." : "Approve & Assign"}
                    </button>
                  </div>
                )}

                {app.status === "approved" && (
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-center font-semibold">
                      ✓ Approved - Artist Assigned
                    </div>
                  </div>
                )}

                {app.status === "rejected" && (
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-center font-semibold">
                      ✗ Rejected
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
