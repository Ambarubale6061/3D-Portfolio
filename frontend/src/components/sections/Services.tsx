import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Layout,
  BrainCircuit,
  Smartphone,
  Search,
  ArrowRight,
  Zap,
  Database,
  Globe,
} from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Full Stack Development",
    blurb: "Building scalable web applications from frontend to backend.",
    deliverables: ["MERN Stack Apps", "REST APIs", "Deployment"],
    accent: "from-cyan-400 to-blue-600",
  },
  {
    icon: BrainCircuit,
    title: "AI Integration",
    blurb: "Integrating AI features to enhance modern applications.",
    deliverables: ["OpenAI APIs", "Chatbot Features", "Automation"],
    accent: "from-violet-400 to-fuchsia-600",
  },
  {
    icon: Layout,
    title: "Frontend Development",
    blurb: "Creating responsive and visually engaging user interfaces.",
    deliverables: ["React Apps", "Responsive UI", "Animations"],
    accent: "from-pink-400 to-rose-600",
  },
  {
    icon: Server,
    title: "Backend Development",
    blurb: "Developing secure and scalable backend systems.",
    deliverables: ["Node.js APIs", "Authentication", "Database Integration"],
    accent: "from-emerald-400 to-teal-600",
  },
  {
    icon: Search,
    title: "Optimization",
    blurb: "Improving performance, speed, and code quality.",
    deliverables: ["Performance Boost", "Code Refactoring", "Best Practices"],
    accent: "from-sky-400 to-indigo-600",
  },
  {
    icon: Database,
    title: "Database Design",
    blurb: "Designing efficient and scalable data systems.",
    deliverables: ["Schema Design", "CRUD Systems", "Optimization"],
    accent: "from-violet-400 to-fuchsia-600",
  },
];

const process = [
  { step: "01", title: "Discover", desc: "Audit goals, users, and constraints." },
  { step: "02", title: "Design", desc: "Architecture + interactive prototypes." },
  { step: "03", title: "Build", desc: "Ship in tight loops with weekly demos." },
  { step: "04", title: "Launch", desc: "Deploy, monitor, iterate, and grow." },
];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 scroll-mt-24 relative">
      {/* Robot anchor (subtle, side) */}
      <div
        className="hidden lg:block absolute top-12 right-0 w-[280px] h-[280px] pointer-events-none"
        data-robot-anchor="services"
        data-robot-side="left"
        data-robot-prompt="Need a web app? I build full stack applications with modern technologies."
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
  / Services
</p>

<h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
  What I <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">Build</span>
</h2>

<p className="text-white/55 mt-5 max-w-2xl mx-auto text-sm sm:text-lg">
  Solutions focused on performance, scalability, and real-world impact.
</p>
      </motion.div>

      {/* Service cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              data-hover
              className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-950/80 backdrop-blur-xl p-6 sm:p-7 overflow-hidden cursor-default"
              whileHover={{ y: -4 }}
            >
              {/* Accent glow on hover */}
              <div
                className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10`}
              />
              {/* Corner accent */}
              <div
                className={`absolute -top-20 -right-20 w-44 h-44 rounded-full bg-gradient-to-br ${s.accent} opacity-15 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-30`}
              />

              {/* Floating index */}
             

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${s.accent} flex items-center justify-center text-white shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] mb-5`}
              >
                <Icon className="w-6 h-6" strokeWidth={2.2} />
                <span
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${s.accent} opacity-50 blur-md -z-10`}
                />
              </motion.div>

              <h4 className="text-xl font-bold text-white tracking-tight mb-2">
                {s.title}
              </h4>
              <p className="text-sm text-white/60 leading-relaxed mb-5">
                {s.blurb}
              </p>

              {/* Deliverables */}
              <ul className="space-y-1.5 mb-5">
                {s.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 text-xs text-white/70"
                  >
                    <span
                      className={`w-1 h-1 rounded-full bg-gradient-to-r ${s.accent}`}
                    />
                    {d}
                  </li>
                ))}
              </ul>

              {/* Footer link */}
              
            </motion.div>
          );
        })}
      </div>

      {/* Process strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mt-16 sm:mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-950/80 p-6 sm:p-8 lg:p-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-gradient-to-br from-cyan-400/15 to-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-3 mb-6">
          <span className="w-8 h-8 rounded-lg bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </span>
          <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            How we'll work together
          </h4>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {process.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="relative rounded-2xl bg-white/[0.03] border border-white/10 p-5 group hover:border-cyan-400/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600">
                  {p.step}
                </span>
                {i < process.length - 1 && (
                  <ArrowRight className="hidden lg:block w-4 h-4 text-white/20 group-hover:text-cyan-300 transition-colors" />
                )}
              </div>
              <h5 className="text-sm font-bold text-white tracking-wide uppercase mb-1">
                {p.title}
              </h5>
              <p className="text-xs text-white/55 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
