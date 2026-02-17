"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    marketplace: [
      { name: "Browse Models", href: "/marketplace" },
      { name: "Categories", href: "/marketplace?view=categories" },
      { name: "Featured", href: "/marketplace?filter=featured" },
      { name: "Free Assets", href: "/marketplace?filter=free" },
      { name: "New Releases", href: "/marketplace?sort=newest" },
    ],
    creators: [
      { name: "Start Selling", href: "/upload" },
      { name: "Creator Dashboard", href: "/dashboard" },
      { name: "Pricing Plans", href: "/pricing" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Bounties", href: "/bounties" },
    ],
    community: [
      { name: "Communities", href: "/community" },
      { name: "Blog", href: "/blog" },
      { name: "Learning Center", href: "/learn" },
      { name: "Support", href: "/support" },
      { name: "Testimonials", href: "/testimonials" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Roadmap", href: "/roadmap" },
      { name: "Careers", href: "/about#careers" },
      { name: "Contact", href: "/support" },
      { name: "Press Kit", href: "/about#press" },
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "DMCA Policy", href: "/dmca" },
      { name: "Help Center", href: "/help" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: "𝕏", href: "https://twitter.com/sdmodels", color: "hover:text-blue-400" },
    { name: "Discord", icon: "💬", href: "https://discord.gg/sdmodels", color: "hover:text-purple-400" },
    { name: "Instagram", icon: "📷", href: "https://instagram.com/sdmodels", color: "hover:text-pink-400" },
    { name: "YouTube", icon: "▶️", href: "https://youtube.com/@sdmodels", color: "hover:text-red-400" },
    { name: "GitHub", icon: "⚡", href: "https://github.com/sdmodels", color: "hover:text-gray-400" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t-2 border-orange-500/30 shadow-[0_-10px_50px_rgba(255,107,53,0.1)]">
      {/* Decorative top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6 mb-12">
          {/* Brand Column - Full width on mobile */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl">SD</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                SDModels
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              The next-generation 3D marketplace for creators and developers. Buy, sell, and preview premium 3D assets in real-time.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all hover:scale-110 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="text-orange-400">🛒</span>
              Marketplace
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition text-sm block hover:translate-x-1 duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="text-orange-400">🎨</span>
              Creators
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.creators.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition text-sm block hover:translate-x-1 duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="col-span-1">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <span className="text-orange-400">👥</span>
              Community
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition text-sm block hover:translate-x-1 duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal - Combined on mobile */}
          <div className="col-span-2 md:col-span-1 space-y-8 md:space-y-0">
            {/* Company */}
            <div className="mb-8 md:mb-0">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <span className="text-orange-400">🏢</span>
                Company
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-400 transition text-sm block hover:translate-x-1 duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal - Show on mobile */}
            <div className="md:hidden">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <span className="text-orange-400">⚖️</span>
                Legal
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-400 transition text-sm block hover:translate-x-1 duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12 p-6 sm:p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2">
                🚀 Stay Updated
              </h3>
              <p className="text-gray-300 text-sm">
                Get the latest models, updates, and exclusive deals delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none w-full sm:w-64 backdrop-blur-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all font-semibold whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} SDModels. All rights reserved. Made with ❤️ for creators worldwide.
            </div>
            
            {/* Legal Links - Desktop only */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              {footerLinks.legal.slice(0, 4).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-orange-400 transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Platform Fee Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg backdrop-blur-sm">
              <span className="text-green-400 text-xs font-bold">✓</span>
              <span className="text-gray-300 text-xs font-semibold">Only 7.5% Fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
    </footer>
  );
}
