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
        const count = Math.min(Math.floor(speed / 5), 2);
        for (let i = 0; i < count; i++) {
          trail.current.push({
            x: e.clientX,
            y: e.clientY,
            a: 0.6,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            hue: Math.random() > 0.5 ? 185 : 275, 
          });
        }
      }
    };

    window.addEventListener("mousemove", onMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // FIX: Ring fast follow karnyasathi 0.15 varun 0.35 kela
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.35);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.35);

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
        p.a -= 0.03; 
        p.r *= 0.97;

        if (p.a <= 0) {
          trail.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.a})`;
        ctx.fill();
      }
      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <style>{`
        .magic-ring {
          position: fixed;
          top: 0; 
          left: 0;
          margin-top: -10px; /* Center adjustment */
          margin-left: -10px;
          width: 20px;
          height: 20px;
          border: 2px solid #22d3ee; /* Thoda strong color */
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          will-change: transform;
          /* Transition kadhlya mule movement smooth aani instant hotey */
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
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ transform: 'translate(-2px, -2px)' }}>
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