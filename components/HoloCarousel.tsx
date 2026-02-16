'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface Model3D {
  id: string;
  name: string;
  url: string;
  polyCount: number;
  category: string;
  price: number;
}

interface HoloCarouselProps {
  models: Model3D[];
  autoSlideInterval?: number;
}

// Pedestal component for each model
function ModelPedestal({ 
  modelUrl, 
  position, 
  scale, 
  isCenter, 
  rotation,
  modelIndex,
  onInteractionStart,
  onInteractionEnd 
}: { 
  modelUrl: string;
  position: [number, number, number];
  scale: number;
  isCenter: boolean;
  rotation: number;
  modelIndex: number;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Use procedural geometry if no model URL provided
  const isPlaceholder = modelUrl === 'placeholder';

  useFrame((state, delta) => {
    if (meshRef.current && !hovered) {
      // Auto-rotation on Y-axis
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'grab' : 'auto';
  }, [hovered]);

  // Procedural geometry shapes based on index
  const getProceduralShape = () => {
    const shapes = [
      // Mech-like structure
      <group key="mech">
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1.5, 0.8]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#ff8c42" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.6, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.6, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>,
      // Vehicle-like structure
      <group key="vehicle">
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 0.6, 0.8]} />
          <meshStandardMaterial color="#00d9ff" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.7]} />
          <meshStandardMaterial color="#0099cc" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.6, -0.4, 0.4]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
          <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.6, -0.4, 0.4]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
          <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>,
      // Weapon-like structure
      <group key="weapon">
        <mesh position={[0, 0, 0]} rotation-z={Math.PI / 4}>
          <cylinderGeometry args={[0.1, 0.15, 2, 16]} />
          <meshStandardMaterial color="#ff3366" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.5, 0.5, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color="#cc0044" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.8, -0.8, 0]}>
          <coneGeometry args={[0.2, 0.5, 16]} />
          <meshStandardMaterial color="#ff6699" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>,
      // Environment prop
      <group key="prop">
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.8, 0.2, 16, 32]} />
          <meshStandardMaterial color="#9d4edd" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#c77dff" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>,
      // UI Element
      <group key="ui">
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[0.5, 0.15, 100, 16]} />
          <meshStandardMaterial color="#00ff88" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>,
    ];
    return shapes[modelIndex % shapes.length];
  };

  return (
    <group position={position}>
      {/* Pedestal Base */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[1.5, 1.8, 0.3, 32]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.2}
          emissive={isCenter ? "#ff6b35" : "#333"}
          emissiveIntensity={isCenter ? 0.3 : 0.1}
        />
      </mesh>

      {/* Glass Pedestal */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 1, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 3D Model */}
      <group
        ref={meshRef}
        scale={scale}
        rotation-y={rotation}
        onPointerEnter={() => {
          setHovered(true);
          onInteractionStart();
        }}
        onPointerLeave={() => {
          setHovered(false);
          onInteractionEnd();
        }}
      >
        {isPlaceholder ? getProceduralShape() : null}
      </group>

      {/* Holographic Ring */}
      {isCenter && (
        <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2}>
          <ringGeometry args={[2, 2.1, 64]} />
          <meshBasicMaterial 
            color="#ff6b35" 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// Scanning beam effect
function ScanningBeam({ isActive }: { isActive: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beamRef.current && isActive) {
      beamRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 2;
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={beamRef} position={[0, 0, 0]}>
      <planeGeometry args={[6, 0.1]} />
      <meshBasicMaterial 
        color="#00ffff" 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Scene setup
function Scene({ 
  models, 
  activeIndex, 
  isUserInteracting,
  onInteractionStart,
  onInteractionEnd 
}: { 
  models: Model3D[];
  activeIndex: number;
  isUserInteracting: boolean;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 10);
  }, [camera]);

  const getModelPosition = (index: number): [number, number, number] => {
    const offset = index - activeIndex;
    return [offset * 5, 0, offset === 0 ? 0 : -2];
  };

  const getModelScale = (index: number): number => {
    return index === activeIndex ? 1.5 : 0.8;
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={50} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
      <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ff6b35" />

      {/* Environment */}
      <Environment preset="city" />

      {/* Models on Pedestals */}
      {models.map((model, index) => (
        <ModelPedestal
          key={model.id}
          modelUrl={model.url}
          modelIndex={index}
          position={getModelPosition(index)}
          scale={getModelScale(index)}
          isCenter={index === activeIndex}
          rotation={0}
          onInteractionStart={onInteractionStart}
          onInteractionEnd={onInteractionEnd}
        />
      ))}

      {/* Scanning Beam */}
      <ScanningBeam isActive={!isUserInteracting} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
        onStart={onInteractionStart}
        onEnd={onInteractionEnd}
      />

      {/* Grid Floor */}
      <gridHelper args={[50, 50, '#ff6b35', '#333']} position={[0, -2, 0]} />
    </>
  );
}

export default function HoloCarousel({ 
  models, 
  autoSlideInterval = 6000 
}: HoloCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wireframeMode, setWireframeMode] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeModel = models[activeIndex];

  // Auto-slide logic
  useEffect(() => {
    if (!isUserInteracting) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % models.length);
      }, autoSlideInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isUserInteracting, models.length, autoSlideInterval]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % models.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + models.length) % models.length);
  };

  const handleInteractionStart = () => {
    setIsUserInteracting(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleInteractionEnd = () => {
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 2000);
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[80vh] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas shadows>
        <Scene
          models={models}
          activeIndex={activeIndex}
          isUserInteracting={isUserInteracting}
          onInteractionStart={handleInteractionStart}
          onInteractionEnd={handleInteractionEnd}
        />
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top HUD */}
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Left Info Panel - Hidden on mobile to not block view */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:block bg-slate-900/80 backdrop-blur-xl border border-orange-500/50 sm:border-2 rounded-lg sm:rounded-xl p-3 sm:p-6 pointer-events-auto"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-400 font-mono text-xs sm:text-sm">LIVE PREVIEW</span>
            </div>
            
            <h3 className="text-lg sm:text-2xl font-black text-white mb-1 sm:mb-2">{activeModel.name}</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-4">{activeModel.category}</p>

            <div className="space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">POLY_COUNT:</span>
                <span className="text-cyan-400">{activeModel.polyCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">ROTATION_Y:</span>
                <span className="text-cyan-400">{rotation.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">MESH_HEALTH:</span>
                <span className="text-green-400">OPTIMAL</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">PRICE:</span>
                <span className="text-orange-400">${activeModel.price}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Controls */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-orange-500/50 sm:border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 pointer-events-auto flex sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto"
          >
            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`flex-1 sm:w-full px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                wireframeMode
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {wireframeMode ? '✓ Wire' : 'Wire'}
              <span className="hidden sm:inline">frame</span>
            </button>
            
            <button className="flex-1 sm:w-full px-3 sm:px-4 py-2 bg-slate-800 text-gray-400 hover:bg-slate-700 rounded-lg font-semibold text-xs sm:text-sm transition-all">
              <span className="hidden sm:inline">View </span>AR
            </button>
            
            <button className="flex-1 sm:w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:from-orange-400 hover:to-red-500 transition-all shadow-lg shadow-orange-500/50">
              <span className="hidden sm:inline">Add to </span>Cart
            </button>
          </motion.div>
        </div>

        {/* Mobile Info Bar - Shows at bottom on mobile */}
        <div className="sm:hidden absolute top-4 left-4 right-4 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-orange-500/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-white truncate">{activeModel.name}</h3>
                <p className="text-xs text-gray-400">{activeModel.category}</p>
              </div>
              <div className="text-lg font-bold text-orange-400 ml-3">${activeModel.price}</div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-6">
          <button
            onClick={handlePrev}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900/80 backdrop-blur-xl border border-orange-500/50 sm:border-2 rounded-full flex items-center justify-center text-orange-400 hover:bg-orange-500/20 transition-all pointer-events-auto text-lg sm:text-xl"
          >
            ←
          </button>

          {/* Indicator Dots */}
          <div className="flex gap-2 sm:gap-3">
            {models.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`pointer-events-auto transition-all ${
                  index === activeIndex
                    ? 'w-8 sm:w-12 h-2 sm:h-3 bg-orange-500 rounded-full'
                    : 'w-2 sm:w-3 h-2 sm:h-3 bg-slate-600 rounded-full hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900/80 backdrop-blur-xl border border-orange-500/50 sm:border-2 rounded-full flex items-center justify-center text-orange-400 hover:bg-orange-500/20 transition-all pointer-events-auto text-lg sm:text-xl"
          >
            →
          </button>
        </div>

        {/* Scanning Line Animation */}
        <AnimatePresence>
          {!isUserInteracting && (
            <motion.div
              initial={{ top: '-100%' }}
              animate={{ top: '100%' }}
              exit={{ top: '100%' }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
            />
          )}
        </AnimatePresence>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-32 sm:h-32 border-t border-l sm:border-t-2 sm:border-l-2 border-orange-500/30" />
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-32 sm:h-32 border-t border-r sm:border-t-2 sm:border-r-2 border-orange-500/30" />
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-32 sm:h-32 border-b border-l sm:border-b-2 sm:border-l-2 border-orange-500/30" />
        <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-32 sm:h-32 border-b border-r sm:border-b-2 sm:border-r-2 border-orange-500/30" />
      </div>

      {/* Interaction Hint */}
      <AnimatePresence>
        {!isUserInteracting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 text-center hidden sm:block"
          >
            <p className="text-gray-400 text-xs sm:text-sm font-mono">
              Click and drag to rotate • Scroll to zoom
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
