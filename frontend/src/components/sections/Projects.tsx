import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";

// ─── Project Data ─────────────────────────────────────────────────────────────

type Project = {
  title: string;
  tagline: string;
  description: string;
  tech: { name: string; logo: string }[];
  image: string | null;
  link: string;
  github: string;
  accent: string;
  placeholderGradient: string;
};

const projects: Project[] = [
  {
    title: "AgenticAI Studio",
    tagline: "Autonomous agent orchestration",
    description: "Architected a multi-agent AI coding platform (Planner, Coder, Debugger) that automates end-to-end code generation, execution, and debugging. Features real-time streaming (SSE) with <2s latency, agent memory, version control, and a hybrid execution engine within a browser-based IDE.",
    tech: [
      { name: "React",      logo: "/React.png" },
      { name: "TypeScript", logo: "/ts.svg" },
      { name: "Node.js",    logo: "/Node.js.png" },
      { name: "Express",    logo: "/ex.png" },
      { name: "MongoDB",    logo: "/MongoDB.png" },
    ],
    image: "/IDE.png",
    link: "https://agentic-ai-studio-chi.vercel.app/",
    github: "https://github.com/Ambarubale6061/AgenticAI-Studio",
    accent: "from-violet-400 to-fuchsia-600",
    placeholderGradient: "from-violet-950 via-slate-900 to-fuchsia-950",
  },
  {
    title: "FutureCart",
    tagline: "AI-powered commerce",
    description: "Built a scalable full-stack eCommerce platform supporting 50+ products with filtering, cart, wishlist, and secure checkout. Features a real-time product management system via Supabase Realtime, reducing admin update delays by 60%, with role-based architecture and chatbot integration.",
    tech: [
      { name: "React",        logo: "/React.png" },
      { name: "Tailwind CSS", logo: "/Tailwind CSS.png" },
      { name: "TypeScript",   logo: "/ts.svg" },
      { name: "Supabase",     logo: "/icons8-supabase-48.png" },
    ],
    image: "/home.png",
    link: "https://futurecart-e-commerce.vercel.app/",
    github: "https://github.com/Ambarubale6061/FutureCart-Modern-eCommerce-Platform",
    accent: "from-emerald-400 to-teal-600",
    placeholderGradient: "from-emerald-950 via-slate-900 to-teal-950",
  },
  {
    title: "Connectly",
    tagline: "Real-time collaboration",
    description: "Developed a scalable social media platform supporting posts, reels, stories, and real-time interactions. Delivers low-latency (<1s) messaging, notifications, and presence via Supabase Realtime, with peer-to-peer voice and video calling via WebRTC and secure Postgres/RLS backend.",
    tech: [
      { name: "React",      logo: "/React.png" },
      { name: "TypeScript", logo: "/ts.svg" },
      { name: "Supabase",   logo: "/icons8-supabase-48.png" },
      { name: "WebRTC",     logo: "/webrtc.png" },
    ],
    image: "/hom.png",
    link: "https://connectly-tau.vercel.app/",
    github: "https://github.com/Ambarubale6061/Connectly",
    accent: "from-cyan-400 to-blue-600",
    placeholderGradient: "from-cyan-950 via-slate-900 to-blue-950",
  },
  {
    title: "Task Manager App",
    tagline: "Smart daily task organizer",
    description: "Built an efficient task management application to organize, track, and manage daily activities with a clean and responsive user interface for improved productivity.",
    tech: [
      { name: "Next.js",      logo: "/next.svg" },
      { name: "React",        logo: "/React.png" },
      { name: "Tailwind CSS", logo: "/Tailwind CSS.png" },
      { name: "Node.js",      logo: "/Node.js.png" },
    ],
    image: "/taskapp.png",
    link: "https://task-app-nine-lovat.vercel.app/",
    github: "https://github.com/yourusername/task-manager-app",
    accent: "from-blue-400 to-cyan-600",
    placeholderGradient: "from-blue-950 via-slate-900 to-cyan-950",
  },
  {
    title: "QuickCart",
    tagline: "Modern e-commerce experience",
    description: "Developed a modern e-commerce web application with responsive UI, product listings, cart functionality, and secure backend integration using MongoDB and Next.js.",
    tech: [
      { name: "Next.js",      logo: "/next.svg" },
      { name: "Node.js",      logo: "/Node.js.png" },
      { name: "Tailwind CSS", logo: "/Tailwind CSS.png" },
      { name: "MongoDB",      logo: "/MongoDB.png" },
    ],
    image: "/quick.png",
    link: "https://quickcart-ten-opal.vercel.app/",
    github: "https://github.com/yourusername/quickcart",
    accent: "from-emerald-400 to-green-600",
    placeholderGradient: "from-emerald-950 via-slate-900 to-green-950",
  },
  {
    title: "Weather App",
    tagline: "Live weather insights",
    description: "Designed a real-time weather dashboard that displays temperature, humidity, and weather forecasts for different cities with a modern and responsive UI.",
    tech: [
      { name: "Next.js",      logo: "/next.svg" },
      { name: "Tailwind CSS", logo: "/Tailwind CSS.png" },
      { name: "TypeScript",   logo: "/ts.svg" },
      { name: "Vite",         logo: "/Vite.png" },
    ],
    image: "/weather.png",
    link: "https://weather-dashboard-six-steel.vercel.app/",
    github: "https://github.com/yourusername/weather-app",
    accent: "from-yellow-400 to-orange-600",
    placeholderGradient: "from-yellow-950 via-slate-900 to-orange-950",
  },
];

