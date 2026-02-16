"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export type NotificationType = "success" | "error" | "info" | "warning" | "recording" | "exporting";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message: string;
  progress?: number; // 0-100 for progress bar
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  }>;
  autoClose?: number; // milliseconds
}

export default function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  progress,
  actions,
  autoClose,
}: NotificationModalProps) {
  
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: "✅",
          gradient: "from-green-500 to-emerald-500",
          border: "border-green-500/50",
          bg: "bg-green-500/10",
        };
      case "error":
        return {
          icon: "❌",
          gradient: "from-red-500 to-pink-500",
          border: "border-red-500/50",
          bg: "bg-red-500/10",
        };
      case "warning":
        return {
          icon: "⚠️",
          gradient: "from-yellow-500 to-orange-500",
          border: "border-yellow-500/50",
          bg: "bg-yellow-500/10",
        };
      case "recording":
        return {
          icon: "🎥",
          gradient: "from-red-500 to-pink-500",
          border: "border-red-500/50",
          bg: "bg-red-500/10",
        };
      case "exporting":
        return {
          icon: "💾",
          gradient: "from-blue-500 to-cyan-500",
          border: "border-blue-500/50",
          bg: "bg-blue-500/10",
        };
      default:
        return {
          icon: "ℹ️",
          gradient: "from-blue-500 to-cyan-500",
          border: "border-blue-500/50",
          bg: "bg-blue-500/10",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-2 ${styles.border} rounded-2xl shadow-2xl overflow-hidden`}
            >
              {/* Header */}
              <div className={`${styles.bg} border-b ${styles.border} p-6`}>
                <div className="flex items-start gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="text-5xl"
                  >
                    {styles.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-black bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent mb-2`}>
                      {title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {message}
                    </p>
                  </div>
                  {!progress && (
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-white transition text-2xl"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {progress !== undefined && (
                <div className="px-6 pt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-bold">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full bg-gradient-to-r ${styles.gradient}`}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              {actions && actions.length > 0 && (
                <div className="p-6 flex gap-3">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
                        action.variant === "primary"
                          ? `bg-gradient-to-r ${styles.gradient} text-white hover:opacity-90`
                          : action.variant === "danger"
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Auto-close indicator */}
              {autoClose && !progress && (
                <div className="px-6 pb-4">
                  <div className="text-xs text-gray-500 text-center">
                    Auto-closing in {Math.ceil(autoClose / 1000)}s...
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
