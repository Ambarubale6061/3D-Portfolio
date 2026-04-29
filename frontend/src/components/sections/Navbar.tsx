// Navbar.tsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Hexagon,
  Sun,
  LayoutGrid,
  Download,
  ScanLine,
  Menu,
} from "lucide-react";
import { ResumeQRModal } from "../ResumeQRModal";
import { Sidebar } from "../Sidebar";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <a href="#hero" data-hover className="flex items-center gap-2 shrink-0">
            <span className="font-extrabold tracking-tight text-white text-2xl sm:text-4xl">
              Amb<span className="text-cyan-400">ar</span>
            </span>
          </a>

          {/* Center nav */}
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
                  <span className={isActive ? "text-cyan-400" : "text-white/70 group-hover:text-cyan-400"}>
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
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* ✅ FIXED: DIRECT DOWNLOAD (REDIRECT NAKO) */}
            <a
              data-hover
              href="/Certi.pdf"
              download="Ambar_Resume.pdf" // He attribute file direct download karte
              aria-label="Download resume"
              title="Download Resume"
              className="flex w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 hover:border-cyan-400 transition-colors items-center justify-center cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </a>

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

            {/* Let's Talk button */}
            <a
              data-hover
              href="#contact"
              className="inline-flex shrink-0 items-center justify-center px-3 sm:px-5 py-2 rounded-full border border-cyan-400/50 text-cyan-300 text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase hover:bg-cyan-400 hover:text-slate-950 transition-colors shadow-[0_0_18px_rgba(56,189,248,0.25)] whitespace-nowrap"
            >
              Let's Talk
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex w-9 h-9 sm:w-10 sm:h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <ResumeQRModal open={scannerOpen} onClose={() => setScannerOpen(false)} />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}