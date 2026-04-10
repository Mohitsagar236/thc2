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

console.log(`Publishing ${packageName}@${version}...`);

execSync("npm publish", { stdio: "inherit" });
execSync(`npm dist-tag add ${packageName}@${version} stable`, {
  stdio: "inherit",
});

console.log(`Published ${packageName}@${version} and updated stable dist-tag.`);
