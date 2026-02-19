"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function AboutPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const signatureRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: signatureRef,
    offset: ["start end", "end start"]
  });

  const signatureProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const timeline = [
    {
      year: "2018",
      title: "The Beginning",
      description: "Started journey in 3D modeling and animation at Lagos State University",
      icon: "🎓",
    },
    {
      year: "2020",
      title: "Technical Mastery",
      description: "Mastered Blender, ZBrush, and began Python scripting for automation",
      icon: "⚡",
    },
    {
      year: "2022",
      title: "Full-Stack Evolution",
      description: "Expanded into web development with React, Next.js, and FastAPI",
      icon: "💻",
    },
    {
      year: "2023",
      title: "Educational Technology Degree",
      description: "Graduated with B.Sc. in Educational Technology from LASU",
      icon: "🏆",
    },
    {
      year: "2024",
      title: "Marketplace Vision",
      description: "Founded SDModels to revolutionize the 3D asset industry",
      icon: "🚀",
    },
    {
      year: "2026",
      title: "Present Day",
      description: "Leading the platform with 500+ models and 1000+ students taught",
      icon: "👑",
    },
  ];

  const skillClusters = [
    {
      title: "3D Artistry",
      icon: "🎨",
      description: "Character rigging, PBR texturing, and animation mastery",
      color: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500",
      skills: ["Character Design", "Hard Surface", "Organic Sculpting", "Animation"],
    },
    {
      title: "EdTech Integration",
      icon: "📚",
      description: "Creating 3D models that teach and explain concepts effectively",
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500",
      skills: ["Instructional Design", "Visual Learning", "Interactive Models", "AR/VR"],
    },
    {
      title: "Full-Stack Engineering",
      icon: "⚙️",
      description: "Building the platform with modern web technologies",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500",
      skills: ["React/Next.js", "FastAPI", "Three.js", "Python Automation"],
    },
  ];

  const visionMilestones = [
    { year: "2027", title: "AI-Mesh Automation", status: "planned", blur: true },
    { year: "2027", title: "VR Marketplace Entry", status: "planned", blur: true },
    { year: "2028", title: "Global Expansion", status: "planned", blur: true },
    { year: "2028", title: "████████████", status: "secret", blur: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
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
        {/* Executive Profile - Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 sm:mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Identity HUD - Photo Side */}
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                {/* 3D Scanning Overlay Effect */}
                <div className="absolute inset-0 border-2 border-orange-500/50 rounded-2xl overflow-hidden">
                  <motion.div
                    animate={{ y: ["0%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
                  />
                </div>
                
                {/* Profile Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center backdrop-blur">
                  <div className="text-center">
                    <div className="text-9xl mb-4">👨‍💻</div>
                    <div className="text-white font-bold text-xl">CEO & Principal Architect</div>
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-orange-500" />
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-orange-500" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-orange-500" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-orange-500" />
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                <div className="bg-slate-900/90 border border-orange-500/50 rounded-lg px-4 py-2 backdrop-blur">
                  <div className="text-orange-400 font-black text-xl">500+</div>
                  <div className="text-gray-400 text-xs">Models</div>
                </div>
                <div className="bg-slate-900/90 border border-cyan-500/50 rounded-lg px-4 py-2 backdrop-blur">
                  <div className="text-cyan-400 font-black text-xl">1000+</div>
                  <div className="text-gray-400 text-xs">Students</div>
                </div>
                <div className="bg-slate-900/90 border border-purple-500/50 rounded-lg px-4 py-2 backdrop-blur">
                  <div className="text-purple-400 font-black text-xl">5+</div>
                  <div className="text-gray-400 text-xs">Years</div>
                </div>
              </div>
            </div>

            {/* Identity Info */}
            <div className="text-center lg:text-left mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-block mb-4">
                  <span className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full text-orange-400 text-sm font-bold backdrop-blur-sm">
                    🏛️ GRAND ARCHITECT
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  Your Name
                </h1>
                
                <div className="text-xl sm:text-2xl text-orange-400 font-bold mb-6">
                  CEO & Principal 3D Architect
                </div>

                {/* Mission Statement */}
                <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-l-4 border-orange-500 rounded-r-xl p-6 mb-6">
                  <p className="text-gray-300 text-lg leading-relaxed italic">
                    "Revolutionizing the Nigerian 3D industry by building a marketplace that empowers modellers globally with fair fees, quality standards, and cutting-edge technology."
                  </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link href="/mastery" className="px-4 py-2 bg-slate-800 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/20 transition text-sm font-semibold">
                    📜 Credentials
                  </Link>
                  <Link href="/process" className="px-4 py-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition text-sm font-semibold">
                    🔬 Process
                  </Link>
                  <Link href="/learn" className="px-4 py-2 bg-slate-800 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition text-sm font-semibold">
                    📚 Tutorials
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Technical DNA - Skill Clusters */}
        <div className="mb-12 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Technical <span className="text-orange-500">DNA</span>
            </h2>
            <p className="text-gray-400 text-lg">The unique combination that powers this platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillClusters.map((cluster, index) => (
              <motion.div
                key={cluster.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${cluster.color} border-2 ${cluster.borderColor} rounded-2xl p-6 backdrop-blur hover:scale-105 transition-transform cursor-pointer group`}
              >
                <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                  {cluster.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-3 text-center">
                  {cluster.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  {cluster.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {cluster.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-slate-900/50 border border-slate-700 text-gray-300 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Timeline - Life Path */}
        <div className="mb-12 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              The <span className="text-orange-500">Journey</span>
            </h2>
            <p className="text-gray-400 text-lg">From student to market-leading architect</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-purple-500 to-cyan-500 -translate-x-1/2 hidden sm:block" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 ${
                    index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'} hidden sm:block`}>
                    <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 inline-block backdrop-blur hover:border-orange-500 transition">
                      <div className="text-orange-400 font-bold text-sm mb-2">{item.year}</div>
                      <div className="font-black text-white text-xl mb-2">{item.title}</div>
                      <div className="text-gray-400 text-sm">{item.description}</div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="flex-1 sm:hidden">
                    <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-4 backdrop-blur">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-2xl border border-orange-500/30">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-orange-400 font-bold text-sm">{item.year}</div>
                          <div className="font-black text-white">{item.title}</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">{item.description}</div>
                    </div>
                  </div>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-500 rounded-full border-4 border-slate-900 z-10 flex items-center justify-center text-2xl flex-shrink-0 hidden sm:flex">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 hidden sm:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Legacy & Vision */}
        <div className="mb-12 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Why This Marketplace */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/50 rounded-2xl p-8 backdrop-blur"
            >
              <h3 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>❓</span> Why SDModels?
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-red-400 font-bold mb-2">The Problem</div>
                  <p className="text-gray-300 text-sm">
                    Other platforms charge excessive fees (30-50%), lack quality checks, and don't support creators with tools and education.
                  </p>
                </div>
                
                <div>
                  <div className="text-green-400 font-bold mb-2">The Solution</div>
                  <p className="text-gray-300 text-sm">
                    Fair 7.5% fee structure, automated quality validation, educational resources, and a gamified leaderboard system that rewards excellence.
                  </p>
                </div>

                <div className="pt-4 border-t border-orange-500/30">
                  <div className="text-orange-400 font-bold mb-2">The Mission</div>
                  <p className="text-gray-300 text-sm">
                    Build the most advanced 3D marketplace in Africa, empowering Nigerian creators to compete globally.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vision Board */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-2 border-purple-500/50 rounded-2xl p-8 backdrop-blur"
            >
              <h3 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span>🔮</span> Vision Board
              </h3>
              
              <div className="space-y-4">
                {visionMilestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="bg-slate-950/50 border border-purple-500/30 rounded-lg p-4 relative overflow-hidden"
                  >
                    {milestone.blur && (
                      <div className="absolute inset-0 backdrop-blur-sm bg-slate-950/60 flex items-center justify-center z-10">
                        <span className="text-purple-400 font-bold">🔒 Coming Soon</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-purple-400 font-bold text-sm mb-1">{milestone.year}</div>
                        <div className="text-white font-semibold">{milestone.title}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        milestone.status === 'secret' 
                          ? 'bg-red-500/20 border border-red-500 text-red-400'
                          : 'bg-purple-500/20 border border-purple-500 text-purple-400'
                      }`}>
                        {milestone.status === 'secret' ? 'TOP SECRET' : 'PLANNED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Nexus of Credibility - Neural Links */}
        <div className="mb-12 sm:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Nexus of <span className="text-orange-500">Credibility</span>
            </h2>
            <p className="text-gray-400 text-lg">Direct neural links to proof of expertise</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/process" className="group">
              <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-xl p-6 backdrop-blur hover:border-cyan-500 transition-all hover:scale-105">
                <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">🔬</div>
                <h3 className="text-xl font-black text-white mb-2 text-center">View My Process</h3>
                <p className="text-gray-400 text-sm text-center mb-4">
                  See wireframes, case studies, and the intelligence behind every model
                </p>
                <div className="text-cyan-400 text-center font-semibold">Explore Process Vault →</div>
              </div>
            </Link>

            <Link href="/testimonials" className="group">
              <div className="bg-slate-900/50 border-2 border-green-500/30 rounded-xl p-6 backdrop-blur hover:border-green-500 transition-all hover:scale-105">
                <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">💬</div>
                <h3 className="text-xl font-black text-white mb-2 text-center">Check My Receipts</h3>
                <p className="text-gray-400 text-sm text-center mb-4">
                  Verified testimonials from industry professionals and clients
                </p>
                <div className="text-green-400 text-center font-semibold">View Testimonials →</div>
              </div>
            </Link>

            <Link href="/learn" className="group">
              <div className="bg-slate-900/50 border-2 border-purple-500/30 rounded-xl p-6 backdrop-blur hover:border-purple-500 transition-all hover:scale-105">
                <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform">📚</div>
                <h3 className="text-xl font-black text-white mb-2 text-center">Learn From Me</h3>
                <p className="text-gray-400 text-sm text-center mb-4">
                  Tutorials, guides, and knowledge sharing with the community
                </p>
                <div className="text-purple-400 text-center font-semibold">Access Learning Nexus →</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Dynamic Signature */}
        <div ref={signatureRef} className="mb-12 text-center">
          <motion.div
            style={{ opacity: signatureProgress }}
            className="inline-block"
          >
            <svg width="400" height="120" viewBox="0 0 400 120" className="mx-auto">
              <motion.path
                d="M 20 80 Q 50 20, 100 60 T 200 60 Q 250 80, 300 40 L 350 60"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff6b35" />
                  <stop offset="50%" stopColor="#ff8c42" />
                  <stop offset="100%" stopColor="#cc0044" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-orange-400 font-bold mt-2">— Your Signature</div>
          </motion.div>
        </div>

        {/* Verified Certificate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-cyan-500/20 border-2 border-orange-500/50 rounded-2xl p-8 backdrop-blur text-center">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-black text-white mb-2">Authenticated Identity</h3>
            <p className="text-gray-400 mb-4">
              Verified by SDModels Security Protocols
            </p>
            <div className="inline-block px-6 py-3 bg-green-500/20 border-2 border-green-500 text-green-400 rounded-lg font-bold">
              🔒 VERIFIED CEO & FOUNDER
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
