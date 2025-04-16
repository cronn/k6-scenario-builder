import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  platform: "node",
  format: ["esm", "cjs"],
  dts: true,
  outDir: "./dist",
  clean: true,
  ...options,
}));
