"use client";

import { memo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Testimonial = {
  name:        string;
  role:        string;
  company?:    string;
  image:       string | null;
  text:        string;
  gradient:    string;
  accentColor: string;
  rating?:     number;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const testimonials: Testimonial[] = [
  {
  name:        "Aniket Kolhe",
  role:        "Frontend Developer",
  company:     "Freelance",
  image:       "/aniket.jpg",
  gradient:    "from-violet-400 via-purple-500 to-indigo-600",
  accentColor: "violet",
  rating:      5,
  text: "Ambar is a highly dedicated full-stack developer. He has an amazing ability to turn complex problems into simple, functional solutions. Working with him is always a pleasure.",
},

  {
    name:        "Pushkraj Musmade",
    role:        "Software Engineer",
    company:     "BharatGo",
    image:       "/pushkraj.jpeg",
    gradient:    "from-pink-400 via-rose-500 to-red-500",
    accentColor: "pink",
    rating:      5,
    text: "Ambar combines technical knowledge with a strong understanding of modern web design. He is dependable, hardworking, and always ready to learn new technologies.",
},
{
    name:        "Amol Kshirsagar",
    role:        "Digital Engineering Staff Engineer",
    company:     "NTT DATA",
    image:       "/amol.jpg",
    gradient:    "from-violet-400 via-purple-500 to-indigo-600",
    accentColor: "purple",
    rating:      5,
    text: "Working with Ambar was a smooth experience. He writes clean code, understands project requirements quickly, and always focuses on building scalable and responsive applications.",
},
{
    name:        "Durgesh Gadekar",
    role:        "AEM Producer",
    company:     "Accenture",
    image:       "/durgesh.jpg",
    gradient:    "from-emerald-400 via-green-500 to-teal-600",
    accentColor: "green",
    rating:      5,
    text: "Ambar is passionate about development and consistently delivers high-quality work. His dedication, creativity, and teamwork skills make him stand out as a developer.",
},
{
    name:        "Amrut Kshirsagar",
    role:        "Staff Engineer",
    company:     "Altimetrik",
    image:       "/amrut.jpg",
    gradient:    "from-orange-400 via-amber-500 to-yellow-500",
    accentColor: "orange",
    rating:      5,
    text: "Ambar combines technical knowledge with a strong understanding of modern web design. He is dependable, hardworking, and always ready to learn new technologies.",
  },
  {
  name:        "Suresh Kandelkar",
  role:        "Android Developer",
  company:     "Freelance",
  image:       "/suresh.jpg",
  gradient:    "from-emerald-400 via-green-500 to-teal-600",
  accentColor: "emerald",
  rating:      5,
  text: "Ambar is reliable, skilled, and always eager to learn new technologies. He's the kind of developer who makes teamwork smooth and results outstanding.",
},
];

// ─── Accent maps ──────────────────────────────────────────────────────────────

const accentBg: Record<string, string> = {
  cyan:    "rgba(34,211,238,0.09)",
  violet:  "rgba(167,139,250,0.09)",
  emerald: "rgba(52,211,153,0.09)",
};

const accentBorder: Record<string, string> = {
  cyan:    "rgba(34,211,238,0.40)",
  violet:  "rgba(167,139,250,0.40)",
  emerald: "rgba(52,211,153,0.40)",
};

const accentGlow: Record<string, string> = {
  cyan:    "0 8px 40px rgba(34,211,238,0.18), 0 2px 12px rgba(0,0,0,0.3)",
  violet:  "0 8px 40px rgba(167,139,250,0.18), 0 2px 12px rgba(0,0,0,0.3)",
  emerald: "0 8px 40px rgba(52,211,153,0.18),  0 2px 12px rgba(0,0,0,0.3)",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

const StarIcon = memo(function StarIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className="w-[10px] h-[10px]"
      aria-hidden="true"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
});

// ─── DPAvatar ─────────────────────────────────────────────────────────────────

const DPAvatar = memo(function DPAvatar({
  name,
  image,
  gradient,
  hovered,
}: {
  name:     string;
  image:    string | null;
  gradient: string;
  hovered:  boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = image !== null && !failed;

  return (
    <div className="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12">
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient}`}
        style={{ opacity: hovered ? 1 : 0.55, transition: "opacity 0.5s ease" }}
      />
      <div className="absolute rounded-full bg-[#08111e]" style={{ inset: "2px" }} />
      <div className="absolute rounded-full overflow-hidden" style={{ inset: "2px" }}>
        {showPhoto ? (
          <img
            src={image}
            alt={name}
            draggable={false}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center"
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-white font-bold text-[10px] sm:text-[11px] leading-none select-none">
              {getInitials(name)}
            </span>
          </div>
        )}
      </div>
      <div
        className={`absolute -inset-1.5 rounded-full blur-[12px] bg-gradient-to-br ${gradient}`}
        style={{
          opacity:    hovered ? 0.4 : 0,
          transition: "opacity 0.5s ease",
          zIndex:     -1,
        }}
      />
    </div>
  );
});

// ─── TestimonialCard ──────────────────────────────────────────────────────────

const STAR_ARRAYS: Record<number, number[]> = {
  5: [0, 1, 2, 3, 4],
  4: [0, 1, 2, 3],
  3: [0, 1, 2],
};

const TestimonialCard = memo(function TestimonialCard({
  testimonial,
  onMouseEnter,
  onMouseLeave,
}: {
  testimonial:  Testimonial;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ac = testimonial.accentColor;

  const handleEnter = () => { setHovered(true);  onMouseEnter(); };
  const handleLeave = () => { setHovered(false); onMouseLeave(); };

  const stars = testimonial.rating ? (STAR_ARRAYS[testimonial.rating] ?? []) : [];

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="testimonial-card relative border rounded-2xl p-5 sm:p-6 backdrop-blur-md overflow-hidden select-none flex flex-col shrink-0"
      style={{
        background: hovered
          ? `linear-gradient(148deg, rgba(255,255,255,0.06) 0%, ${accentBg[ac] || 'rgba(255,255,255,0.03)'} 100%)`
          : "rgba(255,255,255,0.03)",
        borderColor: hovered ? (accentBorder[ac] || "rgba(255,255,255,0.2)") : "rgba(255,255,255,0.07)",
        boxShadow: hovered
  ? "0 8px 24px rgba(0,0,0,0.22)"
  : "0 2px 16px rgba(0,0,0,0.22)",
        transform:   hovered ? "translateY(-6px) scale(1.013)" : "translateY(0) scale(1)",
        transition:  "background 0.55s ease, border-color 0.55s ease, box-shadow 0.55s ease, transform 0.55s ease",
      }}
    >
      {/* ── Top-left L-bracket accent ── */}
      <div
        className={`absolute top-0 left-0 w-12 h-[2px] rounded-full bg-gradient-to-r ${testimonial.gradient}`}
        style={{ opacity: hovered ? 1 : 0.28, transition: "opacity 0.55s ease" }}
      />
      <div
        className={`absolute top-0 left-0 h-12 w-[2px] rounded-full bg-gradient-to-b ${testimonial.gradient}`}
        style={{ opacity: hovered ? 1 : 0.28, transition: "opacity 0.55s ease" }}
      />

      {/* ── Star rating ── */}
      {stars.length > 0 && (
        <div className="flex items-center gap-[3px] mb-3">
          {stars.map((i) => (
            <span
              key={i}
              className={`bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}
            >
              <StarIcon />
            </span>
          ))}
        </div>
      )}

      {/* ── Quote text ── */}
      <div className="flex-1 overflow-hidden">
        <p className="text-white/68 text-[12.5px] sm:text-[13.5px] leading-[1.6] sm:leading-[1.75] font-normal tracking-[0.008em] line-clamp-5 sm:line-clamp-4">
          <span
            className={`text-[18px] sm:text-[20px] font-serif bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent leading-none align-bottom mr-[1px]`}
          >
            "
          </span>
          {testimonial.text}
          <span
            className={`text-[18px] sm:text-[20px] font-serif bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent leading-none align-bottom ml-[1px]`}
          >
            "
          </span>
        </p>
      </div>

      {/* ── Hairline divider ── */}
      <div
        className={`h-px w-full my-3 sm:my-4 bg-gradient-to-r ${testimonial.gradient}`}
        style={{ opacity: hovered ? 0.20 : 0.08, transition: "opacity 0.55s ease" }}
      />

      {/* ── Author row ── */}
      <div className="flex items-center gap-3">
        <DPAvatar
          name={testimonial.name}
          image={testimonial.image}
          gradient={testimonial.gradient}
          hovered={hovered}
        />

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white text-[12px] sm:text-[13px] tracking-tight truncate leading-snug">
            {testimonial.name}
          </p>
          <p className="text-[9px] sm:text-[10px] tracking-[0.12em] text-white/38 uppercase mt-[2px] sm:mt-[3px] truncate font-medium">
            {testimonial.role}
            {testimonial.company ? ` · ${testimonial.company}` : ""}
          </p>
        </div>

        {/* 3 × 3 decorative dot grid */}
        <div
          className="hidden xs:flex flex-col gap-[3px] shrink-0"
          style={{ opacity: hovered ? 0.6 : 0.18, transition: "opacity 0.55s ease" }}
        >
          {[0, 1, 2].map((r) => (
            <div key={r} className="flex gap-[3px]">
              {[0, 1, 2].map((c) => (
                <div
                  key={c}
                  className={`w-[2px] sm:w-[2.5px] h-[2px] sm:h-[2.5px] rounded-full bg-gradient-to-br ${testimonial.gradient}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// ─── MarqueeTrack ─────────────────────────────────────────────────────────────

function MarqueeTrack({
  items,
  paused,
  onHover,
}: {
  items:   Testimonial[];
  paused:  boolean;
  onHover: (v: boolean) => void;
}) {
  const doubled = [...items, ...items];
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Drag to scroll logic
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    onHover(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    onHover(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    onHover(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div 
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={`overflow-x-hidden cursor-grab ${isDown ? 'cursor-grabbing' : ''}`}
    >
      <div
  className="flex py-5 w-max"
  style={{
    display: "flex",
    animation: "testimonials-marquee 60s linear infinite",
    animationPlayState: paused ? "paused" : "running",
  }}
>
        {doubled.map((t, i) => (
          <TestimonialCard
            key={i}
            testimonial={t}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Testimonials (section) ───────────────────────────────────────────────────

export function Testimonials() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [paused, setPaused] = useState(false);

  return (
    <>
      <style>{`
        :root {
          --card-width: 600px;
          --card-height: 260px;
          --card-margin: 14px;
        }

        @media (max-width: 640px) {
          :root {
            --card-width: 280px;
            --card-height: 320px;
            --card-margin: 8px;
          }
        }

        @media (min-width: 380px) and (max-width: 640px) {
          :root {
            --card-width: 320px;
            --card-height: 280px;
          }
        }

        .testimonial-card {
          width: var(--card-width);
          height: var(--card-height);
          margin: 0 var(--card-margin);
        }

       @keyframes testimonials-marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
      `}</style>

      <section
        id="testimonials"
        ref={ref}
        className="relative w-full overflow-hidden py-16 sm:py-32 scroll-mt-24"
      >
        {/* ── Heading block ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-10 sm:mb-16 text-center px-4 max-w-4xl mx-auto"
        >
          <p className="text-cyan-400 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3">
            / Testimonials
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold leading-tight mt-3">
            <span className="text-white block sm:inline">Kind words from</span>{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Satisfied Clients
            </span>
          </h2>
        </motion.div>

        {/* ── Marquee ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <MarqueeTrack items={testimonials} paused={paused} onHover={setPaused} />

          {/* Left + right edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0  z-10 w-16 bg-gradient-to-r  from-background to-transparent sm:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-40" />
        </motion.div>
      </section>
    </>
  );
}