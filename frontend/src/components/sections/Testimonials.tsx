"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Testimonial = {
  name: string;
  role: string;
  /**
   * Optional real photo path (relative to /public).
   * e.g. "/avatars/user1.jpg"
   * When null or the image fails to load, an initials badge is shown instead —
   * this way adding real photos later is a one-line change with zero breakage.
   */
  image?: string | null;
  text: string;
  /** Tailwind gradient used for the initials badge background */
  gradient: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Rahul Mehta",
    role: "CTO, TechVentures",
    // Set image: "/avatars/user1.jpg" once you add the file to /public/avatars/
    image: null,
    gradient: "from-cyan-500 to-blue-600",
    text: "Ambar's code quality is exceptional — clean, well-documented, and highly scalable.",
  },
  {
    name: "Priya Sharma",
    role: "Product Lead, Connectly",
    image: null,
    gradient: "from-violet-500 to-fuchsia-600",
    text: "A rare ability to bridge complex backend logic with stunning, intuitive UI design.",
  },
  {
    name: "James Wilson",
    role: "Founder, AgenticAI",
    image: null,
    gradient: "from-emerald-500 to-teal-600",
    text: "Delivered ahead of schedule with zero technical debt. Truly impressive work.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Senior Dev, Codec Tech",
    image: null,
    gradient: "from-orange-500 to-rose-600",
    text: "Professional reliability and attention to detail that is genuinely second to none.",
  },
  {
    name: "David Chen",
    role: "Engineering Manager",
    image: null,
    gradient: "from-sky-500 to-indigo-600",
    text: "One of the most thoughtful, precise developers I've ever had the pleasure to work with.",
  },
];

// ─── InitialsAvatar ───────────────────────────────────────────────────────────
// Renders a real photo when provided; falls back to an initials badge that
// matches the testimonial's accent gradient. Adding a real photo later is a
// one-line change in the data array above.

function InitialsAvatar({
  name,
  image,
  gradient,
}: {
  name: string;
  image?: string | null;
  gradient: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-11 h-11 rounded-full object-cover border border-white/10"
        // ✅ Silently fall back to the initials badge if the image 404s
        onError={(e) => {
          const wrapper = (e.currentTarget as HTMLImageElement).parentElement;
          if (wrapper) {
            // Replace the broken img with the initials badge
            (e.currentTarget as HTMLImageElement).style.display = "none";
            const badge = wrapper.querySelector<HTMLElement>("[data-initials]");
            if (badge) badge.style.display = "flex";
          }
        }}
      />
    );
  }

  return (
    <div
      data-initials
      className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

// ─── Testimonials section ─────────────────────────────────────────────────────

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 sm:py-32 scroll-mt-24 overflow-hidden relative"
    >
      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="mb-16 text-center max-w-4xl mx-auto"
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

      {/* ── Marquee ── */}
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
          {[...testimonials, ...testimonials].map((testimonial, i) => (
            <div
              key={i}
              className="w-[350px] sm:w-[420px] shrink-0 mx-4 bg-white/[0.03] border border-white/10 backdrop-blur-sm p-8 rounded-2xl transition-all duration-300 hover:border-cyan-400/30"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-6">
                <Quote className="w-4 h-4" />
              </div>

              {/* Body */}
              <p className="text-white/80 text-base leading-relaxed mb-8 whitespace-normal font-medium">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <InitialsAvatar
                    name={testimonial.name}
                    image={testimonial.image}
                    gradient={testimonial.gradient}
                  />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]" />
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

        {/* Side fade gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}