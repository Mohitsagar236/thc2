#!/usr/bin/env node

import { spawn } from "node:child_process";
import { resolve } from "node:path";

const isWindows = process.platform === "win32";
const command = isWindows ? "cmd.exe" : "bash";
const scriptPath = isWindows
  ? resolve("scripts", "sync-theme-to-mfes.bat")
  : resolve("scripts", "sync-theme-to-mfes.sh");
const args = isWindows ? ["/c", scriptPath] : [scriptPath];

const child = spawn(command, args, { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
child.on("error", (error) => {
  console.error("Failed to run sync script:", error.message);
  process.exit(1);
});
