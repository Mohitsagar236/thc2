/**
 * Runtime Theme Switcher
 * Applies theme by setting CSS custom properties and classes
 * No network call at switch time - all themes are pre-loaded
 */

import { ThemeDefinition, ColorScheme } from "./types";

const THEME_PREFERENCE_KEY = "ctms:theme-preference";
const TOKEN_CACHE_KEY = "ctms:token-cache";

/**
 * Apply CSS custom properties to document root
 */
function applyCSSVariables(theme: ThemeDefinition): void {
  const root = document.documentElement;

  Object.entries(theme.tokens).forEach(([tokenName, value]) => {
    // Convert token-name format to --token-name format
    const cssVarName = `--${tokenName}`;
    root.style.setProperty(cssVarName, value);
  });
}

/**
 * Apply layout and density classes to body
 */
function applyLayoutAndDensity(theme: ThemeDefinition): void {
  const body = document.body;

  // Remove all layout classes
  Array.from(body.classList)
    .filter((cls) => cls.startsWith("layout-"))
    .forEach((cls) => body.classList.remove(cls));

  // Remove all density classes
  Array.from(body.classList)
    .filter((cls) => cls.startsWith("density-"))
    .forEach((cls) => body.classList.remove(cls));

  // Apply new layout class
  if (theme.layout) {
    body.classList.add(theme.layout);
  }

  // Apply new density class
  if (theme.density) {
    body.classList.add(theme.density);
  }
}

/**
 * Dispatch custom event for MFEs that need programmatic reaction
 */
function dispatchThemeChangeEvent(themeName: string): void {
  const event = new CustomEvent("theme-changed", {
    detail: { themeName },
    bubbles: true,
    cancelable: false,
  });
  window.dispatchEvent(event);
}

/**
 * Apply a theme atomically - CSS vars, layout classes, and event dispatched together
 */
export function applyTheme(theme: ThemeDefinition): void {
  // Apply CSS variables
  applyCSSVariables(theme);

  // Apply layout and density classes
  applyLayoutAndDensity(theme);

  // Save preference to localStorage
  try {
    localStorage.setItem(THEME_PREFERENCE_KEY, theme.themeName);
  } catch {
    console.warn("Failed to save theme preference to localStorage");
  }

  // Dispatch event for MFEs
  dispatchThemeChangeEvent(theme.themeName);
}

/**
 * Get saved theme preference from localStorage
 */
export function getSavedThemePreference(): string | null {
  try {
    return localStorage.getItem(THEME_PREFERENCE_KEY);
  } catch {
    return null;
  }
}

/**
 * Resolve active theme on startup
 * Order: saved preference → OS preference → default light
 */
export function resolveInitialTheme(
  availableThemes: { themeName: string }[],
  lightDefault: string,
  darkDefault: string,
): string {
  // 1. Check localStorage for saved preference
  const saved = getSavedThemePreference();
  if (saved && availableThemes.some((t) => t.themeName === saved)) {
    return saved;
  }

  // 2. Check OS-level prefers-color-scheme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const osPreference = prefersDark ? darkDefault : lightDefault;

  if (availableThemes.some((t) => t.themeName === osPreference)) {
    return osPreference;
  }

  // 3. Fall back to light default
  return lightDefault;
}

/**
 * Detect OS color scheme preference
 */
export function getOSColorScheme(): ColorScheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Listen for OS color scheme changes
 */
export function onOSColorSchemeChange(
  callback: (scheme: ColorScheme) => void,
): () => void {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handler);

  // Return unsubscribe function
  return () => {
    mediaQuery.removeEventListener("change", handler);
  };
}

/**
 * Cache theme bundle in localStorage for cold load fallback
 */
export function cacheThemeBundle(themes: ThemeDefinition[]): void {
  try {
    localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(themes));
  } catch {
    console.warn("Failed to cache theme bundle");
  }
}

/**
 * Retrieve cached theme bundle
 */
export function getCachedThemeBundle(): ThemeDefinition[] | null {
  try {
    const cached = localStorage.getItem(TOKEN_CACHE_KEY);
    return cached ? (JSON.parse(cached) as ThemeDefinition[]) : null;
  } catch {
    return null;
  }
}

/**
 * Clear theme cache on logout
 */
export function clearThemeCache(): void {
  try {
    localStorage.removeItem(TOKEN_CACHE_KEY);
  } catch {
    console.warn("Failed to clear theme cache");
  }
}
