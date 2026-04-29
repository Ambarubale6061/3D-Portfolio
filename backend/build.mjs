import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,

  // ✅ Node environment sathi proper config
  platform: "node",
  target: "node18",
  format: "esm",

  outfile: "dist/index.mjs",
  sourcemap: true,

  // ✅ IMPORTANT: Node built-ins + problematic libs external thev
  external: [
    "pino",
    "pino-pretty",
    "pino-http",
    "dotenv",
    "fs",
    "path",
    "os"
  ],
});

console.log("Backend build complete → dist/index.mjs");
