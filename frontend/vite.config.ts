import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom", "three", "@splinetool/runtime"],
  },

  optimizeDeps: {
    include: ["three", "three-globe", "@splinetool/runtime"],
    // Exclude heavy R3F ecosystem from pre-bundling — they're only lazy-loaded
    exclude: ["@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400,

    // Modern browsers all support <link rel="modulepreload"> natively
    modulePreload: { polyfill: false },

    // Server handles real compression — skip build-time calculation
    reportCompressedSize: false,

    // Inline assets under 4 kB (icons, tiny SVGs) — saves round-trips
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ── React core ──────────────────────────────────────────────────
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/scheduler/")
          ) return "vendor-react";

          // ── Framer Motion ───────────────────────────────────────────────
          if (
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/motion-dom") ||
            id.includes("node_modules/motion-utils")
          ) return "vendor-motion";

          // ── Radix UI + related headless primitives ──────────────────────
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/vaul")
          ) return "vendor-ui";

          // ── Icon library — tree-shakeable but still large ───────────────
          if (id.includes("node_modules/lucide-react"))
            return "vendor-icons";

          // ── Three-Globe (lazy — only loads with Earth3D) ────────────────
          if (id.includes("node_modules/three-globe"))
            return "vendor-globe";

          // ── Three.js core (separate from three-globe) ───────────────────
          if (
            id.includes("node_modules/three/") &&
            !id.includes("node_modules/three-globe")
          ) return "vendor-three";

          // ── React Three Fiber ecosystem ─────────────────────────────────
          if (
            id.includes("node_modules/@react-three/fiber") ||
            id.includes("node_modules/@react-three/drei") ||
            id.includes("node_modules/@react-three/postprocessing") ||
            id.includes("node_modules/postprocessing")
          ) return "vendor-r3f";

          // ── Spline runtime — large, lazy-loaded in SplineRobot ──────────
          if (id.includes("node_modules/@splinetool"))
            return "vendor-spline";

          // ── PDF generation — dynamic import only (never on first paint) ─
          if (
            id.includes("node_modules/jspdf") ||
            id.includes("node_modules/html2canvas") ||
            id.includes("node_modules/canvg") ||
            id.includes("node_modules/dompurify")
          ) return "vendor-pdf";

          // ── QR code — small, but only used in ResumeQRModal ─────────────
          if (id.includes("node_modules/qrcode.react"))
            return "vendor-qr";

          // ── Type animation — used only in Hero ──────────────────────────
          if (id.includes("node_modules/react-type-animation"))
            return "vendor-typeanim";

          // ── D3 + globe data utilities (pulled in by three-globe) ─────────
          if (
            id.includes("node_modules/d3-") ||
            id.includes("node_modules/d3/") ||
            id.includes("node_modules/delaunator") ||
            id.includes("node_modules/robust-predicates")
          ) return "vendor-globe";

          // ── H3 (geo indexing used by three-globe) ───────────────────────
          if (id.includes("node_modules/h3-js"))
            return "vendor-globe";
        },
      },
    },
  },

  server: {
    port: 5173,
    host: "0.0.0.0",
  },

  preview: {
    port: 5173,
    host: "0.0.0.0",
  },
});