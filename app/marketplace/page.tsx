"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useModels } from "@/lib/api/hooks/useModels";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { Model as ApiModel } from "@/lib/api/types";
import ModelViewer3D from "@/components/ModelViewer3D";

interface Model {
  id: string;
  name: string;
  price: number;
  polyCount: number;
  category: string;
  subcategory: string;
  trending: boolean;
  downloads: number;
  likes: number;
  rating: number;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    level: string;
  };
  tags: string[];
  formats: string[];
  isRigged: boolean;
  isAnimated: boolean;
  textureResolution: string;
  uploadDate: string;
  thumbnailUrl: string;
  fileUrl: string;
}

// Helper to map API model to display format with robust error handling
const mapApiModel = (apiModel: ApiModel): Model | null => {
  try {
    // Safely extract creator info with fallbacks - NEVER show UUID
    // Backend returns creator_username at root level, not nested
    const creatorName = (apiModel as any).creator_username || 
                        apiModel.creator?.username || 
                        apiModel.creator?.full_name || 
                        'Unknown Creator';
    const creatorAvatar = apiModel.creator?.avatar_url || "🎨";
    const creatorVerified = apiModel.creator?.is_verified_creator || false;

    return {
      id: apiModel.id, // Already a UUID string
      name: apiModel.title || "Untitled Model",
      price: apiModel.price || 0,
      polyCount: apiModel.poly_count || 0,
      category: apiModel.category || "Uncategorized",
      subcategory: "Sci-Fi",
      trending: apiModel.is_featured || false,
      downloads: apiModel.downloads || 0,
      likes: apiModel.likes || 0,
      rating: apiModel.rating || 0,
      author: {
        name: creatorName,
        avatar: creatorAvatar,
        verified: creatorVerified,
        level: "Gold",
      },
      tags: apiModel.tags || [],
      formats: apiModel.file_formats || [],
      isRigged: apiModel.has_rigging || false,
      isAnimated: apiModel.has_animations || false,
      textureResolution: apiModel.texture_resolution || "4K",
      uploadDate: apiModel.created_at || new Date().toISOString(),
      thumbnailUrl: apiModel.thumbnail_url || "",
      fileUrl: apiModel.file_url || "",
    };
  } catch (error) {
    console.error('Error mapping model:', apiModel.id, error);
    return null;
  }
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCorner, setActiveCorner] = useState<string | null>(null);
  const [liveSales, setLiveSales] = useState<any[]>([]);
  const [forgeModel, setForgeModel] = useState<Model | null>(null);
  const [viewMode, setViewMode] = useState<"void" | "grid">("void");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'price_low' | 'price_high'>('popular');

  // Fetch models from API
  const { models: apiModels, loading, error, total, pages } = useModels({
    page,
    limit: 50,
    category: category === "all" ? undefined : category,
    sort: sortBy,
    search: searchQuery || undefined,
  });

  // Map API models to display format with error handling
  const allModels = apiModels
    .map(mapApiModel)
    .filter((model): model is Model => model !== null);

  // Debug logging
  useEffect(() => {
    console.log('Marketplace Debug:', {
      apiModelsCount: apiModels.length,
      mappedModelsCount: allModels.length,
      loading,
      error,
      sampleModel: apiModels[0]
    });
  }, [apiModels, allModels, loading, error]);
  
  // Track mouse for HUD glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Detect corner proximity
      const threshold = 150;
      if (e.clientX < threshold && e.clientY < threshold) setActiveCorner("top-left");
      else if (e.clientX > window.innerWidth - threshold && e.clientY < threshold) setActiveCorner("top-right");
      else if (e.clientX < threshold && e.clientY > window.innerHeight - threshold) setActiveCorner("bottom-left");
      else if (e.clientX > window.innerWidth - threshold && e.clientY > window.innerHeight - threshold) setActiveCorner("bottom-right");
      else setActiveCorner(null);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  // Simulate live sales ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const newSale = {
        artist: ["PixelForge", "3D_Wizard", "MeshMaster", "PolyPro", "VoxelVerse"][Math.floor(Math.random() * 5)],
        action: ["just hit 1,000 downloads", "sold a model for $150", "earned Gold Badge", "uploaded new asset"][Math.floor(Math.random() * 4)],
        time: "Just now",
      };
      setLiveSales(prev => [newSale, ...prev].slice(0, 5));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const tags3D = [
    { name: "#Character", color: "from-orange-500 to-red-500", x: 20, y: 30, z: 0 },
    { name: "#Architecture", color: "from-cyan-500 to-blue-500", x: 70, y: 20, z: 20 },
    { name: "#Vehicle", color: "from-purple-500 to-pink-500", x: 50, y: 60, z: -10 },
    { name: "#GameReady", color: "from-green-500 to-emerald-500", x: 30, y: 70, z: 15 },
    { name: "#Animated", color: "from-yellow-500 to-orange-500", x: 80, y: 50, z: -5 },
    { name: "#PBR", color: "from-indigo-500 to-purple-500", x: 40, y: 40, z: 10 },
  ];

  const filteredModels = allModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || model.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* 3D Spatial Grid Background */}
      <div className="fixed inset-0 z-0">
        {/* Perspective container */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black">
          {/* Animated 3D Grid Lines - Horizontal */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_calc(100%_-_1px),rgba(255,140,66,0.3)_calc(100%_-_1px))] bg-[length:100%_60px] animate-grid-move-vertical" />
          </div>
          
          {/* Animated 3D Grid Lines - Vertical with perspective */}
          <div className="absolute inset-0 opacity-20" style={{ transform: 'perspective(1000px) rotateX(60deg)', transformOrigin: 'center center' }}>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,transparent_calc(100%_-_1px),rgba(255,107,53,0.4)_calc(100%_-_1px))] bg-[length:80px_100%] animate-grid-move-horizontal" />
          </div>
          
          {/* Glowing center spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl animate-pulse-slow" />
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-orange-400/40 rounded-full animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${8 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <ErrorMessage error={error} />
        </div>
      )}
      
      {/* Professional Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
                <span className="text-white font-bold text-sm sm:text-base">SD</span>
              </div>
              <span className="text-white font-black text-lg sm:text-xl hidden sm:inline">SDModels</span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-slate-300 hover:text-white transition text-sm font-medium">
                Home
              </Link>
              <Link href="/marketplace" className="text-orange-400 font-semibold text-sm">
                Marketplace
              </Link>
              <Link href="/bounties" className="text-slate-300 hover:text-white transition text-sm font-medium">
                Bounties
              </Link>
              <Link href="/community" className="text-slate-300 hover:text-white transition text-sm font-medium">
                Community
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/upload" className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-400 hover:to-pink-500 transition font-semibold text-xs sm:text-sm shadow-lg whitespace-nowrap">
                <span className="hidden sm:inline">Upload Model</span>
                <span className="sm:hidden">Upload</span>
              </Link>
              <Link href="/dashboard" className="px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition font-semibold text-xs sm:text-sm whitespace-nowrap">
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">📊</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      
      {/* Search & Filter Section */}
      <div className="relative z-40 pt-8 sm:pt-12 pb-6 sm:pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-6 sm:mb-8 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent"
          >
            3D Model Marketplace
          </motion.h1>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, creators, categories..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-900/90 backdrop-blur-xl border-2 border-orange-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 text-sm sm:text-base pr-12"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
            {[
              { name: "All", tag: null },
              { name: "Characters", tag: "#Character" },
              { name: "Vehicles", tag: "#Vehicle" },
              { name: "Architecture", tag: "#Architecture" },
              { name: "Game Ready", tag: "#GameReady" },
              { name: "Animated", tag: "#Animated" },
            ].map((filter) => (
              <button
                key={filter.name}
                onClick={() => setSelectedTag(filter.tag)}
                className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all ${
                  selectedTag === filter.tag
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. THE INFINITE VOID GALLERY - Redesigned with Better Layout */}
      <div className="relative z-30 px-4 pb-12">
        <div className="max-w-[1800px] mx-auto">
          {/* View Mode Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setViewMode("void")}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                viewMode === "void"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "bg-slate-800/50 text-gray-400 hover:text-white"
              }`}
            >
              🌌 Void View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "bg-slate-800/50 text-gray-400 hover:text-white"
              }`}
            >
              ▦ Grid View
            </button>
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <span className="text-gray-400 text-sm md:text-base">
              <span className="text-orange-400 font-bold text-xl md:text-2xl">{filteredModels.length}</span> models in the vault
            </span>
          </div>

          {/* Empty State */}
          {!loading && filteredModels.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Models Found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedTag 
                  ? "Try adjusting your search or filters" 
                  : "No models have been uploaded yet"}
              </p>
              {(searchQuery || selectedTag) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          <AnimatePresence mode="wait">
            {viewMode === "void" ? (
              /* VOID VIEW - Staggered Depth Cards */
              <motion.div
                key="void"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredModels.slice(0, 20).map((model, index) => {
                  const depth = (index % 3) - 1; // -1, 0, 1
                  const scale = 1 - Math.abs(depth) * 0.1;
                  
                  return (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 100, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: scale,
                      }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{ 
                        scale: scale * 1.05,
                        y: -10,
                        transition: { duration: 0.2 }
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                        transform: `translateZ(${depth * 50}px)`,
                      }}
                      className="group cursor-pointer"
                      onClick={() => setForgeModel(model)}
                    >
                      <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-orange-500/30 rounded-2xl overflow-hidden hover:border-orange-500 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_80px_rgba(255,107,53,0.6)]">
                        {/* Holographic Preview */}
                        <div className="relative h-56 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
                          {/* Animated Grid Background */}
                          <motion.div 
                            className="absolute inset-0 bg-[linear-gradient(rgba(255,107,53,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(255,107,53,0.1)_2px,transparent_2px)] bg-[size:30px_30px]"
                            animate={{ 
                              backgroundPosition: ["0px 0px", "30px 30px"],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          />
                          
                          {/* Spotlight Effect */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/20 blur-3xl" />
                          
                          {/* Model Thumbnail or Fallback Icon */}
                          {model.thumbnailUrl ? (
                            <img 
                              src={model.thumbnailUrl} 
                              alt={model.name}
                              className="w-full h-full object-cover relative z-10"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <motion.div 
                            className="text-7xl relative z-10"
                            style={{ display: model.thumbnailUrl ? 'none' : 'block' }}
                            animate={{ 
                              rotateY: [0, 360],
                              y: [0, -10, 0],
                            }}
                            transition={{ 
                              rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                            }}
                          >
                            {["🤖", "🚗", "🏰", "⚔️", "🐉", "🎮"][index % 6]}
                          </motion.div>
                          
                          {/* Trending Badge */}
                          {model.trending && (
                            <motion.div 
                              className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold shadow-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              🔥 TRENDING
                            </motion.div>
                          )}
                          
                          {/* Rigged Badge */}
                          {model.isRigged && (
                            <div className="absolute top-3 left-3 px-3 py-1.5 bg-cyan-500/90 text-white rounded-full text-xs font-bold shadow-lg">
                              ⚡ RIGGED
                            </div>
                          )}
                        </div>

                        {/* Model Info */}
                        <div className="p-5">
                          {/* Title */}
                          <h3 className="text-white font-bold mb-3 text-lg group-hover:text-orange-400 transition line-clamp-1">
                            {model.name}
                          </h3>

                          {/* Author Info - PROMINENT */}
                          <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                              {model.author.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold text-sm truncate">{model.author.name}</span>
                                {model.author.verified && (
                                  <span className="text-green-400 text-sm flex-shrink-0">✓</span>
                                )}
                              </div>
                              <span className="text-gray-400 text-xs">{model.author.level} Creator</span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                              <div className="text-xs text-gray-400">Downloads</div>
                              <div className="text-sm font-bold text-cyan-400">{model.downloads}</div>
                            </div>
                            <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                              <div className="text-xs text-gray-400">Likes</div>
                              <div className="text-sm font-bold text-pink-400">{model.likes}</div>
                            </div>
                            <div className="text-center p-2 bg-slate-800/30 rounded-lg">
                              <div className="text-xs text-gray-400">Rating</div>
                              <div className="text-sm font-bold text-yellow-400">⭐ {model.rating.toFixed(1)}</div>
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Price</div>
                              <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                ${model.price}
                              </span>
                            </div>
                            <Link href={`/model/${model.id}`}>
                              <button className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold text-sm shadow-lg hover:shadow-orange-500/50">
                                VIEW →
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* GRID VIEW - Clean Traditional Layout */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="group bg-slate-900/50 border border-orange-500/30 rounded-xl overflow-hidden backdrop-blur hover:border-orange-500 transition-all hover:scale-[1.02]"
                    onClick={() => setForgeModel(model)}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center overflow-hidden cursor-pointer">
                      {model.thumbnailUrl ? (
                        <img 
                          src={model.thumbnailUrl} 
                          alt={model.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div 
                        className="text-6xl group-hover:scale-110 transition-transform"
                        style={{ display: model.thumbnailUrl ? 'none' : 'block' }}
                      >
                        {["🤖", "🚗", "🏰", "⚔️", "🐉", "🎮"][index % 6]}
                      </div>
                      
                      {model.trending && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">
                          🔥 HOT
                        </div>
                      )}
                      {model.isRigged && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-cyan-500/80 text-white rounded-full text-xs font-bold">
                          ⚡ Rigged
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-bold mb-3 group-hover:text-orange-400 transition line-clamp-1">
                        {model.name}
                      </h3>

                      {/* Author Info */}
                      <div className="flex items-center gap-2 mb-3 p-2 bg-slate-800/30 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {model.author.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-white text-xs font-semibold truncate">{model.author.name}</span>
                            {model.author.verified && <span className="text-green-400 text-xs">✓</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>📥 {model.downloads}</span>
                        <span>❤️ {model.likes}</span>
                        <span>⭐ {model.rating.toFixed(1)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-orange-400">
                          ${model.price}
                        </span>
                        <Link href={`/model/${model.id}`}>
                          <button className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition text-sm font-semibold">
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


      {/* 4. THE FORGE - Real-Time Customization Pedestal */}
      <AnimatePresence>
        {forgeModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4"
            onClick={() => setForgeModel(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 100 }}
              className="bg-slate-900 border-2 border-orange-500 rounded-2xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-orange-400">THE FORGE</h2>
                <button
                  onClick={() => setForgeModel(null)}
                  className="text-3xl text-gray-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: 3D Pedestal */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-slate-950 to-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden border border-orange-500/30">
                    {/* Pedestal Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,107,53,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,53,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
                    
                    {/* Real 3D Model or Fallback */}
                    {forgeModel.fileUrl ? (
                      <div className="w-full h-full relative z-10">
                        <ModelViewer3D 
                          modelUrl={forgeModel.fileUrl}
                          fileFormat={forgeModel.formats[0]?.toLowerCase()}
                          autoRotate={true}
                        />
                      </div>
                    ) : (
                      <motion.div
                        className="text-8xl md:text-9xl relative z-10"
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        {["🤖", "🚗", "🏰", "⚔️", "🐉", "🎮"][forgeModel.id.length % 6]}
                      </motion.div>
                    )}

                    {/* Spotlight Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/20 blur-3xl" />
                  </div>

                  {/* Lighting Controls */}
                  <div className="mt-4 space-y-2">
                    <button type="button" className="w-full px-4 py-3 bg-purple-600/20 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-600/30 transition font-semibold text-sm">
                      🌆 Cyberpunk Lighting
                    </button>
                    <button type="button" className="w-full px-4 py-3 bg-yellow-600/20 border border-yellow-500 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition font-semibold text-sm">
                      ☀️ Daylight Mode
                    </button>
                    <button type="button" className="w-full px-4 py-3 bg-red-600/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-600/30 transition font-semibold text-sm">
                      🔴 Mars Red
                    </button>
                  </div>
                </div>

                {/* Right: Model Info & Actions */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{forgeModel.name}</h3>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      {forgeModel.author.avatar}
                    </div>
                    <span className="text-gray-400">{forgeModel.author.name}</span>
                    {forgeModel.author.verified && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Polygon Count</div>
                      <div className="text-cyan-400 font-bold">{forgeModel.polyCount.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Texture Res</div>
                      <div className="text-purple-400 font-bold">{forgeModel.textureResolution}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Downloads</div>
                      <div className="text-green-400 font-bold">{forgeModel.downloads}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Rating</div>
                      <div className="text-yellow-400 font-bold">⭐ {forgeModel.rating.toFixed(1)}</div>
                    </div>
                  </div>

                  {/* Formats */}
                  <div className="mb-6">
                    <div className="text-gray-400 text-sm mb-2">Available Formats:</div>
                    <div className="flex gap-2">
                      {forgeModel.formats.map((format) => (
                        <span key={format} className="px-3 py-1 bg-slate-800 text-gray-300 rounded-lg text-sm font-mono">
                          .{format}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Animation Clips (if animated) */}
                  {forgeModel.isAnimated && (
                    <div className="mb-6">
                      <div className="text-gray-400 text-sm mb-2">Animation Clips:</div>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-2 bg-cyan-600/20 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition text-sm">
                          ▶️ Run Cycle
                        </button>
                        <button className="w-full px-4 py-2 bg-cyan-600/20 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition text-sm">
                          ▶️ Attack Animation
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Price & Purchase */}
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400">Model Price:</span>
                      <span className="text-2xl font-black text-orange-400">${forgeModel.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Platform Fee (7.5%):</span>
                      <span className="text-gray-400">${(forgeModel.price * 0.075).toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href={`/model/${forgeModel.id}`}>
                    <button className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold text-lg shadow-lg">
                      🔥 VIEW FULL DETAILS
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MARKET PULSE - Live Analytics Ticker */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-orange-500/30 py-3 overflow-hidden">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...liveSales, ...liveSales, ...liveSales].map((sale, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-white font-semibold">{sale.artist}</span>
              <span className="text-gray-400">{sale.action}</span>
              <span className="text-orange-400">•</span>
            </div>
          ))}
          
          {/* Static Stats */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-cyan-400">📊</span>
            <span className="text-white font-semibold">Total Sales Today:</span>
            <span className="text-cyan-400 font-bold">$12,450</span>
            <span className="text-orange-400">•</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <span className="text-purple-400">🔥</span>
            <span className="text-white font-semibold">Trending Category:</span>
            <span className="text-purple-400 font-bold">Sci-Fi Characters</span>
            <span className="text-orange-400">•</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <span className="text-green-400">🔒</span>
            <span className="text-white font-semibold">Secure Transaction Vault</span>
            <motion.span 
              className="text-green-400 font-bold"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ACTIVE
            </motion.span>
            <span className="text-orange-400">•</span>
          </div>
        </motion.div>
      </div>

      {/* 6. FEATURED COLLECTIONS - Curated Showcases */}
      <div className="relative z-30 px-4 py-16 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-slate-950/80">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            FEATURED COLLECTIONS
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Cyberpunk Arsenal", icon: "⚡", color: "from-cyan-500 to-blue-500", count: 24, category: "Weapons" },
              { name: "Fantasy Realms", icon: "🏰", color: "from-purple-500 to-pink-500", count: 18, category: "Environments" },
              { name: "Sci-Fi Vehicles", icon: "🚀", color: "from-orange-500 to-red-500", count: 32, category: "Vehicles" },
            ].map((collection, i) => (
              <motion.button
                key={collection.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onClick={() => {
                  setSelectedTag(null);
                  setSearchQuery("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group relative bg-slate-900/70 backdrop-blur-xl border-2 border-orange-500/30 rounded-2xl p-8 hover:border-orange-500 transition-all cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.03, y: -5 }}
              >
                {/* Background Glow */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${collection.color} opacity-0 group-hover:opacity-20 transition-opacity`}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-6xl mb-6"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    {collection.icon}
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-3">{collection.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{collection.count} premium models</p>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${collection.color} text-white rounded-xl font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                    <span>Explore Collection</span>
                    <span>→</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 7. TOP CREATORS - Verified Artists Spotlight */}
      <div className="relative z-30 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent"
          >
            VERIFIED CREATORS
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {["PixelForge", "3D_Wizard", "MeshMaster", "PolyPro", "VoxelVerse"].map((creator, i) => (
              <motion.button
                key={creator}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  setSearchQuery(creator);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-900/70 backdrop-blur-xl border-2 border-green-500/30 rounded-2xl p-6 hover:border-green-500 transition-all cursor-pointer"
              >
                <motion.div 
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-3xl shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {["🎨", "🧙", "⚡", "💎", "🌟"][i]}
                </motion.div>
                <h3 className="text-white font-bold mb-2 text-sm md:text-base">{creator}</h3>
                <div className="flex items-center justify-center gap-1 text-xs text-green-400 mb-2">
                  <span>✓</span>
                  <span>Verified</span>
                </div>
                <div className="text-gray-400 text-xs">{(i + 2) * 10} models</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 8. QUALITY GUARANTEE - Trust Badges */}
      <div className="relative z-30 px-4 py-12 bg-gradient-to-b from-transparent via-slate-950/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900/70 backdrop-blur-xl border border-orange-500/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-8 text-white">
              THE NEXUS GUARANTEE
            </h2>
            
            <div className="grid md:grid-cols-4 gap-4 md:gap-6">
              {[
                { icon: "✓", title: "Quality Certified", desc: "Every model verified" },
                { icon: "🔒", title: "Secure Escrow", desc: "7.5% transparent fee" },
                { icon: "⚡", title: "Instant Download", desc: "Multiple formats" },
                { icon: "💬", title: "24/7 Support", desc: "Creator assistance" },
              ].map((badge, i) => (
                <motion.div
                  key={badge.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl">
                    {badge.icon}
                  </div>
                  <h3 className="text-white font-bold mb-1 text-sm md:text-base">{badge.title}</h3>
                  <p className="text-gray-400 text-xs">{badge.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating 3D Category Marketplace */}
      <div className="relative z-30 px-4 py-16 sm:py-24 pb-32 sm:pb-40">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent"
          >
            Explore 3D Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-slate-400 mb-12 sm:mb-16 text-sm sm:text-base"
          >
            Browse our curated marketplace of premium 3D models
          </motion.p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 perspective-1000">
            {[
              { name: "Characters", icon: "🤖", color: "from-orange-500/20 to-red-500/20", borderColor: "orange-500", tag: "#Character", delay: 0 },
              { name: "Vehicles", icon: "🚗", color: "from-cyan-500/20 to-blue-500/20", borderColor: "cyan-500", tag: "#Vehicle", delay: 0.1 },
              { name: "Environments", icon: "🏰", color: "from-purple-500/20 to-pink-500/20", borderColor: "purple-500", tag: "#Architecture", delay: 0.2 },
              { name: "Props", icon: "📦", color: "from-green-500/20 to-emerald-500/20", borderColor: "green-500", tag: "#GameReady", delay: 0.3 },
              { name: "Weapons", icon: "⚔️", color: "from-red-500/20 to-rose-500/20", borderColor: "red-500", tag: "#GameReady", delay: 0.4 },
              { name: "UI Elements", icon: "🎮", color: "from-blue-500/20 to-indigo-500/20", borderColor: "blue-500", tag: "#PBR", delay: 0.5 },
            ].map((cat, index) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  rotateX: 0,
                }}
                transition={{
                  delay: cat.delay,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  rotateY: 5,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                onClick={() => {
                  setSelectedTag(cat.tag);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="group relative cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Floating card with 3D effect */}
                <div className={`relative bg-gradient-to-br ${cat.color} backdrop-blur-xl border-2 border-${cat.borderColor}/30 group-hover:border-${cat.borderColor} rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-2xl group-hover:shadow-${cat.borderColor}/50`}>
                  {/* Animated glow effect */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${cat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Floating icon with gentle rotation */}
                  <motion.div 
                    className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4 relative z-10"
                    animate={{ 
                      y: [0, -8, 0],
                      rotateY: [0, 10, 0, -10, 0],
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    {cat.icon}
                  </motion.div>
                  
                  {/* Category name */}
                  <div className="text-white font-bold text-sm sm:text-base lg:text-lg relative z-10">
                    {cat.name}
                  </div>
                  
                  {/* Subtle shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
