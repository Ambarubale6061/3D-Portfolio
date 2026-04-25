import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Hexagon,
  Sun,
  LayoutGrid,
  Download,
  ScanLine,
  Menu,
  X,
} from "lucide-react";
import { downloadResume } from "@/lib/resume";
import { ResumeQRModal } from "../ResumeQRModal";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#hero");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      let current = "#hero";
      for (const item of navItems) {
        const el = document.querySelector(item.href);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = item.href;
        }
      }
      setActive(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close mobile menu when a link is clicked
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-slate-950/75 backdrop-blur-xl border-b border-white/5"
            : "py-4 sm:py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <a href="#hero" data-hover className="flex items-center gap-2 shrink-0">
            <span className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_18px_rgba(56,189,248,0.5)]">
              <Hexagon className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.4} />
            </span>
            <span className="font-extrabold tracking-tight text-white text-base sm:text-xl">
              Amb<span className="text-cyan-400">ar</span>
            </span>
          </a>

          {/* Center nav (desktop) */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.name}
                  data-hover
                  href={item.href}
                  className="relative px-2.5 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors group"
                >
                  <span className={isActive ? "text-cyan-400" : "text-white/70 group-hover:text-white"}>
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute left-2 right-2 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Resume download */}
            <button
              data-hover
              onClick={() => downloadResume()}
              aria-label="Download resume"
              title="Download Resume"
              className="flex w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 hover:border-cyan-400 transition-colors items-center justify-center"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Scanner */}
            <button
              data-hover
              onClick={() => setScannerOpen(true)}
              aria-label="Open resume scanner"
              title="Scan to download"
              className="flex w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors items-center justify-center"
            >
              <ScanLine className="w-4 h-4" />
            </button>

            {/* Let's Talk (desktop) */}
            <a
              data-hover
              href="#contact"
              className="hidden md:inline-flex ml-1 px-4 lg:px-5 py-2.5 rounded-full border border-cyan-400/50 text-cyan-300 text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-cyan-400 hover:text-slate-950 transition-colors shadow-[0_0_18px_rgba(56,189,248,0.25)]"
            >
              Let's Talk
            </a>

            {/* Mobile menu toggle */}
            <button
              data-hover
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="xl:hidden fixed inset-0 z-[55] bg-slate-950/85 backdrop-blur-xl pt-20"
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 sm:mx-8 max-w-md mx-auto p-2 rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl"
            >
              {navItems.map((item, i) => {
                const isActive = active === item.href;
                return (
                  <motion.a
                    key={item.name}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    data-hover
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-5 py-3.5 rounded-2xl text-sm font-bold tracking-[0.18em] uppercase transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-400/15 to-blue-500/10 text-cyan-300 border border-cyan-400/20"
                        : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </motion.a>
                );
              })}
              <div className="pt-2 mt-2 border-t border-white/5 grid grid-cols-2 gap-2">
                <button
                  data-hover
                  onClick={() => {
                    downloadResume();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-bold tracking-[0.2em] uppercase"
                >
                  <Download className="w-3.5 h-3.5" /> Resume
                </button>
                <button
                  data-hover
                  onClick={() => {
                    setScannerOpen(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-bold tracking-[0.2em] uppercase"
                >
                  <ScanLine className="w-3.5 h-3.5" /> Scan
                </button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <ResumeQRModal open={scannerOpen} onClose={() => setScannerOpen(false)} />
    </>
  );
}
