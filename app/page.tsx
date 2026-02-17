"use client";

import Link from "next/link";
import ModelCard from "@/components/ModelCard";
import HeroBackground3D from "@/components/HeroBackground3D";
import LiveStatsTicker from "@/components/LiveStatsTicker";
import FilterSidebar from "@/components/FilterSidebar";
import CreatorLeaderboard from "@/components/CreatorLeaderboard";
import HoloCarousel from "@/components/HoloCarousel";
import CredibilityNav from "@/components/CredibilityNav";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { useState } from "react";
import { useModels } from "@/lib/api/hooks/useModels";
import { Model } from "@/lib/api/types";

// Helper function to map API Model to ModelCard props
const mapModelToCard = (model: Model) => ({
  id: model.id.toString(),
  name: model.title,
  price: model.price,
  polyCount: model.poly_count,
  thumbnail: model.thumbnail_url,
  formats: model.file_formats,
  isRigged: model.has_rigging,
  isNew: false, // Can be calculated based on created_at
  isHot: model.is_featured,
  category: model.category,
});

const topCreators = [
  { id: 1, name: "PixelForge", avatar: "🎨", sales: 1240, badge: "🏆" },
  { id: 2, name: "3D_Wizard", avatar: "🧙", sales: 980, badge: "🥈" },
  { id: 3, name: "MeshMaster", avatar: "⚡", sales: 856, badge: "🥉" },
  { id: 4, name: "PolyPro", avatar: "💎", sales: 742, badge: "⭐" },
  { id: 5, name: "VoxelVerse", avatar: "🌟", sales: 698, badge: "⭐" },
];

const trendingTags = [
  "#Cyberpunk", "#Stylized", "#HyperRealistic", "#LowPoly", 
  "#SciFi", "#Fantasy", "#Anime", "#PBR", "#GameReady"
];

const trustedBy = [
  "Unity Studios", "Epic Games", "Indie Devs", "Blender Artists", "Game Jams"
];

