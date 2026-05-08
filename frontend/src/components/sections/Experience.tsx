import { motion } from "framer-motion";
import {
  BadgeCheck,
  ExternalLink,
  GraduationCap,
  BookOpen,
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
    "Gained hands-on experience in full-stack development, API integration, and real-world problem solving, delivering high-quality features in a collaborative environment.",
  ],
  thumbnail: "/jaru.png",
  techStack: [
    { id: 1, name: "React", img: "/React.png" },
    { id: 2, name: "Node.js", img: "/Node.js.png" },
    { id: 3, name: "MongoDB", img: "/MongoDB.png" },
    { id: 4, name: "Tailwind", img: "/Tailwind CSS.png" },
    { id: 5, name: "Firebase", img: "/Firebase.png" },
    { id: 6, name: "Java", img: "/Java.png" },
    { id: 7, name: "Spring Boot", img: "/Spring.png" },
    { id: 8, name: "Express", img: "/ex.png" },
    { id: 9, name: "JavaScript", img: "/JavaScript.png" },
    { id: 10, name: "TypeScript", img: "/ts.svg" },
    { id: 11, name: "Git", img: "/git.svg" },
    { id: 14, name: "Supabase", img: "/icons8-supabase-48.png" },
    { id: 15, name: "Docker", img: "/dock.svg" },
    { id: 16, name: "Next.js", img: "/next.svg" },
  ],
};

// ==================== EDUCATION DATA ====================
const educationData = [
  {
    id: 1,
    degree: "B.E in Information Technology",
    institution: "Anuradha Engineering College",
    period: "Nov 2022 – Jul 2025",
    score: "7.8",
    scoreLabel: "CGPA",
    description:
      "Core CS fundamentals — algorithms, OS, and software engineering — with a hands-on focus on full-stack development.",
    achievements: [
  "Built and deployed scalable full-stack web applications using MERN stack",
  "Worked on API development, authentication, and real-time data handling",
  "Collaborated in team-based development and followed agile workflow"
],
tech: [
  "Java",
  "Spring Boot",
  "React",
  "Node.js",
  "MongoDB"
],
    icon: GraduationCap,
    accentFrom: "from-cyan-400",
    accentTo: "to-blue-600",
    glowColor: "rgba(34,211,238,0.25)",
    badgeColor: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
    dotColor: "bg-cyan-400",
    type: "Degree",
  },
  {
    id: 2,
    degree: "Diploma in Computer Technology",
    institution: "Yashwantrao Chavan Institute of Polytechnic",
    period: "Jul 2020 – Jul 2022",
    score: "75%",
    scoreLabel: "Percentage",
    description:
      "Hands-on training in networking, programming fundamentals, and hardware — where the curiosity for building with tech truly began.",
    achievements: [
  "Strong Programming Fundamentals",
  "Networking & Operating Systems Knowledge",
  "Early Stage Problem Solving & Coding Practice"
],
tech: ["C", "C++", "HTML", "CSS"],
    icon: BookOpen,
    accentFrom: "from-violet-400",
    accentTo: "to-purple-600",
    glowColor: "rgba(167,139,250,0.25)",
    badgeColor: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    dotColor: "bg-violet-400",
    type: "Diploma",
  },
];

