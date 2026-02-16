'use client';

import { motion } from 'framer-motion';
import { calculatePasswordStrength } from '@/lib/auth/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

type StrengthLevel = 'weak' | 'medium' | 'strong';

interface StrengthConfig {
  label: string;
  color: string;
  barColor: string;
  glowColor: string;
  width: string;
}

const strengthConfigs: Record<StrengthLevel, StrengthConfig> = {
  weak: {
    label: 'Weak',
    color: 'text-red-400',
    barColor: 'bg-red-500',
    glowColor: 'shadow-[0_0_10px_rgba(239,68,68,0.6)]',
    width: '33.33%',
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-400',
    barColor: 'bg-yellow-500',
    glowColor: 'shadow-[0_0_10px_rgba(234,179,8,0.6)]',
    width: '66.66%',
  },
  strong: {
    label: 'Strong',
    color: 'text-green-400',
    barColor: 'bg-green-500',
    glowColor: 'shadow-[0_0_10px_rgba(34,197,94,0.6)]',
    width: '100%',
  },
};

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  // Don't show indicator if password is empty
  if (!password || password.length === 0) {
    return null;
  }

  const score = calculatePasswordStrength(password);
  
  // Determine strength level based on score
  let strengthLevel: StrengthLevel;
  if (score <= 2) {
    strengthLevel = 'weak';
  } else if (score === 3) {
    strengthLevel = 'medium';
  } else {
    strengthLevel = 'strong';
  }

  const config = strengthConfigs[strengthLevel];

  return (
    <div className="w-full mt-3 space-y-2" role="status" aria-live="polite">
      {/* Progress Bar Container */}
      <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
        {/* Animated Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: config.width }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
          className={`h-full ${config.barColor} ${config.glowColor} rounded-full`}
        />
      </div>

      {/* Strength Label */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between text-sm"
      >
        <span className={`font-medium ${config.color} drop-shadow-[0_0_6px_currentColor]`}>
          Password Strength: {config.label}
        </span>
        
        {/* Score Indicator */}
        <span className="text-slate-400 text-xs font-mono">
          {score}/6
        </span>
      </motion.div>
    </div>
  );
}
