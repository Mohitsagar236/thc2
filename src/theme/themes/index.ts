import { lightTheme } from "./light";
import { darkTheme } from "./dark";
import { oceanTheme } from "./ocean";
import { compactTheme } from "./compact";
import { ThemeCatalogue } from "../types";

/**
 * Complete theme catalogue
 * Versioned together, published as a single unit
 * Every theme is checked against WCAG 2.2 AA criteria before publication
 */
export const themeCatalogue: ThemeCatalogue = {
  version: "1.0.0",
  timestamp: new Date().toISOString(),
  themes: [lightTheme, darkTheme, oceanTheme, compactTheme],
  defaults: {
    light: "light",
    dark: "dark",
  },
};

export { lightTheme, darkTheme, oceanTheme, compactTheme };
