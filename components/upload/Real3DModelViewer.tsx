"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

interface Real3DModelViewerProps {
  file: File | null;
  onCameraChange?: (position: [number, number, number]) => void;
}

type CameraAngle = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

function Model({ url, fileType }: { url: string; fileType: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;

    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('=== MODEL LOADING START ===');
        console.log('URL:', url);
        console.log('File Type:', fileType);

        const processAndSetModel = (object: THREE.Object3D) => {
          if (!isMounted) return;

          console.log('Processing object:', object);
          console.log('Object type:', object.type);
          console.log('Children:', object.children.length);

          // Count meshes
          let meshCount = 0;
          let vertexCount = 0;
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              meshCount++;
              if (child.geometry) {
                const positions = child.geometry.attributes.position;
                if (positions) {
                  vertexCount += positions.count;
                }
              }
            }
          });

          console.log('Meshes found:', meshCount);
          console.log('Total vertices:', vertexCount);

          if (meshCount === 0) {
            console.error('NO MESHES FOUND IN MODEL!');
            setError('Model contains no visible geometry');
            setLoading(false);
            return;
          }

          // Apply materials and setup
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // Ensure geometry exists
              if (!child.geometry) {
                console.warn('Mesh has no geometry:', child.name);
                return;
              }

              // Handle materials
              if (!child.material) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xaaaaaa,
                  roughness: 0.5,
                  metalness: 0.1,
                  side: THREE.DoubleSide,
                });
              } else {
                // Fix texture encoding for proper PBR rendering
                const fixMaterial = (mat: THREE.Material) => {
                  mat.side = THREE.DoubleSide;
                  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                    if (mat.map) {
                      mat.map.colorSpace = THREE.SRGBColorSpace;
                      mat.map.needsUpdate = true;
                    }
                    if (mat.emissiveMap) {
                      mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
                      mat.emissiveMap.needsUpdate = true;
                    }
                    if (mat.normalMap) mat.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
                    if (mat.roughnessMap) mat.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
                    if (mat.metalnessMap) mat.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
                    mat.needsUpdate = true;
                  }
                };

                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => { if (mat) fixMaterial(mat); });
                } else {
                  fixMaterial(child.material);
                }
              }

              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Calculate bounds
          const box = new THREE.Box3().setFromObject(object);

          if (box.isEmpty()) {
            console.error('BOUNDING BOX IS EMPTY!');
            setError('Model has invalid bounds');
            setLoading(false);
            return;
          }

          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          console.log('Bounds:', {
            center: [center.x.toFixed(2), center.y.toFixed(2), center.z.toFixed(2)],
            size: [size.x.toFixed(2), size.y.toFixed(2), size.z.toFixed(2)],
            maxDim: maxDim.toFixed(2)
          });

          if (maxDim === 0 || !isFinite(maxDim)) {
            console.error('INVALID DIMENSIONS!');
            setError('Model has zero or invalid size');
            setLoading(false);
            return;
          }

          // Center and scale using wrapper group
          const scale = maxDim > 0 ? 4 / maxDim : 1;
          object.position.set(-center.x, -center.y, -center.z);

          const wrapper = new THREE.Group();
          wrapper.add(object);
          wrapper.scale.setScalar(scale);

          console.log('Applied transform:', { scale: scale.toFixed(4) });
          console.log('=== MODEL LOADING SUCCESS ===');

          setModel(wrapper);
          setLoading(false);
        };

        // Load based on file type
        if (fileType === 'glb' || fileType === 'gltf') {
          console.log('Loading with GLTFLoader (+Draco)...');
          const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
          const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
          const loader = new GLTFLoader();

          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
          dracoLoader.setDecoderConfig({ type: 'js' });
          loader.setDRACOLoader(dracoLoader);

          loader.load(
            url,
            (gltf) => {
              console.log('GLTF loaded:', gltf);
              console.log('Scene:', gltf.scene);
              console.log('Animations:', gltf.animations?.length || 0);
              dracoLoader.dispose();
              processAndSetModel(gltf.scene);
            },
            (progress) => {
              const percent = progress.total > 0
                ? Math.round((progress.loaded / progress.total) * 100)
                : 0;
              console.log('Loading progress:', percent + '%');
            },
            (err) => {
              console.error('GLTF load error:', err);
              dracoLoader.dispose();
              if (isMounted) {
                setError('Failed to load GLB/GLTF: ' + (err as Error).message);
                setLoading(false);
              }
            }
          );
        } else if (fileType === 'fbx') {
          console.log('Loading with FBXLoader...');
          const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
          const loader = new FBXLoader();

          loader.load(
            url,
            (object) => {
              console.log('FBX loaded:', object);
              processAndSetModel(object);
            },
            (progress) => {
              const percent = progress.total > 0
                ? Math.round((progress.loaded / progress.total) * 100)
                : 0;
              console.log('Loading progress:', percent + '%');
            },
            (err) => {
              console.error('FBX load error:', err);
              if (isMounted) {
                setError('Failed to load FBX');
                setLoading(false);
              }
            }
          );
        } else if (fileType === 'obj') {
          console.log('Loading with OBJLoader...');
          const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js');
          const loader = new OBJLoader();

          loader.load(
            url,
            (object) => {
              console.log('OBJ loaded:', object);
              processAndSetModel(object);
            },
            (progress) => {
              const percent = progress.total > 0
                ? Math.round((progress.loaded / progress.total) * 100)
                : 0;
              console.log('Loading progress:', percent + '%');
            },
            (err) => {
              console.error('OBJ load error:', err);
              if (isMounted) {
                setError('Failed to load OBJ');
                setLoading(false);
              }
            }
          );
        } else if (fileType === 'stl') {
          console.log('Loading with STLLoader...');
          const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js');
          const loader = new STLLoader();

          loader.load(
            url,
            (geometry: THREE.BufferGeometry) => {
              console.log('STL loaded:', geometry);
              const material = new THREE.MeshStandardMaterial({
                color: 0xb0b0b0,
                roughness: 0.4,
                metalness: 0.6,
                side: THREE.DoubleSide,
              });
              geometry.computeVertexNormals();
              const mesh = new THREE.Mesh(geometry, material);
              const group = new THREE.Group();
              group.add(mesh);
              processAndSetModel(group);
            },
            (progress) => {
              const percent = progress.total > 0
                ? Math.round((progress.loaded / progress.total) * 100)
                : 0;
              console.log('Loading progress:', percent + '%');
            },
            (err) => {
              console.error('STL load error:', err);
              if (isMounted) {
                setError('Failed to load STL');
                setLoading(false);
              }
            }
          );
        } else if (fileType === 'dae') {
          console.log('Loading with ColladaLoader...');
          const { ColladaLoader } = await import('three/examples/jsm/loaders/ColladaLoader.js');
          const loader = new ColladaLoader();

          loader.load(
            url,
            (collada: any) => {
              console.log('DAE loaded:', collada);
              processAndSetModel(collada.scene);
            },
            (progress) => {
              const percent = progress.total > 0
                ? Math.round((progress.loaded / progress.total) * 100)
                : 0;
              console.log('Loading progress:', percent + '%');
            },
            (err) => {
              console.error('DAE load error:', err);
              if (isMounted) {
                setError('Failed to load DAE');
                setLoading(false);
              }
            }
          );
        } else {
          console.warn('Unsupported format:', fileType);
          if (isMounted) {
            setError('Unsupported format: ' + fileType);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Load exception:', err);
        if (isMounted) {
          setError('Error: ' + (err as Error).message);
          setLoading(false);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [url, fileType]);

  // Auto-rotate
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  if (loading) {
    return (
      <group ref={meshRef}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff6b35" wireframe />
        </mesh>
      </group>
    );
  }

  if (error || !model) {
    console.error('Render error state:', error);
    return (
      <group ref={meshRef}>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#ff0000" wireframe />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={meshRef}>
      <primitive object={model} />
    </group>
  );
}

// Camera controller component
function CameraController({ targetPosition }: { targetPosition: [number, number, number] }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...targetPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, targetPosition]);

  return null;
}

