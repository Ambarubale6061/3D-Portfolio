import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  ArrowUp, 
  Mail, 
  Home, 
  User, 
  Code2, 
  Briefcase, 
  LayoutGrid, 
  MessageSquare, 
  LucideIcon 
} from "lucide-react";

// Types for TypeScript safety
interface SocialLink {
  href: string;
  color: string;
  Icon?: LucideIcon;
  isImage?: boolean;
  src?: string;
}

const socialLinks: SocialLink[] = [
  { Icon: Github, href: "https://github.com/Ambarubale6061", color: "hover:text-white" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/ambar-ubale-137214230", color: "hover:text-[#0077b5]" },
  { Icon: Twitter, href: "https://x.com/UbaleAmbar", color: "hover:text-[#1DA1F2]" },
  { Icon: Instagram, href: "https://www.instagram.com/ambar_ubale/", color: "hover:text-[#E1306C]" },
  { 
    isImage: true, 
    src: "/what.png", 
    href: "https://wa.me/919579377966?text=Hi%20Ambar%20Ubale,%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect!", 
    color:"hover:border-[#25D366] hover:bg-[#25D366]/20" 
  },
  { Icon: Mail, href: "mailto:ambarubale@gmail.com", color: "hover:text-cyan-400" },
];

const navItems = [
  { id: "hero", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "skills", label: "Skills", Icon: Code2 },
  { id: "services", label: "Services", Icon: Briefcase },
  { id: "projects", label: "Projects", Icon: LayoutGrid },
  { id: "testimonials", label: "Reviews", Icon: MessageSquare },
  { id: "contact", label: "Contact", Icon: Mail },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#1f2123]/80 backdrop-blur-md pt-16 pb-8 px-4 relative overflow-hidden font-sans border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Logo Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ambar<span className="text-cyan-400"> Ubale</span>
          </h2>
        </div>
        
        {/* Description Section */}
        <p className="text-gray-400 text-sm mb-8 whitespace-nowrap">
          Full Stack Developer crafting scalable software and AI-driven solutions for real-world problems.
        </p>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-4 mb-10">
          {navItems.map((item) => {
            const Icon = item.Icon;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-2 text-white/60 transition-all duration-300 text-sm font-medium hover:text-cyan-400"
              >
                <Icon className="w-4 h-4 text-cyan-400/70 group-hover:text-cyan-400 transition-colors" />
                <span className="group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Social Icons */}
        <div className="flex flex-wrap justify-center items-center gap-5 mb-12 max-w-[280px] sm:max-w-none">
          {socialLinks.map((link, index) => {
            const IconComponent = link.Icon;
            return (
              <a
                key={index}
                href={link.href}
                target={link.href.startsWith('mailto') || link.href.includes('wa.me') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-500 hover:scale-110 hover:border-cyan-400/50 hover:bg-cyan-400/10 ${link.color}`}
              >
                <div className="absolute inset-0 rounded-full blur-md bg-cyan-400/0 group-hover:bg-cyan-400/20 transition-all duration-500" />
                
                {link.isImage ? (
                  <img 
                    src={link.src} 
                    alt="Social" 
                    className="w-5 h-5 relative z-10 group-hover:rotate-360 transition-transform duration-500 object-contain" 
                  />
                ) : (
                  IconComponent && (
                    <IconComponent className="w-5 h-5 relative z-10 group-hover:rotate-360 transition-transform duration-500" />
                  )
                )}
              </a>
            );
          })}
        </div>

        {/* Bottom Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Copyright Section */}
        <p className="text-gray-500 text-[10px] sm:text-xs tracking-widest uppercase">
          © 2026 Ambar Ubale <span className="mx-2 text-white/10">|</span> All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}