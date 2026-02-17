"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-slate-900/50 border border-orange-500/20 rounded-2xl p-12">
          {/* 404 Icon */}
          <div className="text-9xl mb-6 animate-bounce">
            🔍
          </div>

          {/* Error Code */}
          <h1 className="text-8xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-4">
            404
          </h1>

          {/* Message */}
          <h2 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:opacity-90 transition font-bold text-lg"
            >
              🏠 Go Home
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-white rounded-xl transition font-bold text-lg"
            >
              🛒 Browse Marketplace
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-slate-700">
            <p className="text-gray-400 mb-4">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/help" className="text-orange-400 hover:text-orange-300 transition">
                Help Center
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/support" className="text-orange-400 hover:text-orange-300 transition">
                Support
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/community" className="text-orange-400 hover:text-orange-300 transition">
                Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
