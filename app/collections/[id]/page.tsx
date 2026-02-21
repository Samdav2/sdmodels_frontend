"use client";

import Link from "next/link";
import { useState } from "react";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { useCollection } from "@/lib/api/hooks/useCollection";
import { useModels } from "@/lib/api/hooks/useModels";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  // Fetch collection and its models
  const { collection: apiCollection, loading: collectionLoading, error: collectionError } = useCollection(params.id);
  const { models: apiModels, loading: modelsLoading } = useModels({ limit: 50 });

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

  if (collectionLoading) return <LoadingSpinner />;
  if (collectionError || !apiCollection) return <ErrorMessage error={collectionError || "Collection not found"} />;

  // Map API collection to display format
  const collection = {
    id: apiCollection.id,
    name: apiCollection.name,
    description: apiCollection.description || "No description",
    owner: {
      name: apiCollection.owner.full_name,
      username: apiCollection.owner.username,
      avatar: apiCollection.owner.avatar_url || "🎨",
      verified: apiCollection.owner.is_verified_creator,
    },
    modelCount: apiCollection.model_count,
    totalViews: apiCollection.views,
    followers: apiCollection.followers,
    isPublic: apiCollection.is_public,
    createdAt: apiCollection.created_at,
    updatedAt: apiCollection.updated_at,
  };

  const models = apiModels.map(m => ({
    id: m.id,
    title: m.title,
    thumbnail: m.thumbnail_url,
    price: m.price,
    isFree: m.is_free,
    creator: m.creator?.username || 
             m.creator?.full_name || 
             `Creator #${m.creator_id || 'Unknown'}`,
    rating: m.rating,
    downloads: m.downloads,
  }));

  const modelsData = [
    {
      id: 2,
      title: "Neon Sign Pack",
      thumbnail: "💡",
      price: 0,
      isFree: true,
      creator: "Alex Chen",
      rating: 4.9,
      downloads: 892,
    },
    {
      id: 3,
      title: "Futuristic Vehicle",
      thumbnail: "🚗",
      price: 49.99,
      isFree: false,
      creator: "Alex Chen",
      rating: 4.7,
      downloads: 156,
    },
    {
      id: 4,
      title: "Sci-Fi Weapon Set",
      thumbnail: "🔫",
      price: 39.99,
      isFree: false,
      creator: "Alex Chen",
      rating: 4.9,
      downloads: 445,
    },
    {
      id: 5,
      title: "Hologram Effects",
      thumbnail: "✨",
      price: 0,
      isFree: true,
      creator: "Alex Chen",
      rating: 4.6,
      downloads: 1234,
    },
    {
      id: 6,
      title: "Cyberpunk Building",
      thumbnail: "🏢",
      price: 59.99,
      isFree: false,
      creator: "Alex Chen",
      rating: 4.8,
      downloads: 178,
    },
  ];

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const handleFollow = () => {
    showNotification("success", "Following Collection!", "You'll be notified of updates");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification("success", "Link Copied!", "Share this collection with others");
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

      {/* Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/collections" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Collections</span>
          </Link>
          
          <div className="flex items-center gap-3">
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
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Collection Header */}
        <div className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border border-orange-500/30 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Collection Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full text-sm font-bold">
                  {collection.isPublic ? "🌍 Public" : "🔒 Private"}
                </span>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-400 text-sm">{collection.modelCount} models</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {collection.name}
              </h1>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {collection.description}
              </p>

              {/* Owner Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl">
                  {collection.owner.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/profile/${collection.owner.username}`} className="text-white font-bold hover:text-orange-400 transition">
                      {collection.owner.name}
                    </Link>
                    {collection.owner.verified && <span className="text-orange-400">✓</span>}
                  </div>
                  <span className="text-gray-400 text-sm">Collection Owner</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
                <span>👁️ {collection.totalViews.toLocaleString()} views</span>
                <span>👥 {collection.followers} followers</span>
                <span>📅 Created {new Date(collection.createdAt).toLocaleDateString()}</span>
                <span>🔄 Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleFollow}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition font-semibold"
                >
                  + Follow Collection
                </button>
                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white rounded-xl font-semibold transition"
                >
                  🔗 Share
                </button>
                <button className="px-6 py-3 bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white rounded-xl font-semibold transition">
                  🔖 Save
                </button>
              </div>
            </div>

            {/* Collection Preview */}
            <div className="lg:w-96">
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">📊 Collection Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Models</span>
                    <span className="text-white font-bold">{collection.modelCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Views</span>
                    <span className="text-white font-bold">{collection.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Followers</span>
                    <span className="text-white font-bold">{collection.followers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Free Models</span>
                    <span className="text-white font-bold">{models.filter(m => m.isFree).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Premium Models</span>
                    <span className="text-white font-bold">{models.filter(m => !m.isFree).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white mb-4">🎨 Models in Collection</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map((model) => (
            <Link
              key={model.id}
              href={`/model/${model.id}`}
              className="group bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {model.thumbnail}
                </div>
                {model.isFree && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold">
                    FREE
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-bold mb-2 line-clamp-1 group-hover:text-orange-400 transition">
                  {model.title}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">{model.creator}</span>
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <span>⭐</span>
                    <span>{model.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-orange-400 font-bold text-lg">
                    {model.isFree ? "Free" : `$${model.price}`}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ⬇️ {model.downloads}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
