#!/usr/bin/env node

/**
 * Build script for all-themes.js bundle
 * Compiles all themes into a single distributable bundle
 * for CDN delivery and runtime theme switching.
 *
 * Usage:
 *   node scripts/build-theme-bundle.js [--output PATH] [--minify] [--version VERSION] [--catalogue PATH]
 *
 * Environment Variables:
 *   THEME_OUTPUT_DIR - Output directory (default: dist/theme)
 *   THEME_BUNDLE_VERSION - Bundle version (default: from catalogue/package.json)
 *   THEME_CATALOGUE_PATH - Theme catalogue JSON path
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

const defaultCataloguePath = path.join(
  __dirname,
  "../src/theme/themes/catalogue.json",
);

const args = process.argv.slice(2);

let outputDir = "dist/theme";
let minify = false;
let cataloguePath = process.env.THEME_CATALOGUE_PATH || defaultCataloguePath;
let bundleVersion = packageJson.version;
let hasExplicitVersion = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--output" && args[i + 1]) outputDir = args[++i];
  if (args[i] === "--minify") minify = true;
  if (args[i] === "--version" && args[i + 1]) {
    bundleVersion = args[++i];
    hasExplicitVersion = true;
  }
  if (args[i] === "--catalogue" && args[i + 1]) cataloguePath = args[++i];
}

if (process.env.THEME_OUTPUT_DIR) outputDir = process.env.THEME_OUTPUT_DIR;
if (process.env.THEME_BUNDLE_VERSION) {
  bundleVersion = process.env.THEME_BUNDLE_VERSION;
  hasExplicitVersion = true;
}

if (!fs.existsSync(cataloguePath)) {
  console.error(`Theme catalogue not found: ${cataloguePath}`);
  process.exit(1);
}

const rawCatalogue = JSON.parse(fs.readFileSync(cataloguePath, "utf-8"));
if (!hasExplicitVersion) {
  bundleVersion = rawCatalogue.version || packageJson.version;
}

console.log("Building theme bundle...");
console.log(`Version: ${bundleVersion}`);
console.log(`Output: ${outputDir}`);
console.log(`Catalogue: ${cataloguePath}`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const timestamp = new Date().toISOString();
const themeCatalogue = {
  ...rawCatalogue,
  version: bundleVersion,
  timestamp,
};

const serializedCatalogue = JSON.stringify(
  themeCatalogue,
  null,
  minify ? 0 : 2,
);

const bundleContent = `(function(global){\n  "use strict";\n  var themeCatalogue = ${serializedCatalogue};\n\n  if (typeof module !== "undefined" && module.exports) {\n    module.exports = themeCatalogue;\n  } else if (typeof define === "function" && define.amd) {\n    define([], function() { return themeCatalogue; });\n  } else {\n    global.__THEME_CATALOGUE__ = themeCatalogue;\n  }\n})(typeof window !== "undefined" ? window : globalThis);\n`;

const bundleContentOptimized = minify
  ? bundleContent.replace(/\s+/g, " ").trim()
  : bundleContent;

const rootStablePath = path.join(outputDir, "all-themes.js");
const rootVersionedPath = path.join(
  outputDir,
  `all-themes-v${bundleVersion}.js`,
);

fs.writeFileSync(rootStablePath, bundleContentOptimized);
fs.writeFileSync(rootVersionedPath, bundleContentOptimized);

const cdnStableDir = path.join(outputDir, "themes", "stable");
const cdnVersionDir = path.join(outputDir, "themes", bundleVersion);

fs.mkdirSync(cdnStableDir, { recursive: true });
fs.mkdirSync(cdnVersionDir, { recursive: true });

const cdnStablePath = path.join(cdnStableDir, "all-themes.js");
const cdnVersionPath = path.join(cdnVersionDir, "all-themes.js");

fs.writeFileSync(cdnStablePath, bundleContentOptimized);
fs.writeFileSync(cdnVersionPath, bundleContentOptimized);

const metadata = {
  version: bundleVersion,
  timestamp,
  bundleSize: Buffer.byteLength(bundleContentOptimized),
  themeCount: Array.isArray(themeCatalogue.themes)
    ? themeCatalogue.themes.length
    : 0,
  fileName: "all-themes.js",
  versionedFileName: `all-themes-v${bundleVersion}.js`,
  cdnPaths: {
    stable: `/themes/stable/all-themes.js`,
    versioned: `/themes/${bundleVersion}/all-themes.js`,
  },
  checksums: {
    bundle: crypto
      .createHash("sha256")
      .update(bundleContentOptimized)
      .digest("hex"),
  },
};

fs.writeFileSync(
  path.join(outputDir, "manifest.json"),
  JSON.stringify(metadata, null, 2),
);

console.log(`Stable bundle: ${rootStablePath}`);
console.log(`Versioned bundle: ${rootVersionedPath}`);
console.log(`CDN stable bundle: ${cdnStablePath}`);
console.log(`CDN versioned bundle: ${cdnVersionPath}`);
console.log("Theme bundle build complete.");
