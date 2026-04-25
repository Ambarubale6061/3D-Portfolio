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

// Colors matching the image exactly
const WHITE = "#e8eef5";        // slightly blue-tinted white for the shell
const SHELL_DARK = "#c8d4e0";   // slightly darker white for depth
const FACE_DARK = "#0d1b3e";    // deep navy blue for the face plate
const ACCENT = "#00d4ff";       // bright cyan for glowing elements
const ACCENT_SOFT = "#7eeeff";  // soft cyan for inner eye glow
const ACCENT_MID = "#00aadd";   // mid cyan for smile
const FOREHEAD = "#111827";     // dark forehead panel

export function Robot({ scale = 1, pulseKey }: { scale?: number; pulseKey?: string | number }) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyeScaleL = useRef<THREE.Mesh>(null);
  const eyeScaleR = useRef<THREE.Mesh>(null);
  const eyeInnerL = useRef<THREE.Mesh>(null);
  const eyeInnerR = useRef<THREE.Mesh>(null);
  const eyeTorusL = useRef<THREE.Mesh>(null);
  const eyeTorusR = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const ringOuter = useRef<THREE.Mesh>(null);
  const ringInner = useRef<THREE.Mesh>(null);
  const ringMatOuter = useRef<THREE.MeshBasicMaterial>(null);
  const ringMatInner = useRef<THREE.MeshBasicMaterial>(null);
  const pulseStart = useRef<number>(-999);
  const localMouse = useRef({ x: 0, y: 0 });
  
  // Blink state
  const lastBlinkTime = useRef<number>(0);
  const blinkDuration = 0.18; // seconds for full blink cycle
  const blinkInterval = 3.0;  // blink every 3 seconds

  useEffect(() => {
    pulseStart.current = performance.now() / 1000;
  }, [pulseKey]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
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

    // Head follows cursor
    if (head.current) {
      const targetY = mx * 0.55;
      const targetX = -my * 0.4;
      head.current.rotation.y += (targetY - head.current.rotation.y) * 0.08;
      head.current.rotation.x += (targetX - head.current.rotation.x) * 0.08;
      head.current.rotation.z = Math.sin(t * 0.7) * 0.015;
    }

    // Subtle body sway
    if (root.current) {
      root.current.rotation.y += (mx * 0.15 - root.current.rotation.y) * 0.04;
      root.current.position.y = Math.sin(t * 1.1) * 0.05;
    }

    // Arm swing
    if (armL.current && armR.current) {
      armL.current.rotation.x = Math.sin(t * 1.2) * 0.07 - 0.1;
      armR.current.rotation.x = -Math.sin(t * 1.2) * 0.07 - 0.1;
    }

    // ── Blink animation ──
    // scaleY of eye meshes: 1 = open, ~0.05 = closed
    let blinkScaleY = 1.0;
    const timeSinceBlink = t - lastBlinkTime.current;

    if (timeSinceBlink >= blinkInterval) {
      const blinkT = timeSinceBlink - blinkInterval;
      if (blinkT < blinkDuration) {
        // Smooth close then open using sine curve
        const progress = blinkT / blinkDuration;
        // Goes 0 → 1 → 0 mapped to open → closed → open
        blinkScaleY = 1.0 - Math.sin(progress * Math.PI) * 0.97;
      } else {
        // Blink done, reset timer
        lastBlinkTime.current = t;
      }
    }

    // Apply blink scale to eye meshes (scaleY only — squish vertically)
    const applyBlink = (mesh: THREE.Mesh | null) => {
      if (mesh) mesh.scale.y = blinkScaleY;
    };
    applyBlink(eyeScaleL.current);
    applyBlink(eyeScaleR.current);
    applyBlink(eyeInnerL.current);
    applyBlink(eyeInnerR.current);
    applyBlink(eyeTorusL.current);
    applyBlink(eyeTorusR.current);

    // Landing pulse rings
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
    <group ref={root} scale={scale} position={[0, -0.3, 0]}>
      {/* ── HEAD GROUP ── */}
      <group ref={head} position={[0, 0.95, 0]}>

        {/* Main skull — large, round, slightly flattened sphere */}
        <mesh castShadow>
          <sphereGeometry args={[1.0, 64, 64]} />
          <meshPhysicalMaterial
            color={WHITE}
            roughness={0.18}
            metalness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Small forehead panel (rectangular dark strip at top) */}
        <mesh position={[0, 0.62, 0.85]}>
          <boxGeometry args={[0.32, 0.14, 0.06]} />
          <meshStandardMaterial color={FOREHEAD} metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Forehead panel subtle accent line */}
        <mesh position={[0, 0.62, 0.91]}>
          <boxGeometry args={[0.22, 0.03, 0.02]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.6} />
        </mesh>

        {/* ── FACE PLATE — wide rounded dark visor ── */}
        {/* Large rounded rectangle face area — deep navy */}
        <mesh position={[0, -0.08, 0.72]}>
          <boxGeometry args={[1.35, 0.78, 0.58]} />
          <meshPhysicalMaterial
            color={FACE_DARK}
            metalness={0.85}
            roughness={0.08}
            clearcoat={1}
          />
        </mesh>
        {/* Round the face plate with a slightly larger sphere mask — achieved via front sphere cap */}
        <mesh position={[0, -0.08, 0.82]}>
          <sphereGeometry args={[0.78, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshPhysicalMaterial
            color={FACE_DARK}
            metalness={0.85}
            roughness={0.08}
            clearcoat={1}
          />
        </mesh>

        {/* ── LEFT EYE ── */}
        {/* Outer glow ring */}
        <mesh ref={eyeTorusL} position={[-0.3, 0.0, 0.92]}>
          <torusGeometry args={[0.185, 0.028, 16, 64]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
        {/* Main eye disc — solid dark center with cyan rim */}
        <mesh ref={eyeScaleL} position={[-0.3, 0.0, 0.93]}>
          <circleGeometry args={[0.16, 48]} />
          <meshBasicMaterial color={FACE_DARK} toneMapped={false} />
        </mesh>
        {/* Inner glow disc */}
        <mesh ref={eyeInnerL} position={[-0.3, 0.0, 0.935]}>
          <circleGeometry args={[0.09, 48]} />
          <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} transparent opacity={0.85} />
        </mesh>
        {/* Core bright dot */}
        <mesh position={[-0.3, 0.0, 0.94]}>
          <circleGeometry args={[0.04, 32]} />
          <meshBasicMaterial color={"#ffffff"} toneMapped={false} transparent opacity={0.9} />
        </mesh>

        {/* ── RIGHT EYE ── */}
        <mesh ref={eyeTorusR} position={[0.3, 0.0, 0.92]}>
          <torusGeometry args={[0.185, 0.028, 16, 64]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
        <mesh ref={eyeScaleR} position={[0.3, 0.0, 0.93]}>
          <circleGeometry args={[0.16, 48]} />
          <meshBasicMaterial color={FACE_DARK} toneMapped={false} />
        </mesh>
        <mesh ref={eyeInnerR} position={[0.3, 0.0, 0.935]}>
          <circleGeometry args={[0.09, 48]} />
          <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0.3, 0.0, 0.94]}>
          <circleGeometry args={[0.04, 32]} />
          <meshBasicMaterial color={"#ffffff"} toneMapped={false} transparent opacity={0.9} />
        </mesh>

        {/* ── SMILE — upward arc ── */}
        {/* Main smile arc */}
        <mesh position={[0, -0.34, 0.9]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.2, 0.022, 12, 48, Math.PI * 0.85]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
        {/* Smile inner glow */}
        <mesh position={[0, -0.34, 0.905]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.2, 0.012, 12, 48, Math.PI * 0.85]} />
          <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} transparent opacity={0.7} />
        </mesh>

        {/* ── EYE GLOW point lights ── */}
        <pointLight position={[-0.3, 0.0, 1.5]} intensity={0.6} color={ACCENT} distance={2} />
        <pointLight position={[0.3, 0.0, 1.5]} intensity={0.6} color={ACCENT} distance={2} />

      </group>

      {/* ── NECK ── */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.2, 24]} />
        <meshStandardMaterial color={"#b8c8d8"} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* ── TORSO — round bubble body ── */}
      <mesh position={[0, -0.52, 0]} castShadow>
        <sphereGeometry args={[0.75, 48, 48]} />
        <meshPhysicalMaterial
          color={WHITE}
          roughness={0.2}
          metalness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.12}
        />
      </mesh>
      {/* Chest panel glow strip */}
      <mesh position={[0, -0.44, 0.7]}>
        <boxGeometry args={[0.32, 0.1, 0.04]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={1.0} />
      </mesh>
      <mesh position={[0, -0.6, 0.72]}>
        <boxGeometry args={[0.42, 0.035, 0.03]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.7} />
      </mesh>

      {/* ── SHOULDERS + ARMS ── */}
      {[
        { ref: armL, x: -0.82, sign: -1 },
        { ref: armR, x: 0.82, sign: 1 },
      ].map((arm, i) => (
        <group key={i} ref={arm.ref} position={[arm.x, -0.3, 0]}>
          {/* Shoulder ball */}
          <mesh>
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshPhysicalMaterial color={WHITE} metalness={0.15} roughness={0.25} clearcoat={1} />
          </mesh>
          {/* Upper arm */}
          <mesh position={[arm.sign * 0.06, -0.36, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.48, 24]} />
            <meshStandardMaterial color={"#b8c8d8"} metalness={0.55} roughness={0.4} />
          </mesh>
          {/* Hand sphere */}
          <mesh position={[arm.sign * 0.1, -0.68, 0]}>
            <sphereGeometry args={[0.17, 32, 32]} />
            <meshPhysicalMaterial color={WHITE} metalness={0.15} roughness={0.25} clearcoat={1} />
          </mesh>
        </group>
      ))}

      {/* ── HOVER BASE RING ── */}
      <mesh position={[0, -1.35, 0]}>
        <torusGeometry args={[0.5, 0.055, 16, 64]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.02, 48]} />
        <meshBasicMaterial color={ACCENT_SOFT} toneMapped={false} transparent opacity={0.15} />
      </mesh>

      {/* ── HOLOGRAPHIC LANDING RINGS ── */}
      <mesh ref={ringOuter} position={[0, -1.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.61, 64]} />
        <meshBasicMaterial
          ref={ringMatOuter}
          color={ACCENT}
          toneMapped={false}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ringInner} position={[0, -1.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.43, 64]} />
        <meshBasicMaterial
          ref={ringMatInner}
          color={ACCENT_SOFT}
          toneMapped={false}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ambient glow lights */}
      <pointLight position={[0, 0.4, 1.8]} intensity={1.0} color={ACCENT} distance={4} />
      <pointLight position={[0, -1.35, 0]} intensity={0.7} color={ACCENT} distance={2.5} />
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
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.18;
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
        size={0.035}
        color={ACCENT}
        transparent
        opacity={0.65}
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
        camera={{ position: [0, 0.2, 4.5], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 5, 5]} intensity={1.5} castShadow />
          <directionalLight position={[-4, 2, -2]} intensity={0.5} color={ACCENT} />
          {/* Top rim light to give the white shell that bright highlight */}
          <directionalLight position={[0, 6, 2]} intensity={0.8} color={"#e0f0ff"} />
          <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
            <Robot scale={scale} />
          </Float>
          <Particles count={70} />
          <ContactShadows
            position={[0, -1.75, 0]}
            opacity={0.45}
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