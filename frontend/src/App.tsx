"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Always eager — visible on first paint
import { Navbar } from "./components/sections/Navbar";
import { Hero   } from "./components/sections/Hero";
import { MagicCursor } from "./components/MagicCursor";

// Lazy-loaded section chunks — Vite only downloads these when they render
const About        = lazy(() => import("./components/sections/About").then(m => ({ default: m.About })));
const Skills       = lazy(() => import("./components/sections/Skills").then(m => ({ default: m.Skills })));
const Services     = lazy(() => import("./components/sections/Services").then(m => ({ default: m.Services })));
const Projects     = lazy(() => import("./components/sections/Projects").then(m => ({ default: m.Projects })));
const Experience   = lazy(() => import("./components/sections/Experience").then(m => ({ default: m.Experience })));
const Testimonials = lazy(() => import("./components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact      = lazy(() => import("./components/sections/Contact").then(m => ({ default: m.Contact })));
const Footer       = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const ChatBubble   = lazy(() => import("./components/ChatBubble").then(m => ({ default: m.ChatBubble })));

// ─── Viewport-gated mounting ──────────────────────────────────────────────────
//
// React.lazy() defers the DOWNLOAD of a chunk until the component renders.
// But without this gate, every section renders on first paint — so React
// immediately triggers all the lazy imports in parallel.
//
// ViewportSection solves this by not rendering its children until the
// placeholder div is within `rootMargin` of the viewport. The section chunk
// is not downloaded until the user is approaching that section.
//
// Once a section enters view it stays mounted (observer disconnects), so
// there is no re-mounting jank on scroll-back.
//
function ViewportSection({
  children,
  className,
  rootMargin = "400px 0px",
}: {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref         = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already in view on mount (e.g. user refreshed mid-page)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {show ? children : <div style={{ minHeight: "12rem" }} aria-hidden />}
    </div>
  );
}

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
      // Dynamic import — jspdf/html2canvas never affect first paint
      const timer = setTimeout(async () => {
        const { downloadResume } = await import("./lib/resume");
        downloadResume();
        const cleaned = window.location.pathname + window.location.hash;
        window.history.replaceState(null, "", cleaned);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative flex flex-col text-foreground selection:bg-primary/30 selection:text-primary-foreground">
        <div className="mesh-bg" />

        <Navbar />

        <main className="flex-1 flex flex-col w-full pb-24 md:pb-0">

          {/* ── 1. Hero — always eager, first paint ─────────────────────── */}
          <Hero />

          {/* ── 2. About ─────────────────────────────────────────────────── */}
          <ViewportSection className="w-full">
            <Suspense fallback={<SectionFallback />}>
              <About />
            </Suspense>
          </ViewportSection>

          {/* ── 3. Skills ────────────────────────────────────────────────── */}
          <ViewportSection className="w-full">
            <Suspense fallback={<SectionFallback />}>
              <Skills />
            </Suspense>
          </ViewportSection>

          {/* ── 4. Services ──────────────────────────────────────────────── */}
          <ViewportSection className="w-full max-w-350 mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16">
            <Suspense fallback={<SectionFallback />}>
              <Services />
            </Suspense>
          </ViewportSection>

          {/* ── 5. Projects ──────────────────────────────────────────────── */}
          <ViewportSection className="w-full">
            <Suspense fallback={<SectionFallback />}>
              <Projects />
            </Suspense>
          </ViewportSection>

          {/* ── 6. Experience ────────────────────────────────────────────── */}
          <ViewportSection className="w-full max-w-350 mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16">
            <Suspense fallback={<SectionFallback />}>
              <Experience />
            </Suspense>
          </ViewportSection>

          {/* ── 7. Testimonials ──────────────────────────────────────────── */}
          <ViewportSection className="w-full">
            <Suspense fallback={<SectionFallback />}>
              <Testimonials />
            </Suspense>
          </ViewportSection>

          {/* ── 8. Contact ───────────────────────────────────────────────── */}
          {/*
           * rootMargin="600px 0px" gives extra runway for Contact because it
           * also triggers the Earth3D dynamic three.js import (~944 kB total).
           */}
          <ViewportSection
            className="w-full max-w-350 mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16"
            rootMargin="600px 0px"
          >
            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>
          </ViewportSection>

        </main>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <ViewportSection rootMargin="200px 0px">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </ViewportSection>

      </div>

      <MagicCursor />

      {/*
       * ChatBubble is visible on all pages but starts invisible (button
       * animates in after 1.2 s). Wrapping in Suspense is enough.
       */}
      <Suspense fallback={null}>
        <ChatBubble />
      </Suspense>

      <Toaster />
    </TooltipProvider>
  );
}

export default App;