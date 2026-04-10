import rawCatalogue from "./catalogue.json";
import { ThemeCatalogue, ThemeDefinition } from "../types";

/**
 * Complete theme catalogue
 * Versioned together, published as a single unit
 * Every theme is checked against WCAG 2.2 AA criteria before publication
 */
const fallbackTimestamp = new Date().toISOString();

export const themeCatalogue: ThemeCatalogue = {
  version: rawCatalogue.version,
  timestamp: rawCatalogue.timestamp || fallbackTimestamp,
  themes: rawCatalogue.themes as ThemeDefinition[],
  defaults: rawCatalogue.defaults,
};

export const lightTheme =
  themeCatalogue.themes.find((theme) => theme.themeName === "light") ||
  themeCatalogue.themes[0];

export const darkTheme =
  themeCatalogue.themes.find((theme) => theme.themeName === "dark") ||
  themeCatalogue.themes[0];

export const oceanTheme =
  themeCatalogue.themes.find((theme) => theme.themeName === "ocean") ||
  themeCatalogue.themes[0];

export const compactTheme =
  themeCatalogue.themes.find((theme) => theme.themeName === "light-compact") ||
  themeCatalogue.themes[0];
