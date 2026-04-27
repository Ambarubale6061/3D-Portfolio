"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// ================= EARTH =================

function Earth() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    ref.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={ref} scale={1.15}> {/* 🔥 Bigger Earth */}
      <sphereGeometry args={[1, 128, 128]} />
      <meshBasicMaterial
        color="#1e90ff"
        toneMapped={false}
      />
    </mesh>
  );
}

// ================= GLOW =================

function Glow() {
  return (
    <mesh scale={1.18}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshBasicMaterial
        color="#00aaff"
        transparent
        opacity={0.04}   // 🔥 ultra subtle (no white halo)
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ================= ROUTES =================

function Arc() {
  const ref = useRef<THREE.Line>(null!);

  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1.2, 0),
    new THREE.Vector3(-1, 0, 0)
  );

  const points = curve.getPoints(60);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#00ffff" />
    </line>
  );
}

// ================= MAIN =================

export function Earth3D() {
  return (
    <div className="w-full h-[500px] flex items-center justify-center bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 50 }} // 🔥 closer camera = bigger earth
        gl={{
          alpha: true,
          antialias: true,
          premultipliedAlpha: false, // 🔥 removes white border issue
        }}
      >
        {/* ❌ No background */}

        <ambientLight intensity={1} />

        <Earth />
        <Glow />
        <Arc />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minDistance={2.2}
          maxDistance={2.2}
          autoRotate
          autoRotateSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}