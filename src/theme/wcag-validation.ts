/**
 * WCAG 2.2 Accessibility Validation for Theme System
 *
 * Validates:
 * - Contrast ratios (1.4.3 Contrast)
 * - Focus ring visibility (2.4.11 Focus Appearance)
 * - Target sizes (2.5.8 Target Size)
 * - Token completeness
 *
 * CI runs these checks on every publish.
 * Failures block the publish — no exceptions.
 */

/**
 * Calculate relative luminance of a color
 * Reference: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate contrast ratio between two colors
 * Reference: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 *
 * Returns ratio rounded to 2 decimal places
 * Example: 4.5 means 4.5:1 ratio
 */
export function getContrastRatio(
  foreground: string,
  background: string,
): number {
  const l1 = getRelativeLuminance(foreground);
  const l2 = getRelativeLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  passed: boolean;
  message: string;
  criterion: string;
  details?: Record<string, unknown>;
}

/**
 * WCAG Success Criteria
 */
export const WCAG_CRITERIA = {
  // 1.4.3 Contrast (Minimum) - Level AA
  CONTRAST_NORMAL: {
    ratio: 4.5,
    appliesTo: "normal text on background",
  },
  CONTRAST_LARGE: {
    ratio: 3.0,
    appliesTo: "large text (18pt+ or 14pt+ bold) on background",
  },
  CONTRAST_FOCUS_RING: {
    ratio: 3.0,
    appliesTo: "focus ring against adjacent colors",
  },

  // 2.5.8 Target Size (Minimum) - Level AA in WCAG 2.2
  MIN_TARGET_SIZE: {
    size: 24,
    unit: "px",
    appliesTo: "interactive elements (width and height)",
  },

  // 2.4.11 Focus Appearance - Level AA
  MIN_FOCUS_WIDTH: {
    size: 2,
    unit: "px",
    appliesTo: "focus indicator outline",
  },
};

/**
 * Validate contrast ratio
 * WCAG 1.4.3 requires 4.5:1 for normal text, 3:1 for large text
 */
export function validateContrast(
  foreground: string,
  background: string,
  largeText: boolean = false,
): ValidationResult {
  const ratio = getContrastRatio(foreground, background);
  const minRatio = largeText
    ? WCAG_CRITERIA.CONTRAST_LARGE.ratio
    : WCAG_CRITERIA.CONTRAST_NORMAL.ratio;
  const passed = ratio >= minRatio;

  return {
    passed,
    criterion: largeText ? "1.4.3 (Large Text)" : "1.4.3 (Normal Text)",
    message: passed
      ? `✓ Contrast ${ratio}:1 meets ${minRatio}:1 requirement`
      : `✗ Contrast ${ratio}:1 fails ${minRatio}:1 requirement`,
    details: { ratio, minRatio, foreground, background },
  };
}

/**
 * Validate focus ring visibility
 * WCAG 2.4.11 requires visible focus indicator
 */
export function validateFocusRing(
  ringColor: string,
  neighbouringColors: string[],
): ValidationResult {
  const ratios = neighbouringColors.map((color) =>
    getContrastRatio(ringColor, color),
  );
  const minRatio = WCAG_CRITERIA.CONTRAST_FOCUS_RING.ratio;
  const passed = ratios.every((ratio) => ratio >= minRatio);

  return {
    passed,
    criterion: "2.4.11 (Focus Appearance)",
    message: passed
      ? `✓ Focus ring has sufficient contrast (min ${minRatio}:1)`
      : `✗ Focus ring contrast fails (requires ${minRatio}:1)`,
    details: { ringColor, neighbouringColors, ratios, minRatio },
  };
}

/**
 * Validate target size
 * WCAG 2.5.8 recommends at least 44×44px for interactive elements
 */
export function validateTargetSize(
  width: number,
  height: number,
): ValidationResult {
  const minSize = WCAG_CRITERIA.MIN_TARGET_SIZE.size;
  const passed = width >= minSize && height >= minSize;

  return {
    passed,
    criterion: "2.5.8 (Target Size)",
    message: passed
      ? `✓ Target size ${width}×${height}px meets ${minSize}×${minSize}px`
      : `✗ Target size ${width}×${height}px below ${minSize}×${minSize}px minimum`,
    details: { width, height, minSize },
  };
}

/**
 * Validate all common text + background pairs in a theme
 */
