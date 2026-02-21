"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

interface ModelViewer3DProps {
  modelUrl: string;
  fileFormat?: string; // e.g., 'fbx', 'obj', 'gltf', 'glb'
  autoRotate?: boolean;
}

function Model({ url, format }: { url: string; format?: string }) {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('ModelViewer3D loading:', url, 'Format:', format);

        // Use provided format or try to detect from URL
        let fileExt = format?.toLowerCase() || '';

        if (!fileExt) {
          // Fallback: try to extract from URL
          const urlWithoutQuery = url.split('?')[0];
          const pathParts = urlWithoutQuery.split('/');
          const filename = pathParts[pathParts.length - 1];

          if (filename.includes('.')) {
            fileExt = filename.split('.').pop()?.toLowerCase() || '';
          }
        }

        console.log('Using file extension:', fileExt);

        if (!fileExt || !['fbx', 'obj', 'gltf', 'glb', 'stl', 'dae'].includes(fileExt)) {
          console.error('Invalid or missing file format. URL:', url, 'Format:', format);
          setError(`Unable to determine file format. Please specify format prop.`);
          setLoading(false);
          return;
        }

        const processModel = (object: THREE.Object3D) => {
          // Ensure all meshes have proper materials
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (!child.material || Array.isArray(child.material) && child.material.length === 0) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0xcccccc,
                  roughness: 0.5,
                  metalness: 0.1,
                });
              }

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

              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Center and scale using a wrapper group
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = maxDim > 0 ? 5 / maxDim : 1;

          // Offset model so center is at group origin
          object.position.set(-center.x, -center.y, -center.z);

          // Wrap in group — scale applies to both geometry and position offset
          const wrapper = new THREE.Group();
          wrapper.add(object);
          wrapper.scale.setScalar(scale);

          console.log('Model processed successfully:', { center, size, scale });
          setModel(wrapper);
          setLoading(false);
        };

        if (fileExt === 'fbx') {
          const loader = new FBXLoader();
          loader.load(
            url,
            (object) => {
              console.log('FBX loaded successfully:', object);
              processModel(object);
            },
            (progress) => {
              console.log('Loading progress:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
            },
            (err) => {
              console.error('FBX load error:', err);
              setError('Failed to load FBX model');
              setLoading(false);
            }
          );
        } else if (fileExt === 'obj') {
          const loader = new OBJLoader();
          loader.load(
            url,
            (object) => {
              console.log('OBJ loaded successfully:', object);
              processModel(object);
            },
            undefined,
            (err) => {
              console.error('OBJ load error:', err);
              setError('Failed to load OBJ model');
              setLoading(false);
            }
          );
        } else if (fileExt === 'gltf' || fileExt === 'glb') {
          const loader = new GLTFLoader();
          const dracoLoader = new DRACOLoader();
          dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
          dracoLoader.setDecoderConfig({ type: 'js' });
          loader.setDRACOLoader(dracoLoader);
          console.log('ModelViewer3D: Using GLTFLoader (+Draco) for format:', fileExt);
          loader.load(
            url,
            (gltf) => {
              console.log('GLTF loaded successfully:', gltf);
              console.log('Scene children count:', gltf.scene.children.length);
              dracoLoader.dispose();
              processModel(gltf.scene);
            },
            (progress) => {
              if (progress.total > 0) {
                console.log('GLTF loading:', Math.round((progress.loaded / progress.total) * 100) + '%');
              }
            },
            (err) => {
              console.error('GLTF load error:', err);
              dracoLoader.dispose();
              setError('Failed to load GLTF/GLB model');
              setLoading(false);
            }
          );
        } else if (fileExt === 'stl') {
          const loader = new STLLoader();
          loader.load(
            url,
            (geometry) => {
              console.log('STL loaded successfully');
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
              processModel(group);
            },
            undefined,
            (err) => {
              console.error('STL load error:', err);
              setError('Failed to load STL model');
              setLoading(false);
            }
          );
        } else if (fileExt === 'dae') {
          const loader = new ColladaLoader();
          loader.load(
            url,
            (collada) => {
              console.log('DAE/Collada loaded successfully');
              processModel(collada.scene);
            },
            undefined,
            (err) => {
              console.error('DAE load error:', err);
              setError('Failed to load DAE model');
              setLoading(false);
            }
          );
        } else {
          console.warn('Unsupported format:', fileExt);
          setError('Unsupported format: ' + fileExt);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Error loading model: ' + (err as Error).message);
        setLoading(false);
      }
    };

    loadModel();
  }, [url, format]);

  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff6b35" wireframe />
      </mesh>
    );
  }

  if (error) {
    console.error('Model error:', error);
    return (
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff0000" wireframe />
      </mesh>
    );
  }

  if (!model) return null;

  return <primitive object={model} />;
}

export default function ModelViewer3D({ modelUrl, fileFormat, autoRotate = false }: ModelViewer3DProps) {
  const [loadError, setLoadError] = useState(false);

  return (
    <div className="w-full h-full relative">
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-sm text-red-400">Failed to load 3D model</p>
            <p className="text-xs text-slate-500 mt-1">Check browser console for details</p>
          </div>
        </div>
      )}
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onError={() => setLoadError(true)}
      >
        <PerspectiveCamera makeDefault position={[8, 8, 8]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minDistance={0.1}
          maxDistance={200}
          rotateSpeed={0.8}
          zoomSpeed={1.2}
        />

        <ambientLight intensity={0.5} />
        <hemisphereLight color="#ffffff" groundColor="#444444" intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        <Suspense fallback={null}>
          <Model url={modelUrl} format={fileFormat} />
          <Environment preset="studio" />
        </Suspense>

        <gridHelper args={[20, 20, 0x444444, 0x222222]} />
      </Canvas>

      {/* Loading indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-slate-900/80 px-3 py-1 rounded">
        Loading 3D model...
      </div>
    </div>
  );
}
