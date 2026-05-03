/**
 * Theme System - Public API
 * Re-exports all necessary utilities and hooks
 */

// Types
export type {
  ThemeTokens,
  ThemeMeta,
  ThemeDefinition,
  ThemeCatalogue,
  ThemeContextType,
  ColorScheme,
} from "./types";

export type {
  AppearanceSyncDetail,
  AppearanceSyncSource,
  LayoutVariant,
  DensityVariant,
} from "./mfe-sync";

// Provider
export { ThemeProvider } from "./provider";

// Context
export { ThemeContext } from "./context";

// Hooks
export { useTheme } from "./hooks/useTheme";

// Switcher utilities
export {
  applyTheme,
  getSavedThemePreference,
  resolveInitialTheme,
  getOSColorScheme,
  onOSColorSchemeChange,
  cacheThemeBundle,
  getCachedThemeBundle,
  clearThemeCache,
  registerThemeLogoutCleanup,
  THEME_STORAGE_KEYS,
} from "./switcher";

export {
  THEME_SYNC_EVENT_NAME,
  getCurrentLayoutVariant,
  getCurrentDensityVariant,
  dispatchAppearanceSync,
  subscribeToAppearanceSync,
} from "./mfe-sync";

// Theme bundle loader
export { loadThemeCatalogue, getThemeBundleUrl } from "./loader";
export type { ThemeCatalogueSource } from "./loader";

// Styles
export { injectThemeStyles, getSpacing, getColor, getFontSize } from "./styles";

// Themes
export {
  themeCatalogue,
  lightTheme,
  darkTheme,
  oceanTheme,
  compactTheme,
} from "./themes";

// WCAG Accessibility Validation
export {
  getRelativeLuminance,
  getContrastRatio,
  WCAG_CRITERIA,
  validateContrast,
  validateFocusRing,
  validateTargetSize,
  validateThemeContrast,
  validateTokenCompleteness,
  validateLayoutAndDensity,
  validateTheme,
  validateThemeCatalogue,
} from "./wcag-validation";

export type {
  ValidationResult,
  ThemeValidationReport,
} from "./wcag-validation";

// Versioning & Distribution
export {
  parseVersion,
  compareVersions,
  isCompatible,
  satisfiesConstraint,
  DIST_TAG_COMMANDS,
  BUNDLE_THRESHOLDS,
  validateBundleSize,
  getDistTag,
} from "./versioning";
