"use client";

import Link from "next/link";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { useState } from "react";
import { useBlogPost } from "@/lib/api/hooks/useBlogPost";

export default function BlogPostPage({ params }: { params: { id: string } }) {
  // Fetch blog post from API
  const { post: apiPost, loading, error } = useBlogPost(params.id);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-400 font-semibold">Loading post...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !apiPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-400">{error || "Blog post not found"}</p>
        </div>
      </div>
    );
  }
  // Map API post to component format
  const post = {
    id: apiPost.id.toString(),
    title: apiPost.title,
    content: apiPost.content,
    author: {
      name: apiPost.author.username,
      avatar: apiPost.author.avatar_url || "🎨",
      role: "Author",
      verified: apiPost.author.is_verified,
      bio: apiPost.author.bio || "Content creator",
      followers: 0,
      posts: apiPost.author.total_models,
    },
    category: apiPost.category,
    publishedDate: apiPost.published_at || apiPost.created_at,
    readTime: apiPost.read_time + " min read",
    views: apiPost.views,
    tags: apiPost.tags,
  };

  // Initialize like count from API
  if (likeCount === 0 && apiPost.likes > 0) {
    setLikeCount(apiPost.likes);
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    
    showNotification(
      liked ? "info" : "success",
      liked ? "Removed Like" : "Liked!",
      liked ? "Removed from your favorites" : "Added to your favorites!"
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification("success", "Link Copied!", "Share this article with your friends!");
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: comments.length + 1,
      author: "You",
      avatar: "👤",
      text: commentText,
      time: "Just now",
      likes: 0,
      replies: [],
    };
    
    setComments([newComment, ...comments]);
    setCommentText("");
    showNotification("success", "Comment Posted!", "Your comment has been added successfully.");
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Advanced Normal Mapping Techniques",
      thumbnail: "🗺️",
      readTime: "10 min",
    },
    {
      id: 3,
      title: "Substance Painter Workflow Tips",
      thumbnail: "🎨",
      readTime: "8 min",
    },
    {
      id: 4,
      title: "Creating Realistic Metal Materials",
      thumbnail: "⚙️",
      readTime: "15 min",
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
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Blog</span>
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

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left - Article Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article Header */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full text-sm font-bold">
                  🎓 Tutorial
                </span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">{post.readTime}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl">
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold">{post.author.name}</span>
                      {post.author.verified && <span className="text-orange-400">✓</span>}
                    </div>
                    <span className="text-gray-400 text-sm">{post.author.role}</span>
                  </div>
                </div>

                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-sm">
                  + Follow
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <span>📅 {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>👁️ {post.views.toLocaleString()} views</span>
                <span>❤️ {likeCount} likes</span>
                <span>💬 {comments.length} comments</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20">
                <div className="absolute inset-0 flex items-center justify-center text-9xl">
                  🎨
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={"flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition " + (
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white'
                )}
              >
                <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
                <span>{likeCount} Likes</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white rounded-xl font-semibold transition"
              >
                <span className="text-xl">🔗</span>
                <span>Share</span>
              </button>

              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white rounded-xl font-semibold transition">
                <span className="text-xl">🔖</span>
                <span>Save</span>
              </button>
            </div>

            {/* Article Content */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-8">
              <div className="prose prose-invert prose-orange max-w-none">
                <div className="text-gray-300 leading-relaxed space-y-6">
                  {post.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-black text-white mt-8 mb-4">{paragraph.replace('# ', '')}</h1>;
                    } else if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-black text-white mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
                    } else if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-bold text-orange-400 mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                    } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <p key={index} className="font-bold text-white">{paragraph.replace(/\*\*/g, '')}</p>;
                    } else if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={index} className="list-disc list-inside space-y-1 ml-4">
                          {paragraph.split('\n').map((item, i) => (
                            <li key={i} className="text-gray-300">{item.replace('- ', '')}</li>
                          ))}
                        </ul>
                      );
                    } else if (paragraph.match(/^\d+\./)) {
                      return (
                        <ol key={index} className="list-decimal list-inside space-y-1 ml-4">
                          {paragraph.split('\n').map((item, i) => (
                            <li key={i} className="text-gray-300">{item.replace(/^\d+\.\s/, '')}</li>
                          ))}
                        </ol>
                      );
                    } else {
                      return <p key={index} className="text-gray-300">{paragraph}</p>;
                    }
                  })}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold mb-3">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={"/blog?tag=" + tag}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 hover:border-orange-500/50 hover:text-white rounded-lg text-sm font-semibold transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <span>💬</span>
                <span>Comments ({comments.length})</span>
              </h3>

              {/* Add Comment */}
              <div className="mb-6 pb-6 border-b border-slate-700">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none resize-none"
                  rows={3}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="mt-3 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.time}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.text}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <button className="hover:text-orange-400 transition">👍 {comment.likes}</button>
                          <button className="hover:text-orange-400 transition">Reply</button>
                        </div>

                        {/* Nested Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-8 mt-4 space-y-4">
                            {comment.replies.map((reply: any) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                  {reply.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-white font-semibold text-sm">{reply.author}</span>
                                      <span className="text-xs text-gray-500">{reply.time}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{reply.text}</p>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                    <button className="hover:text-orange-400 transition">👍 {reply.likes}</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Card */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 sticky top-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
                  {post.author.avatar}
                </div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-lg">{post.author.name}</h3>
                  {post.author.verified && <span className="text-orange-400">✓</span>}
                </div>
                <p className="text-gray-400 text-sm mb-3">{post.author.role}</p>
                <p className="text-gray-300 text-sm mb-4">{post.author.bio}</p>

                <div className="flex justify-center gap-6 mb-4 text-sm">
                  <div>
                    <div className="text-white font-bold">{post.author.followers}</div>
                    <div className="text-gray-400 text-xs">Followers</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{post.author.posts}</div>
                    <div className="text-gray-400 text-xs">Posts</div>
                  </div>
                </div>

                <button className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">
                  + Follow Author
                </button>
              </div>
            </div>

            {/* Related Posts */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">📚 Related Articles</h3>
              <div className="space-y-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={"/blog/" + related.id}
                    className="block p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-orange-500/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {related.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm mb-1 line-clamp-2">
                          {related.title}
                        </div>
                        <div className="text-xs text-gray-400">⏱️ {related.readTime}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Share Widget */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">🔗 Share Article</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-3 bg-slate-800 border border-slate-700 text-gray-400 hover:border-blue-500/50 hover:text-blue-400 rounded-lg font-semibold text-sm transition">
                  Twitter
                </button>
                <button className="px-4 py-3 bg-slate-800 border border-slate-700 text-gray-400 hover:border-blue-600/50 hover:text-blue-600 rounded-lg font-semibold text-sm transition">
                  Facebook
                </button>
                <button className="px-4 py-3 bg-slate-800 border border-slate-700 text-gray-400 hover:border-blue-700/50 hover:text-blue-700 rounded-lg font-semibold text-sm transition">
                  LinkedIn
                </button>
                <button className="px-4 py-3 bg-slate-800 border border-slate-700 text-gray-400 hover:border-red-500/50 hover:text-red-500 rounded-lg font-semibold text-sm transition">
                  Reddit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}