"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useBounty, useBountySubmission } from "@/lib/api/hooks/useBounties";
import AdvancedModelViewer from "@/components/AdvancedModelViewer";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { useState } from "react";

export default function ViewSubmissionPage() {
  const params = useParams();
  const bountyId = params.id as string;
  
  const { bounty, loading: bountyLoading } = useBounty(bountyId);
  const { submission, loading: submissionLoading, error } = useBountySubmission(bountyId);

  const [settings, setSettings] = useState({
    autoRotate: true,
    wireframe: false,
    showGrid: false,
    showAxes: false,
    environment: "studio",
    showSkeleton: false,
  });

  const [lightingSettings, setLightingSettings] = useState({
    environment: "studio",
    intensity: 1,
    keyLightColor: "#ffffff",
    fillLightColor: "#ffffff",
    rimLightColor: "#ffffff",
    shadows: true,
  });

  const [cameraSettings] = useState({
    fov: 50,
    position: { x: 0, y: 2, z: 5 },
  });

  if (bountyLoading || submissionLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!submission) return <ErrorMessage error="No submission found" />;
  if (submission.submission_type !== 'upload') {
    return <ErrorMessage error="Advanced viewer is only available for uploaded models" />;
  }
  if (!submission.model_file_url) {
    return <ErrorMessage error="Model file not found" />;
  }

  // Get format
  const format = submission.model_format?.toLowerCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <nav className="relative z-10 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/50">
                <span className="text-white font-bold text-lg">SD</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Advanced Viewer
                </h1>
                <p className="text-xs text-slate-400">{bounty?.title}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={submission.model_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold text-sm"
              >
                ⬇️ Download
              </a>
              <Link
                href={`/bounties/${bountyId}/review`}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 transition font-semibold text-sm"
              >
                Back to Review
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Model Info Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">File:</span>
              <span className="text-white font-medium">{submission.model_file_name}</span>
            </div>
            <div className="hidden sm:block text-slate-700">•</div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Format:</span>
              <span className="px-2 py-1 bg-purple-500/20 border border-purple-500 text-purple-400 rounded text-xs font-medium">
                {submission.model_format?.toUpperCase()}
              </span>
            </div>
            {submission.model_file_size && (
              <>
                <div className="hidden sm:block text-slate-700">•</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Size:</span>
                  <span className="text-white">{(submission.model_file_size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </>
            )}
            <div className="hidden sm:block text-slate-700">•</div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Submitted:</span>
              <span className="text-white">{new Date(submission.submitted_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Viewer */}
      <div className="h-[calc(100vh-140px)]">
        <AdvancedModelViewer
          modelUrl={submission.model_file_url}
          fileFormat={format}
          settings={settings}
          selectedAnimation={null}
          lightingSettings={lightingSettings}
          cameraSettings={cameraSettings}
          isPlaying={false}
          animationProgress={0}
          selectedPose={null}
          sceneObjects={[]}
          physicsSettings={{ gravity: -9.8, wind: 0, bounce: 0.5, friction: 0.5 }}
          physicsActive={false}
          selectedTexture={null}
          materialOverride={null}
        />
      </div>

      {/* Artist Notes (if any) */}
      {submission.notes && (
        <div className="fixed bottom-4 right-4 max-w-md bg-slate-900/95 border-2 border-orange-500/30 rounded-xl p-4 backdrop-blur-xl shadow-2xl">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>📝</span>
            Artist Notes
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {submission.notes}
          </p>
        </div>
      )}
    </div>
  );
}
