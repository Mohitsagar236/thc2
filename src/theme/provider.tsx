/**
 * React Context for Theme Management
 * Provides theme state and functions to all components
 */

import { JSX, ReactNode, useEffect, useState } from "react";
import { ThemeContextType, ThemeDefinition } from "./types";
import { ThemeContext } from "./context";
import { themeCatalogue } from "./themes";
import { applyTheme, resolveInitialTheme, cacheThemeBundle } from "./switcher";

/**
 * Theme Provider Component
 * Wrap your application root with this provider
 */
export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [currentTheme, setCurrentTheme] = useState<string>("");
  const [themes, setThemes] = useState<ThemeDefinition[]>([]);

  // Initialize theme on mount
  useEffect(() => {
    // Set available themes
    setThemes(themeCatalogue.themes);

    // Cache the bundle for CDN fallback
    cacheThemeBundle(themeCatalogue.themes);

    // Resolve initial theme
    const initialTheme = resolveInitialTheme(
      themeCatalogue.themes,
      themeCatalogue.defaults.light,
      themeCatalogue.defaults.dark,
    );

    setCurrentTheme(initialTheme);

    // Apply the resolved theme
    const themeToApply = themeCatalogue.themes.find(
      (t) => t.themeName === initialTheme,
    );
    if (themeToApply) {
      applyTheme(themeToApply);
    }
  }, []);

  /**
   * Get theme by name
   */
  const getThemeByName = (name: string): ThemeDefinition | undefined => {
    return themeCatalogue.themes.find((t) => t.themeName === name);
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
    setTheme: handleSetTheme,
    applyTheme: handleSetTheme,
    getThemeByName,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
