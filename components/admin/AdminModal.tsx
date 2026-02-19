"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message?: string;
  type?: "alert" | "confirm" | "prompt";
  confirmText?: string;
  cancelText?: string;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  variant?: "danger" | "warning" | "success" | "info";
}

export default function AdminModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "alert",
  confirmText = "OK",
  cancelText = "Cancel",
  inputPlaceholder = "",
  inputValue = "",
  onInputChange,
  variant = "info",
}: AdminModalProps) {
  const [localValue, setLocalValue] = useState(inputValue);

  useEffect(() => {
    setLocalValue(inputValue);
  }, [inputValue]);

  const handleConfirm = () => {
    if (type === "prompt" && onInputChange) {
      onInputChange(localValue);
    }
    onConfirm?.();
    onClose();
  };

  const variantColors = {
    danger: {
      border: "border-red-600/50",
      bg: "from-red-600 to-red-700",
      icon: "🚨",
    },
    warning: {
      border: "border-yellow-600/50",
      bg: "from-yellow-600 to-orange-600",
      icon: "⚠️",
    },
    success: {
      border: "border-green-600/50",
      bg: "from-green-600 to-emerald-600",
      icon: "✅",
    },
    info: {
      border: "border-blue-600/50",
      bg: "from-blue-600 to-cyan-600",
      icon: "ℹ️",
    },
  };

  const colors = variantColors[variant];

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`bg-slate-900 border-2 ${colors.border} rounded-2xl p-6 max-w-md w-full shadow-2xl`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{colors.icon}</span>
                <h3 className="text-2xl font-black text-white">{title}</h3>
              </div>

              {/* Message */}
              {message && (
                <p className="text-gray-300 mb-6">{message}</p>
              )}

              {/* Input for prompt type */}
              {type === "prompt" && (
                <input
                  type="text"
                  value={localValue}
                  onChange={(e) => setLocalValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none mb-6"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConfirm();
                    if (e.key === "Escape") onClose();
                  }}
                />
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {type !== "alert" && (
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-3 bg-gradient-to-r ${colors.bg} text-white rounded-lg font-semibold hover:opacity-90 transition`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for easier usage
export function useAdminModal() {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message?: string;
    type: "alert" | "confirm" | "prompt";
    variant: "danger" | "warning" | "success" | "info";
    inputValue?: string;
    onConfirm?: (value?: string) => void;
  }>({
    isOpen: false,
    title: "",
    type: "alert",
    variant: "info",
  });

  const showAlert = (title: string, message?: string, variant: "danger" | "warning" | "success" | "info" = "info") => {
    return new Promise<void>((resolve) => {
      setModal({
        isOpen: true,
        title,
        message,
        type: "alert",
        variant,
        onConfirm: () => resolve(),
      });
    });
  };

  const showConfirm = (title: string, message?: string, variant: "danger" | "warning" | "success" | "info" = "warning") => {
    return new Promise<boolean>((resolve) => {
      setModal({
        isOpen: true,
        title,
        message,
        type: "confirm",
        variant,
        onConfirm: () => resolve(true),
      });
    });
  };

  const showPrompt = (title: string, placeholder?: string, defaultValue?: string, variant: "danger" | "warning" | "success" | "info" = "info") => {
    return new Promise<string | null>((resolve) => {
      setModal({
        isOpen: true,
        title,
        type: "prompt",
        variant,
        inputValue: defaultValue || "",
        onConfirm: (value) => resolve(value || null),
      });
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    // Call onConfirm with undefined if modal is closed without confirming
    if (modal.type === "confirm") {
      modal.onConfirm?.(undefined);
    } else if (modal.type === "prompt") {
      modal.onConfirm?.(undefined);
    }
  };

  const handleConfirm = (value?: string) => {
    modal.onConfirm?.(value);
    closeModal();
  };

  return {
    modal,
    showAlert,
    showConfirm,
    showPrompt,
    closeModal,
    handleConfirm,
    AdminModalComponent: (
      <AdminModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={() => handleConfirm(modal.inputValue)}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        variant={modal.variant}
        inputValue={modal.inputValue}
        onInputChange={(value) => setModal((prev) => ({ ...prev, inputValue: value }))}
      />
    ),
  };
}
