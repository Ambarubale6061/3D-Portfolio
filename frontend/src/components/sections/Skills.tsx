"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Atom, Server, Database, Brain, Layers, FileCode,
  Sparkles, Cpu, Code2, Globe, Zap, DatabaseIcon,
  Cloud, ShieldCheck, Workflow, 
  Layout, Boxes, Braces
} from "lucide-react";

type TechItem = {
  name: string;
  Icon: any;
  color: string;
  glow: string;
};

const row1: TechItem[] = [
  { name: "React", Icon: Atom, color: "text-cyan-400", glow: "shadow-cyan-500/20" },
  { name: "Next.js", Icon: Layers, color: "text-white", glow: "shadow-white/20" },
  { name: "TypeScript", Icon: FileCode, color: "text-blue-400", glow: "shadow-blue-500/20" },
  { name: "AI Agent", Icon: Brain, color: "text-purple-400", glow: "shadow-purple-500/20" },
  { name: "Tailwind", Icon: Sparkles, color: "text-sky-300", glow: "shadow-sky-400/20" },
  { name: "Node.js", Icon: Server, color: "text-emerald-500", glow: "shadow-emerald-500/20" },
  { name: "Supabase", Icon: Zap, color: "text-emerald-400", glow: "shadow-emerald-400/20" },
  { name: "Prisma", Icon: Braces, color: "text-indigo-300", glow: "shadow-indigo-400/20" },
];

const row2: TechItem[] = [
  { name: "Docker", Icon: Boxes, color: "text-blue-500", glow: "shadow-blue-600/20" },
  { name: "Python", Icon: Code2, color: "text-yellow-400", glow: "shadow-yellow-500/20" },
  { name: "PostgreSQL", Icon: DatabaseIcon, color: "text-indigo-400", glow: "shadow-indigo-500/20" },
  { name: "Redis", Icon: Zap, color: "text-red-500", glow: "shadow-red-500/20" },
  { name: "AWS", Icon: Cloud, color: "text-orange-400", glow: "shadow-orange-400/20" },
  { name: "Zustand", Icon: Workflow, color: "text-amber-500", glow: "shadow-amber-500/20" },
  { name: "Auth.js", Icon: ShieldCheck, color: "text-pink-500", glow: "shadow-pink-500/20" },
  { name: "Framer", Icon: Layout, color: "text-fuchsia-400", glow: "shadow-fuchsia-400/20" },
];

export function Skills() {
  const renderRow = (items: TechItem[], direction: "left" | "right", duration: number) => (
    <div className="relative flex items-center w-full py-12"> 
      <motion.div
        className="flex gap-12 px-10 items-center"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[...items, ...items, ...items].map((tech, index) => (
          <motion.div 
            key={index} 
            className="group relative flex flex-col items-center justify-center min-w-[120px]"
            animate={{
              y: [0, -10, 0, 10, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4
            }}
          >
            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full 
              bg-white/[0.03] border border-white/10 backdrop-blur-md 
              shadow-lg ${tech.glow} transition-all duration-500 
              group-hover:scale-110 group-hover:bg-white/[0.08] group-hover:border-white/20`}>
              
              <tech.Icon 
                className={`w-10 h-10 sm:w-12 sm:h-12 ${tech.color} drop-shadow-md transition-all duration-500 group-hover:rotate-[10deg]`} 
                strokeWidth={1.2} 
              />
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
            
            <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 text-center w-full z-20">
              <span className={`text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap ${tech.color}`}>
                {tech.name}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section id="skills" className="relative py-24 bg-transparent w-full overflow-hidden">
      {/* Ambient Glows - Transparent background so they blend with the layout */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -top-24 -left-20 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-32 -right-20 w-[700px] h-[700px] bg-blue-600/10 blur-[140px] rounded-full"
        />
      </div>

      {/* Header Section */}
      <motion.div

        initial={{ opacity: 0, y: 20 }}

        whileInView={{ opacity: 1, y: 0 }}

        viewport={{ once: true, margin: "-100px" }}

        transition={{ duration: 0.7 }}

        className="text-center mb-10 relative z-10"

      >

        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">

          / Skills & Expertise

        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">

          Building with{" "}

          <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">

            Modern Technologies

          </span>

        </h2>

        <p className="text-white/55 mt-5 max-w-2xl mx-auto text-sm sm:text-lg">

          Tools and technologies I use to build modern web applications.

        </p>

      </motion.div>

      {/* Circle Tech Rows with Masking */}
      <div 
        className="flex flex-col w-full relative z-10"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        {renderRow(row1, "right", 40)}
        {renderRow(row2, "left", 45)}
      </div>

      {/* Bottom subtle air streak */}
    </section>
  );
}