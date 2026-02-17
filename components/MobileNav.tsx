"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Prevent body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Browse", href: "/browse", icon: "🔍" },
    { name: "About", href: "/about", icon: "ℹ️" },
    { name: "Bounties", href: "/bounties", icon: "💼" },
    { name: "Leaderboard", href: "/leaderboard", icon: "🏆" },
    { name: "Process Vault", href: "/process", icon: "🔬" },
    { name: "Hall of Mastery", href: "/mastery", icon: "🎓" },
    { name: "Learning Nexus", href: "/learn", icon: "📚" },
    { name: "Testimonials", href: "/testimonials", icon: "💬" },
    { name: "Roadmap", href: "/roadmap", icon: "🗺️" },
    { name: "Community", href: "/community", icon: "👥" },
    { name: "Blog", href: "/blog", icon: "📝" },
    { name: "Support", href: "/support", icon: "🆘" },
  ];

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-slate-900 border-l-2 border-orange-500/50 shadow-2xl z-[10002] overflow-y-auto overflow-x-hidden"
            style={{ maxHeight: '100dvh' }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 backdrop-blur-xl border-b border-orange-500/30 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
                  <span className="text-white font-bold text-sm">SD</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  SDModels
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="p-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span className="text-white font-medium group-hover:text-orange-400 transition-colors">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="p-4 border-t border-orange-500/30">
              <button
                onClick={() => {
                  const isAuthenticated = localStorage.getItem('access_token');
                  window.location.href = isAuthenticated ? '/upload' : '/auth';
                  setIsOpen(false);
                }}
                className="block w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition-all font-semibold text-center shadow-lg shadow-orange-500/50"
              >
                Start Selling
              </button>
            </div>

            {/* Footer Info */}
            <div className="p-4 text-center text-xs text-gray-400">
              <p>© 2026 SDModels</p>
              <p className="mt-1">Premium 3D Marketplace</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 text-orange-400 hover:text-orange-300 transition-colors z-[10000] relative"
        aria-label="Toggle menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-full h-0.5 bg-current transition-all origin-left"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-full h-0.5 bg-current transition-all"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-full h-0.5 bg-current transition-all origin-left"
          />
        </div>
      </button>

      {/* Render menu in portal at body level */}
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}
