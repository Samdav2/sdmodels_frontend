"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useModels } from "@/lib/api/hooks/useModels";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'models' | 'users' | 'communities' | 'courses'>('models');
  const [sortBy, setSortBy] = useState<'relevant' | 'recent' | 'popular'>('relevant');

  // Fetch search results from API
  const { models, loading, error } = useModels({
    search: searchQuery,
    limit: 20,
    sort: sortBy === 'recent' ? 'newest' : 'popular',
  });

  const results = {
    models: models.map(m => ({
      id: m.id,
      title: m.title,
      creator: m.creator.username,
      thumbnail: m.thumbnail_url,
      price: m.price,
      likes: m.likes,
    })),
    users: [] as any[],
    communities: [] as any[],
    courses: [] as any[],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group">
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">SDModels</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-[2000px] mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search models, users, communities..." className="w-full px-6 py-4 bg-slate-900/80 border-2 border-orange-500/30 rounded-full text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none text-lg" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold">🔍</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 sticky top-6">
              <h3 className="text-white font-bold mb-4">Filters</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm">
                    <option value="relevant">Most Relevant</option>
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex gap-2 bg-slate-900/50 border border-orange-500/20 rounded-xl p-2 mb-6">
              {(['models', 'users', 'communities', 'courses'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-lg font-bold transition capitalize ${activeTab === tab ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                  {tab} ({results[tab].length})
                </button>
              ))}
            </div>

            {activeTab === 'models' && (
              <div className="grid md:grid-cols-2 gap-4">
                {results.models.map((model) => (
                  <Link key={model.id} href={`/model/${model.id}`} className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition">
                    <div className="h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-6xl">{model.thumbnail}</div>
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-2">{model.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">by {model.creator}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-orange-400 font-black">${model.price}</span>
                        <span className="text-gray-400 text-sm">❤️ {model.likes}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-3">
                {results.users.map((user) => (
                  <Link key={user.id} href={`/profile/${user.username}`} className="flex items-center justify-between bg-slate-900/50 border border-orange-500/20 rounded-xl p-4 hover:border-orange-500/50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl">{user.avatar}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{user.name}</span>
                          {user.verified && <span className="text-orange-400">✓</span>}
                        </div>
                        <span className="text-gray-400 text-sm">@{user.username} • {user.followers.toLocaleString()} followers</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">Follow</button>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'communities' && (
              <div className="grid md:grid-cols-2 gap-4">
                {results.communities.map((community) => (
                  <Link key={community.id} href={`/community/${community.id}`} className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/50 transition">
                    <div className="text-5xl mb-4">{community.icon}</div>
                    <h3 className="text-white font-bold text-lg mb-2">{community.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>👥 {community.members.toLocaleString()}</span>
                      <span>📝 {community.posts.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="grid md:grid-cols-2 gap-4">
                {results.courses.map((course) => (
                  <Link key={course.id} href={`/learn/${course.id}`} className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition">
                    <div className="h-48 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-6xl">{course.thumbnail}</div>
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-2">{course.title}</h3>
                      <p className="text-gray-400 text-sm">by {course.instructor} • {course.students} students</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-400 font-semibold">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
