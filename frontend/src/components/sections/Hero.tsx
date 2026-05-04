import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Download } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef, useState } from "react";

/* ─── Spline viewer (custom element) ──────────────────────────────────────── */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { url?: string; loading?: string },
        HTMLElement
      >;
    }
  }
}

/* Stagger helper */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay },
});

export function Hero() {
  const [splineReady, setSplineReady] = useState(false);
  const viewerRef = useRef<HTMLElement | null>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  /* ── Mount spline-viewer once (strict-mode safe) ── */
  useEffect(() => {
    if (!wrapRef.current || viewerRef.current) return;

    const el = document.createElement("spline-viewer") as HTMLElement;
    el.setAttribute(
      "url",
      "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
    );
    el.setAttribute("loading", "lazy");
    /* GPU-composited layer from the start — no layout thrash on opacity change */
    el.style.cssText =
      "width:100%;height:100%;display:block;transform:translateZ(0);will-change:opacity;";

    const onLoad   = () => setSplineReady(true);
    const fallback = setTimeout(() => setSplineReady(true), 5000);

    el.addEventListener("load", onLoad);
    wrapRef.current.appendChild(el);
    viewerRef.current = el;

    return () => {
      clearTimeout(fallback);
      el.removeEventListener("load", onLoad);
      try { wrapRef.current?.removeChild(el); } catch { /* already gone */ }
      viewerRef.current = null;
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] overflow-hidden"
      /* Solid bg prevents flash-of-unstyled-content before Spline paints */
      style={{ background: "hsl(222 47% 5%)" }}
    >

      {/* ══════════════════════════════════════════════════════════════════════
          LAYER 0 — SPLINE ROBOT (full-bleed, own GPU compositor layer)
          • absolute inset-0  → covers the ENTIRE hero section
          • pointer-events: none → zero hit-test cost, no input blocking
          • Opacity on the wrapper div, not on the canvas element — avoids
            forcing a WebGL context repaint during the fade-in
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={wrapRef}
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          opacity:    splineReady ? 1 : 0,
          transition: "opacity 1s ease",
          willChange: "opacity",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          LAYER 1 — SINGLE COMPOSITE OVERLAY  (1 div, 2 gradients)
          • Angled left vignette: text is fully readable over the robot
          • Bottom fade: hero blends smoothly into the next section
          Removed: blur filters, grid-dots, separate glow divs — all were
          expensive paint ops that caused the jank.
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            linear-gradient(
              108deg,
              hsl(222 47% 5% / 0.97)  0%,
              hsl(222 47% 5% / 0.88) 22%,
              hsl(222 47% 5% / 0.52) 42%,
              hsl(222 47% 5% / 0.15) 60%,
              transparent             76%
            ),
            linear-gradient(
              to top,
              hsl(222 47% 5%)         0%,
              hsl(222 47% 5% / 0.0)  22%
            )
          `,
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          LAYER 2 — CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full min-h-[100dvh] flex items-center">
        <div
          className="
            w-full max-w-[1400px] mx-auto
            px-6 sm:px-10 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16
            pt-28 pb-32
          "
        >
          {/* Text column — sits fully inside the dark vignette zone */}
          <div className="max-w-[460px] flex flex-col gap-5">

            {/* ── Greeting pill ── */}
            <motion.div {...fadeUp(0.05)}>
              <span
                className="
                  inline-flex items-center gap-2
                  px-3 py-1 rounded-full
                  border border-cyan-400/20 bg-cyan-400/5
                  text-[10px] font-semibold tracking-[0.28em] uppercase
                "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                <span className="text-white/65">Hi, I'm</span>
                <span
                  className="text-cyan-400"
                  style={{ textShadow: "0 0 14px rgba(34,211,238,0.55)" }}
                >
                  Ambar
                </span>
              </span>
            </motion.div>

            {/* ── Animated heading ──
                font-bold (not black) + smaller clamp = lighter, cleaner look   */}
            <motion.h1
              {...fadeUp(0.15)}
              className="font-bold text-white leading-[1.08] tracking-[-0.01em]"
              style={{ fontSize: "clamp(1.75rem, 4.2vw, 2.8rem)" }}
            >
              <TypeAnimation
                sequence={[
                  "FULL STACK\nDEVELOPER",
                  2400,
                  "AI BUILDER",
                  2000,
                  "PROBLEM\nSOLVER",
                  2400,
                ]}
                wrapper="span"
                speed={40}
                repeat={Infinity}
                cursor={false}
                style={{ whiteSpace: "pre-line", display: "inline" }}
              />
              {/* Static cursor — animate-pulse removed: was triggering a
                  continuous repaint even when nothing else on screen moved */}
              <span
                className="text-cyan-400 ml-0.5"
                style={{ textShadow: "0 0 10px rgba(34,211,238,0.75)" }}
              >
                |
              </span>
            </motion.h1>

            {/* ── Sub-headline ── */}
            <motion.p
              {...fadeUp(0.25)}
              className="text-sm sm:text-[15px] font-medium text-white/70 leading-snug tracking-wide"
            >
              Building scalable digital experiences that{" "}
              <span
                className="text-cyan-400 font-semibold"
                style={{ textShadow: "0 0 8px rgba(34,211,238,0.4)" }}
              >
                solve real problems.
              </span>
            </motion.p>

            {/* ── Body copy ── */}
            <motion.p
              {...fadeUp(0.32)}
              className="text-[13px] text-white/45 leading-relaxed max-w-[390px]"
            >
              Full Stack Developer crafting scalable apps, real-time systems,
              and AI-powered experiences with modern technologies.
            </motion.p>

            {/* ── CTAs ── */}
            <motion.div
              {...fadeUp(0.4)}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <a
                data-hover
                href="#projects"
                className="
                  group inline-flex items-center gap-2.5
                  px-5 py-[11px] rounded-full
                  bg-gradient-cta text-white
                  font-semibold text-[11px] tracking-[0.18em] uppercase
                  shadow-[0_6px_28px_-8px_rgba(56,189,248,0.6)]
                  hover:shadow-[0_10px_40px_-6px_rgba(56,189,248,0.85)]
                  transition-shadow duration-300
                "
              >
                Explore My Work
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-200">
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </a>

              <a
                data-hover
                href="/Certi.pdf"
                download="Ambar_Resume.pdf"
                className="
                  inline-flex items-center gap-2
                  px-5 py-[11px] rounded-full
                  border border-white/15 text-white/65
                  font-semibold text-[11px] tracking-[0.18em] uppercase
                  hover:border-cyan-400/50 hover:text-cyan-300
                  transition-colors duration-200
                "
              >
                <Download className="w-3 h-3" />
                Resume
              </a>
            </motion.div>

            {/* ── Stats row ── */}
            <motion.div
              {...fadeUp(0.48)}
              className="flex items-stretch pt-2"
            >
              {[
                { value: "2+",  label: "Years Exp." },
                { value: "15+", label: "Projects"   },
                { value: "10+", label: "Tech Stack"  },
              ].map(({ value, label }, i) => (
                <div
                  key={label}
                  className="flex flex-col pr-6"
                  style={
                    i > 0
                      ? {
                          paddingLeft: "1.5rem",
                          borderLeft: "1px solid rgba(255,255,255,0.08)",
                        }
                      : {}
                  }
                >
                  <span
                    className="text-[1.3rem] font-bold text-white leading-none"
                    style={{ textShadow: "0 0 14px rgba(34,211,238,0.3)" }}
                  >
                    {value}
                  </span>
                  <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-white/35 mt-1">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LAYER 3 — SCROLL INDICATOR
      ══════════════════════════════════════════════════════════════════════ */}
      <motion.a
        href="#about"
        data-hover
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="
          absolute bottom-7 left-1/2 -translate-x-1/2 z-10
          flex flex-col items-center gap-1.5
          text-white/35 hover:text-cyan-300 transition-colors duration-200
        "
      >
        <span className="w-5 h-8 rounded-full border border-white/18 flex items-start justify-center pt-1.5">
          <motion.span
            animate={{ y: [0, 7, 0], opacity: [0.9, 0.15, 0.9] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            className="w-[3px] h-[6px] rounded-full bg-cyan-400"
          />
        </span>
        <span className="text-[8px] font-semibold tracking-[0.3em] uppercase">
          Scroll
        </span>
        <ChevronDown className="w-3 h-3" />
      </motion.a>

    </section>
  );
}