import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Send, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Earth3D } from "../Earth3D";

export function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 scroll-mt-24 relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
          / Get In Touch
        </p>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Let's build{" "}
          <span className="text-gradient-primary">something extraordinary</span>
        </h2>
      </motion.div>

      {/* Side-by-side, full-bleed within section, no extra gaps */}
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 items-center">
        {/* EARTH — full size of its column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-square max-w-[720px] mx-auto"
        >
          <Earth3D className="absolute inset-0" />
        </motion.div>

        {/* Contact details + form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <a
              data-hover
              href="mailto:hello@ambar.dev"
              className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-cyan-400/40 transition-colors"
            >
              <span className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                <Mail className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                  Email
                </p>
                <p className="text-sm text-white truncate">hello@ambar.dev</p>
              </div>
            </a>
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.03]">
              <span className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                <MapPin className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                  Location
                </p>
                <p className="text-sm text-white truncate">Remote · Worldwide</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-[10px] font-bold tracking-widest text-white/60 uppercase"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.06] transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-[10px] font-bold tracking-widest text-white/60 uppercase"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.06] transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="message"
                className="text-[10px] font-bold tracking-widest text-white/60 uppercase"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.06] transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              data-hover
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-cta text-white rounded-xl font-bold text-xs tracking-[0.22em] uppercase flex items-center justify-center gap-2 hover:shadow-[0_10px_40px_-10px_rgba(56,189,248,0.7)] transition-shadow disabled:opacity-50"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Send Message <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
