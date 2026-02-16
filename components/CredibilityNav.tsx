'use client';

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CredibilityNav() {
  const [isOpen, setIsOpen] = useState(false);

  const credibilityPages = [
    { name: "Process Vault", href: "/process", icon: "🔬", description: "Case studies & workflows" },
    { name: "Hall of Mastery", href: "/mastery", icon: "🏆", description: "Skills & certifications" },
    { name: "Learning Nexus", href: "/learn", icon: "📚", description: "Tutorials & guides" },
    { name: "Testimonials", href: "/testimonials", icon: "💬", description: "Client reviews" },
    { name: "Roadmap", href: "/roadmap", icon: "🗺️", description: "Upcoming projects" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition flex items-center gap-1"
      >
        More
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              onMouseEnter={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border-2 border-orange-500/50 rounded-xl shadow-2xl z-50"
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="p-2">
                {credibilityPages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    onClick={() => setIsOpen(false)}
                    className="block p-3 rounded-lg hover:bg-orange-500/20 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {page.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white group-hover:text-orange-400 transition">
                          {page.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {page.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-orange-500/30 p-3 bg-orange-500/10">
                <div className="text-xs text-center text-orange-300">
                  Explore our credibility pages
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
