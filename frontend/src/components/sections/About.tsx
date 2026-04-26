import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 scroll-mt-24 relative z-10">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-8"
        >
          <div>
            <h2 className="text-sm font-mono text-primary uppercase tracking-widest mb-4">About</h2>
           <h3 className="text-3xl sm:text-5xl font-semibold mb-6">
  <span className="text-white">Get to</span>{" "}
  <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
  Know Me
</span>
</h3>
            
            <div className="space-y-4 text-white/70 text-lg leading-relaxed font-light">
  <p>
    I am Ambar, a Software Developer who enjoys building efficient, scalable, and user-friendly web applications. I have hands-on experience in both frontend and backend technologies, and I focus on writing clean code and creating smooth user experiences.
  </p>
  <p>
    My journey started with curiosity about how digital products work, which grew into building real-world applications. I also explore AI-based features and try to integrate them into projects wherever useful. I enjoy solving problems and continuously learning new technologies to improve my skills.
  </p>
</div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
  <div className="space-y-1">
    <div className="text-2xl sm:text-2xl font-semibold text-cyan-400">15+</div>
    <div className="text-xs sm:text-sm text-white/60">Projects Completed</div>
  </div>

  <div className="space-y-1">
    <div className="text-2xl sm:text-2xl font-semibold text-cyan-400">Full Stack</div>
    <div className="text-xs sm:text-sm text-white/60">Development Focus</div>
  </div>

  <div className="space-y-1">
    <div className="text-2xl sm:text-2xl font-semibold text-cyan-400">Real-Time</div>
    <div className="text-xs sm:text-sm text-white/60">System Experience</div>
  </div>
</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-[400px]"
        >
          <div
            className="w-full aspect-square"
            data-robot-anchor="about"
            data-robot-side="right"
            data-robot-prompt="Curious about Ambar? He builds scalable apps, real-time systems, and AI-powered products."
          />
        </motion.div>
      </div>
    </section>
  );
}
