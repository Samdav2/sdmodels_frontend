"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  icon: string;
  tags: string[];
  views: number;
  likes: number;
}

export default function LearningNexusPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const tutorials: Tutorial[] = [
    {
      id: "1",
      title: "Fix Non-Manifold Geometry in 5 Minutes",
      description: "Quick guide to identifying and fixing non-manifold edges that break your mesh. Essential for 3D printing and game engines.",
      category: "Technical",
      difficulty: "Beginner",
      duration: "5 min",
      icon: "🔧",
      tags: ["Blender", "Topology", "Quick Fix"],
      views: 2450,
      likes: 189,
    },
    {
      id: "2",
      title: "Perfect Edge Flow for Character Animation",
      description: "Master the art of edge loops for natural deformation. Learn where to place loops for elbows, knees, and facial expressions.",
      category: "Modeling",
      difficulty: "Intermediate",
      duration: "15 min",
      icon: "🦴",
      tags: ["Character", "Topology", "Animation"],
      views: 3200,
      likes: 245,
    },
    {
      id: "3",
      title: "PBR Texturing Workflow from Scratch",
      description: "Complete guide to Physically Based Rendering materials. From baking maps to final export for game engines.",
      category: "Materials",
      difficulty: "Intermediate",
      duration: "25 min",
      icon: "🎨",
      tags: ["Substance", "PBR", "Texturing"],
      views: 4100,
      likes: 312,
    },
    {
      id: "4",
      title: "Optimize Models for Mobile Games",
      description: "Reduce poly count by 70% without losing detail. LOD creation, normal map baking, and texture atlasing.",
      category: "Optimization",
      difficulty: "Advanced",
      duration: "20 min",
      icon: "⚡",
      tags: ["Mobile", "Optimization", "LOD"],
      views: 1890,
      likes: 156,
    },
    {
      id: "5",
      title: "Python Automation for Batch Processing",
      description: "Write scripts to process hundreds of models automatically. Rename, export, and optimize with one click.",
      category: "Scripting",
      difficulty: "Advanced",
      duration: "30 min",
      icon: "🐍",
      tags: ["Python", "Automation", "Blender"],
      views: 1560,
      likes: 134,
    },
    {
      id: "6",
      title: "UV Unwrapping Without Distortion",
      description: "Master UV mapping techniques for clean, efficient texture layouts. Minimize stretching and maximize texture space.",
      category: "Technical",
      difficulty: "Intermediate",
      duration: "18 min",
      icon: "📐",
      tags: ["UV", "Texturing", "Technical"],
      views: 2780,
      likes: 201,
    },
    {
      id: "7",
      title: "Hard Surface Modeling with Booleans",
      description: "Create complex mechanical parts using boolean operations. Clean topology and proper edge flow for subdivision.",
      category: "Modeling",
      difficulty: "Intermediate",
      duration: "22 min",
      icon: "🔩",
      tags: ["Hard Surface", "Booleans", "Mechanical"],
      views: 3450,
      likes: 278,
    },
    {
      id: "8",
      title: "Educational 3D Models: Best Practices",
      description: "Design models that teach effectively. Color coding, exploded views, and interactive elements for learning.",
      category: "Education",
      difficulty: "Beginner",
      duration: "12 min",
      icon: "📚",
      tags: ["EdTech", "Teaching", "Design"],
      views: 1240,
      likes: 98,
    },
  ];

  const categories = ["All", "Modeling", "Technical", "Materials", "Optimization", "Scripting", "Education"];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === "All" || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 bg-green-500/20 border-green-500/40";
      case "Intermediate": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/40";
      case "Advanced": return "text-red-400 bg-red-500/20 border-red-500/40";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/40";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg sm:text-xl">3D</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              SDMODELS
            </h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-sm font-bold backdrop-blur-sm">
              📚 LEARNING NEXUS
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">
            Digital <span className="text-orange-500">Archive</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            The person who teaches is the master. Learn from battle-tested techniques and proven workflows.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-3xl font-black text-orange-400 mb-1">{tutorials.length}</div>
            <div className="text-sm text-gray-300">Tutorials Available</div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-3xl font-black text-cyan-400 mb-1">
              {(tutorials.reduce((sum, t) => sum + t.views, 0) / 1000).toFixed(1)}k
            </div>
            <div className="text-sm text-gray-300">Total Views</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-3xl font-black text-purple-400 mb-1">
              {tutorials.reduce((sum, t) => sum + t.likes, 0)}
            </div>
            <div className="text-sm text-gray-300">Community Likes</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tutorials, tags, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-slate-900/50 border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 backdrop-blur"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredTutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-slate-900/50 border border-orange-500/30 rounded-xl overflow-hidden backdrop-blur hover:border-orange-500 transition-all cursor-pointer"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border-b border-orange-500/30 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-5xl">{tutorial.icon}</div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-orange-400 transition">
                  {tutorial.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    ⏱️ {tutorial.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    👁️ {tutorial.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    ❤️ {tutorial.likes}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {tutorial.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorial.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-800 border border-slate-700 text-gray-400 rounded-full text-xs hover:border-orange-500/50 transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <button className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/30">
                  Start Learning →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Learning Matters */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-orange-500/10 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 text-center">
            Why Teaching Establishes Authority
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👑</span>
              </div>
              <h4 className="text-white font-bold mb-2">Instant Authority</h4>
              <p className="text-gray-400 text-sm">
                When buyers see you teaching others, they instantly view you as an expert in your field.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h4 className="text-white font-bold mb-2">Community Trust</h4>
              <p className="text-gray-400 text-sm">
                Sharing knowledge builds goodwill and establishes you as a helpful, reliable professional.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h4 className="text-white font-bold mb-2">Credibility Boost</h4>
              <p className="text-gray-400 text-sm">
                Educational content proves deep understanding and positions you above competitors.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-2xl p-8 backdrop-blur">
          <h3 className="text-3xl font-black text-white mb-4">
            Want to Contribute?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Share your knowledge with the community. Submit your own tutorials and help others master 3D modeling.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold text-lg shadow-lg shadow-orange-500/50">
            Submit Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}
