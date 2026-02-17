"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";
import { useCommunities } from "@/lib/api/hooks/useCommunities";

export default function AdminCommunitiesPage() {
  const { communities: backendCommunities, loading: communitiesLoading, error: communitiesError } = useCommunities();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'reported' | 'create'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);

  // Transform backend data to match admin interface
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "3D Game Assets",
      description: "Share and discuss game-ready 3D models",
      icon: "🎮",
      category: "Gaming",
      members: 15234,
      posts: 8921,
      status: "active",
      creator: "Alex Chen",
      createdDate: "2024-01-15",
      reports: 0,
      moderators: 3,
    },
    {
      id: 2,
      name: "Character Artists",
      description: "For character modelers and riggers",
      icon: "👤",
      category: "Characters",
      members: 8921,
      posts: 5432,
      status: "active",
      creator: "Sarah Miller",
      createdDate: "2024-02-01",
      reports: 0,
      moderators: 2,
    },
  ]);

  const [reportedPosts, setReportedPosts] = useState([
    {
      id: 1,
      communityId: 5,
      communityName: "Texture Artists",
      author: "User123",
      content: "Check out my new texture pack...",
      reportReason: "Spam/Self-promotion",
      reportCount: 3,
      reportedDate: "2024-02-15",
      status: "pending",
    },
    {
      id: 2,
      communityId: 1,
      communityName: "3D Game Assets",
      author: "BadActor",
      content: "Inappropriate content here...",
      reportReason: "Inappropriate content",
      reportCount: 7,
      reportedDate: "2024-02-14",
      status: "pending",
    },
  ]);

  const stats = {
    totalCommunities: communities.length,
    activeCommunities: communities.filter(c => c.status === 'active').length,
    pendingApproval: communities.filter(c => c.status === 'pending').length,
    totalMembers: communities.reduce((sum, c) => sum + c.members, 0),
    totalPosts: communities.reduce((sum, c) => sum + c.posts, 0),
    reportedContent: reportedPosts.length,
  };

  const handleApproveCommunity = (id: number) => {
    setCommunities(communities.map(c => 
      c.id === id ? { ...c, status: 'active' } : c
    ));
  };

  const handleDeleteCommunity = (id: number) => {
    setCommunities(communities.filter(c => c.id !== id));
  };

  const handleResolveReport = (id: number, action: 'remove' | 'dismiss') => {
    setReportedPosts(reportedPosts.filter(r => r.id !== id));
  };

  const filteredCommunities = communities.filter(c => {
    if (activeTab === 'pending') return c.status === 'pending';
    if (activeTab === 'reported') return c.reports > 0;
    if (activeTab === 'all') return c.status === 'active';
    return true;
  }).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
    <AdminLayout title="Community Management">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">🏘️</div>
          <div className="text-2xl font-black text-white">{stats.totalCommunities}</div>
          <div className="text-xs text-gray-400">Total Communities</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-green-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-black text-green-400">{stats.activeCommunities}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-black text-yellow-400">{stats.pendingApproval}</div>
          <div className="text-xs text-gray-400">Pending Approval</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-blue-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-black text-blue-400">{stats.totalMembers.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Total Members</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-purple-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-black text-purple-400">{stats.totalPosts.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Total Posts</div>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-red-600/30 rounded-xl p-4">
          <div className="text-3xl mb-2">🚨</div>
          <div className="text-2xl font-black text-red-400">{stats.reportedContent}</div>
          <div className="text-xs text-gray-400">Reported Content</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
            />
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-lg font-bold hover:from-yellow-500 hover:to-red-500 transition">
            🔍 Search
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🏘️ All Communities
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ⏳ Pending ({stats.pendingApproval})
        </button>
        <button
          onClick={() => setActiveTab('reported')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${
            activeTab === 'reported'
              ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🚨 Reported ({reportedPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${
            activeTab === 'create'
              ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ➕ Create New
        </button>
      </div>

      {/* Communities List */}
      {(activeTab === 'all' || activeTab === 'pending') && (
        <div className="space-y-4">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-6 hover:border-yellow-500/50 transition"
            >
              <div className="flex items-start gap-6">
                {/* Community Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-600 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                  {community.icon}
                </div>

                {/* Community Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">{community.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{community.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      community.status === 'active'
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                        : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                    }`}>
                      {community.status === 'active' ? '✅ Active' : '⏳ Pending'}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Category</div>
                      <div className="text-white font-bold">{community.category}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Members</div>
                      <div className="text-white font-bold">{community.members.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Posts</div>
                      <div className="text-white font-bold">{community.posts.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Moderators</div>
                      <div className="text-white font-bold">{community.moderators}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Created</div>
                      <div className="text-white font-bold">{new Date(community.createdDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <span>👤 Created by:</span>
                    <span className="text-white font-semibold">{community.creator}</span>
                    {community.reports > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-red-400 font-bold">🚨 {community.reports} Reports</span>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition text-sm">
                      👁️ View Details
                    </button>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition text-sm">
                      ✏️ Edit
                    </button>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition text-sm">
                      👮 Manage Mods
                    </button>
                    
                    {community.status === 'pending' && (
                      <button
                        onClick={() => handleApproveCommunity(community.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition text-sm"
                      >
                        ✅ Approve
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteCommunity(community.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCommunities.length === 0 && (
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No Communities Found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Reported Content */}
      {activeTab === 'reported' && (
        <div className="space-y-4">
          {reportedPosts.map((report) => (
            <div
              key={report.id}
              className="bg-slate-900/70 backdrop-blur-xl border-2 border-red-600/30 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  🚨
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-black text-white mb-1">
                        Reported Post in {report.communityName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>👤 {report.author}</span>
                        <span>•</span>
                        <span>📅 {new Date(report.reportedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-red-400 font-bold">🚨 {report.reportCount} reports</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-3">
                    <div className="text-xs text-gray-500 mb-1">Post Content:</div>
                    <p className="text-gray-300 text-sm mb-2">{report.content}</p>
                    <div className="text-xs text-red-400">
                      <span className="font-bold">Reason:</span> {report.reportReason}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition text-sm">
                      👁️ View Full Post
                    </button>
                    <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-semibold transition text-sm">
                      ⚠️ Warn User
                    </button>
                    <button
                      onClick={() => handleResolveReport(report.id, 'remove')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition text-sm"
                    >
                      🗑️ Remove Post
                    </button>
                    <button
                      onClick={() => handleResolveReport(report.id, 'dismiss')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition text-sm"
                    >
                      ✅ Dismiss Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reportedPosts.length === 0 && (
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-white mb-2">No Reported Content</h3>
              <p className="text-gray-400">All reports have been resolved</p>
            </div>
          )}
        </div>
      )}

      {/* Create New Community */}
      {activeTab === 'create' && (
        <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-8">
          <h3 className="text-2xl font-black text-white mb-6">Create New Community</h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-bold mb-2">Community Name</label>
                <input
                  type="text"
                  placeholder="e.g., Blender Masters"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Category</label>
                <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none">
                  <option>Gaming</option>
                  <option>Characters</option>
                  <option>Software</option>
                  <option>Genre</option>
                  <option>Texturing</option>
                  <option>Animation</option>
                  <option>Architecture</option>
                  <option>VFX</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Description</label>
              <textarea
                placeholder="Describe the community purpose and guidelines..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Community Icon</label>
              <div className="grid grid-cols-8 gap-3">
                {['🎮', '👤', '🔷', '🚀', '🎨', '🎬', '💎', '🔥', '🏗️', '⚡', '🌟', '🎯', '🎪', '🎭', '🎸', '🎺'].map((icon) => (
                  <button
                    key={icon}
                    className="w-14 h-14 bg-slate-800 border-2 border-slate-700 rounded-xl hover:border-yellow-500 transition text-3xl"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-bold mb-2">Creator/Owner</label>
                <input
                  type="text"
                  placeholder="Search user..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">Initial Moderators</label>
                <input
                  type="text"
                  placeholder="Add moderators (comma separated)"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-bold mb-2">Community Rules</label>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Rule ${i}`}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoApprove"
                  className="w-5 h-5 bg-slate-800 border border-slate-700 rounded"
                />
                <label htmlFor="autoApprove" className="text-white font-semibold">
                  Auto-approve posts
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowMedia"
                  className="w-5 h-5 bg-slate-800 border border-slate-700 rounded"
                  defaultChecked
                />
                <label htmlFor="allowMedia" className="text-white font-semibold">
                  Allow media uploads
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requireApproval"
                  className="w-5 h-5 bg-slate-800 border border-slate-700 rounded"
                />
                <label htmlFor="requireApproval" className="text-white font-semibold">
                  Require join approval
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-black text-lg hover:from-yellow-500 hover:to-red-500 transition">
                ✅ Create Community
              </button>
              <button className="px-8 py-4 bg-slate-800 text-gray-300 rounded-xl font-bold hover:bg-slate-700 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Panel */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-6 mt-6">
        <h3 className="text-xl font-black text-white mb-4">⚡ Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-left">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-white font-bold text-sm">View Analytics</div>
            <div className="text-xs text-gray-400">Community insights</div>
          </button>

          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-left">
            <div className="text-3xl mb-2">📧</div>
            <div className="text-white font-bold text-sm">Send Announcement</div>
            <div className="text-xs text-gray-400">To all communities</div>
          </button>

          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-left">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-white font-bold text-sm">Bulk Moderation</div>
            <div className="text-xs text-gray-400">Manage multiple</div>
          </button>

          <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition text-left">
            <div className="text-3xl mb-2">📥</div>
            <div className="text-white font-bold text-sm">Export Data</div>
            <div className="text-xs text-gray-400">Download reports</div>
          </button>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-xl p-6 mt-6">
        <h3 className="text-xl font-black text-white mb-4">📜 Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: "Community Created", detail: "Sci-Fi Creators by Emma Davis", time: "2 hours ago", icon: "➕", color: "green" },
            { action: "Post Removed", detail: "Spam content in Texture Artists", time: "4 hours ago", icon: "🗑️", color: "red" },
            { action: "Moderator Added", detail: "John Smith to Blender Masters", time: "6 hours ago", icon: "👮", color: "blue" },
            { action: "Community Approved", detail: "Character Artists went live", time: "1 day ago", icon: "✅", color: "green" },
            { action: "Report Resolved", detail: "3 reports dismissed in Game Assets", time: "1 day ago", icon: "🚨", color: "yellow" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className={`w-10 h-10 bg-${activity.color}-500/20 border border-${activity.color}-500/30 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{activity.action}</div>
                <div className="text-gray-400 text-xs">{activity.detail}</div>
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
