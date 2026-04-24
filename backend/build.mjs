import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "dist/index.mjs",
  sourcemap: true,
  // Mark pino and its transports as external — Node will resolve them
  // from node_modules at runtime, avoiding the require() CJS issue
  external: ["pino", "pino-pretty", "pino-http"],
});

console.log("Backend build complete → dist/index.mjs");