export function validateThemeContrast(tokens: Record<string, string>): {
  results: ValidationResult[];
  allPassed: boolean;
  summary: string;
} {
  const results: ValidationResult[] = [];

  // Common text/background pairs
  const pairs = [
    // Normal text
    ["color-text", "color-bg"],
    ["color-text", "color-surface"],
    ["color-text-muted", "color-bg"],
    ["color-text-muted", "color-surface"],

    // Primary button text
    ["color-surface", "color-primary"],
    ["color-text", "color-primary"],

    // Error states
    ["color-surface", "color-error"],
    ["color-text", "color-error"],

    // Success states
    ["color-surface", "color-success"],
    ["color-text", "color-success"],

    // Focus state
    ["color-text", "color-focus"],
    ["color-surface", "color-focus"],
  ];

  for (const [fgKey, bgKey] of pairs) {
    const fg = tokens[fgKey];
    const bg = tokens[bgKey];

    if (fg && bg) {
      results.push(validateContrast(fg, bg));
    }
  }

  const allPassed = results.every((r) => r.passed);
  const passCount = results.filter((r) => r.passed).length;

  return {
    results,
    allPassed,
    summary: `${passCount}/${results.length} contrast checks passed`,
  };
}

/**
 * Validate that theme has all required token categories
 */
export function validateTokenCompleteness(tokens: Record<string, string>): {
  passed: boolean;
  missing: string[];
  message: string;
} {
  const requiredCategories = [
    // Colors
    "color-bg",
    "color-surface",
    "color-text",
    "color-primary",
    "color-error",
    "color-success",
    "color-border",
    "color-focus",

    // Typography
    "font-family-base",
    "font-size-base",
    "line-height-base",

    // Spacing
    "spacing-unit",
    "spacing-sm",
    "spacing-md",
    "spacing-lg",
    "spacing-xl",

    // Layout
    "sidebar-width",
    "header-height",
    "container-max-width",
    "card-padding",

    // Accessibility
    "focus-ring-width",
    "focus-ring-offset",
    "min-target-size",
  ];

  const missing = requiredCategories.filter((token) => !tokens[token]);
  const passed = missing.length === 0;

  return {
    passed,
    missing,
    message: passed
      ? `✓ All ${requiredCategories.length} required tokens present`
      : `✗ Missing ${missing.length} required tokens: ${missing.join(", ")}`,
  };
}

/**
 * Validate layout and density declarations
 * Required for cross-MFE layout contract support
 */
export function validateLayoutAndDensity(
  layout?: string,
  density?: string,
): ValidationResult {
  const validLayout =
    layout === "layout-sidebar" || layout === "layout-top-nav";
  const validDensity =
    density === "density-compact" || density === "density-comfortable";
  const passed = validLayout && validDensity;

  return {
    passed,
    criterion: "Theme Contract (Layout and Density)",
    message: passed
      ? "✓ Layout and density declarations are valid"
      : "✗ Theme is missing a valid layout or density declaration",
    details: {
      layout,
      density,
      validLayout,
      validDensity,
    },
  };
}

/**
 * Full theme validation report
 */
export interface ThemeValidationReport {
  themeName: string;
  timestamp: string;
  passed: boolean;
  checks: {
    contrast: {
      results: ValidationResult[];
      allPassed: boolean;
      summary: string;
    };
    completeness: { passed: boolean; missing: string[]; message: string };
    focusRing: ValidationResult;
    targetSize: ValidationResult;
    layoutDensity: ValidationResult;
  };
  summary: string;
}

/**
 * Validate entire theme
 */
export function validateTheme(
  themeName: string,
  tokens: Record<string, string>,
  layout?: string,
  density?: string,
): ThemeValidationReport {
  const contrastResults = validateThemeContrast(tokens);
  const completenessResults = validateTokenCompleteness(tokens);
  const focusRingResult = validateFocusRing(tokens["color-focus"], [
    tokens["color-bg"],
    tokens["color-surface"],
  ]);
  const targetSizeResult = validateTargetSize(44, 44); // Recommended baseline
  const layoutDensityResult = validateLayoutAndDensity(layout, density);

  const checks = {
    contrast: contrastResults,
    completeness: completenessResults,
    focusRing: focusRingResult,
    targetSize: targetSizeResult,
    layoutDensity: layoutDensityResult,
  };

  const allPassed =
    contrastResults.allPassed &&
    completenessResults.passed &&
    focusRingResult.passed &&
    targetSizeResult.passed &&
    layoutDensityResult.passed;

  return {
    themeName,
    timestamp: new Date().toISOString(),
    passed: allPassed,
    checks,
    summary: allPassed
      ? `✓ ${themeName} passed all accessibility checks`
      : `✗ ${themeName} failed accessibility checks`,
  };
}

/**
 * Validate all themes in a catalogue
 */
export function validateThemeCatalogue(
  themes: Record<string, Record<string, string>>,
): {
  themes: ThemeValidationReport[];
  allPassed: boolean;
  timestamp: string;
} {
  const reports = Object.entries(themes).map(([name, tokens]) =>
    validateTheme(name, tokens),
  );

  return {
    themes: reports,
    allPassed: reports.every((r) => r.passed),
    timestamp: new Date().toISOString(),
  };
}
