"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Atom, Layers, FileCode, Sparkles, Server, Cpu, 
  Database as DbIcon, Zap, Braces, Boxes, Code2, 
  Cloud, ShieldCheck, Workflow, Layout, Globe,
  Terminal, Share2, Binary, HardDrive, Key, GitBranch,
  Brain, Bot, MessageSquare, Wand2, Github, Container, Figma
} from "lucide-react";

const skillData = {
  interface: [
    { name: "React", Icon: Atom, color: "#22d3ee" },
    { name: "Next.js", Icon: Layers, color: "#ffffff" },
    { name: "TypeScript", Icon: FileCode, color: "#60a5fa" },
    { name: "Tailwind", Icon: Sparkles, color: "#38bdf8" },
    { name: "Framer", Icon: Layout, color: "#f472b6" },
    { name: "Three.js", Icon: Boxes, color: "#ffffff" },
    { name: "Figma", Icon: Figma, color: "#f24e1e" },
    { name: "HTML5", Icon: Globe, color: "#f97316" },
    { name: "CSS3", Icon: Monitor, color: "#3b82f6" },
    { name: "Zustand", Icon: Workflow, color: "#f59e0b" },
  ],
  core: [
    { name: "Node.js", Icon: Server, color: "#10b981" },
    { name: "Python", Icon: Code2, color: "#facc15" },
    { name: "AI Agents", Icon: Bot, color: "#f472b6" },
    { name: "OpenAI", Icon: Brain, color: "#10a37f" },
    { name: "Go", Icon: Terminal, color: "#00add8" },
    { name: "FastAPI", Icon: Zap, color: "#05998b" },
    { name: "GraphQL", Icon: Share2, color: "#e10098" },
    { name: "Microservices", Icon: Cpu, color: "#fbbf24" },
    { name: "LangChain", Icon: Link, color: "#ffffff" },
    { name: "Express", Icon: Server, color: "#ffffff" },
  ],
  data: [
    { name: "PostgreSQL", Icon: DbIcon, color: "#818cf8" },
    { name: "Supabase", Icon: Zap, color: "#3ecf8e" },
    { name: "MongoDB", Icon: HardDrive, color: "#47adb5" },
    { name: "Redis", Icon: Zap, color: "#ef4444" },
    { name: "Prisma", Icon: Braces, color: "#ffffff" },
    { name: "Firebase", Icon: Cloud, color: "#ffca28" },
    { name: "Elastic", Icon: Search, color: "#feb019" },
    { name: "Vector DB", Icon: Database, color: "#f59e0b" },
    { name: "Neo4j", Icon: GitBranch, color: "#008cc1" },
    { name: "Vault", Icon: Key, color: "#ffecb3" },
  ],
  workflow: [
    { name: "Docker", Icon: Boxes, color: "#2496ed" },
    { name: "AWS", Icon: Cloud, color: "#ff9900" },
    { name: "Git", Icon: Github, color: "#ffffff" },
    { name: "Vercel", Icon: Zap, color: "#ffffff" },
    { name: "Actions", Icon: Workflow, color: "#2088ff" },
    { name: "Linux", Icon: Terminal, color: "#fcc624" },
    { name: "Postman", Icon: MessageSquare, color: "#ff6c37" },
    { name: "K8s", Icon: Container, color: "#326ce5" },
    { name: "Security", Icon: ShieldCheck, color: "#10b981" },
    { name: "Nginx", Icon: Server, color: "#009639" },
  ]
};

function Monitor(props: any) { return <Layout {...props} />; }
function Search(props: any) { return <Globe {...props} />; }
function Database(props: any) { return <DbIcon {...props} />; }
function Link(props: any) { return <Workflow {...props} />; }

const SkillCard = ({ skills, title, gradient }: { skills: any[], title: string, gradient: string }) => {
  const [rotation, setRotation] = useState(0);
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setRotation((prev) => prev + 0.6); 
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div className="group relative h-[400px] w-full bg-transparent border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-white/10">
      <div className={`absolute -top-20 -left-20 w-64 h-64 blur-[100px] opacity-5 rounded-full ${gradient}`} />
      
      <div className="relative z-20 p-8 text-center">
       <h3 className="text-white/40 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.15em]">
  {title}
</h3>
      </div>

      <div className="relative w-full h-full flex justify-center items-center -mt-16">
        {skills.map((skill, index) => {
          const angle = (index / skills.length) * 360 + rotation;
          const rad = (angle * Math.PI) / 180;
          const normalizedAngle = ((angle % 360) + 360) % 360;
          
          // Old Logic: Only show name when icon is in the front (active zone)
          const isActive = normalizedAngle > 80 && normalizedAngle < 100;
          
          const x = 120 * Math.cos(rad);
          const y = 45 * Math.sin(rad); 
          const zIndex = Math.round(y + 100);
          const scale = 0.6 + (y + 45) / 90 * 0.5;

          return (
            <motion.div 
              key={`${title}-${skill.name}`} 
              className="absolute flex flex-col items-center" 
              style={{ x, y: y + 20, zIndex }} 
              animate={{ scale, opacity: (y + 45) / 90 + 0.3 }}
            >
              <div 
                className="p-3 rounded-full border bg-white/5 transition-all duration-300"
                style={{ 
                  borderColor: isActive ? skill.color : "rgba(255,255,255,0.05)",
                  boxShadow: isActive ? `0 0 20px ${skill.color}30` : "none"
                }}
              >
                <skill.Icon 
                  size={28} 
                  style={{ color: skill.color }} 
                  strokeWidth={1.5} 
                />
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 12 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute top-full whitespace-nowrap"
                  >
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: skill.color }}>
                      {skill.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export function Skills() {
  return (
    <section id="skills" className="relative py-24 bg-transparent w-full px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 relative z-10 px-4"
        >
          <p className="text-cyan-400 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-3">
            / Skills & Expertise
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Building with{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
              Modern Tech
            </span>
          </h2>
          <p className="text-white/55 mt-4 max-w-2xl mx-auto text-xs sm:text-lg font-light">
            Tools and technologies used to build modern web applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <SkillCard skills={skillData.interface} title="Interface & Experience" gradient="bg-cyan-500" />
          <SkillCard skills={skillData.core} title="Core & Intelligence" gradient="bg-purple-500" />
          <SkillCard skills={skillData.data} title="Data & Persistence" gradient="bg-emerald-500" />
          <SkillCard skills={skillData.workflow} title="DevOps & Workflow" gradient="bg-blue-600" />
        </div>
      </div>
    </section>
  );
}