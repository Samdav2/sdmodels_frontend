"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  status: "In Progress" | "Planning" | "Coming Soon" | "Top Secret";
  category: string;
  progress: number;
  eta: string;
  description: string;
  features: string[];
  icon: string;
  isSecret: boolean;
}

export default function TechnicalRoadmapPage() {
  const projects: Project[] = [
    {
      id: "1",
      title: "Cyberpunk City Pack",
      status: "In Progress",
      category: "Environment",
      progress: 65,
      eta: "2 weeks",
      description: "Complete modular city kit with neon signs, buildings, and props. Optimized for real-time rendering.",
      features: [
        "50+ modular building pieces",
        "Animated neon signs",
        "PBR materials with emissive maps",
        "LOD system for performance",
      ],
      icon: "🌃",
      isSecret: false,
    },
    {
      id: "2",
      title: "Creature Collection Vol. 2",
      status: "In Progress",
      category: "Characters",
      progress: 40,
      eta: "4 weeks",
      description: "Fantasy creatures with full rigging and animation sets. Designed for RPG games.",
      features: [
        "5 unique creatures",
        "Full animation sets (20+ animations each)",
        "Modular parts for customization",
        "Unity & Unreal ready",
      ],
      icon: "🐉",
      isSecret: false,
    },
    {
      id: "3",
      title: "Sci-Fi Weapon Arsenal",
      status: "Planning",
      category: "Weapons",
      progress: 15,
      eta: "6 weeks",
      description: "High-tech weapon collection with modular attachments and customization options.",
      features: [
        "15 base weapons",
        "Modular attachment system",
        "Animated reload sequences",
        "VFX-ready muzzle points",
      ],
      icon: "🔫",
      isSecret: false,
    },
    {
      id: "4",
      title: "Educational Anatomy Suite",
      status: "In Progress",
      category: "Education",
      progress: 55,
      eta: "3 weeks",
      description: "Interactive anatomical models for medical education with exploded views and color-coded systems.",
      features: [
        "Full human anatomy",
        "Interactive exploded views",
        "Color-coded organ systems",
        "AR/VR compatible",
      ],
      icon: "🫀",
      isSecret: false,
    },
    {
      id: "5",
      title: "Project NEXUS",
      status: "Top Secret",
      category: "???",
      progress: 30,
      eta: "TBA",
      description: "Something revolutionary is in development. Stay tuned for the big reveal...",
      features: [
        "████████████",
        "████████████",
        "████████████",
        "████████████",
      ],
      icon: "🔒",
      isSecret: true,
    },
    {
      id: "6",
      title: "Procedural Terrain System",
      status: "Planning",
      category: "Tools",
      progress: 10,
      eta: "8 weeks",
      description: "Python-based tool for generating realistic terrain with automatic LOD and texture blending.",
      features: [
        "Procedural generation",
        "Automatic LOD creation",
        "Texture splatting",
        "Blender addon",
      ],
      icon: "🏔️",
      isSecret: false,
    },
    {
      id: "7",
      title: "Retro Game Assets Pack",
      status: "Coming Soon",
      category: "Props",
      progress: 0,
      eta: "Q2 2026",
      description: "Low-poly retro-styled assets perfect for indie games and nostalgic projects.",
      features: [
        "100+ props",
        "Consistent art style",
        "Mobile-optimized",
        "Pixel-perfect textures",
      ],
      icon: "🎮",
      isSecret: false,
    },
    {
      id: "8",
      title: "Mystery Project Alpha",
      status: "Top Secret",
      category: "???",
      progress: 20,
      eta: "TBA",
      description: "Classified. Information will be revealed when the time is right...",
      features: [
        "████████████",
        "████████████",
        "████████████",
      ],
      icon: "❓",
      isSecret: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-green-500/20 border-green-500 text-green-400";
      case "Planning": return "bg-yellow-500/20 border-yellow-500 text-yellow-400";
      case "Coming Soon": return "bg-cyan-500/20 border-cyan-500 text-cyan-400";
      case "Top Secret": return "bg-red-500/20 border-red-500 text-red-400";
      default: return "bg-gray-500/20 border-gray-500 text-gray-400";
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
              NEXUS MODELS
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
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-sm font-bold backdrop-blur-sm">
              🗺️ TECHNICAL ROADMAP
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">
            What's <span className="text-orange-500">Coming Next</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Always evolving. Peek into current projects and future releases. The marketplace is alive and growing.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-3xl font-black text-green-400 mb-1">
              {projects.filter(p => p.status === "In Progress").length}
            </div>
            <div className="text-sm text-gray-300">In Progress</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-3xl font-black text-yellow-400 mb-1">
              {projects.filter(p => p.status === "Planning").length}
            </div>
            <div className="text-sm text-gray-300">Planning</div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/50 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-3xl font-black text-cyan-400 mb-1">
              {projects.filter(p => p.status === "Coming Soon").length}
            </div>
            <div className="text-sm text-gray-300">Coming Soon</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/50 rounded-xl p-4 backdrop-blur text-center">
            <div className="text-3xl font-black text-red-400 mb-1">
              {projects.filter(p => p.status === "Top Secret").length}
            </div>
            <div className="text-sm text-gray-300">Top Secret</div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-900/50 border border-orange-500/30 rounded-xl overflow-hidden backdrop-blur hover:border-orange-500 transition-all ${
                project.isSecret ? 'relative' : ''
              }`}
            >
              {/* Secret Overlay */}
              {project.isSecret && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <div className="text-2xl font-black text-red-400 mb-2">CLASSIFIED</div>
                    <div className="text-gray-400">Details Coming Soon...</div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 border-b border-orange-500/30 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{project.icon}</div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">{project.title}</h3>
                      <div className="text-sm text-gray-400">{project.category}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Progress Bar */}
                {!project.isSecret && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-orange-400 font-bold">{project.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                        style={{
                          boxShadow: '0 0 15px rgba(255, 107, 53, 0.5)',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-400">ETA:</span>
                  <span className="text-sm text-orange-400 font-semibold">{project.eta}</span>
                </div>

                <p className="text-gray-300 text-sm mb-4">
                  {project.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-white mb-2">Key Features:</div>
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">•</span>
                      <span className={`text-sm ${project.isSecret ? 'text-gray-600' : 'text-gray-400'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                {!project.isSecret && (
                  <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/30">
                    Get Notified on Release
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Visualization */}
        <div className="mb-12 bg-slate-900/50 border border-orange-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur">
          <h2 className="text-2xl font-black text-white mb-6 text-center">
            Release Timeline
          </h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-purple-500 to-cyan-500 -translate-x-1/2 hidden sm:block" />
            
            {/* Timeline Items */}
            <div className="space-y-8">
              {projects.filter(p => !p.isSecret && p.status !== "Coming Soon").map((project, index) => (
                <div key={project.id} className={`flex items-center gap-4 ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                    <div className="bg-slate-950/50 border border-orange-500/30 rounded-lg p-4 inline-block">
                      <div className="font-bold text-white mb-1">{project.title}</div>
                      <div className="text-sm text-orange-400">{project.eta}</div>
                    </div>
                  </div>
                  
                  <div className="w-4 h-4 bg-orange-500 rounded-full border-4 border-slate-900 z-10 flex-shrink-0" />
                  
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Roadmap Matters */}
        <div className="bg-gradient-to-br from-purple-500/10 to-orange-500/10 border border-purple-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 text-center">
            Why Transparency Matters
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h4 className="text-white font-bold mb-2">Always Evolving</h4>
              <p className="text-gray-400 text-sm">
                Shows the marketplace is active and constantly growing with new content.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="text-white font-bold mb-2">Creates Excitement</h4>
              <p className="text-gray-400 text-sm">
                Teaser projects and "Top Secret" items build anticipation and keep users engaged.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💼</span>
              </div>
              <h4 className="text-white font-bold mb-2">Professional Trust</h4>
              <p className="text-gray-400 text-sm">
                Demonstrates commitment to long-term quality and continuous improvement.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 text-center bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-2xl p-8 backdrop-blur">
          <h3 className="text-3xl font-black text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get notified when new projects launch. Be the first to access fresh content.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-6 py-4 bg-slate-900 border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold shadow-lg shadow-orange-500/50">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
