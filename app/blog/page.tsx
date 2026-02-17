"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useBlogPosts } from "@/lib/api/hooks/useBlogPosts";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch blog posts from API
  const { posts, loading, error } = useBlogPosts({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchQuery || undefined,
    limit: 20,
  });

  const categories = [
    { id: "all", name: "All Posts", icon: "📚", count: 24 },
    { id: "tutorials", name: "Tutorials", icon: "🎓", count: 8 },
    { id: "news", name: "News", icon: "📰", count: 6 },
    { id: "tips", name: "Tips & Tricks", icon: "💡", count: 5 },
    { id: "showcase", name: "Showcase", icon: "🎨", count: 5 },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">SDModels Blog</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/community"
              className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm font-semibold"
            >
              👥 Community
            </Link>
            <Link
              href="/marketplace"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold"
            >
              🛒 Marketplace
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-orange-500/20 bg-gradient-to-r from-orange-900/20 via-red-900/20 to-pink-900/20">
        <div className="max-w-[2000px] mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            3D Art <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">Insights</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Tutorials, news, and inspiration from the world's leading 3D artists
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-6 py-4 bg-slate-900/80 border-2 border-orange-500/30 rounded-full text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition">
                🔍 Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 sticky top-6">
              <h3 className="text-white font-bold text-lg mb-4">📂 Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-semibold text-sm">{category.name}</span>
                    </div>
                    <span className="text-xs opacity-70">{category.count}</span>
                  </button>
                ))}
              </div>

              {/* Newsletter */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-white font-bold text-lg mb-2">📧 Newsletter</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Get weekly 3D tips and tutorials
                </p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none mb-2"
                />
                <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Center - Blog Posts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Loading State */}
            {loading && <LoadingSpinner />}

            {/* Error State */}
            {error && <ErrorMessage error={error} />}

            {/* Content */}
            {!loading && !error && (
              <>
                {/* Featured Post */}
                {filteredPosts.length > 0 && (
                  <Link href={`/blog/${filteredPosts[0].id}`}>
                    <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition cursor-pointer group">
                      <div className="relative h-96 bg-gradient-to-br from-orange-500/20 to-red-500/20">
                        <div className="absolute inset-0 flex items-center justify-center text-8xl">
                          🎨
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">
                            ⭐ Featured
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xl">
                            {filteredPosts[0].author.avatar_url || "🎨"}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="text-white font-semibold text-sm">{filteredPosts[0].author.username}</span>
                              {filteredPosts[0].author.is_verified && <span className="text-orange-400 text-xs">✓</span>}
                            </div>
                            <span className="text-gray-400 text-xs">Author</span>
                          </div>
                        </div>
                        
                        <h2 className="text-2xl font-black text-white mb-3 group-hover:text-orange-400 transition">
                          {filteredPosts[0].title}
                        </h2>
                        <p className="text-gray-400 mb-4">{filteredPosts[0].excerpt}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span>📅 {new Date(filteredPosts[0].published_at || filteredPosts[0].created_at).toLocaleDateString()}</span>
                          <span>⏱️ {filteredPosts[0].read_time} min read</span>
                          <span>👁️ {filteredPosts[0].views.toLocaleString()} views</span>
                          <span>❤️ {filteredPosts[0].likes} likes</span>
                          <span>💬 {filteredPosts[0].comment_count} comments</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Blog Posts Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.slice(1).map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition cursor-pointer group h-full flex flex-col">
                        <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                          <div className="absolute inset-0 flex items-center justify-center text-6xl">
                            {post.category === 'tutorials' ? '🎓' : 
                             post.category === 'news' ? '📰' :
                             post.category === 'tips' ? '💡' : '🎨'}
                          </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-lg">
                              {post.author.avatar_url || "🎨"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-white font-semibold text-xs truncate">{post.author.username}</span>
                                {post.author.is_verified && <span className="text-orange-400 text-xs">✓</span>}
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full text-xs font-bold">
                              {categories.find(c => c.id === post.category)?.icon}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-black text-white mb-2 group-hover:text-orange-400 transition line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-3 border-t border-slate-700">
                            <span>⏱️ {post.read_time} min</span>
                            <span>❤️ {post.likes}</span>
                            <span>💬 {post.comment_count}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                    <p className="text-gray-400">Try adjusting your filters or search query</p>
                  </div>
                )}

                {/* Load More */}
                {filteredPosts.length > 0 && (
                  <div className="text-center pt-6">
                    <button className="px-8 py-3 bg-slate-800 border border-orange-500/30 text-white rounded-xl font-semibold hover:bg-slate-700 hover:border-orange-500/50 transition">
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
