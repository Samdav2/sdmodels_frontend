"use client";

import Link from "next/link";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { useState, useRef } from "react";
import { useCommunityQuery, useCommunityPostsQuery, useCreatePostMutation, useReactToPostMutation, useCommentsQuery, useAddCommentMutation, useLikeCommentMutation } from "@/lib/api/hooks/useCommunitiesQuery";
import { useCommunities } from "@/lib/api/hooks/useCommunities";
import { communitiesApi } from "@/lib/api/communities";
import { useModels } from "@/lib/api/hooks/useModels";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ModelViewer3D from "@/components/ModelViewer3D";

// Recursive Comment Component
function CommentItem({ 
  comment, 
  postId, 
  depth = 0,
  onLike,
  onReply,
}: { 
  comment: any;
  postId: string;
  depth?: number;
  onLike: (postId: string, commentId: string, currentlyLiked: boolean) => void;
  onReply: (postId: string, commentId: string, username: string) => void;
}) {
  const maxDepth = 3;
  const shouldIndent = depth > 0 && depth < maxDepth;
  // Only indent replies, not top-level comments
  const indentClass = shouldIndent ? (depth === 1 ? 'ml-6 sm:ml-10' : depth === 2 ? 'ml-12 sm:ml-20' : '') : '';
  
  return (
    <div className={indentClass}>
      <div className="flex items-start gap-2 sm:gap-3 mb-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-base sm:text-lg flex-shrink-0">
          {comment.author_avatar || "👤"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg sm:rounded-xl p-2 sm:p-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-white font-semibold text-xs sm:text-sm truncate">{comment.author_username || "Unknown"}</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm break-words">{comment.content}</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs">
            <button 
              onClick={() => onLike(postId, comment.id, comment.user_has_liked)}
              className={`transition flex items-center gap-1 ${
                comment.user_has_liked 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <span>{comment.user_has_liked ? '❤️' : '🤍'}</span>
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </button>
            <button 
              onClick={() => onReply(postId, comment.id, comment.author_username)}
              className="text-gray-400 hover:text-purple-400 transition"
            >
              💬 Reply
            </button>
          </div>
        </div>
      </div>
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
              onLike={onLike}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommunityViewPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed');
  const [postFilter, setPostFilter] = useState<'recent' | 'popular' | 'media'>('recent');
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showModelViewer, setShowModelViewer] = useState(false);
  const [viewingModel, setViewingModel] = useState<any | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user's models for selection
  const { models: userModels, loading: modelsLoading } = useModels({ limit: 100 });

  // React Query hooks - auto-refreshing data!
  const { data: apiCommunity, isLoading: loading, error: apiError } = useCommunityQuery(params.id);
  const { data: apiPosts = [], isLoading: postsLoading } = useCommunityPostsQuery(params.id, postFilter);
  const createPostMutation = useCreatePostMutation(params.id);
  const reactMutation = useReactToPostMutation(params.id, postFilter);
  
  // Fetch suggested communities (same category, exclude current)
  const { communities: allCommunities } = useCommunities({ limit: 100 });
  
  const [isJoining, setIsJoining] = useState(false);
  const [localCommunity, setLocalCommunity] = useState<any>(null);

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

  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState<{ [key: string]: boolean }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});
  const [replyingTo, setReplyingTo] = useState<{ [key: string]: string | null }>({});

  // Early returns AFTER all hooks
  if (loading) return <LoadingSpinner />;
  if (apiError || !apiCommunity) {
    const errorMessage = apiError instanceof Error ? apiError.message : (apiError || "Community not found");
    return <ErrorMessage error={errorMessage} />;
  }

  // Use local state if available (after join/leave), otherwise use API data
  const communityData = localCommunity || apiCommunity;

  // Map API community to display format - use is_member from API
  const community = {
    id: communityData.id,
    name: communityData.name,
    description: communityData.description,
    icon: communityData.icon,
    banner: communityData.banner_gradient,
    members: communityData.member_count,
    posts: communityData.post_count,
    isJoined: communityData.is_member || false,
    userRole: communityData.user_role || null,
    category: communityData.category,
    createdDate: new Date(communityData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  };

  // Use real posts from API only - no mock data
  const posts = (apiCommunity.recent_posts || apiPosts).map((post: any) => {
    // Parse reactions if it's a string
    const reactions = typeof post.reactions === 'string' 
      ? JSON.parse(post.reactions) 
      : (post.reactions || { like: 0, love: 0, wow: 0, fire: 0 });
    
    return {
      id: post.id,
      author: post.author_username || post.author?.username || "Unknown",
      authorAvatar: post.author_avatar || post.author?.avatar || "👤",
      authorVerified: post.author?.is_verified || false,
      time: new Date(post.created_at).toLocaleString(),
      content: post.content,
      image: post.image_url,
      model: post.model_url,
      modelData: post.model, // Full model object with file_formats from backend
      reactions: reactions,
      userReaction: post.user_reaction || null,
      comments: post.comment_count || 0,
      shares: post.share_count || 0,
      isPinned: post.is_pinned || false,
    };
  });

  // Use top members from API
  const members = (communityData.top_members || []).map((member: any) => ({
    id: member.id,
    name: member.username,
    avatar: member.avatar || "👤",
    role: member.role,
    verified: false,
  }));

  // Get suggested communities - same category, not current, not already joined, limit to 3
  const suggestedCommunities = (allCommunities || [])
    .filter((comm: any) => 
      comm.id !== params.id && 
      comm.category === community.category &&
      !comm.is_member
    )
    .slice(0, 3)
    .map((comm: any) => ({
      id: comm.id,
      name: comm.name,
      icon: comm.icon,
      members: comm.member_count,
      category: comm.category,
    }));

  const loadComments = async (postId: string, silent = false) => {
    if (!silent && (loadingComments[postId] || comments[postId])) return; // Don't reload if already loaded (unless silent)
    
    if (!silent) {
      setLoadingComments({ ...loadingComments, [postId]: true });
    }
    try {
      const response = await communitiesApi.getComments(postId);
      // Backend returns 'comments' array, not 'items'
      const commentsData = (response as any).comments || response.items || [];
      setComments({
        ...comments,
        [postId]: commentsData,
      });
    } catch (err: any) {
      if (!silent) {
        console.error("Failed to load comments:", err);
      }
    } finally {
      if (!silent) {
        setLoadingComments({ ...loadingComments, [postId]: false });
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) {
      showNotification("error", "Empty Comment", "Please write something before commenting.");
      return;
    }

    setIsSubmittingComment({ ...isSubmittingComment, [postId]: true });
    try {
      const parentId = replyingTo[postId] || undefined;
      const newComment = await communitiesApi.addComment(postId, text, parentId);
      
      // Force reload comments by passing silent=true to bypass the check
      setLoadingComments({ ...loadingComments, [postId]: true });
      const response = await communitiesApi.getComments(postId);
      const commentsData = (response as any).comments || response.items || [];
      setComments({
        ...comments,
        [postId]: commentsData,
      });
      setLoadingComments({ ...loadingComments, [postId]: false });
      
      // Clear input and reply state
      setCommentText({ ...commentText, [postId]: "" });
      setReplyingTo({ ...replyingTo, [postId]: null });
      
      showNotification("success", parentId ? "Reply Added" : "Comment Added", 
        parentId ? "Your reply has been posted." : "Your comment has been posted.");
    } catch (err: any) {
      showNotification("error", "Failed to Comment", err.response?.data?.detail || "Please try again.");
    } finally {
      setIsSubmittingComment({ ...isSubmittingComment, [postId]: false });
    }
  };

  const handleLikeComment = async (postId: string, commentId: string, currentlyLiked: boolean) => {
    try {
      if (currentlyLiked) {
        await communitiesApi.unlikeComment(commentId);
      } else {
        await communitiesApi.likeComment(commentId);
      }
      
      // Update the comment in state
      const updateCommentLikes = (comments: any[]): any[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              user_has_liked: !currentlyLiked,
              likes: currentlyLiked ? comment.likes - 1 : comment.likes + 1,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentLikes(comment.replies),
            };
          }
          return comment;
        });
      };
      
      setComments({
        ...comments,
        [postId]: updateCommentLikes(comments[postId] || []),
      });
    } catch (err: any) {
      showNotification("error", "Action Failed", err.response?.data?.detail || "Please try again.");
    }
  };

  const handleReplyToComment = (postId: string, commentId: string, username: string) => {
    setReplyingTo({ ...replyingTo, [postId]: commentId });
    setCommentText({ ...commentText, [postId]: `@${username} ` });
    const commentInput = document.getElementById(`comment-input-${postId}`) as HTMLInputElement;
    commentInput?.focus();
  };

  const cancelReply = (postId: string) => {
    setReplyingTo({ ...replyingTo, [postId]: null });
    setCommentText({ ...commentText, [postId]: "" });
  };

  const reactions = [
    { emoji: "👍", label: "like" },
    { emoji: "❤️", label: "love" },
    { emoji: "😮", label: "wow" },
    { emoji: "🔥", label: "fire" },
  ];

  const handleCreatePost = async () => {
    if (!postText.trim() && !selectedImage && !selectedModel) {
      showNotification("error", "Empty Post", "Please add some content, an image, or a model.");
      return;
    }

    try {
      let imageUrl = undefined;
      
      // Step 1: Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/v1/upload/image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Image upload failed');
        }
        
        const data = await response.json();
        imageUrl = data.image_url;
      }
      
      // Step 2: Create post with image URL and model file URL using React Query mutation
      const modelUrl = selectedModel ? selectedModel.file_url : undefined;
      
      await createPostMutation.mutateAsync({
        content: postText,
        image_url: imageUrl,
        model_url: modelUrl,
      });
      
      setPostText("");
      setSelectedImage(null);
      setSelectedModel(null);
      showNotification("success", "Post Created!", "Your post has been shared with the community.");
    } catch (err: any) {
      showNotification("error", "Failed to Create Post", err.message || "Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showNotification("error", "File Too Large", "Image must be less than 10MB.");
        return;
      }
      setSelectedImage(file);
      showNotification("success", "Image Selected!", `${file.name} will be attached to your post.`);
    }
  };

  const handleModelSelect = (model: any) => {
    setSelectedModel(model);
    setShowModelSelector(false);
    showNotification("success", "Model Selected!", `${model.title} will be attached to your post.`);
  };

  const handleViewModel = (model: any) => {
    // Ensure we have the proper structure for the viewer
    // Backend now returns file_formats as array, fallback to glb if missing
    const formats = model.file_formats || (model.file_format ? [model.file_format] : ['glb']);
    
    setViewingModel({
      ...model,
      file_url: model.file_url,
      title: model.title || '3D Model',
      category: model.category || 'Unknown',
      id: model.id || null,
      file_formats: formats,
    });
    setShowModelViewer(true);
  };

  const handleReaction = async (postId: string, reaction: string) => {
    try {
      // postId is already a UUID string, pass it directly
      await reactMutation.mutateAsync({ 
        postId: postId, 
        reaction: reaction.toLowerCase() 
      });
      showNotification("success", "Reaction Added", `You reacted with ${reaction}`);
    } catch (err: any) {
      showNotification("error", "Failed to React", err.message || "Please try again.");
    }
  };

  const handleShare = (postId: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/community/${community.id}/post/${postId}`);
    showNotification("success", "Link Copied!", "Post link copied to clipboard.");
  };

  const handleJoinLeave = async () => {
    if (isJoining) return;
    
    // Admins (creators) cannot leave their own communities
    if (community.userRole === 'admin') {
      showNotification("info", "Cannot Leave", "Community creators cannot leave their own communities.");
      return;
    }
    
    setIsJoining(true);
    try {
      if (community.isJoined) {
        await communitiesApi.leaveCommunity(params.id);
        // Update local state immediately
        setLocalCommunity({
          ...communityData,
          is_member: false,
          user_role: null,
          member_count: communityData.member_count - 1,
        });
        showNotification("info", "Left Community", "You've left the community.");
      } else {
        await communitiesApi.joinCommunity(params.id);
        // Update local state immediately
        setLocalCommunity({
          ...communityData,
          is_member: true,
          user_role: 'member',
          member_count: communityData.member_count + 1,
        });
        showNotification("success", "Joined Community!", "Welcome to the community!");
      }
    } catch (err: any) {
      showNotification("error", "Action Failed", err.response?.data?.detail || "Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleModelUploadClick = () => {
    setShowModelSelector(true);
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <Link 
            href="/community" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold text-sm sm:text-base">Back to Communities</span>
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

      {/* Community Banner */}
      <div className={`relative overflow-hidden border-b border-orange-500/20 bg-gradient-to-r ${community.banner}`}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-[2000px] mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-5xl border-2 sm:border-4 border-white/20 shadow-2xl flex-shrink-0">
              {community.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                {community.name}
              </h1>
              <p className="text-sm sm:text-lg text-gray-200 mb-3 sm:mb-4 max-w-2xl">
                {community.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-200">
                <span className="flex items-center gap-1">
                  <span>👥</span>
                  <span className="font-semibold">{community.members.toLocaleString()}</span>
                  <span className="hidden sm:inline">members</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>📝</span>
                  <span className="font-semibold">{community.posts.toLocaleString()}</span>
                  <span className="hidden sm:inline">posts</span>
                </span>
                <span className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                  {community.category}
                </span>
                <span className="hidden sm:inline">Created {community.createdDate}</span>
              </div>
            </div>
            <button
              onClick={handleJoinLeave}
              disabled={isJoining || community.userRole === 'admin'}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                community.isJoined
                  ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30'
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {isJoining ? '...' : community.userRole === 'admin' ? '👑 Admin' : community.isJoined ? '✓ Joined' : '+ Join'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8 overflow-x-hidden">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          
          {/* Left Sidebar - About & Members - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">

            {/* Quick Stats */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">📊 Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Members</span>
                  <span className="text-white font-bold">{community.members.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Posts</span>
                  <span className="text-green-400 font-bold">{community.posts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Category</span>
                  <span className="text-purple-400 font-bold">{community.category}</span>
                </div>
              </div>
            </div>

            {/* Top Members */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">👑 Top Members</h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-white font-semibold text-sm truncate">{member.name}</span>
                        {member.verified && <span className="text-orange-400 text-xs">✓</span>}
                      </div>
                      <span className="text-xs text-gray-400">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href={`/community/${params.id}/members`}
                className="w-full mt-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm font-semibold block text-center"
              >
                View All Members
              </Link>
            </div>

            {/* Community Rules */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">📜 Community Rules</h3>
              <div className="space-y-2 text-sm text-gray-300">
                {(communityData.rules || []).map((rule: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <span>{index + 1}.</span>
                    <span>{rule}</span>
                  </div>
                ))}
                {(!communityData.rules || communityData.rules.length === 0) && (
                  <p className="text-gray-400 text-sm">No rules defined yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Center - Feed */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 w-full min-w-0 max-w-full">
            {/* Create Post */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-3 sm:p-6 w-full max-w-full overflow-hidden">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  👤
                </div>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share your work, ask questions, or start a discussion..."
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm sm:text-base placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              {/* Attachment Previews */}
              {(selectedImage || selectedModel) && (
                <div className="mb-4 space-y-2">
                  {selectedImage && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg">
                      <span className="text-2xl">📷</span>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm">{selectedImage.name}</div>
                        <div className="text-xs text-gray-400">{(selectedImage.size / 1024).toFixed(1)} KB</div>
                      </div>
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {selectedModel && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-lg">
                      <span className="text-2xl">🎨</span>
                      <div className="flex-1">
                        <div className="text-white font-semibold text-sm">{selectedModel.title}</div>
                        <div className="text-xs text-gray-400">3D Model</div>
                      </div>
                      <button
                        onClick={() => setSelectedModel(null)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleImageUploadClick}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-purple-500/50 transition text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <span>📷</span>
                    <span>Photo</span>
                  </button>
                  <button
                    onClick={handleModelUploadClick}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-purple-500/50 transition text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <span>🎨</span>
                    <span>3D Model</span>
                  </button>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-purple-500/50 transition text-sm font-semibold"
                  >
                    😊
                  </button>
                </div>
                
                <button
                  onClick={handleCreatePost}
                  disabled={!postText.trim() && !selectedImage && !selectedModel}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Post Filter */}
            <div className="flex gap-1 sm:gap-2 bg-slate-900/50 p-1 sm:p-2 rounded-xl border border-orange-500/20">
              <button
                onClick={() => setPostFilter('recent')}
                className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${
                  postFilter === 'recent'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🕐 <span className="hidden xs:inline">Recent</span>
              </button>
              <button
                onClick={() => setPostFilter('popular')}
                className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${
                  postFilter === 'popular'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🔥 <span className="hidden xs:inline">Popular</span>
              </button>
              <button
                onClick={() => setPostFilter('media')}
                className={`flex-1 py-2 rounded-lg font-semibold text-xs sm:text-sm transition ${
                  postFilter === 'media'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎨 <span className="hidden xs:inline">Media</span>
              </button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4 sm:space-y-6 w-full max-w-full">
              {posts.length === 0 ? (
                <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 sm:p-12 text-center max-w-full">
                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">No Posts Yet</h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                    Be the first to share something with this community!
                  </p>
                  {community.isJoined && (
                    <button
                      onClick={() => document.querySelector('textarea')?.focus()}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm sm:text-base hover:from-purple-600 hover:to-pink-600 transition"
                    >
                      Create First Post
                    </button>
                  )}
                </div>
              ) : (
                posts.map((post: any) => (
                <div
                  key={post.id}
                  className={`bg-slate-900/50 border rounded-xl overflow-hidden w-full max-w-full ${
                    post.isPinned
                      ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                      : 'border-orange-500/20'
                  }`}
                >
                  {/* Pinned Badge */}
                  {post.isPinned && (
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30 px-4 py-2">
                      <span className="text-yellow-400 text-sm font-semibold flex items-center gap-2">
                        <span>📌</span>
                        <span>Pinned Post</span>
                      </span>
                    </div>
                  )}

                  {/* Post Header */}
                  <div className="p-3 sm:p-6 pb-2 sm:pb-4 w-full max-w-full overflow-hidden">
                    <div className="flex items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg sm:text-2xl flex-shrink-0">
                        {post.authorAvatar}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-white font-bold text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{post.author}</span>
                          {post.authorVerified && (
                            <span className="text-orange-400 text-xs sm:text-sm flex-shrink-0" title="Verified">✓</span>
                          )}
                          <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">•</span>
                          <span className="text-gray-400 text-xs sm:text-sm truncate">{post.time}</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white transition text-lg sm:text-2xl flex-shrink-0">
                        ⋯
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed break-words">{post.content}</p>

                    {/* Media Attachments */}
                    {post.image && (
                      <div className="mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden bg-slate-800 border border-slate-700 max-w-full">
                        <img 
                          src={post.image} 
                          alt="Post image"
                          className="w-full h-auto object-cover max-w-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="aspect-video flex items-center justify-center text-4xl sm:text-6xl">🖼️</div>';
                          }}
                        />
                      </div>
                    )}

                    {post.model && (
                      <div className="mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-3 sm:p-6 max-w-full">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-3xl flex-shrink-0">
                            🎨
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="text-white font-bold text-xs sm:text-base mb-1 truncate">
                              {post.modelData?.title || '3D Model'}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400 truncate">
                              {post.modelData?.file_formats?.[0]?.toUpperCase() || 'GLB'} Format
                              {post.modelData?.poly_count && (
                                <span className="hidden sm:inline ml-2">• {post.modelData.poly_count.toLocaleString()} polys</span>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              // Backend now returns full model object with file_formats
                              if (post.modelData) {
                                handleViewModel(post.modelData);
                              } else {
                                // Fallback for posts without expanded model data
                                handleViewModel({
                                  file_url: post.model,
                                  title: '3D Model',
                                  category: 'Unknown',
                                  id: null,
                                  file_formats: ['glb'],
                                });
                              }
                            }}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reactions Summary */}
                    <div className="flex items-center justify-between py-2 sm:py-3 border-t border-slate-700 gap-2">
                      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                        <div className="flex -space-x-1 flex-shrink-0">
                          {Object.entries(post.reactions as Record<string, number>).filter(([_, count]) => (count as number) > 0).map(([reaction]) => (
                            <span key={reaction} className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs border border-slate-700">
                              {reaction === 'like' ? '👍' : reaction === 'love' ? '❤️' : reaction === 'wow' ? '😮' : '🔥'}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-400 text-xs sm:text-sm truncate">
                          {Object.values(post.reactions as Record<string, number>).reduce((a: number, b: number) => a + b, 0)} reactions
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 flex-shrink-0">
                        <span className="whitespace-nowrap">{post.comments} <span className="hidden xs:inline">comments</span></span>
                        <span className="whitespace-nowrap">{post.shares} <span className="hidden xs:inline">shares</span></span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 pt-3 border-t border-slate-700">
                      <div className="relative flex-1 group">
                        <button
                          className={`w-full py-2 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1 sm:gap-2 ${
                            post.userReaction
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                          }`}
                        >
                          <span className="text-base sm:text-lg">
                            {post.userReaction === 'like' ? '👍' : post.userReaction === 'love' ? '❤️' : post.userReaction === 'wow' ? '😮' : post.userReaction === 'fire' ? '🔥' : '👍'}
                          </span>
                          <span className="hidden xs:inline">React</span>
                        </button>
                        
                        {/* Reaction Picker */}
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-slate-800 border border-slate-700 rounded-full p-2 gap-1 shadow-xl z-10">
                          {reactions.map((reaction) => (
                            <button
                              key={reaction.label}
                              onClick={() => handleReaction(post.id, reaction.label)}
                              className="w-8 h-8 sm:w-10 sm:h-10 hover:scale-125 transition-transform"
                              title={reaction.label}
                            >
                              {reaction.emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          loadComments(post.id);
                          const commentInput = document.getElementById(`comment-input-${post.id}`) as HTMLInputElement;
                          commentInput?.focus();
                        }}
                        className="flex-1 py-2 bg-slate-800 text-gray-400 hover:bg-slate-700 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1 sm:gap-2"
                      >
                        <span className="text-base sm:text-lg">💬</span>
                        <span className="hidden xs:inline">Comment</span>
                      </button>

                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex-1 py-2 bg-slate-800 text-gray-400 hover:bg-slate-700 rounded-lg font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-1 sm:gap-2"
                      >
                        <span className="text-base sm:text-lg">🔗</span>
                        <span className="hidden xs:inline">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-slate-700 bg-slate-950/50 p-3 sm:p-6 w-full max-w-full overflow-hidden">
                    {/* Loading Comments */}
                    {loadingComments[post.id] && (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        <span className="animate-pulse">Loading comments...</span>
                      </div>
                    )}

                    {/* Existing Comments */}
                    {!loadingComments[post.id] && comments[post.id] && comments[post.id].length > 0 && (
                      <div className="space-y-3 sm:space-y-4 mb-4">
                        {comments[post.id].map((comment) => (
                          <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={post.id}
                            depth={0}
                            onLike={handleLikeComment}
                            onReply={handleReplyToComment}
                          />
                        ))}
                      </div>
                    )}

                    {/* No Comments Message */}
                    {!loadingComments[post.id] && comments[post.id] && comments[post.id].length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm mb-4">
                        No comments yet. Be the first to comment!
                      </div>
                    )}

                    {/* Add Comment - Always Visible */}
                    <div className="w-full max-w-full">
                      {/* Reply indicator */}
                      {replyingTo[post.id] && (
                        <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 sm:px-4 py-2 mb-2">
                          <span className="text-purple-400 text-xs sm:text-sm truncate">
                            💬 Replying to comment
                          </span>
                          <button
                            onClick={() => cancelReply(post.id)}
                            className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-semibold flex-shrink-0"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 sm:gap-3 w-full">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                          👤
                        </div>
                        <input
                          id={`comment-input-${post.id}`}
                          type="text"
                          placeholder={replyingTo[post.id] ? "Write a reply..." : "Write a comment..."}
                          value={commentText[post.id] || ""}
                          onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !isSubmittingComment[post.id]) {
                              handleAddComment(post.id);
                            }
                          }}
                          className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-white text-xs sm:text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                        />
                        <button 
                          onClick={() => handleAddComment(post.id)}
                          disabled={isSubmittingComment[post.id]}
                          className="px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                          {isSubmittingComment[post.id] ? "..." : "Post"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Activity & Suggestions - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Top Members */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">👑 Top Members</h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-white font-semibold text-sm truncate">{member.name}</span>
                        {member.verified && <span className="text-orange-400 text-xs">✓</span>}
                      </div>
                      <span className="text-xs text-gray-400">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href={`/community/${params.id}/members`}
                className="w-full mt-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm font-semibold block text-center"
              >
                View All Members
              </Link>
            </div>

            {/* Suggested Communities */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">💡 You Might Like</h3>
              {suggestedCommunities.length > 0 ? (
                <div className="space-y-3">
                  {suggestedCommunities.map((comm: any) => (
                    <Link 
                      key={comm.id} 
                      href={`/community/${comm.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {comm.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm truncate group-hover:text-purple-400 transition">{comm.name}</div>
                        <div className="text-xs text-gray-400">{comm.members.toLocaleString()} members</div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/community/${comm.id}`;
                        }}
                        className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs font-semibold"
                      >
                        View
                      </button>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-gray-400 text-sm">No similar communities found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Model Selector Modal */}
      {showModelSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-orange-500/30 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Select a 3D Model</h2>
              <button
                onClick={() => setShowModelSelector(false)}
                className="text-gray-400 hover:text-white transition text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {modelsLoading ? (
                <div className="text-center py-12">
                  <LoadingSpinner />
                </div>
              ) : userModels.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-white font-bold text-xl mb-2">No Models Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Upload your first 3D model to share it with the community!
                  </p>
                  <Link
                    href="/upload"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                  >
                    Upload Model
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userModels.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => handleModelSelect(model)}
                      className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden cursor-pointer hover:border-purple-500 transition group"
                    >
                      {/* Model Thumbnail */}
                      <div className="aspect-video bg-slate-700 flex items-center justify-center overflow-hidden">
                        {model.thumbnail_url ? (
                          <img 
                            src={model.thumbnail_url} 
                            alt={model.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-4xl">🎨</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-1 truncate group-hover:text-purple-400 transition">
                          {model.title}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">{model.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3D Model Viewer Modal */}
      {showModelViewer && viewingModel && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-orange-500/30 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-white">{viewingModel.title}</h2>
                <p className="text-gray-400 text-sm">3D Model Preview</p>
              </div>
              <div className="flex items-center gap-3">
                {viewingModel.id && (
                  <Link
                    href={`/view/${viewingModel.id}`}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold text-sm flex items-center gap-2"
                  >
                    <span>🚀</span>
                    <span>Expanded View</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    setShowModelViewer(false);
                    setViewingModel(null);
                  }}
                  className="text-gray-400 hover:text-white transition text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 flex-1 overflow-auto">
              <div className="aspect-video bg-slate-800 rounded-xl overflow-hidden mb-4">
                {viewingModel.file_url ? (
                  <ModelViewer3D
                    modelUrl={viewingModel.file_url}
                    fileFormat={viewingModel.file_formats?.[0]?.toLowerCase() || 'glb'}
                    autoRotate={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-6xl mb-4">⚠️</div>
                      <div>No model URL available</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400 flex flex-wrap gap-4">
                  {viewingModel.category && viewingModel.category !== 'Unknown' && (
                    <span className="flex items-center gap-1">
                      <span className="text-purple-400">📁</span>
                      <span>{viewingModel.category}</span>
                    </span>
                  )}
                  {viewingModel.file_formats && viewingModel.file_formats.length > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="text-orange-400">📦</span>
                      <span>{viewingModel.file_formats.join(', ').toUpperCase()}</span>
                    </span>
                  )}
                  {viewingModel.poly_count && (
                    <span className="flex items-center gap-1">
                      <span className="text-green-400">🔺</span>
                      <span>{viewingModel.poly_count.toLocaleString()} polys</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
