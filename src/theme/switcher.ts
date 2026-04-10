/**
 * Runtime Theme Switcher
 * Applies theme by setting CSS custom properties and classes
 * No network call at switch time - all themes are pre-loaded
 */

import { ThemeDefinition, ColorScheme, ThemeCatalogue } from "./types";

const THEME_PREFERENCE_KEY = "ctms:theme-preference";
const TOKEN_CACHE_KEY = "ctms:token-cache";
const LOGOUT_EVENT_NAME = "ctms:logout";

export const THEME_STORAGE_KEYS = {
  preference: THEME_PREFERENCE_KEY,
  tokenCache: TOKEN_CACHE_KEY,
} as const;

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

function isDarkTheme(theme: ThemeDefinition): boolean {
  const background = theme.tokens["color-bg"];
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(background);

  if (!match) {
    return theme.themeName.toLowerCase().includes("dark");
  }

  const [r, g, b] = [
    parseInt(match[1], 16) / 255,
    parseInt(match[2], 16) / 255,
    parseInt(match[3], 16) / 255,
  ];

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.45;
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
function dispatchThemeChangeEvent(theme: ThemeDefinition): void {
  const event = new CustomEvent("theme-changed", {
    detail: {
      themeName: theme.themeName,
      layout: theme.layout,
      density: theme.density,
    },
    bubbles: true,
    composed: true,
    cancelable: false,
  });
  window.dispatchEvent(event);
}

/**
 * Apply a theme atomically - CSS vars, layout classes, and event dispatched together
 */
export function applyTheme(theme: ThemeDefinition): void {
  const root = document.documentElement;

  // Apply CSS variables
  applyCSSVariables(theme);

  root.dataset.theme = isDarkTheme(theme) ? "dark" : "light";
  root.style.colorScheme = root.dataset.theme;

  // Apply layout and density classes
  applyLayoutAndDensity(theme);

  // Save preference to localStorage
  try {
    localStorage.setItem(THEME_PREFERENCE_KEY, theme.themeName);
  } catch {
    console.warn("Failed to save theme preference to localStorage");
  }

  // Dispatch event for MFEs
  dispatchThemeChangeEvent(theme);
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
export function cacheThemeBundle(catalogue: ThemeCatalogue): void {
  try {
    localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify(catalogue));
  } catch {
    console.warn("Failed to cache theme bundle");
  }
}

/**
 * Retrieve cached theme bundle
 */
export function getCachedThemeBundle(): ThemeCatalogue | null {
  try {
    const cached = localStorage.getItem(TOKEN_CACHE_KEY);
    return cached ? (JSON.parse(cached) as ThemeCatalogue) : null;
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

/**
 * Register a logout handler that clears cached bundle data
 * Host applications can dispatch window event "ctms:logout" on sign-out
 */
export function registerThemeLogoutCleanup(): () => void {
  const handler = () => {
    clearThemeCache();
  };

  window.addEventListener(LOGOUT_EVENT_NAME, handler);

  return () => {
    window.removeEventListener(LOGOUT_EVENT_NAME, handler);
  };
}
