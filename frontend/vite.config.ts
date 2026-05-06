import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// ✅ Base path (can be overridden via env if needed)
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
    // ✅ Guarantee exactly one copy of these packages lands in the final bundle.
    //
    //    Previously only ["react", "react-dom", "three"] were listed here.
    //    That wasn't enough because @splinetool/runtime ships its own bundled
    //    copy of THREE internally — dedupe alone can't de-duplicate a copy
    //    that is already pre-bundled inside another package's dist file.
    //
    //    The real fix is in index.html (removing the CDN <script> tags for
    //    three.min.js, three-globe.min.js, and spline-viewer.js).  Those three
    //    global scripts were each loading separate THREE instances OUTSIDE of
    //    Vite's module graph, so dedupe had no visibility over them at all.
    //
    //    With the CDN scripts gone, Vite now owns the entire dependency tree:
    //      • Our app code  → imports "three"           ─┐
    //      • three-globe   → imports "three"            ├─ all resolve to the
    //      • @splinetool/  → dynamic-imports internally ─┘  same deduplicated copy
    //
    //    Keeping all four here is still correct belt-and-suspenders practice.
    dedupe: ["react", "react-dom", "three", "@splinetool/runtime"],
  },

  // ✅ Pre-bundle three & three-globe with esbuild so Vite can resolve their
  //    bare specifiers during dev. Without this, three-globe (a CJS/mixed
  //    package) would fail with "Failed to resolve module specifier" at runtime.
  //
  //    Also pre-bundle @splinetool/runtime so its dynamic import resolves
  //    through Vite's module graph (and therefore participates in deduplication)
  //    rather than being treated as an opaque external fetch.
  optimizeDeps: {
    include: ["three", "three-globe", "@splinetool/runtime"],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400,

    rollupOptions: {
      // ❌ REMOVED: external: ["three", "three-globe"]
      //    Marking them external told Rollup NOT to bundle them and to expect
      //    window.THREE / window.ThreeGlobe globals — but no <script> tag ever
      //    provided those globals, so every import blew up at runtime.
      //
      // ❌ REMOVED: output.globals — only meaningful when external is set.

      output: {
        // ✅ Code splitting — keeps initial load fast
        manualChunks: (id) => {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) return "vendor-react";

          if (id.includes("node_modules/framer-motion"))
            return "vendor-motion";

          if (
            id.includes("node_modules/@radix-ui") ||
            id.includes("node_modules/cmdk") ||
            id.includes("node_modules/vaul")
          ) return "vendor-ui";

          if (id.includes("node_modules/lucide-react"))
            return "vendor-icons";

          // ✅ Globe gets its own chunk — it's large (~400 kB) and only
          //    needed on the About / Contact section, not on first paint.
          if (id.includes("node_modules/three-globe"))
            return "vendor-globe";

          // ✅ Core Three.js separate from three-globe so the glob pattern
          //    above doesn't accidentally swallow it.
          if (
            id.includes("node_modules/three/") &&
            !id.includes("node_modules/three-globe")
          ) return "vendor-three";

          if (
            id.includes("node_modules/@react-three") ||
            id.includes("node_modules/postprocessing")
          ) return "vendor-r3f";

          // ✅ Spline runtime in its own chunk — large, lazy-loaded, optional.
          //    Keeping it isolated prevents it from inflating vendor-three or
          //    any other chunk it might share imports with.
          if (id.includes("node_modules/@splinetool"))
            return "vendor-spline";
        },
      },
    },
  },

  // ✅ Dev server only (no proxy in production)
  server: {
    port: 5173,
    host: "0.0.0.0",
  },

  preview: {
    port: 5173,
    host: "0.0.0.0",
  },
});