"use client";

import Link from "next/link";
import AdvancedModelViewer from "@/components/AdvancedModelViewer";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { useState } from "react";
import { useModel } from "@/lib/api/hooks/useModel";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function PublicViewPage({ params }: { params: { id: string } }) {
  // Fetch model from API
  const { model: apiModel, loading, error: apiError } = useModel(params.id);

  const [viewerSettings, setViewerSettings] = useState({
    autoRotate: true,
    wireframe: false,
    environment: "studio",
    showSkeleton: false,
  });

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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (apiError || !apiModel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <ErrorMessage error={apiError || "Model not found"} />
      </div>
    );
  }

  // Extract file format from API data or URL
  const getFileFormat = (): string => {
    // Try from file_formats array first
    if (apiModel.file_formats && apiModel.file_formats.length > 0) {
      return apiModel.file_formats[0].toLowerCase().replace('.', '');
    }
    // Fallback: extract from file_url
    if (apiModel.file_url) {
      const urlPath = apiModel.file_url.split('?')[0];
      const ext = urlPath.split('.').pop()?.toLowerCase() || '';
      if (['glb', 'gltf', 'fbx', 'obj', 'stl', 'dae'].includes(ext)) {
        return ext;
      }
    }
    return 'glb'; // Safe default
  };

  // Map API model to component format
  const model = {
    id: apiModel.id.toString(),
    name: apiModel.title,
    artist: apiModel.creator?.username ||
      apiModel.creator?.full_name ||
      `Creator #${apiModel.creator_id || 'Unknown'}`,
    artistVerified: apiModel.creator?.is_verified || false,
    views: apiModel.views,
    downloads: apiModel.downloads,
    modelUrl: apiModel.file_url,
    fileFormat: getFileFormat(),
  };

  // Initialize like count from API
  if (likeCount === 0 && apiModel.likes > 0) {
    setLikeCount(apiModel.likes);
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    setNotification({
      isOpen: true,
      type: liked ? "info" : "success",
      title: liked ? "Removed Like" : "Liked!",
      message: liked ? "Removed from your favorites" : "Added to your favorites!",
    });

    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 2000);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);

    setNotification({
      isOpen: true,
      type: "success",
      title: "Link Copied!",
      message: "Share this amazing model with your friends!",
    });

    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 2000);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      user: "You",
      avatar: "👤",
      text: commentText,
      time: "Just now",
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setCommentText("");

    setNotification({
      isOpen: true,
      type: "success",
      title: "Comment Posted!",
      message: "Your comment has been added successfully.",
    });

    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 2000);
  };

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
            href="/"
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">SDModels</span>
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
      <div className="max-w-[2000px] mx-auto">
        <div className="grid lg:grid-cols-3 gap-0 min-h-[calc(100vh-80px)]">

          {/* Left - Model Viewer (2/3) */}
          <div className="lg:col-span-2 relative bg-slate-950">
            <AdvancedModelViewer
              modelUrl={model.modelUrl}
              fileFormat={model.fileFormat}
              settings={viewerSettings}
              selectedAnimation={null}
            />

            {/* Floating Model Info */}
            <div className="absolute top-6 left-6 z-10">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-orange-500/30 rounded-xl p-4 max-w-sm">
                <h1 className="text-2xl font-black text-white mb-2">{model.name}</h1>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-lg">
                    🎨
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-300 font-semibold text-sm">{model.artist}</span>
                      {model.artistVerified && (
                        <span className="text-orange-400" title="Verified">✓</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>👁️</span>
                    <span>{model.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📥</span>
                    <span>{model.downloads} downloads</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-orange-500/30 rounded-full px-6 py-3 shadow-2xl">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${liked
                      ? "bg-red-500 text-white"
                      : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                    }`}
                >
                  <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
                  <span className="font-semibold">{likeCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-400 hover:bg-slate-700 rounded-full transition"
                >
                  <span className="text-xl">🔗</span>
                  <span className="font-semibold">Share</span>
                </button>

                <Link
                  href={`/model/${model.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-full transition font-semibold"
                >
                  <span className="text-xl">🛒</span>
                  <span>Buy Now</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Comments & Info (1/3) */}
          <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl border-l border-orange-500/20 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="p-6 space-y-6">

              {/* Comment Input */}
              <div className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>💬</span>
                  <span>Add Comment</span>
                </h3>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this model..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none resize-none"
                  rows={3}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="mt-3 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span>💭</span>
                  <span>Comments ({comments.length})</span>
                </h3>

                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-orange-500/30 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-semibold text-sm">{comment.user}</span>
                            <span className="text-xs text-gray-500">{comment.time}</span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{comment.text}</p>
                          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition">
                            <span>👍</span>
                            <span>{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Models */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>🔥</span>
                  <span>More from {model.artist}</span>
                </h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Link
                      key={i}
                      href={`/view/${i}`}
                      className="block p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
                          🎮
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold text-sm truncate">
                            Sci-Fi Weapon Pack
                          </div>
                          <div className="text-xs text-gray-400">$29.99</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
