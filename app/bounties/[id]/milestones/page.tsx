"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BountyMilestonesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bounty, setBounty] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
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

  useEffect(() => {
    fetchBountyAndMilestones();
  }, [params.id]);

  const fetchBountyAndMilestones = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Fetch bounty details
      const bountyRes = await fetch(`http://localhost:8000/api/v1/bounties/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bountyData = await bountyRes.json();
      setBounty(bountyData);

      // Fetch milestones
      const milestonesRes = await fetch(`http://localhost:8000/api/v1/bounties/${params.id}/milestones`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const milestonesData = await milestonesRes.json();
      setMilestones(milestonesData.milestones || []);
    } catch (error) {
      showNotification("error", "Error", "Failed to load milestones");
    } finally {
      setLoading(false);
    }
  };

  const handleStartMilestone = async (milestoneId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:8000/api/v1/bounties/${params.id}/milestones/${milestoneId}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      showNotification("success", "Started!", "Milestone started successfully");
      fetchBountyAndMilestones();
    } catch (error) {
      showNotification("error", "Error", "Failed to start milestone");
    }
  };

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'submitted': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) return <LoadingSpinner />;

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
      <nav className="border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link href={`/bounties/${params.id}`} className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition">
            <span className="text-lg sm:text-xl">←</span>
            <span className="font-semibold text-sm sm:text-base">Back to Bounty</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
            Project Milestones
          </h1>
          <p className="text-sm sm:text-base text-gray-400">{bounty?.title}</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">Progress Overview</h2>
            <div className="text-sm sm:text-base text-gray-400">
              {milestones.filter(m => m.status === 'completed').length} of {milestones.length} completed
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 sm:h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
              style={{ width: `${(milestones.filter(m => m.status === 'completed').length / milestones.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-4 sm:space-y-6">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                {/* Milestone Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-2xl sm:text-3xl font-black text-orange-400">
                        #{milestone.order}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 mb-3">
                      {milestone.description}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full border text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusColor(milestone.status)}`}>
                    {milestone.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Milestone Details */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Amount</div>
                    <div className="text-base sm:text-lg font-bold text-orange-400">
                      ${milestone.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Deadline</div>
                    <div className="text-sm sm:text-base font-semibold text-white">
                      {new Date(milestone.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-3 col-span-2 sm:col-span-1">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className="text-sm sm:text-base font-semibold text-white capitalize">
                      {milestone.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {milestone.status === 'pending' && bounty?.claimed_by_id && (
                  <button
                    onClick={() => handleStartMilestone(milestone.id)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition font-semibold text-sm sm:text-base"
                  >
                    Start Working
                  </button>
                )}
                
                {milestone.status === 'in_progress' && (
                  <Link
                    href={`/bounties/${params.id}/submit?milestone=${milestone.id}`}
                    className="block w-full sm:w-auto text-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold text-sm sm:text-base"
                  >
                    Submit Work
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
