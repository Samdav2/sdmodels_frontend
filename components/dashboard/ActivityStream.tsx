"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Model } from "@/lib/api/types";

interface Activity {
  id: number;
  type: "sale" | "review" | "upload" | "milestone";
  message: string;
  time: string;
  icon: string;
  color: string;
}

interface ActivityStreamProps {
  models: Model[];
}

export default function ActivityStream({ models }: ActivityStreamProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Generate initial activities from real model data
  useEffect(() => {
    const initialActivities: Activity[] = [];
    
    // Add activities for recent models
    models.slice(0, 3).forEach((model, index) => {
      if (model.downloads > 0) {
        initialActivities.push({
          id: Date.now() + index,
          type: "sale",
          message: `${model.title} sold for $${model.price.toFixed(2)}`,
          time: getRelativeTime(model.created_at),
          icon: "💰",
          color: "text-green-400",
        });
      }
      
      if (model.rating > 4) {
        initialActivities.push({
          id: Date.now() + index + 100,
          type: "review",
          message: `New ${model.rating.toFixed(1)}-star review on ${model.title}`,
          time: getRelativeTime(model.updated_at),
          icon: "⭐",
          color: "text-yellow-400",
        });
      }
      
      if (model.status === 'approved') {
        initialActivities.push({
          id: Date.now() + index + 200,
          type: "upload",
          message: `${model.title} approved`,
          time: getRelativeTime(model.created_at),
          icon: "✅",
          color: "text-blue-400",
        });
      }
    });

    // Add milestone if user has many models
    if (models.length >= 10) {
      initialActivities.push({
        id: Date.now() + 1000,
        type: "milestone",
        message: `Reached ${models.length} total models!`,
        time: "Recently",
        icon: "🎉",
        color: "text-orange-400",
      });
    }

    setActivities(initialActivities.slice(0, 5));
  }, [models]);

  // Helper to get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Simulate real-time activity updates
  useEffect(() => {
    if (!isLive || models.length === 0) return;

    const interval = setInterval(() => {
      // Pick a random model
      const randomModel = models[Math.floor(Math.random() * models.length)];
      const activityTypes = ["sale", "review", "upload", "milestone"];
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)] as Activity["type"];

      let newActivity: Activity;
      
      switch (randomType) {
        case "sale":
          newActivity = {
            id: Date.now(),
            type: "sale",
            message: `${randomModel.title} sold for $${randomModel.price.toFixed(2)}`,
            time: "Just now",
            icon: "💰",
            color: "text-green-400",
          };
          break;
        case "review":
          newActivity = {
            id: Date.now(),
            type: "review",
            message: `New ${(Math.random() * 2 + 3).toFixed(1)}-star review on ${randomModel.title}`,
            time: "Just now",
            icon: "⭐",
            color: "text-yellow-400",
          };
          break;
        case "upload":
          newActivity = {
            id: Date.now(),
            type: "upload",
            message: `${randomModel.title} approved`,
            time: "Just now",
            icon: "✅",
            color: "text-blue-400",
          };
          break;
        default:
          newActivity = {
            id: Date.now(),
            type: "milestone",
            message: `Reached ${models.length} total models!`,
            time: "Just now",
            icon: "🎉",
            color: "text-orange-400",
          };
      }

      setActivities((prev) => [newActivity, ...prev].slice(0, 7));
    }, 8000); // New activity every 8 seconds

    return () => clearInterval(interval);
  }, [isLive, models]);

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
