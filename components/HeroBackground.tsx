"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingGeometry() {
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create particles
  const particles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#ff6b35"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Floating geometric shapes */}
      <group ref={meshRef}>
        <mesh position={[-3, 0, 0]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#ff6b35"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        
        <mesh position={[3, 2, -2]}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#ff8c42"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        
        <mesh position={[0, -2, -1]}>
          <tetrahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#ffa552"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff6b35" />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
