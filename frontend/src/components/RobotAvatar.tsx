import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { hasWebGL } from "@/lib/webgl";

const WEBGL_OK = hasWebGL();

const mouse = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  });
}

const WHITE = "#f3f4f6";
const DARK = "#0a0d14";
const ACCENT = "#22d3ee";
const ACCENT_SOFT = "#38bdf8";

export function Robot({ scale = 1, pulseKey }: { scale?: number; pulseKey?: string | number }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const visor = useRef<THREE.MeshStandardMaterial>(null);
  const ringOuter = useRef<THREE.Mesh>(null);
  const ringInner = useRef<THREE.Mesh>(null);
  const ringMatOuter = useRef<THREE.MeshBasicMaterial>(null);
  const ringMatInner = useRef<THREE.MeshBasicMaterial>(null);
  const pulseStart = useRef<number>(-999);
  const { size } = useThree();
  const localMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    pulseStart.current = performance.now() / 1000;
  }, [pulseKey]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = (e.target as HTMLElement)?.getBoundingClientRect?.();
      // Normalize against full window for consistent global tracking
      localMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      localMouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const mx = localMouse.current.x;
    const my = localMouse.current.y;

    if (head.current) {
      // Look at cursor
      const targetY = mx * 0.7;
      const targetX = -my * 0.5;
      head.current.rotation.y += (targetY - head.current.rotation.y) * 0.1;
      head.current.rotation.x += (targetX - head.current.rotation.x) * 0.1;
      head.current.rotation.z = Math.sin(t * 0.8) * 0.02;
    }
    if (root.current) {
      // Subtle body sway following cursor
      root.current.rotation.y += (mx * 0.25 - root.current.rotation.y) * 0.05;
      root.current.position.y = Math.sin(t * 1.2) * 0.06;
    }
    if (eyeL.current && eyeR.current) {
      const ox = mx * 0.04;
      const oy = my * 0.03;
      eyeL.current.position.x = -0.18 + ox;
      eyeR.current.position.x = 0.18 + ox;
      eyeL.current.position.y = 0.05 + oy;
      eyeR.current.position.y = 0.05 + oy;
    }
    if (visor.current) {
      const pulse = 0.7 + Math.sin(t * 2.4) * 0.25;
      visor.current.emissiveIntensity = pulse;
    }
    if (armL.current && armR.current) {
      armL.current.rotation.x = Math.sin(t * 1.3) * 0.08 - 0.1;
      armR.current.rotation.x = -Math.sin(t * 1.3) * 0.08 - 0.1;
    }

    // Holographic landing pulse — outer expands & fades, inner gives a quick flash
    const dt = t - pulseStart.current;
    if (ringOuter.current && ringMatOuter.current) {
      if (dt >= 0 && dt < 1.4) {
        const p = dt / 1.4;
        const s = 0.6 + p * 2.6;
        ringOuter.current.scale.set(s, s, 1);
        ringMatOuter.current.opacity = (1 - p) * 0.85;
      } else {
        ringMatOuter.current.opacity = 0;
      }
    }
    if (ringInner.current && ringMatInner.current) {
      if (dt >= 0 && dt < 0.8) {
        const p = dt / 0.8;
        const s = 0.5 + p * 1.4;
        ringInner.current.scale.set(s, s, 1);
        ringMatInner.current.opacity = (1 - p) * 0.6;
      } else {
        ringMatInner.current.opacity = 0;
      }
    }
  });

  return (
    <group ref={root} scale={scale} position={[0, -0.4, 0]}>
      {/* Head */}
      <group ref={head} position={[0, 1.1, 0]}>
        {/* Skull */}
        <mesh castShadow>
          <sphereGeometry args={[0.85, 64, 64]} />
          <meshPhysicalMaterial
            color={WHITE}
            roughness={0.25}
            metalness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.35, 16]} />
          <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.18, 0]}>
          <sphereGeometry args={[0.07, 24, 24]} />
          <meshStandardMaterial
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={1.5}
          />
        </mesh>
        {/* Visor (face plate) */}
        <mesh position={[0, 0.05, 0.55]}>
          <boxGeometry args={[1.05, 0.55, 0.6]} />
          <meshPhysicalMaterial
            ref={visor}
            color={DARK}
            metalness={0.9}
            roughness={0.05}
            clearcoat={1}
            emissive={ACCENT}
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Eyes (glowing rings) */}
        <mesh ref={eyeL} position={[-0.18, 0.05, 0.86]}>
          <torusGeometry args={[0.13, 0.035, 16, 48]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
        <mesh ref={eyeR} position={[0.18, 0.05, 0.86]}>
          <torusGeometry args={[0.13, 0.035, 16, 48]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
        {/* Eye inner glow */}
        <mesh position={[-0.18, 0.05, 0.85]}>
          <circleGeometry args={[0.09, 32]} />
          <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.18, 0.05, 0.85]}>
          <circleGeometry args={[0.09, 32]} />
          <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} transparent opacity={0.55} />
        </mesh>
        {/* Smile */}
        <mesh position={[0, -0.22, 0.86]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.12, 0.018, 12, 24, Math.PI]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
        {/* Side ear pods */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.85, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.22, 0.22, 0.18, 32]} />
              <meshPhysicalMaterial color={WHITE} metalness={0.2} roughness={0.3} clearcoat={1} />
            </mesh>
            <mesh position={[s * 0.05, 0, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.22, 32]} />
              <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Neck */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.25, 24]} />
        <meshStandardMaterial color={DARK} metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshPhysicalMaterial
          color={WHITE}
          roughness={0.25}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </mesh>
      {/* Chest panel */}
      <mesh position={[0, -0.05, 0.78]}>
        <boxGeometry args={[0.45, 0.18, 0.05]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.9}
        />
      </mesh>
      <mesh position={[0, -0.3, 0.82]}>
        <boxGeometry args={[0.55, 0.04, 0.04]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.8} />
      </mesh>

      {/* Shoulders + arms */}
      {[
        { ref: armL, x: -0.95, sign: -1 },
        { ref: armR, x: 0.95, sign: 1 },
      ].map((arm, i) => (
        <group key={i} ref={arm.ref} position={[arm.x, 0.05, 0]}>
          <mesh>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshPhysicalMaterial color={WHITE} metalness={0.2} roughness={0.3} clearcoat={1} />
          </mesh>
          <mesh position={[arm.sign * 0.05, -0.4, 0]}>
            <cylinderGeometry args={[0.16, 0.18, 0.55, 24]} />
            <meshStandardMaterial color={DARK} metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[arm.sign * 0.08, -0.78, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshPhysicalMaterial color={WHITE} metalness={0.2} roughness={0.3} clearcoat={1} />
          </mesh>
        </group>
      ))}

      {/* Hover base (no legs — floating robot) */}
      <mesh position={[0, -1.1, 0]}>
        <torusGeometry args={[0.55, 0.06, 16, 64]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 48]} />
        <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} transparent opacity={0.18} />
      </mesh>

      {/* Holographic landing rings (animated on pulse) */}
      <mesh ref={ringOuter} position={[0, -1.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.66, 64]} />
        <meshBasicMaterial
          ref={ringMatOuter}
          color={ACCENT}
          toneMapped={false}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ringInner} position={[0, -1.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.48, 64]} />
        <meshBasicMaterial
          ref={ringMatInner}
          color={ACCENT_SOFT}
          toneMapped={false}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Halo glow point lights */}
      <pointLight position={[0, 0.5, 1.5]} intensity={1.2} color={ACCENT} distance={4} />
      <pointLight position={[0, -1.1, 0]} intensity={0.8} color={ACCENT} distance={2.5} />
    </group>
  );
}

function Particles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef(
    new Float32Array(
      Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 6),
    ),
  );
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={ACCENT}
        transparent
        opacity={0.7}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

interface RobotAvatarProps {
  className?: string;
  scale?: number;
  glow?: boolean;
}

export function RobotAvatar({ className = "", scale = 1, glow = true }: RobotAvatarProps) {
  if (!WEBGL_OK) {
    return (
      <div className={`relative ${className}`}>
        <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-slate-900 border border-cyan-400/30 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-slate-200 shadow-[0_0_60px_rgba(34,211,238,0.5)]" />
        </div>
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      {glow && (
        <div className="absolute inset-0 -z-10 blur-[80px] bg-gradient-radial from-cyan-500/30 via-cyan-400/10 to-transparent rounded-full pointer-events-none" />
      )}
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.3, 4.2], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} castShadow />
          <directionalLight position={[-4, 2, -2]} intensity={0.6} color={ACCENT} />
          <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
            <Robot scale={scale} />
          </Float>
          <Particles count={80} />
          <ContactShadows
            position={[0, -1.55, 0]}
            opacity={0.5}
            scale={6}
            blur={2.5}
            far={3}
            color="#000000"
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
