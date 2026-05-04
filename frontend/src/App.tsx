import { lazy, Suspense, useEffect } from "react";
import { Toaster }         from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// ── Always eager: visible on first paint ──────────────────────────────────────
import { Navbar }      from "./components/sections/Navbar";
import { Hero }        from "./components/sections/Hero";
import { MagicCursor } from "./components/MagicCursor";

// ── Lazy: below the fold — loaded only when needed ───────────────────────────
const About        = lazy(() => import("./components/sections/About").then(m => ({ default: m.About })));
const Skills       = lazy(() => import("./components/sections/Skills").then(m => ({ default: m.Skills })));
const Services     = lazy(() => import("./components/sections/Services").then(m => ({ default: m.Services })));
const Projects     = lazy(() => import("./components/sections/Projects").then(m => ({ default: m.Projects })));
const Experience   = lazy(() => import("./components/sections/Experience").then(m => ({ default: m.Experience })));
const Testimonials = lazy(() => import("./components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact      = lazy(() => import("./components/sections/Contact").then(m => ({ default: m.Contact })));
const Footer       = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const ChatBubble   = lazy(() => import("./components/ChatBubble").then(m => ({ default: m.ChatBubble })));

import { downloadResume } from "./lib/resume";

/** Minimal placeholder shown while lazy chunks load */
function SectionFallback() {
  return (
    <div
      aria-hidden
      style={{ minHeight: "12rem", background: "transparent" }}
    />
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");

    const params = new URLSearchParams(window.location.search);
    if (params.get("dl") === "resume") {
      setTimeout(() => {
        downloadResume();
        const cleaned = window.location.pathname + window.location.hash;
        window.history.replaceState(null, "", cleaned);
      }, 350);
    }
  }, []);

  return (
    <TooltipProvider>
      {/*
        Root wrapper — NO left padding here; sections apply their own.
        Hero is full-bleed so it must not be constrained.
      */}
      <div className="min-h-screen w-full relative flex flex-col text-foreground selection:bg-primary/30 selection:text-primary-foreground">
        <div className="mesh-bg" />

        {/* ── Always rendered — above the fold ─────────────────────────── */}
        <Navbar />

        <main className="flex-1 flex flex-col w-full pb-24 md:pb-0">
          {/* Hero: full-bleed, no side constraints */}
          <Hero />

          {/* Below-fold sections: constrained to content width */}
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16">
            <Suspense fallback={<SectionFallback />}>
              <About />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Skills />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Services />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Projects />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Experience />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Testimonials />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>
          </div>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      {/* Custom cursor — tiny, eager */}
      <MagicCursor />

      {/* Chat bubble — hidden until clicked */}
      <Suspense fallback={null}>
        <ChatBubble />
      </Suspense>

      <Toaster />
    </TooltipProvider>
  );
}

export default App;