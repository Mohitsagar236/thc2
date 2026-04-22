/**
 * React Context for Theme Management
 * Provides theme state and functions to all components
 */

import { JSX, ReactNode, useEffect, useState } from "react";
import { ThemeContextType, ThemeDefinition } from "./types";
import { ThemeContext } from "./context";
import { themeCatalogue } from "./themes";
import {
  applyTheme,
  resolveInitialTheme,
  cacheThemeBundle,
  registerThemeLogoutCleanup,
} from "./switcher";
import { loadThemeCatalogue } from "./loader";
import type { ThemeCatalogueSource } from "./loader";

/**
 * Theme Provider Component
 * Wrap your application root with this provider
 */
export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [currentTheme, setCurrentTheme] = useState<string>(
    themeCatalogue.defaults.light,
  );
  const [themes, setThemes] = useState<ThemeDefinition[]>(
    themeCatalogue.themes,
  );
  const [catalogueVersion, setCatalogueVersion] = useState<string>(
    themeCatalogue.version,
  );
  const [catalogueSource, setCatalogueSource] =
    useState<ThemeCatalogueSource>("embedded");
  const [isReady, setIsReady] = useState<boolean>(false);

  // Initialize theme on mount
  useEffect(() => {
    let mounted = true;
    const unregisterLogoutCleanup = registerThemeLogoutCleanup();

    async function initializeThemeSystem(): Promise<void> {
      try {
        const loaded = await loadThemeCatalogue(themeCatalogue);
        if (!mounted) {
          return;
        }

        setThemes(loaded.catalogue.themes);
        setCatalogueVersion(loaded.catalogue.version);
        setCatalogueSource(loaded.source);

        // Cache the latest bundle for CDN fallback
        cacheThemeBundle(loaded.catalogue);

        const initialTheme = resolveInitialTheme(
          loaded.catalogue.themes,
          loaded.catalogue.defaults.light,
          loaded.catalogue.defaults.dark,
        );

        setCurrentTheme(initialTheme);

        const themeToApply = loaded.catalogue.themes.find(
          (theme) => theme.themeName === initialTheme,
        );

        if (themeToApply) {
          applyTheme(themeToApply);
        }
      } catch (error) {
        console.error("Theme initialization failed", error);
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    void initializeThemeSystem();

    return () => {
      mounted = false;
      unregisterLogoutCleanup();
    };
  }, []);

  /**
   * Get theme by name
   */
  const getThemeByName = (name: string): ThemeDefinition | undefined => {
    return themes.find((theme) => theme.themeName === name);
  };

  /**
   * Switch to a different theme
   */
  const handleSetTheme = (themeName: string): void => {
    const theme = getThemeByName(themeName);
    if (theme) {
      applyTheme(theme);
      setCurrentTheme(themeName);
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    themes,
    catalogueVersion,
    catalogueSource,
    isReady,
    setTheme: handleSetTheme,
    applyTheme: handleSetTheme,
    getThemeByName,
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Initializing theme system
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900">
              Preparing a stable experience...
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Loading the theme catalogue and applying design tokens before the
              interface renders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
