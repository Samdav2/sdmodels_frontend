"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  avatar: string;
  quote: string;
  rating: number;
  project: string;
  verified: boolean;
}

interface ImpactStat {
  value: string;
  label: string;
  icon: string;
}

export default function TestimonialTerminalPage() {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Dr. Sarah Chen",
      role: "Lead Technical Artist",
      company: "Unity Technologies",
      companyLogo: "⚫",
      avatar: "👩‍💼",
      quote: "The attention to topology and edge flow is exceptional. These models integrate seamlessly into our pipeline with zero cleanup required. The rigging is production-ready out of the box.",
      rating: 5,
      project: "Unity Asset Store Integration",
      verified: true,
    },
    {
      id: "2",
      name: "Marcus Rodriguez",
      role: "Game Director",
      company: "Indie Game Studio",
      companyLogo: "🎮",
      avatar: "👨‍💻",
      quote: "Working with these models saved us 3 weeks of development time. The optimization for mobile was perfect, and the LOD system was exactly what we needed. Highly professional work.",
      rating: 5,
      project: "Mobile RPG Character Pack",
      verified: true,
    },
    {
      id: "3",
      name: "Prof. James Wilson",
      role: "Department Head",
      company: "MIT Media Lab",
      companyLogo: "🎓",
      avatar: "👨‍🏫",
      quote: "The educational models are brilliantly designed for teaching. Color-coded anatomy, exploded views, and interactive elements make complex concepts accessible to students. Outstanding pedagogical approach.",
      rating: 5,
      project: "Anatomy Visualization Project",
      verified: true,
    },
    {
      id: "4",
      name: "Elena Kowalski",
      role: "VFX Supervisor",
      company: "Film Production House",
      companyLogo: "🎬",
      avatar: "👩‍🎨",
      quote: "The level of detail in the high-poly sculpts is incredible. Normal maps bake perfectly, and the UV layouts are clean and efficient. These are studio-quality assets.",
      rating: 5,
      project: "Sci-Fi Film Assets",
      verified: true,
    },
    {
      id: "5",
      name: "Ahmed Hassan",
      role: "Technical Director",
      company: "Architectural Firm",
      companyLogo: "🏢",
      avatar: "👨‍💼",
      quote: "The architectural models are accurate and optimized for real-time rendering. Perfect for client presentations and VR walkthroughs. Excellent communication throughout the project.",
      rating: 5,
      project: "VR Architectural Visualization",
      verified: true,
    },
    {
      id: "6",
      name: "Lisa Park",
      role: "Creative Director",
      company: "Advertising Agency",
      companyLogo: "📱",
      avatar: "👩‍💻",
      quote: "Fast turnaround, professional quality, and great attention to our brand guidelines. The product visualizations exceeded our expectations and impressed our client.",
      rating: 5,
      project: "Product Visualization Campaign",
      verified: true,
    },
  ];

  const impactStats: ImpactStat[] = [
    { value: "1000+", label: "Students Taught", icon: "🎓" },
    { value: "500+", label: "Models Created", icon: "🎨" },
    { value: "50+", label: "Projects Completed", icon: "✅" },
    { value: "98%", label: "Client Satisfaction", icon: "⭐" },
    { value: "15+", label: "Industry Partners", icon: "🤝" },
    { value: "5+", label: "Years Experience", icon: "📅" },
  ];

  const companyLogos = [
    { name: "Unity Technologies", icon: "⚫" },
    { name: "Unreal Engine", icon: "⬛" },
    { name: "Blender Foundation", icon: "🟠" },
    { name: "Adobe", icon: "🔴" },
    { name: "Autodesk", icon: "🔷" },
    { name: "Epic Games", icon: "⚡" },
  ];

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
            <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm font-bold backdrop-blur-sm">
              💬 TESTIMONIAL TERMINAL
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4">
            Social <span className="text-orange-500">Proof</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Don't take our word for it. See what industry professionals say about the work.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {impactStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-4 backdrop-blur text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-orange-400 mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trusted By */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white text-center mb-6">
            Trusted By Industry Leaders
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {companyLogos.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 border border-orange-500/30 rounded-xl px-6 py-4 backdrop-blur hover:border-orange-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{company.icon}</span>
                  <span className="text-gray-300 font-semibold">{company.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/50 border border-orange-500/30 rounded-xl overflow-hidden backdrop-blur hover:border-orange-500 transition-all"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500/20 to-cyan-500/20 border-b border-orange-500/30 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center text-3xl border border-orange-500/30 flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{testimonial.name}</h3>
                      {testimonial.verified && (
                        <span className="text-green-400" title="Verified Client">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 mb-1">{testimonial.role}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{testimonial.companyLogo}</span>
                      <span className="text-sm text-gray-300">{testimonial.company}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-orange-400 text-lg">⭐</span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="pt-4 border-t border-slate-700">
                  <div className="text-xs text-gray-500 mb-1">Project</div>
                  <div className="text-sm text-orange-400 font-semibold">{testimonial.project}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verification Badge Section */}
        <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-green-500/20 rounded-2xl flex items-center justify-center text-5xl border-2 border-green-500 flex-shrink-0">
              ✓
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-black text-white mb-2">
                All Testimonials Verified
              </h3>
              <p className="text-gray-300 mb-4">
                Every testimonial is from a real client with verified project history. 
                We maintain transparency and authenticity in all our social proof.
              </p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <span className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-300 rounded-lg text-sm font-semibold">
                  ✓ Verified Clients
                </span>
                <span className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-300 rounded-lg text-sm font-semibold">
                  ✓ Real Projects
                </span>
                <span className="px-4 py-2 bg-purple-500/20 border border-purple-500 text-purple-300 rounded-lg text-sm font-semibold">
                  ✓ Authentic Reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Social Proof Matters */}
        <div className="bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-6 text-center">
            Why Social Proof Matters
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="text-white font-bold mb-2">Third-Party Validation</h4>
              <p className="text-gray-400 text-sm">
                You can say you're good, but it means more when others say it. Client testimonials carry weight.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏢</span>
              </div>
              <h4 className="text-white font-bold mb-2">Industry Recognition</h4>
              <p className="text-gray-400 text-sm">
                Working with known companies and institutions adds credibility and trust to your portfolio.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h4 className="text-white font-bold mb-2">Proven Track Record</h4>
              <p className="text-gray-400 text-sm">
                Impact stats show consistent delivery and reliability. Numbers don't lie about your capabilities.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-2xl p-8 backdrop-blur">
          <h3 className="text-3xl font-black text-white mb-4">
            Ready to Work Together?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the list of satisfied clients. Let's create something amazing for your project.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold text-lg shadow-lg shadow-orange-500/50">
            Start a Project
          </button>
        </div>
      </div>
    </div>
  );
}
