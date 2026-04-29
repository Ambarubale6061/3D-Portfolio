import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  // ✅ base path (default "/" for Vercel)
  base: "/",

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    host: "0.0.0.0",
    // ❌ proxy REMOVE kela (production madhe nahi lagat)
  },

  preview: {
    port: 5173,
    host: "0.0.0.0",
  },
});
