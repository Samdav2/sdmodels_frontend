"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Skill {
  name: string;
  level: number;
  icon: string;
  category: string;
}

interface Certification {
  title: string;
  issuer: string;
  year: string;
  icon: string;
}

export default function HallOfMasteryPage() {
  const skills: Skill[] = [
    { name: "Character Rigging", level: 95, icon: "🦴", category: "Animation" },
    { name: "PBR Texturing", level: 90, icon: "🎨", category: "Materials" },
    { name: "Hard Surface Modeling", level: 92, icon: "🔧", category: "Modeling" },
    { name: "Organic Sculpting", level: 88, icon: "🗿", category: "Modeling" },
    { name: "UV Unwrapping", level: 85, icon: "📐", category: "Technical" },
    { name: "Topology Optimization", level: 93, icon: "⚡", category: "Technical" },
    { name: "Python Scripting", level: 80, icon: "🐍", category: "Programming" },
    { name: "FastAPI Backend", level: 82, icon: "⚙️", category: "Programming" },
    { name: "Game Engine Integration", level: 87, icon: "🎮", category: "Technical" },
    { name: "Educational Design", level: 90, icon: "📚", category: "Education" },
  ];

  const software = [
    { name: "Blender", icon: "🟠", proficiency: 95 },
    { name: "Maya", icon: "🔷", proficiency: 85 },
    { name: "ZBrush", icon: "🔴", proficiency: 88 },
    { name: "Substance Painter", icon: "🎨", proficiency: 90 },
    { name: "Substance Designer", icon: "🧩", proficiency: 82 },
    { name: "Marmoset Toolbag", icon: "🔦", proficiency: 85 },
    { name: "Unity", icon: "⚫", proficiency: 80 },
    { name: "Unreal Engine", icon: "⬛", proficiency: 78 },
    { name: "Python", icon: "🐍", proficiency: 85 },
    { name: "FastAPI", icon: "⚡", proficiency: 82 },
    { name: "React/Next.js", icon: "⚛️", proficiency: 88 },
    { name: "Three.js", icon: "🌐", proficiency: 85 },
  ];

  const certifications: Certification[] = [
    {
      title: "B.Sc. Educational Technology",
      issuer: "Lagos State University (LASU)",
      year: "2023",
      icon: "🎓",
    },
    {
      title: "Advanced Character Creation",
      issuer: "Blender Foundation",
      year: "2022",
      icon: "🦾",
    },
    {
      title: "PBR Texturing Masterclass",
      issuer: "Substance Academy",
      year: "2023",
      icon: "🎨",
    },
    {
      title: "Python for 3D Artists",
      issuer: "CG Cookie",
      year: "2022",
      icon: "🐍",
    },
    {
      title: "Game-Ready Asset Creation",
      issuer: "Unreal Engine",
      year: "2023",
      icon: "🎮",
    },
  ];

  const categories = ["All", "Modeling", "Animation", "Materials", "Technical", "Programming", "Education"];

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
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-yellow-400 text-xs sm:text-sm font-bold backdrop-blur-sm">
              🏆 HALL OF MASTERY
            </span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 px-4">
            Technical <span className="text-orange-500">Credentials</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Formal education, certifications, and technical stack. The receipt of expertise.
          </p>
        </div>

        {/* Academic Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 sm:mb-12 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 border-2 border-yellow-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-yellow-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-4xl sm:text-5xl border-2 border-yellow-500 flex-shrink-0">
              🎓
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="text-xs sm:text-sm text-yellow-300 mb-1 sm:mb-2">Academic Foundation</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-1 sm:mb-2">
                B.Sc. Educational Technology
              </div>
              <div className="text-base sm:text-lg text-gray-300 mb-2 sm:mb-3">
                Lagos State University (LASU) • 2023
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Specialized in creating 3D models that teach and explain concepts effectively. 
                Understanding of pedagogy, instructional design, and how visual media enhances learning.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Software HUD */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">💻</span> 
            <span>Software Arsenal</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {software.map((soft, index) => (
              <motion.div
                key={soft.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur hover:border-orange-500 transition-all group"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 text-center group-hover:scale-110 transition-transform">
                  {soft.icon}
                </div>
                <div className="text-center mb-2 sm:mb-3">
                  <div className="font-semibold text-white text-xs sm:text-sm mb-1 truncate" title={soft.name}>
                    {soft.name}
                  </div>
                  <div className="text-xs text-gray-400">{soft.proficiency}%</div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${soft.proficiency}%` }}
                    transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skill Bars */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">⚡</span> 
            <span>Core Competencies</span>
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 backdrop-blur hover:border-orange-500 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">{skill.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-sm sm:text-base truncate">{skill.name}</div>
                      <div className="text-xs text-gray-400">{skill.category}</div>
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-orange-400 flex-shrink-0">
                    {skill.level}%
                  </div>
                </div>
                
                {/* Neon Progress Bar */}
                <div className="relative w-full h-2 sm:h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 rounded-full"
                    style={{
                      boxShadow: '0 0 20px rgba(255, 107, 53, 0.6)',
                    }}
                  />
                  {/* Glow effect */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-50 blur-sm"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">📜</span> 
            <span>Certifications & Training</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 border border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 backdrop-blur hover:border-orange-500 transition-all group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/20 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl border border-orange-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
                    {cert.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm sm:text-base mb-1 leading-tight">{cert.title}</div>
                    <div className="text-xs sm:text-sm text-gray-400 mb-2 truncate" title={cert.issuer}>{cert.issuer}</div>
                    <div className="inline-block px-2 sm:px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 rounded-full text-xs font-semibold">
                      {cert.year}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur text-center"
          >
            <div className="text-4xl sm:text-5xl font-black text-orange-400 mb-1 sm:mb-2">5+</div>
            <div className="text-white font-semibold mb-1 text-sm sm:text-base">Years Experience</div>
            <div className="text-xs sm:text-sm text-gray-400">Professional 3D modeling</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur text-center"
          >
            <div className="text-4xl sm:text-5xl font-black text-cyan-400 mb-1 sm:mb-2">500+</div>
            <div className="text-white font-semibold mb-1 text-sm sm:text-base">Models Created</div>
            <div className="text-xs sm:text-sm text-gray-400">Across all categories</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur text-center"
          >
            <div className="text-4xl sm:text-5xl font-black text-purple-400 mb-1 sm:mb-2">1000+</div>
            <div className="text-white font-semibold mb-1 text-sm sm:text-base">Students Taught</div>
            <div className="text-xs sm:text-sm text-gray-400">Educational Technology impact</div>
          </motion.div>
        </div>

        {/* Why Credentials Matter */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 backdrop-blur">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-4 sm:mb-6 text-center">
            Why Credentials Matter
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">🎯</span>
              </div>
              <h4 className="text-white font-bold mb-2 text-sm sm:text-base">Verified Expertise</h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Formal education and certifications prove commitment to mastery and continuous learning.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">🛡️</span>
              </div>
              <h4 className="text-white font-bold mb-2 text-sm sm:text-base">Quality Assurance</h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Technical stack transparency shows you have the right tools for professional work.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">💼</span>
              </div>
              <h4 className="text-white font-bold mb-2 text-sm sm:text-base">Professional Trust</h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Educational background in EdTech means models designed with pedagogy in mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