// ==================== PREMIUM EXPERIENCE CARD ====================
function PremiumExperienceCard() {
  const handleVerifyExperience = () => {
    if (experienceData.certificateUrl) {
      window.open(experienceData.certificateUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      className="group relative w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5 sm:p-6 md:p-7 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:flex-wrap justify-between items-start gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
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
              <div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  {experienceData.title}
                </h3>
              </div>
            </div>
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

          <motion.button
            onClick={handleVerifyExperience}
            whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 340, damping: 20 } }}
            whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 hover:text-white transition-all duration-300 group/btn shadow-md"
          >
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <BadgeCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">VERIFY EXPERIENCE</span>
            <span className="sm:hidden">Verify</span>
            <ExternalLink className="w-3 h-3 opacity-80 group-hover/btn:opacity-100 transition" />
          </motion.button>
        </div>

        {/* Bullet Points */}
        <div className="space-y-2 mb-6">
          {experienceData.descBullets.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-white/70 group-hover:text-white transition-all duration-300"
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

        <div className="my-6 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-3 items-center">
          {experienceData.techStack.map((tech) => (
            <div key={tech.id} className="relative group/tech cursor-pointer">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-medium px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover/tech:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-lg border border-white/10">
                {tech.name}
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800/90 border border-white/15 flex items-center justify-center transition-all duration-300 group-hover/tech:scale-110 group-hover/tech:shadow-lg group-hover/tech:shadow-purple-500/40 group-hover/tech:border-purple-400/60">
                {tech.img ? (
                  <img src={tech.img} alt={tech.name} className="w-5 h-5 object-contain" />
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

// ==================== EDUCATION CARD ====================
function EducationCard({ edu, index }: { edu: typeof educationData[0]; index: number }) {
  const Icon = edu.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -55 : 55, y: 15 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 260, damping: 20 } }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.8) 100%)",
        boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px -10px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-80"
        style={{ background: `radial-gradient(circle, ${edu.glowColor} 0%, transparent 70%)` }}
      />

      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${edu.accentFrom} ${edu.accentTo} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative p-6 sm:p-7">
        {/* Type badge + Score */}
        <div className="flex items-center justify-between mb-5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-sm ${edu.badgeColor}`}>
            <Icon className="w-3 h-3" />
            {edu.type}
          </span>

          {/* Score pill */}
          <div className="flex flex-col items-end">
            <span className={`text-2xl font-bold bg-gradient-to-r ${edu.accentFrom} ${edu.accentTo} bg-clip-text text-transparent leading-none`}>
              {edu.score}
            </span>
            <span className="text-white/35 text-[10px] font-bold mt-0.5">{edu.scoreLabel}</span>
          </div>
        </div>

        {/* Icon + Degree + Institution */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${edu.accentFrom} ${edu.accentTo} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-1">
              {edu.degree}
            </h3>
            <p className="text-white/55 text-xs font-medium">{edu.institution}</p>
          </div>
        </div>

        {/* Period */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-1.5 h-1.5 rounded-full ${edu.dotColor}`} />
          <span className="text-white/40 text-xs font-bold">{edu.period}</span>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-5 group-hover:text-white/75 transition-colors duration-300">
          {edu.description}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

        {/* Achievements */}
        <div className="flex flex-wrap gap-2 mb-4">
          {edu.achievements.map((ach, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/55 group-hover:text-white/70 group-hover:border-white/20 transition-all duration-300"
            >
              {ach}
            </span>
          ))}
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {edu.tech.map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-mono text-white/35 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06] group-hover:text-white/55 transition-colors duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==================== EDUCATION SECTION ====================
function Education() {
  return (
    <section id="education" className="py-16 sm:py-20 scroll-mt-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-cyan-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">
            / Learning & Growth
          </p>

          <h2 className="text-3xl sm:text-5xl font-semibold mb-6 leading-tight">
            <span className="text-white">Education</span>{" "}
            <span className="text-gradient-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              Journey
            </span>
          </h2>

          <p className="text-white/50 mt-5 max-w-xl mx-auto text-sm sm:text-lg">
            Building a strong foundation through academics, curiosity, and continuous learning.
          </p>
        </motion.div>

        {/* Timeline connector (desktop only) */}
        <div className="hidden md:block relative mb-0">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-violet-500/30 to-transparent pointer-events-none" />
        </div>

        {/* Education Cards — 2-column on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
             {educationData.map((edu, index) => (
             <EducationCard key={edu.id} edu={edu} index={index} />
             ))}
       </div>
        
        {/* Bottom decorative tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="flex justify-center mt-10"
        >
        </motion.div>
      </div>
    </section>
  );
}

// ==================== MAIN EXPERIENCE SECTION ====================
export function Experience() {
  return (
    <>
      <section id="experience" className="py-16 sm:py-20 scroll-mt-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 font-mono text-xs tracking-[0.3em] uppercase mb-3">
              / Career Journey
            </p>

            <h2 className="text-3xl sm:text-5xl font-semibold mb-6 leading-tight">
              <span className="text-white">My</span>{" "}
              <span className="text-gradient-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                Experience
              </span>
            </h2>
            <p className="text-white/55 mt-5 max-w-2xl mx-auto text-base sm:text-lg">
              From writing my first lines of code to delivering real-world products — each step
              shaped my skills, mindset, and problem-solving approach.
            </p>
          </motion.div>

          {/* Single Large Premium Card */}
          <PremiumExperienceCard />
        </div>
      </section>

      {/* Education Section */}
      <Education />
    </>
  );
}

// Shimmer animation
const style = document.createElement("style");
style.textContent = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-\\[shimmer_3s_ease_infinite\\] {
    animation: shimmer 3s ease infinite;
  }
`;
if (!document.head.querySelector("#shimmer-style")) {
  style.id = "shimmer-style";
  document.head.appendChild(style);
}