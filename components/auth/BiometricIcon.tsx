'use client';

import { motion } from 'framer-motion';

interface BiometricIconProps {
  isScanning?: boolean;
  onScanComplete?: () => void;
}

export default function BiometricIcon({
  isScanning = false,
  onScanComplete,
}: BiometricIconProps) {
  const biometricVariants = {
    idle: { 
      scale: 1, 
      opacity: 0.6,
    },
    scanning: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 1, 0.6],
    }
  };

  return (
    <motion.div
      className="relative flex items-center justify-center"
      variants={biometricVariants}
      animate={isScanning ? 'scanning' : 'idle'}
      transition={isScanning ? {
        duration: 1.5,
        repeat: 2,
        ease: 'easeInOut',
      } : undefined}
      onAnimationComplete={() => {
        if (isScanning && onScanComplete) {
          onScanComplete();
        }
      }}
    >
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={isScanning ? {
          boxShadow: [
            '0 0 20px rgba(255,107,53,0.3)',
            '0 0 40px rgba(255,107,53,0.6)',
            '0 0 20px rgba(255,107,53,0.3)',
          ],
        } : {
          boxShadow: '0 0 10px rgba(255,107,53,0.2)',
        }}
        transition={{
          duration: 1.5,
          repeat: isScanning ? 2 : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Fingerprint SVG Icon */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        aria-hidden="true"
      >
        {/* Fingerprint ridges - futuristic style */}
        <motion.path
          d="M24 8C15.163 8 8 15.163 8 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M12 24C12 17.373 17.373 12 24 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.1,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M16 24C16 19.582 19.582 16 24 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.2,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M20 24C20 21.791 21.791 20 24 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.3,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
        
        {/* Right side arcs */}
        <motion.path
          d="M24 8C32.837 8 40 15.163 40 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.4,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M36 24C36 17.373 30.627 12 24 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.5,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M32 24C32 19.582 28.418 16 24 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.6,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M28 24C28 21.791 26.209 20 24 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.7,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Bottom arcs */}
        <motion.path
          d="M8 24C8 32.837 15.163 40 24 40"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.8,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M40 24C40 32.837 32.837 40 24 40"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-orange-400"
          animate={isScanning ? {
            pathLength: [0, 1],
            opacity: [0.4, 1, 0.4],
          } : {
            pathLength: 1,
            opacity: 0.6,
          }}
          transition={{
            duration: 1.5,
            delay: 0.9,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Center dot */}
        <motion.circle
          cx="24"
          cy="24"
          r="2"
          fill="currentColor"
          className="text-orange-400"
          animate={isScanning ? {
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          } : {
            scale: 1,
            opacity: 0.8,
          }}
          transition={{
            duration: 1.5,
            repeat: isScanning ? 2 : 0,
            ease: 'easeInOut',
          }}
        />
      </svg>

      {/* Scanning Line Effect */}
      {isScanning && (
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
            style={{ left: 0, right: 0 }}
            animate={{
              top: ['0%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: 2,
              ease: 'linear',
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
