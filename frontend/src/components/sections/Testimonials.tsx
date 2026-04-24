import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Mehta",
    role: "CTO, TechVentures",
    text: "Ambar's code quality is exceptional — clean, well-documented, and highly scalable."
  },
  {
    name: "Priya Sharma",
    role: "Product Lead, Connectly",
    text: "A rare ability to bridge complex backend logic with stunning, intuitive UI design."
  },
  {
    name: "James Wilson",
    role: "Founder, AgenticAI",
    text: "Delivered ahead of schedule with zero technical debt. Truly impressive work."
  },
  {
    name: "Sneha Kulkarni",
    role: "Senior Dev, Codec Tech",
    text: "Professional reliability and attention to detail that is genuinely second to none."
  },
  {
    name: "David Chen",
    role: "Engineering Manager",
    text: "One of the most thoughtful, precise developers I've ever had the pleasure to work with."
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 scroll-mt-24 overflow-hidden relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center max-w-2xl mx-auto"
      >
        <h2 className="text-sm font-mono text-primary uppercase tracking-widest mb-4">Testimonials</h2>
        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">What People Say</h3>
      </motion.div>

      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
          {[...testimonials, ...testimonials].map((testimonial, i) => (
            <div
              key={i}
              className="w-[350px] sm:w-[450px] shrink-0 mx-4 glass-panel p-8 rounded-3xl"
            >
              <Quote className="w-8 h-8 text-primary/40 mb-6" />
              <p className="text-white/80 font-light text-lg leading-relaxed mb-8 whitespace-normal">
                "{testimonial.text}"
              </p>
              <div>
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-sm text-white/50">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
