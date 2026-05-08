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
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400,

    /*
     * ✅ Skip generating the modulepreload polyfill (~1.5 kB).
     * Modern browsers (Chrome 66+, Firefox 115+, Safari 17+) all support
     * <link rel="modulepreload"> natively.  Removing the polyfill shaves a
     * small but free byte from the initial JS payload.
     */
    modulePreload: { polyfill: false },

    /*
     * ✅ Disable the compressed-size calculation during the build step.
     * Vite normally gzips every chunk just to print the "gzip: X kB" column
     * in the build output — that work is done at build time and thrown away.
     * Your actual server (nginx / Caddy / Vercel) handles real-time
     * compression at request time.  Turning this off noticeably speeds up
     * production builds with no effect on the deployed bundle.
     */
    reportCompressedSize: false,

    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ── React core ────────────────────────────────────────────────────
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) return "vendor-react";

          // ── Framer Motion ─────────────────────────────────────────────────
          if (id.includes("node_modules/framer-motion"))
            return "vendor-motion";

          // ── Radix UI + related headless primitives ────────────────────────
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/vaul")
          ) return "vendor-ui";

          // ── Icon library ──────────────────────────────────────────────────
          if (id.includes("node_modules/lucide-react"))
            return "vendor-icons";

          // ── Three-Globe (large, lazy — only loads with Earth3D) ───────────
          if (id.includes("node_modules/three-globe"))
            return "vendor-globe";

          // ── Three.js core (separate from three-globe) ─────────────────────
          if (
            id.includes("node_modules/three/") &&
            !id.includes("node_modules/three-globe")
          ) return "vendor-three";

          // ── React Three Fiber / postprocessing (if used) ──────────────────
          if (
            id.includes("node_modules/@react-three") ||
            id.includes("node_modules/postprocessing")
          ) return "vendor-r3f";

          // ── Spline runtime — large, lazy-loaded in SplineRobot ───────────
          if (id.includes("node_modules/@splinetool"))
            return "vendor-spline";

          /*
           * ✅ NEW: jspdf + html2canvas isolated into their own chunk.
           *
           * Previously these ended up in the main index bundle because
           * resume.ts was statically imported in App.tsx.  App.tsx now
           * dynamically imports resume.ts only when the ?dl=resume query
           * param is present, so these deps no longer affect first-paint at
           * all.  Keeping the manualChunk here is belt-and-suspenders: it
           * ensures that even if something else were to import jspdf in the
           * future, it will never silently inflate the initial bundle.
           */
          if (
            id.includes("node_modules/jspdf") ||
            id.includes("node_modules/html2canvas")
          ) return "vendor-pdf";
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