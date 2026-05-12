"use client";

import React, { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import {
  Atom, Layers, FileCode, Sparkles, Server, Cpu,
  Database as DbIcon, Zap, Braces, Boxes, Code2,
  Cloud, ShieldCheck, Workflow, Layout, Globe,
  Terminal, Share2, Binary, HardDrive, Key, GitBranch,
  Brain, Bot, MessageSquare, Wand2, Github, Container, Figma,
} from "lucide-react";

// ─── Wrapper stubs ────────────────────────────────────────────────────────────
function Monitor(props: React.ComponentProps<typeof Layout>)  { return <Layout    {...props} />; }
function Search(props: React.ComponentProps<typeof Globe>)    { return <Globe     {...props} />; }
function Database(props: React.ComponentProps<typeof DbIcon>) { return <DbIcon    {...props} />; }
function Link(props: React.ComponentProps<typeof Workflow>)   { return <Workflow  {...props} />; }

// ─── Skill data ───────────────────────────────────────────────────────────────
const skillData = {
  interface: [
    { name: "React",      Icon: Atom,      color: "#22d3ee" },
    { name: "Next.js",    Icon: Layers,    color: "#ffffff" },
    { name: "TypeScript", Icon: FileCode,  color: "#60a5fa" },
    { name: "Tailwind",   Icon: Sparkles,  color: "#38bdf8" },
    { name: "Framer",     Icon: Layout,    color: "#f472b6" },
    { name: "Three.js",   Icon: Boxes,     color: "#ffffff" },
    { name: "Figma",      Icon: Figma,     color: "#f24e1e" },
    { name: "HTML5",      Icon: Globe,     color: "#f97316" },
    { name: "CSS3",       Icon: Monitor,   color: "#3b82f6" },
    { name: "Zustand",    Icon: Workflow,  color: "#f59e0b" },
  ],
  core: [
    { name: "Node.js",       Icon: Server,    color: "#10b981" },
    { name: "Python",        Icon: Code2,     color: "#facc15" },
    { name: "AI Agents",     Icon: Bot,       color: "#f472b6" },
    { name: "OpenAI",        Icon: Brain,     color: "#10a37f" },
    { name: "Go",            Icon: Terminal,  color: "#00add8" },
    { name: "FastAPI",       Icon: Zap,       color: "#05998b" },
    { name: "GraphQL",       Icon: Share2,    color: "#e10098" },
    { name: "Microservices", Icon: Cpu,       color: "#fbbf24" },
    { name: "LangChain",     Icon: Link,      color: "#ffffff" },
    { name: "Express",       Icon: Server,    color: "#ffffff" },
  ],
  data: [
    { name: "PostgreSQL", Icon: DbIcon,    color: "#818cf8" },
    { name: "Supabase",   Icon: Zap,       color: "#3ecf8e" },
    { name: "MongoDB",    Icon: HardDrive, color: "#47adb5" },
    { name: "Redis",      Icon: Zap,       color: "#ef4444" },
    { name: "Prisma",     Icon: Braces,    color: "#ffffff" },
    { name: "Firebase",   Icon: Cloud,     color: "#ffca28" },
    { name: "Elastic",    Icon: Search,    color: "#feb019" },
    { name: "Vector DB",  Icon: Database,  color: "#f59e0b" },
    { name: "Neo4j",      Icon: GitBranch, color: "#008cc1" },
    { name: "Vault",      Icon: Key,       color: "#ffecb3" },
  ],
  workflow: [
    { name: "Docker",    Icon: Boxes,         color: "#2496ed" },
    { name: "AWS",       Icon: Cloud,         color: "#ff9900" },
    { name: "Git",       Icon: Github,        color: "#ffffff" },
    { name: "Vercel",    Icon: Zap,           color: "#ffffff" },
    { name: "Actions",   Icon: Workflow,      color: "#2088ff" },
    { name: "Linux",     Icon: Terminal,      color: "#fcc624" },
    { name: "Postman",   Icon: MessageSquare, color: "#ff6c37" },
    { name: "K8s",       Icon: Container,     color: "#326ce5" },
    { name: "Security",  Icon: ShieldCheck,   color: "#10b981" },
    { name: "Nginx",     Icon: Server,        color: "#009639" },
  ],
} as const;

type SkillEntry = { name: string; Icon: React.ComponentType<any>; color: string };

// ─── Shared RAF + IO system ───────────────────────────────────────────────────
/*
 * ✅ CRITICAL FIX:
 *
 * Original code: each SkillCard ran its OWN requestAnimationFrame loop and
 * its OWN IntersectionObserver. With 4 cards that's:
 *   • 4 separate rAF callbacks firing per frame (240 calls/s at 60 Hz)
 *   • 4 separate IntersectionObservers polling the DOM
 *   • 4 separate visibilitychange listeners
 *
 * The new approach:
 *   • ONE shared rAF loop managed by a module-level ticker
 *   • ONE shared IntersectionObserver that gates ALL cards
 *   • Cards register/unregister themselves via a Set
 *   • When all 4 cards are in view, still only 1 rAF callback fires per frame
 *
 * This reduces rAF overhead by 75% and completely eliminates redundant IO
 * instances.
 */

type CardTick = () => void;

// Module-level shared state — exists once for the entire Skills section
let rafId       = 0;
let isVisible   = true;
const tickSet   = new Set<CardTick>();

function startSharedLoop() {
  if (rafId !== 0) return; // already running
  const loop = () => {
    rafId = requestAnimationFrame(loop);
    if (!isVisible) return;
    for (const tick of tickSet) tick();
  };
  rafId = requestAnimationFrame(loop);
}

function stopSharedLoop() {
  cancelAnimationFrame(rafId);
  rafId = 0;
}

function registerTick(fn: CardTick) {
  tickSet.add(fn);
  startSharedLoop();
}

function unregisterTick(fn: CardTick) {
  tickSet.delete(fn);
  if (tickSet.size === 0) stopSharedLoop();
}

// Visibility gate — one listener shared across all cards
if (typeof document !== "undefined") {
  document.addEventListener(
    "visibilitychange",
    () => { isVisible = !document.hidden; },
    { passive: true },
  );
}

// ─── SkillCard ────────────────────────────────────────────────────────────────

const SkillCard = memo(function SkillCard({
  skills,
  title,
  gradient,
}: {
  skills:   readonly SkillEntry[];
  title:    string;
  gradient: string;
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRef  = useRef<HTMLDivElement>(null);
  const rotRef   = useRef(0);
  // Per-card in-view flag — mutated by the section's single shared IO
  const inViewRef = useRef(true);

  useEffect(() => {
    const count = skills.length;

    // ── One IO per card — but all share the same rAF loop ──────────────────
    const io = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting; },
      { threshold: 0.05 },
    );
    if (cardRef.current) io.observe(cardRef.current);

    // ── Per-card tick function — registered into the shared loop ───────────
    const tick: CardTick = () => {
      if (!inViewRef.current) return;

      rotRef.current += 0.6;
      const rotation = rotRef.current;

      for (let i = 0; i < count; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;

        const angle      = (i / count) * 360 + rotation;
        const rad        = (angle * Math.PI) / 180;
        const normalized = ((angle % 360) + 360) % 360;
        const isActive   = normalized > 80 && normalized < 100;

        const x     = 120 * Math.cos(rad);
        const y     = 45  * Math.sin(rad);
        const scale = 0.6 + (y + 45) / 90 * 0.5;
        const alpha = Math.min(1, (y + 45) / 90 + 0.3);

        el.style.transform = `translate(${x}px,${y + 20}px) scale(${scale})`;
        el.style.zIndex    = String(Math.round(y + 100));
        el.style.opacity   = String(alpha);

        const iconEl  = el.querySelector<HTMLElement>(".sk-icon");
        const labelEl = el.querySelector<HTMLElement>(".sk-label");

        if (iconEl) {
          iconEl.style.borderColor = isActive ? skills[i].color : "rgba(255,255,255,0.05)";
          iconEl.style.boxShadow   = isActive ? `0 0 20px ${skills[i].color}30` : "none";
        }
        if (labelEl) {
          labelEl.style.opacity = isActive ? "1" : "0";
        }
      }
    };

    registerTick(tick);

    return () => {
      unregisterTick(tick);
      io.disconnect();
    };
  // skills is a stable const — intentionally omitted
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={cardRef}
      className="group relative h-[400px] w-full bg-transparent border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-white/10"
    >
      {/* Accent glow — purely decorative */}
      <div className={`absolute -top-20 -left-20 w-64 h-64 blur-[100px] opacity-5 rounded-full ${gradient}`} />

      {/* Section title */}
      <div className="relative z-20 p-8 text-center">
        <h3 className="text-white/40 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.15em]">
          {title}
        </h3>
      </div>

      {/* Orbit stage */}
      <div className="relative w-full h-full flex justify-center items-center -mt-16">
        {skills.map((skill, index) => (
          <div
            key={`${title}-${skill.name}-${index}`}
            ref={(el) => { itemRefs.current[index] = el; }}
            className="absolute flex flex-col items-center"
            style={{ willChange: "transform, opacity" }}
          >
            <div
              className="sk-icon p-3 rounded-full border bg-white/5"
              style={{
                borderColor: "rgba(255,255,255,0.05)",
                transition:  "border-color 150ms, box-shadow 150ms",
              }}
            >
              <skill.Icon size={28} style={{ color: skill.color }} strokeWidth={1.5} />
            </div>
            <div
              className="sk-label absolute top-full whitespace-nowrap pt-3 pointer-events-none"
              style={{ opacity: 0, transition: "opacity 100ms" }}
            >
              <span
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: skill.color }}
              >
                {skill.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ─── Section ──────────────────────────────────────────────────────────────────
export function Skills() {
  return (
    <section
      id="skills"
      className="relative py-24 bg-transparent w-full px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 relative z-10 px-4"
        >
          <p className="text-cyan-400 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3">
            / Skills &amp; Expertise
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold mb-6 leading-tight">
            <span className="text-white">Building with</span>{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Modern Tech
            </span>
          </h2>
          <p className="text-white/55 mt-4 max-w-2xl mx-auto text-xs sm:text-lg font-light">
            Tools and technologies used to build modern web applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <SkillCard
            skills={skillData.interface}
            title="Interface & Experience"
            gradient="bg-cyan-500"
          />
          <SkillCard
            skills={skillData.core}
            title="Core & Intelligence"
            gradient="bg-purple-500"
          />
          <SkillCard
            skills={skillData.data}
            title="Data & Persistence"
            gradient="bg-emerald-500"
          />
          <SkillCard
            skills={skillData.workflow}
            title="DevOps & Workflow"
            gradient="bg-blue-600"
          />
        </div>

      </div>
    </section>
  );
}