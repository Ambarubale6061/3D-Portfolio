import { Hexagon, Github, Linkedin, Twitter, Mail, ArrowUpRight, Heart } from "lucide-react";

const footerLinks = {
  Navigate: [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Services", href: "#services" },
  ],
  Work: [
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ],
  Connect: [
    { name: "GitHub", href: "#", external: true },
    { name: "LinkedIn", href: "#", external: true },
    { name: "Twitter", href: "#", external: true },
    { name: "hello@ambar.dev", href: "mailto:hello@ambar.dev" },
  ],
};

const socials = [
  { Icon: Github, href: "#", label: "GitHub" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Mail, href: "mailto:hello@ambar.dev", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5">
      {/* Top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-radial from-cyan-500/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Top CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-12 border-b border-white/10">
          <div className="max-w-2xl">
            <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
              / Let's collaborate
            </p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Got an idea? <span className="text-gradient-primary">Let's bring it to life.</span>
            </h3>
          </div>
          <a
            data-hover
            href="#contact"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-cta text-white font-bold text-xs tracking-[0.22em] uppercase shadow-[0_10px_40px_-10px_rgba(56,189,248,0.6)] hover:shadow-[0_14px_50px_-8px_rgba(56,189,248,0.85)] transition-shadow shrink-0"
          >
            Start a Project
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <a href="#hero" data-hover className="flex items-center gap-2">
              <span className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_18px_rgba(56,189,248,0.5)]">
                <Hexagon className="w-5 h-5 text-white" strokeWidth={2.4} />
              </span>
              <span className="font-extrabold tracking-tight text-white text-xl">
                PORTFOL<span className="text-cyan-400">IO.</span>
              </span>
            </a>
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Crafting premium digital products with clean code, modern design,
              and a touch of AI magic.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  data-hover
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] text-white/70 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-colors flex items-center justify-center"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-bold tracking-[0.22em] text-white uppercase mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.name}>
                    <a
                      data-hover
                      href={l.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-cyan-300 transition-colors"
                    >
                      {l.name}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-xs text-white/45 tracking-wide">
            © {new Date().getFullYear()} Ambar Ubale. All rights reserved.
          </p>
          <p className="text-xs text-white/45 tracking-wide flex items-center gap-1.5">
            Crafted with <Heart className="w-3 h-3 text-cyan-400 fill-cyan-400" /> & clean code in TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
}
