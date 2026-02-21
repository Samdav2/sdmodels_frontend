"use client";

import { motion, AnimatePresence } from "framer-motion";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText,
  onConfirm,
}: UploadModalProps) {
  const icons = {
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    success: "✅",
  };

  const colors = {
    error: "from-red-500 to-red-600",
    warning: "from-yellow-500 to-orange-600",
    info: "from-blue-500 to-blue-600",
    success: "from-green-500 to-emerald-600",
  };

  const borderColors = {
    error: "border-red-500",
    warning: "border-yellow-500",
    info: "border-blue-500",
    success: "border-green-500",
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={`relative bg-slate-900 border-2 ${borderColors[type]} rounded-2xl p-6 max-w-md w-full shadow-2xl`}
          >
            {/* Icon */}
            <div className="text-center mb-4">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${colors[type]} rounded-full flex items-center justify-center mx-auto mb-3`}
              >
                <span className="text-3xl">{icons[type]}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              {cancelText && (
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
                >
                  {cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${colors[type]} text-white rounded-lg hover:opacity-90 transition font-semibold shadow-lg`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
