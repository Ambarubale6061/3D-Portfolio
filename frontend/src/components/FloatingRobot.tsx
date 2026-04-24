import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, ContactShadows, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Robot } from "./RobotAvatar";
import { hasWebGL } from "@/lib/webgl";
import { playWhoosh, setRobotMuted, isRobotMuted } from "@/lib/robotSound";
import { Volume2, VolumeX } from "lucide-react";

const WEBGL_OK = hasWebGL();
const SIZE = 480;

type ActiveData = { id: string; prompt: string; side: "left" | "right" };

export function FloatingRobot() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActiveData | null>(null);
  const [muted, setMuted] = useState(isRobotMuted());
  const activeIdRef = useRef<string | null>(null);
  const target = useRef({ x: 0, y: 0, scale: 1, opacity: 0 });
  const cur = useRef({ x: 0, y: 0, scale: 0.8, opacity: 0 });
  const initialized = useRef(false);

  useEffect(() => {
    if (!WEBGL_OK) return;
    let raf = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-robot-anchor]"),
      );
      const vh = window.innerHeight;
      const vc = vh * 0.5;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const ec = r.top + r.height / 2;
        const d = Math.abs(ec - vc);
        if (d < bestDist) {
          bestDist = d;
          best = el;
        }
      }

      if (best) {
        const id = best.dataset.robotAnchor!;
        if (id !== activeIdRef.current) {
          const isFirst = activeIdRef.current === null;
          activeIdRef.current = id;
          setActive({
            id,
            prompt: best.dataset.robotPrompt ?? "",
            side: (best.dataset.robotSide as "left" | "right") ?? "right",
          });
          if (!isFirst) playWhoosh();
        }
        const r = best.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        target.current.x = cx - SIZE / 2;
        target.current.y = cy - SIZE / 2;
        const minDim = Math.min(r.width, r.height);
        // Scale relative to anchor box, but cap so the robot always fits in SIZE
        target.current.scale = Math.max(0.55, Math.min(1.15, minDim / 460));
        target.current.opacity = 1;
      } else {
        target.current.opacity = 0;
      }

      const ease = initialized.current ? 0.12 : 1;
      cur.current.x = lerp(cur.current.x, target.current.x, ease);
      cur.current.y = lerp(cur.current.y, target.current.y, ease);
      cur.current.scale = lerp(cur.current.scale, target.current.scale, ease * 0.85);
      cur.current.opacity = lerp(cur.current.opacity, target.current.opacity, 0.1);
      initialized.current = true;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${cur.current.x}px, ${cur.current.y}px, 0) scale(${cur.current.scale})`;
        ref.current.style.opacity = String(cur.current.opacity);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!WEBGL_OK) return null;

  return (
    <>
      <button
        data-hover
        onClick={() => {
          const next = !muted;
          setRobotMuted(next);
          setMuted(next);
        }}
        aria-label={muted ? "Unmute robot sounds" : "Mute robot sounds"}
        className="fixed bottom-6 left-6 z-[9980] w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-cyan-200 hover:text-cyan-100 hover:bg-slate-900/90 transition-colors flex items-center justify-center shadow-lg"
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    <div
      ref={ref}
      className="fixed top-0 left-0 z-30 pointer-events-none will-change-transform"
      style={{ width: SIZE, height: SIZE, opacity: 0, transformOrigin: "center center" }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.1, 7.6], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#22d3ee" />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <Robot scale={1} pulseKey={active?.id ?? "none"} />
        </Float>
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
          far={3}
          color="#000000"
        />
        <Environment preset="city" />
      </Canvas>

      <AnimatePresence mode="wait">
        {active?.prompt && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`absolute top-[14%] ${active.side === "right" ? "left-[88%]" : "right-[88%]"} pointer-events-none`}
            style={{ transform: "translateZ(0)" }}
          >
            <div
              className={`relative px-3.5 py-2 w-[200px] rounded-2xl bg-slate-900/90 backdrop-blur-md border border-cyan-400/40 text-[13px] leading-snug text-cyan-50 shadow-[0_8px_30px_rgba(34,211,238,0.3)] ${active.side === "right" ? "rounded-bl-sm" : "rounded-br-sm text-right"}`}
            >
              {active.prompt}
              <span
                className={`absolute top-3 w-2.5 h-2.5 rotate-45 bg-slate-900/90 border-cyan-400/40 ${active.side === "right" ? "-left-[5px] border-l border-b" : "-right-[5px] border-r border-t"}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
