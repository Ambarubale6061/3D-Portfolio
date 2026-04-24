import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Sparkles, Rocket, GraduationCap, Code2, Zap } from "lucide-react";

const experiences = [
  {
    year: "2026",
    role: "Senior Full-Stack Engineer",
    company: "Independent / Freelance",
    location: "Remote",
    description:
      "Architecting AI-augmented web platforms for early-stage startups. Shipping production systems from infrastructure to UI.",
    achievements: [
      "Built 3 production AI products end-to-end",
      "Reduced average ship cycle to 3 weeks",
    ],
    tech: ["Next.js", "TypeScript", "OpenAI", "Postgres"],
    icon: Sparkles,
    accent: "from-cyan-400 to-blue-600",
  },
  {
    year: "2025",
    role: "AI Engineer",
    company: "Stealth Startup",
    location: "San Francisco · Remote",
    description:
      "Designed retrieval-augmented agent pipelines processing millions of documents weekly. Led the move from monolith to microservices.",
    achievements: [
      "Cut inference cost 62% via custom routing",
      "Scaled vector search to 40M+ embeddings",
    ],
    tech: ["Python", "LangChain", "Pinecone", "Kubernetes"],
    icon: Rocket,
    accent: "from-violet-400 to-fuchsia-600",
  },
  {
    year: "2024",
    role: "Full-Stack Developer",
    company: "JaruratCare Foundation",
    location: "India · Hybrid",
    description:
      "Built end-to-end healthcare management system serving 12 clinics. Led complex business-logic migrations while preserving UI integrity for non-technical staff.",
    achievements: [
      "Onboarded 12 clinics in first quarter",
      "Trained 40+ staff on the new platform",
    ],
    tech: ["React", "Node.js", "MongoDB", "Express"],
    icon: Code2,
    accent: "from-emerald-400 to-teal-600",
  },
  {
    year: "2023",
    role: "Java Developer Intern",
    company: "Codec Technologies",
    location: "Remote",
    description:
      "Architected backend services with Spring Boot. Improved API response time 40% via aggressive query optimization, indexed reads, and Redis caching.",
    achievements: [
      "Reduced p95 latency from 480ms → 290ms",
      "Open-sourced 2 internal libraries",
    ],
    tech: ["Java", "Spring Boot", "Redis", "MySQL"],
    icon: Briefcase,
    accent: "from-amber-400 to-orange-600",
  },
  {
    year: "2022",
    role: "Frontend Engineer (Contract)",
    company: "Various Agencies",
    location: "Remote",
    description:
      "Delivered 14 marketing sites and 3 web apps for design agencies. Specialized in motion-driven landing pages and Webflow → React conversions.",
    achievements: [
      "Shipped 14 sites with 100 Lighthouse scores",
      "Cut average build time by half via Vite",
    ],
    tech: ["React", "GSAP", "Tailwind", "Vite"],
    icon: Zap,
    accent: "from-pink-400 to-rose-600",
  },
  {
    year: "2021",
    role: "B.Tech in Computer Science",
    company: "Started the Journey",
    location: "India",
    description:
      "Began formal CS education with a focus on systems, algorithms, and distributed computing. Built first SaaS product as a freshman side project.",
    achievements: [
      "Top 5% of cohort",
      "Hackathon winner × 3",
    ],
    tech: ["C++", "Python", "Linux", "Git"],
    icon: GraduationCap,
    accent: "from-sky-400 to-indigo-600",
  },
];

