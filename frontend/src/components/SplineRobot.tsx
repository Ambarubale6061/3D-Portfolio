/**
 * SplineRobot.tsx
 *
 * BUGS FIXED vs previous version:
 *
 *  ✅ HIGH — RAF tick() now fully pauses when the tab is hidden OR the
 *     component is scrolled off-screen. Previously the loop ran at 60 fps
 *     regardless — the robot kept tracking the mouse even when the user was
 *     reading a completely different section of the page.
 *
 *     Two guards added:
 *       1. document.hidden check inside tick() — stops scheduling when tab
 *          is in the background. visibilitychange resumes it.
 *       2. IntersectionObserver — stops scheduling when the canvas is not
 *          in the viewport. Resumes when it scrolls back in.
 *
 *  ✅ MEDIUM — findTarget() now retries every 500 ms (up to 5 times) instead
 *     of a one-shot 500 ms timeout. Spline scenes can take >2 s to fully
 *     parse object names on slow connections, so the old code silently gave
 *     up and the head-tracking never activated. The retry loop clears itself
 *     as soon as the object is found.
 *
 * Everything else (idleCallback deferral, AbortController pattern, mobile
 * detection cached in ref, fallback timer, RAF ref cleared to 0 on cancel)
 * was already correct and is preserved unchanged.
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
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appRef       = useRef<any>(null);
  const rafRef       = useRef<number>(0);
  const isMobileRef  = useRef(false);

  const target  = useRef({ yaw: 0, pitch: 0 });
  const current = useRef({ yaw: 0, pitch: 0 });

  const [ready, setReady] = useState(false);

  // ── Detect mobile once on mount ─────────────────────────────────────────────
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
  }, []);

  // ── Load Spline runtime + scene ─────────────────────────────────────────────
  useEffect(() => {
    let idleId:        number;
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

    // ── Find target object ────────────────────────────────────────────────────
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

    // ✅ FIX: Retry findTarget every 500 ms until found (max 5 attempts).
    // Old code used a one-shot 500 ms timeout — if Spline hadn't finished
    // parsing object names yet (common on slow connections), the head-tracking
    // silently never activated for the entire session.
    let probeAttempts = 0;
    const probeInterval = setInterval(() => {
      if (trackedObj || probeAttempts >= 5) {
        clearInterval(probeInterval);
        return;
      }
      trackedObj = findTarget();
      probeAttempts++;
    }, 500);

    const isHeadObject = () => HEAD_NAMES.includes(trackedObj?.name ?? "");

    // ── Shared pause state for the RAF loop ──────────────────────────────────
    let isPageVisible = !document.hidden;
    let isInView      = true;   // assume visible until IO says otherwise

    // ── Safe resume helper ───────────────────────────────────────────────────
    const resumeLoop = () => {
      if (rafRef.current === 0 && isPageVisible && isInView) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    // ── RAF tick ─────────────────────────────────────────────────────────────
    //
    // ✅ FIX: Loop now truly stops when either condition is false.
    // Previously tick() always called requestAnimationFrame(tick) at the end,
    // running at 60 fps even when the page was hidden or the Hero section
    // was off-screen (combined with Earth3D's loop, this doubled idle CPU).
    //
    const tick = () => {
      if (!isPageVisible || !isInView) {
        rafRef.current = 0;  // sentinel — loop is stopped
        return;
      }

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

      rafRef.current = requestAnimationFrame(tick);  // reschedule after work
    };

    rafRef.current = requestAnimationFrame(tick);

    // ── Visibility pause ─────────────────────────────────────────────────────
    const onVisibility = () => {
      isPageVisible = !document.hidden;
      resumeLoop();
    };
    document.addEventListener("visibilitychange", onVisibility, { passive: true });

    // ── IntersectionObserver — pause when canvas scrolls off-screen ──────────
    let io: IntersectionObserver | null = null;
    if (canvasRef.current) {
      io = new IntersectionObserver(
        ([entry]) => {
          isInView = entry.isIntersecting;
          resumeLoop();
        },
        { threshold: 0.05 },
      );
      io.observe(canvasRef.current);
    }

    return () => {
      clearInterval(probeInterval);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibility);
      io?.disconnect();
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