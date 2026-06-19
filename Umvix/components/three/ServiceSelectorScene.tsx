"use client";

import { useRef } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import * as THREE from "three";

export type ServiceKey = "web" | "mobile" | "ai" | "dashboard";

type SceneProps = {
  selected: ServiceKey[];
  onToggle: (key: ServiceKey) => void;
};

const SERVICES: {
  key: ServiceKey;
  label: string;
  position: [number, number, number];
  piece: [number, number, number];
}[] = [
  { key: "web", label: "Web", position: [-2.6, 1.4, 0], piece: [-0.5, 0.5, 0] },
  { key: "mobile", label: "Mobile", position: [2.6, 1.4, 0], piece: [0.5, 0.5, 0] },
  { key: "ai", label: "AI", position: [-2.6, -1.4, 0], piece: [-0.5, -0.5, 0] },
  { key: "dashboard", label: "Data", position: [2.6, -1.4, 0], piece: [0.5, -0.5, 0] },
];

function SatelliteIcon({
  label,
  position,
  active,
  onClick,
}: {
  label: string;
  position: [number, number, number];
  active: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * (active ? 1.4 : 0.5);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        <mesh
          ref={ref}
          onClick={onClick}
          scale={active ? 0.62 : 0.5}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={active ? "#ff1f3d" : "#1a1a1a"}
            emissive={active ? "#ff1f3d" : "#000000"}
            emissiveIntensity={active ? 1.2 : 0}
            wireframe={!active}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        <Text
          position={[0, -0.95, 0]}
          fontSize={0.32}
          color={active ? "#ff1f3d" : "#a3a3a3"}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function CorePiece({
  target,
  active,
}: {
  target: [number, number, number];
  active: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const scattered = useRef<[number, number, number]>([
    target[0] * 8,
    target[1] * 8,
    (Math.random() - 0.5) * 8,
  ]);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const [tx, ty, tz] = active ? target : scattered.current;
    mesh.position.x += (tx - mesh.position.x) * 0.1;
    mesh.position.y += (ty - mesh.position.y) * 0.1;
    mesh.position.z += (tz - mesh.position.z) * 0.1;
    const targetScale = active ? 1 : 0.001;
    mesh.scale.x += (targetScale - mesh.scale.x) * 0.12;
    mesh.scale.y = mesh.scale.x;
    mesh.scale.z = mesh.scale.x;
    mesh.rotation.x += active ? 0.004 : 0.05;
    mesh.rotation.y += active ? 0.004 : 0.05;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.92, 0.92, 0.92]} />
      <meshStandardMaterial
        color="#ff1f3d"
        emissive="#b30000"
        emissiveIntensity={0.8}
        metalness={0.6}
        roughness={0.25}
      />
    </mesh>
  );
}

function RotatingCore({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });
  return <group ref={ref}>{children}</group>;
}

export default function ServiceSelectorScene({ selected, onToggle }: SceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#ff1f3d" />
      <pointLight position={[-5, -3, 2]} intensity={1.4} color="#b30000" />

      <RotatingCore>
        {SERVICES.map((s) => (
          <CorePiece key={s.key} target={s.piece} active={selected.includes(s.key)} />
        ))}
      </RotatingCore>

      {SERVICES.map((s) => (
        <SatelliteIcon
          key={s.key}
          label={s.label}
          position={s.position}
          active={selected.includes(s.key)}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(s.key);
          }}
        />
      ))}
    </Canvas>
  );
}