export default function Real3DModelViewer({ file, onCameraChange }: Real3DModelViewerProps) {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([5, 5, 5]);
  const [zoom, setZoom] = useState<number>(5);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      console.log('Real3DModelViewer: File uploaded', {
        name: file.name,
        type: file.type,
        extension: ext,
        size: file.size
      });
      setFileType(ext);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const cameraAngles: Record<CameraAngle, [number, number, number]> = {
    front: [0, 0, zoom],
    back: [0, 0, -zoom],
    left: [-zoom, 0, 0],
    right: [zoom, 0, 0],
    top: [0, zoom, 0],
    bottom: [0, -zoom, 0],
  };

  const handleCameraAngle = (angle: CameraAngle) => {
    const position = cameraAngles[angle];
    setCameraPosition(position);
    if (onCameraChange) {
      onCameraChange(position);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? Math.max(2, prev - 1) : Math.min(15, prev + 1);
      // Update camera position with new zoom
      const ratio = newZoom / prev;
      setCameraPosition(([x, y, z]) => [x * ratio, y * ratio, z * ratio]);
      return newZoom;
    });
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl relative">
      {modelUrl ? (
        <>
          <Canvas
            dpr={[1, 2]}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.9,
              outputColorSpace: THREE.SRGBColorSpace,
            }}
          >
            <PerspectiveCamera makeDefault position={cameraPosition} />
            <CameraController targetPosition={cameraPosition} />
            <OrbitControls enableDamping dampingFactor={0.08} minDistance={0.1} maxDistance={200} rotateSpeed={0.8} zoomSpeed={1.2} />

            <ambientLight intensity={0.5} />
            <hemisphereLight color="#ffffff" groundColor="#444444" intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} />

            <Suspense fallback={null}>
              <Model url={modelUrl} fileType={fileType} />
              <Environment preset="studio" />
            </Suspense>

            <gridHelper args={[10, 10]} />
          </Canvas>

          {/* Camera Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {/* Zoom Controls */}
            <div className="bg-slate-900/90 backdrop-blur rounded-lg p-2 border border-slate-700">
              <div className="text-xs text-slate-400 mb-2 text-center font-semibold">Zoom</div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleZoom('in')}
                  className="w-10 h-10 bg-slate-800 hover:bg-orange-500 text-white rounded-lg transition flex items-center justify-center font-bold text-lg"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={() => handleZoom('out')}
                  className="w-10 h-10 bg-slate-800 hover:bg-orange-500 text-white rounded-lg transition flex items-center justify-center font-bold text-lg"
                  title="Zoom Out"
                >
                  −
                </button>
              </div>
            </div>

            {/* Camera Angle Presets */}
            <div className="bg-slate-900/90 backdrop-blur rounded-lg p-2 border border-slate-700">
              <div className="text-xs text-slate-400 mb-2 text-center font-semibold">Camera</div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => handleCameraAngle('front')}
                  className="px-3 py-2 bg-slate-800 hover:bg-orange-500 text-white rounded text-xs transition font-semibold"
                  title="Front View"
                >
                  Front
                </button>
                <button
                  onClick={() => handleCameraAngle('back')}
                  className="px-3 py-2 bg-slate-800 hover:bg-orange-500 text-white rounded text-xs transition font-semibold"
                  title="Back View"
                >
                  Back
                </button>
                <button
                  onClick={() => handleCameraAngle('left')}
                  className="px-3 py-2 bg-slate-800 hover:bg-orange-500 text-white rounded text-xs transition font-semibold"
                  title="Left View"
                >
                  Left
                </button>
                <button
                  onClick={() => handleCameraAngle('right')}
                  className="px-3 py-2 bg-slate-800 hover:bg-orange-500 text-white rounded text-xs transition font-semibold"
                  title="Right View"
                >
                  Right
                </button>
                <button
                  onClick={() => handleCameraAngle('top')}
                  className="px-3 py-2 bg-slate-800 hover:bg-orange-500 text-white rounded text-xs transition font-semibold"
                  title="Top View"
                >
                  Top
                </button>
                <button
                  onClick={() => handleCameraAngle('bottom')}
                  className="px-3 py-2 bg-slate-800 hover:bg-orange-500 text-white rounded text-xs transition font-semibold"
                  title="Bottom View"
                >
                  Bottom
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-2 block">📦</span>
            <p className="text-xs text-slate-500">Upload a model to preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
