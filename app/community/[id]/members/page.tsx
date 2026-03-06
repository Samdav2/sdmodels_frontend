"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { communitiesApi } from "@/lib/api/communities";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function CommunityMembersPage({ params }: { params: { id: string } }) {
  const [community, setCommunity] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 50;

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        const data = await communitiesApi.getCommunity(params.id);
        setCommunity(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load community");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [params.id]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const response = await communitiesApi.getMembers(params.id, page, limit);
        const data = response as any;
        const membersData = data.members || data.items || [];
        
        if (page === 1) {
          setMembers(membersData);
        } else {
          setMembers(prev => [...prev, ...membersData]);
        }
        
        setTotal(data.total || 0);
        setHasMore(membersData.length === limit);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load members");
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [params.id, page]);

  if (loading) return <LoadingSpinner />;
  if (error && !community) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link 
            href={`/community/${params.id}`}
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold text-sm sm:text-base">Back to Community</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/support"
              className="px-3 sm:px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-xs sm:text-sm font-semibold"
            >
              💬 Support
            </Link>
            <Link
              href="/marketplace"
              className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-xs sm:text-sm font-semibold"
            >
              🛒 Marketplace
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border-2 border-white/20 shadow-2xl">
            {community?.icon || "👥"}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">
              {community?.name} Members
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              {total.toLocaleString()} total members
            </p>
          </div>
        </div>

        {/* Members Grid */}
        <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-4 sm:p-6">
          {loadingMembers && page === 1 ? (
            <div className="text-center py-12">
              <LoadingSpinner />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-white font-bold text-xl mb-2">No Members Yet</h3>
              <p className="text-gray-400">Be the first to join this community!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {members.map((member: any) => (
                  <div
                    key={member.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-purple-500/50 transition group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                        {member.avatar || "👤"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <Link
                            href={`/profile/${member.username}`}
                            className="text-white font-semibold text-sm truncate group-hover:text-purple-400 transition"
                          >
                            {member.username}
                          </Link>
                          {member.is_verified && (
                            <span className="text-orange-400 text-xs" title="Verified">✓</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 capitalize">{member.role || "member"}</span>
                      </div>
                    </div>
                    
                    {member.bio && (
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                        {member.bio}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Joined {new Date(member.joined_at || member.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={loadingMembers}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMembers ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}

              {!hasMore && members.length > 0 && (
                <div className="text-center mt-6 text-gray-400 text-sm">
                  You've reached the end of the members list
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
