import { Github, Linkedin, Twitter, Mail, Instagram, Heart, Send, Sparkles } from "lucide-react";

const socialLinks = [
  { Icon: Github, href: "https://github.com/Ambarubale6061" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/ambar-ubale-137214230" },
  { Icon: Twitter, href: "https://x.com/UbaleAmbar" },
  { Icon: Instagram, href: "https://www.instagram.com/ambar_ubale/" },
  { Icon: Mail, href: "mailto:ambarubale@gmail.com" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#030712] py-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left: Signature, Title & CTA */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <div className="space-y-1">
              <h2 className="text-3xl font-medium tracking-tight text-white/95 font-serif italic">
                Ambar <span className="text-cyan-400">Ubale</span>
              </h2>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                Full Stack Developer <span className="text-cyan-500/50">•</span> 
                <span className="flex items-center gap-1 text-cyan-400">
                  AI Developer <Sparkles className="w-3 h-3" />
                </span>
              </p>
            </div>
            
            <a 
              href="mailto:ambarubale@gmail.com"
              className="group flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-cyan-400 hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all duration-300 shadow-2xl shadow-cyan-500/5"
            >
              Let's Get In Touch
              <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Center: High-End Circular Socials */}
          <div className="flex items-center gap-5">
            {socialLinks.map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                target={href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/50 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-500 hover:scale-110 active:scale-95"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Right: Copyright & Status */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest">Available for Work</span>
            </div>
            
            <p className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em]">
              © 2026 <span className="mx-1 text-white/10">/</span> Crafted with <Heart className="inline w-3 h-3 text-cyan-500 fill-cyan-500 mx-0.5" />
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}