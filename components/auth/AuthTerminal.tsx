'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModeToggle from './ModeToggle';
import AuthForm from './AuthForm';
import SocialAuthButtons from './SocialAuthButtons';
import UserPathSelector from './UserPathSelector';
import type { 
  AuthMode, 
  AuthState, 
  UserPath, 
  ModellerProfile, 
  BuyerProfile 
} from '@/types/auth';

interface AuthTerminalProps {
  initialMode?: AuthMode;
}

export default function AuthTerminal({ initialMode = 'login' }: AuthTerminalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [authState, setAuthState] = useState<AuthState>('idle');
  const [selectedPath, setSelectedPath] = useState<UserPath | undefined>();
  const [modellerProfile, setModellerProfile] = useState<ModellerProfile | undefined>();
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | undefined>();

  // Preserve non-sensitive data when switching modes
  const [preservedEmail, setPreservedEmail] = useState('');
  const [preservedName, setPreservedName] = useState('');

  // Handle mode toggle
  const handleModeToggle = (newMode: AuthMode) => {
    setMode(newMode);
    setAuthState('idle');
    
    // Reset user path selection when switching modes
    if (newMode === 'login') {
      setSelectedPath(undefined);
    }
  };

  // Handle auth state changes
  const handleAuthStateChange = (state: AuthState) => {
    setAuthState(state);
  };

  // Handle form submission
  const handleFormSubmit = async (formData: any) => {
    // Store non-sensitive data for preservation
    setPreservedEmail(formData.email);
    if (formData.name) {
      setPreservedName(formData.name);
    }

    // Simulate authentication (frontend only - no actual backend)
    console.log('Form submitted:', { 
      mode, 
      formData, 
      selectedPath,
      modellerProfile,
      buyerProfile 
    });

    // Simulate success after a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would redirect to dashboard or 2FA page
    // For now, just show success state
    setAuthState('success');
  };

  // Handle social auth provider clicks
  const handleProviderClick = (provider: 'google' | 'github' | 'metamask') => {
    console.log('OAuth provider clicked:', provider);
    // In a real app, this would initiate OAuth flow
    // For now, just emit event as per requirements
  };

  // Handle user path selection
  const handlePathSelect = (path: UserPath) => {
    setSelectedPath(path);
    
    // Reset profiles when switching paths
    if (path === 'modeller') {
      setBuyerProfile(undefined);
    } else {
      setModellerProfile(undefined);
    }
  };

  // Handle profile updates
  const handleProfileUpdate = (profile: ModellerProfile | BuyerProfile) => {
    if (selectedPath === 'modeller') {
      setModellerProfile(profile as ModellerProfile);
    } else {
      setBuyerProfile(profile as BuyerProfile);
    }
  };

  // Determine border color based on auth state
  const getBorderColor = () => {
    switch (authState) {
      case 'typing':
        return 'border-orange-500 shadow-[0_0_20px_rgba(255,107,53,0.5)]';
      case 'success':
        return 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]';
      case 'error':
        return 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]';
      default:
        return 'border-slate-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Glassmorphism Container */}
      <div
        className={`
          relative
          bg-slate-900/40 backdrop-blur-xl
          border-2 rounded-2xl
          p-8
          transition-all duration-300
          ${getBorderColor()}
        `}
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Mode Toggle */}
          <ModeToggle mode={mode} onToggle={handleModeToggle} />

          {/* Auth Form */}
          <AnimatePresence mode="wait">
            <AuthForm
              key={mode}
              mode={mode}
              onSubmit={handleFormSubmit}
              onAuthStateChange={handleAuthStateChange}
            />
          </AnimatePresence>

          {/* Social Auth Buttons */}
          <SocialAuthButtons
            onProviderClick={handleProviderClick}
            disabled={authState === 'success'}
          />

          {/* User Path Selector (Signup mode only) */}
          <AnimatePresence>
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 border-t border-slate-700/50">
                  <UserPathSelector
                    selectedPath={selectedPath}
                    onSelect={handlePathSelect}
                    modellerProfile={modellerProfile}
                    buyerProfile={buyerProfile}
                    onProfileUpdate={handleProfileUpdate}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {authState === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="
                  p-6 rounded-xl
                  bg-green-500/10 border-2 border-green-500/50
                  text-center
                "
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2 
                  }}
                >
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  Access Granted
                </h3>
                <p className="text-slate-300 text-sm">
                  {mode === 'login' 
                    ? 'Welcome back! Redirecting to dashboard...' 
                    : 'Account created successfully! Redirecting...'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-orange-500/20 rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-orange-500/20 rounded-br-2xl pointer-events-none" />
      </div>
    </motion.div>
  );
}
