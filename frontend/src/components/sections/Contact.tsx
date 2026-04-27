import { motion } from "framer-motion";
import { useState } from "react";
import { Send } from "lucide-react";
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
      className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden bg-transparent"
    >
      {/* Soft Glow for Depth (Low Opacity) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          
          {/* LEFT: Massive Earth Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative w-full aspect-square max-w-[800px] mx-auto">
              {/* Note: Radial gradient removed to keep it fully transparent, 
                  only keep it if you want the Earth edges to fade */}
              <div className="absolute inset-0 bg-radial-gradient-to-b from-transparent to-transparent pointer-events-none z-10" />
              <Earth3D className="w-full h-full" />
            </div>
          </motion.div>

          {/* RIGHT: High-End Compact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col order-1 lg:order-2"
          >
            <div className="mb-10">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-cyan-400 font-mono text-xs tracking-[0.4em] uppercase"
              >
                // Contact
              </motion.span>
              <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter mt-4 leading-none">
                Let's talk <br />
                <span className="text-gradient-primary">Digital.</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-[400px]">
              <div className="grid grid-cols-1 gap-4">
                <div className="group">
                  <input
                    type="text"
                    required
                    placeholder="NAME"
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono tracking-widest placeholder:text-white/20"
                  />
                </div>
                <div className="group">
                  <input
                    type="email"
                    required
                    placeholder="EMAIL"
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono tracking-widest placeholder:text-white/20"
                  />
                </div>
                <div className="group">
                  <textarea
                    required
                    rows={3}
                    placeholder="MESSAGE"
                    className="w-full bg-transparent border-b border-white/20 py-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all font-mono tracking-widest placeholder:text-white/20 resize-none"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex items-center justify-between w-full p-4 border border-white/10 hover:border-cyan-400/50 transition-all bg-transparent overflow-hidden"
                >
                  <span className="relative z-10 text-xs font-bold tracking-[0.3em] uppercase text-white group-hover:text-cyan-400 transition-colors">
                    {isSubmitting ? "TRANSMITTING..." : "SEND MESSAGE"}
                  </span>
                  <Send className="w-4 h-4 text-white group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  
                  {/* Subtle hover fill effect */}
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </form>

            {/* Floating Info */}
            <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Email</p>
                <p className="text-xs text-white/70">hello@ambar.dev</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Base</p>
                <p className="text-xs text-white/70">Remote / Global</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}