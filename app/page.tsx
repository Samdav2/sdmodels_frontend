"use client";

import Link from "next/link";
import ModelCard from "@/components/ModelCard";
import HeroBackground from "@/components/HeroBackground";
import LiveStatsTicker from "@/components/LiveStatsTicker";
import FilterSidebar from "@/components/FilterSidebar";
import CreatorLeaderboard from "@/components/CreatorLeaderboard";
import HoloCarousel from "@/components/HoloCarousel";
import CredibilityNav from "@/components/CredibilityNav";
import { useState } from "react";

// Mock data - will be replaced with API calls
const mockModels = [
  {
    id: "1",
    name: "Cyberpunk Vehicle",
    price: 29.99,
    polyCount: 5420,
    thumbnail: "/api/placeholder/300/300",
    formats: ["glb", "fbx", "obj"],
    isRigged: true,
    isNew: true,
    category: "Vehicles",
  },
  {
    id: "2",
    name: "Sci-Fi Character Rig",
    price: 49.99,
    polyCount: 12500,
    thumbnail: "/api/placeholder/300/300",
    formats: ["glb", "fbx"],
    isRigged: true,
    isHot: true,
    category: "Characters",
  },
  {
    id: "3",
    name: "Futuristic Weapon",
    price: 19.99,
    polyCount: 8200,
    thumbnail: "/api/placeholder/300/300",
    formats: ["glb", "obj"],
    isRigged: false,
    category: "Weapons",
  },
  {
    id: "4",
    name: "Neon City Props",
    price: 39.99,
    polyCount: 15000,
    thumbnail: "/api/placeholder/300/300",
    formats: ["glb", "fbx", "obj"],
    isRigged: false,
    isNew: true,
    category: "Environments",
  },
  {
    id: "5",
    name: "Stylized Character",
    price: 34.99,
    polyCount: 9800,
    thumbnail: "/api/placeholder/300/300",
    formats: ["glb", "fbx"],
    isRigged: true,
    category: "Characters",
  },
  {
    id: "6",
    name: "Low Poly Tree Pack",
    price: 14.99,
    polyCount: 2400,
    thumbnail: "/api/placeholder/300/300",
    formats: ["glb", "obj"],
    isRigged: false,
    category: "Environments",
  },
  {
    id: "7",
    name: "Mech Warrior",
    price: 59.99,
    polyCount: 18500,
    thumbnail: "/api/placeholder/300/300",
    formats: ["glb", "fbx"],
    isRigged: true,
    isHot: true,
    category: "Characters",
  },
  {
    id: "8",
    name: "Sci-Fi Props Bundle",
    price: 44.99,
    polyCount: 11200,
    thumbnail: "/api/placeholder/300/300",
    formats: ["glb", "fbx", "obj"],
    isRigged: false,
    category: "Props",
  },
];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Live Stats Ticker */}
      <LiveStatsTicker />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg sm:text-xl">3D</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              NEXUS MODELS
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
            <Link href="/browse" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Browse
            </Link>
            <Link href="/upload" className="px-3 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50">
              <span className="hidden sm:inline">Start Selling</span>
              <span className="sm:hidden">Sell</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Background */}
      <section className="relative min-h-[70vh] sm:h-[90vh] overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center py-12 sm:py-0">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="inline-block">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-400 text-xs sm:text-sm font-bold backdrop-blur-sm">
                ⚡ NEXT-GEN 3D MARKETPLACE
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-tight drop-shadow-2xl px-4">
              The Next Dimension
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
                of Digital Assets
              </span>
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium drop-shadow-lg px-4">
              Buy, Sell, and Preview 3D Models in Real-Time.
              <br className="hidden sm:block" />
              <span className="sm:inline block mt-1 sm:mt-0">Built for creators who demand excellence.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4">
              <button className="group px-6 sm:px-10 py-3 sm:py-5 bg-orange-500/20 backdrop-blur-md border-2 border-orange-500/50 text-white rounded-xl hover:bg-orange-500 transition-all font-bold text-base sm:text-lg shadow-2xl shadow-orange-500/50 hover:scale-105">
                <span className="flex items-center justify-center gap-2">
                  🎮 Explore Marketplace
                </span>
              </button>
              <button className="px-6 sm:px-10 py-3 sm:py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-xl hover:bg-white/20 transition-all font-bold text-base sm:text-lg hover:scale-105">
                Start Selling →
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-8 sm:mt-16 max-w-4xl mx-auto px-4">
            <div className="text-center bg-slate-900/50 backdrop-blur-md border border-orange-500/30 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <div className="text-2xl sm:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">10K+</div>
              <div className="text-gray-300 mt-1 sm:mt-2 font-semibold text-xs sm:text-base">Premium Assets</div>
            </div>
            <div className="text-center bg-slate-900/50 backdrop-blur-md border border-orange-500/30 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <div className="text-2xl sm:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">5K+</div>
              <div className="text-gray-300 mt-1 sm:mt-2 font-semibold text-xs sm:text-base">Active Creators</div>
            </div>
            <div className="text-center bg-slate-900/50 backdrop-blur-md border border-orange-500/30 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <div className="text-2xl sm:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">99%</div>
              <div className="text-gray-300 mt-1 sm:mt-2 font-semibold text-xs sm:text-base">Quality Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Holo-Carousel Section */}
      <section className="relative z-10 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
          <div className="text-center">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-400 text-xs sm:text-sm font-bold backdrop-blur-sm">
                ⚡ LIVE 3D PREVIEW
              </span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-white mb-3 sm:mb-4 px-4">
              Experience the <span className="text-orange-500">Holo-Carousel</span>
            </h3>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Interact with live 3D models in real-time. Rotate, zoom, and inspect every detail before you buy.
            </p>
          </div>
        </div>

        <HoloCarousel models={featuredModels} autoSlideInterval={7000} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔄</div>
              <h4 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">360° Rotation</h4>
              <p className="text-gray-400 text-xs sm:text-sm">Click and drag to inspect from every angle</p>
            </div>
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔍</div>
              <h4 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">Wireframe Mode</h4>
              <p className="text-gray-400 text-xs sm:text-sm">View topology and mesh quality instantly</p>
            </div>
            <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 sm:p-6 backdrop-blur">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📊</div>
              <h4 className="text-white font-bold mb-1 sm:mb-2 text-sm sm:text-base">Live Data</h4>
              <p className="text-gray-400 text-xs sm:text-sm">Real-time poly count and mesh health</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models with Sidebar */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h3 className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2">
              🔥 Featured <span className="text-orange-500">Assets</span>
            </h3>
            <p className="text-gray-400 text-sm sm:text-lg">Handpicked by our community</p>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold backdrop-blur"
            >
              {showFilters ? "Hide" : "Show"} Filters
            </button>
            <Link href="/browse" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition font-semibold whitespace-nowrap">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {mockModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
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
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <CreatorLeaderboard creators={topCreators} />
      </section>

      {/* Trust & Social Proof */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4">
            Trusted by <span className="text-orange-500">Industry Leaders</span>
          </h3>
        </div>

        <div className="flex justify-center gap-4 sm:gap-8 flex-wrap mb-12 sm:mb-16">
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
      <footer className="relative z-10 border-t border-orange-500/20 bg-slate-900/80 backdrop-blur-xl mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
                  <span className="text-white font-bold text-lg sm:text-xl">3D</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  NEXUS MODELS
                </h1>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">The next dimension of digital assets.</p>
              
              {/* Newsletter */}
              <div className="space-y-2 sm:space-y-3">
                <h4 className="text-white font-bold text-sm sm:text-base">Weekly Free Assets</h4>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-slate-800 border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                />
                <button className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold">
                  Subscribe
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">About</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><Link href="/about" className="hover:text-orange-400 transition">About Us</Link></li>
                <li><Link href="/mastery" className="hover:text-orange-400 transition">Our Team</Link></li>
                <li><Link href="/roadmap" className="hover:text-orange-400 transition">Roadmap</Link></li>
                <li><Link href="/testimonials" className="hover:text-orange-400 transition">Testimonials</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Creators</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><Link href="/upload" className="hover:text-orange-400 transition">Start Selling</Link></li>
                <li><Link href="/process" className="hover:text-orange-400 transition">Process Vault</Link></li>
                <li><Link href="/mastery" className="hover:text-orange-400 transition">Hall of Mastery</Link></li>
                <li><Link href="/learn" className="hover:text-orange-400 transition">Learning Nexus</Link></li>
                <li><Link href="/roadmap" className="hover:text-orange-400 transition">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Community</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li><Link href="/bounties" className="hover:text-orange-400 transition">Bounty Board</Link></li>
                <li><Link href="/leaderboard" className="hover:text-orange-400 transition">Leaderboard</Link></li>
                <li><Link href="/testimonials" className="hover:text-orange-400 transition">Testimonials</Link></li>
                <li><Link href="/learn" className="hover:text-orange-400 transition">Tutorials</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-orange-500/20 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">© 2024 Nexus Models. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6 text-gray-400 text-sm sm:text-base">
              <Link href="/privacy" className="hover:text-orange-400 transition">Privacy</Link>
              <Link href="/terms" className="hover:text-orange-400 transition">Terms</Link>
              <Link href="/cookies" className="hover:text-orange-400 transition">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
