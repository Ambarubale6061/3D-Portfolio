/**
 * SplineRobot.tsx
 *
 * Optimisations vs. the old spline-viewer web-component approach:
 *  • Uses @splinetool/runtime directly on a <canvas> — no extra DOM element,
 *    no shadow-DOM overhead, full programmatic access to scene objects.
 *  • Dynamic import + requestIdleCallback: the heavy runtime bundle is loaded
 *    only after the browser is idle, so it never blocks first paint.
 *  • Cursor-follow: a lightweight RAF loop lerps a target rotation toward the
 *    pointer position and writes it to the robot scene object each frame.
 *    Several common Spline object names are tried in order; the first match wins.
 *  • GPU compositing is pinned from the start via willChange / translateZ(0).
 *  • A graceful 6 s timeout reveals the canvas if the load event never fires.
 */

import { useEffect, useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface SplineRobotProps {
  /** Spline scene URL */
  url?: string;
  /** Container height — number = px, string = any CSS unit (default: "100%") */
  height?: number | string;
  /** Extra Tailwind / CSS class on the outermost div */
  className?: string;
  /** Fired once the scene is ready */
  onLoad?: () => void;
}

/* ─── Constants ─────────────────────────────────────────────────────────────── */
const DEFAULT_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Object names to probe for cursor-follow rotation, tried in order.
 * The first name that resolves to a live scene object is used.
 * Add / reorder entries here if the Spline scene uses a different naming
 * convention without touching anything else.
 */
const HEAD_NAMES = [
  "Head", "head", "Robot_Head", "robot_head", "robot-head",
  "Neck", "neck", "Eye", "eyes",
];
const BODY_NAMES = [
  "Robot", "robot", "Character", "character",
  "Armature", "armature", "Root", "root", "Scene",
];

/** Max look rotation in radians */
const MAX_YAW   = 0.45;   // left / right
const MAX_PITCH = 0.22;   // up / down

/**
 * Lerp factor per frame (0–1).
 * 0.25 = fast, near-instant tracking that still interpolates smoothly.
 */
const LERP = 0.25;

/* ─── Component ─────────────────────────────────────────────────────────────── */
export function SplineRobot({
  url      = DEFAULT_URL,
  height   = "100%",
  className = "",
  onLoad,
}: SplineRobotProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef     = useRef<any>(null);
  const rafRef     = useRef<number>(0);

  /* Target rotation set by pointer, current rotation interpolated each frame */
  const target  = useRef({ yaw: 0, pitch: 0 });
  const current = useRef({ yaw: 0, pitch: 0 });

  const [ready, setReady] = useState(false);

  /* ── 1. Load Spline runtime + scene ──────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    let fallbackTimer: ReturnType<typeof setTimeout>;

    const loadScene = async () => {
      if (cancelled || !canvasRef.current) return;

      try {
        /* Dynamic import keeps the ~400 kB bundle out of the critical path */
        const { Application } = await import("@splinetool/runtime");
        if (cancelled || !canvasRef.current) return;

        const app = new Application(canvasRef.current);
        appRef.current = app;

        /* Safety net: reveal the canvas after 6 s even if load never fires */
        fallbackTimer = setTimeout(() => {
          if (!cancelled) { setReady(true); onLoad?.(); }
        }, 6000);

        await app.load(url);

        clearTimeout(fallbackTimer);
        if (!cancelled) { setReady(true); onLoad?.(); }
      } catch (err) {
        clearTimeout(fallbackTimer);
        console.warn("[SplineRobot] Scene load failed:", err);
        /* Don't leave a black box — still reveal the canvas area */
        if (!cancelled) setReady(true);
      }
    };

    /*
     * Defer until the browser is idle (first-paint complete, layout quiet).
     * Falls back to a plain 120 ms timeout on browsers without rIC support.
     */
    let idleId: number;
    if (typeof requestIdleCallback !== "undefined") {
      idleId = requestIdleCallback(() => { loadScene(); }, { timeout: 2000 });
    } else {
      idleId = window.setTimeout(loadScene, 120);
    }

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      cancelAnimationFrame(rafRef.current);
      try { appRef.current?.dispose?.(); } catch { /* ignore */ }
      appRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  /* ── 2. Pointer listener + RAF cursor-follow ─────────────────────────────── */
  useEffect(() => {
    if (!ready) return;

    const isMobile = () => window.innerWidth < 768;

    /* Update target rotation from pointer position */
    const onMouseMove = (e: MouseEvent) => {
      if (isMobile()) return;
      /*
       * Normalise to –1…+1 relative to viewport centre.
       *
       * X axis: cursor left  → nx negative → yaw negative  → head turns left  ✓
       *         cursor right → nx positive → yaw positive   → head turns right ✓
       *
       * Y axis: cursor up   → clientY small → (clientY/h - 0.5) negative
       *                     → pitch negative → rotation.x negative → head tilts up ✓
       *         cursor down → clientY large  → pitch positive → head tilts down  ✓
       *
       * NOTE: no negation on ny — negating it was the cause of the inversion.
       */
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      target.current.yaw   =  nx * MAX_YAW;
      target.current.pitch =  ny * MAX_PITCH;
    };

    /* Touch support for devices that have hover media but also touch */
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

    /* Cache the found scene object so we don't call findObjectByName every frame */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let trackedObj: any = null;

    const findTarget = () => {
      const spline = appRef.current;
      if (!spline) return null;

      /* Try head-level objects first for a more natural look */
      for (const name of HEAD_NAMES) {
        try {
          const obj = spline.findObjectByName(name);
          if (obj) return obj;
        } catch { /* object not in scene */ }
      }
      /* Fall back to a body/root object with reduced rotation */
      for (const name of BODY_NAMES) {
        try {
          const obj = spline.findObjectByName(name);
          if (obj) return obj;
        } catch { /* object not in scene */ }
      }
      return null;
    };

    /* One-time probe after a short delay so the scene is fully initialised */
    const probeTimer = setTimeout(() => {
      trackedObj = findTarget();
    }, 500);

    const isHeadObject = () =>
      HEAD_NAMES.includes(trackedObj?.name ?? "");

    /* RAF loop — lerp toward target and write rotation */
    const tick = () => {
      const spline = appRef.current;
      if (spline && trackedObj) {
        /* Lerp */
        current.current.yaw   += (target.current.yaw   - current.current.yaw)   * LERP;
        current.current.pitch += (target.current.pitch - current.current.pitch) * LERP;

        /* Head objects get full rotation; body objects get half to avoid
           the whole character spinning */
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
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [ready]);

  /* ── Render ──────────────────────────────────────────────────────────────── */
  const heightValue =
    typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width:    "100%",
        height:   heightValue,
        /* Establish a stacking context + GPU layer early */
        transform:  "translateZ(0)",
        willChange: "opacity",
      }}
    >
      {/* ── The Spline canvas ── */}
      <canvas
        ref={canvasRef}
        style={{
          display:    "block",
          width:      "100%",
          height:     "100%",
          opacity:    ready ? 1 : 0,
          transition: "opacity 1.1s ease",
          willChange: "transform",
          /* Force a dedicated GPU compositing layer */
          transform:  "translateZ(0)",
        }}
      />
    </div>
  );
}

export default SplineRobot;