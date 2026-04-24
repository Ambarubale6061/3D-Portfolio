import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";
import { hasWebGL } from "@/lib/webgl";

const WEBGL_OK = hasWebGL();

const earthVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const earthFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  uniform float uTime;
  uniform vec3 uLightDir;

  // ---- noise (iq) ----
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
                       dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                   mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                       dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
               mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                       dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                   mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                       dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }
  float fbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.04; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 sp = n;
    float lat = sp.y;

    // Continents — sharper, more detail
    float c = fbm(sp * 2.2 + vec3(3.1, 1.7, 9.4));
    c += 0.5 * fbm(sp * 5.0);
    c += 0.25 * fbm(sp * 11.0);
    float land = smoothstep(0.05, 0.16, c);

    // Coastline highlight (shallow water)
    float coast = smoothstep(0.0, 0.05, c) * (1.0 - land);

    // Ocean — gradient by depth
    vec3 deep = vec3(0.01, 0.06, 0.22);
    vec3 mid = vec3(0.04, 0.18, 0.45);
    vec3 shallow = vec3(0.12, 0.48, 0.78);
    float oceanMix = clamp(c * 1.8 + 0.5, 0.0, 1.0);
    vec3 ocean = mix(deep, mid, oceanMix);
    ocean = mix(ocean, shallow, coast);

    // Land variation — biomes
    float detail = fbm(sp * 9.0);
    float micro = fbm(sp * 22.0);
    vec3 forest = vec3(0.10, 0.30, 0.09);
    vec3 jungle = vec3(0.06, 0.22, 0.06);
    vec3 plain = vec3(0.40, 0.45, 0.18);
    vec3 desert = vec3(0.78, 0.62, 0.32);
    vec3 mountain = vec3(0.32, 0.26, 0.20);
    vec3 landCol = mix(forest, plain, smoothstep(0.0, 0.6, detail));
    landCol = mix(landCol, jungle, smoothstep(0.0, 0.3, detail) * (1.0 - smoothstep(0.0, 0.35, abs(lat))));
    landCol = mix(landCol, desert, smoothstep(0.55, 0.85, detail) * (1.0 - smoothstep(0.55, 0.95, abs(lat))));
    landCol = mix(landCol, mountain, smoothstep(0.7, 0.95, c));
    landCol *= 0.85 + 0.3 * micro;

    vec3 col = mix(ocean, landCol, land);

    // Snowy poles + ice caps
    float pole = smoothstep(0.6, 0.88, abs(lat));
    col = mix(col, vec3(0.95, 0.97, 1.0), pole);

    // Two cloud layers (drifting at different speeds)
    float cloud1 = fbm(sp * 3.2 + vec3(uTime * 0.04, 0.0, -uTime * 0.02));
    float cloud2 = fbm(sp * 5.5 + vec3(-uTime * 0.025, uTime * 0.018, uTime * 0.03));
    float cloud = max(smoothstep(0.48, 0.72, cloud1) * 0.55, smoothstep(0.55, 0.78, cloud2) * 0.4);
    col = mix(col, vec3(1.0), cloud);

    // Lighting
    float diffuse = clamp(dot(n, normalize(uLightDir)), 0.0, 1.0);
    float ambient = 0.18;
    float lighting = ambient + diffuse * 0.95;

    // Specular ocean highlight
    vec3 h = normalize(uLightDir + vViewDir);
    float spec = pow(max(dot(n, h), 0.0), 48.0) * (1.0 - land) * 0.85;

    col = col * lighting + spec * vec3(0.7, 0.85, 1.0);

    // Fresnel atmosphere rim
    float fres = pow(1.0 - max(dot(n, vViewDir), 0.0), 2.3);
    col += vec3(0.25, 0.6, 1.0) * fres * 0.7;

    // Night side — city lights effect
    float night = 1.0 - diffuse;
    float cityGlow = smoothstep(0.55, 0.95, fbm(sp * 18.0)) * land * night;
    col += vec3(1.0, 0.75, 0.35) * cityGlow * 0.6;
    col += vec3(0.05, 0.18, 0.32) * night * 0.35;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function EarthMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(0.6, 0.4, 0.8).normalize() },
    }),
    [],
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (matRef.current) {
      (matRef.current.uniforms.uTime.value as number) = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 128, 128]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={earthVert}
          fragmentShader={earthFrag}
          uniforms={uniforms}
        />
      </mesh>
      {/* Inner atmosphere glow */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          uniforms={{}}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
              vec4 wp = modelMatrix * vec4(position, 1.0);
              vNormal = normalize(mat3(modelMatrix) * normal);
              vView = normalize(cameraPosition - wp.xyz);
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
              float f = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
              gl_FragColor = vec4(vec3(0.3, 0.65, 1.0) * f * 1.4, f * 0.9);
            }
          `}
        />
      </mesh>
      {/* Outer atmosphere halo */}
      <mesh scale={1.18}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          uniforms={{}}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
              vec4 wp = modelMatrix * vec4(position, 1.0);
              vNormal = normalize(mat3(modelMatrix) * normal);
              vView = normalize(cameraPosition - wp.xyz);
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
              float f = pow(1.0 - abs(dot(vNormal, vView)), 3.5);
              gl_FragColor = vec4(vec3(0.2, 0.55, 1.0) * f * 0.8, f * 0.6);
            }
          `}
        />
      </mesh>
    </group>
  );
}

interface Earth3DProps {
  className?: string;
}

export function Earth3D({ className = "" }: Earth3DProps) {
  if (!WEBGL_OK) {
    return (
      <div className={`relative ${className}`}>
        <div className="aspect-square w-full rounded-full bg-gradient-to-br from-blue-700 via-cyan-500 to-emerald-600 shadow-[0_0_80px_rgba(56,189,248,0.5)]" />
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 2.7], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 3, 5]} intensity={1.4} />
          <directionalLight position={[-4, 1, -3]} intensity={0.4} color="#22d3ee" />
          <EarthMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
