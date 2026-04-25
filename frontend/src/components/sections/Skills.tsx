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
}[]  = [
  {
    title: "Frontend",
    blurb: "Building responsive and user-friendly interfaces.",
    icon: Atom,
    accent: "from-cyan-400 to-blue-500",
    skills: [
      { name: "React", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "JavaScript (ES6+)", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Next.js", level: 80 },
      { name: "Responsive Design", level: 88 },
    ],
    tech: [
      { name: "React", Icon: Atom },
      { name: "Next.js", Icon: Layers },
      { name: "TypeScript", Icon: FileCode },
      { name: "JavaScript", Icon: FileCode },
      { name: "Tailwind", Icon: Sparkles },
      { name: "Vite", Icon: Wrench },
      { name: "Framer Motion", Icon: Sparkles },
    ],
  },
  {
    title: "Backend",
    blurb: "Developing scalable APIs and server-side logic.",
    icon: Server,
    accent: "from-emerald-400 to-teal-500",
    skills: [
      { name: "Node.js / Express", level: 88 },
      { name: "Java / Spring Boot", level: 82 },
      { name: "Python / Flask", level: 75 },
      { name: "REST APIs", level: 90 },
      { name: "Authentication / JWT", level: 85 },
      { name: "API Integration", level: 88 },
      { name: "Error Handling", level: 85 },
    ],
    tech: [
      { name: "Node.js", Icon: Server },
      { name: "Express", Icon: Server },
      { name: "Java", Icon: Cpu },
      { name: "Flask", Icon: Container },
      { name: "Python", Icon: FileCode },
      { name: "Spring Boot", Icon: Boxes },
      { name: "MongoDB", Icon: Database },
      { name: "Firebase", Icon: Cloud },
      { name: "Postman", Icon: Wrench },
      { name: "Git", Icon: GitBranch },
    ],
  },
  {
    title: "Database",
    blurb: "Managing structured and real-time data systems.",
    icon: Database,
    accent: "from-violet-400 to-fuchsia-500",
    skills: [
      { name: "MongoDB", level: 88 },
      { name: "PostgreSQL", level: 82 },
      { name: "Supabase", level: 85 },
      { name: "Firebase", level: 80 },
      { name: "Database Design", level: 82 },
      { name: "CRUD Operations", level: 90 },
    ],
    tech: [
      { name: "MongoDB", Icon: Database },
      { name: "Postgres", Icon: Database },
      { name: "Supabase", Icon: Boxes },
      { name: "Firebase", Icon: Cloud },
      { name: "SQL", Icon: Terminal },
    ],
  },
  {
    title: "AI Integration",
    blurb: "Adding simple AI features into applications.",
    icon: Brain,
    accent: "from-amber-400 to-orange-500",
    skills: [
      { name: "OpenAI APIs", level: 75 },
      { name: "Prompt Engineering", level: 78 },
      { name: "API Integration", level: 85 },
      { name: "Chatbot Features", level: 80 },
      { name: "Basic AI Workflows", level: 75 },
      { name: "RAG", level: 70 },
    ],
    tech: [
      { name: "OpenAI", Icon: Brain },
      { name: "APIs", Icon: Globe },
      { name: "Node.js", Icon: Server },
      { name: "JavaScript", Icon: FileCode },
      
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
  / Skills & Expertise
</p>

<h2 className="text-3xl sm:text-4xl lg:text-4xl font-black text-white tracking-tight">
  Building with{" "}
  <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
    Modern Technologies
  </span>
</h2>

<p className="text-white/55 mt-5 max-w-2xl mx-auto text-sm sm:text-lg">
  Technologies, tools, and skills I use to build scalable, high-performance applications.
</p>
      </motion.div>

      {/* Robot anchor (subtle, top-right) */}
      <div
        className="hidden lg:block absolute top-12 right-0 w-[260px] h-[260px] pointer-events-none"
        data-robot-anchor="skills"
        data-robot-side="left"
        data-robot-prompt="Frontend, Backend, Databases, and AI — this is how I build complete applications."
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
  Technologies
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
