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
    // Prevent duplicate packages in bundle
    dedupe: ["react", "react-dom", "three"],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    chunkSizeWarningLimit: 1400,

    rollupOptions: {
      // External CDN libs (not bundled)
      external: ["three", "three-globe"],

      output: {
        globals: {
          three: "THREE",
          "three-globe": "ThreeGlobe",
        },

        // ✅ Code splitting optimization
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

          if (
            id.includes("node_modules/@react-three") ||
            id.includes("node_modules/postprocessing")
          ) return "vendor-r3f";
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