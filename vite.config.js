import { defineConfig } from "vite";
import { join } from "path";
// vite.config.js
export default {
  build: {
    chunkSizeWarningLimit: 1000,
    assetsDir: "assets",
    rollupOptions: {
      input: join(__dirname, "index.html"),
    },
  },
};
