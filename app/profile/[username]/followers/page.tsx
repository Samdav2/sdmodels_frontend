"use client";

import Link from "next/link";
import { useState } from "react";
import { useFollowers, useFollowing } from "@/lib/api/hooks/useFollowers";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function FollowersPage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Get user ID from username - for now using placeholder
  const userId = 1; // This should be fetched from username lookup
  
  const { followers, loading: followersLoading, error: followersError, followUser, unfollowUser } = useFollowers(userId);
  const { following, loading: followingLoading, error: followingError } = useFollowing(userId);

  const currentList = activeTab === 'followers' ? followers : following;
  const loading = activeTab === 'followers' ? followersLoading : followingLoading;
  const error = activeTab === 'followers' ? followersError : followingError;
  
  const filteredList = currentList.filter((user: any) =>
    (user.name || user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollowToggle = async (targetUserId: number, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }
    } catch (err) {
      console.error('Follow/unfollow error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link 
            href={`/profile/${params.username}`}
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Profile</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-4xl font-black text-white mb-8">@{params.username}</h1>

        {error && (
          <div className="mb-6">
            <ErrorMessage error={error} />
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setActiveTab('followers')} 
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  activeTab === 'followers' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-slate-800 text-gray-400'
                }`}
              >
                Followers ({followers.length})
              </button>
              <button 
                onClick={() => setActiveTab('following')} 
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  activeTab === 'following' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'bg-slate-800 text-gray-400'
                }`}
              >
                Following ({following.length})
              </button>
            </div>

            {/* Search */}
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search..." 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none mb-6" 
            />

            {/* User List */}
            <div className="space-y-3">
              {filteredList.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No {activeTab} found
                </div>
              ) : (
                filteredList.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-orange-500/50 transition">
                    <Link href={`/profile/${user.username}`} className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl">
                        {user.avatar || user.avatar_url || '👤'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{user.name || user.full_name || user.username}</span>
                          {user.verified && <span className="text-orange-400">✓</span>}
                        </div>
                        <span className="text-gray-400 text-sm">@{user.username}</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => handleFollowToggle(user.id, user.following)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        user.following 
                          ? 'bg-slate-700 text-gray-400 hover:bg-slate-600' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {user.following ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
