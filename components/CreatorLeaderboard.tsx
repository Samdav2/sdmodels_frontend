"use client";

interface Creator {
  id: number;
  name: string;
  avatar: string;
  sales: number;
  badge: string;
}

interface CreatorLeaderboardProps {
  creators: Creator[];
}

export default function CreatorLeaderboard({ creators }: CreatorLeaderboardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur border border-orange-500/30 sm:border-2 rounded-xl sm:rounded-2xl p-4 sm:p-8">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-4xl font-black text-white mb-1 sm:mb-2">
          🏆 <span className="text-orange-500">Hall of Fame</span>
        </h3>
        <p className="text-gray-400 text-sm sm:text-lg">Top creators this month</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {creators.map((creator, index) => (
          <div
            key={creator.id}
            className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 rounded-lg sm:rounded-xl transition-all hover:scale-105 ${
              index === 0
                ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 sm:border-2"
                : "bg-slate-800/50 border border-orange-500/20 hover:border-orange-500/40"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
              <div className="text-2xl sm:text-4xl flex-shrink-0">{creator.badge}</div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-orange-500/50 flex-shrink-0">
                {creator.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-base sm:text-xl truncate">{creator.name}</div>
                <div className="text-orange-400 font-semibold text-sm sm:text-base">
                  {creator.sales.toLocaleString()} sales
                </div>
              </div>
            </div>

            <button className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-white transition font-semibold flex-shrink-0">
              Follow
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg sm:rounded-xl hover:from-orange-400 hover:to-red-500 transition font-bold shadow-lg shadow-orange-500/50">
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
}
