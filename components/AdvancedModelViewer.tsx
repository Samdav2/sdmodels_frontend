"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";

interface ViewerSettings {
  autoRotate: boolean;
  wireframe: boolean;
  environment: string;
  showSkeleton: boolean;
  topologyMode?: "normal" | "heatmap" | "uv" | "clay";
}

function Model({ url, settings, exploded, topologyMode, isPlaying, animationProgress, selectedPose, physicsSettings, physicsActive, selectedTexture, materialOverride }: { 
  url: string; 
  settings: ViewerSettings; 
  exploded?: boolean;
  topologyMode?: "normal" | "heatmap" | "uv" | "clay";
  isPlaying?: boolean;
  animationProgress?: number;
  selectedPose?: string | null;
  physicsSettings?: { gravity: number; wind: number; bounce: number; friction: number };
  physicsActive?: boolean;
  selectedTexture?: string | null;
  materialOverride?: { color?: string; texture?: string } | null;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Auto-rotate
      if (settings.autoRotate) {
        meshRef.current.rotation.y += 0.005;
      }
      
      // Physics simulation
      if (physicsActive && physicsSettings) {
        const gravity = physicsSettings.gravity * delta;
        const wind = physicsSettings.wind * delta * 0.1;
        
        // Apply gravity
        setVelocity(prev => ({
          x: prev.x + wind,
          y: prev.y - gravity,
          z: prev.z
        }));
        
        // Apply velocity
        meshRef.current.position.x += velocity.x * delta;
        meshRef.current.position.y += velocity.y * delta;
        meshRef.current.position.z += velocity.z * delta;
        
        // Bounce off ground
        if (meshRef.current.position.y < -1) {
          meshRef.current.position.y = -1;
          setVelocity(prev => ({
            ...prev,
            y: Math.abs(prev.y) * physicsSettings.bounce
          }));
        }
        
        // Boundary constraints - keep model in viewport
        const maxX = 8;
        const maxZ = 8;
        const maxY = 10;
        
        if (meshRef.current.position.x > maxX) {
          meshRef.current.position.x = maxX;
          setVelocity(prev => ({ ...prev, x: -Math.abs(prev.x) * 0.5 }));
        }
        if (meshRef.current.position.x < -maxX) {
          meshRef.current.position.x = -maxX;
          setVelocity(prev => ({ ...prev, x: Math.abs(prev.x) * 0.5 }));
        }
        if (meshRef.current.position.z > maxZ) {
          meshRef.current.position.z = maxZ;
          setVelocity(prev => ({ ...prev, z: -Math.abs(prev.z) * 0.5 }));
        }
        if (meshRef.current.position.z < -maxZ) {
          meshRef.current.position.z = -maxZ;
          setVelocity(prev => ({ ...prev, z: Math.abs(prev.z) * 0.5 }));
        }
        if (meshRef.current.position.y > maxY) {
          meshRef.current.position.y = maxY;
          setVelocity(prev => ({ ...prev, y: -Math.abs(prev.y) * 0.5 }));
        }
        
        // Apply friction
        setVelocity(prev => ({
          x: prev.x * (1 - physicsSettings.friction * delta),
          y: prev.y,
          z: prev.z * (1 - physicsSettings.friction * delta)
        }));
        
        // Rotation from physics
        meshRef.current.rotation.x += velocity.y * delta * 0.5;
        meshRef.current.rotation.z += velocity.x * delta * 0.5;
      } else {
        // Reset position when physics disabled
        if (meshRef.current.position.y !== 0 || meshRef.current.position.x !== 0 || meshRef.current.position.z !== 0) {
          meshRef.current.position.x += (0 - meshRef.current.position.x) * 0.05;
          meshRef.current.position.y += (0 - meshRef.current.position.y) * 0.05;
          meshRef.current.position.z += (0 - meshRef.current.position.z) * 0.05;
          meshRef.current.rotation.x += (0 - meshRef.current.rotation.x) * 0.05;
          meshRef.current.rotation.z += (0 - meshRef.current.rotation.z) * 0.05;
        }
      }
      
      // Animation playback (only if physics not active)
      if (!physicsActive && isPlaying && animationProgress !== undefined) {
        const progress = animationProgress / 100;
        meshRef.current.rotation.x = Math.sin(progress * Math.PI * 2) * 0.2;
        meshRef.current.position.y = Math.sin(progress * Math.PI * 4) * 0.3;
      }
      
      // Apply poses (only if physics not active)
      if (!physicsActive && selectedPose) {
        switch (selectedPose) {
          case 'T-Pose':
            meshRef.current.rotation.x = 0;
            meshRef.current.rotation.z = 0;
            meshRef.current.position.y = 0;
            break;
          case 'A-Pose':
            meshRef.current.rotation.x = 0.1;
            meshRef.current.rotation.z = 0;
            meshRef.current.position.y = -0.2;
            break;
          case 'Crouch':
            meshRef.current.rotation.x = 0.3;
            meshRef.current.position.y = -0.8;
            break;
          case 'Combat':
            meshRef.current.rotation.x = -0.2;
            meshRef.current.rotation.z = 0.1;
            meshRef.current.position.y = -0.3;
            break;
        }
      }
    }
    
    // Smooth animation for exploded view
    if (meshRef.current && meshRef.current.children) {
      meshRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          const targetScale = exploded ? 1.5 : 1;
          const targetX = exploded ? (index - 1) * 2 : (index - 1) * 1.2;
          
          child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
          child.position.x += (targetX - child.position.x) * 0.1;
        }
      });
    }
  });

  // Determine material based on topology mode, selected texture, and material override
  const getMaterialColor = () => {
    // Priority 1: Material override from MaterialSwapper
    if (materialOverride?.color) {
      return materialOverride.color;
    }
    
    // Priority 2: Selected texture
    if (selectedTexture) {
      switch (selectedTexture) {
        case 'rusty-metal': return "#8B4513";
        case 'worn-leather': return "#654321";
        case 'polished-gold': return "#FFD700";
        case 'weathered-stone': return "#808080";
        case 'neon-circuits': return "#00FFFF";
        case 'ancient-wood': return "#8B7355";
        case 'carbon-fiber': return "#1a1a1a";
        case 'chrome': return "#E5E4E2";
        default: return hovered ? "#ff8c42" : "#ff6b35";
      }
    }
    
    // Priority 3: Topology mode
    if (!topologyMode || topologyMode === "normal") {
      return hovered ? "#ff8c42" : "#ff6b35";
    }
    switch (topologyMode) {
      case "heatmap":
        return "#00ff00"; // Green for good topology
      case "uv":
        return "#9333ea"; // Purple for UV view
      case "clay":
        return "#94a3b8"; // Gray for clay render
      default:
        return hovered ? "#ff8c42" : "#ff6b35";
    }
  };

  // Placeholder cube until real models are loaded
  return (
    <group 
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color={getMaterialColor()}
          wireframe={settings.wireframe}
          metalness={topologyMode === "clay" ? 0 : 0.8}
          roughness={topologyMode === "clay" ? 1 : 0.2}
        />
      </mesh>
      {/* Add some detail cubes */}
      <mesh position={[1.2, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={topologyMode === "heatmap" ? "#ffff00" : "#cc0044"} 
          metalness={topologyMode === "clay" ? 0 : 0.9} 
          roughness={topologyMode === "clay" ? 1 : 0.1}
          wireframe={settings.wireframe}
        />
      </mesh>
      <mesh position={[-1.2, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={topologyMode === "heatmap" ? "#ff0000" : "#cc0044"} 
          metalness={topologyMode === "clay" ? 0 : 0.9} 
          roughness={topologyMode === "clay" ? 1 : 0.1}
          wireframe={settings.wireframe}
        />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={topologyMode === "heatmap" ? "#00ff00" : "#ffa552"} 
          metalness={topologyMode === "clay" ? 0 : 0.9} 
          roughness={topologyMode === "clay" ? 1 : 0.1}
          wireframe={settings.wireframe}
        />
      </mesh>
    </group>
  );
}

// Scene Objects Component - Renders reference objects for scale testing
function SceneObjects({ objects }: { objects: Array<{ id: string; type: string; name: string; scale: number }> }) {
  return (
    <>
      {objects.map((obj, index) => {
        const position: [number, number, number] = [
          (index - objects.length / 2) * 3, // Spread objects horizontally
          obj.scale / 2 - 2, // Position based on scale
          -3 // Behind the main model
        ];
        
        let color = "#4ade80"; // Default green
        let geometry: JSX.Element;
        
        switch (obj.type) {
          case 'human':
            color = "#60a5fa";
            geometry = <boxGeometry args={[0.5, obj.scale, 0.3]} />;
            break;
          case 'car':
            color = "#f59e0b";
            geometry = <boxGeometry args={[2, 1.5, obj.scale]} />;
            break;
          case 'crate':
            color = "#a78bfa";
            geometry = <boxGeometry args={[obj.scale, obj.scale, obj.scale]} />;
            break;
          case 'door':
            color = "#ec4899";
            geometry = <boxGeometry args={[1, obj.scale, 0.1]} />;
            break;
          case 'tree':
            color = "#10b981";
            geometry = <cylinderGeometry args={[0.3, 0.5, obj.scale, 8]} />;
            break;
          case 'building':
            color = "#6366f1";
            geometry = <boxGeometry args={[4, obj.scale, 4]} />;
            break;
          case 'custom':
            color = "#f472b6"; // Pink for custom objects
            geometry = <boxGeometry args={[obj.scale, obj.scale, obj.scale]} />;
            break;
          default:
            geometry = <boxGeometry args={[obj.scale, obj.scale, obj.scale]} />;
        }
        
        return (
          <mesh key={obj.id} position={position} castShadow>
            {geometry}
            <meshStandardMaterial 
              color={color} 
              transparent 
              opacity={0.6}
              wireframe={false}
            />
            {/* Label for custom objects */}
            {obj.type === 'custom' && (
              <mesh position={[0, obj.scale / 2 + 0.5, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#f472b6" />
              </mesh>
            )}
          </mesh>
        );
      })}
    </>
  );
}

function StudioFloor() {
  return (
    <>
      <Grid
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#ff6b35"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#ff8c42"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
        position={[0, -2, 0]}
      />
      <ContactShadows
        position={[0, -1.99, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}

// Camera controller component
function CameraController({ cameraSettings }: { cameraSettings?: { fov: number; position: { x: number; y: number; z: number } } }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (cameraSettings) {
      camera.position.set(
        cameraSettings.position.x,
        cameraSettings.position.y,
        cameraSettings.position.z
      );
      if ('fov' in camera) {
        (camera as THREE.PerspectiveCamera).fov = cameraSettings.fov;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
    }
  }, [camera, cameraSettings]);

  return null;
}

interface AdvancedModelViewerProps {
  modelUrl: string;
  settings: ViewerSettings;
  selectedAnimation: string | null;
  topologyMode?: "normal" | "heatmap" | "uv" | "clay";
  lightingSettings?: {
    environment: string;
    intensity: number;
    keyLightColor: string;
    fillLightColor: string;
    rimLightColor: string;
    shadows: boolean;
  };
  cameraSettings?: {
    fov: number;
    position: { x: number; y: number; z: number };
  };
  isPlaying?: boolean;
  animationProgress?: number;
  selectedPose?: string | null;
  sceneObjects?: Array<{ id: string; type: string; name: string; scale: number }>;
  physicsSettings?: { gravity: number; wind: number; bounce: number; friction: number };
  physicsActive?: boolean;
  selectedTexture?: string | null;
  materialOverride?: { color?: string; texture?: string } | null;
}

export default function AdvancedModelViewer({ 
  modelUrl, 
  settings,
  selectedAnimation,
  topologyMode = "normal",
  lightingSettings,
  cameraSettings,
  isPlaying = false,
  animationProgress = 0,
  selectedPose = null,
  sceneObjects = [],
  physicsSettings,
  physicsActive = false,
  selectedTexture = null,
  materialOverride = null
}: AdvancedModelViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [explodedView, setExplodedView] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [key, setKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Force re-render when camera changes

  // Sync local settings with props
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Force canvas re-render when camera settings change
  useEffect(() => {
    if (cameraSettings) {
      setKey(prev => prev + 1);
    }
  }, [cameraSettings?.fov, cameraSettings?.position.x, cameraSettings?.position.y, cameraSettings?.position.z]);

  const toggleAutoRotate = () => {
    setLocalSettings(prev => ({ ...prev, autoRotate: !prev.autoRotate }));
  };

  const toggleWireframe = () => {
    setLocalSettings(prev => ({ ...prev, wireframe: !prev.wireframe }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      try {
        // Wait a frame to ensure canvas is fully rendered
        requestAnimationFrame(() => {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `model-screenshot-${Date.now()}.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Show success notification
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('showNotification', {
              detail: {
                type: 'success',
                title: 'Screenshot Captured!',
                message: `Image saved as ${link.download}`,
                autoClose: 3000,
              }
            }));
          }
        });
      } catch (error) {
        console.error('Screenshot error:', error);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('showNotification', {
            detail: {
              type: 'error',
              title: 'Screenshot Failed',
              message: 'Could not capture screenshot. Please try again.',
              autoClose: 3000,
            }
          }));
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Canvas */}
      <Canvas
        key={key}
        shadows
        camera={{ 
          position: cameraSettings ? [cameraSettings.position.x, cameraSettings.position.y, cameraSettings.position.z] : [5, 3, 5], 
          fov: cameraSettings?.fov || 50 
        }}
        className="w-full h-full"
        gl={{ 
          antialias: true,
          alpha: false, // Disable transparency for solid background
          preserveDrawingBuffer: true // For screenshots
        }}
        onCreated={({ gl, scene }) => {
          // Set solid background color
          gl.setClearColor('#0f172a', 1.0); // Slate-950 color
          scene.background = new THREE.Color('#0f172a');
        }}
      >
        <Suspense fallback={null}>
          {/* Camera Controller */}
          <CameraController cameraSettings={cameraSettings} />
          
          {/* Lighting - Controlled by LightingStudio */}
          <ambientLight intensity={(lightingSettings?.intensity || 1) * 0.4} />
          
          {/* Key Light */}
          <directionalLight
            key={`key-${lightingSettings?.keyLightColor}-${lightingSettings?.intensity}`}
            position={[10, 10, 5]}
            intensity={(lightingSettings?.intensity || 1) * 1.5}
            castShadow={lightingSettings?.shadows !== false}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            color={lightingSettings?.keyLightColor || "#ffffff"}
          />
          
          {/* Fill Light */}
          <directionalLight
            key={`fill-${lightingSettings?.fillLightColor}-${lightingSettings?.intensity}`}
            position={[-5, 5, -5]}
            intensity={(lightingSettings?.intensity || 1) * 0.5}
            color={lightingSettings?.fillLightColor || "#ff8c42"}
          />
          
          {/* Rim Light */}
          <directionalLight
            key={`rim-${lightingSettings?.rimLightColor}-${lightingSettings?.intensity}`}
            position={[0, 5, -10]}
            intensity={(lightingSettings?.intensity || 1) * 0.8}
            color={lightingSettings?.rimLightColor || "#ffa552"}
          />

          {/* Point lights for accent */}
          <pointLight 
            position={[0, 3, 0]} 
            intensity={(lightingSettings?.intensity || 1) * 0.5} 
            color="#ff6b35" 
          />
          
          {/* Model */}
          <Model 
            url={modelUrl} 
            settings={localSettings} 
            exploded={explodedView} 
            topologyMode={topologyMode}
            isPlaying={isPlaying}
            animationProgress={animationProgress}
            selectedPose={selectedPose}
            physicsSettings={physicsSettings}
            physicsActive={physicsActive}
            selectedTexture={selectedTexture}
            materialOverride={materialOverride}
          />
          
          {/* Scene Objects for Scale Reference */}
          {sceneObjects && sceneObjects.length > 0 && (
            <SceneObjects objects={sceneObjects} />
          )}
          
          {/* Floor Grid */}
          {showGrid && <StudioFloor />}
          
          {/* Skeleton Helper */}
          {settings.showSkeleton && (
            <group>
              {/* Simplified skeleton visualization */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#00ff00" wireframe />
              </mesh>
              <mesh position={[0, 1, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#00ff00" wireframe />
              </mesh>
              <mesh position={[0, 2, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#00ff00" wireframe />
              </mesh>
              {/* Bones */}
              <line>
                <bufferGeometry attach="geometry">
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0, 0, 0, 0, 1, 0])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial attach="material" color="#00ff00" />
              </line>
            </group>
          )}
          
          {/* Controls - More interactive */}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
            autoRotate={localSettings.autoRotate}
            autoRotateSpeed={2}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>

      {/* Floating Toolbar - More Interactive */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 bg-slate-900/90 backdrop-blur-xl border border-orange-500/30 rounded-full shadow-2xl shadow-orange-500/20">
          <button 
            onClick={toggleAutoRotate}
            className={`p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${
              localSettings.autoRotate 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50" 
                : "bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700"
            }`}
            title="Auto-Rotate (360°)"
          >
            🔄
          </button>
          
          <div className="w-px h-4 sm:h-6 bg-orange-500/30" />
          
          <button 
            onClick={toggleWireframe}
            className={`p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${
              localSettings.wireframe 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50" 
                : "bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700"
            }`}
            title="Wireframe Mode"
          >
            🔲
          </button>
          
          <div className="w-px h-4 sm:h-6 bg-orange-500/30" />
          
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${
              showGrid
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                : "bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700"
            }`}
            title="Toggle Grid"
          >
            #️⃣
          </button>
          
          <div className="w-px h-4 sm:h-6 bg-orange-500/30" />
          
          <button 
            onClick={() => setExplodedView(!explodedView)}
            className={`p-2 sm:p-3 rounded-lg transition text-sm sm:text-base ${
              explodedView
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                : "bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700"
            }`}
            title="Exploded View"
          >
            💥
          </button>
          
          <div className="w-px h-4 sm:h-6 bg-orange-500/30 hidden sm:block" />
          
          <button 
            onClick={takeScreenshot}
            className="hidden sm:block p-2 sm:p-3 rounded-lg bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition text-sm sm:text-base"
            title="Screenshot (Download PNG)"
          >
            📷
          </button>
          
          <div className="w-px h-4 sm:h-6 bg-orange-500/30 hidden sm:block" />
          
          <button 
            onClick={toggleFullscreen}
            className="hidden sm:block p-2 sm:p-3 rounded-lg bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition text-sm sm:text-base"
            title="Fullscreen"
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Interaction Hints */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-orange-500/30 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
          <div className="text-xs text-gray-400 text-center">
            <span className="hidden sm:inline">🖱️ Click & Drag to Rotate • Scroll to Zoom • Right-Click to Pan</span>
            <span className="sm:hidden">👆 Touch & Drag to Rotate</span>
          </div>
        </div>
      </div>

      {/* Active Features Indicator */}
      {(localSettings.autoRotate || localSettings.wireframe || explodedView || !showGrid || topologyMode !== "normal") && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-orange-500/30 rounded-lg px-4 py-2">
            <div className="flex items-center gap-3 text-xs flex-wrap justify-center">
              {localSettings.autoRotate && (
                <span className="text-orange-400 font-semibold">🔄 Auto-Rotate ON</span>
              )}
              {localSettings.wireframe && (
                <span className="text-orange-400 font-semibold">🔲 Wireframe ON</span>
              )}
              {localSettings.showSkeleton && (
                <span className="text-green-400 font-semibold">🦴 Skeleton ON</span>
              )}
              {explodedView && (
                <span className="text-purple-400 font-semibold">💥 Exploded View</span>
              )}
              {!showGrid && (
                <span className="text-cyan-400 font-semibold">Grid Hidden</span>
              )}
              {topologyMode === "heatmap" && (
                <span className="text-red-400 font-semibold">🔥 Heatmap Mode</span>
              )}
              {topologyMode === "uv" && (
                <span className="text-purple-400 font-semibold">🗺️ UV Map Mode</span>
              )}
              {topologyMode === "clay" && (
                <span className="text-gray-400 font-semibold">🎭 Clay Render</span>
              )}
              {selectedAnimation && (
                <span className="text-cyan-400 font-semibold">🎬 {selectedAnimation}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Performance Stats */}
      <div className="absolute top-4 right-4 z-10 hidden sm:block">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-orange-500/30 rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2">
          <div className="text-xs text-gray-400">
            FPS: <span className="text-orange-400 font-mono font-bold">60</span>
          </div>
        </div>
      </div>

      {/* Model Info Overlay - Repositioned for mobile */}
      <div className="absolute top-16 left-2 sm:bottom-24 sm:top-auto sm:left-6 z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-orange-500/30 rounded-lg p-2 sm:p-4 space-y-1">
          <div className="text-xs text-gray-500">POLY COUNT</div>
          <div className="text-base sm:text-2xl font-black text-orange-400 font-mono">45,200</div>
          <div className="text-xs text-gray-500 hidden sm:block">TRIANGLES</div>
          <div className="text-sm font-bold text-cyan-400 font-mono hidden sm:block">45,200</div>
          {lightingSettings && (
            <>
              <div className="text-xs text-gray-500 hidden sm:block pt-2 border-t border-slate-700">LIGHTING</div>
              <div className="text-sm font-bold text-yellow-400 font-mono hidden sm:block">
                {(lightingSettings.intensity * 100).toFixed(0)}%
              </div>
            </>
          )}
        </div>
      </div>

      {/* Camera Position Indicator - Hidden on mobile */}
      <div className="absolute bottom-24 right-6 z-10 hidden lg:block">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-orange-500/30 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-2">CAMERA</div>
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">X:</span>
              <span className="text-orange-400">
                {cameraSettings?.position.x.toFixed(1) || '5.0'}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Y:</span>
              <span className="text-cyan-400">
                {cameraSettings?.position.y.toFixed(1) || '3.0'}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Z:</span>
              <span className="text-purple-400">
                {cameraSettings?.position.z.toFixed(1) || '5.0'}
              </span>
            </div>
            <div className="flex justify-between gap-3 pt-1 border-t border-slate-700">
              <span className="text-gray-400">FOV:</span>
              <span className="text-yellow-400">
                {cameraSettings?.fov || '50'}°
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
