import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, Github, Globe } from "lucide-react";

// ─── Project screenshot images ────────────────────────────────────────────────
// These paths must match files that actually exist under /public.
// Drop your real screenshots in at any time — the card will render them
// automatically. Until then each project shows a branded gradient placeholder.
// ─────────────────────────────────────────────────────────────────────────────

type Project = {
  title: string;
  tagline: string;
  description: string;
  tech: { name: string; logo: string }[];
  /** Absolute path to a screenshot in /public, or null for the gradient placeholder */
  image: string | null;
  link: string;
  github: string;
  accent: string;
  /** Tailwind bg gradient used for the placeholder when image === null */
  placeholderGradient: string;
  /** Single emoji shown in the placeholder */
  placeholderIcon: string;
};

const projects: Project[] = [
  {
    title: "Connectly",
    tagline: "Real-time collaboration",
    description:
      "A real-time collaboration platform with WebRTC video calls, shared cursors, and live document editing for distributed engineering teams. Scaled to 50K monthly active users on a serverless backend.",
    tech: [
      { name: "Next.js",   logo: "/next.svg"      },
      { name: "WebRTC",    logo: "/webrtc.png"     },
      { name: "Socket.io", logo: "/socket.png"     },
      { name: "MongoDB",   logo: "/MongoDB.png"    },
      { name: "Express",   logo: "/ex.png"         },
    ],
    // Set to "/project-1.png" once you drop the file into /public
    image: null,
    link: "#",
    github: "#",
    accent: "from-cyan-400 to-blue-600",
    placeholderGradient: "from-cyan-950 via-slate-900 to-blue-950",
    placeholderIcon: "🔗",
  },
  {
    title: "AgenticAI Studio",
    tagline: "Autonomous agent orchestration",
    description:
      "Drag-and-drop visual builder for autonomous LLM agent workflows with real-time execution monitoring, branching logic, and multi-model routing across OpenAI, Anthropic, and open-source providers.",
    tech: [
      { name: "React",      logo: "/React.png"                },
      { name: "Firebase",   logo: "/Firebase.png"             },
      { name: "Framer",     logo: "/framer.svg"               },
      { name: "Supabase",   logo: "/icons8-supabase-48.png"   },
      // ✅ Fixed: was "PostgreSQL.png" — public folder contains "PostgresSQL.png"
      { name: "PostgreSQL", logo: "/PostgresSQL.png"          },
    ],
    image: null,
    link: "#",
    github: "#",
    accent: "from-violet-400 to-fuchsia-600",
    placeholderGradient: "from-violet-950 via-slate-900 to-fuchsia-950",
    placeholderIcon: "🤖",
  },
  {
    title: "FutureCart",
    tagline: "AI-powered commerce",
    description:
      "Next-generation e-commerce platform with personalized AI recommendations, predictive inventory analytics, and a Stripe-powered checkout that converts 38% above industry baseline.",
    tech: [
      { name: "Node.js",     logo: "/Node.js.png"      },
      { name: "Tailwind",    logo: "/Tailwind CSS.png"  },
      { name: "Three.js",    logo: "/Three.js.png"      },
      { name: "Git",         logo: "/git.svg"           },
      { name: "TypeScript",  logo: "/ts.svg"            },
    ],
    image: null,
    link: "#",
    github: "#",
    accent: "from-emerald-400 to-teal-600",
    placeholderGradient: "from-emerald-950 via-slate-900 to-teal-950",
    placeholderIcon: "🛒",
  },
];

