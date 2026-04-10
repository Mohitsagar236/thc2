#!/usr/bin/env node

/**
 * Build theme bundle using a published package version from registry.
 *
 * Usage:
 *   node scripts/build-theme-bundle-from-registry.js --version 2.2.0
 *   node scripts/build-theme-bundle-from-registry.js --package @ctms/theme --version 2.2.0 --registry https://verdaccio.example.com
 */

import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function parseArgs(argv) {
  const options = {
    packageName: process.env.THEME_PACKAGE_NAME || "@ctms/theme",
    version: process.env.THEME_BUNDLE_VERSION || "",
    registry: process.env.REGISTRY_URL || "",
    outputDir: process.env.THEME_OUTPUT_DIR || "dist/theme",
    minify: false,
    keepTemp: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--package" && argv[i + 1]) {
      options.packageName = argv[++i];
      continue;
    }

    if (arg === "--version" && argv[i + 1]) {
      options.version = argv[++i];
      continue;
    }

    if (arg === "--registry" && argv[i + 1]) {
      options.registry = argv[++i];
      continue;
    }

    if (arg === "--output" && argv[i + 1]) {
      options.outputDir = argv[++i];
      continue;
    }

    if (arg === "--minify") {
      options.minify = true;
      continue;
    }

    if (arg === "--keep-temp") {
      options.keepTemp = true;
    }
  }

  return options;
}

function findCataloguePath(searchRoot) {
  const preferred = [
    path.join(
      searchRoot,
      "package",
      "src",
      "theme",
      "themes",
      "catalogue.json",
    ),
    path.join(searchRoot, "package", "theme", "themes", "catalogue.json"),
    path.join(searchRoot, "package", "themes", "catalogue.json"),
    path.join(searchRoot, "package", "dist", "theme", "catalogue.json"),
    path.join(searchRoot, "package", "dist", "themes", "catalogue.json"),
  ];

  for (const candidate of preferred) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  const stack = [searchRoot];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name === "catalogue.json") {
        return fullPath;
      }
    }
  }

  return null;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.version) {
    console.error(
      "Missing version. Provide --version or set THEME_BUNDLE_VERSION.",
    );
    process.exit(1);
  }

  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "theme-registry-bundle-"),
  );
  const extractDir = path.join(tempDir, "extract");
  fs.mkdirSync(extractDir, { recursive: true });

  try {
    const npmPackArgs = [
      "pack",
      `${args.packageName}@${args.version}`,
      "--json",
      "--pack-destination",
      tempDir,
    ];

    if (args.registry) {
      npmPackArgs.push("--registry", args.registry);
    }

    console.log(`Packing ${args.packageName}@${args.version} from registry...`);
    const packedOutput = execFileSync(npmCommand, npmPackArgs, {
      encoding: "utf-8",
    });

    const packed = JSON.parse(packedOutput.trim());
    if (!Array.isArray(packed) || !packed[0] || !packed[0].filename) {
      throw new Error("npm pack did not return tarball metadata");
    }

    const tarballPath = path.join(tempDir, packed[0].filename);

    console.log(`Extracting package: ${path.basename(tarballPath)}`);
    execFileSync("tar", ["-xzf", tarballPath, "-C", extractDir], {
      stdio: "inherit",
    });

    const cataloguePath = findCataloguePath(extractDir);
    if (!cataloguePath) {
      throw new Error(
        "Could not find catalogue.json in published package contents",
      );
    }

    const buildScriptPath = path.join(__dirname, "build-theme-bundle.js");
    const buildArgs = [
      buildScriptPath,
      "--version",
      args.version,
      "--output",
      args.outputDir,
      "--catalogue",
      cataloguePath,
    ];

    if (args.minify) {
      buildArgs.push("--minify");
    }

    console.log(`Building bundle from package catalogue: ${cataloguePath}`);
    execFileSync(process.execPath, buildArgs, {
      stdio: "inherit",
      env: {
        ...process.env,
        THEME_BUNDLE_VERSION: args.version,
        THEME_OUTPUT_DIR: args.outputDir,
        THEME_CATALOGUE_PATH: cataloguePath,
      },
    });

    console.log("Built theme bundle from published registry package.");
  } finally {
    if (!args.keepTemp) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } else {
      console.log(`Temporary files preserved at: ${tempDir}`);
    }
  }
}

main();
