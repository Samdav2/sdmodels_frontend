"use client";

import { useRef, useState } from "react";

interface ThumbnailCaptureProps {
  file: File | null;
  onThumbnailGenerated?: (thumbnail: string) => void;
  onError?: (message: string) => void;
}

export default function ThumbnailCapture({ file, onThumbnailGenerated, onError }: ThumbnailCaptureProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      if (onError) {
        onError('Please upload an image file (JPG, PNG, etc.)');
      }
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      if (onError) {
        onError('Image size must be less than 5MB');
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setThumbnail(result);
      if (onThumbnailGenerated) {
        onThumbnailGenerated(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onThumbnailGenerated) {
      onThumbnailGenerated('');
    }
  };

  return (
    <div className="space-y-3">
      {thumbnail ? (
        <div className="relative aspect-video bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30 overflow-hidden group">
          <img 
            src={thumbnail} 
            alt="Model thumbnail" 
            className="w-full h-full object-cover"
          />
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold text-sm"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemoveThumbnail}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border-2 border-dashed border-yellow-500/30 hover:border-yellow-500/60 transition flex flex-col items-center justify-center gap-3 group cursor-pointer"
        >
          <span className="text-5xl group-hover:scale-110 transition">📸</span>
          <div className="text-center">
            <p className="text-white font-semibold mb-1">Upload Thumbnail</p>
            <p className="text-xs text-slate-400">Click to upload an image (JPG, PNG)</p>
            <p className="text-xs text-slate-500 mt-1">Max size: 5MB</p>
          </div>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleThumbnailUpload}
        className="hidden"
      />
    </div>
  );
}
