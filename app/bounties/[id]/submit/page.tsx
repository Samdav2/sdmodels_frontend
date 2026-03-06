"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBounty } from "@/lib/api/hooks/useBounties";
import { submitWork } from "@/lib/api/bounties";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import ModelViewer3D from "@/components/ModelViewer3D";

export default function SubmitWorkPage() {
  const params = useParams();
  const router = useRouter();
  const bountyId = params.id as string;
  
  const { bounty, loading, error } = useBounty(bountyId);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [submissionType, setSubmissionType] = useState<'upload' | 'link'>('upload');
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [modelPreviewUrl, setModelPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    external_model_url: "",
    preview_image_urls: [""],
    notes: "",
  });

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validExtensions = ['glb', 'gltf', 'fbx', 'obj', 'blend', 'dae', 'stl', '3ds', 'ply'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (!extension || !validExtensions.includes(extension)) {
        showNotification("error", "Invalid File", "Please upload a valid 3D model file");
        return;
      }
      
      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        showNotification("error", "File Too Large", "Model file must be under 100MB");
        return;
      }
      
      setModelFile(file);
      
      // Create preview URL for GLB/GLTF files
      if (extension === 'glb' || extension === 'gltf') {
        const url = URL.createObjectURL(file);
        setModelPreviewUrl(url);
      }
    }
  };

  const handlePreviewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['jpg', 'jpeg', 'png', 'webp'].includes(extension || '');
    });
    
    // Validate file sizes (10MB max each)
    const validSizedFiles = validFiles.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showNotification("warning", "Image Too Large", `${file.name} exceeds 10MB and was skipped`);
        return false;
      }
      return true;
    });
    
    // Limit to 5 images
    const limitedFiles = validSizedFiles.slice(0, 5);
    
    if (validSizedFiles.length > 5) {
      showNotification("warning", "Too Many Images", "Maximum 5 preview images allowed");
    }
    
    setPreviewFiles(limitedFiles);
  };

  const handleAddPreviewUrl = () => {
    setFormData(prev => ({
      ...prev,
      preview_image_urls: [...prev.preview_image_urls, ""]
    }));
  };

  const handleRemovePreviewUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preview_image_urls: prev.preview_image_urls.filter((_, i) => i !== index)
    }));
  };

  const handlePreviewUrlChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      preview_image_urls: prev.preview_image_urls.map((url, i) => i === index ? value : url)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (submissionType === 'upload') {
      if (!modelFile) {
        setSubmitError("Please select a model file to upload");
        return;
      }
    } else {
      if (!formData.external_model_url) {
        setSubmitError("Please provide the model URL");
        return;
      }
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const submitData: any = {
        submission_type: submissionType,
        notes: formData.notes,
      };

      if (submissionType === 'upload') {
        submitData.model_file = modelFile;
        submitData.preview_image_files = previewFiles;
      } else {
        submitData.external_model_url = formData.external_model_url;
        submitData.preview_images = formData.preview_image_urls.filter(url => url.trim() !== "");
      }

      await submitWork(bountyId, submitData);

      showNotification("success", "Work Submitted!", "Your submission has been sent to the client for review");
      setTimeout(() => router.push("/bounties/my-claimed"), 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || "Failed to submit work";
      setSubmitError(errorMsg);
      showNotification("error", "Submission Failed", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
              <span className="text-white font-bold text-lg">SD</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Submit Work
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <Link href={`/bounties/${bountyId}`} className="text-sm sm:text-base text-orange-400 hover:text-orange-300 transition">
              View Bounty
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Bounty Info */}
        <div className="bg-slate-900/50 border-2 border-orange-500/30 rounded-xl p-6 backdrop-blur mb-8">
          <h2 className="text-2xl font-black text-white mb-2">{bounty?.title}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <div>
              <span className="text-orange-400 font-bold">${bounty?.budget}</span> payment
            </div>
            <div>•</div>
            <div>
              Posted by <span className="text-white font-medium">{bounty?.poster_username}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-3xl font-black text-white mb-3">
            📤 Submit Your <span className="text-orange-500">Work</span>
          </h3>
          <p className="text-slate-400">
            Upload your completed model or provide a link. The client will review your submission.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-xl">
            <p className="text-red-400">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submission Type Selector */}
          <div className="bg-slate-900/50 border-2 border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <label className="block text-white font-bold mb-4 text-lg">
              Choose Submission Method
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSubmissionType('upload')}
                className={`p-6 rounded-xl border-2 transition ${
                  submissionType === 'upload'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="text-4xl mb-3">📁</div>
                <h4 className="text-white font-bold mb-2">Upload File</h4>
                <p className="text-sm text-slate-400">
                  Upload your 3D model file directly for instant viewing
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSubmissionType('link')}
                className={`p-6 rounded-xl border-2 transition ${
                  submissionType === 'link'
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className="text-4xl mb-3">🔗</div>
                <h4 className="text-white font-bold mb-2">External Link</h4>
                <p className="text-sm text-slate-400">
                  Provide a link to your model hosted elsewhere
                </p>
              </button>
            </div>
          </div>

          {/* Upload Mode */}
          {submissionType === 'upload' && (
            <>
              {/* Model File Upload */}
              <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
                <label className="block text-white font-semibold mb-2">
                  3D Model File <span className="text-red-400">*</span>
                </label>
                <p className="text-sm text-slate-400 mb-4">
                  Supported formats: GLB, GLTF, FBX, OBJ, BLEND, DAE, STL, 3DS, PLY (Max 100MB)
                </p>
                
                <div className="relative">
                  <input
                    type="file"
                    accept=".glb,.gltf,.fbx,.obj,.blend,.dae,.stl,.3ds,.ply"
                    onChange={handleModelFileChange}
                    className="hidden"
                    id="model-file-input"
                  />
                  <label
                    htmlFor="model-file-input"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-orange-500 transition bg-slate-950/50"
                  >
                    {modelFile ? (
                      <div className="text-center">
                        <div className="text-4xl mb-2">✓</div>
                        <p className="text-white font-semibold">{modelFile.name}</p>
                        <p className="text-sm text-slate-400 mt-1">
                          {(modelFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-orange-400 mt-2">Click to change file</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">📁</div>
                        <p className="text-white font-semibold">Click to upload model file</p>
                        <p className="text-sm text-slate-400 mt-1">or drag and drop</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Model Preview */}
                {modelPreviewUrl && (
                  <div className="mt-6">
                    <h4 className="text-white font-semibold mb-3">Model Preview</h4>
                    <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-700">
                      <ModelViewer3D 
                        modelUrl={modelPreviewUrl} 
                        fileFormat={modelFile?.name.split('.').pop()?.toLowerCase()}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Images Upload */}
              <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
                <label className="block text-white font-semibold mb-2">
                  Preview Images (Optional)
                </label>
                <p className="text-sm text-slate-400 mb-4">
                  Upload up to 5 preview images (JPG, PNG, WEBP - Max 10MB each)
                </p>
                
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePreviewFilesChange}
                  className="hidden"
                  id="preview-files-input"
                />
                <label
                  htmlFor="preview-files-input"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-orange-500 transition bg-slate-950/50"
                >
                  {previewFiles.length > 0 ? (
                    <div className="text-center">
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-white font-semibold">{previewFiles.length} image(s) selected</p>
                      <p className="text-xs text-orange-400 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-white font-semibold">Click to upload preview images</p>
                      <p className="text-sm text-slate-400 mt-1">or drag and drop</p>
                    </div>
                  )}
                </label>

                {previewFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previewFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-slate-700"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                          <span className="text-white text-sm">{file.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Link Mode */}
          {submissionType === 'link' && (
            <>
              {/* External Model URL */}
              <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
                <label className="block text-white font-semibold mb-2">
                  Model URL <span className="text-red-400">*</span>
                </label>
                <p className="text-sm text-slate-400 mb-3">
                  Provide a link to your model (Sketchfab, Google Drive, Dropbox, etc.)
                </p>
                <input
                  type="url"
                  value={formData.external_model_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, external_model_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                  required={submissionType === 'link'}
                />
              </div>

              {/* Preview Image URLs */}
              <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
                <label className="block text-white font-semibold mb-2">
                  Preview Image URLs (Optional)
                </label>
                <p className="text-sm text-slate-400 mb-4">
                  Add links to preview images or renders
                </p>
                
                <div className="space-y-3">
                  {formData.preview_image_urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handlePreviewUrlChange(index, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition"
                      />
                      {formData.preview_image_urls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePreviewUrl(index)}
                          className="px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {formData.preview_image_urls.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPreviewUrl}
                    className="mt-4 px-4 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg hover:bg-orange-500/30 transition font-semibold text-sm"
                  >
                    + Add Image URL
                  </button>
                )}
              </div>
            </>
          )}

          {/* Notes */}
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-xl p-6 backdrop-blur">
            <label className="block text-white font-semibold mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information about your submission..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Requirements Checklist */}
          {bounty?.requirements && bounty.requirements.length > 0 && (
            <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
              <h4 className="text-white font-bold mb-3">✓ Requirements Checklist</h4>
              <ul className="space-y-2">
                {bounty.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="text-orange-400 mt-0.5">□</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/bounties/my-claimed"
              className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition font-semibold text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-400 hover:to-red-500 transition font-semibold shadow-lg shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Work"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
