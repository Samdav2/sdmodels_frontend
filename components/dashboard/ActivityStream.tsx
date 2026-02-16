"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Activity {
  id: number;
  type: "sale" | "review" | "upload" | "milestone";
  message: string;
  time: string;
  icon: string;
  color: string;
}

const mockActivities: Activity[] = [
  {
    id: 1,
    type: "sale",
    message: "Cyberpunk Vehicle sold for $29.99",
    time: "2 min ago",
    icon: "💰",
    color: "text-green-400",
  },
  {
    id: 2,
    type: "review",
    message: "New 5-star review on Sci-Fi Character",
    time: "15 min ago",
    icon: "⭐",
    color: "text-yellow-400",
  },
  {
    id: 3,
    type: "sale",
    message: "Low Poly Tree Pack sold for $14.99",
    time: "32 min ago",
    icon: "💰",
    color: "text-green-400",
  },
  {
    id: 4,
    type: "upload",
    message: "Futuristic Weapon approved",
    time: "1 hour ago",
    icon: "✅",
    color: "text-blue-400",
  },
  {
    id: 5,
    type: "milestone",
    message: "Reached 300 total sales!",
    time: "2 hours ago",
    icon: "🎉",
    color: "text-orange-400",
  },
  {
    id: 6,
    type: "sale",
    message: "Neon City Props sold for $39.99",
    time: "3 hours ago",
    icon: "💰",
    color: "text-green-400",
  },
  {
    id: 7,
    type: "review",
    message: "New 4-star review on Mech Warrior",
    time: "4 hours ago",
    icon: "⭐",
    color: "text-yellow-400",
  },
];

export default function ActivityStream() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities.slice(0, 5));
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time activity updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Add a random activity from the mock list
      const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
      const newActivity = {
        ...randomActivity,
        id: Date.now(),
        time: "Just now",
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 6)]);
    }, 8000); // New activity every 8 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-4">
      {/* Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span className="text-xs text-green-400 font-medium">LIVE</span>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="text-xs text-slate-400 hover:text-orange-400 transition"
        >
          {isLive ? "Pause" : "Resume"}
        </button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/50 border border-slate-700/50 hover:border-orange-500/50 transition"
            >
              {/* Icon */}
              <div className="text-2xl flex-shrink-0">{activity.icon}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${activity.color} font-medium truncate`}>
                  {activity.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>

              {/* Type Badge */}
              <div className="flex-shrink-0">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50">
                  {activity.type}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 107, 53, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 107, 53, 0.5);
        }
      `}</style>
    </div>
  );
}
