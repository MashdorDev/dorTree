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
  server: {
    configureServer: (app) => {
      app.use((req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        next();
      });
    },
  },
  plugins: [
    glsl()
  ],
});
