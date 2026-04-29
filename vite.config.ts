import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Custom middleware for handling remote entry files
 * Allows fallback from /assets/remoteEntry.js to /remoteEntry.js
 */
function remoteEntryMiddleware() {
  return {
    name: "remote-entry-middleware",
    apply: "serve",
    configResolved() {
      // Plugin initialization
    },
    transformIndexHtml: {
      order: "pre" as const,
      handler(html: string) {
        // Add script to help with remote loading diagnostics
        const diagnosticScript = `
          <script>
            window.__REMOTE_LOADING_START__ = Date.now();
            console.log('[Host] Initializing remote module federation...');
          </script>
        `;
        return html.replace("<head>", `<head>${diagnosticScript}`);
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    remoteEntryMiddleware(),
    federation({
      name: "host",
      remotes: {
        dashboard: "http://localhost:5001/assets/remoteEntry.js",
        admin: "http://localhost:5002/assets/remoteEntry.js",
        user: "http://localhost:5003/assets/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: "^19.1.0" },
        "react-dom": { singleton: true, requiredVersion: "^19.1.0" },
      } as Record<string, unknown>,
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
    headers: {
      // Ensure remoteEntry.js is not cached
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
});
