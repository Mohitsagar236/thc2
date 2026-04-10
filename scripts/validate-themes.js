#!/usr/bin/env node

/**
 * Theme Accessibility Validation Script
 * Runs WCAG 2.2 AA checks on all themes in the catalogue.
 * Blocks publish if any theme fails.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reportDir = path.join(__dirname, "../dist/theme");
const cataloguePath = path.join(
  __dirname,
  "../src/theme/themes/catalogue.json",
);

const WCAG = {
  CONTRAST_NORMAL: 4.5,
  CONTRAST_LARGE: 3.0,
  FOCUS_CONTRAST: 3.0,
  MIN_FOCUS_WIDTH: 2,
  MIN_TARGET_SIZE: 24,
  RECOMMENDED_TARGET_SIZE: 44,
};

const REQUIRED_TOKENS = [
  "color-primary",
  "color-secondary",
  "color-bg",
  "color-surface",
  "color-text",
  "color-text-muted",
  "color-error",
  "color-success",
  "color-warning",
  "color-info",
  "color-border",
  "color-focus",
  "font-family-base",
  "font-size-base",
  "font-size-lg",
  "font-size-sm",
  "font-size-xl",
  "font-weight-regular",
  "font-weight-medium",
  "font-weight-semibold",
  "line-height-base",
  "spacing-unit",
  "spacing-xs",
  "spacing-sm",
  "spacing-md",
  "spacing-lg",
  "spacing-xl",
  "card-padding",
  "sidebar-width",
  "header-height",
  "container-max-width",
  "focus-ring-width",
  "focus-ring-offset",
  "min-target-size",
];

const CONTRAST_PAIRS = [
  ["color-text", "color-bg", WCAG.CONTRAST_NORMAL],
  ["color-text", "color-surface", WCAG.CONTRAST_NORMAL],
  ["color-text-muted", "color-bg", WCAG.CONTRAST_NORMAL],
  ["color-text-muted", "color-surface", WCAG.CONTRAST_NORMAL],
  ["color-surface", "color-primary", WCAG.CONTRAST_NORMAL],
  ["color-surface", "color-error", WCAG.CONTRAST_NORMAL],
  ["color-surface", "color-success", WCAG.CONTRAST_NORMAL],
  ["color-surface", "color-warning", WCAG.CONTRAST_LARGE],
  ["color-surface", "color-info", WCAG.CONTRAST_NORMAL],
];

function parsePx(value) {
  const parsed = Number.parseFloat(String(value).replace("px", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function hexToRgb(hex) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) {
    return null;
  }

  return {
    r: Number.parseInt(match[1], 16),
    g: Number.parseInt(match[2], 16),
    b: Number.parseInt(match[3], 16),
  };
}

function getRelativeLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return 0;
  }

  const channels = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((value) => {
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function getContrastRatio(foreground, background) {
  const l1 = getRelativeLuminance(foreground);
  const l2 = getRelativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

function validateTokenCompleteness(theme) {
  const missing = REQUIRED_TOKENS.filter((token) => !theme.tokens[token]);

  return {
    passed: missing.length === 0,
    missing,
    present: REQUIRED_TOKENS.length - missing.length,
    required: REQUIRED_TOKENS.length,
  };
}

function validateLayoutAndDensity(theme) {
  const layoutPassed =
    theme.layout === "layout-sidebar" || theme.layout === "layout-top-nav";
  const densityPassed =
    theme.density === "density-compact" ||
    theme.density === "density-comfortable";

  return {
    passed: layoutPassed && densityPassed,
    details: {
      layoutPassed,
      densityPassed,
      layout: theme.layout,
      density: theme.density,
    },
  };
}

function validateContrastPairs(theme) {
  const failures = [];
  const checks = [];

  for (const [fgToken, bgToken, minimum] of CONTRAST_PAIRS) {
    const fg = theme.tokens[fgToken];
    const bg = theme.tokens[bgToken];

    if (!fg || !bg) {
      failures.push({
        fgToken,
        bgToken,
        minimum,
        reason: "missing-token",
      });
      continue;
    }

    const ratio = getContrastRatio(fg, bg);
    const passed = ratio >= minimum;

    checks.push({ fgToken, bgToken, ratio, minimum, passed });

    if (!passed) {
      failures.push({ fgToken, bgToken, ratio, minimum, reason: "contrast" });
    }
  }

  return {
    passed: failures.length === 0,
    checks,
    failures,
  };
}

function validateFocus(theme) {
  const ringColor = theme.tokens["color-focus"];
  const neighbouring = [
    theme.tokens["color-bg"],
    theme.tokens["color-surface"],
  ].filter(Boolean);

  const ratios = neighbouring.map((color) => ({
    color,
    ratio: getContrastRatio(ringColor, color),
  }));

  const contrastPassed = ratios.every(
    (entry) => entry.ratio >= WCAG.FOCUS_CONTRAST,
  );
  const widthPx = parsePx(theme.tokens["focus-ring-width"]);
  const widthPassed = widthPx >= WCAG.MIN_FOCUS_WIDTH;

  return {
    passed: contrastPassed && widthPassed,
    details: {
      ringColor,
      ratios,
      widthPx,
      minWidthPx: WCAG.MIN_FOCUS_WIDTH,
      minContrast: WCAG.FOCUS_CONTRAST,
      contrastPassed,
      widthPassed,
    },
  };
}

function validateTargetSize(theme) {
  const sizePx = parsePx(theme.tokens["min-target-size"]);
  return {
    passed: sizePx >= WCAG.MIN_TARGET_SIZE,
    warning: sizePx < WCAG.RECOMMENDED_TARGET_SIZE,
    details: {
      sizePx,
      minimum: WCAG.MIN_TARGET_SIZE,
      recommended: WCAG.RECOMMENDED_TARGET_SIZE,
    },
  };
}

function validateDefaults(catalogue) {
  const themeNames = new Set(catalogue.themes.map((theme) => theme.themeName));
  return {
    passed:
      themeNames.has(catalogue.defaults.light) &&
      themeNames.has(catalogue.defaults.dark),
    details: {
      defaults: catalogue.defaults,
      availableThemes: Array.from(themeNames),
    },
  };
}

function ensureReportDirectory() {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
}

function main() {
  console.log("Validating theme accessibility and integrity...\n");

  const catalogue = JSON.parse(fs.readFileSync(cataloguePath, "utf-8"));
  const defaultsResult = validateDefaults(catalogue);

  const reports = [];
  let hasFailure = !defaultsResult.passed;

  for (const theme of catalogue.themes) {
    const completeness = validateTokenCompleteness(theme);
    const layoutDensity = validateLayoutAndDensity(theme);
    const contrast = validateContrastPairs(theme);
    const focus = validateFocus(theme);
    const targetSize = validateTargetSize(theme);

    const passed =
      completeness.passed &&
      layoutDensity.passed &&
      contrast.passed &&
      focus.passed &&
      targetSize.passed;

    if (!passed) {
      hasFailure = true;
    }

    reports.push({
      themeName: theme.themeName,
      passed,
      checks: {
        completeness,
        layoutDensity,
        contrast,
        focus,
        targetSize,
      },
    });

    console.log(`${passed ? "PASS" : "FAIL"} ${theme.themeName}`);
  }

  const warningCount = reports.filter(
    (report) => report.checks.targetSize.warning,
  ).length;

  const report = {
    timestamp: new Date().toISOString(),
    catalogueVersion: catalogue.version,
    allPassed: !hasFailure,
    warningCount,
    defaults: defaultsResult,
    themes: reports,
  };

  ensureReportDirectory();

  fs.writeFileSync(
    path.join(reportDir, "validation-report.json"),
    JSON.stringify(report, null, 2),
  );

  console.log("\nValidation report: dist/theme/validation-report.json");

  if (hasFailure) {
    console.log("\nValidation failed. Fix issues before publishing.\n");
    process.exit(1);
  }

  if (warningCount > 0) {
    console.log(
      `\nValidation passed with ${warningCount} warning(s). Recommended target size is 44px.\n`,
    );
  } else {
    console.log("\nAll themes passed validation.\n");
  }
}

main();