// ─── TechIcon ─────────────────────────────────────────────────────────────────
// Replaced per-icon useState(hover) with CSS :hover — eliminates 30 React state
// nodes (6 cards × 5 icons) and their re-render cascades. The tooltip is shown
// via a CSS group-hover pattern so there are zero JS event handlers needed.
// AnimatePresence for the tooltip is preserved via the CSS transition approach.

function TechIcon({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="relative flex items-center justify-center group/icon">
      {/* Glow ring — CSS hover, no JS */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="w-10 h-10 rounded-full bg-slate-800/90 border border-white/15 group-hover/icon:border-cyan-400/80 group-hover/icon:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-300 flex items-center justify-center">
          <img
            src={logo}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-5 h-5 object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      </div>

      {/* Tooltip — pure CSS, no state */}
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-white text-[10px] font-bold whitespace-nowrap z-20 shadow-xl pointer-events-none opacity-0 scale-95 group-hover/icon:opacity-100 group-hover/icon:scale-100 transition-all duration-150">
        {name}
      </div>
    </div>
  );
}

// ─── ProjectCard ──────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative h-full flex flex-col rounded-3xl border border-white/10 bg-slate-950/80 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">

      {/* Image */}
      <div className="relative w-full h-64 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
        <motion.div
          className="w-full h-full flex items-center justify-center"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="z-10 absolute top-12 translate-y-2 rounded-t-lg shadow-2xl"
              width={460}
              height={300}
              style={{
                objectFit: "contain",
                width: "92%",
                height: "auto",
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${project.placeholderGradient} opacity-60`} />
          )}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)",
              backgroundSize: "24px 24px",
            }}
          />
        </motion.div>
        <div className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${project.accent} opacity-50`} />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">
          <p className={`text-[10px] font-mono tracking-widest uppercase mb-1 bg-gradient-to-r ${project.accent} bg-clip-text text-transparent font-black`}>
            {project.tagline}
          </p>
          <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
            {project.title}
          </h4>
        </div>

        <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2.5 mb-5">
          {project.tech.map((t) => (
            <TechIcon key={t.name} name={t.name} logo={t.logo} />
          ))}
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
          >
            View Project <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full border border-white/10 text-white hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function Projects() {
  return (
    <section
      id="projects"
      className="w-full py-24 px-6 sm:px-10 lg:px-16 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
            / My Work
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold mb-6 leading-tight">
            <span className="text-white">Featured</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Projects
            </span>
          </h2>
          <p className="text-white/55 mt-5 max-w-2xl mx-auto text-base sm:text-lg font-medium">
            Building reliable, scalable, and user-focused digital products.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              className="h-full"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}