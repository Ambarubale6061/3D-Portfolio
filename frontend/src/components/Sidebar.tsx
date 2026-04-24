import { useEffect, useState } from "react";
import {
  Home,
  User,
  Code2,
  Briefcase,
  LayoutGrid,
  MessageSquare,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { id: "hero", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "skills", label: "Skills", Icon: Code2 },
  { id: "services", label: "Services", Icon: Briefcase },
  { id: "projects", label: "Projects", Icon: LayoutGrid },
  { id: "testimonials", label: "Reviews", Icon: MessageSquare },
  { id: "contact", label: "Contact", Icon: Mail },
];

export function Sidebar() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      let current = "hero";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) current = it.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop / Tablet — vertical left rail */}
      <motion.aside
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex fixed left-3 lg:left-4 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-1 p-2 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
      >
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              data-hover
              href={`#${id}`}
              aria-label={label}
              className="group relative w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center"
            >
              {isActive && (
                <motion.span
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_18px_rgba(56,189,248,0.5)]"
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                />
              )}
              <Icon
                className={`relative w-4 h-4 transition-colors ${
                  isActive ? "text-white" : "text-white/55 group-hover:text-cyan-300"
                }`}
                strokeWidth={2.2}
              />
              <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-widest uppercase bg-slate-900/95 border border-white/10 text-white whitespace-nowrap opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                {label}
              </span>
            </a>
          );
        })}
      </motion.aside>

      {/* Mobile — bottom dock */}
      <motion.nav
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden fixed bottom-3 left-3 right-3 z-40 px-1.5 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between">
          {items.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                data-hover
                href={`#${id}`}
                aria-label={label}
                className="group relative flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl"
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebarActiveMobile"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/25 to-blue-600/15 border border-cyan-400/30"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  />
                )}
                <Icon
                  className={`relative w-[18px] h-[18px] transition-colors ${
                    isActive ? "text-cyan-300" : "text-white/55"
                  }`}
                  strokeWidth={2.2}
                />
                <span
                  className={`relative text-[8.5px] font-bold tracking-wider uppercase transition-colors ${
                    isActive ? "text-cyan-200" : "text-white/45"
                  }`}
                >
                  {label}
                </span>
              </a>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
