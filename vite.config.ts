import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      remotes: {
        dashboard: "http://localhost:5001/assets/remoteEntry.js",
        admin: "http://localhost:5002/assets/remoteEntry.js",
        user: "http://localhost:5003/assets/remoteEntry.js",
      },
      shared: {
        react: {
          requiredVersion: "^19.1.0",
          shareScope: "default",
        },
        "react-dom": {
          requiredVersion: "^19.1.0",
          shareScope: "default",
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  publicDir: "public",
  server: {
    port: 5000,
    middlewareMode: false,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: "terser",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    sourcemap: false,
  },
});
