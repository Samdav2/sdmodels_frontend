import { useState } from 'react';
import apiClient from '../client';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  step: string;
}

interface UploadMetadata {
  name: string;
  price: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  optimizeMesh?: boolean;
  generateThumbnail?: boolean;
  meshData?: {
    polyCount: number;
    hasNGons: boolean;
    hasOpenEdges: boolean;
    hasUnappliedScales: boolean;
    riggingScore?: number;
    isProRig?: boolean;
  };
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ 
    loaded: 0, 
    total: 100, 
    percentage: 0,
    step: 'Preparing...'
  });
  const [error, setError] = useState<string | null>(null);

  // Step 1: Upload model file
  const uploadModelFile = async (file: File): Promise<{ file_url: string; file_size: number; file_format: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/model', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  };

  // Step 2: Upload thumbnail image
  const uploadThumbnailImage = async (thumbnailData: string): Promise<{ image_url: string }> => {
    // Convert base64 to blob
    const response = await fetch(thumbnailData);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('file', blob, 'thumbnail.png');

    const uploadResponse = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return uploadResponse.data;
  };

  // Step 3: Create model record with URLs
  const createModelRecord = async (modelData: any) => {
    const response = await apiClient.post('/models', modelData);
    return response.data;
  };

  const uploadModel = async (file: File, metadata: UploadMetadata) => {
    try {
      setUploading(true);
      setError(null);

      // Step 1: Upload model file (0-40%)
      setProgress({ loaded: 0, total: 100, percentage: 0, step: 'Uploading model file...' });
      const modelFileResult = await uploadModelFile(file);
      setProgress({ loaded: 40, total: 100, percentage: 40, step: 'Model file uploaded' });

      // Step 2: Upload thumbnail (40-60%)
      setProgress({ loaded: 40, total: 100, percentage: 40, step: 'Uploading thumbnail...' });
      let thumbnailUrl = '';
      if (metadata.thumbnail) {
        const thumbnailResult = await uploadThumbnailImage(metadata.thumbnail);
        thumbnailUrl = thumbnailResult.image_url;
      }
      setProgress({ loaded: 60, total: 100, percentage: 60, step: 'Thumbnail uploaded' });

      // Step 3: Create model record (60-100%)
      setProgress({ loaded: 60, total: 100, percentage: 60, step: 'Creating model record...' });
      
      const modelPayload = {
        title: metadata.name,
        description: metadata.description,
        price: parseFloat(metadata.price) || 0,
        is_free: parseFloat(metadata.price) === 0,
        category: metadata.category || 'Other',
        tags: metadata.tags || [],
        
        // File URLs from uploads
        file_url: modelFileResult.file_url,
        thumbnail_url: thumbnailUrl || modelFileResult.file_url, // Fallback to model URL if no thumbnail
        preview_images: [], // Can be added later
        
        // File metadata
        file_size: modelFileResult.file_size,
        file_formats: [modelFileResult.file_format],
        
        // Model specifications
        poly_count: metadata.meshData?.polyCount || 0,
        vertex_count: metadata.meshData?.polyCount ? metadata.meshData.polyCount * 3 : 0,
        texture_resolution: '2048x2048',
        has_animations: false,
        has_rigging: metadata.meshData?.riggingScore ? metadata.meshData.riggingScore > 50 : false,
        has_materials: true,
        has_textures: true,
      };

      const createdModel = await createModelRecord(modelPayload);
      setProgress({ loaded: 100, total: 100, percentage: 100, step: 'Complete!' });

      return { success: true, modelId: createdModel.id, model: createdModel };
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Upload failed';
      setError(errorMessage);
      return { success: false, modelId: null, error: errorMessage };
    } finally {
      setUploading(false);
    }
  };

  return { uploadModel, uploading, progress, error };
}
