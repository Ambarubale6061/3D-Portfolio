import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const port     = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    /*
     * Ensure only one copy of React / Three ends up in the bundle even if
     * sub-packages bring their own peer-dep references.
     */
    dedupe: ["react", "react-dom", "three"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,

    /*
     * three.js + three-globe are loaded from unpkg in index.html at runtime,
     * so we DON'T bundle them → keeps the app chunk small.
     * Comment these out only if you switch to a fully self-hosted approach.
     */
    // rollupOptions.external is set below

    chunkSizeWarningLimit: 1400,

    rollupOptions: {
      /*
       * These are provided via <script> tags in index.html (CDN).
       * Rollup won't bundle them; it will emit `window.THREE` etc. references.
       */
      external: ["three", "three-globe"],

      output: {
        globals: {
          three: "THREE",
          "three-globe": "ThreeGlobe",
        },

        /**
         * Manual chunk strategy
         * ─────────────────────
         * Split so the browser can cache stable vendor code separately and
         * so the initial JS payload stays small.
         */
        manualChunks: (id) => {
          // React core
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "vendor-react";
          }

          // Framer Motion — used in every section
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }

          // Radix UI + shadcn primitives
          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/vaul")
          ) {
            return "vendor-ui";
          }

          // Lucide icons
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }

          // React Three Fiber ecosystem (only if not externalised)
          if (
            id.includes("node_modules/@react-three") ||
            id.includes("node_modules/postprocessing")
          ) {
            return "vendor-r3f";
          }
        },
      },
    },
  },

  server: {
    port,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  preview: {
    port,
    host: "0.0.0.0",
  },
});