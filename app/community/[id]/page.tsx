"use client";

import Link from "next/link";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { useState, useRef } from "react";

export default function CommunityViewPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed');
  const [postFilter, setPostFilter] = useState<'recent' | 'popular' | 'media'>('recent');
  const [postText, setPostText] = useState("");
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

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

  // Mock community data
  const community = {
    id: params.id,
    name: "3D Game Assets",
    description: "Share and discuss game-ready 3D models, textures, and assets",
    icon: "🎮",
    banner: "from-purple-600 via-pink-600 to-orange-600",
    members: 15234,
    posts: 8921,
    isJoined: true,
    category: "Gaming",
    createdDate: "Jan 2024",
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Alex Chen",
      authorAvatar: "🎨",
      authorVerified: true,
      time: "2 hours ago",
      content: "Just finished this cyberpunk character! Took me 3 weeks but I'm really proud of the result. What do you think? 🚀",
      image: null,
      model: "Cyberpunk_Warrior.glb",
      reactions: {
        like: 124,
        love: 45,
        wow: 23,
        fire: 67,
      },
      userReaction: null,
      comments: 18,
      shares: 12,
      isPinned: true,
    },
    {
      id: 2,
      author: "Sarah Miller",
      authorAvatar: "🚀",
      authorVerified: false,
      time: "5 hours ago",
      content: "Looking for feedback on my low-poly environment pack. Trying to keep it under 10k tris per asset. Any suggestions?",
      image: "environment_pack.jpg",
      model: null,
      reactions: {
        like: 89,
        love: 12,
        wow: 5,
        fire: 34,
      },
      userReaction: "like",
      comments: 24,
      shares: 8,
      isPinned: false,
    },
    {
      id: 3,
      author: "Mike Johnson",
      authorAvatar: "💎",
      authorVerified: true,
      time: "1 day ago",
      content: "New tutorial series coming soon! Advanced hard surface modeling techniques. Drop a 🔥 if you're interested!",
      image: null,
      model: null,
      reactions: {
        like: 234,
        love: 89,
        wow: 12,
        fire: 156,
      },
      userReaction: "fire",
      comments: 45,
      shares: 23,
      isPinned: false,
    },
  ]);

  const [comments, setComments] = useState<{ [key: number]: any[] }>({
    1: [
      {
        id: 1,
        author: "Emma Davis",
        avatar: "👩‍🎨",
        text: "This is absolutely stunning! The detail work is incredible.",
        time: "1 hour ago",
        likes: 12,
        replies: [],
      },
      {
        id: 2,
        author: "John Smith",
        avatar: "🎯",
        text: "Amazing work! What software did you use?",
        time: "30 min ago",
        likes: 5,
        replies: [
          {
            id: 3,
            author: "Alex Chen",
            avatar: "🎨",
            text: "@John Smith Blender for modeling, Substance Painter for textures!",
            time: "20 min ago",
            likes: 8,
          },
        ],
      },
    ],
  });

  const members = [
    { id: 1, name: "Alex Chen", avatar: "🎨", role: "Admin", verified: true },
    { id: 2, name: "Sarah Miller", avatar: "🚀", role: "Moderator", verified: false },
    { id: 3, name: "Mike Johnson", avatar: "💎", role: "Member", verified: true },
    { id: 4, name: "Emma Davis", avatar: "👩‍🎨", role: "Member", verified: false },
    { id: 5, name: "John Smith", avatar: "🎯", role: "Member", verified: false },
  ];

  const reactions = [
    { emoji: "👍", label: "Like" },
    { emoji: "❤️", label: "Love" },
    { emoji: "😮", label: "Wow" },
    { emoji: "🔥", label: "Fire" },
  ];

  const handleCreatePost = () => {
    if (!postText.trim()) {
      showNotification("error", "Empty Post", "Please write something before posting.");
      return;
    }

    const newPost = {
      id: posts.length + 1,
      author: "You",
      authorAvatar: "👤",
      authorVerified: false,
      time: "Just now",
      content: postText,
      image: null,
      model: null as string | null,
      reactions: { like: 0, love: 0, wow: 0, fire: 0 },
      userReaction: null as string | null,
      comments: 0,
      shares: 0,
      isPinned: false,
    };

    setPosts([newPost as any, ...posts]);
    setPostText("");
    showNotification("success", "Post Created!", "Your post has been shared with the community.");
  };

  const handleReaction = (postId: number, reaction: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const reactionKey = reaction.toLowerCase() as keyof typeof post.reactions;
        const newReactions = { ...post.reactions };
        
        if (post.userReaction === reaction) {
          newReactions[reactionKey]--;
          return { ...post, userReaction: null, reactions: newReactions };
        } else {
          if (post.userReaction) {
            const oldKey = post.userReaction.toLowerCase() as keyof typeof post.reactions;
            newReactions[oldKey]--;
          }
          newReactions[reactionKey]++;
          return { ...post, userReaction: reaction, reactions: newReactions };
        }
      }
      return post;
    }) as any);
  };

  const handleShare = (postId: number) => {
    navigator.clipboard.writeText(`${window.location.origin}/community/${community.id}/post/${postId}`);
    showNotification("success", "Link Copied!", "Post link copied to clipboard.");
  };

  const handleJoinLeave = () => {
    showNotification(
      community.isJoined ? "info" : "success",
      community.isJoined ? "Left Community" : "Joined Community!",
      community.isJoined ? "You've left the community." : "Welcome to the community!"
    );
  };

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleModelUpload = () => {
    modelInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showNotification("success", "File Uploaded!", `${file.name} has been attached to your post.`);
    }
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

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={modelInputRef}
        type="file"
        accept=".glb,.gltf,.fbx,.obj"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/community" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Communities</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link
              href="/support"
              className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm font-semibold"
            >
              💬 Support
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

      {/* Community Banner */}
      <div className={`relative overflow-hidden border-b border-orange-500/20 bg-gradient-to-r ${community.banner}`}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-[2000px] mx-auto px-6 py-12">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center text-5xl border-4 border-white/20 shadow-2xl flex-shrink-0">
              {community.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                {community.name}
              </h1>
              <p className="text-lg text-gray-200 mb-4 max-w-2xl">
                {community.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                <span className="flex items-center gap-1">
                  <span>👥</span>
                  <span className="font-semibold">{community.members.toLocaleString()}</span>
                  <span>members</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>📝</span>
                  <span className="font-semibold">{community.posts.toLocaleString()}</span>
                  <span>posts</span>
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  {community.category}
                </span>
                <span>Created {community.createdDate}</span>
              </div>
            </div>
            <button
              onClick={handleJoinLeave}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition shadow-lg ${
                community.isJoined
                  ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-2 border-white/30'
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {community.isJoined ? '✓ Joined' : '+ Join Community'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - About & Members */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">📊 Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total Members</span>
                  <span className="text-white font-bold">{community.members.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Posts Today</span>
                  <span className="text-green-400 font-bold">+47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Now</span>
                  <span className="text-purple-400 font-bold">234</span>
                </div>
              </div>
            </div>

            {/* Top Members */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">👑 Top Members</h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
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
              <button className="w-full mt-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm font-semibold">
                View All Members
              </button>
            </div>

            {/* Community Rules */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">📜 Community Rules</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex gap-2">
                  <span>1.</span>
                  <span>Be respectful and professional</span>
                </div>
                <div className="flex gap-2">
                  <span>2.</span>
                  <span>Share original work only</span>
                </div>
                <div className="flex gap-2">
                  <span>3.</span>
                  <span>No spam or self-promotion</span>
                </div>
                <div className="flex gap-2">
                  <span>4.</span>
                  <span>Give credit where due</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  👤
                </div>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share your work, ask questions, or start a discussion..."
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={handleImageUpload}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-purple-500/50 transition text-sm font-semibold flex items-center gap-2"
                  >
                    <span>📷</span>
                    <span>Photo</span>
                  </button>
                  <button
                    onClick={handleModelUpload}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-purple-500/50 transition text-sm font-semibold flex items-center gap-2"
                  >
                    <span>🎨</span>
                    <span>3D Model</span>
                  </button>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-gray-400 rounded-lg hover:border-purple-500/50 transition text-sm font-semibold"
                  >
                    😊
                  </button>
                </div>
                
                <button
                  onClick={handleCreatePost}
                  disabled={!postText.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>

            {/* Post Filter */}
            <div className="flex gap-2 bg-slate-900/50 p-2 rounded-xl border border-orange-500/20">
              <button
                onClick={() => setPostFilter('recent')}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
                  postFilter === 'recent'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🕐 Recent
              </button>
              <button
                onClick={() => setPostFilter('popular')}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
                  postFilter === 'popular'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🔥 Popular
              </button>
              <button
                onClick={() => setPostFilter('media')}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
                  postFilter === 'media'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎨 Media
              </button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`bg-slate-900/50 border rounded-xl overflow-hidden ${
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
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                        {post.authorAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold">{post.author}</span>
                          {post.authorVerified && (
                            <span className="text-orange-400" title="Verified">✓</span>
                          )}
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-400 text-sm">{post.time}</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white transition text-2xl">
                        ⋯
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>

                    {/* Media Attachments */}
                    {post.image && (
                      <div className="mb-4 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                        <div className="aspect-video flex items-center justify-center text-6xl">
                          🖼️
                        </div>
                      </div>
                    )}

                    {post.model && (
                      <div className="mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl">
                            🎨
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-bold mb-1">{post.model}</div>
                            <div className="text-sm text-gray-400">3D Model • GLB Format</div>
                          </div>
                          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold text-sm">
                            View 3D
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reactions Summary */}
                    <div className="flex items-center justify-between py-3 border-t border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {Object.entries(post.reactions).filter(([_, count]) => count > 0).map(([reaction]) => (
                            <span key={reaction} className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs border border-slate-700">
                              {reaction === 'like' ? '👍' : reaction === 'love' ? '❤️' : reaction === 'wow' ? '😮' : '🔥'}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {Object.values(post.reactions).reduce((a, b) => a + b, 0)} reactions
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-700">
                      <div className="relative flex-1">
                        <button
                          className={`w-full py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                            post.userReaction
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                          }`}
                        >
                          <span className="text-lg">
                            {post.userReaction === 'like' ? '👍' : post.userReaction === 'love' ? '❤️' : post.userReaction === 'wow' ? '😮' : post.userReaction === 'fire' ? '🔥' : '👍'}
                          </span>
                          <span>React</span>
                        </button>
                        
                        {/* Reaction Picker */}
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-slate-800 border border-slate-700 rounded-full p-2 gap-1 shadow-xl">
                          {reactions.map((reaction) => (
                            <button
                              key={reaction.label}
                              onClick={() => handleReaction(post.id, reaction.label)}
                              className="w-10 h-10 hover:scale-125 transition-transform"
                              title={reaction.label}
                            >
                              {reaction.emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button className="flex-1 py-2 bg-slate-800 text-gray-400 hover:bg-slate-700 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2">
                        <span className="text-lg">💬</span>
                        <span>Comment</span>
                      </button>

                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex-1 py-2 bg-slate-800 text-gray-400 hover:bg-slate-700 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                      >
                        <span className="text-lg">🔗</span>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {comments[post.id] && comments[post.id].length > 0 && (
                    <div className="border-t border-slate-700 bg-slate-950/50 p-6">
                      <div className="space-y-4">
                        {comments[post.id].map((comment) => (
                          <div key={comment.id}>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                {comment.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-white font-semibold text-sm">{comment.author}</span>
                                    <span className="text-xs text-gray-500">{comment.time}</span>
                                  </div>
                                  <p className="text-gray-300 text-sm">{comment.text}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                  <button className="hover:text-purple-400 transition">👍 {comment.likes}</button>
                                  <button className="hover:text-purple-400 transition">Reply</button>
                                </div>

                                {/* Nested Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="ml-8 mt-3 space-y-3">
                                    {comment.replies.map((reply: any) => (
                                      <div key={reply.id} className="flex items-start gap-3">
                                        <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                                          {reply.avatar}
                                        </div>
                                        <div className="flex-1">
                                          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-white font-semibold text-sm">{reply.author}</span>
                                              <span className="text-xs text-gray-500">{reply.time}</span>
                                            </div>
                                            <p className="text-gray-300 text-sm">{reply.text}</p>
                                          </div>
                                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                            <button className="hover:text-purple-400 transition">👍 {reply.likes}</button>
                                            <button className="hover:text-purple-400 transition">Reply</button>
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

                      {/* Add Comment */}
                      <div className="flex items-center gap-3 mt-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                          👤
                        </div>
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-white text-sm placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                        />
                        <button className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition font-semibold text-sm">
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Activity & Suggestions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Online Members */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Online Now (234)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg cursor-pointer hover:scale-110 transition-transform"
                    title={member.name}
                  >
                    {member.avatar}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">📅 Upcoming Events</h3>
              <div className="space-y-3">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <div className="text-white font-semibold text-sm mb-1">Weekly Challenge</div>
                  <div className="text-xs text-gray-400">Tomorrow at 10:00 AM</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <div className="text-white font-semibold text-sm mb-1">Live Q&A Session</div>
                  <div className="text-xs text-gray-400">Friday at 3:00 PM</div>
                </div>
              </div>
            </div>

            {/* Suggested Communities */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">💡 You Might Like</h3>
              <div className="space-y-3">
                {[
                  { name: "Blender Masters", icon: "🔷", members: 23456 },
                  { name: "Texture Artists", icon: "🎨", members: 6543 },
                ].map((comm, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {comm.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">{comm.name}</div>
                      <div className="text-xs text-gray-400">{comm.members.toLocaleString()} members</div>
                    </div>
                    <button className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-xs font-semibold">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
