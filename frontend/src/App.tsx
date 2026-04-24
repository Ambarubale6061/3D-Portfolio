import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "./components/sections/Navbar";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Services } from "./components/sections/Services";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Testimonials } from "./components/sections/Testimonials";
import { Contact } from "./components/sections/Contact";
import { MagicCursor } from "./components/MagicCursor";
import { ChatBubble } from "./components/ChatBubble";
import { FloatingRobot } from "./components/FloatingRobot";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { downloadResume } from "./lib/resume";

function App() {
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");

    // Auto-download resume when arriving via QR scan link (?dl=resume)
    const params = new URLSearchParams(window.location.search);
    if (params.get("dl") === "resume") {
      // brief delay so the page paints first
      setTimeout(() => {
        downloadResume();
        // clean up URL so refresh doesn't re-download
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
        <Sidebar />
        <main className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-4 sm:px-8 md:pl-24 md:pr-8 lg:pl-32 lg:pr-16 pb-24 md:pb-0">
          <Hero />
          <About />
          <Skills />
          <Services />
          <Projects />
          <Experience />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
      <FloatingRobot />
      <MagicCursor />
      <ChatBubble />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
