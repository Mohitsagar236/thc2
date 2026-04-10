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

  // Initialize theme on mount
  useEffect(() => {
    let mounted = true;
    const unregisterLogoutCleanup = registerThemeLogoutCleanup();

    async function initializeThemeSystem(): Promise<void> {
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
    setTheme: handleSetTheme,
    applyTheme: handleSetTheme,
    getThemeByName,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
