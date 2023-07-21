import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: "./public/",
  base: "./",
  build: {
    chunkSizeWarningLimit: 1000,
    assetsDir: "assets",
    rollupOptions: {
      input: "index.html",
    },
  },
  plugins: [
    glsl()
  ],
});
