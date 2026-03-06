"use client";

import Link from "next/link";
import AdvancedModelViewer from "@/components/AdvancedModelViewer";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { useState, useEffect } from "react";
import { useModel } from "@/lib/api/hooks/useModel";
import { modelsApi } from "@/lib/api/models";
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
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

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

  // Load comments when model is loaded
  useEffect(() => {
    if (apiModel?.id) {
      loadComments();
      // Increment view count
      modelsApi.incrementView(apiModel.id).catch(() => {});
    }
  }, [apiModel?.id]);

  // Initialize like count from API
  useEffect(() => {
    if (apiModel) {
      setLikeCount(apiModel.likes || 0);
      // TODO: Check if user has liked this model (need backend endpoint for this)
      // For now, we'll just track locally
    }
  }, [apiModel]);

  const loadComments = async () => {
    if (!apiModel?.id) return;
    
    setLoadingComments(true);
    try {
      const response = await modelsApi.getComments(apiModel.id);
      // Backend might return 'comments' or 'items' array
      const commentsArray = (response as any).comments || response.items || [];
      setComments(commentsArray);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!apiModel?.id) return;

    const wasLiked = liked;
    const previousCount = likeCount;

    // Optimistic update
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      if (liked) {
        await modelsApi.unlikeModel(apiModel.id);
      } else {
        await modelsApi.likeModel(apiModel.id);
      }

      setNotification({
        isOpen: true,
        type: liked ? "info" : "success",
        title: liked ? "Removed Like" : "Liked!",
        message: liked ? "Removed from your favorites" : "Added to your favorites!",
      });
    } catch (err: any) {
      // Revert on error
      setLiked(wasLiked);
      setLikeCount(previousCount);
      
      setNotification({
        isOpen: true,
        type: "error",
        title: "Failed",
        message: err.response?.data?.detail || "Please try again.",
      });
    }

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

  const handleComment = async () => {
    if (!commentText.trim() || !apiModel?.id) return;

    setSubmittingComment(true);
    try {
      const newComment = await modelsApi.addComment(apiModel.id, commentText);
      
      // Add to local state
      setComments([newComment, ...comments]);
      setCommentText("");

      setNotification({
        isOpen: true,
        type: "success",
        title: "Comment Posted!",
        message: "Your comment has been added successfully.",
      });
    } catch (err: any) {
      setNotification({
        isOpen: true,
        type: "error",
        title: "Failed to Post",
        message: err.response?.data?.detail || "Please try again.",
      });
    } finally {
      setSubmittingComment(false);
    }

    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 2000);
  };

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
    id: apiModel.id, // Already a UUID string
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
            <span className="font-semibold text-sm sm:text-base">SDModels</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/community"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-xs sm:text-sm font-semibold text-center"
            >
              👥 Community
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

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto">
        <div className="grid lg:grid-cols-3 gap-0 min-h-[calc(100vh-80px)]">

          {/* Left - Model Viewer (2/3) */}
          <div className="lg:col-span-2 relative bg-slate-950 overflow-hidden min-h-[50vh] lg:min-h-[calc(100vh-80px)]">
            <AdvancedModelViewer
              modelUrl={model.modelUrl}
              fileFormat={model.fileFormat}
              settings={viewerSettings}
              selectedAnimation={null}
            />

            {/* Floating Model Info - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block absolute top-6 left-6 z-10">
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

            {/* Action Buttons - Responsive positioning */}
            <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-10 w-full px-4 lg:w-auto lg:px-0">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-slate-900/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl px-3 sm:px-6 py-3 shadow-2xl">
                <button
                  onClick={handleLike}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full transition text-sm ${liked
                      ? "bg-red-500 text-white"
                      : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                    }`}
                >
                  <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
                  <span className="font-semibold">{likeCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 text-gray-400 hover:bg-slate-700 rounded-full transition text-sm"
                >
                  <span className="text-lg">🔗</span>
                  <span className="font-semibold">Share</span>
                </button>

                <Link
                  href={`/model/${model.id}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-full transition font-semibold shadow-lg text-sm"
                >
                  <span className="text-lg">🚀</span>
                  <span>Expanded View</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right - Comments & Info (1/3) - Full width on mobile, sidebar on desktop */}
          <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl lg:border-l border-orange-500/20 overflow-y-auto max-h-screen lg:max-h-[calc(100vh-80px)]">
            {/* Mobile Model Info - Only shown on mobile */}
            <div className="lg:hidden bg-slate-800/50 border-b border-orange-500/20 p-4">
              <h1 className="text-xl font-black text-white mb-2">{model.name}</h1>
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

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

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
                  disabled={submittingComment}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || submittingComment}
                  className="mt-3 w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>

              {/* Comments List */}
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span>💭</span>
                  <span>Comments ({comments.length})</span>
                </h3>

                {loadingComments ? (
                  <div className="text-center py-8 text-gray-400">
                    <div className="animate-pulse">Loading comments...</div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-orange-500/30 transition"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                            {comment.author_avatar || comment.avatar || "👤"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-semibold text-sm">
                                {comment.author_username || comment.user || "User"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {comment.created_at 
                                  ? new Date(comment.created_at).toLocaleString()
                                  : comment.time || "Just now"}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">
                              {comment.content || comment.text}
                            </p>
                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-400 transition">
                              <span>👍</span>
                              <span>{comment.likes || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
