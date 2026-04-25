import { useEffect, useRef } from "react";

export function MagicCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const trail = useRef<{ x: number; y: number; a: number; r: number; vx: number; vy: number; hue: number }[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    // --- FIX: Default cursor purn pane band karne ---
    const style = document.createElement("style");
    style.innerHTML = `
      * { cursor: none !important; }
      a, button, [role="button"], input, select, textarea { cursor: none !important; }
    `;
    document.head.appendChild(style);
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastX = 0, lastY = 0;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      lastX = e.clientX;
      lastY = e.clientY;

      if (speed > 2 && trail.current.length < 120) { 
        const count = Math.min(Math.floor(speed / 5), 3);
        for (let i = 0; i < count; i++) {
          trail.current.push({
            x: e.clientX,
            y: e.clientY,
            a: 0.7,
            r: Math.random() * 1.8 + 0.8,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            hue: Math.random() > 0.5 ? 185 : 275, 
          });
        }
      }
    };

    window.addEventListener("mousemove", onMove);

    // Hover detection logic
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [data-hover], input, select")) {
        ringRef.current?.classList.add("hovering");
      } else {
        ringRef.current?.classList.remove("hovering");
      }
    };
    window.addEventListener("mouseover", handleOver);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.15);

      if (arrowRef.current) {
        arrowRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = trail.current.length - 1; i >= 0; i--) {
        const p = trail.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.a -= 0.025; 
        p.r *= 0.98;

        if (p.a <= 0) {
          trail.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.a})`;
        ctx.fill();
      }
      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mouseover", handleOver);
      document.head.removeChild(style); // Cleanup styles
      document.documentElement.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <style>{`
        .magic-ring {
          position: fixed;
          top: -12px; 
          left: -12px;
          width: 24px;
          height: 24px;
          border: 1.5px solid rgba(34, 211, 238, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transition: width 0.2s, height 0.2s, top 0.2s, left 0.2s, background 0.2s, border-color 0.2s;
          will-change: transform;
        }
        .magic-ring.hovering {
          width: 44px;
          height: 44px;
          top: -22px;
          left: -22px;
          background: rgba(34, 211, 238, 0.1);
          border-color: #a78bfa;
          border-width: 1px;
        }
        .magic-canvas {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .magic-arrow {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10001;
          pointer-events: none;
          will-change: transform;
        }
      `}</style>
      
      <canvas ref={canvasRef} className="magic-canvas" />
      <div ref={ringRef} className="magic-ring" />
      <div ref={arrowRef} className="magic-arrow">
        <svg width="20" height="20" viewBox="0 0 24 24" style={{ transform: 'translate(-10%, -10%)' }}>
          <path
            d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
            fill="#22d3ee"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </>
  );
}