function TimelineNode({
  exp,
  index,
}: {
  exp: (typeof experiences)[number];
  index: number;
}) {
  const Icon = exp.icon;
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-10 items-start"
    >
      {/* Left card (desktop) */}
      <div className={`lg:col-start-1 ${isLeft ? "lg:block" : "lg:invisible lg:hidden"}`}>
        {isLeft && <Card exp={exp} align="right" />}
      </div>

      {/* Center node */}
      <div className="absolute left-0 lg:static lg:col-start-2 flex flex-col items-center pt-2">
        <motion.div
          whileInView={{ scale: [0.6, 1.15, 1] }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          {/* Pulse halo */}
          <span
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${exp.accent} opacity-40 blur-md scale-150`}
          />
          <div
            className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${exp.accent} flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.45)] ring-4 ring-slate-950`}
          >
            <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>
        {/* Year badge */}
        <div
          className={`mt-3 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-[10px] font-mono tracking-[0.2em] font-bold bg-gradient-to-r ${exp.accent} bg-clip-text text-transparent`}
        >
          {exp.year}
        </div>
      </div>

      {/* Mobile card (always) + Right card (desktop) */}
      <div className={`pl-16 lg:pl-0 lg:col-start-3 ${isLeft ? "lg:invisible lg:hidden" : "lg:block"}`}>
        {(!isLeft || true) && (
          <div className="lg:hidden">
            <Card exp={exp} align="left" />
          </div>
        )}
        {!isLeft && (
          <div className="hidden lg:block">
            <Card exp={exp} align="left" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Card({
  exp,
  align,
}: {
  exp: (typeof experiences)[number];
  align: "left" | "right";
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      data-hover
      className={`group relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-xl p-6 sm:p-7 overflow-hidden ${
        align === "right" ? "lg:text-right" : ""
      }`}
    >
      {/* Accent edge */}
      <div
        className={`absolute inset-y-0 ${
          align === "right" ? "right-0" : "left-0"
        } w-1 bg-gradient-to-b ${exp.accent} opacity-70`}
      />
      {/* Hover glow */}
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${exp.accent} opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-500 -z-10`}
      />

      <div className={`flex items-center gap-2 mb-3 ${align === "right" ? "lg:justify-end" : ""}`}>
        <span
          className={`text-[10px] font-mono tracking-[0.22em] font-bold uppercase bg-gradient-to-r ${exp.accent} bg-clip-text text-transparent`}
        >
          {exp.location}
        </span>
      </div>

      <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
        {exp.role}
      </h4>
      <p className={`text-sm text-cyan-300/80 font-mono mb-4`}>{exp.company}</p>

      <p className="text-white/65 text-sm leading-relaxed mb-5">{exp.description}</p>

      {/* Achievements */}
      <ul className={`space-y-1.5 mb-5 ${align === "right" ? "lg:items-end" : ""}`}>
        {exp.achievements.map((a) => (
          <li
            key={a}
            className={`flex items-start gap-2 text-xs text-white/70 ${
              align === "right" ? "lg:flex-row-reverse lg:text-right" : ""
            }`}
          >
            <span
              className={`mt-1.5 w-1 h-1 rounded-full bg-gradient-to-r ${exp.accent} shrink-0`}
            />
            <span>{a}</span>
          </li>
        ))}
      </ul>

      {/* Tech */}
      <div className={`flex flex-wrap gap-1.5 ${align === "right" ? "lg:justify-end" : ""}`}>
        {exp.tech.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-white/60 tracking-wide"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 100,
    damping: 30,
  });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-24 sm:py-32 scroll-mt-24 relative"
    >
      <div
        className="hidden lg:block absolute top-0 right-0 w-[260px] h-[260px] pointer-events-none"
        data-robot-anchor="experience"
        data-robot-side="left"
        data-robot-prompt="A few years across startups, agencies, and AI research labs."
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-20"
      >
        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
          / Career Journey
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Experience <span className="text-gradient-primary">Timeline</span>
        </h2>
        <p className="text-white/55 mt-5 max-w-2xl mx-auto text-base sm:text-lg">
          From first lines of code to shipping AI products. Scroll to follow the trail.
        </p>
      </motion.div>

      {/* Timeline rail */}
      <div className="relative max-w-6xl mx-auto">
        {/* Static rail (mobile: left, desktop: center) */}
        <div className="absolute top-0 bottom-0 left-5 lg:left-1/2 lg:-translate-x-1/2 w-px bg-white/10 pointer-events-none" />
        {/* Animated progress fill */}
        <motion.div
          style={{ height: lineHeight }}
          className="absolute top-0 left-5 lg:left-1/2 lg:-translate-x-1/2 w-px origin-top bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_20px_rgba(56,189,248,0.7)] pointer-events-none"
        />
        {/* Glowing scroll head */}
        <motion.div
          style={{ top: lineHeight }}
          className="absolute left-5 lg:left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_20px_8px_rgba(56,189,248,0.5)] pointer-events-none"
        />

        <div className="space-y-16 lg:space-y-24">
          {experiences.map((exp, i) => (
            <TimelineNode key={exp.year + exp.role} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
