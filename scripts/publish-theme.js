#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

const packageName = process.env.THEME_PACKAGE_NAME || "@ctms/theme";
const version = packageJson.version;
const skipChecks = process.env.SKIP_THEME_PUBLISH_CHECKS === "true";
const registryUrl = process.env.REGISTRY_URL || "";
const hasCdnUploadConfig =
  Boolean(process.env.CDN_UPLOAD_URL) && Boolean(process.env.CDN_UPLOAD_KEY);

console.log(`Publishing ${packageName}@${version}...`);

if (!skipChecks) {
  console.log("Running pre-publish quality checks...");
  execSync("npm run theme:validate", { stdio: "inherit" });
  execSync("npm run theme:build-bundle", { stdio: "inherit" });
  execSync("npm run theme:check-size", { stdio: "inherit" });
}

execSync("npm publish", { stdio: "inherit" });
execSync(`npm dist-tag add ${packageName}@${version} stable`, {
  stdio: "inherit",
});

const registryArg = registryUrl ? ` --registry ${registryUrl}` : "";
execSync(
  `npm run theme:build-from-registry -- --package ${packageName} --version ${version}${registryArg}`,
  { stdio: "inherit" },
);

if (hasCdnUploadConfig) {
  execSync(`npm run theme:upload -- --version ${version}`, {
    stdio: "inherit",
  });
} else {
  console.warn(
    "Skipping CDN upload because CDN_UPLOAD_URL or CDN_UPLOAD_KEY is not set.",
  );
}

console.log(`Published ${packageName}@${version} and updated stable dist-tag.`);
