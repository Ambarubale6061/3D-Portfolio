import { useEffect, useRef } from "react";

export function MagicCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const lag = useRef({ x: -200, y: -200 });
  const trail = useRef<{ x: number; y: number; a: number; r: number; vx: number; vy: number; hue: number }[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    document.documentElement.classList.add("magic-cursor-active");

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastX = 0,
      lastY = 0;
    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.min(Math.hypot(dx, dy), 30);
      lastX = e.clientX;
      lastY = e.clientY;
      const count = 1 + Math.floor(speed / 6);
      for (let i = 0; i < count; i++) {
        trail.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          a: 0.9,
          r: 1.2 + Math.random() * 2.6,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.4,
          hue: 180 + Math.random() * 60,
        });
      }
      if (trail.current.length > 220) trail.current.splice(0, trail.current.length - 220);
    };
    window.addEventListener("mousemove", onMove);

    const hovered: { el: HTMLElement | null } = { el: null };
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      const el = target?.closest?.("button,a,[data-hover]") as HTMLElement | null;
      if (el && glowRef.current) {
        glowRef.current.style.opacity = "1";
        glowRef.current.style.transform += " scale(2.2)";
        hovered.el = el;
      }
    };
    const onOut = () => {
      if (glowRef.current) glowRef.current.style.opacity = "0.85";
      hovered.el = null;
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      lag.current.x = lerp(lag.current.x, pos.current.x, 0.22);
      lag.current.y = lerp(lag.current.y, pos.current.y, 0.22);

      if (arrowRef.current) {
        arrowRef.current.style.transform = `translate(${pos.current.x - 2}px, ${pos.current.y - 2}px)`;
      }
      if (glowRef.current) {
        const isHover = !!hovered.el;
        glowRef.current.style.transform = `translate(${lag.current.x - 18}px, ${lag.current.y - 18}px) scale(${isHover ? 1.8 : 1})`;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      const t = trail.current;
      for (let i = t.length - 1; i >= 0; i--) {
        const p = t[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02;
        p.a *= 0.93;
        p.r *= 0.965;
        if (p.a < 0.02 || p.r < 0.2) {
          t.splice(i, 1);
          continue;
        }
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${p.a})`);
        grad.addColorStop(0.4, `hsla(${p.hue}, 100%, 60%, ${p.a * 0.5})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("magic-cursor-active");
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(34,211,238,0.55) 0%, rgba(34,211,238,0.18) 45%, rgba(34,211,238,0) 75%)",
          zIndex: 9998,
          pointerEvents: "none",
          opacity: 0.85,
          transition: "opacity .25s ease, transform .12s ease-out",
          willChange: "transform, opacity",
          filter: "blur(2px)",
        }}
      />
      <div
        ref={arrowRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform",
          filter: "drop-shadow(0 0 6px rgba(34,211,238,0.95)) drop-shadow(0 0 14px rgba(168,85,247,0.55))",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <defs>
            <linearGradient id="mc-arrow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="60%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path
            d="M2 2 L2 20 L7 15 L10 23 L13 22 L10 14 L17 14 Z"
            fill="url(#mc-arrow)"
            stroke="white"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
