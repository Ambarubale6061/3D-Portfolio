import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, Github, X, ExternalLink, Globe, Code2 } from "lucide-react";
import project1Img from "../../assets/project-1.png";
import project2Img from "../../assets/project-2.png";
import project3Img from "../../assets/project-3.png";

type Project = {
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  image: string;
  link: string;
  github: string;
  accent: string;
  stats: { label: string; value: string }[];
};

const projects: Project[] = [
  {
    title: "Connectly",
    tagline: "Real-time collaboration",
    description:
      "A real-time collaboration platform with WebRTC video calls, shared cursors, and live document editing for distributed engineering teams. Scaled to 50K monthly active users on a serverless backend.",
    tech: ["Next.js", "WebRTC", "Socket.io", "MongoDB", "Redis"],
    image: project1Img,
    link: "#",
    github: "#",
    accent: "from-cyan-400 to-blue-600",
    stats: [
      { label: "MAU", value: "50K+" },
      { label: "Latency", value: "<80ms" },
      { label: "Uptime", value: "99.9%" },
    ],
  },
  {
    title: "AgenticAI Studio",
    tagline: "Autonomous agent orchestration",
    description:
      "Drag-and-drop visual builder for autonomous LLM agent workflows with real-time execution monitoring, branching logic, and multi-model routing across OpenAI, Anthropic, and open-source providers.",
    tech: ["React", "Python", "LangChain", "Supabase", "Postgres"],
    image: project2Img,
    link: "#",
    github: "#",
    accent: "from-violet-400 to-fuchsia-600",
    stats: [
      { label: "Agents", value: "12K" },
      { label: "Models", value: "8" },
      { label: "Runs/day", value: "1.2M" },
    ],
  },
  {
    title: "FutureCart",
    tagline: "AI-powered commerce",
    description:
      "Next-generation e-commerce platform with personalized AI recommendations, predictive inventory analytics, and a Stripe-powered checkout that converts 38% above industry baseline.",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "OpenAI"],
    image: project3Img,
    link: "#",
    github: "#",
    accent: "from-emerald-400 to-teal-600",
    stats: [
      { label: "Conv. lift", value: "+38%" },
      { label: "GMV", value: "$2.4M" },
      { label: "Stores", value: "120" },
    ],
  },
];

function TiltCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 18 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["10%", "90%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["10%", "90%"]);
  const [hovering, setHovering] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onLeave}
      onClick={onOpen}
      data-hover
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      className="group relative cursor-pointer rounded-3xl"
    >
      {/* Outer glow */}
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500 -z-10`}
      />

      {/* Card body */}
      <div
        className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Browser chrome preview */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          {/* Fake window chrome */}
          <div className="absolute top-0 inset-x-0 z-20 flex items-center gap-2 px-4 py-2.5 bg-slate-950/80 backdrop-blur border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <div className="ml-3 flex-1 h-5 rounded-md bg-white/5 border border-white/10 flex items-center px-2">
              <Globe className="w-3 h-3 text-cyan-400/70 mr-1.5" />
              <span className="text-[10px] text-white/45 font-mono truncate">
                {project.title.toLowerCase()}.app
              </span>
            </div>
          </div>

          {/* Image with hover-scroll effect */}
          <div className="absolute inset-0 pt-9">
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-auto"
              animate={hovering ? { y: ["0%", "-50%"] } : { y: "0%" }}
              transition={hovering ? { duration: 6, ease: "linear", repeat: Infinity, repeatType: "reverse" } : { duration: 0.6 }}
              style={{ minHeight: "100%" }}
            />
          </div>

          {/* Glare overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35), transparent 50%)`,
            }}
          />

          {/* Bottom gradient + accent line */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
          <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r ${project.accent}`} />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4" style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-xs font-mono tracking-widest uppercase mb-1 bg-gradient-to-r ${project.accent} bg-clip-text text-transparent`}>
                {project.tagline}
              </p>
              <h4 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h4>
            </div>
            <span className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 group-hover:bg-cyan-400 group-hover:text-slate-950 group-hover:border-cyan-400 transition-all shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-white/70 tracking-wide"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-cyan-300/80">
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-8 bg-slate-950/85 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 30, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl"
      >
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${project.accent}`} />

        <button
          data-hover
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 text-white/80 hover:bg-cyan-400 hover:text-slate-950 transition-colors flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid lg:grid-cols-[1.4fr_1fr] max-h-[90vh]">
          {/* Live preview pane */}
          <div className="relative bg-slate-950 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-950 border-b border-white/5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="ml-3 flex-1 h-7 rounded-md bg-white/5 border border-white/10 flex items-center px-3">
                <Globe className="w-3.5 h-3.5 text-cyan-400/80 mr-2" />
                <span className="text-xs text-white/60 font-mono truncate">
                  https://{project.title.toLowerCase()}.app
                </span>
              </div>
              <a
                href={project.link}
                data-hover
                className="ml-2 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400 hover:text-slate-950 transition-colors flex items-center gap-1.5"
              >
                Open <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative h-[420px] lg:h-[560px] overflow-hidden">
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full h-auto"
                animate={{ y: ["0%", "-55%", "0%"] }}
                transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
                style={{ minHeight: "100%" }}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
            </div>
          </div>

          {/* Info pane */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div>
              <p className={`text-xs font-mono tracking-[0.22em] uppercase mb-2 bg-gradient-to-r ${project.accent} bg-clip-text text-transparent`}>
                {project.tagline}
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {project.title}
              </h3>
            </div>

            <p className="text-white/70 leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {project.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center"
                >
                  <p className={`text-xl font-black bg-gradient-to-br ${project.accent} bg-clip-text text-transparent`}>
                    {s.value}
                  </p>
                  <p className="text-[10px] tracking-widest uppercase text-white/45 mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h5 className="text-xs font-bold tracking-[0.22em] text-white/60 uppercase mb-3 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" /> Tech Stack
              </h5>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                data-hover
                href={project.link}
                className="flex-1 px-5 py-3 rounded-full bg-gradient-cta text-white font-bold text-xs tracking-[0.22em] uppercase flex items-center justify-center gap-2 hover:shadow-[0_10px_40px_-10px_rgba(56,189,248,0.7)] transition-shadow"
              >
                View Live <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                data-hover
                href={project.github}
                aria-label="View on GitHub"
                className="w-12 h-12 rounded-full border border-white/10 bg-white/5 text-white hover:text-cyan-300 hover:border-cyan-400/40 transition-colors flex items-center justify-center"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24 sm:py-32 scroll-mt-24 relative">
      <div
        className="hidden lg:block absolute top-0 right-0 w-[260px] h-[260px] pointer-events-none"
        data-robot-anchor="projects"
        data-robot-side="left"
        data-robot-prompt="A few favorites — real apps shipped to real users."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
          / Selected Work
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Featured <span className="text-gradient-primary">Projects</span>
        </h2>
        <p className="text-white/55 mt-5 max-w-2xl mx-auto text-base sm:text-lg">
          Hover to peek inside. Click any card to open the full live preview.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <TiltCard project={p} onOpen={() => setActive(p)} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
