// Sidebar.tsx
import { useEffect, useRef, useState } from "react";
import {
  Home,
  User,
  Code2,
  Briefcase,
  LayoutGrid,
  MessageSquare,
  Mail,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { id: "hero",         label: "Home",     Icon: Home },
  { id: "about",        label: "About",    Icon: User },
  { id: "skills",       label: "Skills",   Icon: Code2 },
  { id: "services",     label: "Services", Icon: Briefcase },
  { id: "projects",     label: "Projects", Icon: LayoutGrid },
  { id: "testimonials", label: "Reviews",  Icon: MessageSquare },
  { id: "contact",      label: "Contact",  Icon: Mail },
];

interface SidebarProps {
  isOpen:  boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [active, setActive] = useState("hero");

  /*
   * ✅ FIX: Original code called getBoundingClientRect on every scroll
   *    tick inside a forEach with no throttle. This is a forced layout
   *    read on every frame.
   *
   *    Now:
   *    • Elements are cached once in a ref (sectionEls).
   *    • The scroll handler is RAF-throttled — at most one DOM read per frame.
   *    • The Sidebar is only mounted when isOpen=true (AnimatePresence), so
   *      this listener is not active when the drawer is closed.
   */
  const sectionEls = useRef<{ id: string; el: Element }[]>([]);

  useEffect(() => {
    if (!isOpen) return; // don't listen while drawer is closed

    const buildCache = () => {
      sectionEls.current = items
        .map((it) => {
          const el = document.getElementById(it.id);
          return el ? { id: it.id, el } : null;
        })
        .filter(Boolean) as { id: string; el: Element }[];
    };

    buildCache();

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        if (sectionEls.current.length < items.length) buildCache();

        let current = "hero";
        for (const { id, el } of sectionEls.current) {
          if (el.getBoundingClientRect().top <= 200) current = id;
        }
        setActive(current);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden"
          />

          {/* Side Drawer */}
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-64 z-[60] bg-slate-950/95 border-l border-white/10 p-6 shadow-2xl md:hidden flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="self-end p-2 mb-8 text-white/50 hover:text-white"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col gap-4">
              {items.map(({ id, label, Icon }) => {
                const isActive = active === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={onClose}
                    className="group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/30"
                      />
                    )}
                    <Icon
                      className={`relative w-5 h-5 ${
                        isActive ? "text-cyan-400" : "text-white/50"
                      }`}
                    />
                    <span
                      className={`relative font-medium text-sm uppercase tracking-widest ${
                        isActive ? "text-white" : "text-white/50"
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
      )}
    </AnimatePresence>
  );
}