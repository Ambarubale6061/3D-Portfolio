"use client";

import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Always eager
import { Navbar } from "./components/sections/Navbar";
import { Hero } from "./components/sections/Hero";
import { MagicCursor } from "./components/MagicCursor";

// Lazy loading sections
const About = lazy(() => import("./components/sections/About").then(m => ({ default: m.About })));
const Skills = lazy(() => import("./components/sections/Skills").then(m => ({ default: m.Skills })));
const Services = lazy(() => import("./components/sections/Services").then(m => ({ default: m.Services })));
const Projects = lazy(() => import("./components/sections/Projects").then(m => ({ default: m.Projects })));
const Experience = lazy(() => import("./components/sections/Experience").then(m => ({ default: m.Experience })));
const Testimonials = lazy(() => import("./components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import("./components/sections/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const ChatBubble = lazy(() => import("./components/ChatBubble").then(m => ({ default: m.ChatBubble })));

import { downloadResume } from "./lib/resume";

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
      <div className="min-h-screen w-full relative flex flex-col text-foreground selection:bg-primary/30 selection:text-primary-foreground">
        <div className="mesh-bg" />

        <Navbar />

        <main className="flex-1 flex flex-col w-full pb-24 md:pb-0">

          {/* 1. Hero */}
          <Hero />

          {/* 2. About */}
          <Suspense fallback={<SectionFallback />}>
            <div className="w-full">
              <About />
            </div>
          </Suspense>

          {/* 3. Skills */}
          <Suspense fallback={<SectionFallback />}>
            <div className="w-full">
              <Skills />
            </div>
          </Suspense>

          {/* 4. Services */}
          <div className="w-full max-w-350 mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16">
            <Suspense fallback={<SectionFallback />}>
              <Services />
            </Suspense>
          </div>

          {/* 5. Projects */}
          <Suspense fallback={<SectionFallback />}>
            <div className="w-full">
              <Projects />
            </div>
          </Suspense>

          {/* 6. Experience */}
          <Suspense fallback={<SectionFallback />}>
            <div className="w-full max-w-350 mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16">
              <Experience />
            </div>
          </Suspense>

          {/* 7. Testimonials (moved here exactly after Experience) */}
          <Suspense fallback={<SectionFallback />}>
            <div className="w-full">
              <Testimonials />
            </div>
          </Suspense>

          {/* 8. Contact */}
          <div className="w-full max-w-350 mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16">
            <Suspense fallback={<SectionFallback />}>
              <Contact />
            </Suspense>
          </div>

        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      <MagicCursor />

      <Suspense fallback={null}>
        <ChatBubble />
      </Suspense>

      <Toaster />
    </TooltipProvider>
  );
}

export default App;