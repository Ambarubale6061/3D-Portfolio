import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.mjs",

  bundle: true,

  // ✅ Node environment config
  platform: "node",
  target: "node18",
  format: "esm",

  sourcemap: true,

  // ✅ IMPORTANT: Server dependencies bundle karu naka
  external: [
    // Core backend libs
    "express",
    "cors",
    "dotenv",

    // Logging
    "pino",
    "pino-http",
    "pino-pretty",

    // Mail / AI SDKs
    "nodemailer",
    "openai",
    "groq-sdk",

    // Node built-ins (VERY IMPORTANT)
    "fs",
    "path",
    "os",
    "events",
    "http",
    "https",
    "stream",
    "url",
    "zlib"
  ],

  logLevel: "info",
});

console.log("✅ Backend build complete → dist/index.mjs");