// ─── TechIcon ─────────────────────────────────────────────────────────────────

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
          className={`absolute inset-0 rounded-full bg-purple-500/30 blur-md transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`w-10 h-10 rounded-full bg-slate-800/90 border transition-all duration-300 flex items-center justify-center ${
            hovered
              ? "border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.6)]"
              : "border-white/15"
          }`}
        >
          <motion.img
            src={logo}
            alt={name}
            className="w-5 h-5 object-contain"
            animate={hovered ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            // ✅ Graceful degradation: hide broken images instead of showing alt text in an ugly box
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-sm border border-white/10 text-white text-xs font-medium whitespace-nowrap z-20 shadow-lg"
          >
            {name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ProjectScreenshot ────────────────────────────────────────────────────────
// Renders the real image when available; falls back to a branded gradient
// placeholder that matches the card's accent colours.

function ProjectScreenshot({
  project,
  hovering,
}: {
  project: Project;
  hovering: boolean;
}) {
  if (project.image) {
    return (
      <motion.img
        src={project.image}
        alt={project.title}
        className="w-full h-auto"
        animate={hovering ? { y: ["0%", "-50%"] } : { y: "0%" }}
        transition={
          hovering
            ? { duration: 6, ease: "linear", repeat: Infinity, repeatType: "reverse" }
            : { duration: 0.6 }
        }
        style={{ minHeight: "100%" }}
        // ✅ Hide broken images silently
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  // ─── Gradient placeholder ────────────────────────────────────────────────
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br ${project.placeholderGradient} flex flex-col items-center justify-center gap-3 select-none`}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative glow blob */}
      <div
        className={`absolute w-48 h-48 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${project.accent}`}
      />

      {/* Icon + label */}
      <span className="relative text-6xl">{project.placeholderIcon}</span>
      <span className="relative text-xs font-mono tracking-[0.25em] uppercase text-white/20">
        screenshot coming soon
      </span>
    </div>
  );
}

// ─── TiltCard ─────────────────────────────────────────────────────────────────

function TiltCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]),  { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 18 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["10%", "90%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["10%", "90%"]);
  const [hovering, setHovering] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); setHovering(false); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      className="group relative rounded-3xl"
    >
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${project.accent} opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500 -z-10`}
      />

      <div
        className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ── Browser chrome + screenshot area ── */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          {/* Browser chrome bar */}
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

          {/* Screenshot / placeholder */}
          <div className="absolute inset-0 pt-9">
            <ProjectScreenshot project={project} hovering={hovering} />
          </div>

          {/* Glare overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35), transparent 50%)`,
            }}
          />

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
          <div className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r ${project.accent}`} />
        </div>

        {/* ── Card body ── */}
        <div className="p-6 space-y-5" style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={`text-xs font-mono tracking-widest uppercase mb-1 bg-gradient-to-r ${project.accent} bg-clip-text text-transparent`}>
                {project.tagline}
              </p>
              <h4 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {project.title}
              </h4>
            </div>
          </div>

          <p className="text-white/70 leading-relaxed text-sm">{project.description}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            {project.tech.map((t) => (
              <TechIcon key={t.name} name={t.name} logo={t.logo} />
            ))}
          </div>

          <div className="relative h-16 overflow-hidden">
            <motion.div
              className="flex items-center gap-3 absolute inset-x-0 bottom-0"
              initial={{ y: 80 }}
              animate={hovering ? { y: 0 } : { y: 80 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <a
                href={project.link}
                className="flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs tracking-[0.22em] uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02]"
              >
                View Live <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={project.github}
                aria-label="View on GitHub"
                className="w-12 h-12 rounded-full border border-white/20 bg-white/5 text-white hover:text-cyan-300 hover:border-cyan-400/60 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:shadow-md hover:shadow-cyan-500/20"
              >
                <Github className="w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Projects section ─────────────────────────────────────────────────────────

export function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32 scroll-mt-24 relative">
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-64 pointer-events-none"
        data-robot-anchor="projects"
        data-robot-side="right"
        data-robot-prompt="🚀 Built. Shipped. Loved by users."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
          / My Work
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Featured{" "}
          <span className="text-gradient-primary drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
            Projects
          </span>
        </h2>
        <p className="text-white/55 mt-5 max-w-2xl mx-auto text-base sm:text-lg">
          Building reliable, scalable, and user-focused digital products.
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
            <TiltCard project={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}