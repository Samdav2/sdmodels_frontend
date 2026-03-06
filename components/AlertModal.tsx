import { motion, AnimatePresence } from "framer-motion";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  buttonText?: string;
}

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  buttonText = "OK"
}: AlertModalProps) {
  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "from-green-500/20 to-emerald-600/20",
          border: "border-green-500/50",
          button: "from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500",
          icon: "text-green-400",
          iconPath: "M5 13l4 4L19 7"
        };
      case "error":
        return {
          bg: "from-red-500/20 to-red-600/20",
          border: "border-red-500/50",
          button: "from-red-500 to-red-600 hover:from-red-400 hover:to-red-500",
          icon: "text-red-400",
          iconPath: "M6 18L18 6M6 6l12 12"
        };
      case "warning":
        return {
          bg: "from-yellow-500/20 to-orange-600/20",
          border: "border-yellow-500/50",
          button: "from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500",
          icon: "text-yellow-400",
          iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        };
      case "info":
        return {
          bg: "from-blue-500/20 to-blue-600/20",
          border: "border-blue-500/50",
          button: "from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500",
          icon: "text-blue-400",
          iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        };
    }
  };

  const colors = getColors();

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`bg-gradient-to-br ${colors.bg} backdrop-blur-xl border-2 ${colors.border} rounded-2xl p-6 max-w-md w-full shadow-2xl`}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                  <svg className={`w-8 h-8 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={colors.iconPath} />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {title}
              </h3>

              {/* Message */}
              <p className="text-slate-300 text-center mb-6">
                {message}
              </p>

              {/* Button */}
              <button
                onClick={onClose}
                className={`w-full px-4 py-3 bg-gradient-to-r ${colors.button} text-white rounded-lg transition font-semibold shadow-lg`}
              >
                {buttonText}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
