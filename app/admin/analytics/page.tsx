"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAnalytics } from "@/lib/api/hooks/useAdminAnalytics";

export default function AnalyticsPage() {
  const { analytics, loading, error } = useAdminAnalytics();

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout title="Advanced Analytics">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout title="Advanced Analytics">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-500 mb-2">Error Loading Analytics</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (!analytics) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout title="Advanced Analytics">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400">No analytics data available</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  const overview = analytics.overview || {};
  const traffic = analytics.traffic || {};
  const userEngagement = analytics.user_engagement || {};
  const conversions = analytics.conversions || {};

  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout title="Advanced Analytics">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Total Users</div>
            <div className="text-2xl font-bold text-white">{overview.total_users?.toLocaleString() || 0}</div>
            <div className="text-green-400 text-xs mt-1">+{overview.new_users_30d || 0} this month</div>
          </div>
          
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-blue-600/30 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Total Models</div>
            <div className="text-2xl font-bold text-white">{overview.total_models?.toLocaleString() || 0}</div>
          </div>
          
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-purple-600/30 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Page Views</div>
            <div className="text-2xl font-bold text-white">{overview.total_page_views?.toLocaleString() || 0}</div>
          </div>
          
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-green-600/30 rounded-xl p-4">
            <div className="text-gray-400 text-sm mb-1">Avg Session</div>
            <div className="text-2xl font-bold text-white">{overview.avg_session_duration_minutes || 0} min</div>
          </div>
        </div>

        {/* Traffic Sources */}
        {traffic.traffic_sources && traffic.traffic_sources.length > 0 && (
          <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {traffic.traffic_sources.map((source: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{source.icon || "🌐"}</div>
                    <div>
                      <div className="text-white font-bold">{source.source}</div>
                      <div className="text-gray-400 text-sm">{source.visitors?.toLocaleString() || 0} visitors</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{source.percentage || 0}%</div>
                    <div className="text-gray-400 text-xs">{source.conversions || 0} conversions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Engagement */}
        {userEngagement && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">User Engagement</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bounce Rate</span>
                  <span className="text-white font-bold">{overview.bounce_rate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg Pages/Session</span>
                  <span className="text-white font-bold">{userEngagement.avg_pages_per_session || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Return Visitors</span>
                  <span className="text-white font-bold">{userEngagement.return_visitor_rate || 0}%</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Conversions</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Conversion Rate</span>
                  <span className="text-green-400 font-bold">{conversions.conversion_rate || 0}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Conversions</span>
                  <span className="text-white font-bold">{conversions.total_conversions?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Revenue</span>
                  <span className="text-green-400 font-bold">${conversions.total_revenue?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-500 hover:to-blue-500 transition font-bold">
            📥 Export Full Report
          </button>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
