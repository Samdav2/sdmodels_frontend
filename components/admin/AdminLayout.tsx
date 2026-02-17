"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: "📊", label: "Overview" },
    { href: "/admin/homepage", icon: "🏠", label: "Homepage" },
    { href: "/admin/slider", icon: "🎬", label: "Slider" },
    { href: "/admin/models", icon: "🎨", label: "Models" },
    { href: "/admin/users", icon: "👥", label: "Users" },
    { href: "/admin/communities", icon: "🏘️", label: "Communities" },
    { href: "/admin/support", icon: "💬", label: "Support" },
    { href: "/admin/bounties", icon: "💼", label: "Bounties" },
    { href: "/admin/leaderboard", icon: "🏆", label: "Leaderboard" },
    { href: "/admin/testimonials", icon: "💭", label: "Testimonials" },
    { href: "/admin/learning", icon: "📚", label: "Learning" },
    { href: "/admin/categories", icon: "📁", label: "Categories" },
    { href: "/admin/revenue", icon: "💰", label: "Revenue" },
    { href: "/admin/content", icon: "📝", label: "Content" },
    { href: "/admin/emails", icon: "📧", label: "Emails" },
    { href: "/admin/analytics", icon: "📈", label: "Analytics" },
    { href: "/admin/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Top Command Bar */}
      <div className="relative z-50 border-b-2 border-yellow-600/30 bg-slate-900/95 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  COMMAND BRIDGE
                </h1>
                <p className="text-xs text-gray-400">SuperAdmin Control Center</p>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              {/* Live Server Status */}
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-gray-400 hidden md:block">Server Online</span>
              </div>

              <Link href="/">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition text-sm">
                  Exit →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[2000px] mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="col-span-12 lg:col-span-2">
            <div className="bg-slate-900/70 backdrop-blur-xl border-2 border-yellow-600/30 rounded-2xl p-4 sticky top-24">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        pathname === item.href
                          ? "bg-gradient-to-r from-yellow-600 to-red-600 text-white shadow-lg"
                          : "text-gray-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold text-sm hidden xl:block">{item.label}</span>
                    </button>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black text-white mb-6">{title}</h2>
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
