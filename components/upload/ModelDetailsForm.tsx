"use client";

import { memo, useState, useEffect, useRef } from "react";

interface ModelDetailsFormProps {
  initialData: {
    name: string;
    price: string;
    description: string;
    category: string;
  };
  onFormDataChange: (data: { name: string; price: string; description: string; category: string }) => void;
}

const ModelDetailsForm = memo(function ModelDetailsForm({
  initialData,
  onFormDataChange,
}: ModelDetailsFormProps) {
  // Completely independent local state - never updated from props
  const [name, setName] = useState(initialData.name);
  const [price, setPrice] = useState(initialData.price);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category);

  // Use ref to avoid re-render loops
  const onFormDataChangeRef = useRef(onFormDataChange);
  
  useEffect(() => {
    onFormDataChangeRef.current = onFormDataChange;
  }, [onFormDataChange]);

  // Only sync to parent when local state changes
  useEffect(() => {
    onFormDataChangeRef.current({ name, price, description, category });
  }, [name, price, description, category]);

  return (
    <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
      <h2 className="text-xl font-bold text-white mb-6">Model Details</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="model-name" className="block text-sm font-medium text-slate-300 mb-2">
            Model Name *
          </label>
          <input
            id="model-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500 transition"
            placeholder="e.g., Cyberpunk Sci-Fi Vehicle"
            minLength={3}
            maxLength={100}
            required
            autoComplete="off"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 3 characters • {name.length}/100
          </p>
        </div>

        <div>
          <label htmlFor="model-category" className="block text-sm font-medium text-slate-300 mb-2">
            Category *
          </label>
          <select
            id="model-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500 transition cursor-pointer"
            required
          >
            <option value="Characters">Characters</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Props">Props</option>
            <option value="Environments">Environments</option>
            <option value="Architecture">Architecture</option>
            <option value="Weapons">Weapons</option>
            <option value="Animals">Animals</option>
            <option value="Furniture">Furniture</option>
            <option value="Nature">Nature</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="model-price" className="block text-sm font-medium text-slate-300 mb-2">
            Price (USD) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg pointer-events-none">
              $
            </span>
            <input
              id="model-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              max="9999.99"
              className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white text-lg font-mono focus:outline-none focus:border-orange-500 transition"
              placeholder="29.99"
              required
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Set to $0.00 for free models • Platform fee: 7.5%
          </p>
        </div>

        <div>
          <label htmlFor="model-description" className="block text-sm font-medium text-slate-300 mb-2">
            Description *
          </label>
          <textarea
            id="model-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            minLength={20}
            maxLength={500}
            className="w-full px-4 py-3 bg-slate-950/50 border-2 border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-orange-500 transition resize-none"
            placeholder="Describe your model in detail: features, quality, use cases, what's included, etc."
            required
            autoComplete="off"
          />
          <p className="text-xs text-slate-500 mt-1">
            Minimum 20 characters • {description.length}/500
          </p>
        </div>
      </div>
    </div>
  );
});

export default ModelDetailsForm;
