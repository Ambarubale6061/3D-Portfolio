import { motion } from "framer-motion";
import {
  BadgeCheck,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

// ==================== EXPERIENCE DATA ====================
const experienceData = {
  id: 1,
  title: "Full Stack Developer Intern",
  company: "JaruratCare Foundation",
  location: "Remote",
  dates: "Nov 2025 - Mar 2026",
  certificateUrl: "/Certi.pdf",
  descBullets: [
    "Built a full-stack Nurse Management System using MERN stack (React, Node.js, Express, MongoDB) and Firebase, enabling efficient staff management, data handling, and real-time updates.",
    "Developed and enhanced a WhatsApp bot system using Java and Spring Boot, implementing new features, optimizing workflows, and improving automated user interactions.",
    "Designed and contributed to multiple solo and team-based projects, collaborating with developers to deliver scalable and production-ready solutions.",
    "Developed and maintained the organization's main website, improving UI/UX, performance, and overall user engagement.",
    "Gained hands-on experience in full-stack development, API integration, and real-world problem solving, delivering high-quality features in a collaborative environment."
  ],
  thumbnail: "/jaru.png",
  techStack: [
    { id: 1, name: "React", img: "/re.svg" },
    { id: 2, name: "Node.js", img: "/node.png" },
    { id: 3, name: "MongoDB", img: "/mongo.png" },
    { id: 4, name: "Tailwind", img: "/tail.svg" },
    { id: 5, name: "Firebase", img: "/fir.svg" },
    { id: 6, name: "Java", img: "/java.svg" },
    { id: 7, name: "Spring Boot", img: "/boot.png" },
    { id: 8, name: "Express", img: "/ex.png" },
    { id: 9, name: "JavaScript", img: "/js.svg" },
    { id: 10, name: "TypeScript", img: "/ts.svg" },
    { id: 11, name: "Git", img: "/git.svg" },
    { id: 14, name: "Supabase", img: "/supa.svg" },
    { id: 15, name: "Docker", img: "/dock.svg" },
    { id: 16, name: "Next.js", img: "/next.svg" },
  ],
};

// ==================== EDUCATION DATA ====================
const educationData = {
  year: "2021",
  degree: "B.Tech in Computer Science",
  institution: "Started the Journey",
  location: "India",
  description:
    "Formal CS education with a focus on systems, algorithms, and distributed computing. Built first SaaS product as a freshman side project.",
  achievements: ["Top 5% of cohort", "Hackathon winner × 3"],
  tech: ["C++", "Python", "Linux", "Git"],
  icon: GraduationCap,
  accent: "from-sky-400 to-indigo-600",
  pdfUrl: "/education/degree_credential.pdf",
};

// ==================== PREMIUM EXPERIENCE CARD (COMPACT VERSION - NO BACKGROUND HOVER EFFECT) ====================
function PremiumExperienceCard() {
  const handleVerifyExperience = () => {
    if (experienceData.certificateUrl) {
      window.open(experienceData.certificateUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10"
    >
      {/* Animated border gradient on hover - this is a border/glow effect, not background color */}
      

      {/* Static blue/purple radial glows (no hover color changes) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card Content - Reduced padding for compactness */}
      <div className="relative p-5 sm:p-6 md:p-7 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-start gap-4 mb-6">
          {/* Left: Thumbnail + Title + Badge + Location/Date */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {/* Small circular logo (white bg, border) */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-white flex-shrink-0 ring-2 ring-white/20 shadow-lg">
                {experienceData.thumbnail ? (
                  <img
                    src={experienceData.thumbnail}
                    alt={experienceData.company}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl">
                    {experienceData.company.charAt(0)}
                  </div>
                )}
              </div>

              {/* Title Section */}
              <div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  {experienceData.title}
                </h3>
              </div>
            </div>

            {/* Company Badge + Location + Dates */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-sm">
                {experienceData.company}
              </span>
              <div className="flex items-center gap-2 text-white/50 text-xs">
                <span>{experienceData.location}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{experienceData.dates}</span>
              </div>
            </div>
          </div>

          {/* Right: Verify Experience Button with shimmer */}
          <motion.button
            onClick={handleVerifyExperience}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 hover:text-white transition-all duration-300 group/btn shadow-md"
          >
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <BadgeCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">VERIFY EXPERIENCE</span>
            <span className="sm:hidden">Verify</span>
            <ExternalLink className="w-3 h-3 opacity-80 group-hover/btn:opacity-100 transition" />
          </motion.button>
        </div>

        {/* Bullet Points Description - Text turns white with glow on hover */}
        <div className="space-y-2 mb-6">
          {experienceData.descBullets.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-white/70 group-hover:text-white transition-all duration-300 group/bullet"
            >
              <motion.span
                whileHover={{ rotate: 12, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-purple-400 text-base mt-0.5 group-hover:text-purple-300 group-hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.5)] transition-all duration-300"
              >
                ✦
              </motion.span>
              <span className="leading-relaxed text-sm group-hover:text-white group-hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.3)] transition-all duration-300">
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* Subtle Divider */}
        <div className="my-6 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Tech Stack - Circular Icons with Tooltip (slightly smaller) */}
        <div className="flex flex-wrap gap-3 items-center">
          {experienceData.techStack.map((tech) => (
            <div
              key={tech.id}
              className="relative group/tech cursor-pointer"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-lg border border-white/10">
                {tech.name}
              </div>
              {/* Circular Icon */}
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800/90 border border-white/15 flex items-center justify-center transition-all duration-300 group-hover/tech:scale-110 group-hover/tech:shadow-lg group-hover/tech:shadow-purple-500/40 group-hover/tech:border-purple-400/60">
                {tech.img ? (
                  <img
                    src={tech.img}
                    alt={tech.name}
                    className="w-5 h-5 object-contain"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-white/80">
                    {tech.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==================== EDUCATION SECTION WITH LEFT-RIGHT ANIMATION ====================
function Education() {
  return (
    <section
      id="education"
      className="py-16 sm:py-20 scroll-mt-24 relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.7 }}
  className="text-center mb-14"
>
  <p className="text-cyan-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">
    / Learning & Growth
  </p>

  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Education{" "}
          <span className="text-gradient-primary drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
            Journey
          </span>
        </h2>

  <p className="text-white/50 mt-5 max-w-xl mx-auto text-sm sm:text-lg">
    Building a strong foundation through academics, curiosity, and continuous learning.
  </p>
</motion.div>

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-white/10 p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">{educationData.degree}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 mb-2">
                  <span className="text-cyan-300 text-xs font-medium">{educationData.institution}</span>
                  <span className="text-white/40 text-[10px]">•</span>
                  <span className="text-white/40 text-xs">{educationData.location}</span>
                  <span className="text-white/40 text-[10px]">•</span>
                  <span className="text-white/40 text-xs">{educationData.year}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-3">{educationData.description}</p>
                <div className="flex flex-wrap gap-2">
                  {educationData.achievements.map((ach, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                      {ach}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {educationData.tech.map((skill) => (
                    <span key={skill} className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==================== MAIN EXPERIENCE SECTION ====================
export function Experience() {
  return (
    <>
      <section
        id="experience"
        className="py-16 sm:py-20 scroll-mt-24 relative"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
          / Career Journey
        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          My{" "}
          <span className="text-gradient-primary drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
            Experience
          </span>
        </h2>
        <p className="text-white/55 mt-5 max-w-2xl mx-auto text-base sm:text-lg">
  From writing my first lines of code to delivering real-world products — each step shaped my skills, mindset, and problem-solving approach.
</p>
      </motion.div>

          {/* Single Large Premium Card */}
          <PremiumExperienceCard />
        </div>
      </section>

      {/* Education Section with left-right animation */}
      <Education />
    </>
  );
}

// Add custom animation for shimmer effect
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  .animate-\\[shimmer_3s_ease_infinite\\] {
    animation: shimmer 3s ease infinite;
  }
`;
if (!document.head.querySelector('#shimmer-style')) {
  style.id = 'shimmer-style';
  document.head.appendChild(style);
}