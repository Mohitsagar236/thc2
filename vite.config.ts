import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@features": resolve(__dirname, "./src/features"),
      "@shared": resolve(__dirname, "./src/shared"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@assets": resolve(__dirname, "./src/assets"),
    },
  },
  build: {
    target: "ES2020",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "theme-system": [
            "./src/theme/index.ts",
            "./src/theme/provider.tsx",
            "./src/theme/context.ts",
          ],
          "dashboard-sections": [
            "./src/modules/dashboard/sections/DashboardHeader",
            "./src/modules/dashboard/sections/HeroSection",
            "./src/modules/dashboard/sections/CapabilityMatrix",
            "./src/modules/dashboard/sections/FlowSection",
            "./src/modules/dashboard/sections/CachingAndStartupSection",
            "./src/modules/dashboard/sections/MFEIntegrationSection",
            "./src/modules/dashboard/sections/QAGateSection",
            "./src/modules/dashboard/sections/DashboardFooter",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
});
