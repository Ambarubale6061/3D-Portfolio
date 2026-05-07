import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ChevronDown, Download } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { useEffect, useRef, useState } from "react";
import { SplineRobot } from "@/components/SplineRobot";

/* ─── Shared entrance animation factory ───────────────────────────────────── */
const fadeUp = (delay: number) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.55, ease: "easeOut" as const, delay },
});

const SPLINE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/* ─── Max parallax shift (px) for the whole robot container ──────────────── */
const SHIFT_DESKTOP = 12;
const SHIFT_MOBILE  = 5;

export function Hero() {
  const [splineReady, setSplineReady] = useState(false);

  /* ═══════════════════════════════════════════════════════════════════════════
     CONTAINER PARALLAX  (separate from the head cursor-follow in SplineRobot)
     ─ Gently floats the whole robot container with the cursor
     ─ SplineRobot handles the internal head/body rotation independently
  ═══════════════════════════════════════════════════════════════════════════ */
  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 38, damping: 20, mass: 1.1 });
  const springY = useSpring(rawY, { stiffness: 38, damping: 20, mass: 1.1 });

  useEffect(() => {
    const isMobile = () => window.innerWidth < 768;

    const onMouseMove = (e: MouseEvent) => {
      if (isMobile()) return;
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(nx * SHIFT_DESKTOP);
      rawY.set(ny * SHIFT_DESKTOP);
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const nx = (t.clientX / window.innerWidth  - 0.5) * 2;
      const ny = (t.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(nx * SHIFT_MOBILE);
      rawY.set(ny * SHIFT_MOBILE);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [rawX, rawY]);

  return (
    /*
     * Section layout strategy
     * ────────────────────────
     * Mobile  (< md): flex-col — Spline block on top, text flows below
     * Desktop (≥ md): block    — Spline absolute full-bleed, text absolute left
     */
    <section
      id="hero"
      className="
        relative flex flex-col md:block
        w-full min-h-[100dvh] overflow-hidden
      "
      style={{ background: "hsl(222 47% 5%)" }}
    >

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 0 — SPLINE ROBOT

          ✅ Uses <SplineRobot> which:
            • Loads via dynamic import + requestIdleCallback (no jank)
            • Handles its own loading spinner
            • Rotates head/body to follow the cursor internally via RAF

          Mobile  : relative · h-[60vh] · full-width
          Desktop : absolute · inset-0 · full-bleed

          The motion.div adds a gentle 12px container parallax on top of
          SplineRobot's internal head-rotation — two independent effects.
      ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        aria-hidden
        className="
          relative h-[60vh] w-full shrink-0 pointer-events-none
          md:absolute md:inset-0 md:h-auto md:w-auto
        "
        style={{
          willChange: "transform, opacity",
          x: springX,
          y: springY,
        }}
      >
        <SplineRobot
          url={SPLINE_URL}
          height="100%"
          onLoad={() => setSplineReady(true)}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 1a — MOBILE GRADIENT BRIDGE  (hidden on desktop)
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden
        className="md:hidden relative z-[1] shrink-0 pointer-events-none"
        style={{
          height:     "100px",
          marginTop:  "-100px",
          background: "linear-gradient(to bottom, transparent 0%, hsl(222 47% 5%) 100%)",
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 1b — DESKTOP OVERLAY  (hidden on mobile)
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            linear-gradient(
              108deg,
              hsl(222 47% 5% / 0.97)  0%,
              hsl(222 47% 5% / 0.88) 22%,
              hsl(222 47% 5% / 0.50) 42%,
              hsl(222 47% 5% / 0.12) 60%,
              transparent             76%
            ),
            linear-gradient(
              to top,
              hsl(222 47% 5%)        0%,
              transparent            22%
            )
          `,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 2 — CONTENT
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="
          relative z-10
          w-full px-6 sm:px-8 pt-4 pb-24
          md:absolute md:inset-0 md:flex md:items-center
          md:px-0 md:pt-0 md:pb-0
        "
      >
        <div
          className="
            w-full
            md:max-w-[1400px] md:mx-auto
            md:pl-24 lg:pl-32 md:pr-8 lg:pr-16
            md:pt-28 md:pb-28
          "
        >
          <div className="max-w-[460px] flex flex-col gap-5">

            {/* ── Greeting pill ── */}
            <motion.div {...fadeUp(0.05)}>
  <span className="text-white/65">Hi, I'm </span>
  <span
    className="text-cyan-400"
    style={{ textShadow: "0 0 14px rgba(34,211,238,0.55)" }}
  >
    Ambar
  </span>
</motion.div>

            {/* ── Animated heading ── */}
            <motion.h1
              {...fadeUp(0.15)}
              className="font-bold text-white leading-[1.08] tracking-[-0.01em]"
              style={{ fontSize: "clamp(1.75rem, 4.2vw, 2.8rem)" }}
            >
              <TypeAnimation
                sequence={[
                  "FULL STACK\nDEVELOPER", 2400,
                  "AI BUILDER",             2000,
                  "PROBLEM\nSOLVER",         2400,
                ]}
                wrapper="span"
                speed={40}
                repeat={Infinity}
                cursor={false}
                style={{ whiteSpace: "pre-line", display: "inline" }}
              />
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
              className="text-sm sm:text-[15px] font-medium text-white/70 leading-snug"
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
              {...fadeUp(0.40)}
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
                href="/Resume.pdf"
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
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          LAYER 3 — SCROLL INDICATOR
      ═══════════════════════════════════════════════════════════════════ */}
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
        <span className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
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