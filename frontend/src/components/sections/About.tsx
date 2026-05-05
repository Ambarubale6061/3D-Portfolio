import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-20 sm:py-32 scroll-mt-24 relative z-10 w-full overflow-hidden">
      {/* 
          Main Container: 
          W-full background cover sathi, 
          pan content la center madhe thevnyasathi max-w-[1400px] vaparla aahe.
      */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 md:pl-24 md:pr-12 lg:pl-32 lg:pr-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Right Side: Image (Mobile var hi pahila disel) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[420px] flex justify-center order-1 lg:order-2"
          >
            <div className="relative group w-full max-w-[280px] sm:max-w-[350px] lg:max-w-none">
              {/* Outer Decorative Glow/Gradient */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
                <img
                  src="/am1.png" 
                  alt="Ambar - Software Developer"
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-105 hover:scale-100"
                />
              </div>

              {/* Decorative Background Frame */}
              <div className="absolute -inset-4 border border-cyan-400/10 rounded-2xl -z-10 hidden sm:block" />
              
              {/* Bottom Right Blur Effect */}
              <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-cyan-500/10 blur-3xl rounded-full -z-10" />
            </div>
          </motion.div>

          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            <div>
              <h2 className="text-sm font-mono text-cyan-400 uppercase tracking-widest mb-4">About</h2>
              <h3 className="text-3xl sm:text-5xl font-semibold mb-6 leading-tight">
                <span className="text-white">Get to</span>{" "}
                <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                  Know Me
                </span>
              </h3>
              
              <div className="space-y-4 text-white/70 text-base sm:text-lg leading-relaxed font-light">
                <p>
                  I am Ambar, a Software Developer who enjoys building efficient, scalable, and user-friendly web applications. I have hands-on experience in both frontend and backend technologies, and I focus on writing clean code and creating smooth user experiences.
                </p>
                <p>
                  My journey started with curiosity about how digital products work, which grew into building real-world applications. I also explore AI-based features and try to integrate them into projects wherever useful. I enjoy solving problems and continuously learning new technologies.
                </p>
              </div>
            </div>

            {/* Stats Highlights */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-white/10">
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

        </div>
      </div>
    </section>
  );
}