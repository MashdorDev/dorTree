import glsl from "vite-plugin-glsl";

import { defineConfig } from "vite";
import { join } from "path";
// vite.config.js
export default {
  root: "src/",
  publicDir: "../public/",
  base: "./",
  build: {
    chunkSizeWarningLimit: 1000,
    assetsDir: "assets",
    rollupOptions: {
      input: join(__dirname, "index.html"),
    },
  },
  plugins: [
    glsl()
  ],
};
