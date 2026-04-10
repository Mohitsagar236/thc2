import { ThemeCatalogue, ThemeDefinition } from "./types";
import { getCachedThemeBundle } from "./switcher";

const THEME_GLOBAL_KEY = "__THEME_CATALOGUE__";
const STABLE_BUNDLE_PATH = "/themes/stable/all-themes.js";
const DEFAULT_BUNDLE_URL =
  import.meta.env.VITE_THEME_STABLE_URL || STABLE_BUNDLE_PATH;
const BUNDLE_LOAD_TIMEOUT_MS = Number(
  import.meta.env.VITE_THEME_BUNDLE_TIMEOUT_MS || 6000,
);

export type ThemeCatalogueSource =
  | "global"
  | "cdn"
  | "local-cache"
  | "embedded";

interface ThemeCatalogueLoadResult {
  catalogue: ThemeCatalogue;
  source: ThemeCatalogueSource;
}

interface ThemeWindow extends Window {
  __THEME_CATALOGUE__?: unknown;
}

function isThemeDefinition(value: unknown): value is ThemeDefinition {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as {
    themeName?: unknown;
    meta?: unknown;
    tokens?: unknown;
    layout?: unknown;
    density?: unknown;
  };

  const hasValidLayout =
    candidate.layout === "layout-sidebar" ||
    candidate.layout === "layout-top-nav";
  const hasValidDensity =
    candidate.density === "density-compact" ||
    candidate.density === "density-comfortable";

  return (
    typeof candidate.themeName === "string" &&
    candidate.meta !== null &&
    typeof candidate.meta === "object" &&
    candidate.tokens !== null &&
    typeof candidate.tokens === "object" &&
    hasValidLayout &&
    hasValidDensity
  );
}

function isStableThemeBundleUrl(url: string): boolean {
  return /\/themes\/stable\/all-themes\.js(?:$|[?#])/i.test(url);
}

function normalizeThemeList(rawThemes: unknown): ThemeDefinition[] {
  if (Array.isArray(rawThemes)) {
    return rawThemes.filter(isThemeDefinition);
  }

  if (rawThemes && typeof rawThemes === "object") {
    return Object.values(rawThemes).filter(isThemeDefinition);
  }

  return [];
}

function hasTheme(themes: ThemeDefinition[], themeName: string): boolean {
  return themes.some((theme) => theme.themeName === themeName);
}

function normalizeCatalogue(
  rawCatalogue: unknown,
  fallback: ThemeCatalogue,
): ThemeCatalogue | null {
  if (Array.isArray(rawCatalogue)) {
    const themes = normalizeThemeList(rawCatalogue);
    if (!themes.length) {
      return null;
    }

    return {
      version: fallback.version,
      timestamp: new Date().toISOString(),
      themes,
      defaults: { ...fallback.defaults },
    };
  }

  if (!rawCatalogue || typeof rawCatalogue !== "object") {
    return null;
  }

  const candidate = rawCatalogue as {
    version?: unknown;
    timestamp?: unknown;
    defaults?: unknown;
    themes?: unknown;
  };

  const themes = normalizeThemeList(candidate.themes);
  if (!themes.length) {
    return null;
  }

  const rawDefaults =
    candidate.defaults && typeof candidate.defaults === "object"
      ? (candidate.defaults as { light?: unknown; dark?: unknown })
      : undefined;

  const proposedLight =
    typeof rawDefaults?.light === "string"
      ? rawDefaults.light
      : fallback.defaults.light;
  const proposedDark =
    typeof rawDefaults?.dark === "string"
      ? rawDefaults.dark
      : fallback.defaults.dark;

  return {
    version:
      typeof candidate.version === "string"
        ? candidate.version
        : fallback.version,
    timestamp:
      typeof candidate.timestamp === "string"
        ? candidate.timestamp
        : new Date().toISOString(),
    themes,
    defaults: {
      light: hasTheme(themes, proposedLight)
        ? proposedLight
        : fallback.defaults.light,
      dark: hasTheme(themes, proposedDark)
        ? proposedDark
        : fallback.defaults.dark,
    },
  };
}

function getGlobalThemeCatalogue(
  fallback: ThemeCatalogue,
): ThemeCatalogue | null {
  const globalCatalogue = (window as ThemeWindow)[THEME_GLOBAL_KEY];
  return normalizeCatalogue(globalCatalogue, fallback);
}

function ensureThemeScript(url: string, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingScripts = Array.from(
      document.querySelectorAll("script[data-theme-bundle-url]"),
    ) as HTMLScriptElement[];

    const existing =
      existingScripts.find((script) => script.dataset.themeBundleUrl === url) ||
      null;

    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");
    script.src = url;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.themeBundleUrl = url;

    const cleanup = () => {
      if (timeoutHandle) {
        window.clearTimeout(timeoutHandle);
      }
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    const onLoad = () => {
      script.dataset.loaded = "true";
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error(`Failed to load theme bundle from ${url}`));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    const timeoutHandle = window.setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out loading theme bundle from ${url}`));
    }, timeoutMs);

    if (!existing) {
      document.head.appendChild(script);
    }
  });
}

async function getCDNThemeCatalogue(
  fallback: ThemeCatalogue,
): Promise<ThemeCatalogue | null> {
  const bundleUrl = getThemeBundleUrl();

  try {
    await ensureThemeScript(bundleUrl, BUNDLE_LOAD_TIMEOUT_MS);
  } catch {
    return null;
  }

  return getGlobalThemeCatalogue(fallback);
}

export async function loadThemeCatalogue(
  fallback: ThemeCatalogue,
): Promise<ThemeCatalogueLoadResult> {
  const globalCatalogue = getGlobalThemeCatalogue(fallback);
  if (globalCatalogue) {
    return { catalogue: globalCatalogue, source: "global" };
  }

  const cdnCatalogue = await getCDNThemeCatalogue(fallback);
  if (cdnCatalogue) {
    return { catalogue: cdnCatalogue, source: "cdn" };
  }

  const cachedCatalogue = getCachedThemeBundle();
  const normalizedCached = cachedCatalogue
    ? normalizeCatalogue(cachedCatalogue, fallback)
    : null;

  if (normalizedCached) {
    return { catalogue: normalizedCached, source: "local-cache" };
  }

  return { catalogue: fallback, source: "embedded" };
}

export function getThemeBundleUrl(): string {
  if (!isStableThemeBundleUrl(DEFAULT_BUNDLE_URL)) {
    console.warn(
      `Theme bundle URL should point to a stable endpoint. Falling back to ${STABLE_BUNDLE_PATH}. Received: ${DEFAULT_BUNDLE_URL}`,
    );

    return STABLE_BUNDLE_PATH;
  }

  return DEFAULT_BUNDLE_URL;
}