// Featured 3D models for the Holo-Carousel
// Note: Replace these with actual .glb model URLs from your backend
const featuredModels = [
  {
    id: "featured-1",
    name: "Cyberpunk Mech Warrior",
    url: "placeholder", // Will use procedural geometry
    polyCount: 18500,
    category: "Characters",
    price: 59.99,
  },
  {
    id: "featured-2",
    name: "Futuristic Vehicle",
    url: "placeholder",
    polyCount: 12400,
    category: "Vehicles",
    price: 44.99,
  },
  {
    id: "featured-3",
    name: "Sci-Fi Weapon Pack",
    url: "placeholder",
    polyCount: 8200,
    category: "Weapons",
    price: 34.99,
  },
  {
    id: "featured-4",
    name: "Neon City Props",
    url: "placeholder",
    polyCount: 15000,
    category: "Environments",
    price: 39.99,
  },
  {
    id: "featured-5",
    name: "Holographic Interface",
    url: "placeholder",
    polyCount: 6500,
    category: "UI Elements",
    price: 24.99,
  },
];

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    polyCount: "all",
    formats: [] as string[],
    animationReady: false,
  });

  // Fetch featured models from API
  const { models, loading, error } = useModels({ 
    limit: 8,
    sort: 'popular'
  });

  // Map API models to card format
  const displayModels = models.map(mapModelToCard);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden w-full">
      {/* Live Stats Ticker */}
      <LiveStatsTicker />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-[9999] border-b border-orange-500/20 bg-slate-900/95 backdrop-blur-xl shadow-lg w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-sm sm:text-lg">SD</span>
            </div>
            <h1 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              SDModels
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href="/about" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition hidden xl:block">
              About
            </Link>
            <Link href="/bounties" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition hidden lg:block">
              Bounties
            </Link>
            <Link href="/leaderboard" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition hidden lg:block">
              Leaderboard
            </Link>
            <div className="hidden md:block">
              <CredibilityNav />
            </div>
            <Link href="/browse" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition hidden lg:block">
              Browse
            </Link>
            <button
              onClick={() => {
                const isAuthenticated = localStorage.getItem('access_token');
                window.location.href = isAuthenticated ? '/upload' : '/auth';
              }}
              className="px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 hidden lg:block"
            >
              <span className="hidden sm:inline">Start Selling</span>
              <span className="sm:hidden">Sell</span>
            </button>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Background */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* 3D Background - Fixed positioning */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
          <HeroBackground3D />
        </div>
        
        {/* Glassmorphism container for hero text */}
        <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center space-y-4 lg:space-y-6">
              {/* Glassmorphism background for text with glowing orange border */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[95%] sm:w-full max-w-5xl h-auto min-h-[500px] lg:min-h-[550px] bg-gradient-to-br from-slate-900/25 via-slate-800/15 to-slate-900/25 backdrop-blur-lg rounded-3xl border-2 border-orange-500/40 shadow-[0_0_60px_rgba(255,107,53,0.4),inset_0_0_60px_rgba(255,107,53,0.1)]" />
              </div>

              <div className="relative z-10 space-y-4 lg:space-y-6">
                {/* Badge */}
                <div className="inline-block">
                  <span className="px-4 sm:px-5 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/60 rounded-full text-orange-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
                    ⚡ NEXT-GEN 3D MARKETPLACE
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight drop-shadow-2xl px-4">
                  <span className="block">The Next Dimension</span>
                  <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,107,53,0.6)]">
                    of Digital Assets
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-3xl mx-auto font-medium drop-shadow-lg px-6 leading-relaxed">
                  Buy, Sell, and Preview 3D Models in Real-Time.
                  <br className="hidden sm:block" />
                  <span className="block sm:inline mt-1 sm:mt-0">Built for creators who demand excellence.</span>
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 px-4 max-w-2xl mx-auto">
                  <Link href="/marketplace">
                    <button className="group w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 backdrop-blur-md border-2 border-orange-400/60 text-white rounded-xl hover:shadow-[0_0_50px_rgba(255,107,53,0.7)] transition-all font-bold text-sm sm:text-base shadow-2xl shadow-orange-500/50 hover:scale-105 hover:border-orange-300">
                      <span className="flex items-center justify-center gap-2">
                        <span>🎮</span>
                        <span>Explore Marketplace</span>
                      </span>
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      const isAuthenticated = localStorage.getItem('access_token');
                      window.location.href = isAuthenticated ? '/upload' : '/auth';
                    }}
                    className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-white/10 backdrop-blur-xl border-2 border-white/40 text-white rounded-xl hover:bg-white/20 hover:border-white/60 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all font-bold text-sm sm:text-base hover:scale-105 shadow-xl"
                  >
                    Start Selling →
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 pt-6 lg:pt-8 max-w-4xl mx-auto px-4">
                  <div className="text-center bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-orange-500/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 hover:border-orange-500/70 transition-all">
                    <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">10K+</div>
                    <div className="text-gray-200 mt-1 sm:mt-2 font-bold text-[10px] sm:text-xs md:text-sm">Premium Assets</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-orange-500/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 hover:border-orange-500/70 transition-all">
                    <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">5K+</div>
                    <div className="text-gray-200 mt-1 sm:mt-2 font-bold text-[10px] sm:text-xs md:text-sm">Active Creators</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-orange-500/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 hover:border-orange-500/70 transition-all">
                    <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">99%</div>
                    <div className="text-gray-200 mt-1 sm:mt-2 font-bold text-[10px] sm:text-xs md:text-sm">Quality Certified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Holo-Carousel Section with creative background */}
      <section className="relative z-10 py-12 sm:py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b-2 border-orange-500/30 overflow-hidden max-w-full">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <div className="text-center">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/30 border border-orange-500/60 rounded-full text-orange-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-lg shadow-orange-500/20">
                ⚡ LIVE 3D PREVIEW
              </span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-white mb-3 sm:mb-4 px-4">
              Experience the <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]">Holo-Carousel</span>
            </h3>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Interact with live 3D models in real-time. Rotate, zoom, and inspect every detail before you buy.
            </p>
          </div>
        </div>

        <HoloCarousel models={featuredModels} autoSlideInterval={7000} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="bg-slate-900/70 border-2 border-orange-500/40 rounded-xl p-4 sm:p-6 backdrop-blur-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔄</div>
              <h4 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">360° Rotation</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Click and drag to inspect from every angle</p>
            </div>
            <div className="bg-slate-900/70 border-2 border-orange-500/40 rounded-xl p-4 sm:p-6 backdrop-blur-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔍</div>
              <h4 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">Wireframe Mode</h4>
              <p className="text-gray-300 text-xs sm:text-sm">View topology and mesh quality instantly</p>
            </div>
            <div className="bg-slate-900/70 border-2 border-orange-500/40 rounded-xl p-4 sm:p-6 backdrop-blur-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transition-all">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📊</div>
              <h4 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">Live Data</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Real-time poly count and mesh health</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models with Sidebar */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-l-2 border-r-2 border-orange-500/20 shadow-[0_0_30px_rgba(255,107,53,0.1)]">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-orange-500/50 rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-orange-500/50 rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-orange-500/50 rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-orange-500/50 rounded-br-3xl" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2">
              🔥 Featured <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]">Assets</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-lg">Handpicked by our community</p>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-orange-500/30 border-2 border-orange-500/60 text-orange-300 rounded-lg hover:bg-orange-500/40 hover:shadow-lg hover:shadow-orange-500/30 transition-all font-semibold backdrop-blur-md"
            >
              {showFilters ? "Hide" : "Show"} Filters
            </button>
            <Link href="/browse" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition font-semibold whitespace-nowrap hover:drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]">
              View All →
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-72 flex-shrink-0">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          )}

          {/* Models Grid */}
          <div className="flex-1">
            {/* Trending Tags */}
            <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-800/50 border border-orange-500/30 text-orange-400 rounded-full text-xs sm:text-sm hover:bg-orange-500/20 transition cursor-pointer backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Loading State */}
            {loading && <LoadingSpinner />}

            {/* Error State */}
            {error && <ErrorMessage error={error} />}

            {/* Models Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {displayModels.map((model) => (
                  <ModelCard key={model.id} model={model} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && displayModels.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-white mb-2">No models found</h3>
                <p className="text-gray-400">Check back soon for new content!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h3 className="text-3xl sm:text-5xl font-black text-white mb-3 sm:mb-4">
            Why <span className="text-orange-500">We're Different</span>
          </h3>
          <p className="text-base sm:text-xl text-gray-400">Features that set us apart from the competition</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Smart-Rig Validator */}
          <div className="group bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 sm:border-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur hover:border-orange-500/60 transition-all hover:scale-105">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-orange-500/40 transition">
              <span className="text-3xl sm:text-4xl">🦴</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">Smart-Rig Validator</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">Automated skeleton scanning with Rigging Health Score. Pro-Rig badge for Unity/Unreal standard bones.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-green-500/20 border border-green-500/40 text-green-300 px-2 sm:px-3 py-1 rounded-full">✓ Pro-Rig</span>
              <span className="text-xs bg-orange-500/20 border border-orange-500/40 text-orange-300 px-2 sm:px-3 py-1 rounded-full">Auto-Scan</span>
            </div>
          </div>

          {/* Material Swapper */}
          <div className="group bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 sm:border-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur hover:border-purple-500/60 transition-all hover:scale-105">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-purple-500/40 transition">
              <span className="text-3xl sm:text-4xl">🎨</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">Live Material Swapper</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">Upload custom textures or change colors in real-time before buying. See it in your palette instantly.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2 sm:px-3 py-1 rounded-full">Live Preview</span>
              <span className="text-xs bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2 sm:px-3 py-1 rounded-full">Custom Tex</span>
            </div>
          </div>

          {/* Gaussian Splatting */}
          <div className="group bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 sm:border-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur hover:border-cyan-500/60 transition-all hover:scale-105">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-cyan-500/40 transition">
              <span className="text-3xl sm:text-4xl">✨</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">Gaussian Splatting</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">First marketplace for photorealistic "Splats" - clouds of light, not polygons. The future of rendering.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2 sm:px-3 py-1 rounded-full">2026 Tech</span>
              <span className="text-xs bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2 sm:px-3 py-1 rounded-full">Photorealistic</span>
            </div>
          </div>

          {/* Ghost-Compare Mode */}
          <div className="group bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 sm:border-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur hover:border-red-500/60 transition-all hover:scale-105">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-red-500/40 transition">
              <span className="text-3xl sm:text-4xl">👻</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">Ghost-Compare Mode</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">Overlay two models as transparent wireframes. X-ray vision for comparing scale and topology quality.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-red-500/20 border border-red-500/40 text-red-300 px-2 sm:px-3 py-1 rounded-full">X-Ray View</span>
              <span className="text-xs bg-red-500/20 border border-red-500/40 text-red-300 px-2 sm:px-3 py-1 rounded-full">Side-by-Side</span>
            </div>
          </div>

          {/* AI Mesh Optimizer */}
          <div className="group bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 sm:border-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur hover:border-green-500/60 transition-all hover:scale-105">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-green-500/40 transition">
              <span className="text-3xl sm:text-4xl">🤖</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">AI Mesh Optimizer</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">One-click poly reduction by 70% while keeping details. Get high-poly for film, low-poly for games.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-green-500/20 border border-green-500/40 text-green-300 px-2 sm:px-3 py-1 rounded-full">-70% Polys</span>
              <span className="text-xs bg-green-500/20 border border-green-500/40 text-green-300 px-2 sm:px-3 py-1 rounded-full">AI-Powered</span>
            </div>
          </div>

          {/* Neural Thumbnail */}
          <div className="group bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 sm:border-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur hover:border-yellow-500/60 transition-all hover:scale-105">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-yellow-500/40 transition">
              <span className="text-3xl sm:text-4xl">📸</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">Neural Thumbnails</h4>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">AI-generated cinematic lighting for thumbnails. Every model looks professionally rendered.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-2 sm:px-3 py-1 rounded-full">Auto-Render</span>
              <span className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-2 sm:px-3 py-1 rounded-full">Cinematic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bounty Board & Gamification Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h3 className="text-3xl sm:text-5xl font-black text-white mb-3 sm:mb-4">
            <span className="text-orange-500">Earn & Compete</span> Like Never Before
          </h3>
          <p className="text-base sm:text-xl text-gray-400">Gamified marketplace with real rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Bounty Board */}
          <div className="bg-gradient-to-br from-orange-500/10 via-slate-900/50 to-slate-900/50 border-2 border-orange-500/50 rounded-2xl p-6 sm:p-8 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">💼</span>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-white">Bounty Board</h4>
                <p className="text-sm sm:text-base text-gray-400">Freelance integration with escrow</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Buyers post bounties for custom models. Artists claim them, create, and get paid through secure escrow. Constant flow of work and money.
            </p>

            {/* Sample Bounties */}
            <div className="space-y-3">
              {[
                { title: "Cyberpunk Toyota", budget: "$200", deadline: "3 days", claimed: false },
                { title: "Low-Poly Forest Pack", budget: "$150", deadline: "5 days", claimed: true },
                { title: "Sci-Fi Weapon Set", budget: "$300", deadline: "7 days", claimed: false },
              ].map((bounty, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg hover:border-orange-500/50 transition">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm sm:text-base truncate">{bounty.title}</div>
                    <div className="text-xs sm:text-sm text-slate-400">{bounty.deadline} • {bounty.budget}</div>
                  </div>
                  {bounty.claimed ? (
                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg text-xs font-medium ml-2">
                      Claimed
                    </span>
                  ) : (
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-xs sm:text-sm ml-2 flex-shrink-0">
                      Claim
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-6 px-6 py-3 bg-orange-500/20 border-2 border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition font-bold">
              <Link href="/bounties" className="block">
                View All Bounties →
              </Link>
            </button>
          </div>

          {/* Season Pass & Leaderboard */}
          <div className="bg-gradient-to-br from-purple-500/10 via-slate-900/50 to-slate-900/50 border-2 border-purple-500/50 rounded-2xl p-6 sm:p-8 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">🏆</span>
              </div>
              <div>
                <h4 className="text-2xl sm:text-3xl font-black text-white">Season Pass</h4>
                <p className="text-sm sm:text-base text-gray-400">Monthly leaderboard competition</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Top modeller each month gets 0% platform fees (vs 7.5%) and a Golden Vertex badge. Turn selling into a competitive game.
            </p>

            {/* Current Season */}
            <div className="bg-gradient-to-r from-purple-500/20 to-orange-500/20 border border-purple-500/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-300">Season 3 • Ends in 12 days</span>
                <span className="px-3 py-1 bg-purple-500/30 border border-purple-500 text-purple-300 rounded-full text-xs font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="text-3xl font-black text-white mb-2">Golden Vertex Prize</div>
              <div className="text-orange-400 font-bold text-lg">0% Fees for 30 Days</div>
            </div>

            {/* Top 3 */}
            <div className="space-y-2">
              {[
                { rank: 1, name: "PixelForge", sales: 1240, badge: "🥇" },
                { rank: 2, name: "3D_Wizard", sales: 980, badge: "🥈" },
                { rank: 3, name: "MeshMaster", sales: 856, badge: "🥉" },
              ].map((artist) => (
                <div key={artist.rank} className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{artist.badge}</span>
                    <div>
                      <div className="font-semibold text-white text-sm">{artist.name}</div>
                      <div className="text-xs text-slate-400">{artist.sales} sales this month</div>
                    </div>
                  </div>
                  {artist.rank === 1 && (
                    <span className="text-yellow-400 text-xl">👑</span>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-6 px-6 py-3 bg-purple-500/20 border-2 border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition font-bold">
              <Link href="/leaderboard" className="block">
                View Full Leaderboard →
              </Link>
            </button>
          </div>
        </div>
      </section>

      {/* Creator Leaderboard */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 bg-gradient-to-br from-slate-950/50 via-slate-900/50 to-slate-950/50 rounded-3xl border-2 border-orange-500/20 shadow-[0_0_50px_rgba(255,107,53,0.15)]">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-20 rounded-3xl overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <CreatorLeaderboard creators={topCreators} />
        </div>
      </section>

      {/* Trust & Social Proof */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 border-t-2 border-orange-500/30">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 107, 53, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 53, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative z-10 text-center mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4">
            Trusted by <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]">Industry Leaders</span>
          </h3>
        </div>

        <div className="relative z-10 flex justify-center gap-4 sm:gap-8 flex-wrap mb-12 sm:mb-16">
          {trustedBy.map((company) => (
            <div key={company} className="px-4 sm:px-8 py-2 sm:py-4 bg-slate-800/50 border border-orange-500/20 rounded-lg sm:rounded-xl backdrop-blur">
              <span className="text-gray-300 font-semibold text-sm sm:text-lg">{company}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-slate-800/50 border border-orange-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                👨‍💻
              </div>
              <div>
                <div className="font-bold text-white text-sm sm:text-base">Alex Chen</div>
                <div className="text-xs sm:text-sm text-gray-400">Indie Game Developer</div>
              </div>
            </div>
            <p className="text-gray-300 italic text-sm sm:text-base">&quot;The 3D previewer is a game-changer. I can inspect every detail before buying. Saved me hours of work!&quot;</p>
            <div className="flex gap-1 mt-3 sm:mt-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-orange-500 text-sm sm:text-base">⭐</span>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-orange-500/30 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                👩‍🎨
              </div>
              <div>
                <div className="font-bold text-white text-sm sm:text-base">Sarah Martinez</div>
                <div className="text-xs sm:text-sm text-gray-400">3D Artist</div>
              </div>
            </div>
            <p className="text-gray-300 italic text-sm sm:text-base">&quot;Best marketplace for selling my work. The quality checks give buyers confidence and I get better reviews.&quot;</p>
            <div className="flex gap-1 mt-3 sm:mt-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-orange-500 text-sm sm:text-base">⭐</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
