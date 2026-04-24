import { jsPDF } from "jspdf";

export const RESUME_FILE = "Ambar_Resume.pdf";

type Section = { title: string; items: string[] };

const profile = {
  name: "AMBAR",
  title: "Full-Stack Developer & AI Engineer",
  email: "hello@ambar.dev",
  location: "Remote · Worldwide",
  website: "ambar.dev",
};

const summary =
  "Senior full-stack engineer specialising in AI-augmented web platforms. " +
  "I design and ship production systems end-to-end — from infrastructure " +
  "and APIs to motion-driven user interfaces. 6+ years across startups, " +
  "agencies, and AI research labs.";

const sections: Section[] = [
  {
    title: "EXPERIENCE",
    items: [
      "2026 · Senior Full-Stack Engineer — Independent / Freelance",
      "2025 · AI Engineer — Stealth Startup (San Francisco / Remote)",
      "2024 · Full-Stack Developer — JaruratCare Foundation",
      "2023 · Java Developer Intern — Codec Technologies",
      "2022 · Frontend Engineer (Contract) — Various Agencies",
      "2021 · B.Tech Computer Science — Began the journey",
    ],
  },
  {
    title: "CORE SKILLS",
    items: [
      "Frontend  ·  React, Next.js, TypeScript, Tailwind, Three.js / R3F",
      "Backend   ·  Node.js, Express, Java, Spring Boot, GraphQL, REST",
      "Data      ·  PostgreSQL, MongoDB, Redis, Supabase, Vector DBs",
      "AI/ML     ·  OpenAI, Anthropic, LangChain, RAG, Prompt Engineering",
      "DevOps    ·  Docker, AWS, CI/CD, Kubernetes, Edge Functions",
    ],
  },
  {
    title: "SELECTED PROJECTS",
    items: [
      "Connectly  ·  Real-time WebRTC collaboration  ·  50K+ MAU",
      "AgenticAI Studio  ·  Visual agent orchestration  ·  1.2M runs/day",
      "FutureCart  ·  AI-powered commerce  ·  +38% conversion lift",
    ],
  },
  {
    title: "EDUCATION",
    items: ["B.Tech Computer Science  ·  Top 5% of cohort  ·  3× Hackathon winner"],
  },
];

export function generateResumePdf(): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = margin;

  // Header band
  doc.setFillColor(8, 47, 73);
  doc.rect(0, 0, pageW, 110, "F");
  doc.setFillColor(34, 211, 238);
  doc.rect(0, 110, pageW, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(34);
  doc.text(profile.name, margin, 60);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(186, 230, 253);
  doc.text(profile.title, margin, 80);

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`${profile.email}   ·   ${profile.location}   ·   ${profile.website}`, margin, 98);

  y = 150;

  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(8, 47, 73);
  doc.text("SUMMARY", margin, y);
  doc.setDrawColor(34, 211, 238);
  doc.setLineWidth(1.2);
  doc.line(margin, y + 4, margin + 50, y + 4);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 50, 65);
  const summaryLines = doc.splitTextToSize(summary, pageW - margin * 2);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 14 + 14;

  // Sections
  for (const sec of sections) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(8, 47, 73);
    doc.text(sec.title, margin, y);
    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(1.2);
    doc.line(margin, y + 4, margin + 50, y + 4);
    y += 22;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 50, 65);
    for (const item of sec.items) {
      doc.text(`•  ${item}`, margin, y);
      y += 16;
    }
    y += 8;
  }

  // Footer
  doc.setDrawColor(34, 211, 238);
  doc.setLineWidth(0.5);
  doc.line(margin, 800, pageW - margin, 800);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 130, 145);
  doc.text("Generated from ambar.dev — get in touch at hello@ambar.dev", margin, 815);

  return doc;
}

export function downloadResume() {
  const doc = generateResumePdf();
  doc.save(RESUME_FILE);
}

export function getResumeDataUrl(): string {
  const doc = generateResumePdf();
  return doc.output("dataurlstring");
}

export function getResumeBlobUrl(): string {
  const doc = generateResumePdf();
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}
