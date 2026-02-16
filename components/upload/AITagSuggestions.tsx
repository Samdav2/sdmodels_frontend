"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AITagSuggestionsProps {
  fileName: string;
  onTagsChange: (tags: string[]) => void;
}

// Mock AI tag suggestions based on filename
const generateTagSuggestions = (fileName: string): string[] => {
  const allTags = [
    "Cyberpunk",
    "Sci-Fi",
    "Vehicle",
    "Character",
    "Low Poly",
    "PBR",
    "Game Ready",
    "Rigged",
    "Animated",
    "Futuristic",
    "Weapon",
    "Props",
    "Environment",
    "Architecture",
    "Fantasy",
    "Realistic",
    "Stylized",
    "Mech",
    "Robot",
    "Urban",
  ];

  // Simple keyword matching
  const keywords = fileName.toLowerCase();
  const suggested = allTags.filter((tag) =>
    keywords.includes(tag.toLowerCase().replace(" ", ""))
  );

  // Add random suggestions if not enough matches
  while (suggested.length < 8) {
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!suggested.includes(randomTag)) {
      suggested.push(randomTag);
    }
  }

  return suggested.slice(0, 8);
};

export default function AITagSuggestions({ fileName, onTagsChange }: AITagSuggestionsProps) {
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const tags = generateTagSuggestions(fileName);
      setSuggestedTags(tags);
      setIsAnalyzing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [fileName]);

  useEffect(() => {
    onTagsChange(selectedTags);
  }, [selectedTags, onTagsChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  return (
    <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🤖</span>
        <h2 className="text-xl font-bold text-white">AI Tag Suggestions</h2>
      </div>

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"
          />
          <span className="text-sm text-slate-400">Analyzing your model...</span>
        </div>
      )}

      {/* Suggested Tags */}
      {!isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <div className="text-sm text-slate-400 mb-3">Suggested Tags:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag, index) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isSelected
                        ? "bg-orange-500/20 border-2 border-orange-500 text-orange-400"
                        : "bg-slate-950/50 border-2 border-slate-700/50 text-slate-300 hover:border-orange-500/50"
                    }`}
                  >
                    {tag}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Custom Tag Input */}
          <div>
            <div className="text-sm text-slate-400 mb-3">Add Custom Tag:</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
                placeholder="Enter custom tag..."
                className="flex-1 px-4 py-2 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 transition"
              />
              <button
                onClick={addCustomTag}
                className="px-6 py-2 bg-orange-500/20 border-2 border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Tags */}
          <AnimatePresence>
            {selectedTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="text-sm text-slate-400 mb-3">
                  Selected Tags ({selectedTags.length}):
                </div>
                <div className="flex flex-wrap gap-2 p-4 bg-slate-950/50 border border-slate-700/50 rounded-lg">
                  {selectedTags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500 rounded-full"
                    >
                      <span className="text-sm text-orange-400">{tag}</span>
                      <button
                        onClick={() => toggleTag(tag)}
                        className="text-orange-400 hover:text-orange-300 transition"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info */}
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <p className="text-xs text-slate-300">
              💡 Tags help buyers discover your model. Add 3-10 relevant tags for best results.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
