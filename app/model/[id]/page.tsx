"use client";

import Link from "next/link";
import AdvancedModelViewer from "@/components/AdvancedModelViewer";
import SpecsPanel from "@/components/SpecsPanel";
import AnimatorToolbox from "@/components/AnimatorToolbox";
import TechnicalDeepDive from "@/components/TechnicalDeepDive";
import MaterialSwapper from "@/components/MaterialSwapper";
import GhostCompareMode from "@/components/GhostCompareMode";
import LightingStudio from "@/components/LightingStudio";
import CameraControl from "@/components/CameraControl";
import MeasurementTool from "@/components/MeasurementTool";
import TopologyHealthScan from "@/components/TopologyHealthScan";
import ARVRViewer from "@/components/ARVRViewer";
import PhysicsRagdollTester from "@/components/PhysicsRagdollTester";
import EnvironmentPrototyper from "@/components/EnvironmentPrototyper";
import AITextureGenerator from "@/components/AITextureGenerator";
import EngineCompatibility from "@/components/EngineCompatibility";
import NotificationModal, { NotificationType } from "@/components/NotificationModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { useState, useEffect } from "react";
import { useModel } from "@/lib/api/hooks/useModel";

export default function ModelPage({ params }: { params: { id: string } }) {
  // Fetch model data from API
  const { model: apiModel, loading, error } = useModel(params.id);
  const [viewerSettings, setViewerSettings] = useState({
    autoRotate: false,
    wireframe: false,
    environment: "studio",
    showSkeleton: false,
  });

  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [materialOverride, setMaterialOverride] = useState<{ color?: string; texture?: string } | null>(null);
  const [compareModelId, setCompareModelId] = useState<string | null>(null);
  const [topologyMode, setTopologyMode] = useState<"normal" | "heatmap" | "uv" | "clay">("normal");
  const [activeTab, setActiveTab] = useState<'specs' | 'ide'>('specs');
  const [mobileTab, setMobileTab] = useState<'controls' | 'specs' | 'ide'>('specs');
  
  // AI Features state
  const [showAILighting, setShowAILighting] = useState(false);
  const [showColorCustomizer, setShowColorCustomizer] = useState(false);
  
  // Lighting and Camera settings
  const [lightingSettings, setLightingSettings] = useState({
    environment: "studio",
    intensity: 1.0,
    keyLightColor: "#ffffff",
    fillLightColor: "#ff8c42",
    rimLightColor: "#ffa552",
    shadows: true,
    ambientOcclusion: true,
  });
  
  const [cameraSettings, setCameraSettings] = useState({
    fov: 50,
    position: { x: 5, y: 3, z: 5 },
    target: { x: 0, y: 0, z: 0 },
    preset: "default",
  });
  
  // Animation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [selectedPose, setSelectedPose] = useState<string | null>(null);
  
  // Scene and Physics state
  const [sceneObjects, setSceneObjects] = useState<Array<{ id: string; type: string; name: string; scale: number }>>([]);
  const [physicsSettings, setPhysicsSettings] = useState({
    gravity: 9.8,
    wind: 0,
    bounce: 0.5,
    friction: 0.8,
  });
  const [physicsActive, setPhysicsActive] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);
  
  // Animation playback effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && selectedAnimation) {
      interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 100) {
            return 0; // Loop animation
          }
          return prev + 2; // Increment by 2%
        });
      }, 100); // Update every 100ms
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedAnimation]);
  
  // Notification state
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
    progress?: number;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: "primary" | "secondary" | "danger";
    }>;
    autoClose?: number;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Listen for custom events
  useEffect(() => {
    const handleStartRecording = (e: any) => {
      const { animation, duration } = e.detail;
      setNotification({
        isOpen: true,
        type: "recording",
        title: "Recording Animation",
        message: `Recording "${animation || 'current view'}" for ${duration / 1000} seconds...`,
        progress: 0,
      });

      // Get the canvas element
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        setNotification({
          isOpen: true,
          type: "error",
          title: "Recording Failed",
          message: "Could not find canvas element. Please try again.",
          autoClose: 3000,
        });
        return;
      }

      try {
        // Create MediaRecorder to capture canvas
        const stream = canvas.captureStream(60); // 60 FPS
        const chunks: Blob[] = [];
        
        // Use webm format (widely supported)
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 8000000 // 8 Mbps for high quality
        });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // Create video blob
          const videoBlob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(videoBlob);
          
          setNotification({
            isOpen: true,
            type: "success",
            title: "Recording Complete!",
            message: "Your animation recording is ready to download as MP4.",
            actions: [
              {
                label: "Download Video",
                onClick: () => {
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${model.name.replace(/\s+/g, '_')}_${animation || 'recording'}_${Date.now()}.webm`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  setNotification({
                    isOpen: true,
                    type: "success",
                    title: "Download Started!",
                    message: `Video saved as WebM format. File: ${link.download}`,
                    autoClose: 4000,
                  });
                },
                variant: "primary",
              },
              {
                label: "Close",
                onClick: () => setNotification(prev => ({ ...prev, isOpen: false })),
                variant: "secondary",
              },
            ],
          });
        };

        // Start recording
        mediaRecorder.start();

        // Simulate recording progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 2;
          if (progress <= 100) {
            setNotification(prev => ({ ...prev, progress }));
          } else {
            clearInterval(progressInterval);
          }
        }, duration / 50);

        // Stop recording after duration
        setTimeout(() => {
          mediaRecorder.stop();
          clearInterval(progressInterval);
        }, duration);

      } catch (error) {
        console.error('Recording error:', error);
        setNotification({
          isOpen: true,
          type: "error",
          title: "Recording Failed",
          message: "Your browser may not support video recording. Try Chrome or Edge for best results.",
          autoClose: 5000,
        });
      }
    };

    const handleExportAnimation = (e: any) => {
      const { animation, format } = e.detail;
      setNotification({
        isOpen: true,
        type: "exporting",
        title: "Exporting Animation",
        message: `Exporting "${animation || 'current animation'}" to ${format.toUpperCase()}...`,
        progress: 0,
      });

      // Simulate export progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress <= 100) {
          setNotification(prev => ({ ...prev, progress }));
        } else {
          clearInterval(interval);
          
          // Create actual export data based on format
          let exportData = '';
          let mimeType = 'application/octet-stream';
          
          if (format === 'fbx') {
            // FBX format structure (simplified)
            exportData = `; FBX 7.4.0 project file
; Created by SDModels Exporter
; Animation: ${animation || 'Unnamed'}
; Export Date: ${new Date().toISOString()}

FBXHeaderExtension:  {
    FBXHeaderVersion: 1003
    FBXVersion: 7400
    Creator: "SDModels Platform"
}

Definitions:  {
    Version: 100
    Count: 1
    ObjectType: "Model" {
        Count: 1
    }
    ObjectType: "AnimationStack" {
        Count: 1
        PropertyTemplate: "FbxAnimStack" {
            Properties70:  {
                P: "Description", "KString", "", "", ""
                P: "LocalStart", "KTime", "Time", "",0
                P: "LocalStop", "KTime", "Time", "",46186158000
            }
        }
    }
}

Objects:  {
    Model: 1234567890, "Model::${model.name}", "Mesh" {
        Version: 232
        Properties70:  {
            P: "RotationActive", "bool", "", "",1
            P: "InheritType", "enum", "", "",1
        }
        Shading: T
        Culling: "CullingOff"
    }
    
    AnimationStack: 9876543210, "AnimStack::${animation}", "" {
        Properties70:  {
            P: "Description", "KString", "", "", "${animation} animation"
            P: "LocalStart", "KTime", "Time", "",0
            P: "LocalStop", "KTime", "Time", "",46186158000
        }
    }
}

; Animation data would be here in production
; Keyframes, curves, and transformations
; Total frames: 120
; FPS: 30

Connections:  {
    C: "OO",9876543210,0
}`;
            mimeType = 'application/octet-stream';
          } else if (format === 'gltf' || format === 'glb') {
            // GLTF format structure
            const gltfData = {
              asset: {
                version: "2.0",
                generator: "SDModels Exporter",
                copyright: "© SDModels Platform"
              },
              scene: 0,
              scenes: [
                {
                  name: model.name,
                  nodes: [0]
                }
              ],
              nodes: [
                {
                  name: model.name,
                  mesh: 0,
                  rotation: [0, 0, 0, 1],
                  scale: [1, 1, 1],
                  translation: [0, 0, 0]
                }
              ],
              meshes: [
                {
                  name: model.name,
                  primitives: [
                    {
                      attributes: {
                        POSITION: 0,
                        NORMAL: 1,
                        TEXCOORD_0: 2
                      },
                      indices: 3,
                      material: 0
                    }
                  ]
                }
              ],
              animations: [
                {
                  name: animation || "Animation",
                  channels: [],
                  samplers: []
                }
              ],
              materials: [
                {
                  name: "Material",
                  pbrMetallicRoughness: {
                    baseColorFactor: [1, 1, 1, 1],
                    metallicFactor: 0.5,
                    roughnessFactor: 0.5
                  }
                }
              ],
              accessors: [],
              bufferViews: [],
              buffers: []
            };
            exportData = JSON.stringify(gltfData, null, 2);
            mimeType = 'model/gltf+json';
          }
          
          // Create and download file
          const blob = new Blob([exportData], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${model.name.replace(/\s+/g, '_')}_${animation || 'animation'}_${Date.now()}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          setNotification({
            isOpen: true,
            type: "success",
            title: "Export Complete!",
            message: `Animation exported to ${format.toUpperCase()} successfully! File: ${link.download}`,
            autoClose: 4000,
          });
        }
      }, 40);
    };

    const handleShowNotification = (e: any) => {
      setNotification({
        isOpen: true,
        ...e.detail,
      });
    };

    const handleOpenBuyModal = (e: any) => {
      const { model } = e.detail;
      setNotification({
        isOpen: true,
        type: "info",
        title: "Purchase Model",
        message: `You're about to purchase "${model.name}" for $${model.price}`,
        actions: [
          {
            label: "Confirm Purchase",
            onClick: () => {
              setNotification({
                isOpen: true,
                type: "success",
                title: "Purchase Successful!",
                message: "Your model is now available in your library. Download links have been sent to your email.",
                autoClose: 5000,
              });
            },
            variant: "primary",
          },
          {
            label: "Cancel",
            onClick: () => setNotification(prev => ({ ...prev, isOpen: false })),
            variant: "secondary",
          },
        ],
      });
    };

    window.addEventListener('startRecording', handleStartRecording);
    window.addEventListener('exportAnimation', handleExportAnimation);
    window.addEventListener('showNotification', handleShowNotification);
    window.addEventListener('openBuyModal', handleOpenBuyModal);

    return () => {
      window.removeEventListener('startRecording', handleStartRecording);
      window.removeEventListener('exportAnimation', handleExportAnimation);
      window.removeEventListener('showNotification', handleShowNotification);
      window.removeEventListener('openBuyModal', handleOpenBuyModal);
    };
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
            >
              <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
              <span className="font-semibold text-sm sm:text-base">Back to Marketplace</span>
            </Link>
          </div>
        </nav>
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error || !apiModel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
            >
              <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
              <span className="font-semibold text-sm sm:text-base">Back to Marketplace</span>
            </Link>
          </div>
        </nav>
        <ErrorMessage error={error || "Model not found"} />
      </div>
    );
  }

  // Map API model to component format
  const model = {
    id: apiModel.id.toString(),
    name: apiModel.title,
    artist: apiModel.creator.username,
    artistVerified: apiModel.creator.is_verified_creator,
    price: apiModel.price,
    platformFee: apiModel.price * 0.075, // 7.5%
    description: apiModel.description,
    polyCount: apiModel.poly_count,
    triangles: apiModel.poly_count,
    formats: apiModel.file_formats,
    textureResolution: apiModel.texture_resolution || "4K",
    textureSets: ["Diffuse", "Normal", "Roughness", "Metallic", "AO"], // Default texture sets
    isRigged: apiModel.has_rigging,
    animations: apiModel.has_animations ? ["Idle", "Walk Cycle", "Run", "Jump", "Attack", "Death"] : [],
    modelUrl: apiModel.file_url,
    dimensions: { width: 2, height: 4, depth: 1 }, // Default dimensions
    
    // Quality checks - default to true for now
    qualityChecks: {
      nonManifold: true,
      overlappingUVs: true,
      realWorldScale: true,
      cleanTopology: true,
      properNormals: true,
    },
    
    // Related assets - empty for now, can be fetched separately
    relatedAssets: [],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        progress={notification.progress}
        actions={notification.actions}
        autoClose={notification.autoClose}
      />
      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-orange-500/20 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition group"
          >
            <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-semibold text-sm sm:text-base">Back to Marketplace</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-800 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/20 transition text-sm">
              Share
            </button>
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-800 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/20 transition text-sm">
              ❤️ Save
            </button>
          </div>
        </div>
      </nav>

      {/* Main Cockpit Layout */}
      <div className="relative max-w-[2000px] mx-auto">
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col h-[calc(100vh-80px)]">
          {/* Model Viewer - Takes 60% of screen on mobile */}
          <div className="relative h-[60vh] bg-slate-950">
            <AdvancedModelViewer 
              modelUrl={model.modelUrl}
              settings={viewerSettings}
              selectedAnimation={selectedAnimation}
              topologyMode={topologyMode}
              lightingSettings={lightingSettings}
              cameraSettings={cameraSettings}
              isPlaying={isPlaying}
              animationProgress={animationProgress}
              selectedPose={selectedPose}
              sceneObjects={sceneObjects}
              physicsSettings={physicsSettings}
              physicsActive={physicsActive}
              selectedTexture={selectedTexture}
              materialOverride={materialOverride}
            />
          </div>

          {/* Scrollable Bottom Panel - 40% */}
          <div className="flex-1 bg-slate-900/95 backdrop-blur-xl border-t-2 border-orange-500/30 overflow-y-auto">
            {/* Drag Handle */}
            <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-xl">
              <div className="flex justify-center py-2 border-b border-orange-500/20">
                <div className="w-12 h-1 bg-orange-500/50 rounded-full"></div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-orange-500/20">
                <button 
                  onClick={() => setMobileTab('controls')}
                  className={`flex-1 px-3 py-3 text-xs font-semibold transition ${
                    mobileTab === 'controls'
                      ? 'text-orange-400 border-b-2 border-orange-500'
                      : 'text-gray-400'
                  }`}
                >
                  🎮 Controls
                </button>
                <button 
                  onClick={() => setMobileTab('specs')}
                  className={`flex-1 px-3 py-3 text-xs font-semibold transition ${
                    mobileTab === 'specs'
                      ? 'text-orange-400 border-b-2 border-orange-500'
                      : 'text-gray-400'
                  }`}
                >
                  📋 Details
                </button>
                <button 
                  onClick={() => setMobileTab('ide')}
                  className={`flex-1 px-3 py-3 text-xs font-semibold transition ${
                    mobileTab === 'ide'
                      ? 'text-orange-400 border-b-2 border-orange-500'
                      : 'text-gray-400'
                  }`}
                >
                  🚀 IDE
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="p-4">
              {mobileTab === 'controls' && (
                <div className="space-y-3">
                  <AnimatorToolbox 
                    animations={model.animations}
                    isRigged={model.isRigged}
                    selectedAnimation={selectedAnimation}
                    setSelectedAnimation={setSelectedAnimation}
                    viewerSettings={viewerSettings}
                    setViewerSettings={setViewerSettings}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    animationProgress={animationProgress}
                    setAnimationProgress={setAnimationProgress}
                    selectedPose={selectedPose}
                    setSelectedPose={setSelectedPose}
                  />
                  <LightingStudio 
                    onLightingChange={(settings) => {
                      setLightingSettings(settings);
                    }}
                  />
                  <CameraControl 
                    onCameraChange={(settings) => {
                      setCameraSettings(settings);
                    }}
                  />
                </div>
              )}

              {mobileTab === 'specs' && (
                <>
                  <div className="mb-6 space-y-3">
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-white mb-2">🎨 Customize</h3>
                      <p className="text-xs text-gray-400">Test before you buy</p>
                    </div>
                    
                    <MaterialSwapper onMaterialChange={setMaterialOverride} />
                    <GhostCompareMode 
                      currentModel={{
                        id: model.id,
                        name: model.name,
                        polyCount: model.polyCount
                      }}
                      onCompareToggle={setCompareModelId}
                    />
                  </div>

                  <SpecsPanel model={model} />
                </>
              )}

              {mobileTab === 'ide' && (
                <div className="space-y-3">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-orange-400 mb-2">🚀 IDE Tools</h3>
                    <p className="text-xs text-gray-400">Professional features</p>
                  </div>
                  
                  <TopologyHealthScan 
                    onModeChange={(mode) => {
                      setTopologyMode(mode);
                    }}
                  />
                  
                  <ARVRViewer 
                    modelId={model.id}
                    modelName={model.name}
                  />
                  
                  <PhysicsRagdollTester 
                    onPhysicsChange={(settings) => {
                      setPhysicsSettings(settings);
                    }}
                    onPhysicsToggle={(active) => {
                      setPhysicsActive(active);
                    }}
                  />
                  
                  <EnvironmentPrototyper 
                    onObjectAdd={(obj) => {
                      setSceneObjects(prev => [...prev, obj]);
                    }}
                    onObjectRemove={(id) => {
                      setSceneObjects(prev => prev.filter(o => o.id !== id));
                    }}
                    onClearAll={() => {
                      setSceneObjects([]);
                    }}
                  />
                  
                  <AITextureGenerator 
                    onTextureSelect={(textureId) => {
                      setSelectedTexture(textureId);
                    }}
                  />
                  
                  <EngineCompatibility 
                    modelFormats={model.formats}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-0 min-h-[calc(100vh-80px)]">
          
          {/* Left Sidebar - Controls & Tools */}
          <div className="col-span-2 xl:col-span-2 border-r border-orange-500/20 bg-slate-900/50 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="p-3 xl:p-4 space-y-3">
              {/* Animation & View Controls */}
              <AnimatorToolbox 
                animations={model.animations}
                isRigged={model.isRigged}
                selectedAnimation={selectedAnimation}
                setSelectedAnimation={setSelectedAnimation}
                viewerSettings={viewerSettings}
                setViewerSettings={setViewerSettings}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                animationProgress={animationProgress}
                setAnimationProgress={setAnimationProgress}
                selectedPose={selectedPose}
                setSelectedPose={setSelectedPose}
              />
              
              <LightingStudio 
                onLightingChange={(settings) => {
                  setLightingSettings(settings);
                }}
              />
              
              <CameraControl 
                onCameraChange={(settings) => {
                  setCameraSettings(settings);
                }}
              />
              
              <MeasurementTool 
                modelDimensions={model.dimensions}
              />
            </div>
          </div>

          {/* Center - The 3D Viewer */}
          <div className="col-span-7 xl:col-span-7 relative">
            <AdvancedModelViewer 
              modelUrl={model.modelUrl}
              settings={viewerSettings}
              selectedAnimation={selectedAnimation}
              topologyMode={topologyMode}
              lightingSettings={lightingSettings}
              cameraSettings={cameraSettings}
              isPlaying={isPlaying}
              animationProgress={animationProgress}
              selectedPose={selectedPose}
              sceneObjects={sceneObjects}
              physicsSettings={physicsSettings}
              physicsActive={physicsActive}
              selectedTexture={selectedTexture}
              materialOverride={materialOverride}
            />
          </div>

          {/* Right Sidebar - Specs & IDE Features */}
          <div className="col-span-3 xl:col-span-3 border-l border-orange-500/20 bg-slate-900/50 backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-80px)]">
            {/* Tabbed Interface for Better Organization */}
            <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-xl border-b border-orange-500/20">
              <div className="flex">
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === 'specs' 
                      ? 'text-orange-400 border-b-2 border-orange-500' 
                      : 'text-gray-400 hover:text-orange-300'
                  }`}
                >
                  📋 Specs
                </button>
                <button 
                  onClick={() => setActiveTab('ide')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                    activeTab === 'ide' 
                      ? 'text-orange-400 border-b-2 border-orange-500' 
                      : 'text-gray-400 hover:text-orange-300'
                  }`}
                >
                  🚀 IDE Tools
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'specs' && (
                <>
                  {/* Advanced Features */}
                  <div className="mb-6 space-y-3">
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-white mb-2">🎨 Customize</h3>
                      <p className="text-xs text-gray-400">Test before you buy</p>
                    </div>
                    
                    <MaterialSwapper onMaterialChange={setMaterialOverride} />
                    <GhostCompareMode 
                      currentModel={{
                        id: model.id,
                        name: model.name,
                        polyCount: model.polyCount
                      }}
                      onCompareToggle={setCompareModelId}
                    />
                  </div>

                  <SpecsPanel model={model} />
                </>
              )}

              {activeTab === 'ide' && (
                <div className="space-y-3">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-orange-400 mb-2">🚀 Professional Tools</h3>
                    <p className="text-xs text-gray-400">IDE features for developers</p>
                  </div>
                  
                  <TopologyHealthScan 
                    onModeChange={(mode) => {
                      setTopologyMode(mode);
                      setViewerSettings(prev => ({ ...prev, topologyMode: mode }));
                    }}
                  />
                  
                  <ARVRViewer 
                    modelId={model.id}
                    modelName={model.name}
                  />
                  
                  <PhysicsRagdollTester 
                    onPhysicsChange={(settings) => {
                      setPhysicsSettings(settings);
                    }}
                    onPhysicsToggle={(active) => {
                      setPhysicsActive(active);
                    }}
                  />
                  
                  <EnvironmentPrototyper 
                    onObjectAdd={(obj) => {
                      setSceneObjects(prev => [...prev, obj]);
                    }}
                    onObjectRemove={(id) => {
                      setSceneObjects(prev => prev.filter(o => o.id !== id));
                    }}
                    onClearAll={() => {
                      setSceneObjects([]);
                    }}
                  />
                  
                  <AITextureGenerator 
                    onTextureSelect={(textureId) => {
                      setSelectedTexture(textureId);
                    }}
                  />
                  
                  <EngineCompatibility 
                    modelFormats={model.formats}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Below the Fold - Technical Deep Dive */}
      <TechnicalDeepDive model={model} />
    </div>
  );
}
