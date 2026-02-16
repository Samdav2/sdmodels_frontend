'use client';

import { motion } from 'framer-motion';

interface SocialAuthButtonsProps {
  onProviderClick: (provider: 'google' | 'github' | 'metamask') => void;
  disabled?: boolean;
}

export default function SocialAuthButtons({
  onProviderClick,
  disabled = false,
}: SocialAuthButtonsProps) {
  return (
    <div className="w-full space-y-4">
      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600/50" />
        </div>
        <div className="relative px-4 bg-transparent">
          <span className="text-sm text-slate-400">Or continue with</span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {/* Google Button */}
        <motion.button
          type="button"
          onClick={() => onProviderClick('google')}
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className={`
            flex items-center justify-center gap-3
            px-6 py-3 rounded-lg
            bg-white text-gray-700
            border-2 border-transparent
            font-medium text-sm
            transition-all duration-200
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:border-white/20'
            }
          `}
          aria-label="Sign in with Google"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </motion.button>

        {/* GitHub Button */}
        <motion.button
          type="button"
          onClick={() => onProviderClick('github')}
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className={`
            flex items-center justify-center gap-3
            px-6 py-3 rounded-lg
            bg-slate-800 text-white
            border-2 border-slate-700
            font-medium text-sm
            transition-all duration-200
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-slate-700 hover:shadow-[0_0_20px_rgba(100,116,139,0.4)] hover:border-slate-600'
            }
          `}
          aria-label="Sign in with GitHub"
        >
          <GitHubIcon />
          <span>Continue with GitHub</span>
        </motion.button>

        {/* MetaMask Button */}
        <motion.button
          type="button"
          onClick={() => onProviderClick('metamask')}
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          className={`
            flex items-center justify-center gap-3
            px-6 py-3 rounded-lg
            bg-gradient-to-r from-orange-500 to-orange-600
            text-white
            border-2 border-transparent
            font-medium text-sm
            transition-all duration-200
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:from-orange-600 hover:to-orange-700 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:border-orange-400/30'
            }
          `}
          aria-label="Sign in with MetaMask"
        >
          <MetaMaskIcon />
          <span>Continue with MetaMask</span>
        </motion.button>
      </div>
    </div>
  );
}

// Google Icon Component
function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
        fill="#34A853"
      />
      <path
        d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z"
        fill="#EA4335"
      />
    </svg>
  );
}

// GitHub Icon Component
function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.165 20 14.418 20 10c0-5.523-4.477-10-10-10z"
      />
    </svg>
  );
}

// MetaMask Icon Component
function MetaMaskIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Simplified MetaMask Fox Icon */}
      <path
        d="M18 3L11 8.5L12.3 5.5L18 3Z"
        fill="#E17726"
        stroke="#E17726"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 3L8.9 8.55L7.7 5.5L2 3Z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 13.5L13.8 16.2L17.6 17.2L18.6 13.6L15.5 13.5Z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.4 13.6L2.4 17.2L6.2 16.2L4.5 13.5L1.4 13.6Z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9.5L4.9 11.2L8.7 11.4L8.6 7.3L6 9.5Z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 9.5L11.3 7.2L11.2 11.4L15 11.2L14 9.5Z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 16.2L8.4 15.1L6.5 13.6L6.2 16.2Z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.6 15.1L13.8 16.2L13.5 13.6L11.6 15.1Z"
        fill="#E27625"
        stroke="#E27625"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8 16.2L11.6 15.1L11.8 16.8L11.8 17.1L13.8 16.2Z"
        fill="#D5BFB2"
        stroke="#D5BFB2"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 16.2L8.2 17.1L8.2 16.8L8.4 15.1L6.2 16.2Z"
        fill="#D5BFB2"
        stroke="#D5BFB2"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12L9.8 11.4L8.5 11L10 12Z"
        fill="#233447"
        stroke="#233447"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12L11.5 11L10.2 11.4L10 12Z"
        fill="#233447"
        stroke="#233447"
        strokeWidth="0.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
