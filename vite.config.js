import { defineConfig } from "vite";
import { join } from "path";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    assetsDir: "assets",
    rollupOptions: {
      input: join(__dirname, "index.html"),
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
});
