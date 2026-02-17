"use client";

import Link from "next/link";
import { useState } from "react";
import { useNotifications } from "@/lib/api/hooks/useNotifications";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'purchases' | 'follows'>('all');
  
  const { notifications: apiNotifications, loading, error, markAllAsRead } = useNotifications();
  
  const notifications = apiNotifications.map(n => ({
    id: n.id,
    type: n.type,
    user: "User",
    avatar: "🔔",
    text: n.message,
    model: n.title,
    time: new Date(n.created_at).toLocaleString(),
    read: n.is_read,
  }));

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group">
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold">Dashboard</span>
          </Link>
          <button className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition text-sm font-semibold">
            Mark All Read
          </button>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-4xl font-black text-white mb-8">Notifications</h1>

        <div className="bg-slate-900/50 border border-orange-500/20 rounded-xl p-6">
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {(['all', 'likes', 'comments', 'purchases', 'follows'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition capitalize ${filter === f ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-slate-800 text-gray-400'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((notif) => (
              <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl border transition ${notif.read ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-800/50 border-orange-500/30'}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">{notif.avatar}</div>
                <div className="flex-1">
                  <p className="text-white">
                    <span className="font-bold">{notif.user}</span> {notif.text} {notif.model && <span className="text-orange-400">{notif.model}</span>}
                  </p>
                  <span className="text-gray-400 text-sm">{notif.time}</span>
                </div>
                {!notif.read && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
