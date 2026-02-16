"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Model({ url }: { url: string }) {
  // For now, this will error without a real model
  // const { scene } = useGLTF(url);
  // return <primitive object={scene} />;
  
  // Placeholder cube until real models are loaded
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ModelViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model url={modelUrl} />
          </Stage>
          <OrbitControls enableZoom={true} />
        </Suspense>
      </Canvas>
    </div>
  );
}
