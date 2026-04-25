import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Download } from "lucide-react";
import { downloadResume } from "@/lib/resume";
import { TypeAnimation } from "react-type-animation";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center pt-28 pb-20"
    >
      {/* Background atmospherics */}
      <div className="absolute inset-0 -z-10 bg-grid-dots opacity-30 pointer-events-none" />
      <div className="absolute right-[-15%] top-1/3 -z-10 w-[60%] h-[60%] rounded-full bg-gradient-radial from-cyan-500/20 via-blue-500/10 to-transparent blur-[80px] pointer-events-none" />

      <div className="w-full grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-center relative z-10">
        {/* LEFT — copy (compact) */}
        <div className="space-y-5 min-w-0 max-w-[480px]">
          <motion.p
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, delay: 0.1 }}
  className="font-semibold tracking-[0.3em] text-xs uppercase"
>
  <span className="text-white">
    Hi, I'm{" "}
  </span>
  <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
    Ambar
  </span>
</motion.p>

{/* Typing Heading */}
<motion.h1
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="font-black text-white leading-[1.1] tracking-tight text-[clamp(1.8rem,4.5vw,3.2rem)]"
>
  <TypeAnimation
    sequence={[
      "FULL STACK DEVELOPER", 2000,
      "AI BUILDER", 2000,
      "PROBLEM SOLVER", 2500,
    ]}
    wrapper="span"
    speed={30}
    repeat={Infinity}
    cursor={false}   // remove extra cursor
  />
  <span className="text-cyan-400 animate-pulse">|</span>
</motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug"
          >
            I BUILD SCALABLE DIGITAL EXPERIENCES <br className="hidden sm:block" />
            THAT <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">SOLVE REAL PROBLEMS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm sm:text-base text-white/60 leading-relaxed max-w-md"
          >
           Full Stack Developer crafting scalable apps, real-time systems, and AI-powered experiences with modern technologies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <a
              data-hover
              href="#projects"
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-cta text-white font-bold text-[11px] tracking-[0.22em] uppercase shadow-[0_10px_40px_-10px_rgba(56,189,248,0.6)] hover:shadow-[0_14px_50px_-8px_rgba(56,189,248,0.85)] transition-shadow"
            >
              Explore My Work
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3 h-3" />
              </span>
            </a>
            <button
              data-hover
              onClick={() => downloadResume()}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/15 text-white/85 font-bold text-[11px] tracking-[0.22em] uppercase hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Resume
            </button>
          </motion.div>
        </div>

        {/* RIGHT — robot anchor (larger, padded so the full robot fits) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative w-full flex justify-center lg:justify-end"
        >
          <div
            className="relative w-full max-w-[640px] h-[clamp(360px,55vh,640px)]"
            data-robot-anchor="hero"
            data-robot-side="left"
            data-robot-prompt="Hi, I'm Ambar — let's build something amazing together."
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        data-hover
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/55 hover:text-cyan-300 transition-colors"
      >
        <span className="w-5 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <motion.span
            animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-cyan-400"
          />
        </span>
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase">
          Scroll
        </span>
        <ChevronDown className="w-3 h-3" />
      </motion.a>
    </section>
  );
}
