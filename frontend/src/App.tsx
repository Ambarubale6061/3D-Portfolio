"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Always eager — visible on first paint
import { Navbar } from "./components/sections/Navbar";
import { Hero   } from "./components/sections/Hero";
import { MagicCursor } from "./components/MagicCursor";

// Lazy-loaded section chunks — Vite only downloads these when they render
const About       = lazy(() => import("./components/sections/About").then(m => ({ default: m.About })));
const Skills      = lazy(() => import("./components/sections/Skills").then(m => ({ default: m.Skills })));
const Services    = lazy(() => import("./components/sections/Services").then(m => ({ default: m.Services })));
const Projects    = lazy(() => import("./components/sections/Projects").then(m => ({ default: m.Projects })));
const Experience  = lazy(() => import("./components/sections/Experience").then(m => ({ default: m.Experience })));
const Testimonials = lazy(() => import("./components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact     = lazy(() => import("./components/sections/Contact").then(m => ({ default: m.Contact })));
const Footer      = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const ChatBubble  = lazy(() => import("./components/ChatBubble").then(m => ({ default: m.ChatBubble })));

// ─── Viewport-gated mounting ──────────────────────────────────────────────────
//
// React.lazy() defers the DOWNLOAD of a chunk until the component renders.
// But without this gate, every section renders on first paint — so React
// immediately triggers all the lazy imports in parallel, fetching every chunk
// right away.
//
// ViewportSection solves this by not rendering its children until the placeholder
// div is within `rootMargin` of the viewport. The section chunk — and anything
// it imports (e.g. three.js for the Contact/Earth3D section) — is not downloaded
// until the user is actually approaching that part of the page.
//
// Once a section enters view it stays mounted (observer disconnects), so there
// is no re-mounting jank on scroll-back.
//
// rootMargin="400px 0px" preloads 400 px before the section edge reaches the
// screen, giving enough runway to finish downloading before it's visible.
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
  const ref      = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect(); // stay mounted after first trigger
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

// ─── Shared Suspense placeholder ─────────────────────────────────────────────
function SectionFallback() {
  return (
    <div
      aria-hidden
      style={{ minHeight: "12rem", background: "transparent" }}
    />
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");

    const params = new URLSearchParams(window.location.search);
    if (params.get("dl") === "resume") {
      setTimeout(async () => {
        /*
         * ✅ KEY CHANGE: downloadResume (and its heavy deps: jspdf + html2canvas
         * totalling ~350 kB) was previously a static import at the top of this
         * file.  That pulled those libraries into the initial bundle unconditionally.
         *
         * Now it's a dynamic import that only runs when the "?dl=resume" query
         * param is present — i.e. essentially never for normal page visitors.
         * jspdf / html2canvas no longer affect first-paint at all.
         */
        const { downloadResume } = await import("./lib/resume");
        downloadResume();
        const cleaned = window.location.pathname + window.location.hash;
        window.history.replaceState(null, "", cleaned);
      }, 350);
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full relative flex flex-col text-foreground selection:bg-primary/30 selection:text-primary-foreground">
        <div className="mesh-bg" />

        <Navbar />

        <main className="flex-1 flex flex-col w-full pb-24 md:pb-0">

          {/* ── 1. Hero — always eager, first paint ─────────────────────────── */}
          <Hero />

          {/* ── 2. About ─────────────────────────────────────────────────────── */}
          <ViewportSection className="w-full">
            <Suspense fallback={<SectionFallback />}>
              <About />
            </Suspense>
          </ViewportSection>

          {/* ── 3. Skills ────────────────────────────────────────────────────── */}
          <ViewportSection className="w-full">
            <Suspense fallback={<SectionFallback />}>
              <Skills />
            </Suspense>
          </ViewportSection>

          {/* ── 4. Services ──────────────────────────────────────────────────── */}
          <ViewportSection className="w-full max-w-350 mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16">
            <Suspense fallback={<SectionFallback />}>
              <Services />
            </Suspense>
          </ViewportSection>

          {/* ── 5. Projects ──────────────────────────────────────────────────── */}
          <ViewportSection className="w-full">
            <Suspense fallback={<SectionFallback />}>
              <Projects />
            </Suspense>
          </ViewportSection>

          {/* ── 6. Experience ────────────────────────────────────────────────── */}
          <ViewportSection className="w-full max-w-350 mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16">
            <Suspense fallback={<SectionFallback />}>
              <Experience />
            </Suspense>
          </ViewportSection>

          {/* ── 7. Testimonials ──────────────────────────────────────────────── */}
          <ViewportSection className="w-full">
            <Suspense fallback={<SectionFallback />}>
              <Testimonials />
            </Suspense>
          </ViewportSection>

          {/* ── 8. Contact ───────────────────────────────────────────────────── */}
          {/*
           * rootMargin="600px 0px" gives extra runway for Contact because it
           * also triggers the Earth3D dynamic three.js import (~944 kB total).
           * Starting the download 600 px before the section reaches the screen
           * means it will usually be ready before the user scrolls into view.
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

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <ViewportSection rootMargin="200px 0px">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </ViewportSection>

      </div>

      <MagicCursor />

      {/*
       * ChatBubble is visible on all pages but starts invisible (button
       * animates in after 1.2 s).  Wrapping in Suspense is enough — the chunk
       * is small and doesn't pull in heavy deps, so no IO gate needed.
       */}
      <Suspense fallback={null}>
        <ChatBubble />
      </Suspense>

      <Toaster />
    </TooltipProvider>
  );
}

export default App;