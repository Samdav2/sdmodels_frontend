'use client';

import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

interface SocialAuthButtonsProps {
  onGoogleSuccess: (credentialResponse: any) => void;
  onProviderClick: (provider: 'github' | 'metamask') => void;
  disabled?: boolean;
}

export default function SocialAuthButtons({
  onGoogleSuccess,
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
        <div className="relative px-4 bg-slate-900/40">
          <span className="text-sm text-slate-400">Or continue with</span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {/* Google Button - Custom Styled to Match Design */}
        <div className="w-full">
          <div className="relative">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => {
                console.error('Google login failed');
              }}
              useOneTap={false}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
              logo_alignment="left"
            />
            {/* Custom overlay to match our design */}
            <style jsx global>{`
              .nsm7Bb-HzV7m-LgbsSe {
                width: 100% !important;
                background: white !important;
                border: 2px solid transparent !important;
                border-radius: 0.5rem !important;
                padding: 12px 24px !important;
                font-weight: 500 !important;
                font-size: 0.875rem !important;
                transition: all 0.2s !important;
              }
              .nsm7Bb-HzV7m-LgbsSe:hover {
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.3) !important;
                border-color: rgba(255, 255, 255, 0.2) !important;
              }
            `}</style>
          </div>
        </div>

        {/* GitHub Button - Coming Soon */}
        <motion.button
          type="button"
          disabled={true}
          className="
            relative
            flex items-center justify-center gap-3
            px-6 py-3 rounded-lg
            bg-slate-800/50 text-slate-500
            border-2 border-slate-700/50
            font-medium text-sm
            cursor-not-allowed
            opacity-60
          "
          aria-label="GitHub sign in coming soon"
        >
          <GitHubIcon />
          <span>Continue with GitHub</span>
          <span className="absolute top-1 right-1 px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs rounded-full font-semibold">
            Coming Soon
          </span>
        </motion.button>

        {/* MetaMask Button - Coming Soon */}
        <motion.button
          type="button"
          disabled={true}
          className="
            relative
            flex items-center justify-center gap-3
            px-6 py-3 rounded-lg
            bg-gradient-to-r from-orange-500/30 to-orange-600/30
            text-slate-400
            border-2 border-orange-500/20
            font-medium text-sm
            cursor-not-allowed
            opacity-60
          "
          aria-label="MetaMask sign in coming soon"
        >
          <MetaMaskIcon />
          <span>Continue with MetaMask</span>
          <span className="absolute top-1 right-1 px-2 py-0.5 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs rounded-full font-semibold">
            Coming Soon
          </span>
        </motion.button>
      </div>
    </div>
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
