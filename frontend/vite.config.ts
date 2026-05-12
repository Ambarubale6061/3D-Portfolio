/**
 * vite.config.ts
 *
 * CHANGES vs previous version:
 *
 *  ✅ build.target: "esnext"
 *     Tells Rollup/esbuild to emit native ES2022+ syntax. Modern browsers
 *     (all 2022+ Chrome/Firefox/Safari) parse and JIT-compile native class
 *     fields, async/await, and optional chaining faster than their transpiled
 *     equivalents. Also shrinks output — no Babel helper polyfill wrappers.
 *
 *  ✅ build.minify: "esbuild" (explicit)
 *     Vite 5 defaults to esbuild for JS minification, but being explicit
 *     ensures the behavior never silently changes across upgrades. esbuild is
 *     ~10–20× faster than Terser and produces comparable output sizes.
 *
 *  ✅ build.cssMinify: true (explicit)
 *     Same rationale — ensure CSS is minified in all environments.
 *
 *  ✅ esbuild.legalComments: "none"
 *     Strips the `@license` block comments that esbuild normally preserves in
 *     the output. Your server sends these over the wire but the browser doesn't
 *     need them. Saves 1–3 kB per chunk (noticeable on the three.js chunks).
 *
 *  ✅ esbuild.target: "esnext"
 *     Keeps the esbuild transform target aligned with the Rollup target above.
 *     Without this, esbuild can downcompile class fields even when Rollup
 *     doesn't, causing a mismatch.
 *
 *  ✅ Removed @react-three ecosystem from optimizeDeps.exclude
 *     Those packages aren't installed, so excluding them from pre-bundling is
 *     a no-op at best and a warning at worst in newer Vite versions.
 *
 *  ✅ manualChunks: "vendor-globe" split refined
 *     kapsule / three-geojson-geometry / delaunator etc. (globe helper libs
 *     pulled in by three-globe) are now explicitly named in the glob, making
 *     the chunk boundary clearer and preventing future three-globe dep bumps
 *     from accidentally spilling into vendor-three.
 *
 * Everything else (chunk naming, assetsInlineLimit, modulePreload, etc.)
 * is unchanged from the already-correct previous version.
 */

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

  // ── esbuild transform options ────────────────────────────────────────────────
  // Applied during both dev (individual file transforms) and build (minification).
  esbuild: {
    // ✅ FIX: align with build.target so class fields are never downcompiled.
    target: "esnext",
    // ✅ FIX: strip license block comments — saves 1-3 kB per chunk at zero cost.
    legalComments: "none",
  },

  optimizeDeps: {
    include: ["three", "three-globe", "@splinetool/runtime"],
    // Removed @react-three/fiber etc. — not installed, so listing them here
    // only produces Vite warnings in newer versions.
  },

  build: {
    outDir:    "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400,

    // ✅ FIX: emit native ES2022+ syntax — smaller output, faster parse.
    target: "esnext",

    // ✅ FIX: explicit — matches Vite 5 default, ensures no silent regression.
    minify:    "esbuild",
    cssMinify: true,

    // Modern browsers all support <link rel="modulepreload"> natively.
    modulePreload: { polyfill: false },

    // Server handles real compression — skip build-time size calculation.
    reportCompressedSize: false,

    // Inline assets under 4 kB (icons, tiny SVGs) to save round-trips.
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

          // ── Icon library ─────────────────────────────────────────────────
          if (id.includes("node_modules/lucide-react"))
            return "vendor-icons";

          // ── Globe ecosystem: three-globe + all its dependencies ──────────
          // Listed explicitly so future three-globe dep bumps don't silently
          // spill packages into vendor-three.
          if (
            id.includes("node_modules/three-globe")         ||
            id.includes("node_modules/d3-")                 ||
            id.includes("node_modules/d3/")                 ||
            id.includes("node_modules/delaunator")          ||
            id.includes("node_modules/robust-predicates")   ||
            id.includes("node_modules/h3-js")               ||
            id.includes("node_modules/kapsule")             ||
            id.includes("node_modules/three-geojson-geometry") ||
            id.includes("node_modules/three-conic-polygon-geometry") ||
            id.includes("node_modules/three-slippy-map-globe") ||
            id.includes("node_modules/@tweenjs")            ||
            id.includes("node_modules/tinycolor2")          ||
            id.includes("node_modules/index-array-by")      ||
            id.includes("node_modules/data-bind-mapper")    ||
            id.includes("node_modules/frame-ticker")        ||
            id.includes("node_modules/accessor-fn")         ||
            id.includes("node_modules/it-is-finite")
          ) return "vendor-globe";

          // ── Three.js core (separate from three-globe) ───────────────────
          if (id.includes("node_modules/three/"))
            return "vendor-three";

          // ── Spline runtime ───────────────────────────────────────────────
          if (id.includes("node_modules/@splinetool"))
            return "vendor-spline";

          // ── PDF generation — dynamic import only ─────────────────────────
          if (
            id.includes("node_modules/jspdf")        ||
            id.includes("node_modules/html2canvas")  ||
            id.includes("node_modules/canvg")        ||
            id.includes("node_modules/dompurify")
          ) return "vendor-pdf";

          // ── QR code — only used in ResumeQRModal ────────────────────────
          if (id.includes("node_modules/qrcode.react"))
            return "vendor-qr";

          // ── Type animation — used only in Hero ──────────────────────────
          if (id.includes("node_modules/react-type-animation"))
            return "vendor-typeanim";
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