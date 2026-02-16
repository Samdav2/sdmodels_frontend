"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Overview", description: "The HUD" },
  { href: "/dashboard/inventory", icon: "🗂️", label: "My Inventory", description: "The Terminal" },
  { href: "/upload", icon: "⬆️", label: "Upload Portal", description: "Add Models" },
  { href: "/dashboard/financials", icon: "💰", label: "Financials", description: "The Vault" },
  { href: "/dashboard/social", icon: "👥", label: "Social Hub", description: "Reputation" },
  { href: "/dashboard/messages", icon: "💬", label: "Messages", description: "Communication" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings", description: "Neural Link" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Top Navigation */}
      <nav className="relative z-20 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center text-orange-400 hover:text-orange-300 transition"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg sm:text-xl">3D</span>
            </div>
            <h1 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              <span className="hidden sm:inline">ARTIST COMMAND CENTER</span>
              <span className="sm:hidden">COMMAND</span>
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href="/" className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              Home
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-orange-500/30 rounded-lg">
              <span className="text-sm text-slate-400">Rank:</span>
              <span className="text-sm font-bold text-orange-400">Gold Modeller</span>
            </div>
            <div className="sm:hidden w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
              🥇
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 border-r border-orange-500/20 bg-slate-900/40 backdrop-blur-xl z-10 overflow-y-auto">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`relative group flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-orange-500/20 border border-orange-500 text-orange-400"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    {/* Glow Effect */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-glow"
                        className="absolute inset-0 bg-orange-500/10 rounded-lg"
                        style={{ boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)" }}
                      />
                    )}

                    {/* Icon */}
                    <span className="text-2xl relative z-10">{item.icon}</span>

                    {/* Label */}
                    <div className="flex-1 relative z-10">
                      <div className={`text-sm font-semibold ${isActive ? "text-orange-400" : ""}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500">{item.description}</div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-l-full"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Artist Stats */}
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-950/50 border border-orange-500/30 rounded-lg">
            <div className="text-xs text-slate-400 mb-2">Quick Stats</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Sales</span>
                <span className="text-green-400 font-bold">$12,450</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Models</span>
                <span className="text-white font-bold">28</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Followers</span>
                <span className="text-orange-400 font-bold">1,240</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              />

              {/* Menu Panel */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-[57px] sm:top-[73px] h-[calc(100vh-57px)] sm:h-[calc(100vh-73px)] w-72 border-r border-orange-500/20 bg-slate-900/95 backdrop-blur-xl z-40 overflow-y-auto"
              >
                <div className="p-4 space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <div
                          className={`relative group flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                            isActive
                              ? "bg-orange-500/20 border border-orange-500 text-orange-400"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                          }`}
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className={`text-sm font-semibold ${isActive ? "text-orange-400" : ""}`}>
                              {item.label}
                            </div>
                            <div className="text-xs text-slate-500">{item.description}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Stats */}
                <div className="m-4 p-4 bg-slate-950/50 border border-orange-500/30 rounded-lg">
                  <div className="text-xs text-slate-400 mb-2">Quick Stats</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Total Sales</span>
                      <span className="text-green-400 font-bold">$12,450</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Models</span>
                      <span className="text-white font-bold">28</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Followers</span>
                      <span className="text-orange-400 font-bold">1,240</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="lg:ml-64 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
