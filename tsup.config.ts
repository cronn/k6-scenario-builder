import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/**/*.ts"],
  platform: "node",
  format: ["esm"],
  dts: true,
  outDir: "./dist",
  clean: true,
  ...options,
}));
