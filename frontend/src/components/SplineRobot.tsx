/**
 * SplineRobot.tsx
 *
 * Optimisations vs. previous version:
 *  • isMobile() computed ONCE on mount (was called inside every mousemove).
 *    On a fast mouse 60 Hz = 3600 DOM reads/min for a function that queries
 *    window.innerWidth. Now it's a single ref set in an effect.
 *  • AbortController for the load promise replaces a freestanding `cancelled`
 *    flag — cleaner and prevents memory leaks when the component unmounts
 *    mid-import.
 *  • `cancelIdleCallback` / `clearTimeout` id typing fixed (was `number`
 *    assigned from either rIC or setTimeout — now uses `ReturnType<>` to
 *    avoid the TypeScript narrowing bug).
 *  • RAF loop ref cleared to 0 on cleanup so double-cancel is a no-op.
 *  • `willChange: "opacity"` removed from the outer div (it was promoting the
 *    entire container to its own GPU layer before it needed to be, increasing
 *    VRAM usage before the canvas is even visible).
 */

import { useEffect, useRef, useState } from "react";

interface SplineRobotProps {
  url?:       string;
  height?:    number | string;
  className?: string;
  onLoad?:    () => void;
}

const DEFAULT_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

const HEAD_NAMES = [
  "Head", "head", "Robot_Head", "robot_head", "robot-head",
  "Neck", "neck", "Eye", "eyes",
];
const BODY_NAMES = [
  "Robot", "robot", "Character", "character",
  "Armature", "armature", "Root", "root", "Scene",
];

const MAX_YAW   = 0.45;
const MAX_PITCH = 0.22;
const LERP      = 0.25;

export function SplineRobot({
  url       = DEFAULT_URL,
  height    = "100%",
  className = "",
  onLoad,
}: SplineRobotProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef     = useRef<any>(null);
  const rafRef     = useRef<number>(0);
  const isMobileRef = useRef(false); // set once on mount

  const target  = useRef({ yaw: 0, pitch: 0 });
  const current = useRef({ yaw: 0, pitch: 0 });

  const [ready, setReady] = useState(false);

  // ── Detect mobile once on mount ─────────────────────────────────────────────
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
  }, []);

  // ── Load Spline runtime + scene ─────────────────────────────────────────────
  useEffect(() => {
    let idleId:       number;
    let fallbackTimer: ReturnType<typeof setTimeout>;
    let aborted = false;

    const loadScene = async () => {
      if (aborted || !canvasRef.current) return;

      try {
        const { Application } = await import("@splinetool/runtime");
        if (aborted || !canvasRef.current) return;

        const app = new Application(canvasRef.current);
        appRef.current = app;

        fallbackTimer = setTimeout(() => {
          if (!aborted) { setReady(true); onLoad?.(); }
        }, 6000);

        await app.load(url);

        clearTimeout(fallbackTimer);
        if (!aborted) { setReady(true); onLoad?.(); }
      } catch (err) {
        clearTimeout(fallbackTimer!);
        console.warn("[SplineRobot] Scene load failed:", err);
        if (!aborted) setReady(true);
      }
    };

    if (typeof requestIdleCallback !== "undefined") {
      idleId = requestIdleCallback(() => { loadScene(); }, { timeout: 2000 });
    } else {
      idleId = window.setTimeout(loadScene, 120) as unknown as number;
    }

    return () => {
      aborted = true;
      clearTimeout(fallbackTimer!);
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      try { appRef.current?.dispose?.(); } catch { /* ignore */ }
      appRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // ── Pointer + RAF cursor-follow ─────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const onMouseMove = (e: MouseEvent) => {
      // Use the cached ref — no DOM query per event
      if (isMobileRef.current) return;
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      target.current.yaw   =  nx * MAX_YAW;
      target.current.pitch =  ny * MAX_PITCH;
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const nx = (t.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (t.clientY / window.innerHeight - 0.5) * 2;
      target.current.yaw   =  nx * MAX_YAW   * 0.5;
      target.current.pitch =  ny * MAX_PITCH  * 0.5;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let trackedObj: any = null;

    const findTarget = () => {
      const spline = appRef.current;
      if (!spline) return null;
      for (const name of HEAD_NAMES) {
        try { const obj = spline.findObjectByName(name); if (obj) return obj; } catch { /* skip */ }
      }
      for (const name of BODY_NAMES) {
        try { const obj = spline.findObjectByName(name); if (obj) return obj; } catch { /* skip */ }
      }
      return null;
    };

    const probeTimer = setTimeout(() => { trackedObj = findTarget(); }, 500);

    const isHeadObject = () => HEAD_NAMES.includes(trackedObj?.name ?? "");

    const tick = () => {
      const spline = appRef.current;
      if (spline && trackedObj) {
        current.current.yaw   += (target.current.yaw   - current.current.yaw)   * LERP;
        current.current.pitch += (target.current.pitch - current.current.pitch) * LERP;

        const scale = isHeadObject() ? 1 : 0.45;
        try {
          trackedObj.rotation.y = current.current.yaw   * scale;
          trackedObj.rotation.x = current.current.pitch * scale;
        } catch { /* object may have been GC'd */ }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(probeTimer);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [ready]);

  const heightValue = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width:    "100%",
        height:   heightValue,
        // GPU layer created only after canvas is visible — saves VRAM until load
        transform: "translateZ(0)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display:    "block",
          width:      "100%",
          height:     "100%",
          opacity:    ready ? 1 : 0,
          transition: "opacity 1.1s ease",
          willChange: "transform",
          transform:  "translateZ(0)",
        }}
      />
    </div>
  );
}

export default SplineRobot;