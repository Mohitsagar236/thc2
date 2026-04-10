#!/usr/bin/env node

/**
 * Bundle Size Checker
 * Validates theme bundle doesn't exceed configured thresholds
 *
 * Usage:
 *   node scripts/check-bundle-size.js
 */

import fs from "fs";
import zlib from "zlib";

const THRESHOLDS = {
  maxSize: 50000, // 50KB uncompressed
  maxSizeGz: 15000, // 15KB gzipped
  warnSize: 45000,
  warnSizeGz: 14000,
};

console.log("📦 Checking theme bundle size...\n");

const bundlePath = "dist/theme/all-themes.js";

if (!fs.existsSync(bundlePath)) {
  console.log("⚠️  Bundle not found. Run 'npm run build' first.\n");
  process.exit(0);
}

const bundleContent = fs.readFileSync(bundlePath);
const uncompressedSize = bundleContent.length;
const gzipSize = zlib.gzipSync(bundleContent).length;

console.log(`📊 Bundle Size Report\n${"=".repeat(40)}`);
console.log(`\n📄 Uncompressed: ${(uncompressedSize / 1024).toFixed(2)} KB`);
console.log(`   Limit:        ${(THRESHOLDS.maxSize / 1024).toFixed(2)} KB`);
console.log(`   Warning:      ${(THRESHOLDS.warnSize / 1024).toFixed(2)} KB`);

if (uncompressedSize > THRESHOLDS.maxSize) {
  console.log(
    `   ✗ EXCEEDED - Reduce bundle size by ${((uncompressedSize - THRESHOLDS.maxSize) / 1024).toFixed(2)} KB`,
  );
} else if (uncompressedSize > THRESHOLDS.warnSize) {
  console.log(`   ⚠️  WARNING - Approaching limit`);
} else {
  console.log(`   ✓ OK`);
}

console.log(`\n🗜️  Gzipped: ${(gzipSize / 1024).toFixed(2)} KB`);
console.log(`   Limit:    ${(THRESHOLDS.maxSizeGz / 1024).toFixed(2)} KB`);
console.log(`   Warning:  ${(THRESHOLDS.warnSizeGz / 1024).toFixed(2)} KB`);

if (gzipSize > THRESHOLDS.maxSizeGz) {
  console.log(
    `   ✗ EXCEEDED - Reduce bundle by ${((gzipSize - THRESHOLDS.maxSizeGz) / 1024).toFixed(2)} KB`,
  );
} else if (gzipSize > THRESHOLDS.warnSizeGz) {
  console.log(`   ⚠️  WARNING - Approaching limit`);
} else {
  console.log(`   ✓ OK`);
}

const compressionRatio = ((1 - gzipSize / uncompressedSize) * 100).toFixed(1);
console.log(`\n📉 Compression: ${compressionRatio}% reduction\n`);

const passed =
  uncompressedSize <= THRESHOLDS.maxSize && gzipSize <= THRESHOLDS.maxSizeGz;

if (!passed) {
  console.log("❌ FAILED: Bundle exceeds size limits\n");
  process.exit(1);
} else {
  console.log("✅ Bundle size is within limits\n");
  process.exit(0);
}
