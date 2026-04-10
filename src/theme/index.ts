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
} from "./switcher";

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
