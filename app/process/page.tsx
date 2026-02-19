"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  stages: {
    sketch: string;
    wireframe: string;
    final: string;
  };
  description: string;
  challenges: string[];
  solutions: string[];
  stats: {
    polyCount: number;
    timeSpent: string;
    software: string[];
  };
}

export default function ProcessVaultPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const caseStudies: CaseStudy[] = [
    {
      id: "1",
      title: "Cyberpunk Mech Warrior",
      category: "Character Design",
      thumbnail: "/api/placeholder/400/300",
      stages: {
        sketch: "/api/placeholder/800/600",
        wireframe: "/api/placeholder/800/600",
        final: "/api/placeholder/800/600",
      },
      description: "A fully rigged character designed for AAA game production with optimized topology for animation.",
      challenges: [
        "Complex mechanical joints requiring clean edge flow",
        "Maintaining detail while keeping poly count under 20k",
        "Creating modular armor pieces for customization",
      ],
      solutions: [
        "Used edge loop optimization for natural deformation",
        "Implemented normal maps for high-frequency details",
        "Designed snap-point system for armor modularity",
      ],
      stats: {
        polyCount: 18500,
        timeSpent: "72 hours",
        software: ["Blender", "ZBrush", "Substance Painter"],
      },
    },
    {
      id: "2",
      title: "Futuristic Vehicle",
      category: "Hard Surface",
      thumbnail: "/api/placeholder/400/300",
      stages: {
        sketch: "/api/placeholder/800/600",
        wireframe: "/api/placeholder/800/600",
        final: "/api/placeholder/800/600",
      },
      description: "High-performance vehicle with working suspension and modular parts for game engines.",
      challenges: [
        "Accurate mechanical functionality",
        "Optimized collision meshes",
        "PBR material workflow",
      ],
      solutions: [
        "Referenced real-world suspension systems",
        "Created LOD system with 4 levels",
        "Used metalness workflow for realistic materials",
      ],
      stats: {
        polyCount: 12400,
        timeSpent: "48 hours",
        software: ["Maya", "Substance Designer", "Marmoset"],
      },
    },
    {
      id: "3",
      title: "Organic Creature",
      category: "Creature Design",
      thumbnail: "/api/placeholder/400/300",
      stages: {
        sketch: "/api/placeholder/800/600",
        wireframe: "/api/placeholder/800/600",
        final: "/api/placeholder/800/600",
      },
      description: "Anatomically-inspired alien creature with realistic muscle deformation and skin details.",
      challenges: [
        "Believable anatomy for non-human form",
        "Skin detail without excessive geometry",
        "Animation-ready topology",
      ],
      solutions: [
        "Studied animal anatomy for reference",
        "Used displacement maps for micro-details",
        "Implemented proper edge loops for joints",
      ],
      stats: {
        polyCount: 25000,
        timeSpent: "96 hours",
        software: ["ZBrush", "Blender", "Substance Painter"],
      },
    },
  ];

  const selectedCaseStudy = caseStudies.find(cs => cs.id === selectedCase);

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
              SDModels
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
              🔬 PROCESS VAULT
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">
            Behind the <span className="text-orange-500">Mastery</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Deep dive into the creative process. From sketch to final render, see the intelligence behind every model.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCase(study.id)}
              className="group bg-slate-900/50 border border-orange-500/30 rounded-xl overflow-hidden backdrop-blur hover:border-orange-500 transition-all cursor-pointer"
            >
              <div className="relative h-48 bg-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full text-cyan-400 text-xs font-bold">
                  {study.category}
                </div>
                {/* Placeholder for thumbnail */}
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {study.category === "Character Design" && "🦾"}
                  {study.category === "Hard Surface" && "🚗"}
                  {study.category === "Creature Design" && "🐉"}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black text-white mb-2 group-hover:text-orange-400 transition">
                  {study.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {study.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-mono">{study.stats.polyCount.toLocaleString()} polys</span>
                  <span className="text-orange-400 font-semibold">View Process →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Case Study Modal */}
        {selectedCaseStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
            onClick={() => setSelectedCase(null)}
          >
            <div 
              className="min-h-screen flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border-2 border-orange-500/50 rounded-2xl max-w-5xl w-full overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border-b border-orange-500/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-full text-cyan-400 text-xs font-bold">
                        {selectedCaseStudy.category}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedCase(null)}
                      className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg text-gray-400 hover:text-white hover:border-orange-500 transition"
                    >
                      ✕
                    </button>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">{selectedCaseStudy.title}</h2>
                  <p className="text-gray-300">{selectedCaseStudy.description}</p>
                </div>

                <div className="p-6 space-y-8">
                  {/* Interactive Slider - Wireframe Reveal */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>🔍</span> Wireframe X-Ray Slider
                    </h3>
                    <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-orange-500/30">
                      <div className="relative h-96">
                        {/* Final Render (Background) */}
                        <div className="absolute inset-0 flex items-center justify-center text-8xl">
                          🎨
                        </div>
                        
                        {/* Wireframe Overlay (Revealed by slider) */}
                        <div 
                          className="absolute inset-0 flex items-center justify-center text-8xl bg-slate-900/90"
                          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                          <div className="text-cyan-400">📐</div>
                        </div>

                        {/* Slider Control */}
                        <div className="absolute inset-0 flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPosition}
                            onChange={(e) => setSliderPosition(Number(e.target.value))}
                            className="absolute w-full h-full opacity-0 cursor-ew-resize z-10"
                          />
                          <div 
                            className="absolute h-full w-1 bg-orange-500 shadow-lg shadow-orange-500/50"
                            style={{ left: `${sliderPosition}%` }}
                          >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-orange-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                              <span className="text-white text-xl">⇄</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between p-4 bg-slate-950/50 border-t border-slate-700">
                        <span className="text-cyan-400 font-semibold text-sm">← Wireframe</span>
                        <span className="text-orange-400 font-semibold text-sm">Final Render →</span>
                      </div>
                    </div>
                  </div>

                  {/* Process Stages */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>📋</span> Development Stages
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { name: "Concept Sketch", icon: "✏️", stage: "sketch" },
                        { name: "Wireframe", icon: "📐", stage: "wireframe" },
                        { name: "Final Render", icon: "🎨", stage: "final" },
                      ].map((stage) => (
                        <div key={stage.stage} className="bg-slate-950/50 border border-slate-700 rounded-xl p-4">
                          <div className="text-4xl mb-3 text-center">{stage.icon}</div>
                          <div className="text-center">
                            <div className="font-semibold text-white mb-1">{stage.name}</div>
                            <div className="text-xs text-gray-400">Stage {["sketch", "wireframe", "final"].indexOf(stage.stage) + 1}/3</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges & Solutions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span>⚠️</span> Challenges
                      </h3>
                      <div className="space-y-3">
                        {selectedCaseStudy.challenges.map((challenge, idx) => (
                          <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                            <p className="text-red-300 text-sm">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span>✅</span> Solutions
                      </h3>
                      <div className="space-y-3">
                        {selectedCaseStudy.solutions.map((solution, idx) => (
                          <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <p className="text-green-300 text-sm">{solution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Technical Stats */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span>📊</span> Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-950/50 border border-orange-500/30 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Polygon Count</div>
                        <div className="text-2xl font-black text-orange-400">
                          {selectedCaseStudy.stats.polyCount.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="bg-slate-950/50 border border-cyan-500/30 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Time Invested</div>
                        <div className="text-2xl font-black text-cyan-400">
                          {selectedCaseStudy.stats.timeSpent}
                        </div>
                      </div>
                      
                      <div className="bg-slate-950/50 border border-purple-500/30 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-1">Software Stack</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedCaseStudy.stats.software.map((soft) => (
                            <span key={soft} className="px-2 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded text-xs">
                              {soft}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Why Process Matters */}
        <div className="mt-12 bg-gradient-to-br from-cyan-500/10 to-orange-500/10 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 text-center">
            Why Process Matters
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="text-white font-bold mb-2">Proves Authenticity</h4>
              <p className="text-gray-400 text-sm">
                Shows you didn't just buy and tweak. You understand topology, edge flow, and optimization.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h4 className="text-white font-bold mb-2">Demonstrates Expertise</h4>
              <p className="text-gray-400 text-sm">
                Buyers see your problem-solving skills and technical knowledge in action.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h4 className="text-white font-bold mb-2">Builds Trust</h4>
              <p className="text-gray-400 text-sm">
                Transparency in process creates confidence in quality and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
