import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Environment,
  Grid,
  Sparkles,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useRef, useMemo, useEffect, RefObject } from "react";
import * as THREE from "three";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  WHITE:      "#e8f4ff",
  WHITE_PURE: "#ffffff",
  FACE:       "#050e1c",
  DARK:       "#080f1e",
  CYAN:       "#00e5ff",
  CYAN_SOFT:  "#0099cc",
  CYAN_GLOW:  "#33ffff",
  JOINT:      "#003f99",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────
// FIX: include `| null` to match what useRef<T>(null) actually returns in React 18+
type MeshRef  = RefObject<THREE.Mesh | null>;
type GroupRef = RefObject<THREE.Group | null>;

interface BlinkTriple {
  ring: MeshRef;
  fill: MeshRef;
  glow: MeshRef;
}

interface EyeProps {
  x: number;
  refs: BlinkTriple;
  m: ReturnType<typeof useMaterials>;
}

interface ArmProps {
  armRef: GroupRef;
  x: number;
  sign: 1 | -1;
  m: ReturnType<typeof useMaterials>;
}

interface LegProps {
  legRef: GroupRef;
  x: number;
  m: ReturnType<typeof useMaterials>;
}

// ─── Shared Material Hook ─────────────────────────────────────────────────────
function useMaterials() {
  return useMemo(() => ({
    ceramic: new THREE.MeshPhysicalMaterial({
      color:               new THREE.Color(C.WHITE),
      roughness:           0.04,
      metalness:           0.15,
      clearcoat:           1.0,
      clearcoatRoughness:  0.05,
      reflectivity:        0.9,
    }),
    ceramicBright: new THREE.MeshPhysicalMaterial({
      color:               new THREE.Color(C.WHITE_PURE),
      roughness:           0.06,
      metalness:           0.1,
      clearcoat:           1.0,
      clearcoatRoughness:  0.04,
    }),
    face: new THREE.MeshStandardMaterial({
      color:     new THREE.Color(C.FACE),
      roughness: 0.3,
      metalness: 0.8,
    }),
    dark: new THREE.MeshStandardMaterial({
      color:     new THREE.Color(C.DARK),
      roughness: 0.4,
      metalness: 0.85,
    }),
    cyan: new THREE.MeshStandardMaterial({
      color:             new THREE.Color(C.CYAN),
      emissive:          new THREE.Color(C.CYAN),
      emissiveIntensity: 4.0,
      roughness:         0.05,
      metalness:         0.0,
    }),
    cyanSoft: new THREE.MeshStandardMaterial({
      color:             new THREE.Color(C.CYAN_SOFT),
      emissive:          new THREE.Color(C.CYAN_SOFT),
      emissiveIntensity: 2.5,
      roughness:         0.1,
      metalness:         0.0,
    }),
    cyanGlow: new THREE.MeshBasicMaterial({
      color: new THREE.Color(C.CYAN_GLOW),
    }),
    joint: new THREE.MeshStandardMaterial({
      color:             new THREE.Color(C.JOINT),
      emissive:          new THREE.Color("#002277"),
      emissiveIntensity: 1.0,
      roughness:         0.25,
      metalness:         0.6,
    }),
  }), []);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Eye({ x, refs, m }: EyeProps) {
  return (
    <group position={[x, 0.05, 1.04]}>
      <mesh ref={refs.ring} material={m.cyan}>
        <torusGeometry args={[0.195, 0.034, 20, 72]} />
      </mesh>
      <mesh ref={refs.fill} position={[0, 0, -0.01]} material={m.face}>
        <circleGeometry args={[0.162, 56]} />
      </mesh>
      <mesh ref={refs.glow} position={[0, 0, 0.012]} material={m.cyanSoft}>
        <circleGeometry args={[0.082, 48]} />
      </mesh>
      <mesh position={[0, 0, 0.028]} material={m.cyanGlow}>
        <circleGeometry args={[0.030, 28]} />
      </mesh>
      <pointLight color={C.CYAN} intensity={2.2} distance={2.4} position={[0, 0, 0.3]} />
    </group>
  );
}

function Arm({ armRef, x, sign, m }: ArmProps) {
  return (
    <group ref={armRef} position={[x, -0.3, 0]}>
      {/* Shoulder */}
      <mesh castShadow material={m.ceramicBright} position={[sign * 0.06, 0, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
      </mesh>
      <mesh material={m.joint} position={[sign * 0.06, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.145, 0.022, 12, 36]} />
      </mesh>

      {/* Upper arm */}
      <mesh castShadow material={m.ceramic} position={[sign * 0.16, -0.26, 0]} rotation={[0, 0, sign * 0.2]}>
        <cylinderGeometry args={[0.10, 0.088, 0.38, 16]} />
      </mesh>

      {/* Elbow */}
      <mesh material={m.ceramicBright} position={[sign * 0.21, -0.49, 0]}>
        <sphereGeometry args={[0.115, 18, 18]} />
      </mesh>
      <mesh material={m.joint} position={[sign * 0.21, -0.49, 0]}>
        <torusGeometry args={[0.082, 0.015, 10, 28]} />
      </mesh>

      {/* Lower arm */}
      <mesh castShadow material={m.ceramic} position={[sign * 0.23, -0.69, 0]} rotation={[0, 0, sign * 0.1]}>
        <cylinderGeometry args={[0.082, 0.075, 0.30, 16]} />
      </mesh>

      {/* Hand */}
      <mesh material={m.ceramicBright} position={[sign * 0.25, -0.88, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
      </mesh>

      {/* Claws */}
      {([-1, 0, 1] as const).map((ci) => (
        <mesh
          key={ci}
          material={m.dark}
          position={[sign * 0.25 + ci * 0.055, -1.01, 0.03 + Math.abs(ci) * 0.01]}
          rotation={[0.18, 0, ci * 0.16 * -sign]}
        >
          <coneGeometry args={[0.024, 0.115, 10]} />
        </mesh>
      ))}
    </group>
  );
}

function Leg({ legRef, x, m }: LegProps) {
  return (
    <group ref={legRef} position={[x, -1.1, 0]}>
      {/* Hip */}
      <mesh material={m.ceramicBright}>
        <sphereGeometry args={[0.185, 20, 20]} />
      </mesh>
      <mesh material={m.joint}>
        <torusGeometry args={[0.12, 0.018, 10, 30]} />
      </mesh>

      {/* Upper leg */}
      <mesh castShadow material={m.ceramic} position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.115, 0.100, 0.32, 18]} />
      </mesh>

      {/* Knee */}
      <mesh material={m.ceramicBright} position={[0, -0.44, 0]}>
        <sphereGeometry args={[0.125, 16, 16]} />
      </mesh>
      <mesh material={m.cyanSoft} position={[0, -0.44, 0]}>
        <torusGeometry args={[0.088, 0.015, 10, 28]} />
      </mesh>

      {/* Lower leg */}
      <mesh castShadow material={m.ceramic} position={[0, -0.63, 0]}>
        <cylinderGeometry args={[0.095, 0.115, 0.28, 16]} />
      </mesh>

      {/* Foot */}
      <mesh castShadow material={m.ceramicBright} position={[0, -0.82, 0.03]}>
        <sphereGeometry args={[0.15, 20, 20]} />
      </mesh>

      {/* Thruster nozzle */}
      <mesh material={m.dark} position={[0, -0.9, 0.03]}>
        <cylinderGeometry args={[0.082, 0.062, 0.06, 16]} />
      </mesh>
      <mesh material={m.cyan} position={[0, -0.91, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.064, 0.011, 10, 28]} />
      </mesh>
      <pointLight color={C.CYAN} intensity={1.4} distance={1.8} position={[0, -0.95, 0.03]} />
    </group>
  );
}

// ─── Robot ────────────────────────────────────────────────────────────────────
interface RobotProps {
  scale?: number;
}

// FIX: exported as a named export so `import { Robot } from "./RobotAvatar"` works
export function Robot({ scale = 1 }: RobotProps) {
  const m = useMaterials();

  // FIX: all refs now typed as `T | null` to match useRef<T>(null) return type
  const rootRef:     GroupRef = useRef<THREE.Group | null>(null);
  const headRef:     GroupRef = useRef<THREE.Group | null>(null);
  const armLRef:     GroupRef = useRef<THREE.Group | null>(null);
  const armRRef:     GroupRef = useRef<THREE.Group | null>(null);
  const legLRef:     GroupRef = useRef<THREE.Group | null>(null);
  const legRRef:     GroupRef = useRef<THREE.Group | null>(null);
  const coreRingRef: MeshRef  = useRef<THREE.Mesh | null>(null);
  const coreGlobRef: MeshRef  = useRef<THREE.Mesh | null>(null);

  // Blink refs
  const blinkRefs: { L: BlinkTriple; R: BlinkTriple } = {
    L: {
      ring: useRef<THREE.Mesh | null>(null),
      fill: useRef<THREE.Mesh | null>(null),
      glow: useRef<THREE.Mesh | null>(null),
    },
    R: {
      ring: useRef<THREE.Mesh | null>(null),
      fill: useRef<THREE.Mesh | null>(null),
      glow: useRef<THREE.Mesh | null>(null),
    },
  };

  const mouse     = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastBlink = useRef<number>(0);
  const BLINK_INT = 4.5;
  const BLINK_DUR = 0.12;

  useEffect(() => {
    const onMove = (e: MouseEvent): void => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    const t  = clock.elapsedTime;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    // Body float + sway
    if (rootRef.current) {
      rootRef.current.position.y  = Math.sin(t * 1.3) * 0.09 - 0.25;
      rootRef.current.rotation.y += (mx * 0.12 - rootRef.current.rotation.y) * 0.04;
    }

    // Head tracking
    if (headRef.current) {
      headRef.current.rotation.y += (mx * 0.5  - headRef.current.rotation.y) * 0.07;
      headRef.current.rotation.x += (-my * 0.35 - headRef.current.rotation.x) * 0.07;
      headRef.current.rotation.z  = Math.sin(t * 0.6) * 0.015;
    }

    // Arm idle
    if (armLRef.current) armLRef.current.rotation.x =  Math.sin(t * 1.3) * 0.07 - 0.08;
    if (armRRef.current) armRRef.current.rotation.x = -Math.sin(t * 1.3) * 0.07 - 0.08;

    // Leg idle
    if (legLRef.current) legLRef.current.rotation.x =  Math.sin(t * 1.3) * 0.03;
    if (legRRef.current) legRRef.current.rotation.x = -Math.sin(t * 1.3) * 0.03;

    // Blink
    let blinkScaleY = 1.0;
    const sinceB = t - lastBlink.current;
    if (sinceB >= BLINK_INT) {
      const bt = sinceB - BLINK_INT;
      if (bt < BLINK_DUR) {
        blinkScaleY = 1 - Math.sin((bt / BLINK_DUR) * Math.PI) * 0.95;
      } else if (bt > BLINK_DUR + 0.06) {
        lastBlink.current = t;
      }
    }
    const applyBlink = (r: MeshRef): void => {
      if (r.current) r.current.scale.y = blinkScaleY;
    };
    applyBlink(blinkRefs.L.ring); applyBlink(blinkRefs.L.fill); applyBlink(blinkRefs.L.glow);
    applyBlink(blinkRefs.R.ring); applyBlink(blinkRefs.R.fill); applyBlink(blinkRefs.R.glow);

    // Core pulse
    const pulse = 0.9 + Math.sin(t * 2.6) * 0.1;
    if (coreGlobRef.current) {
      coreGlobRef.current.scale.setScalar(pulse);
    }
    if (coreRingRef.current) {
      (coreRingRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        3.5 + Math.sin(t * 2.6) * 1.0;
    }
  });

  return (
    <group ref={rootRef} scale={scale} position={[0, -0.25, 0]}>

      {/* ══════════ HEAD (oversized) ══════════ */}
      <group ref={headRef} position={[0, 1.22, 0]}>

        {/* Main skull */}
        <mesh castShadow receiveShadow material={m.ceramic}>
          <sphereGeometry args={[1.12, 72, 72]} />
        </mesh>

        {/* Dark face plate */}
        <mesh position={[0, -0.14, 0.08]} material={m.face}>
          <sphereGeometry args={[1.01, 56, 56, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
        </mesh>

        {/* Forehead camera area */}
        <group position={[0, 0.54, 0.95]}>
          <mesh material={m.face} position={[0, 0.1, 0]}>
            <boxGeometry args={[0.72, 0.15, 0.07]} />
          </mesh>
          <mesh material={m.dark}>
            <sphereGeometry args={[0.058, 18, 18]} />
          </mesh>
          <mesh position={[0, 0, 0.05]} material={m.cyanGlow}>
            <circleGeometry args={[0.028, 22]} />
          </mesh>
          <pointLight color={C.CYAN} intensity={1.0} distance={1.2} />
        </group>

        {/* Ear bumps with cyan rings */}
        {([-1, 1] as const).map((side) => (
          <group key={side} position={[side * 1.04, 0.04, 0]}>
            <mesh castShadow material={m.ceramicBright}>
              <sphereGeometry args={[0.21, 24, 24]} />
            </mesh>
            <mesh material={m.cyan} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.135, 0.020, 12, 36]} />
            </mesh>
            <pointLight color={C.CYAN} intensity={0.8} distance={1.0} />
          </group>
        ))}

        {/* Eyes */}
        <Eye x={-0.34} refs={blinkRefs.L} m={m} />
        <Eye x={ 0.34} refs={blinkRefs.R} m={m} />

        {/* Smile arc */}
        <mesh
          position={[0, -0.38, 1.02]}
          rotation={[0, 0, Math.PI + Math.PI * 0.1]}
          material={m.cyan}
        >
          <torusGeometry args={[0.175, 0.019, 14, 56, Math.PI * 0.65]} />
        </mesh>

        {/* Internal coolant ring band */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.92, 0.016, 10, 72]} />
          <meshStandardMaterial
            color={C.CYAN_SOFT}
            emissive={new THREE.Color(C.CYAN)}
            emissiveIntensity={0.7}
          />
        </mesh>
      </group>

      {/* ══════════ NECK ══════════ */}
      <group position={[0, 0.18, 0]}>
        <mesh castShadow material={m.dark}>
          <cylinderGeometry args={[0.155, 0.205, 0.25, 24]} />
        </mesh>
        {([-0.1, 0.1] as const).map((nx) => (
          <mesh key={nx} position={[nx, 0, 0.09]} rotation={[0.15, 0, 0]} material={m.ceramicBright}>
            <cylinderGeometry args={[0.018, 0.018, 0.22, 10]} />
          </mesh>
        ))}
      </group>

      {/* ══════════ TORSO (compact) ══════════ */}
      <group position={[0, -0.44, 0]}>
        <mesh castShadow receiveShadow material={m.ceramic} scale={[1.12, 0.92, 1.0]}>
          <sphereGeometry args={[0.60, 52, 52]} />
        </mesh>

        {/* Chest core ring */}
        <group position={[0, 0.06, 0.59]}>
          <mesh ref={coreRingRef} material={m.cyan} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.195, 0.032, 18, 72]} />
          </mesh>
          <mesh material={m.face}>
            <circleGeometry args={[0.162, 48]} />
          </mesh>
          <mesh ref={coreGlobRef} material={m.cyanGlow}>
            <sphereGeometry args={[0.080, 24, 24]} />
          </mesh>
          <pointLight color={C.CYAN} intensity={3.0} distance={3.5} />
        </group>
      </group>

      {/* Hips */}
      <mesh position={[0, -0.88, 0]} castShadow material={m.ceramic} scale={[1.05, 0.80, 1.0]}>
        <sphereGeometry args={[0.40, 32, 32]} />
      </mesh>

      {/* ══════════ ARMS ══════════ */}
      <Arm armRef={armLRef} x={-0.74} sign={-1} m={m} />
      <Arm armRef={armRRef} x={ 0.74} sign={ 1} m={m} />

      {/* ══════════ LEGS ══════════ */}
      <Leg legRef={legLRef} x={-0.27} m={m} />
      <Leg legRef={legRRef} x={ 0.27} m={m} />

      {/* ══════════ THRUSTER EMISSIONS ══════════ */}
      <group position={[0, -1.95, 0]}>
        <Sparkles count={200} scale={1.6} size={4}  speed={0.30} color={C.CYAN}    opacity={0.80} />
        <Sparkles count={70}  scale={0.8} size={9}  speed={0.65} color="#ffffff"   opacity={0.90} />
        <pointLight color={C.CYAN} intensity={4.0} distance={4.0} position={[0, 0.25, 0]} />
      </group>

    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <fog attach="fog" args={["#010c1a", 6, 18]} />

      <ambientLight intensity={0.06} color="#203050" />
      <spotLight
        position={[4.5, 8, 6]}
        angle={0.35}
        penumbra={0.9}
        intensity={3.5}
        color="#ddeeff"
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight
        position={[-6, 4, -6]}
        angle={0.5}
        penumbra={1.0}
        intensity={6.0}
        color="#0033cc"
      />
      <pointLight position={[0, -2.8, 2.8]} intensity={0.6} color={C.CYAN} distance={8} />

      <Float speed={1.35} rotationIntensity={0.07} floatIntensity={0.32}>
        <Robot scale={1} />
      </Float>

      {/* Floor */}
      <group position={[0, -2.22, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <MeshReflectorMaterial
            blur={[400, 80]}
            resolution={1024}
            mixBlur={0.9}
            mixStrength={90}
            roughness={0.95}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#060e1a"
            metalness={0.8}
            mirror={0.6}
          />
        </mesh>
        <Grid
          infiniteGrid
          fadeDistance={30}
          cellColor={C.CYAN}
          sectionColor={C.CYAN_SOFT}
          cellThickness={0.5}
          sectionThickness={1.3}
          sectionSize={2.0}
          cellSize={0.4}
          position={[0, 0.005, 0]}
        />
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.95}
          scale={14}
          blur={3.0}
          far={5}
          color="#000010"
        />
      </group>

      {/* Ambient dust */}
      <Sparkles count={400} scale={16} size={1.5} speed={0.06} opacity={0.16} color="#ffffff" />

      <Environment preset="night" environmentIntensity={0.10} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          kernelSize={4}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          offset={[0.0008, 0.0008] as unknown as THREE.Vector2}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}

// ─── Public Export ────────────────────────────────────────────────────────────
interface ChibiRobotProps {
  className?: string;
}

export default function ChibiRobot({ className = "" }: ChibiRobotProps) {
  return (
    <div
      className={className}
      style={{
        width:    "100%",
        height:   "100vh",
        background: "#020a14",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset:    0,
          background:
            "radial-gradient(ellipse at center, #071828 0%, #020a14 55%, #000000 100%)",
          pointerEvents: "none",
        }}
      />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.4, 6.5], fov: 33 }}
        gl={{
          antialias:            true,
          alpha:                false,
          toneMapping:          THREE.ACESFilmicToneMapping,
          toneMappingExposure:  0.80,
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}