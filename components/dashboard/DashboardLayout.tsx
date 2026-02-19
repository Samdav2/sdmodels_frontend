"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { useDashboardStats } from "@/lib/api/hooks/useDashboard";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface UserData {
  name: string;
  username: string;
  email: string;
}

const navItems = [
  { href: "/dashboard", icon: "📊", label: "Overview" },
  { href: "/dashboard/inventory", icon: "🗂️", label: "Inventory" },
  { href: "/upload", icon: "⬆️", label: "Upload" },
  { href: "/dashboard/financials", icon: "💰", label: "Financials" },
  { href: "/dashboard/social", icon: "👥", label: "Social" },
  { href: "/dashboard/messages", icon: "💬", label: "Messages" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  
  const { stats } = useDashboardStats();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          setUserData({
            name: parsed.full_name || parsed.name || parsed.username || 'User',
            username: parsed.username || 'user',
            email: parsed.email || ''
          });
        }

        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch('/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const userData = {
            name: data.full_name || data.username || 'User',
            username: data.username || 'user',
            email: data.email || ''
          };
          setUserData(userData);
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getFirstName = (fullName?: string) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  // Check if current page is dashboard home
  const isDashboardHome = pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-orange-500/20">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
              SD
            </div>
            <span className="font-black text-white">SDModels</span>
          </Link>
          
          <button
            onClick={handleSignOut}
            className="p-2 text-red-400 hover:text-red-300 transition"
            title="Sign Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 border-r border-orange-500/20 bg-slate-900/50 backdrop-blur-xl min-h-screen sticky top-0">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-black">
                SD
              </div>
              <div>
                <div className="font-black text-white text-lg">SDModels</div>
                <div className="text-xs text-slate-400">Creator Dashboard</div>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                {userData?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">
                  {getFirstName(userData?.name)}
                </div>
                <div className="text-xs text-slate-400 truncate">
                  @{userData?.username}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-400">Models</div>
                <div className="text-sm font-bold text-white">{stats?.total_models || 0}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-400">Sales</div>
                <div className="text-sm font-bold text-orange-400">${stats?.total_sales?.toFixed(0) || 0}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-400">Followers</div>
                <div className="text-sm font-bold text-white">{stats?.followers_count || 0}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition group ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
            >
              <span className="text-xl">🚪</span>
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Page Header with Back Button */}
          {!isDashboardHome && (
            <div className="sticky top-0 lg:top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-orange-400 transition group"
                >
                  <svg
                    className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Horizontally Scrollable */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-xl border-t border-orange-500/20 shadow-lg">
        <div 
          className="flex gap-1 px-2 py-2 overflow-x-auto scrollbar-hide scroll-smooth"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            if (target.scrollLeft > 10) {
              setShowScrollHint(false);
            }
          }}
        >
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition flex-shrink-0 relative ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-medium whitespace-nowrap">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/50"></div>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Animated Scroll Hint Line */}
        {showScrollHint && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-shimmer"></div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-[72px]"></div>
    </div>
  );
}
