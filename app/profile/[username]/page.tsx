"use client";

import Link from "next/link";
import { useState } from "react";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import { useProfile } from "@/lib/api/hooks/useProfile";
import { useModels } from "@/lib/api/hooks/useModels";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [activeTab, setActiveTab] = useState<'models' | 'collections' | 'about'>('models');
  const [following, setFollowing] = useState(false);

  // Fetch user profile and their models
  const { user: apiUser, loading: userLoading, error: userError } = useProfile(params.username);
  const { models: apiModels, loading: modelsLoading } = useModels({ limit: 20 });

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

  if (userLoading) return <LoadingSpinner />;
  if (userError || !apiUser) return <ErrorMessage error={userError || "Profile not found"} />;

  const user = {
    username: apiUser.username,
    name: apiUser.full_name,
    avatar: apiUser.avatar_url || "🎨",
    bio: apiUser.bio || "No bio available",
    verified: apiUser.is_verified_creator,
    stats: {
      followers: 0, // Would need separate API
      following: 0,
      models: apiUser.total_models,
      totalSales: apiUser.total_sales,
      rating: apiUser.rating,
      reviews: 0,
    },
    social: {
      website: "",
      twitter: "",
      instagram: "",
      artstation: "",
    },
    skills: [],
    joinedDate: new Date(apiUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  };

  const models = apiModels.map(m => ({
    id: m.id,
    title: m.title,
    thumbnail: m.thumbnail_url,
    price: m.price,
    likes: m.likes,
    downloads: m.downloads,
  }));

  const collections = [
    { id: 1, name: "Game Assets", count: 24, thumbnail: "🎮" },
    { id: 2, name: "Favorites", count: 15, thumbnail: "⭐" },
    { id: 3, name: "Inspiration", count: 32, thumbnail: "💡" },
  ];

  const handleFollow = () => {
    setFollowing(!following);
    showNotification(
      following ? "info" : "success",
      following ? "Unfollowed" : "Following!",
      following ? `You unfollowed ${user.name}` : `You're now following ${user.name}`
    );
  };

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
    setTimeout(() => setNotification(prev => ({ ...prev, isOpen: false })), 3000);
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
            href="/marketplace" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link href="/community" className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm font-semibold">
              👥 Community
            </Link>
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="relative overflow-hidden border-b border-orange-500/20 bg-gradient-to-r from-orange-900/20 via-red-900/20 to-pink-900/20">
        <div className="max-w-[2000px] mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-6xl flex-shrink-0 shadow-2xl">
              {user.avatar}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-black text-white">{user.name}</h1>
                {user.verified && <span className="text-orange-400 text-2xl" title="Verified">✓</span>}
              </div>
              <p className="text-xl text-gray-400 mb-4">@{user.username}</p>
              <p className="text-gray-300 mb-6 max-w-2xl">{user.bio}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-6">
                <Link href={`/profile/${user.username}/followers`} className="hover:text-orange-400 transition">
                  <div className="text-2xl font-black text-white">{user.stats.followers.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </Link>
                <div>
                  <div className="text-2xl font-black text-white">{user.stats.following.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{user.stats.models}</div>
                  <div className="text-sm text-gray-400">Models</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-orange-400">{user.stats.rating} ⭐</div>
                  <div className="text-sm text-gray-400">{user.stats.reviews} reviews</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-xl font-bold transition ${
                    following
                      ? 'bg-slate-800 border-2 border-slate-700 text-gray-400 hover:border-red-500 hover:text-red-400'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  {following ? '✓ Following' : '+ Follow'}
                </button>
                <button className="px-6 py-3 bg-slate-800 border-2 border-slate-700 text-white rounded-xl font-bold hover:bg-slate-700 transition">
                  💬 Message
                </button>
                <button className="px-6 py-3 bg-slate-800 border-2 border-slate-700 text-white rounded-xl font-bold hover:bg-slate-700 transition">
                  🔗 Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2000px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">🛠️ Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-400 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">🔗 Links</h3>
              <div className="space-y-2">
                {user.social.website && (
                  <a href={`https://${user.social.website}`} target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-orange-400 transition text-sm">
                    🌐 {user.social.website}
                  </a>
                )}
                {user.social.twitter && (
                  <a href={`https://twitter.com/${user.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-orange-400 transition text-sm">
                    🐦 {user.social.twitter}
                  </a>
                )}
                {user.social.instagram && (
                  <a href={`https://instagram.com/${user.social.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-orange-400 transition text-sm">
                    📷 {user.social.instagram}
                  </a>
                )}
                {user.social.artstation && (
                  <a href={`https://artstation.com/${user.social.artstation}`} target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-orange-400 transition text-sm">
                    🎨 ArtStation
                  </a>
                )}
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">📅 Member Since</h3>
              <p className="text-gray-400">{user.joinedDate}</p>
            </div>
          </div>

          {/* Center - Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-2 bg-slate-900/50 border border-orange-500/20 rounded-xl p-2 mb-6">
              <button
                onClick={() => setActiveTab('models')}
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  activeTab === 'models'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎨 Models ({user.stats.models})
              </button>
              <button
                onClick={() => setActiveTab('collections')}
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  activeTab === 'collections'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📚 Collections ({collections.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-3 rounded-lg font-bold transition ${
                  activeTab === 'about'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ℹ️ About
              </button>
            </div>

            {/* Models Tab */}
            {activeTab === 'models' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {models.map((model) => (
                  <Link key={model.id} href={`/model/${model.id}`}>
                    <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl overflow-hidden hover:border-orange-500/50 transition cursor-pointer group">
                      <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-6xl">
                        {model.thumbnail}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-bold mb-2 group-hover:text-orange-400 transition">{model.title}</h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-orange-400 font-black text-lg">${model.price}</span>
                          <div className="flex gap-3 text-gray-400">
                            <span>❤️ {model.likes}</span>
                            <span>📥 {model.downloads}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Collections Tab */}
            {activeTab === 'collections' && (
              <div className="grid md:grid-cols-2 gap-4">
                {collections.map((collection) => (
                  <Link key={collection.id} href={`/collections/${collection.id}`}>
                    <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/50 transition cursor-pointer group">
                      <div className="text-5xl mb-4">{collection.thumbnail}</div>
                      <h3 className="text-white font-bold text-lg mb-2 group-hover:text-orange-400 transition">{collection.name}</h3>
                      <p className="text-gray-400 text-sm">{collection.count} models</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-8">
                <h2 className="text-2xl font-black text-white mb-4">About {user.name}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">{user.bio}</p>
                
                <h3 className="text-xl font-bold text-white mb-3">Achievements</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-white font-bold">Top Creator</div>
                    <div className="text-gray-400 text-sm">Ranked #12 globally</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-white font-bold">5-Star Rated</div>
                    <div className="text-gray-400 text-sm">1,234 reviews</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-white font-bold">$5,420 Earned</div>
                    <div className="text-gray-400 text-sm">Total sales</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="text-3xl mb-2">📥</div>
                    <div className="text-white font-bold">2,345 Downloads</div>
                    <div className="text-gray-400 text-sm">Across all models</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">Experience</h3>
                <p className="text-gray-300">10+ years creating AAA game assets for major studios including Epic Games, Ubisoft, and EA. Specialized in character modeling, texturing, and optimization for real-time rendering.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
