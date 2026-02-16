"use client";

import { motion } from "framer-motion";

const goals = [
  {
    label: "Monthly Revenue",
    current: 12450,
    target: 15000,
    unit: "$",
    color: "from-orange-500 to-red-600",
    glowColor: "rgba(255, 107, 53, 0.5)",
  },
  {
    label: "Models Sold",
    current: 342,
    target: 500,
    unit: "",
    color: "from-orange-400 to-orange-600",
    glowColor: "rgba(255, 140, 66, 0.5)",
  },
  {
    label: "New Followers",
    current: 1240,
    target: 2000,
    unit: "",
    color: "from-red-500 to-orange-500",
    glowColor: "rgba(255, 190, 98, 0.5)",
  },
];

export default function SalesGoalProgress() {
  return (
    <div className="space-y-6">
      {goals.map((goal, index) => {
        const percentage = Math.min((goal.current / goal.target) * 100, 100);
        
        return (
          <div key={index} className="space-y-2">
            {/* Label and Values */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">{goal.label}</span>
              <span className="text-sm font-mono text-slate-400">
                {goal.unit}{goal.current.toLocaleString()} / {goal.unit}{goal.target.toLocaleString()}
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="relative h-8 bg-slate-950/50 rounded-lg overflow-hidden border border-slate-700/50">
              {/* Animated Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                className={`h-full bg-gradient-to-r ${goal.color} relative`}
                style={{
                  boxShadow: `0 0 20px ${goal.glowColor}`,
                }}
              >
                {/* Neon Glow Effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{
                    animation: "shimmer 2s infinite",
                  }}
                />
              </motion.div>

              {/* Percentage Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {percentage.toFixed(0)}%
                </span>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-slate-800/30"
                  />
                ))}
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              {percentage >= 100 ? (
                <>
                  <span className="text-xs text-green-400">✓ Goal Achieved!</span>
                </>
              ) : percentage >= 75 ? (
                <>
                  <span className="text-xs text-orange-400">⚡ Almost there!</span>
                </>
              ) : (
                <>
                  <span className="text-xs text-slate-400">
                    {goal.unit}{(goal.target - goal.current).toLocaleString()} to go
                  </span>
                </>
              )}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
