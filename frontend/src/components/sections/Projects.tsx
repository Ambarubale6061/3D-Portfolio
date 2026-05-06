import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, Github, Globe } from "lucide-react";

// ─── Project Data ────────────────────────────────────────────────────────────

type Project = {
  title: string;
  tagline: string;
  description: string;
  tech: { name: string; logo: string }[];
  image: string | null; // Ithe tu /project-1.png asha paths vapru shakshil
  link: string;
  github: string;
  accent: string;
  placeholderGradient: string;
};

const projects: Project[] = [
  {
    title: "Connectly",
    tagline: "Real-time collaboration",
    description: "A real-time collaboration platform with WebRTC video calls, shared cursors, and live document editing for distributed engineering teams.",
    tech: [
      { name: "Next.js", logo: "/next.svg" },
      { name: "WebRTC", logo: "/webrtc.png" },
      { name: "Socket.io", logo: "/socket.png" },
      { name: "MongoDB", logo: "/MongoDB.png" },
      { name: "Express", logo: "/ex.png" },
    ],
    image: null, 
    link: "#",
    github: "#",
    accent: "from-cyan-400 to-blue-600",
    placeholderGradient: "from-cyan-950 via-slate-900 to-blue-950",
  },
  {
    title: "AgenticAI Studio",
    tagline: "Autonomous agent orchestration",
    description: "Drag-and-drop visual builder for autonomous LLM agent workflows with real-time execution monitoring and multi-model routing.",
    tech: [
      { name: "React", logo: "/React.png" },
      { name: "Firebase", logo: "/Firebase.png" },
      { name: "Framer", logo: "/framer.svg" },
      { name: "Supabase", logo: "/icons8-supabase-48.png" },
      { name: "PostgreSQL", logo: "/PostgresSQL.png" },
    ],
    image: null,
    link: "#",
    github: "#",
    accent: "from-violet-400 to-fuchsia-600",
    placeholderGradient: "from-violet-950 via-slate-900 to-fuchsia-950",
  },
  {
    title: "FutureCart",
    tagline: "AI-powered commerce",
    description: "Next-generation e-commerce platform with personalized AI recommendations and predictive inventory analytics.",
    tech: [
      { name: "Node.js", logo: "/Node.js.png" },
      { name: "Tailwind", logo: "/Tailwind CSS.png" },
      { name: "Three.js", logo: "/Three.js.png" },
      { name: "Git", logo: "/git.svg" },
      { name: "TypeScript", logo: "/ts.svg" },
    ],
    image: null,
    link: "#",
    github: "#",
    accent: "from-emerald-400 to-teal-600",
    placeholderGradient: "from-emerald-950 via-slate-900 to-teal-950",
  },
];

// ─── TechIcon (Old Tooltip Logic) ───────────────────────────────────────────

function TechIcon({ name, logo }: { name: string; logo: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-full bg-cyan-500/20 blur-md transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`w-10 h-10 rounded-full bg-slate-800/90 border transition-all duration-300 flex items-center justify-center ${
            hovered ? "border-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.4)]" : "border-white/15"
          }`}
        >
          <img
            src={logo}
            alt={name}
            className="w-5 h-5 object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-900 border border-white/10 text-white text-[10px] font-bold whitespace-nowrap z-20 shadow-xl"
          >
            {name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ProjectCard ────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative h-full flex flex-col rounded-3xl border border-white/10 bg-slate-950/80 transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
      
      {/* Image Area - Ready for your public images */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <motion.div 
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${project.placeholderGradient} opacity-60`} />
          )}
          
          {/* Decorative Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
        </motion.div>
        
        <div className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r ${project.accent} opacity-50`} />
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1">
        <div className="mb-4">
          <p className={`text-[10px] font-mono tracking-widest uppercase mb-1 bg-gradient-to-r ${project.accent} bg-clip-text text-transparent font-black`}>
            {project.tagline}
          </p>
          <h4 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
            {project.title}
          </h4>
        </div>
        
        <p className="text-white/50 text-sm leading-relaxed mb-8 flex-1">
          {project.description}
        </p>

        {/* Tech Stack - Reverted to Old Style */}
        <div className="flex flex-wrap gap-3 mb-8">
          {project.tech.map((t) => (
            <TechIcon key={t.name} name={t.name} logo={t.logo} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-auto">
          <a
            href={project.link}
            className="flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
          >
            View Project <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={project.github}
            className="p-3 rounded-full border border-white/10 text-white hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
          / My Work
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Featured{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            Projects
          </span>
        </h2>
        <p className="text-white/55 mt-5 max-w-2xl mx-auto text-base sm:text-lg font-medium">
          Building reliable, scalable, and user-focused digital products.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}