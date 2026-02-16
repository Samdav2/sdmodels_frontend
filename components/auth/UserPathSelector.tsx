'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserPath, ModellerProfile, BuyerProfile, SoftwareOption, InterestCategory } from '@/types/auth';

interface UserPathSelectorProps {
  selectedPath?: UserPath;
  onSelect: (path: UserPath) => void;
  modellerProfile?: ModellerProfile;
  buyerProfile?: BuyerProfile;
  onProfileUpdate: (profile: ModellerProfile | BuyerProfile) => void;
}

export default function UserPathSelector({
  selectedPath,
  onSelect,
  modellerProfile,
  buyerProfile,
  onProfileUpdate,
}: UserPathSelectorProps) {
  const [hoveredCard, setHoveredCard] = useState<UserPath | null>(null);

  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05, 
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    rest: { rotate: 0, scale: 1 },
    hover: { 
      rotate: 360, 
      scale: 1.2,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Title */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          Choose Your Path
        </h3>
        <p className="text-slate-400 text-sm">
          Select your role in the marketplace
        </p>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modeller Card */}
        <motion.button
          type="button"
          variants={cardVariants}
          initial="rest"
          whileHover="hover"
          animate={hoveredCard === 'modeller' ? 'hover' : 'rest'}
          onHoverStart={() => setHoveredCard('modeller')}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => onSelect('modeller')}
          className={`
            relative p-8 rounded-2xl
            bg-slate-900/40 backdrop-blur-md
            border-2 transition-all duration-300
            text-left cursor-pointer
            ${selectedPath === 'modeller'
              ? 'border-orange-500 shadow-[0_0_30px_rgba(255,107,53,0.6)]'
              : 'border-slate-600/50 hover:border-orange-500/70'
            }
          `}
          aria-label="Select Modeller path"
          aria-pressed={selectedPath === 'modeller'}
        >
          {/* Icon Container */}
          <motion.div
            variants={iconVariants}
            className="mb-6 flex justify-center"
          >
            {/* 3D Wireframe Icon */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-orange-400"
              aria-hidden="true"
            >
              {/* Wireframe Cube */}
              <motion.path
                d="M40 10 L65 25 L65 55 L40 70 L15 55 L15 25 Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={hoveredCard === 'modeller' ? {
                  pathLength: [0, 1],
                  opacity: [0.4, 1],
                } : {
                  pathLength: 1,
                  opacity: 0.8,
                }}
                transition={{ duration: 0.6 }}
              />
              {/* Inner lines */}
              <motion.line
                x1="40" y1="10" x2="40" y2="70"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={hoveredCard === 'modeller' ? {
                  pathLength: [0, 1],
                  opacity: [0.3, 0.8],
                } : {
                  pathLength: 1,
                  opacity: 0.6,
                }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
              <motion.line
                x1="15" y1="25" x2="40" y2="40"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={hoveredCard === 'modeller' ? {
                  pathLength: [0, 1],
                  opacity: [0.3, 0.8],
                } : {
                  pathLength: 1,
                  opacity: 0.6,
                }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              <motion.line
                x1="65" y1="25" x2="40" y2="40"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={hoveredCard === 'modeller' ? {
                  pathLength: [0, 1],
                  opacity: [0.3, 0.8],
                } : {
                  pathLength: 1,
                  opacity: 0.6,
                }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.line
                x1="15" y1="55" x2="40" y2="40"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={hoveredCard === 'modeller' ? {
                  pathLength: [0, 1],
                  opacity: [0.3, 0.8],
                } : {
                  pathLength: 1,
                  opacity: 0.6,
                }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
              <motion.line
                x1="65" y1="55" x2="40" y2="40"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                animate={hoveredCard === 'modeller' ? {
                  pathLength: [0, 1],
                  opacity: [0.3, 0.8],
                } : {
                  pathLength: 1,
                  opacity: 0.6,
                }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
              {/* Corner dots */}
              <motion.circle
                cx="40" cy="10" r="3"
                fill="currentColor"
                animate={hoveredCard === 'modeller' ? {
                  scale: [1, 1.5, 1],
                } : { scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.circle
                cx="65" cy="25" r="3"
                fill="currentColor"
                animate={hoveredCard === 'modeller' ? {
                  scale: [1, 1.5, 1],
                } : { scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
              <motion.circle
                cx="15" cy="25" r="3"
                fill="currentColor"
                animate={hoveredCard === 'modeller' ? {
                  scale: [1, 1.5, 1],
                } : { scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </svg>
          </motion.div>

          {/* Content */}
          <div className="text-center">
            <h4 className="text-2xl font-bold text-white mb-2">
              Modeller
            </h4>
            <p className="text-slate-300 text-sm">
              Create and sell 3D models
            </p>
          </div>

          {/* Glow Effect */}
          {selectedPath === 'modeller' && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-orange-500/10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>

        {/* Buyer Card */}
        <motion.button
          type="button"
          variants={cardVariants}
          initial="rest"
          whileHover="hover"
          animate={hoveredCard === 'buyer' ? 'hover' : 'rest'}
          onHoverStart={() => setHoveredCard('buyer')}
          onHoverEnd={() => setHoveredCard(null)}
          onClick={() => onSelect('buyer')}
          className={`
            relative p-8 rounded-2xl
            bg-slate-900/40 backdrop-blur-md
            border-2 transition-all duration-300
            text-left cursor-pointer
            ${selectedPath === 'buyer'
              ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.6)]'
              : 'border-slate-600/50 hover:border-purple-500/70'
            }
          `}
          aria-label="Select Buyer path"
          aria-pressed={selectedPath === 'buyer'}
        >
          {/* Icon Container */}
          <motion.div
            variants={iconVariants}
            className="mb-6 flex justify-center"
          >
            {/* Shopping Bag Icon */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-purple-400"
              aria-hidden="true"
            >
              {/* Bag body */}
              <motion.path
                d="M20 30 L25 65 C25 67 26 70 30 70 L50 70 C54 70 55 67 55 65 L60 30 Z"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={hoveredCard === 'buyer' ? {
                  pathLength: [0, 1],
                  opacity: [0.4, 1],
                } : {
                  pathLength: 1,
                  opacity: 0.8,
                }}
                transition={{ duration: 0.6 }}
              />
              {/* Bag top */}
              <motion.line
                x1="15" y1="30" x2="65" y2="30"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={hoveredCard === 'buyer' ? {
                  pathLength: [0, 1],
                  opacity: [0.4, 1],
                } : {
                  pathLength: 1,
                  opacity: 0.8,
                }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
              {/* Handle */}
              <motion.path
                d="M30 30 C30 20 30 15 40 15 C50 15 50 20 50 30"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                animate={hoveredCard === 'buyer' ? {
                  pathLength: [0, 1],
                  opacity: [0.4, 1],
                } : {
                  pathLength: 1,
                  opacity: 0.8,
                }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
              {/* Decorative elements */}
              <motion.circle
                cx="40" cy="45" r="2"
                fill="currentColor"
                animate={hoveredCard === 'buyer' ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                } : { scale: 1, opacity: 0.8 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.circle
                cx="35" cy="50" r="1.5"
                fill="currentColor"
                animate={hoveredCard === 'buyer' ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                } : { scale: 1, opacity: 0.8 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
              <motion.circle
                cx="45" cy="50" r="1.5"
                fill="currentColor"
                animate={hoveredCard === 'buyer' ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                } : { scale: 1, opacity: 0.8 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </svg>
          </motion.div>

          {/* Content */}
          <div className="text-center">
            <h4 className="text-2xl font-bold text-white mb-2">
              Buyer
            </h4>
            <p className="text-slate-300 text-sm">
              Discover and purchase 3D assets
            </p>
          </div>

          {/* Glow Effect */}
          {selectedPath === 'buyer' && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-purple-500/10 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      </div>

      {/* Additional Fields - Shown when a path is selected */}
      <AnimatePresence mode="wait">
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {selectedPath === 'modeller' ? (
              <ModellerFields
                profile={modellerProfile}
                onUpdate={onProfileUpdate}
              />
            ) : (
              <BuyerFields
                profile={buyerProfile}
                onUpdate={onProfileUpdate}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modeller-specific fields component
function ModellerFields({
  profile,
  onUpdate,
}: {
  profile?: ModellerProfile;
  onUpdate: (profile: ModellerProfile) => void;
}) {
  const softwareOptions: SoftwareOption[] = ['Blender', 'Maya', 'Cinema4D', 'Other'];

  const handleSoftwareChange = (software: SoftwareOption) => {
    onUpdate({
      ...profile,
      primarySoftware: software,
      customSoftware: software === 'Other' ? profile?.customSoftware : undefined,
    });
  };

  const handlePortfolioChange = (link: string) => {
    onUpdate({
      ...profile,
      primarySoftware: profile?.primarySoftware || 'Blender',
      portfolioLink: link,
    });
  };

  const handleCustomSoftwareChange = (software: string) => {
    onUpdate({
      ...profile,
      primarySoftware: 'Other',
      customSoftware: software,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-4 p-6 rounded-xl bg-slate-900/30 backdrop-blur-md border border-orange-500/30"
    >
      <h4 className="text-lg font-semibold text-orange-400 mb-4">
        Modeller Details
      </h4>

      {/* Portfolio Link */}
      <div>
        <label htmlFor="portfolio-link" className="block text-sm font-medium text-slate-300 mb-2">
          Portfolio Link <span className="text-slate-500">(optional)</span>
        </label>
        <input
          id="portfolio-link"
          type="url"
          value={profile?.portfolioLink || ''}
          onChange={(e) => handlePortfolioChange(e.target.value)}
          placeholder="https://your-portfolio.com"
          className="
            w-full px-4 py-3
            bg-slate-900/50 backdrop-blur-sm
            border-2 border-slate-600/50 rounded-lg
            text-white text-sm
            transition-all duration-200
            focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)]
            hover:border-slate-500/70
          "
          aria-label="Portfolio link"
        />
      </div>

      {/* Primary Software */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Primary Software <span className="text-orange-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {softwareOptions.map((software) => (
            <button
              key={software}
              type="button"
              onClick={() => handleSoftwareChange(software)}
              className={`
                px-4 py-3 rounded-lg
                text-sm font-medium
                transition-all duration-200
                ${profile?.primarySoftware === software
                  ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(255,107,53,0.3)]'
                  : 'bg-slate-900/50 border-2 border-slate-600/50 text-slate-300 hover:border-orange-500/50'
                }
              `}
              aria-label={`Select ${software} as primary software`}
              aria-pressed={profile?.primarySoftware === software}
            >
              {software}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Software Input */}
      <AnimatePresence>
        {profile?.primarySoftware === 'Other' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              value={profile?.customSoftware || ''}
              onChange={(e) => handleCustomSoftwareChange(e.target.value)}
              placeholder="Enter your software"
              className="
                w-full px-4 py-3
                bg-slate-900/50 backdrop-blur-sm
                border-2 border-slate-600/50 rounded-lg
                text-white text-sm
                transition-all duration-200
                focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(255,107,53,0.3)]
                hover:border-slate-500/70
              "
              aria-label="Custom software name"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Buyer-specific fields component
function BuyerFields({
  profile,
  onUpdate,
}: {
  profile?: BuyerProfile;
  onUpdate: (profile: BuyerProfile) => void;
}) {
  const interestOptions: InterestCategory[] = [
    'Gaming',
    'Architecture',
    'VR/AR',
    'Film',
    'Product Design',
  ];

  const toggleInterest = (interest: InterestCategory) => {
    const currentInterests = profile?.interests || [];
    const newInterests = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    
    onUpdate({ interests: newInterests });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-4 p-6 rounded-xl bg-slate-900/30 backdrop-blur-md border border-purple-500/30"
    >
      <h4 className="text-lg font-semibold text-purple-400 mb-4">
        Buyer Interests
      </h4>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Select your interests <span className="text-purple-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {interestOptions.map((interest) => {
            const isSelected = profile?.interests?.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`
                  px-4 py-3 rounded-lg
                  text-sm font-medium
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-900/50 border-2 border-slate-600/50 text-slate-300 hover:border-purple-500/50'
                  }
                `}
                aria-label={`Toggle ${interest} interest`}
                aria-pressed={isSelected}
              >
                {interest}
              </button>
            );
          })}
        </div>
        {profile?.interests && profile.interests.length > 0 && (
          <p className="text-xs text-slate-400 mt-2">
            {profile.interests.length} interest{profile.interests.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>
    </motion.div>
  );
}
