/**
 * MagicCursor.tsx
 *
 * Renders a ring that is perfectly attached to the system cursor,
 * plus a particle trail on fast movement.
 * The system cursor is left visible and fully functional.
 *
 * Ring sync strategy:
 *   The ring's transform is written directly inside the mousemove handler,
 *   not inside the RAF tick. This is the key distinction:
 *
 *   RAF-based update (old):
 *     mousemove fires → mouse.current updated → [frame boundary] → RAF tick
 *     → ring DOM write. The ring always lags by at least one frame (~16 ms).
 *
 *   mousemove-based update (new):
 *     mousemove fires → ring DOM write happens in the same call, immediately.
 *     The browser processes the style change in the same layout pass as the
 *     cursor repaint. Zero perceptible gap at any movement speed.
 *
 * Performance notes:
 *   - Ring DOM write is a single transform string — no layout, only composite.
 *   - Two-pass particle rendering (one fillStyle set per hue group).
 *   - ctx.globalAlpha for per-particle alpha — native float, no string alloc.
 *   - TAU cached at module level.
 *   - Typed-array particle pool with GC-free in-place compaction.
 *   - RAF loop runs only for the canvas particle trail.
 *   - Visibility-change pause stops RAF when tab is hidden.
 *   - Touch-only / mobile devices bail out entirely — no DOM nodes mounted.
 *     Detection runs client-side only (useEffect) to avoid SSR mismatches.
 */

import { useEffect, useRef, useState } from "react";

// ─── Detect pointer capability (must run client-side only) ───────────────────
function isTouchOrMobileDevice(): boolean {
  if (typeof window === "undefined") return true;

  // Primary signals: CSS interaction media features
  const hoverNone    = window.matchMedia("(hover: none)").matches;
  const pointerCoarse = window.matchMedia("(pointer: coarse)").matches;

  // Secondary signal: touch points reported by the browser
  const hasTouch = navigator.maxTouchPoints > 0;

  // A device is considered mobile/touch-only when it lacks fine-pointer
  // hover and reports touch capability.
  return (hoverNone || pointerCoarse) && hasTouch;
}

// ─── Public component ─────────────────────────────────────────────────────────
export function MagicCursor() {
  // Start as false (safe for SSR); flip to true only if client says desktop.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Runs only in the browser — no SSR window-undefined risk.
    setEnabled(!isTouchOrMobileDevice());
  }, []);

  if (!enabled) return null;
  return <MagicCursorInner />;
}

// ─── Pre-computed constants ───────────────────────────────────────────────────
const TAU     = Math.PI * 2;
const HUE_A   = 185;
const HUE_B   = 275;
const COLOR_A = "hsl(185,100%,75%)";
const COLOR_B = "hsl(275,100%,75%)";

// ─── Inner component — only ever mounts on desktop ───────────────────────────
function MagicCursorInner() {
  const ringRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Particle pool — parallel typed arrays for GC-free updates ────────────
  const MAX_TRAIL = 80;
  const px  = useRef(new Float32Array(MAX_TRAIL));
  const py  = useRef(new Float32Array(MAX_TRAIL));
  const pa  = useRef(new Float32Array(MAX_TRAIL));
  const pr  = useRef(new Float32Array(MAX_TRAIL));
  const pvx = useRef(new Float32Array(MAX_TRAIL));
  const pvy = useRef(new Float32Array(MAX_TRAIL));
  const ph  = useRef(new Uint16Array(MAX_TRAIL));
  const pCount = useRef(0);

  const raf    = useRef(0);
  const paused = useRef(false);

  useEffect(() => {
    // Extra guard: if somehow this component mounts on a touch device, exit.
    if (isTouchOrMobileDevice()) return;

    const ring   = ringRef.current!;
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d", { alpha: true })!;
    ctx.imageSmoothingEnabled = false;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let lastX = 0, lastY = 0;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // ── Ring: written here, synchronously, in the same event callback ────
      //
      // This is the critical change. Previously the ring was updated inside
      // the RAF tick, which always runs one frame after the mousemove event.
      // At 60 fps that is a guaranteed ~16 ms gap — visible as the ring
      // "chasing" the cursor.
      //
      // Writing the transform here means the ring position is resolved in
      // the same browser task as the cursor repaint. The browser composites
      // both together, so the ring appears glued to the cursor at all speeds.
      ring.style.transform = `translate3d(${x}px,${y}px,0)`;

      // ── Particles ─────────────────────────────────────────────────────────
      const dx    = x - lastX;
      const dy    = y - lastY;
      const speed = Math.hypot(dx, dy);
      lastX = x;
      lastY = y;

      if (speed > 3 && pCount.current < MAX_TRAIL) {
        const count = Math.min(Math.floor(speed / 6), 2);
        for (let i = 0; i < count; i++) {
          if (pCount.current >= MAX_TRAIL) break;
          const idx = pCount.current++;
          px.current[idx]  = x;
          py.current[idx]  = y;
          pa.current[idx]  = 0.55;
          pr.current[idx]  = Math.random() * 1.4 + 0.6;
          pvx.current[idx] = (Math.random() - 0.5) * 1.0;
          pvy.current[idx] = (Math.random() - 0.5) * 1.0;
          ph.current[idx]  = Math.random() > 0.5 ? HUE_A : HUE_B;
        }
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const onVisibility = () => {
      paused.current = document.hidden;
      if (!document.hidden) raf.current = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ── RAF loop: only drives the particle canvas now ─────────────────────
    const tick = () => {
      if (paused.current) return;

      const n = pCount.current;
      if (n > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Step 1: physics update + in-place compaction
        let alive = 0;
        for (let i = 0; i < n; i++) {
          pa.current[i] -= 0.032;
          if (pa.current[i] <= 0) continue;

          pr.current[i] *= 0.96;
          px.current[i] += pvx.current[i];
          py.current[i] += pvy.current[i];

          if (alive !== i) {
            px.current[alive]  = px.current[i];
            py.current[alive]  = py.current[i];
            pa.current[alive]  = pa.current[i];
            pr.current[alive]  = pr.current[i];
            pvx.current[alive] = pvx.current[i];
            pvy.current[alive] = pvy.current[i];
            ph.current[alive]  = ph.current[i];
          }
          alive++;
        }
        pCount.current = alive;

        // Step 2: two-pass render — one fillStyle set per hue group
        ctx.fillStyle = COLOR_A;
        for (let i = 0; i < alive; i++) {
          if (ph.current[i] !== HUE_A) continue;
          ctx.globalAlpha = pa.current[i];
          ctx.beginPath();
          ctx.arc(px.current[i], py.current[i], pr.current[i], 0, TAU);
          ctx.fill();
        }

        ctx.fillStyle = COLOR_B;
        for (let i = 0; i < alive; i++) {
          if (ph.current[i] !== HUE_B) continue;
          ctx.globalAlpha = pa.current[i];
          ctx.beginPath();
          ctx.arc(px.current[i], py.current[i], pr.current[i], 0, TAU);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <style>{`
        .magic-ring {
          position: fixed;
          top: 0; left: 0;
          margin-top: -10px; margin-left: -10px;
          width: 20px; height: 20px;
          border: 2px solid #22d3ee;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          will-change: transform;
        }
        .magic-canvas {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          mix-blend-mode: screen;
        }
      `}</style>

      <canvas ref={canvasRef} className="magic-canvas" />
      <div ref={ringRef} className="magic-ring" />
    </>
  );
}