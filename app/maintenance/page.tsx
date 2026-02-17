"use client";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-slate-900/50 border border-orange-500/20 rounded-2xl p-12">
          {/* Maintenance Icon */}
          <div className="text-9xl mb-6 animate-pulse">
            🔧
          </div>

          {/* Title */}
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-4">
            Under Maintenance
          </h1>

          {/* Message */}
          <h2 className="text-2xl font-bold text-white mb-4">
            We'll Be Back Soon!
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            We're currently performing scheduled maintenance to improve your experience. We'll be back online shortly.
          </p>

          {/* Status Updates */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
            <h3 className="text-white font-bold mb-4">📊 Maintenance Status</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database Optimization</span>
                <span className="text-green-400">✓ Complete</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Server Updates</span>
                <span className="text-yellow-400">⏳ In Progress</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Testing & Verification</span>
                <span className="text-gray-500">⏸ Pending</span>
              </div>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mb-8">
            <p className="text-orange-400 font-bold mb-2">⏰ Estimated Completion</p>
            <p className="text-white text-2xl font-black">2 Hours</p>
          </div>

          {/* Social Links */}
          <div className="pt-8 border-t border-slate-700">
            <p className="text-gray-400 mb-4">Stay updated:</p>
            <div className="flex justify-center gap-4">
              <a href="https://twitter.com/hwc3d" className="text-blue-400 hover:text-blue-300 transition">
                Twitter
              </a>
              <span className="text-gray-600">•</span>
              <a href="https://discord.gg/hwc3d" className="text-purple-400 hover:text-purple-300 transition">
                Discord
              </a>
              <span className="text-gray-600">•</span>
              <a href="mailto:support@hwc3d.com" className="text-orange-400 hover:text-orange-300 transition">
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
