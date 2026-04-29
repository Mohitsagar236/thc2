#!/usr/bin/env node

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const MFE_CONFIG = path.join(PROJECT_ROOT, ".mfe-config.json");
const TEMP_DIR = path.join(PROJECT_ROOT, ".tmp-theme-sync");
const GIT_TOKEN = process.env.MFE_SYNC_TOKEN || "";

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with exit code ${result.status ?? 1}`,
    );
  }
}

function authUrl(url) {
  if (!GIT_TOKEN) {
    return url;
  }

  return url.replace(
    "https://github.com/",
    `https://x-access-token:${GIT_TOKEN}@github.com/`,
  );
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDirectoryContents(sourceDir, destinationDir) {
  ensureDirectory(destinationDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectoryContents(sourcePath, destinationPath);
      continue;
    }

    if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function readConfig() {
  if (!fs.existsSync(MFE_CONFIG)) {
    throw new Error(`Missing required config file: ${MFE_CONFIG}`);
  }

  return JSON.parse(fs.readFileSync(MFE_CONFIG, "utf-8"));
}

function getThemeVersion() {
  const packageJsonPath = path.join(PROJECT_ROOT, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  return packageJson.version;
}

function collectSourceFiles(rootDir) {
  const files = [];
  const stack = [rootDir];
  const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

  while (stack.length > 0) {
    const currentDir = stack.pop();
    if (!currentDir || !fs.existsSync(currentDir)) {
      continue;
    }

    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
        continue;
      }

      if (entry.isFile() && allowedExtensions.has(path.extname(entry.name))) {
        files.push(entryPath);
      }
    }
  }

  return files;
}

function rewriteThemeImports(repoDir) {
  const sourceFiles = collectSourceFiles(path.join(repoDir, "src"));
  let changedFiles = 0;

  for (const filePath of sourceFiles) {
    const original = fs.readFileSync(filePath, "utf-8");
    const updated = original.replace(
      /(["'])@\/theme(?!-shared)([^"']*)\1/g,
      (_match, quote, suffix) => `${quote}@/theme-shared${suffix}${quote}`,
    );

    if (updated !== original) {
      fs.writeFileSync(filePath, updated);
      changedFiles += 1;
    }
  }

  return changedFiles;
}

function syncRepository(repo, themeVersion) {
  const repoDir = path.join(TEMP_DIR, repo.name);

  if (fs.existsSync(repoDir)) {
    run("git", ["fetch", "origin"], repoDir);
    run("git", ["checkout", repo.branch], repoDir);
    run("git", ["pull", "origin", repo.branch], repoDir);
  } else {
    run(
      "git",
      [
        "clone",
        "--depth",
        "1",
        "--branch",
        repo.branch,
        authUrl(repo.url),
        repoDir,
      ],
      PROJECT_ROOT,
    );
  }

  ensureDirectory(path.join(repoDir, "src"));

  const themeDestination = path.join(repoDir, "src", "theme-shared");
  fs.rmSync(themeDestination, { recursive: true, force: true });
  ensureDirectory(themeDestination);

  copyDirectoryContents(
    path.join(PROJECT_ROOT, "src", "theme"),
    themeDestination,
  );
  fs.copyFileSync(
    path.join(PROJECT_ROOT, "tailwind.config.js"),
    path.join(themeDestination, "tailwind.config.js"),
  );

  const syncTimestamp = new Date().toISOString();
  fs.writeFileSync(
    path.join(themeDestination, "version.ts"),
    `/**
 * Auto-generated theme version file
 * Last synced: ${syncTimestamp}
 */

export const THEME_METADATA = {
  version: '${themeVersion}',
  syncedAt: '${syncTimestamp}',
  syncedBy: 'Theme Sync Script',
  syncTrigger: 'manual',
  repository: 'https://github.com/${process.env.GITHUB_REPOSITORY || "unknown"}'
} as const;

export const THEME_VERSION = THEME_METADATA.version;
`,
  );

  const rewrittenFiles = rewriteThemeImports(repoDir);

  run("git", ["config", "user.name", "Theme Sync Bot"], repoDir);
  run("git", ["config", "user.email", "theme-sync@ctms.dev"], repoDir);
  run("git", ["add", "-A", "src"], repoDir);

  const hasChanges =
    spawnSync("git", ["diff", "--cached", "--quiet"], {
      cwd: repoDir,
      stdio: "ignore",
    }).status !== 0;

  if (!hasChanges) {
    console.log(`  ✓ No theme or import updates in ${repo.name}`);
    return;
  }

  console.log(
    `  ✅ Updated ${repo.name}: shared theme copy plus ${rewrittenFiles} rewritten source file(s)`,
  );

  run(
    "git",
    [
      "commit",
      "-m",
      `chore(theme): sync shared theme updates from @ctms/theme@${themeVersion}`,
    ],
    repoDir,
  );
  run("git", ["push", "origin", repo.branch], repoDir);
  console.log(`  ✓ Pushed theme updates to ${repo.name}@${repo.branch}`);
}

function main() {
  const config = readConfig();
  const themeVersion = getThemeVersion();
  const activeMfes = config.mfes.filter((mfe) => mfe.enabled);

  console.log("🎨 Syncing shared theme to micro frontends...");

  run(
    process.execPath,
    [path.join("scripts", "build-theme-bundle.js")],
    PROJECT_ROOT,
  );

  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }

  ensureDirectory(TEMP_DIR);

  if (activeMfes.length === 0) {
    throw new Error(`No enabled micro frontends found in ${MFE_CONFIG}`);
  }

  for (const repo of activeMfes) {
    console.log(
      `\n📤 Syncing theme to ${repo.name} (${repo.url}@${repo.branch || "develop"})...`,
    );
    syncRepository({ ...repo, branch: repo.branch || "develop" }, themeVersion);
  }

  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log("\n✅ Theme sync complete!");
  console.log(`Version: ${themeVersion}`);
}

try {
  main();
} catch (error) {
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  console.error(
    "❌ Theme sync failed:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
}
