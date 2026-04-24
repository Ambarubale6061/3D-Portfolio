import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Cloud,
  Cpu,
  Wrench,
  Sparkles,
  Atom,
  Server,
  Layers,
  FileCode,
  Terminal,
  Boxes,
  GitBranch,
  Container,
  Globe,
  Brain,
} from "lucide-react";

type Tech = { name: string; Icon: typeof Code2 };
type Skill = { name: string; level: number };

const categories: {
  title: string;
  blurb: string;
  icon: typeof Code2;
  accent: string;
  skills: Skill[];
  tech: Tech[];
}[] = [
  {
    title: "Frontend",
    blurb: "Pixel-perfect, motion-driven user interfaces.",
    icon: Atom,
    accent: "from-cyan-400 to-blue-500",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 92 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Three.js / R3F", level: 85 },
    ],
    tech: [
      { name: "React", Icon: Atom },
      { name: "Next.js", Icon: Layers },
      { name: "TypeScript", Icon: FileCode },
      { name: "Tailwind", Icon: Sparkles },
      { name: "Three.js", Icon: Cpu },
      { name: "Vite", Icon: Wrench },
    ],
  },
  {
    title: "Backend",
    blurb: "APIs, services, and infrastructure that scale.",
    icon: Server,
    accent: "from-emerald-400 to-teal-500",
    skills: [
      { name: "Node.js / Express", level: 92 },
      { name: "Java / Spring Boot", level: 88 },
      { name: "GraphQL / REST", level: 90 },
      { name: "Microservices", level: 85 },
    ],
    tech: [
      { name: "Node.js", Icon: Server },
      { name: "Spring", Icon: Boxes },
      { name: "Python", Icon: Terminal },
      { name: "GraphQL", Icon: Globe },
      { name: "Docker", Icon: Container },
      { name: "Git", Icon: GitBranch },
    ],
  },
  {
    title: "Data",
    blurb: "Relational, document, and vector databases tuned for speed.",
    icon: Database,
    accent: "from-violet-400 to-fuchsia-500",
    skills: [
      { name: "PostgreSQL", level: 90 },
      { name: "MongoDB", level: 88 },
      { name: "Redis", level: 82 },
      { name: "Supabase / Vector DBs", level: 85 },
    ],
    tech: [
      { name: "Postgres", Icon: Database },
      { name: "MongoDB", Icon: Database },
      { name: "Redis", Icon: Database },
      { name: "Supabase", Icon: Boxes },
      { name: "AWS", Icon: Cloud },
    ],
  },
  {
    title: "AI / ML",
    blurb: "LLM pipelines, agents, and retrieval systems in production.",
    icon: Brain,
    accent: "from-amber-400 to-orange-500",
    skills: [
      { name: "LLM Pipelines", level: 90 },
      { name: "OpenAI / Anthropic", level: 92 },
      { name: "Vector Search", level: 85 },
      { name: "Prompt Engineering", level: 90 },
    ],
    tech: [
      { name: "OpenAI", Icon: Brain },
      { name: "Anthropic", Icon: Sparkles },
      { name: "LangChain", Icon: Boxes },
      { name: "Pinecone", Icon: Database },
      { name: "Python", Icon: Terminal },
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-28 scroll-mt-24 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
          / Skills &amp; Tech
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Tools of the <span className="text-gradient-primary">Trade</span>
        </h2>
        <p className="text-white/55 mt-5 max-w-2xl mx-auto text-sm sm:text-lg">
          Proficiency, stack, and the technologies I reach for daily — all in
          one place.
        </p>
      </motion.div>

      {/* Robot anchor (subtle, top-right) */}
      <div
        className="hidden lg:block absolute top-12 right-0 w-[260px] h-[260px] pointer-events-none"
        data-robot-anchor="skills"
        data-robot-side="left"
        data-robot-prompt="React, Node, Spring, AI — here's the full toolbelt."
      />

      {/* Unified category grid */}
      <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/80 backdrop-blur-xl p-5 sm:p-6 overflow-hidden"
            >
              {/* Accent glow */}
              <div
                className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${cat.accent} opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-500 -z-10`}
              />
              <div
                className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${cat.accent} opacity-10 blur-2xl pointer-events-none`}
              />

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cat.accent} flex items-center justify-center text-white shadow-lg shrink-0`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.4} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-white tracking-tight">
                    {cat.title}
                  </h4>
                  <p className="text-[11px] text-white/45 leading-tight">
                    {cat.blurb}
                  </p>
                </div>
              </div>

              {/* Skills bars */}
              <div className="space-y-2.5 mb-5">
                {cat.skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-white/75">{s.name}</span>
                      <span
                        className={`font-mono font-bold bg-gradient-to-r ${cat.accent} bg-clip-text text-transparent`}
                      >
                        {s.level}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${cat.accent}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech chips */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2.5">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.tech.map((t) => {
                    const TIcon = t.Icon;
                    return (
                      <span
                        key={t.name}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-white/75 hover:bg-white/10 transition-colors"
                      >
                        <TIcon className="w-3 h-3 text-cyan-300" strokeWidth={2.4} />
                        {t.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
