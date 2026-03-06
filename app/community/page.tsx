"use client";

import Link from "next/link";
import { useState } from "react";
import { useCommunities } from "@/lib/api/hooks/useCommunities";
import { communitiesApi } from "@/lib/api/communities";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-communities' | 'create'>('discover');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  
  // Create community form state
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [communityCategory, setCommunityCategory] = useState("Gaming");
  const [communityIcon, setCommunityIcon] = useState("🎮");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Notification state
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

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

  // Fetch communities from API
  const [refreshKey, setRefreshKey] = useState(0);
  const { communities: apiCommunities, loading, error } = useCommunities({
    search: searchQuery || undefined,
    limit: 20,
    _refresh: refreshKey, // Force refetch when this changes
  });

  const communities = apiCommunities.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description,
    members: c.member_count,
    icon: c.icon,
    category: c.category,
    isJoined: c.is_member || false,
    userRole: c.user_role || null,
  }));

  const handleCreateCommunity = async () => {
    if (!communityName.trim() || !communityDescription.trim()) {
      showNotification("error", "Missing Information", "Please fill in all required fields");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      
      await communitiesApi.createCommunity({
        name: communityName,
        description: communityDescription,
        icon: communityIcon,
        banner_gradient: "from-purple-900/20 via-pink-900/20 to-orange-900/20",
        category: communityCategory,
        is_private: false,
        require_approval: false,
        rules: [
          "Be respectful and professional",
          "Share original work only",
          "No spam or self-promotion",
          "Give credit where due"
        ],
      });

      // Reset form
      setCommunityName("");
      setCommunityDescription("");
      setCommunityCategory("Gaming");
      setCommunityIcon("🎮");
      
      // Switch to discover tab
      setActiveTab('discover');
      
      // Show success message
      showNotification("success", "Community Created!", "Your community has been created successfully.");
      
      // Trigger refresh
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || "Failed to create community";
      setCreateError(errorMsg);
      showNotification("error", "Creation Failed", errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const messages = [
    {
      id: 1,
      user: "Alex Chen",
      avatar: "🎨",
      text: "Just uploaded a new cyberpunk character! Check it out!",
      time: "5 min ago",
      likes: 12,
    },
    {
      id: 2,
      user: "Sarah Miller",
      avatar: "🚀",
      text: "Anyone know good tutorials for hard surface modeling?",
      time: "15 min ago",
      likes: 8,
    },
    {
      id: 3,
      user: "Mike Johnson",
      avatar: "💎",
      text: "Working on a new fantasy weapon pack. Feedback welcome!",
      time: "1 hour ago",
      likes: 24,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold text-sm sm:text-base">SDModels Community</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/support"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-xs sm:text-sm font-semibold text-center"
            >
              💬 Support
            </Link>
            <Link
              href="/marketplace"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-xs sm:text-sm font-semibold text-center"
            >
              🛒 Marketplace
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-orange-500/20 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-orange-900/20">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-3 sm:mb-4">
            Join the <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Community</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Connect with 50,000+ 3D artists, share your work, and learn from the best
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search communities..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-900/80 border-2 border-purple-500/30 rounded-full text-white text-sm sm:text-base placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-xs sm:text-base hover:from-purple-600 hover:to-pink-600 transition">
                🔍 <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Left - Communities List */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 sm:gap-2 bg-slate-900/50 p-1 sm:p-2 rounded-xl border border-orange-500/20">
              <button
                onClick={() => setActiveTab('discover')}
                className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition ${
                  activeTab === 'discover'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🌟 <span className="hidden sm:inline">Discover</span>
              </button>
              <button
                onClick={() => setActiveTab('my-communities')}
                className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition ${
                  activeTab === 'my-communities'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                👥 <span className="hidden sm:inline">My Communities</span>
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition ${
                  activeTab === 'create'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ➕ <span className="hidden sm:inline">Create</span>
              </button>
            </div>

            {/* Communities Grid */}
            {(activeTab === 'discover' || activeTab === 'my-communities') && (
              <>
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <ErrorMessage error={error} />
                ) : communities.length === 0 ? (
                  <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-white font-bold text-xl mb-2">
                      {activeTab === 'my-communities' ? 'No Communities Yet' : 'No Communities Found'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {activeTab === 'my-communities' 
                        ? 'Join some communities to see them here!' 
                        : searchQuery 
                          ? 'Try a different search term' 
                          : 'Be the first to create a community!'}
                    </p>
                    {activeTab === 'discover' && (
                      <button
                        onClick={() => setActiveTab('create')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                      >
                        Create Community
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {communities
                      .filter(c => activeTab === 'my-communities' ? c.isJoined : true)
                      .map((community) => (
                        <Link
                          key={community.id}
                          href={`/community/${community.id}`}
                          className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 hover:border-purple-500/50 transition cursor-pointer block"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                              {community.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-bold text-lg mb-1">{community.name}</h3>
                              <p className="text-gray-400 text-sm line-clamp-2">{community.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <span>👥</span>
                                <span>{community.members.toLocaleString()}</span>
                              </span>
                              <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-full text-xs">
                                {community.category}
                              </span>
                            </div>
                            
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                try {
                                  if (community.isJoined) {
                                    // Leave community
                                    await communitiesApi.leaveCommunity(community.id);
                                    showNotification("success", "Left Community", `You left ${community.name}`);
                                  } else {
                                    // Join community
                                    await communitiesApi.joinCommunity(community.id);
                                    showNotification("success", "Joined Community", `Welcome to ${community.name}!`);
                                  }
                                  
                                  // Refresh communities list
                                  setRefreshKey(prev => prev + 1);
                                } catch (error: any) {
                                  const errorMsg = error.response?.data?.detail || error.message || "Failed to update membership";
                                  showNotification("error", "Error", errorMsg);
                                }
                              }}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                                community.isJoined
                                  ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400'
                                  : 'bg-purple-500 text-white hover:bg-purple-600'
                              }`}
                            >
                              {community.isJoined ? '✓ Joined' : 'Join'}
                            </button>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </>
            )}

            {/* Create Community Form */}
            {/* Create Community Form */}
            {activeTab === 'create' && (
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-8">
                <h2 className="text-2xl font-black text-white mb-6">Create New Community</h2>
                
                {createError && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                    {createError}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Community Name *</label>
                    <input
                      type="text"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      placeholder="e.g., Blender Masters"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Description *</label>
                    <textarea
                      value={communityDescription}
                      onChange={(e) => setCommunityDescription(e.target.value)}
                      placeholder="Describe your community..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Category</label>
                    <select 
                      value={communityCategory}
                      onChange={(e) => setCommunityCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option>Gaming</option>
                      <option>Characters</option>
                      <option>Software</option>
                      <option>Genre</option>
                      <option>Texturing</option>
                      <option>Animation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-semibold mb-2">Icon</label>
                    <div className="grid grid-cols-8 gap-2">
                      {['🎮', '👤', '🔷', '🚀', '🎨', '🎬', '💎', '🔥'].map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setCommunityIcon(icon)}
                          className={`w-12 h-12 bg-slate-800 border rounded-lg hover:border-purple-500 transition text-2xl ${
                            communityIcon === icon ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCreateCommunity}
                    disabled={creating || !communityName.trim() || !communityDescription.trim()}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create Community'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right - Chat/Activity Feed */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-purple-500/30 p-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span>💬</span>
                  <span>Community Chat</span>
                </h3>
              </div>
              
              {/* Messages */}
              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                        {message.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-semibold text-sm">{message.user}</span>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{message.text}</p>
                        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-400 transition">
                          <span>👍</span>
                          <span>{message.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                  />
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
