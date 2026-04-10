#!/usr/bin/env node

/**
 * Build script for all-themes.js bundle
 * Compiles all themes into a single distributable bundle
 * for CDN delivery and runtime theme switching.
 *
 * Usage:
 *   node scripts/build-theme-bundle.js [--output PATH] [--minify] [--version VERSION]
 *
 * Environment Variables:
 *   THEME_OUTPUT_DIR - Output directory (default: dist/theme)
 *   THEME_BUNDLE_VERSION - Bundle version (default: from package.json)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

const args = process.argv.slice(2);

// Parse CLI arguments
let outputDir = "dist/theme";
let minify = false;
let bundleVersion = packageJson.version;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--output" && args[i + 1]) outputDir = args[++i];
  if (args[i] === "--minify") minify = true;
  if (args[i] === "--version" && args[i + 1]) bundleVersion = args[++i];
}

// Override with environment variables
if (process.env.THEME_OUTPUT_DIR) outputDir = process.env.THEME_OUTPUT_DIR;
if (process.env.THEME_BUNDLE_VERSION)
  bundleVersion = process.env.THEME_BUNDLE_VERSION;

console.log("🎨 Building theme bundle...");
console.log(`📦 Version: ${bundleVersion}`);
console.log(`📁 Output: ${outputDir}`);

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Created output directory`);
}

// Build the all-themes.js bundle
// In a production system, this would import compiled theme definitions
// For now, we generate the bundle content directly
const bundleContent = `
(function(global) {
  "use strict";
  
  // Theme Catalogue Bundle v${bundleVersion}
  // Auto-generated ${new Date().toISOString()}
  // All available themes for runtime switching

  const themeCatalogue = {
    version: "${bundleVersion}",
    timestamp: "${new Date().toISOString()}",
    themes: {
      light: {
        themeName: "light",
        meta: {
          label: "Light Theme",
          description: "Clean light theme with dark text"
        },
        tokens: {
          "color-bg": "#F9FAFB",
          "color-surface": "#FFFFFF",
          "color-text": "#111827",
          "color-text-muted": "#4B5563",
          "color-primary": "#6467f2",
          "color-primary-dark": "#4F46E5",
          "color-error": "#B91C1C",
          "color-success": "#065F46",
          "color-warning": "#B45309",
          "color-info": "#1E40AF",
          "color-border": "#D1D5DB",
          "color-focus": "#6467f2",
          "font-family-base": "Inter, system-ui, sans-serif",
          "font-size-base": "16px",
          "font-size-sm": "14px",
          "font-size-lg": "18px",
          "line-height-base": "1.5",
          "spacing-unit": "8px",
          "spacing-xs": "4px",
          "spacing-sm": "8px",
          "spacing-md": "12px",
          "spacing-lg": "16px",
          "spacing-xl": "24px",
          "spacing-2xl": "32px",
          "sidebar-width": "240px",
          "header-height": "64px",
          "container-width": "1280px",
          "card-padding": "24px"
        },
        layout: "layout-sidebar",
        density: "density-comfortable"
      },
      dark: {
        themeName: "dark",
        meta: {
          label: "Dark Theme",
          description: "Dark theme for low-light environments"
        },
        tokens: {
          "color-bg": "#111827",
          "color-surface": "#1F2937",
          "color-text": "#F9FAFB",
          "color-text-muted": "#9CA3AF",
          "color-primary": "#60A5FA",
          "color-primary-dark": "#3B82F6",
          "color-error": "#FCA5A5",
          "color-success": "#6EE7B7",
          "color-warning": "#FBBF24",
          "color-info": "#93C5FD",
          "color-border": "#374151",
          "color-focus": "#60A5FA",
          "font-family-base": "Inter, system-ui, sans-serif",
          "font-size-base": "16px",
          "font-size-sm": "14px",
          "font-size-lg": "18px",
          "line-height-base": "1.5",
          "spacing-unit": "8px",
          "spacing-xs": "4px",
          "spacing-sm": "8px",
          "spacing-md": "12px",
          "spacing-lg": "16px",
          "spacing-xl": "24px",
          "spacing-2xl": "32px",
          "sidebar-width": "240px",
          "header-height": "64px",
          "container-width": "1280px",
          "card-padding": "24px"
        },
        layout: "layout-sidebar",
        density: "density-comfortable"
      },
      ocean: {
        themeName: "ocean",
        meta: {
          label: "Ocean Theme",
          description: "Ocean-inspired blue palette"
        },
        tokens: {
          "color-bg": "#F0F9FF",
          "color-surface": "#FFFFFF",
          "color-text": "#0C2340",
          "color-text-muted": "#475569",
          "color-primary": "#0369A1",
          "color-primary-dark": "#0284C7",
          "color-error": "#DC2626",
          "color-success": "#059669",
          "color-warning": "#D97706",
          "color-info": "#0EA5E9",
          "color-border": "#BAE6FD",
          "color-focus": "#0369A1",
          "font-family-base": "Inter, system-ui, sans-serif",
          "font-size-base": "16px",
          "font-size-sm": "14px",
          "font-size-lg": "18px",
          "line-height-base": "1.5",
          "spacing-unit": "8px",
          "spacing-xs": "4px",
          "spacing-sm": "8px",
          "spacing-md": "12px",
          "spacing-lg": "16px",
          "spacing-xl": "24px",
          "spacing-2xl": "32px",
          "sidebar-width": "240px",
          "header-height": "64px",
          "container-width": "1280px",
          "card-padding": "24px"
        },
        layout: "layout-sidebar",
        density: "density-comfortable"
      },
      compact: {
        themeName: "compact",
        meta: {
          label: "Compact Theme",
          description: "Dense layout for information-rich interfaces"
        },
        tokens: {
          "color-bg": "#F9FAFB",
          "color-surface": "#FFFFFF",
          "color-text": "#111827",
          "color-text-muted": "#4B5563",
          "color-primary": "#6467f2",
          "color-primary-dark": "#4F46E5",
          "color-error": "#B91C1C",
          "color-success": "#065F46",
          "color-warning": "#B45309",
          "color-info": "#1E40AF",
          "color-border": "#D1D5DB",
          "color-focus": "#6467f2",
          "font-family-base": "Inter, system-ui, sans-serif",
          "font-size-base": "14px",
          "font-size-sm": "12px",
          "font-size-lg": "16px",
          "line-height-base": "1.4",
          "spacing-unit": "4px",
          "spacing-xs": "2px",
          "spacing-sm": "4px",
          "spacing-md": "6px",
          "spacing-lg": "8px",
          "spacing-xl": "12px",
          "spacing-2xl": "16px",
          "sidebar-width": "200px",
          "header-height": "48px",
          "container-width": "1280px",
          "card-padding": "12px"
        },
        layout: "layout-sidebar",
        density: "density-compact"
      }
    }
  };

  // Export for different module systems
  if (typeof module !== "undefined" && module.exports) {
    module.exports = themeCatalogue;
  } else if (typeof define === "function" && define.amd) {
    define([], function() {
      return themeCatalogue;
    });
  } else {
    global.__THEME_CATALOGUE__ = themeCatalogue;
  }
})(typeof window !== "undefined" ? window : global);
`;

// Write bundle file
const bundlePath = path.join(outputDir, "all-themes.js");
const bundleContent_optimized = minify
  ? bundleContent.replace(/\n\s+/g, " ").replace(/\/\*[\s\S]*?\*\//g, "")
  : bundleContent;

fs.writeFileSync(bundlePath, bundleContent_optimized);
console.log(`✓ Bundle created: ${bundlePath}`);

// Create versioned bundle
const versionedPath = path.join(outputDir, `all-themes-v${bundleVersion}.js`);
fs.writeFileSync(versionedPath, bundleContent_optimized);
console.log(`✓ Versioned bundle: ${versionedPath}`);

// Create metadata file
const metadata = {
  version: bundleVersion,
  timestamp: new Date().toISOString(),
  bundleSize: Buffer.byteLength(bundleContent_optimized),
  themeCount: 4,
  fileName: "all-themes.js",
  versionedFileName: `all-themes-v${bundleVersion}.js`,
  checksums: {
    bundle: crypto
      .createHash("sha256")
      .update(bundleContent_optimized)
      .digest("hex"),
  },
};

fs.writeFileSync(
  path.join(outputDir, "manifest.json"),
  JSON.stringify(metadata, null, 2),
);
console.log(`✓ Manifest created`);

console.log("\n✨ Theme bundle build complete!");
console.log("Metadata:\n", metadata);
