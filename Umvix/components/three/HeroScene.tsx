"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function GlowingKnot() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
    if (groupRef.current) {
      // subtle parallax toward pointer
      const targetX = state.pointer.y * 0.3;
      const targetY = state.pointer.x * 0.5;
      groupRef.current.rotation.x +=
        (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1.1, 0.34, 220, 32]} />
          <meshStandardMaterial
            color="#ff1f3d"
            emissive="#b30000"
            emissiveIntensity={1.4}
            wireframe
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        <mesh scale={1.35}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial color="#ff1f3d" wireframe transparent opacity={0.08} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ff1f3d" />
      <pointLight position={[-5, -3, 2]} intensity={1.5} color="#b30000" />
      <GlowingKnot />
    </Canvas>
  );
}
