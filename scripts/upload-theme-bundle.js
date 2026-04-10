#!/usr/bin/env node

/**
 * Upload theme bundles to CDN using HTTP PUT.
 *
 * Usage:
 *   node scripts/upload-theme-bundle.js --version 2.2.0
 *
 * Required env vars:
 *   CDN_UPLOAD_URL - Base upload endpoint (example: https://cdn-api.company.com)
 *   CDN_UPLOAD_KEY - Bearer token for upload API
 */

import fs from "fs";
import path from "path";

function parseArgs(argv) {
  const options = {
    version: process.env.THEME_BUNDLE_VERSION || "",
    uploadBaseUrl: process.env.CDN_UPLOAD_URL || "",
    uploadKey: process.env.CDN_UPLOAD_KEY || "",
    timeoutMs: Number(process.env.CDN_UPLOAD_TIMEOUT_MS || 15000),
    distDir: process.env.THEME_OUTPUT_DIR || path.join("dist", "theme"),
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--version" && argv[i + 1]) {
      options.version = argv[++i];
      continue;
    }

    if (arg === "--base-url" && argv[i + 1]) {
      options.uploadBaseUrl = argv[++i];
      continue;
    }

    if (arg === "--api-key" && argv[i + 1]) {
      options.uploadKey = argv[++i];
      continue;
    }

    if (arg === "--timeout-ms" && argv[i + 1]) {
      options.timeoutMs = Number(argv[++i]);
    }
  }

  return options;
}

function joinUploadUrl(baseUrl, targetPath) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = targetPath.startsWith("/")
    ? targetPath
    : `/${targetPath}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function uploadFile({
  filePath,
  uploadUrl,
  uploadKey,
  cacheControl,
  timeoutMs,
}) {
  const payload = fs.readFileSync(filePath);
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${uploadKey}`,
      "Content-Type": "application/javascript",
      "Cache-Control": cacheControl,
    },
    body: payload,
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Upload failed for ${uploadUrl}: ${response.status} ${response.statusText} ${errorText}`,
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.version) {
    console.error(
      "Missing version. Provide --version or set THEME_BUNDLE_VERSION.",
    );
    process.exit(1);
  }

  if (!args.uploadBaseUrl) {
    console.error(
      "Missing CDN upload URL. Set CDN_UPLOAD_URL or pass --base-url.",
    );
    process.exit(1);
  }

  if (!args.uploadKey) {
    console.error(
      "Missing CDN upload key. Set CDN_UPLOAD_KEY or pass --api-key.",
    );
    process.exit(1);
  }

  const stableFile = path.join(
    args.distDir,
    "themes",
    "stable",
    "all-themes.js",
  );
  const versionedFile = path.join(
    args.distDir,
    "themes",
    args.version,
    "all-themes.js",
  );

  if (!fs.existsSync(stableFile)) {
    console.error(`Stable bundle not found: ${stableFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(versionedFile)) {
    console.error(`Versioned bundle not found: ${versionedFile}`);
    process.exit(1);
  }

  const stableUploadUrl = joinUploadUrl(
    args.uploadBaseUrl,
    "/themes/stable/all-themes.js",
  );
  const versionedUploadUrl = joinUploadUrl(
    args.uploadBaseUrl,
    `/themes/${args.version}/all-themes.js`,
  );

  console.log(`Uploading stable bundle to ${stableUploadUrl}`);
  await uploadFile({
    filePath: stableFile,
    uploadUrl: stableUploadUrl,
    uploadKey: args.uploadKey,
    cacheControl: "max-age=60,must-revalidate",
    timeoutMs: args.timeoutMs,
  });

  console.log(`Uploading versioned bundle to ${versionedUploadUrl}`);
  await uploadFile({
    filePath: versionedFile,
    uploadUrl: versionedUploadUrl,
    uploadKey: args.uploadKey,
    cacheControl: "max-age=31536000,immutable",
    timeoutMs: args.timeoutMs,
  });

  console.log("Theme bundle upload completed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
