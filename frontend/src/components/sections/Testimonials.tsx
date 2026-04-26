"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Mehta",
    role: "CTO, TechVentures",
    image: "/avatars/user1.jpg",
    text: "Ambar's code quality is exceptional — clean, well-documented, and highly scalable."
  },
  {
    name: "Priya Sharma",
    role: "Product Lead, Connectly",
    image: "/avatars/user2.jpg",
    text: "A rare ability to bridge complex backend logic with stunning, intuitive UI design."
  },
  {
    name: "James Wilson",
    role: "Founder, AgenticAI",
    image: "/avatars/user3.jpg",
    text: "Delivered ahead of schedule with zero technical debt. Truly impressive work."
  },
  {
    name: "Sneha Kulkarni",
    role: "Senior Dev, Codec Tech",
    image: "/avatars/user4.jpg",
    text: "Professional reliability and attention to detail that is genuinely second to none."
  },
  {
    name: "David Chen",
    role: "Engineering Manager",
    image: "/avatars/user5.jpg",
    text: "One of the most thoughtful, precise developers I've ever had the pleasure to work with."
  }
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      // REMOVED 'bg-black' to make it transparent like your Contact section
      className="py-24 sm:py-32 scroll-mt-24 overflow-hidden relative"
    >
      {/* Heading */}
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.7 }}
  className="mb-16 text-center max-w-4xl mx-auto" // Increased max-w to give it room
>
  <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
    / Testimonials
  </p>

  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight whitespace-nowrap">
    Kind words from{" "}
    <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
      Satisfied Clients
    </span>
  </h2>
</motion.div>

      {/* Marquee */}
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
          {[...testimonials, ...testimonials].map((testimonial, i) => (
            <div
              key={i}
              // MATCHED COLORS: bg-white/[0.03] and border-white/10 to match your form fields
              className="w-[350px] sm:w-[420px] shrink-0 mx-4 bg-white/[0.03] border border-white/10 backdrop-blur-sm p-8 rounded-2xl transition-all duration-300 hover:border-cyan-400/30"
            >
              {/* Quote icon matching your Mail/MapPin icons */}
              <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-6">
                <Quote className="w-4 h-4" />
              </div>

              {/* Text */}
              <p className="text-white/80 text-base leading-relaxed mb-8 whitespace-normal font-medium">
                "{testimonial.text}"
              </p>

              {/* User profile */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/10"
                  />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"></div>
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-white text-sm tracking-tight">
                    {testimonial.name}
                  </div>
                  <div className="text-[10px] font-bold tracking-widest text-white/40 uppercase mt-0.5">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Added Fade Gradients on sides for smoother look */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent"></div>
      </div>
    </section>
  );
}