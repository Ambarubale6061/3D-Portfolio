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
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">Meticulous Engineering. Obsessive Design.</h3>
            
            <div className="space-y-4 text-white/70 text-lg leading-relaxed font-light">
              <p>
                Ambar is a full-stack developer who bridges meticulous backend engineering with obsessively detailed UI work. Has shipped healthcare platforms, real-time collaboration tools, and AI-driven products.
              </p>
              <p>
                Believes great software feels effortless. Whether it's architecting a complex microservices backend or crafting fluid micro-animations on the frontend, the goal is always a premium, performant user experience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white mb-1">3+</div>
              <div className="text-sm text-white/50">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">20+</div>
              <div className="text-sm text-white/50">Projects Shipped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/50">On-Time Delivery</div>
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
            data-robot-prompt="Curious about Ambar? He's been shipping production code for 6+ years."
          />
        </motion.div>
      </div>
    </section>
  );
}
